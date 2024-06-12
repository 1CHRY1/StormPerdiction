import sys, json, os
from datetime import datetime, timedelta
from Utils.DataUtils import DataUtils, UpdateData_mysql
from scipy.io import loadmat

# dataprocess_path = "D:\1study\Work\2023_12_22_Storm\StormPerdiction\data\DataProcess"

def main():
    dataUtils = DataUtils()
    args = sys.argv
    if len(args) < 2:
        print("未传入正确数量参数")
        sys.exit(1)

    # sqlite数据库配置
    dataprocess_path = args[1]
    db_path_Forcasting = dataprocess_path + '/Forcasting.db'
    db_path_NC = dataprocess_path + '/NC.db'
    stations_path = dataprocess_path + '/station_service.json'
    with open(stations_path, 'r', encoding='utf-8') as file:
        stations = json.load(file)
    folderPath = os.path.dirname(dataprocess_path) + "/forecastData"
    folderPath = folderPath.replace(os.sep, '/')
    folders = os.listdir(folderPath)
    for folder in folders:
        current_time = datetime.now().strftime("%Y%m%d")
        if (len(folder) != 8 or folder != current_time):
            continue
        Path = folderPath + "/" + folder
        print("****************" + folder + " begin!" + "****************")
        time = datetime.strptime(folder, "%Y%m%d")
        manual = 0
        # UpdateData_mysql(Path, time)
        try:
            txtPath = os.path.join(Path, "ifTyph.txt")
            if (dataUtils.JudgeIfTyph(txtPath) == True):
                # 存在台风
                dataUtils.insert_iftyph(db_path_Forcasting, time, 1, 0)
                files = os.listdir(Path)
                hyubao = []
                hpre = []
                for file in files:
                    # 文件名称
                    name = os.path.splitext(file)[0]
                    # # 处理mat数据
                    # if file.endswith(".mat"):
                    #     # 去掉尾部数字
                    #     name = get_prefix_before_digits(name)
                    #     # 判断是否是以addwind结尾
                    #     if name.endswith("addwind"):
                    #         addwind = 1
                    #         name = name[:-len("addwind")]
                    #     else:
                    #         addwind = 0
                    #     mat_path = os.path.join(Path, file)
                    #     mat_data = loadmat(mat_path)
                    #     try:
                    #         hyubao = mat_data['hyubao']
                    #         # 将预报数据存入数据库
                    #         insert_typhdata(db_path_Forcasting, name, time, addwind, hyubao, manual)
                    #     except Exception as e:
                    #         print(e)

                    # 处理精度评定结果数据
                    if os.path.basename(file) == "result.txt":
                        path = Path + "/" + file
                        filename = "result.txt"
                        type = "result"
                        dataUtils.insert_NCdata(db_path_NC, time, type, path, filename, manual)

                    # 处理nc数据
                    if file.endswith(".nc"):
                        path = Path + "/" + file
                        filename = os.path.basename(file)
                        if name == "adcirc_addwind":
                            type = "adcirc"
                            zeta = dataUtils.nc2array(path)
                            dataUtils.insert_NCdata(db_path_NC, time, type, path, filename, manual)
                            hyubao = dataUtils.getZetaFromArray(zeta, stations)
                        if name == "fort.63_nowind":
                            type = "fort63"
                            zeta = dataUtils.nc2array(path)
                            dataUtils.insert_NCdata(db_path_NC, time, type, path, filename, manual)
                            hpre = dataUtils.getZetaFromArray(zeta, stations)
                        if hyubao != [] and hpre != []:
                            for i in range(len(hyubao)):
                                name = hyubao[i].get("name")
                                hyubao_data = hyubao[i].get("data")
                                hpre_data = hpre[i].get("data")
                                hadd_data = hyubao_data - hpre_data
                                dataUtils.insert_typhdata(db_path_Forcasting, name, time, hpre_data.tolist(),
                                                hyubao_data.tolist(), hadd_data.tolist(), manual)
                            break

                    print(os.path.basename(file))

            else:
                # 不存在台风
                dataUtils.insert_iftyph(db_path_Forcasting, time, 0, 0)
                files = os.listdir(Path)
                for file in files:
                    # 文件名称
                    name = os.path.splitext(file)[0]
                    # 处理mat数据
                    if file.endswith(".mat"):
                        # 获取站点名称
                        name = os.path.splitext(file)[0]
                        # 去掉尾部数字
                        name = dataUtils.get_prefix_before_digitsV2(name)
                        # if name == "xuliujing":
                        #     continue
                        # elif name == "xuliujing1":
                        #     name = "xuliujing"

                        mat_path = os.path.join(Path, file)
                        mat_data = loadmat(mat_path)
                        try:
                            hpre_list = dataUtils.list_process(mat_data['hpre'])
                            hpre = [0.0 if value is None else value for value in hpre_list]
                            hshice_list = dataUtils.list_process(mat_data['hshice'])
                            hshice = [0.0 if value is None else value for value in hshice_list]
                            hybresult_list = dataUtils.list_process(mat_data['hybresult'])
                            hybresult = [0.0 if value is None else value for value in hybresult_list]
                            # 将预报数据存入数据库
                            dataUtils.insert_Nottyphdata(db_path_Forcasting, name, time,hpre, hshice, hybresult, manual)
                        except Exception as e:
                            print(name+" 没有字段 " +str(e))
                    # 处理nc数据
                    if file.endswith(".nc"):
                        if name == "adcirc_addwind":
                            type = "adcirc"
                            path = Path + "/" + file
                            filename = os.path.basename(file)
                            dataUtils.insert_NCdata(db_path_NC, time, type, path, filename, manual)

                    # 处理精度评定结果数据
                    if os.path.basename(file) == "result.txt":
                        path = Path + "/" + file
                        filename = "result.txt"
                        type = "result"
                        dataUtils.insert_NCdata(db_path_NC, time, type, path, filename, manual)

                    print(os.path.basename(file))

            print("****************" + folder + " finished!" + "****************")
            print()

        except Exception as e:
            print(folder + f" accidentally break because of {e}")
            continue

if __name__ == "__main__":
    main()