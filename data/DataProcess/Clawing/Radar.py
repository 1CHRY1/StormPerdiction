import sys
from ClawUtils import Radar_clawing

datatypes = [
    {"name":"全国","url":"http://www.nmc.cn/publish/radar/chinaall.html"},
    {"name":"华北","url":"http://www.nmc.cn/publish/radar/huabei.html"},
    {"name":"东北","url":"http://www.nmc.cn/publish/radar/dongbei.html"},
    {"name":"华东","url":"http://www.nmc.cn/publish/radar/huadong.html"},
    {"name":"华中","url":"http://www.nmc.cn/publish/radar/huazhong.html"},
    {"name":"华南","url":"http://www.nmc.cn/publish/radar/huanan.html"},
    {"name":"西南","url":"http://www.nmc.cn/publish/radar/xinan.html"},
    {"name":"西北","url":"http://www.nmc.cn/publish/radar/xibei.html"}
]

# db_path = "D:/1study/Work/2023_12_22_Storm/stormPerdiction/data/DataProcess/Clawing/Meteorology.db"
# Path = "D:/1study/Work/2023_12_22_Storm/stormPerdiction/data/气象产品/雷达拼图"
# webdriverpath = "D:/1tools/chromedriver/chromedriver.exe"
# "D:/1study/Work/2024_4_9_野外观测系统集成/系统部署/StormData/DataProcess_new/Clawing/Meteorology.db" "D:/1study/Work/2024_4_9_野外观测系统集成/系统部署/StormData/气象产品/雷达拼图" "D:/1tools/chromedriver/chromedriver.exe"
args = sys.argv
if len(args) < 3:
    print("未传入正确数量参数")
    sys.exit(1)
db_path = args[1]
Path = args[2]
webdriverpath = args[3]

type1 = "雷达拼图"
for datatype in datatypes:
    name = datatype["name"]
    type2 = name
    url = datatype["url"]
    Radar_clawing(db_path, Path, name, url, type1, type2, "", webdriverpath)
    # Radar_clawing_linux(db_path, Path, name, url, type1, type2, "", webdriverpath)
