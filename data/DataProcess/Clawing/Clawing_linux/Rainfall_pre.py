import sqlite3
from datetime import datetime, timedelta
import sys

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.firefox.options import Options as FirefoxOptions
import requests

def insertData(db_path, name, time, type1, type2, type3, path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
                INSERT INTO {name} ( updatetime, time, type1, type2, type3, path )
                VALUES ('{updatetime}', '{time}', '{type1}', '{type2}', '{type3}', '{path}')
            ''')
    conn.commit()
    conn.close()

def Rainfallpre_clawing(Path, name, url, type1, type2, type3, webdriverpath):
    folderpath = Path + '/' + name
    # 图片爬取
    options = FirefoxOptions()
    options.headless = True
    webdriver_service = Service(executable_path=webdriverpath)
    driver = webdriver.Firefox(options=options, service=webdriver_service)
    wait = WebDriverWait(driver, 10)
    try:
        driver.get(url)
        img = wait.until(EC.presence_of_element_located((By.ID, "imgpath")))
        img_url = img.get_attribute("src")
        time_obj = datetime.now() + timedelta(days=1)
        time = time_obj.strftime("%m%d")
        filepath = f"{folderpath}/{time}.jpg"
        response = requests.get(img_url)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                f.write(response.content)
            f.close()
            print(f"文件{time}下载成功", time)
            insertData(db_path, "Meteorology", time_obj.date(), type1, type2, type3, filepath)
            print(f"文件{time}插入数据库成功")
        else:
            print("文件下载失败")
    except Exception as e:
        print(e)
        driver.close()
        Rainfallpre_clawing(Path, name, url, type1, type2, type3, webdriverpath)
        return
    finally:
        driver.close()

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

args = sys.argv
if len(args) < 3:
    print("未传入正确数量参数")
    sys.exit(1)
db_path = args[1]
Path = args[2]
webdriverpath = args[3]

type1 = "降水量预报"
for datatype in datatypes:
    name = datatype["name"]
    type2 = name
    urls = datatype["url"]
    Path_ = Path + "/" + name
    for item in urls:
        name = item["name"]
        url = item["url"]
        type3 = name
        Rainfallpre_clawing(Path_, name, url, type1, type2, type3, webdriverpath)
