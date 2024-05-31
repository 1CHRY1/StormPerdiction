from scipy.io import loadmat
import json
import netCDF4 as nc
import sqlite3
import os
import schedule
import time

def createMeteorologytable(db_path, tablename):
    # 根据站点名称在数据库中创建表
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS {tablename} (
                updatetime DATETIME,
                time DATETIME,
                type1 TEXT,
                type2 TEXT,
                type3 TEXT,
                path TEXT
            )
        ''')
    conn.commit()
    conn.close()

def main():
    # 创建主表
    db_path = os.getcwd() + '/Meteorology.db'
    createMeteorologytable(db_path, "Meteorology")

if __name__ == "__main__":
    main()