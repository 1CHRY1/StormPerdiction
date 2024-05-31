import struct
from osgeo import osr
import json
import netCDF4 as nc
import os
import sys

def writeTXT_flow(ncfilePath, txtDir):
    ## read nc
    filePath = ncfilePath
    dataset = nc.Dataset(filePath, "r", format='NETCDF3_CLASSIC')
    xes = dataset.variables['x'][:]
    yes = dataset.variables['y'][:]
    UvelArr = dataset.variables['u-vel'][:]
    VvelArr = dataset.variables['v-vel'][:]

    ## global parameters
    allTime = len(UvelArr)
    # allTime = 2
    print(f'total time step : {allTime}')
    rootPath = txtDir
    space = '    '
    abnormal = '--'

    if not os.path.exists(rootPath + '/flow'):
        os.makedirs(rootPath + '/flow')
        print(f"文件夹 '{rootPath + '/flow'}' 创建成功。")
    else:
        print(f"文件夹 '{rootPath + '/flow'}' 已存在。")

    timecount = 0
    while timecount < allTime:
        with open(rootPath + '/flow' + '/flow_XYUV_' + str(timecount) + '.txt', 'w') as file:
            print("======Writing-file-" + str(timecount) + "-========")
            for i in range(len(xes)):
                if xes[i] <= 125 and xes[i] >= 117.5 and yes[i] <= 34 and yes[i] >= 29:
                    file.write(str(xes[i]) + space)
                    file.write(str(yes[i]) + space)
                    if str(UvelArr[timecount][i]) == abnormal:
                        UvelArr[timecount][i] = 0
                    if str(VvelArr[timecount][i]) == abnormal:
                        VvelArr[timecount][i] = 0
                    file.write(str(UvelArr[timecount][i]) + space)
                    file.write(str(VvelArr[timecount][i]) + '\n')

        timecount += 1

    print(f'write flow txt finish!')
    return allTime

def writeTXT_wind(ncfilePath, txtDir):
    ## read nc
    filePath = ncfilePath
    dataset = nc.Dataset(filePath, "r", format='NETCDF3_CLASSIC')
    xes = dataset.variables['x'][:]
    yes = dataset.variables['y'][:]
    WxArr = dataset.variables['windx'][:]
    WyArr = dataset.variables['windy'][:]

    ## global parameters
    allTime = len(WxArr)
    # allTime = 2
    print(f'total time step : {allTime}')
    rootPath = txtDir
    space = '    '
    abnormal = '--'

    if not os.path.exists(rootPath + '/wind'):
        os.makedirs(rootPath + '/wind')
        print(f"文件夹 '{rootPath + '/wind'}' 创建成功。")
    else:
        print(f"文件夹 '{rootPath + '/wind'}' 已存在。")

    timecount = 0
    while timecount < allTime:
        with open(rootPath + '/wind' + '/wind_XYUV_' + str(timecount) + '.txt', 'w') as file:
            print("======Writing-file-" + str(timecount) + "-========")
            for i in range(len(xes)):
                if xes[i] <= 131.5 and xes[i] >= 117 and yes[i] <= 41.5 and yes[i] >= 22:
                    file.write(str(xes[i]) + space)
                    file.write(str(yes[i]) + space)
                    if str(WxArr[timecount][i]) == abnormal:
                        WyArr[timecount][i] = 0
                    if str(WxArr[timecount][i]) == abnormal:
                        WyArr[timecount][i] = 0
                    file.write(str(WxArr[timecount][i]) + space)
                    file.write(str(WyArr[timecount][i]) + '\n')

        timecount += 1

    print(f'write wind txt finish!')
    return allTime



def parseLineList(lineList, hours):
    sourceX = lineList[0]
    sourceY = lineList[1]

    uvs = [(lineList[2 + i * 2 + 0], lineList[2 + i * 2 + 1]) for i in range(hours)]

    return sourceX, sourceY, uvs


class Station:
    def __init__(self, sourceX, sourceY, uvs):
        self.sourceCoord = (sourceX, sourceY)
        self.uvs = uvs
        self.targetCoord = (0, 0)


def setupTransform(sourceEPSG, targetEPSG):
    source = osr.SpatialReference()
    target = osr.SpatialReference()
    source.ImportFromEPSG(sourceEPSG)
    target.ImportFromEPSG(targetEPSG)
    return osr.CoordinateTransformation(source, target)


def batchConvertCoords(coords, transform: osr.CoordinateTransformation):
    tranformedCoords = transform.TransformPoints(coords)

    return [(coord[1], coord[0]) for coord in tranformedCoords]


def writeFile(outputDir, stations, timeCount):

    if not os.path.exists(outputDir):
        os.makedirs(outputDir)
        print(f"文件夹 '{outputDir}' 创建成功。")
    else:
        print(f"文件夹 '{outputDir}' 已存在。")

    stationFile = f"station.bin"
    with open(outputDir + stationFile, 'wb') as bin_file:
        for station in stations:
            position = struct.pack('ff', station.targetCoord[0], station.targetCoord[1])
            bin_file.write(position)
    for i in range(timeCount):
        fileName = f"uv_{i}.bin"
        with open(outputDir + fileName, 'wb') as uv_bin_file:
            for station in stations:
                uv = struct.pack("ff", station.uvs[i][0], station.uvs[i][1])
                uv_bin_file.write(uv)


def parseTxt_9711wind(fileName):
    stations = []

    def have(stations, x, y):
        for index in range(len(stations)):
            if stations[index].sourceCoord == (x, y):
                return index
        return -1

    with open(fileName, 'r') as txt:
        head = txt.readline()
        data = txt.readlines()
    index = 0
    firstIndex = 0
    nextIndex = 0
    for line in data:
        line = line.split('\t')
        line = [float(x) for x in line]
        x = line[0]
        y = line[1]
        if x == 117.25 and y == 41.5:
            if firstIndex == 0:
                firstIndex = index
            elif nextIndex == 0:
                nextIndex = index
            else:
                break;
        index = index + 1

    stationCount = nextIndex - firstIndex;
    print(f"Stationcount::{stationCount}")

    index = 0
    timeCount = 0
    for line in data:
        line = line.split('\t')
        line = [float(x) for x in line]
        x = line[0]
        y = line[1]
        if x == 117.25 and y == 41.5:
            timeCount = timeCount + 1
        index = index + 1
    print(f"TimeCount::{timeCount}")

    ## init stations
    for i in range(stationCount):
        line = data[i].split('\t')
        line = [float(x) for x in line]
        x = line[0]
        y = line[1]
        uvs = [(line[2], line[3])]
        station = Station(x, y, uvs)
        stations.append(station)

    while i < len(data):
        line = data[i].split('\t')
        line = [float(x) for x in line]
        sIndex = i % stationCount
        uvitem = (line[2], line[3])
        stations[sIndex].uvs.append(uvitem)
        i = i + 1

    return stations, timeCount


def parseTxt_9711flow(fileDir):
    alltime = 40
    timecount = 0
    stations = []

    # init stations

    filename = fileDir + f'flow_XYUV_{timecount}.txt'
    with open(filename, 'r') as txt:
        data = txt.readlines()
    for i in range(len(data)):
        line = data[i].split('    ')
        line = [float(item) for item in line]
        x = line[0]
        y = line[1]
        uvs = [(line[2], line[3])]
        station = Station(x, y, uvs)
        stations.append(station)

    timecount = timecount + 1

    while timecount < alltime:
        filename = fileDir + f'flow_XYUV_{timecount}.txt'
        with open(filename, 'r') as txt:
            data = txt.readlines()
        for i in range(len(data)):
            line = data[i].split('    ')
            line = [float(item) for item in line]
            uvitem = (line[2], line[3])
            sIndex = i
            stations[sIndex].uvs.append(uvitem)
        timecount = timecount + 1

    return stations, alltime


def parseTxt_normal(fileDir):
    alltime = 144
    timecount = 0
    stations = []

    # init stations
    # filename = fileDir + f'flow_XYUV_{timecount}.txt'
    filename = fileDir + f'wind_XYUV_{timecount}.txt'

    with open(filename, 'r') as txt:
        data = txt.readlines()
    for i in range(len(data)):
        line = data[i].split('    ')
        line = [float(item) for item in line]
        x = line[0]
        y = line[1]
        uvs = [(line[2], line[3])]
        station = Station(x, y, uvs)
        stations.append(station)

    timecount = timecount + 1

    while timecount < alltime:
        #        filename = fileDir + f'flow_XYUV_{timecount}.txt'
        filename = fileDir + f'wind_XYUV_{timecount}.txt'

        with open(filename, 'r') as txt:
            data = txt.readlines()
        for i in range(len(data)):
            line = data[i].split('    ')
            line = [float(item) for item in line]
            uvitem = (line[2], line[3])
            sIndex = i
            stations[sIndex].uvs.append(uvitem)
        timecount = timecount + 1

    return stations, alltime


def parseTxt_normalflow(fileDir, allTimeStep):
    alltime = allTimeStep
    timecount = 0
    stations = []

    # init stations
    filename = fileDir + f'flow_XYUV_{timecount}.txt'

    with open(filename, 'r') as txt:
        data = txt.readlines()
    for i in range(len(data)):
        line = data[i].split('    ')
        line = [float(item) for item in line]
        x = line[0]
        y = line[1]
        uvs = [(line[2], line[3])]
        station = Station(x, y, uvs)
        stations.append(station)

    timecount = timecount + 1

    while timecount < alltime:
        filename = fileDir + f'flow_XYUV_{timecount}.txt'

        with open(filename, 'r') as txt:
            data = txt.readlines()
        for i in range(len(data)):
            line = data[i].split('    ')
            line = [float(item) for item in line]
            uvitem = (line[2], line[3])
            sIndex = i
            stations[sIndex].uvs.append(uvitem)
        timecount = timecount + 1

    return stations


def parseTxt_normalwind(fileDir, allTimeStep):
    alltime = allTimeStep
    timecount = 0
    stations = []

    # init stations
    filename = fileDir + f'wind_XYUV_{timecount}.txt'

    with open(filename, 'r') as txt:
        data = txt.readlines()
    for i in range(len(data)):
        line = data[i].split('    ')
        line = [float(item) for item in line]
        x = line[0]
        y = line[1]
        uvs = [(line[2], line[3])]
        station = Station(x, y, uvs)
        stations.append(station)

    timecount = timecount + 1

    while timecount < alltime:
        filename = fileDir + f'wind_XYUV_{timecount}.txt'

        with open(filename, 'r') as txt:
            data = txt.readlines()
        for i in range(len(data)):
            line = data[i].split('    ')
            line = [float(item) for item in line]
            uvitem = (line[2], line[3])
            sIndex = i
            stations[sIndex].uvs.append(uvitem)
        timecount = timecount + 1
    return stations


def getExtent(stations):
    coords = []
    for s in stations:
        coords.append(list(s.sourceCoord))

    extent = [180.0, 85.05, -180.0, -85.05]
    for i in range(len(coords)):
        coord = coords[i]
        stations[i].targetCoord = coord
        extent[0] = coord[0] if coord[0] < extent[0] else extent[0]
        extent[1] = coord[1] if coord[1] < extent[1] else extent[1]
        extent[2] = coord[0] if coord[0] > extent[2] else extent[2]
        extent[3] = coord[1] if coord[1] > extent[3] else extent[3]
    return extent


def flow_dragon(ncfilepath, outputDIR):
    alltimeStep = writeTXT_flow(ncfilepath, outputDIR)

    stations = parseTxt_normalflow(outputDIR + '/Flow/', alltimeStep)
    print('get stations')

    extent = getExtent(stations)
    print(extent)

    writeFile(outputDIR + '/Flow/bin/', stations, alltimeStep)
    print('finish!!')


def wind_dragon(ncfilepath, outputDIR):
    alltimeStep = writeTXT_wind(ncfilepath, outputDIR)

    stations = parseTxt_normalwind(outputDIR + '/Wind/', alltimeStep)
    print('get stations')

    extent = getExtent(stations)
    print(extent)

    writeFile(outputDIR + '/Wind/bin/', stations, alltimeStep)
    print('finish!!')

# "D:\1study\Work\2023_12_22_Storm\stormPerdiction\data\forecastData\20240425\adcirc_addwind.nc" "D:\1study\Work\2023_12_22_Storm\stormPerdiction\data\Field"
if __name__ == '__main__':
    args = sys.argv
    if ( len(args) < 3 ):
        print("未传入正确数量参数")
        sys.exit(1)
    ncfile = args[1]
    outputdir = args[2]
    flow_dragon(ncfile, outputdir)
    print("flow resources are built successfully!")
    print("====================================")
    wind_dragon(ncfile,outputdir)
    print("wind resources are built successfully!")

