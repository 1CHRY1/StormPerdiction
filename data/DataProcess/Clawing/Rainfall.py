import os
import sqlite3
import time

from datetime import datetime

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
import pymongo
from selenium.webdriver.common.action_chains import ActionChains
import re
import urllib
from urllib.parse import quote
import requests
import time
import asyncio

def insertData(db_path, name, Time, type1, type2, type3, path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updatetime = datetime.now()
    # 插入数据
    cursor.execute(f'''
                INSERT INTO {name} ( updatetime, time, type1, type2, type3, path )
                VALUES ('{updatetime}', '{Time}', '{type1}', '{type2}', '{type3}', '{path}')
            ''')
    conn.commit()
    conn.close()

def Rainfall_clawing(Path, name, url, type1, type2, type3):
    # 已有图片
    folderpath = Path + '/' + name
    filenames = []
    files = os.listdir(folderpath)
    for file in files:
        filenames.append(os.path.splitext(file)[0])

    # 图片爬取
    options = Options()
    options.add_argument('--headless')  # 不打开浏览器
    chromedriver_path = "D:/1tools/Miniconda/envs/Crawling/chromedriver.exe"
    chromedriver_service = Service(executable_path=chromedriver_path)
    driver = webdriver.Chrome(options=options, service=chromedriver_service)
    wait = WebDriverWait(driver, 10)
    try:
        driver.get(url)
        if (name == "1小时降水量" or name == "6小时降水量" or name == "24小时降水量"):
            element = driver.find_element(By.ID, "profile-tab")
            element.click()
            time.sleep(2)
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
                    print(f"文件{Time}下载成功", Time)
                    filenames.append(Time)
                    # 处理时间变量
                    Time_obj = datetime.strptime(Time, "%m%d %H%M")
                    current_year = datetime.now().year
                    Time_obj = Time_obj.replace(year=current_year)
                    insertData(db_path, "Meteorology", Time_obj, type1, type2, type3, filepath)
                    print(f"文件{Time}插入数据库成功")
                else:
                    print("文件下载失败")
    except Exception as e:
        print(e)
        driver.close()
        Rainfall_clawing(Path, name, url, type1, type2, type3)
        return
    finally:
        driver.close()

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
db_path = "D:/1study/Work/2023_12_22_Storm/stormPrediction/data/DataProcess/Clawing/Meteorology.db"
Path = "D:/1study/Work/2023_12_22_Storm/stormPrediction/data/气象产品/降水量实况"
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
            Rainfall_clawing(Path_, name, url, type1, type2, type3)
    else:
        Rainfall_clawing(Path, name, url, type1, type2, "")
