from Utils.DataUtils import DataUtils
import sys
import json
from datetime import datetime

"D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/DataProcess"
"/run/media/ps/c4cc18ff-fa71-43fb-8a59-06bc37d5c482/ForecastPlatform/DataProcess"
def main():
    dataUtils = DataUtils()
    args = sys.argv
    if len(args) < 2:
        print("未传入正确数量参数")
        sys.exit(1)
    dataprocess_path = args[1]
    db_path_Forcasting = dataprocess_path + '/Forcasting.db'
    db_path_NC = dataprocess_path + '/NC.db'
    stations_path = dataprocess_path + '/station_service.json'
    with open(stations_path, 'r', encoding='utf-8') as file:
        stations = json.load(file)
    now = datetime.now()
    time = now.strftime("%Y-%m-%d 00:00:00")
    for station in stations:
        dataUtils.DeleteTodayData(db_path_Forcasting, station, time)
    dataUtils.DeleteTodayData(db_path_Forcasting, 'typh', time)
    dataUtils.DeleteTodayData(db_path_NC,'NC',time)

if __name__ == "__main__":
    main()