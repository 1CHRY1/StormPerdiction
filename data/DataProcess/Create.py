from Utils import CreateUtils as CreateUtils, getStationUtil as getStations
from Clawing.ClawUtils import createMeteorologytable
import mysql.connector
import os

# 创建数据库并插入站点数据

mysql = 0
def createForMysql(stationInfo):
    createTable = CreateUtils.createTable()
    insertStationTable = CreateUtils.insertStationTable()
    config = {
        "user":"root",
        "password":"Richway1@",
        "host":"1.94.167.211",
        "port":3306,
        "database":"forecast",
        "raise_on_warnings": True
    }
    conn = mysql.connector.connect(**config)
    createTable.createStationAllTable_mysql(conn, "stations")
    stations = []
    for name, info in stationInfo.items():
        insertStationTable.insert_data(conn, name, info)
        stations.append(name)
    for station in stations:
        createTable.createStationTable_mysql(conn, station)
    conn.close()

def main():
    # 创建气象数据库
    # meteorology_path = os.getcwd() + '/Clawing/Meteorology.db'
    # createMeteorologytable(meteorology_path,"Meteorology")
    # 定义类
    createTable = CreateUtils.createTable()
    insertStationTable = CreateUtils.insertStationTable()
    stationInfo = getStations.getStationInfo()
    if (mysql == 1):
        createForMysql(stationInfo)
    db_path = os.getcwd() + '/Forcasting.db'
    db_path_NC = os.getcwd() + '/NC.db'
    createTable.createNCTable(db_path_NC)
    # 创建主表
    createTable.createStationAllTable(db_path, "stations")
    # 获取站点信息
    stations = []
    for name, info in stationInfo.items():
        insertStationTable.insert_data(db_path, name, info)
        stations.append(name)
    # 根据站点名称创建不同数据表
    for station in stations:
        # station_hz = station + "_hz"
        createTable.createStationtable(db_path, station)
        # createTable.createHZtable(db_path, station_hz)
        createTable.createTyphtable(db_path)

if __name__ == "__main__":
    main()