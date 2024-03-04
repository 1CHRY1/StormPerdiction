## 所需数据
## 条目数
## 字段名
## x  y  ZetaDif
import os

import netCDF4 as nc
import sys
import numpy as np

args = sys.argv

if len(args) < 3:
    print("未传入正确数量参数")
    sys.exit(1)

fort = nc.Dataset(args[1], 'r')
adcirc = nc.Dataset(args[2], 'r')

xes = fort.variables['x'][:]
yes = fort.variables['y'][:]
# xes2 = adcirc.variables['x'][:] # same as xes
# yes2 = adcirc.variables['y'][:] # same as yes

fort_z = fort.variables['zeta'][:]
adcirc_z = adcirc.variables['zeta'][:]

timeCount = 0
allTime = 2
# allTime = 2
rootPath = os.path.dirname(__file__) + '/output'
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
    with open(rootPath + '/Add' + '/zeta_XYDIF_' + str(i) + '.txt', 'w') as file:
        file.write(str(len(zetaDifs[i])) + '\n')
        file.write('X Y ZetaDif\n')
        print("======writing-item-" + str(i) + "-========")
        for index in validIndex[i]:
            file.write(str(xes[index]) + space)
            file.write(str(yes[index]) + space)
            file.write(str(adcirc_z[i][index] - fort_z[i][index]) + '\n')

print("=====zeta pocessing finish======")
