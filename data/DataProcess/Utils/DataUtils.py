from scipy.io import loadmat
import netCDF4 as nc
import sqlite3
import os
from datetime import datetime, timedelta
import mysql.connector

# 数据插入工具集
class DataUtils():
    # 判断是否有台风
    def JudgeIfTyph(self, filePath):
        # 判断是否有台风
        with open(filePath, 'r') as file:
            content = file.read().strip()
        if (content == 1 or content == "1"):
            return True
        else:
            return False

    def DeleteTodayData(self, db_path, name, time):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        # 删除数据
        cursor.execute(f'''
                        DELETE FROM {name} WHERE time = '{time}'
                    ''')
        conn.commit()
        conn.close()

    # 插入有台风时的数据
    def insert_typhdata(self, db_path, name, time, hpre, hyubao, hadd, manual):
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

    # 插入无台风时的数据
    def insert_Nottyphdata(self, db_path, name, time, hpre, hshice, hybresult, manual):
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

    # 插入mysql数据
    def insert_data_mysql(self, conn, name, time, hpre, manual):
        # 插入无台风数据
        cursor = conn.cursor()
        updatetime = datetime.now()
        # 插入数据
        cursor.execute(f'''
                INSERT INTO {name} ( updatetime, time, hpre, manual )
                VALUES ('{updatetime}', '{time}', '{hpre}', '{manual}')
            ''')
        conn.commit()

    # 向hz表插入数据
    def insert_hzdata(self, db_path, name, time, hz_value):
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

    # 将nc数据转换为array
    def nc2array(self, filepath):
        # 将nc数据读取为array'
        ncfile = nc.Dataset(filepath, "r", format='NETCDF3_CLASSIC')
        zeta = ncfile["zeta"][:]
        return zeta

    # 获取
    def getZetaFromArray(self, array, stations):
        result = []
        for name, info in stations.items():
            row = info.get("row")
            data = array[:, row]
            result.append({"name": name, "data": data})
        return result

    def list_process(self, hpre):
        data = []
        for item in hpre:
            data.append(item[0])
        return data

    def get_hzdata(self, hz, start_time):
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

    def get_DBhzlen(self, db_path, name):
        # 获取已有的hz数据
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(f"SELECT COUNT(*) FROM {name}")
        len = cursor.fetchone()[0]
        conn.close()
        return len

    def insert_NCdata(self, db_path, time, type, path, name, manual):
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

    def insert_iftyph(self, db_path, time, iftyph, manuel):
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

    def insert_iftyph_mysql(self, conn, time, iftyph, manuel):
        cursor = conn.cursor()
        updatetime = datetime.now()
        # 插入数据
        cursor.execute(f'''
                        INSERT INTO typh ( updatetime, time, iftyph, manuel )
                        VALUES ('{updatetime}', '{time}', '{iftyph}', '{manuel}' )
                    ''')
        conn.commit()

    def get_prefix_before_digits(self, input_str):
        # 获取数字前的所有字符
        prefix = ""
        for char in input_str:
            if char.isdigit():
                break
            prefix += char
        return prefix

    def get_prefix_before_digitsV2(self, input_str):
        prefix = input_str[:-10]
        return prefix


def UpdateData_mysql(Path, time):
    thisDataUtils = DataUtils()
    # mysql数据库配置
    config = {
        "user": "root",
        "password": "Richway1@",
        "host": "1.94.167.211",
        "port": 3306,
        "database": "forecast",
        "raise_on_warnings": True
    }
    conn_mysql = mysql.connector.connect(**config)
    files = os.listdir(Path)
    for file in files:
        if file.endswith(".mat"):
            # 获取站点名称
            name = os.path.splitext(file)[0]
            # 去掉尾部数字
            name = thisDataUtils.get_prefix_before_digitsV2(name)
            mat_path = os.path.join(Path, file)
            mat_data = loadmat(mat_path)
            try:
                hpre_list = thisDataUtils.list_process(mat_data['hpre'])
                hpre = [0.0 if value is None else value for value in hpre_list]
                thisDataUtils.insert_data_mysql(conn_mysql, name, time, hpre, 0)
            except Exception as e:
                print(e)
    conn_mysql.close()