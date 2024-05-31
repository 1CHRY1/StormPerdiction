from ClawUtils import delete_jpg_files, remove_dbcontent

# 调用函数并传入文件夹路径
folder_path = "D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/气象产品"
db_path = "D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/DataProcess/Clawing/Meteorology.db"
# 删除当前日期前天的数据
delete_jpg_files(folder_path)
remove_dbcontent(db_path, "Meteorology")