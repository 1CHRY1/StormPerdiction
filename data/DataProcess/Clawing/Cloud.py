import sys
from ClawUtils import Cloud_clawing

datatypes = [
    {"name":"FY4A真彩色","url":"http://www.nmc.cn/publish/satellite/FY4A-true-color.htm"},
    {"name":"FY4A红外","url":"http://www.nmc.cn/publish/satellite/FY4A-infrared.htm"},
    {"name":"FY4A可见光","url":"http://www.nmc.cn/publish/satellite/FY4A-visible.htm"},
    {"name":"FY4A水汽","url":"http://www.nmc.cn/publish/satellite/FY4A-water-vapour.htm"},
    {"name":"FY2G可见光","url":"http://www.nmc.cn/publish/satellite/fy2evisible.html"},
    {"name":"FY2G增强图","url":[
        {"name":"水汽","url":"http://www.nmc.cn/publish/satellite/fy2e/water_vapor.html"},
        {"name":"红外一","url":"http://www.nmc.cn/publish/satellite/fy2e/infrared_1.html"},
        {"name":"红外二","url":"http://www.nmc.cn/publish/satellite/fy2e/infrared_2.html"}
    ]},
    {"name":"FY2G黑白图","url":[
        {"name":"可见光","url":"http://www.nmc.cn/publish/satellite/fy2e_bawhite/visible_light.html"},
        {"name":"中红外","url":"http://www.nmc.cn/publish/satellite/fy2e_bawhite/mid-infrared.html"}
    ]},
    {"name":"FY2G圆盘图","url":[
        {"name":"彩色圆盘图","url":"http://www.nmc.cn/publish/satellite/fy2c-disc-color.html"},
        {"name":"红外一圆盘图","url":"http://www.nmc.cn/publish/satellite/fy2c-disc-ir1.html"},
        {"name":"红外二圆盘图","url":"http://www.nmc.cn/publish/satellite/fy2c-disc-ir2.html"},
        {"name":"中红外圆盘图","url":"http://www.nmc.cn/publish/satellite/fy2c-disc-ir3.html"},
        {"name":"水汽圆盘图","url":"http://www.nmc.cn/publish/satellite/fy2c-disc-wv.html"},
        {"name":"可见光圆盘图","url":"http://www.nmc.cn/publish/satellite/fy2c-disc-vis.html"}
    ]}
]

# db_path = "D:/1study/Work/2023_12_22_Storm/stormPerdiction/data/DataProcess/Clawing/Meteorology.db"
# Path = "D:/1study/Work/2023_12_22_Storm/stormPerdiction/data/气象产品/卫星云图"
# webdriverpath = "D:/1tools/chromedriver/chromedriver.exe"
# "D:/1study/Work/2024_4_9_野外观测系统集成/系统部署/StormData/DataProcess_new/Clawing/Meteorology.db" "D:/1study/Work/2024_4_9_野外观测系统集成/系统部署/StormData//气象产品/卫星云图" "D:/1tools/chromedriver/chromedriver.exe"

args = sys.argv
if len(args) < 3:
    print("未传入正确数量参数")
    sys.exit(1)
db_path = args[1]
Path = args[2]
webdriverpath = args[3]

type1 = "卫星云图"
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
            Cloud_clawing(db_path, Path_, name, url, type1, type2, type3, webdriverpath)
            # Cloud_clawing_linux(db_path, Path_, name, url, type1, type2, type3, webdriverpath)
    else:
        Cloud_clawing(db_path, Path, name, url, type1, type2, "", webdriverpath)
        # Cloud_clawing_linux(db_path, Path_, name, url, type1, type2, type3, webdriverpath)
