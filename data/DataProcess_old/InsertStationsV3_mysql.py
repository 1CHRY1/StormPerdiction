import mysql.connector
import json
import os

def getStationInfo():
    # 获取所有站点信息
    filePath = "station.json"
    with open(filePath, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def insert_data(conn, table_name, data):
    cursor = conn.cursor()
    # 插入数据
    cursor.execute(f'''
            INSERT INTO stations (name, name_cn, lat, lon, type, tablename)
            VALUES ('{table_name}', '{data["name"]}', '{data["lat"]}', '{data["lon"]}', '{data["type"]}', '{table_name}')
        ''')
    conn.commit()

def main():
    config = {
        "user": "root",
        "password": "Richway1@",
        "host": "1.94.167.211",
        "port": 3306,
        "database": "forecast",
        "raise_on_warnings": True
    }
    conn = mysql.connector.connect(**config)
    stationInfo = getStationInfo()
    for name,info in stationInfo.items():
        insert_data(conn, name, info)
    conn.close()


if __name__ == "__main__":
    main()

