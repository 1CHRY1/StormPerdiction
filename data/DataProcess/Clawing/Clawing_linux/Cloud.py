import os
import sqlite3
from datetime import datetime

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options as FirefoxOptions
import requests

def insertData(db_path, name, Time, type1, type2, type3, path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updateTime = datetime.now()
    # 插入数据
    cursor.execute(f'''
                INSERT INTO {name} ( updateTime, time, type1, type2, type3, path )
                VALUES ('{updateTime}', '{Time}', '{type1}', '{type2}', '{type3}', '{path}')
            ''')
    conn.commit()
    conn.close()

def Cloud_clawing(Path, name, url, type1, type2, type3, webdriverpath):
    # 已有图片
    folderpath = Path + '/' + name
    filenames = []
    files = os.listdir(folderpath)
    for file in files:
        filenames.append(os.path.splitext(file)[0])

    # 图片爬取
    options = FirefoxOptions()
    options.headless = True
    webdriver_service = Service(executable_path=webdriverpath)
    driver = webdriver.Firefox(options=options, service=webdriver_service)
    wait = WebDriverWait(driver, 10)
    try:
        driver.get(url)
        TimeContainer = wait.until(EC.presence_of_element_located((By.ID, 'mCSB_1_container')))
        children = TimeContainer.find_elements(By.XPATH, ".//*")
        for child in children:
            driver.execute_script("arguments[0].scrollIntoView();", child)
            Time = child.text.replace('/', '').replace(':', '')
            if Time == "":
                continue
            if Time not in filenames:
                img_url = child.get_attribute("data-img")
                filepath = f"{folderpath}/{Time}.jpg"
                response = requests.get(img_url)
                if response.status_code == 200:
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    f.close()
                    print(f"文件{Time}下载成功")
                    filenames.append(Time)
                    # 处理时间变量
                    current_year = datetime.now().year
                    Time_obj = datetime.strptime(str(current_year) + Time, "%Y%m%d %H%M")
                    insertData(db_path, "Meteorology", Time_obj, type1, type2, type3, filepath)
                    print(f"文件{Time}插入数据库成功")
                else:
                    print("文件下载失败")
    except Exception as e:
        print(e)
        driver.close()
        Cloud_clawing(Path, name, url, type1, type2, type3, webdriverpath)
        return
    finally:
        driver.close()

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

db_path = "/home/ps/ForecastPlatform/DataProcess/Clawing/Meteorology.db"
Path = "/home/ps/ForecastPlatform/气象产品/卫星云图"
webdriverpath = "/home/ps/apps/webdriver/geckodriver"

# args = sys.argv
# if len(args) < 3:
#     print("未传入正确数量参数")
#     sys.exit(1)
# db_path = args[1]
# Path = args[2]
# webdriverpath = args[3]

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
            Cloud_clawing(Path_, name, url, type1, type2, type3, webdriverpath)
    else:
        Cloud_clawing(Path, name, url, type1, type2, "", webdriverpath)
