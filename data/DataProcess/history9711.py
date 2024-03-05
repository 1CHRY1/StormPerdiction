import json
import os
import netCDF4 as nc

def nc2array(filepath):
    # 将nc数据读取为array'
    ncfile = nc.Dataset(filepath, "r", format='NETCDF3_CLASSIC')
    zeta = ncfile["zeta"][:]
    return zeta

def getZetaFromArray(array, stations):
    result = []
    for name, info in stations.items():
        row = info.get("row")
        data = array[:,row]
        result.append({"name":name, "data":data})
    return result


stations_path = 'station.json'
with open(stations_path, 'r', encoding='utf-8') as file:
    stations = json.load(file)
folderPath = os.path.abspath(os.pardir) + "/9711"
folderPath = folderPath.replace(os.sep, '/')
files = os.listdir(folderPath)
result = []
hyubao = []
hpre = []
for file in files:
    path = folderPath + "/" + file
    if os.path.basename(file) == "adcirc9711_addwind.nc":
        zeta = nc2array(path)
        hyubao = getZetaFromArray(zeta, stations)
    if os.path.basename(file) == "tianwenchao_63.nc":
        type = "fort63"
        zeta = nc2array(path)
        hpre = getZetaFromArray(zeta, stations)
    if hyubao != [] and hpre != []:
        for i in range(len(hyubao)):
            name = hyubao[i].get("name")
            hyubao_data = hyubao[i].get("data")
            hpre_data = hpre[i].get("data")
            hadd_data = hyubao_data - hpre_data
            hyubao_data = hyubao_data.tolist()
            hpre_data = hpre_data.tolist()
            hadd_data = hadd_data.tolist()
            result_item = {"name":name,"hyubao":hyubao_data,"hpre":hpre_data,"hadd":hadd_data}
            result.append(result_item)
        break
file_path = "D:/1study/Work/2023_12_22_Storm/stormPrediction/data/9711/9711.json"
with open(file_path, "w") as json_file:
    json.dump(result, json_file, indent=4)