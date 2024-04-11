import os
import sqlite3
from datetime import datetime
import sys

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

def Radar_clawing(Path, name, url, type1, type2, type3, webdriverpath):
    # 已有图片
    folderpath = Path + '/' + name
    filenames = []
    files = os.listdir(folderpath)
    for file in files:
        filenames.append(os.path.splitext(file)[0])

    # 图片爬取
    options = Options()
    options.add_argument('--headless')  # 不打开浏览器
    chromedriver_service = Service(executable_path=webdriverpath)
    driver = webdriver.Chrome(options=options, service=chromedriver_service)
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
        Radar_clawing(Path, name, url, type1, type2, type3, webdriverpath)
        return
    finally:
        driver.close()

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
    Radar_clawing(Path, name, url, type1, type2, "", webdriverpath)
