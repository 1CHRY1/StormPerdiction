from scipy.io import loadmat
import json
import netCDF4 as nc
import sqlite3
import os
import schedule
import time

def getStationInfo():
    # 获取所有站点信息
    filePath = "../DataProcess_new/station_service.json"
    with open(filePath, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

# 字段介绍： 更新时间，数据时间，是否有台风，是否添加风要素，预报数据（无台风），所有数据，预报数据（有台风），是否手工计算
def createStationtable(db_path, tablename):
    # 根据站点名称在数据库中创建表
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS {tablename} (
                updatetime DATETIME,
                time DATETIME,
                iftyph INTEGER,
                hpre FLOAT,
                hyubao FLOAT,
                hadd FLOAT,
                manual INTEGER
            )
        ''')
    conn.commit()
    conn.close()

# 字段介绍： 数据时间， 潮位
def  createHZtable(db_path, tablename):
    # 创建站点历史所有潮位表
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(f'''
                CREATE TABLE IF NOT EXISTS {tablename} (
                    updatetime DATETIME,
                    time DATETIME,
                    hz_value FLOAT
                )
            ''')
    conn.commit()
    conn.close()

def  createTyphtable(db_path):
    # 创建站点历史所有潮位表
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(f'''
                CREATE TABLE IF NOT EXISTS typh (
                    updatetime DATETIME,
                    time DATETIME,
                    iftyph INTEGER
                )
            ''')
    conn.commit()
    conn.close()

def main():
    # 获取站点信息
    stationInfo = getStationInfo()
    stations = []
    for name, info in stationInfo.items():
        stations.append(name)
    # 创建主表
    db_path = os.getcwd() + '/Forcasting.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # 字段介绍： id，中文名称，拼音名称，经度，纬度，站点类型，对应数据表名称
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS stations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            name_cn TEXT,
            lat FLOAT,
            lon FLOAT,
            type TEXT,
            tablename TEXT
        )
    ''')
    conn.commit()
    conn.close()

    # 根据站点名称创建不同数据表
    for station in stations:
        station_hz = station + "_hz"
        createStationtable(db_path, station)
        createHZtable(db_path, station_hz)
        createTyphtable(db_path)

if __name__ == "__main__":
    main()
