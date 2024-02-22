from scipy.io import loadmat
import json
import netCDF4 as nc
import sqlite3
import os
import schedule
import time
from datetime import datetime

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

def insert_Nottyphdata(db_path, name, time, addwind, hpre, hz, manual):
    # 插入无台风数据
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
            INSERT INTO {name} ( updatetime, time, iftyph, addwind, hpre, hz, manual )
            VALUES ('{updatetime}', '{time}', '0', '{addwind}', '{hpre}', '{hz}', '{manual}')
        ''')
    conn.commit()
    conn.close()

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
    # folderPath = os.path.join(os.pardir,"forecastData")
    folderPath = os.pardir
    folders = os.listdir(folderPath)
    for folder in folders:
        # 遍历每个文件夹中的数据
        Path = folderPath + "//" + folder
        # 获取数据时间
        if ( len(folder)==8 ):
            # 数据时间非手动计算
            time = datetime.strptime(folder, "%Y%m%d")
            manual = 0
        else:
            # 数据时间为手动计算
            time = datetime.strptime(folder, "%Y%m%d_%H:%M")
            manual = 1
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
                            hpre = mat_data['hpre']
                            hz = mat_data['hz']
                            # 将预报数据和前期所有数据存入数据库
                            insert_Nottyphdata(db_path_Forcasting, name, time, addwind, hpre, hz, manual)
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