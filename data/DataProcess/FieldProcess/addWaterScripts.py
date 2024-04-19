"""
File: addWaterScripts.py
Created:2024-04-12
Description:IDW + Contour + maskClip + intersection
"""

from osgeo import gdal, ogr, gdalconst, osr
from geotiff import GeoTiff
import numpy as np
from PIL import Image
from matplotlib.colors import LinearSegmentedColormap
import os
import shutil
import netCDF4 as nc
import sys
import math


def writeAddWatertxt(adcircNC, fortNC, txtDir):
    fort = nc.Dataset(fortNC, 'r')
    adcirc = nc.Dataset(adcircNC, 'r')
    xes = fort.variables['x'][:]
    yes = fort.variables['y'][:]
    a = fort.variables.keys()
    if ('zeta' not in a):
        print(f"===ERROR::{fortNC} DO NOT HAVE ZETA VARIABLE==")
        sys.exit(1)

    fort_z = fort.variables['zeta'][:]
    adcirc_z = adcirc.variables['zeta'][:]

    # allTime = len(adcirc_z)
    allTime = 1
    print(f'total time step : {allTime}')
    space = '    '
    abnormal = '--'
    rootPath = txtDir

    if not os.path.exists(rootPath + '/zeta'):
        os.makedirs(rootPath + '/zeta')
        print(f"文件夹 '{rootPath + '/zeta'}' 创建成功。")
    # else:
        print(f"文件夹 '{rootPath + '/zeta'}' 已存在。")

    timecount = 0
    while timecount < allTime:
        with open(rootPath + '/zeta' + '/zeta_XYDIF_' + str(timecount) + '.txt', 'w') as file:
            print("======Writing-file-" + str(timecount) + "-========")
            for i in range(len(xes)):
                if xes[i] <= 125 and xes[i] >= 117.5 and yes[i] <= 34 and yes[i] >= 29:
                    file.write(str(xes[i]) + space)
                    file.write(str(yes[i]) + space)
                    if str(fort_z[timecount][i]) == abnormal:
                        fort_z[timecount][i] = 0
                    if str(adcirc_z[timecount][i]) == abnormal:
                        adcirc_z[timecount][i] = 0
                    file.write(str(adcirc_z[timecount][i] - fort_z[timecount][i]) + '\n')
        timecount += 1

    print(f'write zeta txt finish!')
    return allTime


def hex2rgb(color):
    b = (color & 0xFF)
    g = ((color >> 8) & 0xFF)
    r = ((color >> 16) & 0xFF)

    return (r, g, b);


def getRGB2(value):
    rampColors0 = [0x3288bd, 0x66c2a5, 0xabdda4, 0xe6f598, 0xfee08b, 0xfdae61, 0xf46d43, 0xd53e4f]
    bot = math.floor(value * 7.0)
    top = math.ceil(value * 7.0)
    a = value * 7.0 - bot

    botColor = hex2rgb(rampColors0[bot])
    topColor = hex2rgb(rampColors0[top])
    resultColor = [0, 0, 0]
    for i in range(0, 3):
        resultColor[i] = botColor[i] * (1 - a) + topColor[i] * a;
    return resultColor;


def txtToPointshp(txtFile, outputShp):
    print("==creating POINT shapefile==")
    ds = ogr.GetDriverByName('ESRI Shapefile').CreateDataSource(outputShp)
    spatial_ref = osr.SpatialReference()
    spatial_ref.ImportFromEPSG(4326)

    pointLy = ds.CreateLayer('point', spatial_ref)

    def_feature = pointLy.GetLayerDefn()

    field_defn = ogr.FieldDefn("Id", ogr.OFTInteger)
    pointLy.CreateField(field_defn)
    field_defn = ogr.FieldDefn("x", ogr.OFTReal)
    pointLy.CreateField(field_defn)
    field_defn = ogr.FieldDefn("y", ogr.OFTReal)
    pointLy.CreateField(field_defn)
    field_defn = ogr.FieldDefn("addWater", ogr.OFTReal)
    pointLy.CreateField(field_defn)
    with open(txtFile, 'r') as file:
        line = file.readline()
        count = 0
        while line:
            linedt = line.split()
            x = float(linedt[0])
            y = float(linedt[1])

            if x < 117.5 or x > 125.0 or y < 29 or y > 34:
                line = file.readline()
                continue;

            addWater = float(linedt[2])
            feature = ogr.Feature(def_feature)
            feature.SetField("Id", count)
            feature.SetField("x", x)
            feature.SetField("y", y)
            feature.SetField("addWater", addWater)
            geometry = ogr.Geometry(ogr.wkbPoint)
            geometry.AddPoint(x, y)
            feature.SetGeometry(geometry)
            pointLy.CreateFeature(feature)
            count = count + 1
            line = file.readline()

    del ds


def idw(inputshpfile, outputfile):
    print('==IDW excuting...==')

    # Get the bounding box of the input shapefile
    shp = ogr.Open(inputshpfile)
    x_min, x_max, y_min, y_max = shp.GetLayer().GetExtent()

    # Define the desired resolution
    resolution = 0.01  # meters

    width = int((x_max - x_min) / resolution)
    height = int((y_max - y_min) / resolution)

    options = gdal.GridOptions(
        algorithm="invdist:power=4.0:smoothing=0.1:radius1=0.0:radius2=0.0:angle=0.0:max_points=0:min_points=0:nodata=0.0",
        format="GTiff", zfield="addWater", outputType=gdal.GDT_Float32, width=width, height=height)
    gdal.Grid(destName=outputfile, srcDS=inputshpfile, options=options)


def contour(inputTIFfile, outputfile):
    print('==contour-generating==')

    driverRaster = gdal.GetDriverByName('GTiff')
    driverRaster.Register()
    ds = gdal.Open(inputTIFfile, gdalconst.GA_ReadOnly)
    band = ds.GetRasterBand(1)
    t = band.ComputeRasterMinMax()
    contourDs = ogr.GetDriverByName('ESRI Shapefile').CreateDataSource(outputfile)
    spatial_ref = osr.SpatialReference()
    spatial_ref.ImportFromEPSG(4326)
    contourShp = contourDs.CreateLayer('countour', spatial_ref)

    field_defn = ogr.FieldDefn("Id", ogr.OFTInteger)
    contourShp.CreateField(field_defn)
    field_defn = ogr.FieldDefn("addWater", ogr.OFTReal)
    contourShp.CreateField(field_defn)

    if (t[1] - t[0] < 0.00001):
        print("全是0，没必要")
        dataOK = 0
        contourGap = 0.001;
    else:
        dataOK = 1
        contourGap = (t[1] - t[0]) / 10

    print(f"==contourGap=={contourGap}==")

    gdal.ContourGenerate(band, round(contourGap, 3), 0, [], 0, 0, contourShp, 0, 1)
    del ds, contourDs

    return dataOK


def maskClip_raster(ogTifFile, maskShpFile, outputFile):
    print('==geotiff warp start==')
    print(maskShpFile)

    options = gdal.WarpOptions(format='GTiff', cutlineDSName=maskShpFile, cropToCutline=True)

    gdal.Warp(outputFile, ogTifFile, options=options)


def maskClip_vector(ogShpFile, maskShpFile, outputFile):
    print('==contour warp start==')

    driver = ogr.GetDriverByName("ESRI Shapefile")

    ## border layer
    boudDs = driver.Open(maskShpFile, 1)
    boundLy = boudDs.GetLayer(0)

    ## og layer
    ogDs = driver.Open(ogShpFile, 1)
    ogLy = ogDs.GetLayer()

    ## out layer
    outDs = driver.CreateDataSource(outputFile)
    outLy = outDs.CreateLayer('contourRes', ogLy.GetSpatialRef())
    field_defn = ogr.FieldDefn("Id", ogr.OFTReal)
    outLy.CreateField(field_defn)
    field_defn = ogr.FieldDefn("addWater", ogr.OFTReal)
    outLy.CreateField(field_defn)
    def_feature = outLy.GetLayerDefn()

    ## 全是0的数据 flag -> 1
    flag = 0

    for feature in boundLy:
        geometry = feature.GetGeometryRef()
        count = 0
        for ogft in ogLy:
            adw = ogft.GetField('addWater')
            ogGeo = ogft.GetGeometryRef()
            inter = ogGeo.Intersection(geometry).Clone()
            outfeature = ogr.Feature(def_feature)
            outfeature.SetGeometry(inter)
            outfeature.SetField('Id', count)
            outfeature.SetField("addWater", int(adw * 1000) / 1000)
            outLy.ResetReading()
            outLy.CreateFeature(outfeature)
            count = count + 1

    del boudDs, ogDs, outDs


def shp2geojson(shp_file, geojson_file):
    print('==convert Shapefile to Geojson==')
    src_ds = ogr.Open(shp_file)
    src_layer = src_ds.GetLayer(0)
    fc = src_layer.GetFeatureCount()

    # 创建结果Geojson
    baseName = 'contour'
    dst_driver = ogr.GetDriverByName('GeoJSON')
    dst_ds = dst_driver.CreateDataSource(geojson_file)

    dst_layer = dst_ds.CreateLayer(baseName, src_layer.GetSpatialRef())
    dst_layer.CreateFields(src_layer.schema)
    dst_feat = ogr.Feature(dst_layer.GetLayerDefn())

    # 生成结果文件
    for feature in src_layer:
        dst_feat.SetGeometry(feature.geometry())
        for j in range(feature.GetFieldCount()):
            dst_feat.SetField(j, feature.GetField(j))
        dst_layer.CreateFeature(dst_feat)

    del dst_ds
    del src_ds


def geotiffToPng(geotifFile, outputFile):
    print('==converting geotiff to png==')

    tiff_file = geotifFile
    geo_tiff = GeoTiff(tiff_file, band=0)
    [row, col] = geo_tiff.tif_shape
    addWaterData = geo_tiff.read()

    data = np.array(addWaterData)

    max = data.max()
    min = data.min()
    rgbadata = []
    for r in range(row):

        line = []
        for c in range(col):
            if data[row - r - 1][c] == 0:
                alpha = 0
                uint8Value = 0
            else:
                alpha = 255
                uint8Value = int(((data[row - r - 1][c]) - min) / (max - min) * 255)

            rgb = getRGB2(uint8Value / 255)
            pixel = (rgb[0], rgb[1], rgb[2], alpha)

            line.append(pixel)
        rgbadata.append(line)

    rgba_data = np.array(rgbadata, dtype=np.uint8)

    # 创建 Pillow Image 对象
    image = Image.fromarray(rgba_data, 'RGBA')

    image.save(outputFile)
    print('==========convert finish=============')
    # del geo_tiff, addWaterData


def clearFolder(folder_path):
    if os.path.exists(folder_path):
        shutil.rmtree(folder_path, ignore_errors=True)
        # os.makedirs(folder_path)
        print(f"Folder --'{folder_path}' cleared.")
    else:
        print(f"Folder --'{folder_path}' not found.")


def createFolder(folder_path):
    try:
        os.makedirs(folder_path)
        print(f"Folder '{folder_path}' created successfully.")
    except FileExistsError:
        print(f"Folder '{folder_path}' already exists.")


def getAddWaterOneTxt(txtfile, rootPath, maskShpPath):
    ## getfile id
    name = (txtfile.split('zeta_XYDIF_'))[1]
    id = name.split('.')[0]

    ## 000 create Temp folder
    createFolder(rootPath + '/temp')
    createFolder(rootPath + '/out')

    ## bound.shp is static

    ## 001 from txt to point.shp
    txt = txtfile
    pointshp = rootPath + f'/temp/point_{id}.shp'

    ## 002  og data
    srcpoint_shp = pointshp
    clipbound_shp = maskShpPath

    ## 003 temp data
    idwtif = rootPath + f'/temp/idw_{id}.geotiff'
    ogContour = rootPath + f'/temp/ogCountour_{id}.shp'

    ## 004 result data
    outTif = rootPath + f'/temp/addWater_{id}.geotiff'
    outCountour = rootPath + f'/temp/contour_{id}.shp'

    ## 005 postProcess
    outPng = rootPath + f'/out/addWater_{id}.png'
    outGeojson = rootPath + f'/out/contour_{id}.geojson'

    # ## logic following.....
    txtToPointshp(txt, pointshp)
    idw(srcpoint_shp, idwtif)
    dataOK = contour(idwtif, ogContour)
    maskClip_raster(idwtif, clipbound_shp, outTif)
    maskClip_vector(ogContour, clipbound_shp, outCountour)
    shp2geojson(outCountour, outGeojson)
    geotiffToPng(outTif, outPng)

    print(f"=======zeta-{id}===OK==========")


if __name__ == '__main__':
    args = sys.argv
    # adcNC = 'D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/9711/adcirc9711_addwind.nc'
    # fortNC = 'D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/9711/tianwenchao_63.nc'
    # outputDir = 'D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/9711'
    # clipbound_shp = 'D:/1study/Work/2023_12_22_Storm/StormPerdiction/data/DataProcess/FieldProcess/add/add/mask/mask.shp'
    adcNC = args[1]
    fortNC = args[2]
    outputDir = args[3]
    clipbound_shp = args[4]

    # step 1 :: nc -> txt
    alltime = writeAddWatertxt(adcircNC=adcNC, fortNC=fortNC, txtDir=outputDir)

    # step 2 :: txt -> add water
    # getAddWaterOneTxt(txtfile=outputDir + '/zeta' + '/zeta_XYDIF_' + str(3) + '.txt', rootPath=outputDir,
    #                   maskShpPath=clipbound_shp)
    for i in range(0, alltime):
        getAddWaterOneTxt(txtfile=outputDir + '/zeta' + '/zeta_XYDIF_' + str(i) + '.txt',
                          rootPath=outputDir, maskShpPath=clipbound_shp)

    # step 3 :: clear temp dir
    clearFolder(outputDir + '/temp')
