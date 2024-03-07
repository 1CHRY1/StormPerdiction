import os.path

import requests
import json
import datetime

# 网页数据请求的简单封装,返回JSON对象
def getSourceFromURL(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print('REQUEST SUCCESS')
        originData = response.text
        if originData == "":
            # 当前无台风
            return ""
        else:
            # 当前有台风
            if (originData[0]=='['):
                jsonStr = originData[1:len(originData) - 1]
            else:
                jsonStr = originData
            jsonObj = json.loads(jsonStr)
            name = jsonObj["name"]
            points = jsonObj["points"]
            points_result = []
            for point in points:
                dic = {
                    "time" : point["time"],
                    "lng" : point["lng"],
                    "lat" : point["lat"],
                    "strong" : point["strong"],
                    "power" : point["power"],
                    "speed" : point["speed"],
                    "pressure" : point["pressure"],
                    "movespeed" : point["movespeed"],
                    "movedirection" : point["movedirection"]
                }
                points_result.append(dic)
            jsonResult = {
                "name" : name,
                "points" : points_result
            }
            return jsonResult
    else:
        print('REQUEST ERROR::' + response.status_code)
        return ""

def deleteCurrentJson(file_path):
    if os.path.exists(file_path):
        os.remove(file_path)

rootPath = os.path.dirname(__file__)
file_path = rootPath + "/typhoon.json"
deleteCurrentJson(file_path)
# current_time = datetime.date.today().strftime("%Y%m%d")
current_time = "202306"
url = 'http://typhoon.zjwater.gov.cn/Api/TyphoonInfo' + "/" + current_time
result = getSourceFromURL(url)
with open(file_path, "w", encoding="utf-8") as json_file:
    json.dump(result, json_file, ensure_ascii=False, indent=4)