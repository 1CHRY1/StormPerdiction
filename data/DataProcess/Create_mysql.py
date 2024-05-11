import json

import mysql.connector

def getStationInfo():
    # 获取所有站点信息
    filePath = "station_service.json"
    with open(filePath, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data
def createStationInfoTable(conn, tablename):
    cursor = conn.cursor()
    create_stations_query = f'''
        CREATE TABLE IF NOT EXISTS {tablename} (
            id INTEGER,
            name TEXT,
            name_cn TEXT,
            lat FLOAT,
            lon FLOAT,
            type TEXT,
            tablename TEXT
        )
    '''
    cursor.execute(create_stations_query)
    conn.commit()
def createStationTable(conn, tablename):
    cursor = conn.cursor()
    create_stations_query = f'''
        CREATE TABLE IF NOT EXISTS {tablename} (
            updatetime DATETIME,
            time DATETIME,
            hpre TEXT,
            manual INTEGER
        )
    '''
    cursor.execute(create_stations_query)
    conn.commit()

config = {
    "user":"root",
    "password":"Richway1@",
    "host":"1.94.167.211",
    "port":3306,
    "database":"forecast",
    "raise_on_warnings": True
}

# 获取台风数据
stationInfo = getStationInfo()
stations = []
for name, info in stationInfo.items():
    stations.append(name)

# 创建表
conn = mysql.connector.connect(**config)
createStationInfoTable(conn, "stations")
for station in stations:
    createStationTable(conn, station)
conn.close()