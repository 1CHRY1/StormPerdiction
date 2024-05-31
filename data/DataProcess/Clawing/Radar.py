import sys
from ClawUtils import Radar_clawing, Radar_clawing_linux, check_os, pinyinTransform

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
# "D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/DataProcess/Clawing/Meteorology.db" "D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/qixiangchanpin/leidapintu" "D:/1tools/chromedriver/chromedriver.exe"
args = sys.argv
if len(args) < 3:
    print("未传入正确数量参数")
    sys.exit(1)
db_path = args[1]
Path = args[2]
webdriverpath = args[3]

systemName = check_os()

type1 = pinyinTransform("雷达拼图")
for datatype in datatypes:
    name = pinyinTransform(datatype["name"])
    type2 = name
    url = datatype["url"]
    if (systemName == 'linux'):
        Radar_clawing_linux(db_path, Path, name, url, type1, type2, "", webdriverpath)
    else:
        Radar_clawing(db_path, Path, name, url, type1, type2, "", webdriverpath)
