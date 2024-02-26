import os
import sqlite3
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

def Cloud_clawing(Path, name, url, type1, type2, type3):
    # 已有图片
    folderpath = Path + '\\' + name
    filenames = []
    files = os.listdir(folderpath)
    for file in files:
        filenames.append(os.path.splitext(file)[0])

    # 图片爬取
    options = Options()
    options.add_argument('--headless')  # 不打开浏览器
    chromedriver_path = "D:\\1tools\\Miniconda\\envs\\Crawling\\chromedriver.exe"
    chromedriver_service = Service(executable_path=chromedriver_path)
    driver = webdriver.Chrome(options=options, service=chromedriver_service)
    wait = WebDriverWait(driver, 10)
    try:
        driver.get(url)
        timeContainer = wait.until(EC.presence_of_element_located((By.ID, 'mCSB_1_container')))
        children = timeContainer.find_elements(By.XPATH, ".//*")
        for child in children:
            driver.execute_script("arguments[0].scrollIntoView();", child)
            time = child.text.replace('/', '').replace(':', '')
            if time == "":
                continue
            if time not in filenames:
                img_url = child.get_attribute("data-img")
                filepath = f"{folderpath}\\{time}.jpg"
                response = requests.get(img_url)
                if response.status_code == 200:
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    f.close()
                    print(f"文件{time}下载成功")
                    filenames.append(time)
                    # 处理时间变量
                    time_obj = datetime.strptime(time, "%m%d %H%M")
                    current_year = datetime.now().year
                    time_obj = time_obj.replace(year=current_year)
                    insertData(db_path, "Meteorology", time_obj, type1, type2, type3, filepath)
                    print(f"文件{time}插入数据库成功")
                else:
                    print("文件下载失败")
    except Exception as e:
        print(e)
        driver.close()
        Cloud_clawing(Path, name, url, type1, type2, type3)
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
db_path = "D:\\1study\\Work\\2023_12_22_Storm\\Data\\DataProcess\\Clawing\\Meteorology.db"
Path = "D:\\1study\\Work\\2023_12_22_Storm\\Data\\气象产品\\卫星云图"
type1 = "卫星云图"
for datatype in datatypes:
    name = datatype["name"]
    type2 = name
    url = datatype["url"]
    if type(url) != str:
        urls = url
        Path_ = Path + "\\" + name
        for item in urls:
            name = item["name"]
            url = item["url"]
            type3 = name
            Cloud_clawing(Path_, name, url, type1, type2, type3)
    else:
        Cloud_clawing(Path, name, url, type1, type2, "")
