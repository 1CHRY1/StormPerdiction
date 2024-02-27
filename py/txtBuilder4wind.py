## 所需数据
## 条目数
## 字段名
## x  y windx  windy

import netCDF4 as nc
import numpy as np

filePathes = [
    './resource/adcirc_addwind.nc',  # u,v,wx,wy    valid: flow3 wind2
    './resource/fort.63_nowind.nc',  # z
    './resource/fort.64_nowind.nc',  # u,v          valid：flow8
    './resource/adcirc_addwind_FULL.nc'
]
filePath = filePathes[3]

dataset = nc.Dataset(filePath, "r", format='NETCDF3_CLASSIC')

xes = dataset.variables['x'][:]
yes = dataset.variables['y'][:]

UvelArr = dataset.variables['u-vel'][:]
VvelArr = dataset.variables['v-vel'][:]
WxArr = dataset.variables['windx'][:]
WyArr = dataset.variables['windy'][:]

allTime = 144
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
        # print(f"max Uvel == {max(UvelArr[timeCount])}")
        # print(f"min Uvel == {min(UvelArr[timeCount])}")
        # print(f"max Vvel == {max(VvelArr[timeCount])}")
        # print(f"min Vvel == {min(VvelArr[timeCount])}")
        # print(f"max WX == {max(WxArr[timeCount])}")
        # print(f"min WX == {min(WxArr[timeCount])}")
        # print(f"max WY == {max(WyArr[timeCount])}")
        # print(f"min WY == {min(WyArr[timeCount])}")
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
        for i in range(len(WxArr[timeCount])):
            if WxArr[timeCount][i] is abnormal or WyArr[timeCount][i] is abnormal:
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
        with open(rootPath + '/wind' + '/wind_XYWind_' + str(timecount) + '.txt', 'w') as file:
            file.write(str(nums[timecount])+'\n')
            file.write('X Y WINDX WINDY\n')
            print("======Writing-file-" + str(timecount) + "-========")
            for index in indexes[timecount]:
                file.write(str(xes[index])+space)
                file.write(str(yes[index])+space)
                file.write(str(WxArr[timecount][index])+space)
                file.write(str(WyArr[timecount][index])+'\n')



# nullDataCheck()
validNums, validIndexes = getValidData()
writeFile(validNums,validIndexes)


# for i in range(len(validItemIndex)):
#     # 文件写入
#     validIndex = validItemIndex[i]
#     with open(rootPath + '/adcirc_addwind'+ '/wind_XYUV_' + str(validIndex) + '.txt', 'w') as file:
#         file.write(str(len(xes)) + '\n')
#         file.write('X Y U V WX WY\n')
#         print("======pocesssing-item-" + str(validIndex) + "-========")
#         for i in range(len(xes)):
#             file.write(str(xes[i]) + space)
#             file.write(str(yes[i]) + space)
#             file.write(str(UvelArr[validIndex][i]) + space)
#             file.write(str(VvelArr[validIndex][i]) + space)
#             file.write(str(WxArr[validIndex][i]) + space)
#             file.write(str(WyArr[validIndex][i]) + '\n')
#
# print(str(validItemNum) + "个文件已经写入至" + rootPath)
