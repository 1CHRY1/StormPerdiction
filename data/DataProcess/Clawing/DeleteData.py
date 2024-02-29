import os
import sqlite3
from datetime import datetime, timedelta

def delete_jpg_files(folder_path):
    # 遍历指定文件夹及其子文件夹下的所有文件和文件夹
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            # 如果文件是以 .jpg 结尾的
            if file.endswith(".jpg"):
                file_path = os.path.join(root, file)
                time = os.path.basename(file_path).split('.')[0]
                if len(time) == 4:
                    os.remove(file_path) #特殊情况处理，直接删去降水预报如图
                    continue
                current_year = datetime.now().year
                time_obj = datetime.strptime(str(current_year)+time, "%Y%m%d %H%M").replace(year=current_year)
                # 如果time_obj早于前天的时间，则删去
                yesterday = datetime.now() - timedelta(days=1)
                if ( time_obj.date() < yesterday.date()):
                    os.remove(file_path)
                # os.remove(file_path)

def remove_dbcontent(db_path, name):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # 计算昨天的日期
    yesterday = datetime.now() - timedelta(days=1)
    yesterday_str = yesterday.strftime('%Y-%m-%d')
    cursor.execute(f"DELETE FROM {name} WHERE time < ?", (yesterday_str,))
    # 删去数据库中字段time没有不含小时的字段
    cursor.execute(f"SELECT type1 FROM {name}")
    rows = cursor.fetchall()
    for row in rows:
        if (row[0] == "降水量预报"):
            cursor.execute(f"DELETE FROM {name} WHERE type1 = ?", row)
    conn.commit()
    conn.close()

# 调用函数并传入文件夹路径
folder_path = "D:/1study/Work/2023_12_22_Storm/stormPrediction/data/气象产品"
db_path = "D:/1study/Work/2023_12_22_Storm/stormPrediction/data/DataProcess/Clawing/Meteorology.db"
# 删除当前日期前天的数据
delete_jpg_files(folder_path)
remove_dbcontent(db_path, "Meteorology")