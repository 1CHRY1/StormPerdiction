## 所需数据
## 条目数
## 字段名
## x  y  u  v

import netCDF4 as nc
import numpy as np
import sys

args = sys.argv

if len(args) < 2:
    print("未传入正确数量参数")
    sys.exit(1)

filePath = args[1]

dataset = nc.Dataset(filePath, "r", format='NETCDF3_CLASSIC')

xes = dataset.variables['x'][:]
yes = dataset.variables['y'][:]

UvelArr = dataset.variables['u-vel'][:]
VvelArr = dataset.variables['v-vel'][:]
# WxArr = dataset.variables['windx'][:]
# WyArr = dataset.variables['windy'][:]

allTime = 144
# allTime = 2
rootPath = './output'
space = '    '
abnormal = UvelArr[0][25969]

def nullDataCheck():
    timeCount = 0
    validItemNum = 0
    validItemIndex = []
    while timeCount < allTime:
        # 数据检查
        # 非0条目检查
        print("======Checking-" + str(timeCount) + "-========")
        if (max(UvelArr[timeCount]) > 0 or min(UvelArr[timeCount]) < 0 or max(VvelArr[timeCount]) > 0 or min(
                VvelArr[timeCount]) < 0):
            validItemNum = validItemNum + 1
            validItemIndex.append(timeCount)
        # 异常条目排除
        if (min(UvelArr[timeCount]) < -100.0):
            validItemNum = validItemNum - 1
            validItemIndex.pop()

        timeCount = timeCount + 1

    print(f"validTimeNum==={validItemNum}")
    print(f"validTimeIndex==={validItemIndex}")


def getValidData():
    timeCount = 0
    validIndexes = []
    validNums = []

    while (timeCount < allTime):
        print(f'======Prepocessing-{timeCount}-=========')
        validNum = 0
        validIndex = []
        for i in range(len(UvelArr[timeCount])):
            if UvelArr[timeCount][i] is abnormal or VvelArr[timeCount][i] is abnormal:
                continue;
            else:
                validNum = validNum+1
                validIndex.append(i)
        print(f'validNum=={validNum}')
        validNums.append(validNum)
        validIndexes.append(validIndex)
        timeCount = timeCount + 1
    return validNums, validIndexes



def writeFile(nums,indexes):
    for timecount in range(len(nums)):
        with open(rootPath + '/Flow' + '/flow_XYUV_' + str(timecount) + '.txt', 'w') as file:
            file.write(str(nums[timecount])+'\n')
            file.write('X Y U V\n')
            print("======Writing-file-" + str(timecount) + "-========")
            for index in indexes[timecount]:
                file.write(str(xes[index])+space)
                file.write(str(yes[index])+space)
                file.write(str(UvelArr[timecount][index])+space)
                file.write(str(VvelArr[timecount][index])+'\n')



# nullDataCheck()
validNums, validIndexes = getValidData()
writeFile(validNums,validIndexes)


print("=====flow pocessing finish======")
