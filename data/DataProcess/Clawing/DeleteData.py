from ClawUtils import delete_jpg_files, remove_dbcontent

# 调用函数并传入文件夹路径
folder_path = "D:/1study/Work/2024_4_9_野外观测系统集成/系统部署/StormData/气象产品"
db_path = "D:/1study/Work/2024_4_9_野外观测系统集成/系统部署/StormData/DataProcess/Clawing/Meteorology.db"

# 服务器上
# folder_path = "/usr/local/resource/StormData/qixiangchanpin"
# db_path = "/usr/local/resource/StormData/DataProcess/Clawing/Meteorology.db"

# 删除当前日期前天的数据
delete_jpg_files(folder_path)
remove_dbcontent(db_path, "Meteorology")