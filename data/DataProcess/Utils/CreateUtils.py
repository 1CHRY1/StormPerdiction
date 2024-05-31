import sqlite3

# 数据库创建工具及
class createTable():

    def createStationAllTable(self, db_path, tablename):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        # 字段介绍： id，中文名称，拼音名称，经度，纬度，站点类型，对应数据表名称
        cursor.execute(f'''
                CREATE TABLE IF NOT EXISTS {tablename} (
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

    def createStationtable(self, db_path, tablename):
        # 根据站点名称在数据库中创建表
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(f'''
                CREATE TABLE IF NOT EXISTS {tablename} (
                    updatetime DATETIME,
                    time DATETIME,
                    iftyph INTEGER,
                    hpre TEXT,
                    hshice FLOAT,
                    hybresult FLOAT,
                    manual INTEGER
                )
            ''')
        conn.commit()
        conn.close()

    def createStationAllTable_mysql(self, conn, tablename):
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

    def createStationTable_mysql(self, conn, tablename):
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

    # 字段介绍： 数据时间， 潮位
    def createHZtable(self, db_path, tablename):
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

    def createTyphtable(self, db_path):
        # 创建站点历史所有潮位表
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute(f'''
                    CREATE TABLE IF NOT EXISTS typh (
                        updatetime DATETIME,
                        time DATETIME,
                        iftyph INTEGER,
                        manuel InTEGER
                    )
                ''')
        conn.commit()
        conn.close()

    def createNCTable(self, db_path):
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

class insertStationTable():

    def insert_data(self, db_path, table_name, data):
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        # 插入数据
        cursor.execute(f'''
                INSERT INTO stations (name, name_cn, lat, lon, type, tablename)
                VALUES ('{table_name}', '{data["name"]}', '{data["lat"]}', '{data["lon"]}', '{data["type"]}', '{table_name}')
            ''')
        conn.commit()
        conn.close()

    def insert_data_mysql(self, conn, table_name, data):
        cursor = conn.cursor()
        # 插入数据
        cursor.execute(f'''
                INSERT INTO stations (name, name_cn, lat, lon, type, tablename)
                VALUES ('{table_name}', '{data["name"]}', '{data["lat"]}', '{data["lon"]}', '{data["type"]}', '{table_name}')
            ''')
        conn.commit()