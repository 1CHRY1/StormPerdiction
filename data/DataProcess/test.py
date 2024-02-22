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

def get_prefix_before_digits(input_str):
    # 获取数字前的所有字符
    prefix = ""
    for char in input_str:
        if char.isdigit():
            break
        prefix += char
    return prefix

def main():
    # db_path = os.getcwd() + '/Forcasting.db'
    folderPath = os.path.join(os.pardir,"forecastData")
    # folderPath = os.pardir
    folders = os.listdir(folderPath)
    for folder in folders:
        # 遍历每个文件夹中的数据
        Path = folderPath + "//" + folder
        try:
            files = os.listdir(Path)
            for file in files:
                # 处理nc数据
                if file.endswith(".nc"):
                    name = os.path.splitext(file)[0]
                    print(name)
        except:
            continue

if __name__ == "__main__":
    main()