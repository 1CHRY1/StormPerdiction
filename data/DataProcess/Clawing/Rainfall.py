import sys
from ClawUtils import Rainfall_clawing

datatypes = [
    {"name":"1小时降水量","url":"http://www.nmc.cn/publish/observations/hourly-precipitation.html"},
    {"name":"6小时降水量","url":"http://www.nmc.cn/publish/observations/6hour-precipitation.html"},
    {"name":"24小时降水量","url":"http://www.nmc.cn/publish/observations/24hour-precipitation.html"},
    {"name":"近30天降水量","url":[
        {"name":"近10天降水量","url":"http://www.nmc.cn/publish/observations/precipitation-10day.html"},
        {"name":"近20天降水量","url":"http://www.nmc.cn/publish/observations/precipitation-20day.html"},
        {"name":"近30天降水量","url":"http://www.nmc.cn/publish/observations/precipitation-30day.html"}
    ]},
    {"name":"近30天降水量距平","url":[
        {"name":"近10天降水量距平百分率","url":"http://www.nmc.cn/publish/observations/precipitation-10pa.html"},
        {"name":"近20天降水量距平百分率","url":"http://www.nmc.cn/publish/observations/precipitation-20pa.html"},
        {"name":"近30天降水量距平百分率","url":"http://www.nmc.cn/publish/observations/precipitation-30pa.html"}
    ]}
]

# db_path = "D:/1study/Work/2023_12_22_Storm/stormPerdiction/data/DataProcess/Clawing/Meteorology.db"
# Path = "D:/1study/Work/2023_12_22_Storm/stormPerdiction/data/气象产品/降水量实况"
# webdriverpath = "D:/1tools/chromedriver/chromedriver.exe"
# db_path = "D:/1study/Work/2024_4_9_野外观测系统集成/系统部署/StormData/DataProcess_new/Clawing/Meteorology.db" "D:/1study/Work/2024_4_9_野外观测系统集成/系统部署/StormData/气象产品/降水量实况" "D:/1tools/chromedriver/chromedriver.exe"
args = sys.argv
if len(args) < 3:
    print("未传入正确数量参数")
    sys.exit(1)
db_path = args[1]
Path = args[2]
webdriverpath = args[3]

type1 = "降水量实况"
for datatype in datatypes:
    name = datatype["name"]
    type2 = name
    url = datatype["url"]
    if type(url) != str:
        urls = url
        Path_ = Path + "/" + name
        for item in urls:
            name = item["name"]
            url = item["url"]
            type3 = name
            Rainfall_clawing(db_path, Path_, name, url, type1, type2, type3, webdriverpath)
            # Radar_clawing_linux(db_path, Path_, name, url, type1, type2, type3, webdriverpath)
    else:
        Rainfall_clawing(db_path, Path, name, url, type1, type2, "", webdriverpath)
        # Radar_clawing_linux(db_path, Path_, name, url, type1, type2, type3, webdriverpath)
