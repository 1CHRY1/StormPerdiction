from scipy.io import loadmat
import json
import netCDF4 as nc
import sqlite3
import os
import schedule
import time
from datetime import datetime, timedelta

def getStationInfo():
    # 获取所有站点信息
    filePath = "station.json"
    with open(filePath, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def ReadMatfile(filePath):
    # 读取mat文件
    matData = loadmat(filePath)
    return matData

def JudgeIfTyph(filePath):
    # 判断是否有台风
    with open(filePath, 'r') as file:
        content = file.read().strip()
    if (content == 1 or content == "1" ):
        return True
    else:
        return False

def insert_typhdata(db_path, name, time, addwind, hyubao, manual):
    # 插入有台风数据
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
            INSERT INTO {name} ( updatetime, time, iftyph, addwind, hyubao, manual )
            VALUES ('{updatetime}', '{time}', '1', '{addwind}','{hyubao}', '{manual}')
        ''')
    conn.commit()
    conn.close()

def insert_Nottyphdata(db_path, name, time, addwind, hpre, manual):
    # 插入无台风数据
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
            INSERT INTO {name} ( updatetime, time, iftyph, addwind, hpre, manual )
            VALUES ('{updatetime}', '{time}', '0', '{addwind}', '{hpre}', '{manual}')
        ''')
    conn.commit()
    conn.close()

def list_process(hpre):
    data = hpre
    return data

def insert_hzdata(db_path, name, time, hz_value):
    # 插入站点详细数据
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
                INSERT INTO {name} ( updatetime, time, hz_value )
                VALUES ('{updatetime}', '{time}', '{hz_value}')
            ''')
    conn.commit()
    conn.close()

def get_hzdata(hz, start_time):
    result = []
    # 倒推数组长度的时间单位
    for i in range(len(hz)):
        # 计算当前时间戳
        current_time = start_time - timedelta(hours=i)
        # 添加时间戳和对应的潮位值到结果数组中
        result.append([current_time.strftime("%Y-%m-%d %H:%M:%S"), hz[i][0]])  # 将datetime对象转换为字符串
    result.reverse()
    return result

def get_DBhzlen(db_path, name):
    # 获取已有的hz数据
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(f"SELECT COUNT(*) FROM {name}")
    len = cursor.fetchone()[0]
    conn.close()
    return len

def insert_NCdata(db_path, time, type, path, name, manual):
    # 插入nc数据
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
                INSERT INTO NC ( updatetime, time, type, path, name, manual )
                VALUES ('{updatetime}', '{time}', '{type}', '{path}', '{name}', '{manual}')
            ''')
    conn.commit()
    conn.close()

def get_prefix_before_digits(input_str):
    # 获取数字前的所有字符
    prefix = ""
    for char in input_str:
        if char.isdigit():
            break
        prefix += char
    return prefix

def main():
    db_path_Forcasting = os.getcwd() + '/Forcasting.db'
    db_path_NC = os.getcwd() + '/NC.db'
    folderPath = os.pardir
    folders = os.listdir(folderPath)
    for folder in folders:
        current_time = datetime.now().strftime("%Y%m%d")
        if (len(folder) != 8 or folder != current_time):
            continue
        Path = folderPath + "//" + folder
        manual = 0
        try:
            txtPath = os.path.join(Path, "ifTyph.txt")
            if (JudgeIfTyph(txtPath) == True):
                # 存在台风
                files = os.listdir(Path)
                for file in files:
                    # 获取站点名称
                    name = os.path.splitext(file)[0]
                    # 处理mat数据
                    if file.endswith(".mat"):
                        # 去掉尾部数字
                        name = get_prefix_before_digits(name)
                        # 判断是否是以addwind结尾
                        if name.endswith("addwind"):
                            addwind = 1
                            name = name[:-len("addwind")]
                        else:
                            addwind = 0
                        mat_path = os.path.join(Path, file)
                        mat_data = loadmat(mat_path)
                        try:
                            hyubao = mat_data['hyubao']
                            # 将预报数据存入数据库
                            insert_typhdata(db_path_Forcasting, name, time, addwind, hyubao, manual)
                        except Exception as e:
                            print(e)
                    # 处理nc数据
                    if file.endswith(".nc"):
                        if name == "adcirc_addwind":
                            type = "adcirc"
                        elif name == "fort.63_nowind":
                            type = "fort63"
                        elif name == "fort.64_nowind":
                            type = "fort64"
                        elif name == "fort.74_nowind":
                            type = "fort74"
                        else:
                            continue
                        path = os.path.abspath(file)
                        filename = os.path.basename(file)
                        insert_NCdata(db_path_NC, time, type, path, filename, manual)

            else:
                # 不存在台风
                files = os.listdir(Path)
                for file in files:
                    # 处理mat数据
                    if file.endswith(".mat"):
                        # 获取站点名称
                        name = os.path.splitext(file)[0]
                        # 去掉尾部数字
                        name = get_prefix_before_digits(name)
                        # 判断是否是以addwind结尾
                        if name.endswith("addwind"):
                            addwind = 1
                            name = name[:-len("addwind")]
                        else:
                            addwind = 0
                        mat_path = os.path.join(Path, file)
                        mat_data = loadmat(mat_path)
                        try:
                            hpre = list_process(mat_data['hpre'])
                            hz = mat_data['hz']
                            # 将预报数据存入数据库
                            insert_Nottyphdata(db_path_Forcasting, name, time, addwind, hpre, manual)
                            # 处理站点所有潮位数据
                            name_hz = name + "_hz"
                            hz_dblen = get_DBhzlen(db_path_Forcasting, name_hz)
                            hz_data = get_hzdata(hz,time)[hz_dblen:]
                            for hz_value in hz_data:
                                insert_hzdata(db_path_Forcasting, name_hz, hz_value[0], hz_value[1])
                        except Exception as e:
                            print(e)
                    # 处理nc数据
                    if file.endswith(".nc"):
                        if name == "adcirc_addwind":
                            type = "adcirc"
                        elif name == "fort.63_nowind":
                            type = "fort63"
                        elif name == "fort.64_nowind":
                            type = "fort64"
                        elif name == "fort.74_nowind":
                            type = "fort74"
                        else:
                            continue
                        path = os.path.abspath(file)
                        filename = os.path.basename(file)
                        insert_NCdata(db_path_NC, time, type, path, filename, manual)

        # except Exception as e:
        #     print(e)
        except:
            continue

if __name__ == "__main__":
    main()