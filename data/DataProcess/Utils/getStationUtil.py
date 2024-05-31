import json
import os

def getStationInfo():
    # 获取所有站点信息
    filePath = "station_service.json"
    with open(filePath, 'r', encoding='utf-8') as file:
        data = json.load(file)
    return data