import sqlite3
import json
import os

def getStationInfo():
    # 获取所有站点信息
    filePath = "station_service.json"
    with open(filePath, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data

def insert_data(db_path, table_name, data):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # 插入数据
    cursor.execute(f'''
            INSERT INTO stations (name, name_cn, lat, lon, type, tablename)
            VALUES ('{table_name}', '{data["name"]}', '{data["lat"]}', '{data["lon"]}', '{data["type"]}', '{table_name}')
        ''')
    conn.commit()
    conn.close()

def main():
    db_path = os.getcwd() + '/Forcasting.db'
    stationInfo = getStationInfo()
    for name,info in stationInfo.items():
        insert_data(db_path, name, info)


if __name__ == "__main__":
    main()

