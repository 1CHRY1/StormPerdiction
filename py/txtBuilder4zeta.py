## 所需数据
## 条目数
## 字段名
## x  y  ZetaDif

import netCDF4 as nc
import numpy as np

filePathes = [
    './resource/adcirc_addwind.nc',  # u,v,wx,wy    valid: flow3 wind2
    './resource/fort.63_nowind.nc',  # z
    './resource/fort.64_nowind.nc',  # u,v          valid：flow8
    './resource/adcirc_addwind_FULL.nc'
]
fort = nc.Dataset(filePathes[1], 'r')
adcirc = nc.Dataset(filePathes[3], 'r')

xes = fort.variables['x'][:]
yes = fort.variables['y'][:]
# xes2 = adcirc.variables['x'][:] # same as xes
# yes2 = adcirc.variables['y'][:] # same as yes

fort_z = fort.variables['zeta'][:]
adcirc_z = adcirc.variables['zeta'][:]

timeCount = 0
allTime = len(adcirc_z)
# allTime = 10
rootPath = './output/zetaDif'
space = '    '
abnormal = adcirc_z[0][61590]  # --
validCount = 0
validIndex = []
zetaDifs = []

while timeCount < allTime:
    print("======checking-item-" + str(timeCount) + "-========")
    validCount = 0
    errCount = 0
    zetaDif = []
    validID = []
    for i in range(len(xes)):
        if (adcirc_z[timeCount][i] is abnormal or fort_z[timeCount][i] is abnormal):
            continue
        else:
            zetaDif.append(adcirc_z[timeCount][i] is abnormal or fort_z[timeCount][i] is abnormal)
            validID.append(i)
            validCount = validCount + 1
    # print(f"errorCount:{errCount}, validCount:{validCount}, total:{len(xes)}")
    zetaDifs.append(zetaDif)
    validIndex.append(validID)
    timeCount = timeCount + 1


for i in range(len(zetaDifs)):  # 144
    # print(len(zetaDifs[i]))
    # print(len(validIndex[i]))
    with open(rootPath + '/zeta_XYDIF_' + str(i) + '.txt', 'w') as file:
        file.write(str(len(zetaDifs[i])) + '\n')
        file.write('X Y ZetaDif\n')
        print("======writing-item-" + str(i) + "-========")
        for index in validIndex[i]:
            file.write(str(xes[index]) + space)
            file.write(str(yes[index]) + space)
            file.write(str(adcirc_z[i][index] - fort_z[i][index]) + '\n')

print("=====zeta pocessing finish======")
