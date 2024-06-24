import sys, json, os
from datetime import datetime, timedelta
from Utils.DataUtils import DataUtils, UpdateData_mysql
from scipy.io import loadmat

# dataprocess_path = "D:\1study\Work\2023_12_22_Storm\StormPerdiction\data\DataProcess"

def main():
    dataUtils = DataUtils()
    args = sys.argv
    if len(args) < 2:
        print("未传入正确数量参数")
        sys.exit(1)
    # sqlite数据库配置
    dataprocess_path = args[1]
    db_path_Forcasting = dataprocess_path + '/Forcasting.db'
    stations_path = dataprocess_path + '/station_service.json'
    with open(stations_path, 'r', encoding='utf-8') as file:
        stations = json.load(file)
    folderPath = os.path.dirname(dataprocess_path) + "/forecastData"
    folderPath = folderPath.replace(os.sep, '/')
    folders = os.listdir(folderPath)
    current_time = datetime.now().replace(second=0, microsecond=0)
    for folder in folders:
        if (len(folder) <= 8 ):
            continue
        else:
            folder_time = datetime.strptime(folder, "%Y%m%d_%H%M")
            if( dataUtils.judge_time(current_time, folder_time) == False):
                continue

        Path = folderPath + "/" + folder
        print("****************" + folder + " begin!" + "****************")
        time = folder_time
        manual = 1
        try:
            UpdateData_mysql(Path, time, manual)
        except Exception as e:
            print(e)

if __name__ == "__main__":
    main()