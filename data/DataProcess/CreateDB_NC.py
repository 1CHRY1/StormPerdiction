from scipy.io import loadmat
import json
import netCDF4 as nc
import sqlite3
import os
import schedule
import time

def main():
    # 创建主表
    db_path = os.getcwd() + '/NC.db'
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # 字段介绍： 更新时间，数据时间，是否有台风，数据类型，数据存放路径，是否手工计算
    cursor.execute(f'''
                CREATE TABLE IF NOT EXISTS NC (
                    updatetime DATETIME,
                    time DATETIME,
                    type TEXT,
                    path TEXT,
                    name TEXT,
                    manual INTEGER
                )
            ''')
    conn.commit()
    conn.close()

if __name__ == "__main__":
    main()
