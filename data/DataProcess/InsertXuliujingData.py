import sys

from scipy.io import loadmat
import json
import netCDF4 as nc
import sqlite3
import os
import schedule
import time
from datetime import datetime, timedelta

def JudgeIfTyph(filePath):
    # 判断是否有台风
    with open(filePath, 'r') as file:
        content = file.read().strip()
    if (content == 1 or content == "1" ):
        return True
    else:
        return False

def insert_typhdata(db_path, name, time, hpre, hyubao, hadd, manual):
    # 插入有台风数据
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
            INSERT INTO {name} ( updatetime, time, iftyph, hpre, hyubao, hadd, manual )
            VALUES ('{updatetime}', '{time}', '1', '{hpre}', '{hyubao}', '{hadd}', '{manual}')
        ''')
    conn.commit()
    conn.close()

def insert_Nottyphdata(db_path, name, time,hpre, hshice, hybresult, manual):
    # 插入无台风数据
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
            INSERT INTO {name} ( updatetime, time, iftyph, hpre, hshice, hybresult, manual )
            VALUES ('{updatetime}', '{time}', '0', '{hpre}', '{hshice}', '{hybresult}', '{manual}')
        ''')
    conn.commit()
    conn.close()

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

def nc2array(filepath):
    # 将nc数据读取为array'
    ncfile = nc.Dataset(filepath, "r", format='NETCDF3_CLASSIC')
    zeta = ncfile["zeta"][:]
    return zeta

def getZetaFromArray(array, stations):
    result = []
    for name, info in stations.items():
        row = info.get("row")
        data = array[:,row]
        result.append({"name":name, "data":data})
    return result


def list_process(hpre):
    data = []
    for item in hpre:
        data.append(item[0])
    return data


def get_hzdata(hz, start_time):
    result = []
    start_time = start_time + timedelta(days=1)
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

def insert_iftyph(db_path, time, iftyph, manuel):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
                    INSERT INTO typh ( updatetime, time, iftyph, manuel )
                    VALUES ('{updatetime}', '{time}', '{iftyph}', '{manuel}' )
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

# dataprocess_path = "D:/1study/Work/2023_12_22_Storm/stormPerdiction/data/DataProcess"

def main():
    args = sys.argv
    if len(args) < 2:
        print("未传入正确数量参数")
        sys.exit(1)
    dataprocess_path = args[1]
    db_path_Forcasting = dataprocess_path + '/Forcasting.db'
    db_path_NC = dataprocess_path + '/NC.db'
    stations_path = dataprocess_path + '/station.json'
    with open(stations_path, 'r', encoding='utf-8') as file:
        stations = json.load(file)
    folderPath = os.path.dirname(dataprocess_path) + "/forecastData"
    folderPath = folderPath.replace(os.sep, '/')
    folders = os.listdir(folderPath)
    for folder in folders:
        current_time = datetime.now().strftime("%Y%m%d")
        if (len(folder) != 8 or folder != current_time):
            continue
        Path = folderPath + "/" + folder
        print("****************" + folder + " begin!" + "****************")
        time = datetime.strptime(folder, "%Y%m%d")
        manual = 0
        try:
            txtPath = os.path.join(Path, "ifTyph.txt")
            if (JudgeIfTyph(txtPath) == True):
                # 存在台风
                files = os.listdir(Path)
                hyubao = []
                hpre = []
                for file in files:
                    # 文件名称
                    name = os.path.splitext(file)[0]
                    # # 处理mat数据
                    # if file.endswith(".mat"):
                    #     # 去掉尾部数字
                    #     name = get_prefix_before_digits(name)
                    #     # 判断是否是以addwind结尾
                    #     if name.endswith("addwind"):
                    #         addwind = 1
                    #         name = name[:-len("addwind")]
                    #     else:
                    #         addwind = 0
                    #     mat_path = os.path.join(Path, file)
                    #     mat_data = loadmat(mat_path)
                    #     try:
                    #         hyubao = mat_data['hyubao']
                    #         # 将预报数据存入数据库
                    #         insert_typhdata(db_path_Forcasting, name, time, addwind, hyubao, manual)
                    #     except Exception as e:
                    #         print(e)

                    # 处理精度评定结果数据
                    if os.path.basename(file) == "result.txt":
                        path = Path + "/" + file
                        filename = "result.txt"
                        type = "result"
                        insert_NCdata(db_path_NC, time, type, path, filename, manual)

                    # 处理nc数据
                    if file.endswith(".nc"):
                        path = Path + "/" + file
                        filename = os.path.basename(file)
                        if name == "adcirc_addwind":
                            type = "adcirc"
                            zeta = nc2array(path)
                            insert_NCdata(db_path_NC, time, type, path, filename, manual)
                            hyubao = getZetaFromArray(zeta, stations)
                        if name == "fort.63_nowind":
                            type = "fort63"
                            zeta = nc2array(path)
                            insert_NCdata(db_path_NC, time, type, path, filename, manual)
                            hpre = getZetaFromArray(zeta, stations)
                        if hyubao != [] and hpre != []:
                            for i in range(len(hyubao)):
                                name = hyubao[i].get("name")
                                hyubao_data = hyubao[i].get("data")
                                hpre_data = hpre[i].get("data")
                                hadd_data = hyubao_data - hpre_data
                                insert_typhdata(db_path_Forcasting, name, time, hpre_data.tolist(),
                                                hyubao_data.tolist(), hadd_data.tolist(), manual)
                            break

                    print(os.path.basename(file))

            else:
                # 不存在台风
                files = os.listdir(Path)
                for file in files:
                    # 文件名称
                    name = os.path.splitext(file)[0]

                    # 处理mat数据
                    if file.endswith(".mat"):
                        # 获取站点名称
                        name = os.path.splitext(file)[0]
                        # 去掉尾部数字
                        name = get_prefix_before_digits(name)

                        if name != "xuliujing":
                            continue

                        mat_path = os.path.join(Path, file)
                        mat_data = loadmat(mat_path)
                        try:
                            hpre_list = list_process(mat_data['hpre'])
                            hpre = [0.0 if value is None else value for value in hpre_list]
                            hshice_list = list_process(mat_data['hshice'])
                            hshice = [0.0 if value is None else value for value in hshice_list]
                            hybresult_list = list_process(mat_data['hybresult'])
                            hybresult = [0.0 if value is None else value for value in hybresult_list]
                            # 将预报数据存入数据库
                            insert_Nottyphdata(db_path_Forcasting, name, time,hpre, hshice, hybresult, manual)
                        except Exception as e:
                            print(e)

            print("****************" + folder + " finished!" + "****************")
            print()

        except Exception as e:
            print(folder + f" accidentally break because of {e}")
            continue

if __name__ == "__main__":
    main()