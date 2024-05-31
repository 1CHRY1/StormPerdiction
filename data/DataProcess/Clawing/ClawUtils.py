import os
import sqlite3
from datetime import datetime, timedelta
import time

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.firefox.options import Options as FirefoxOptions
import requests

# 图片爬取工具集合

def createMeteorologytable(db_path, tablename):
    # 根据站点名称在数据库中创建表
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute(f'''
            CREATE TABLE IF NOT EXISTS {tablename} (
                updatetime DATETIME,
                time DATETIME,
                type1 TEXT,
                type2 TEXT,
                type3 TEXT,
                path TEXT
            )
        ''')
    conn.commit()
    conn.close()

# 插入爬取图片数据
def insertData(db_path, name, Time, type1, type2, type3, path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    updateTime = datetime.now()
    # # 插入数据
    # cursor.execute(f'''
    #         INSERT INTO {name} ( updateTime, time, type1, type2, type3, path )
    #         VALUES ('{updateTime}', '{Time}', '{type1}', '{type2}', '{type3}', '{path}')
    #     ''')
    # 首先检查数据是否已存在
    cursor.execute(f"SELECT * FROM {name} WHERE time = ? AND type1 = ? AND type2 = ? AND type3 = ? AND path = ?",
                   (Time, type1, type2, type3, path))

    # 如果存在数据，则不执行插入
    if cursor.fetchone() is None:
        # 插入数据
        cursor.execute(f"""
                    INSERT INTO {name} (updateTime, time, type1, type2, type3, path)
                    VALUES (?, ?, ?, ?, ?, ?)
                """, (updateTime, Time, type1, type2, type3, path))
        conn.commit()
    else:
        print("数据已存在，未插入。")
    conn.close()


def Cloud_clawing(db_path, Path, name, url, type1, type2, type3, webdriverpath):
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
        Cloud_clawing(Path, name, url, type1, type2, type3, webdriverpath)
        return
    finally:
        driver.close()


def Cloud_clawing_linux(db_path, Path, name, url, type1, type2, type3, webdriverpath):
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


def Radar_clawing(db_path, Path, name, url, type1, type2, type3, webdriverpath):
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


def Radar_clawing_linux(db_path, Path, name, url, type1, type2, type3, webdriverpath):
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
        Radar_clawing(Path, name, url, type1, type2, type3, webdriverpath)
        return
    finally:
        driver.close()


def Rainfall_clawing(db_path, Path, name, url, type1, type2, type3, webdriverpath):
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
                    current_year = datetime.now().year
                    Time_obj = datetime.strptime(str(current_year) + Time, "%Y%m%d %H%M")
                    insertData(db_path, "Meteorology", Time_obj, type1, type2, type3, filepath)
                    print(f"文件{Time}插入数据库成功")
                else:
                    print("文件下载失败")
    except Exception as e:
        print(e)
        driver.close()
        Rainfall_clawing(Path, name, url, type1, type2, type3, webdriverpath)
        return
    finally:
        driver.close()


def Rainfall_clawing_linux(db_path, Path, name, url, type1, type2, type3, webdriverpath):
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
                    current_year = datetime.now().year
                    Time_obj = datetime.strptime(str(current_year) + Time, "%Y%m%d %H%M")
                    insertData(db_path, "Meteorology", Time_obj, type1, type2, type3, filepath)
                    print(f"文件{Time}插入数据库成功")
                else:
                    print("文件下载失败")
    except Exception as e:
        print(e)
        driver.close()
        Rainfall_clawing(Path, name, url, type1, type2, type3, webdriverpath)
        return
    finally:
        driver.close()

def Rainfallpre_clawing(db_path, Path, name, url, type1, type2, type3, webdriverpath):
    folderpath = Path + '/' + name
    # 图片爬取
    options = Options()
    options.add_argument('--headless')  # 不打开浏览器
    chromedriver_service = Service(executable_path=webdriverpath)
    driver = webdriver.Chrome(options=options, service=chromedriver_service)
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


def Rainfallpre_clawing_linux(db_path, Path, name, url, type1, type2, type3, webdriverpath):
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

def delete_jpg_files(folder_path):
    # 遍历指定文件夹及其子文件夹下的所有文件和文件夹
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            # 如果文件是以 .jpg 结尾的
            if file.endswith(".jpg"):
                file_path = os.path.join(root, file)
                time = os.path.basename(file_path).split('.')[0]
                current_year = datetime.now().year
                # 对于降水预报如图time_obj早于明天的时间，则删去
                if len(time) == 4:
                    time_obj = datetime.strptime(str(current_year) + time, "%Y%m%d").replace(year=current_year)
                    tomorrow = datetime.now() + timedelta(days=1)
                    if ( time_obj.date() < tomorrow.date() ):
                        os.remove(file_path)
                    continue
                # 对于其他，如果time_obj早于前天的时间，则删去
                time_obj = datetime.strptime(str(current_year)+time, "%Y%m%d %H%M").replace(year=current_year)
                yesterday = datetime.now() - timedelta(days=1)
                if ( time_obj.date() < yesterday.date()):
                    os.remove(file_path)
                # os.remove(file_path)


def remove_dbcontent(db_path, name):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    # 计算昨天的日期
    yesterday = datetime.now() - timedelta(days=1)
    yesterday_str = yesterday.strftime('%Y-%m-%d')
    # 计算明天的日期
    tommorrow = datetime.now() + timedelta(days=1)
    tommorrow_str = tommorrow.strftime('%Y-%m-%d')
    # 删去所有日期在昨天之前的数据
    cursor.execute(f"DELETE FROM {name} WHERE time < ?", (yesterday_str,))
    # 删去数据库中字段time没有不含小时的字段
    cursor.execute(f"SELECT type1 FROM {name}")
    rows = cursor.fetchall()
    for row in rows:
        if (row[0] == "降水量预报"):
            typename = '"降水量预报"'
            cursor.execute(f"DELETE FROM {name} WHERE type1 = {typename} and time < ?", (tommorrow_str,))
    conn.commit()
    conn.close()