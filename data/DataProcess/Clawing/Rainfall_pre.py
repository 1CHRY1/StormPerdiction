import sys
from ClawUtils import Rainfallpre_clawing, Rainfallpre_clawing_linux, check_os, pinyinTransform


datatypes = [
    {"name":"24小时降水量","url":[
        {"name":"24小时","url":"http://www.nmc.cn/publish/precipitation/1-day.html"},
        {"name":"48小时","url":"http://www.nmc.cn/publish/precipitation/2-day.html"},
        {"name":"72小时","url":"http://www.nmc.cn/publish/precipitation/3-day.html"},
        {"name":"96小时","url":"http://www.nmc.cn/publish/precipitation/day4.html"},
        {"name":"120小时","url":"http://www.nmc.cn/publish/precipitation/day5.html"},
        {"name":"144小时","url":"http://www.nmc.cn/publish/precipitation/day6.html"},
        {"name":"168小时","url":"http://www.nmc.cn/publish/precipitation/day7.html"}
    ]},
    {"name":"6小时降水量","url":[
        {"name":"6小时","url":"http://www.nmc.cn/publish/precipitation/6hours-6.html"},
        {"name":"12小时","url":"http://www.nmc.cn/publish/precipitation/6hours-12.html"},
        {"name":"18小时","url":"http://www.nmc.cn/publish/precipitation/6hours-18.html"},
        {"name":"24小时","url":"http://www.nmc.cn/publish/precipitation/6hours-24.html"}
    ]}
]

# db_path = "/home/ps/ForecastPlatform/DataProcess/Clawing/Meteorology.db"
# Path = "/home/ps/ForecastPlatform/气象产品/降水量预报"
# webdriverpath = "/home/ps/apps/webdriver/geckodriver"
# "D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/DataProcess/Clawing/Meteorology.db" "D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/qixiangchanpin/jiangshuiliangyubao" "D:/1tools/chromedriver/chromedriver.exe"

args = sys.argv
if len(args) < 3:
    print("未传入正确数量参数")
    sys.exit(1)
db_path = args[1]
Path = args[2]
webdriverpath = args[3]

systemName = check_os()

type1 = pinyinTransform("降水量预报")
for datatype in datatypes:
    name = pinyinTransform(datatype["name"])
    type2 = name
    urls = datatype["url"]
    Path_ = Path + "/" + name
    for item in urls:
        name = pinyinTransform(item["name"])
        url = item["url"]
        type3 = name
        if (systemName == 'linux'):
            Rainfallpre_clawing_linux(db_path, Path_, name, url, type1, type2, type3, webdriverpath)
        else:
            Rainfallpre_clawing(db_path, Path_, name, url, type1, type2, type3, webdriverpath)
