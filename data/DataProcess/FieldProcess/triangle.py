import math
import json

import numpy as np
from scipy.spatial import Delaunay, distance


def getOGData(filepath):
    points = []
    attrib = []
    with open(filepath, 'r') as file:
        file.readline()
        file.readline()
        line = file.readline()
        while line:
            data = line.split()
            lon = float(data[0])
            lat = float(data[1])
            lon = (180.0 + lon) / 360.0;
            lat = (180.0 - (180.0 / math.pi * math.log(math.tan(math.pi / 4.0 + lat * math.pi / 360.0)))) / 360.0;
            atb = float(data[2])
            points.append([lon, lat])
            attrib.append(atb)
            line = file.readline()
    print("getOGData --- points --- attrib")
    return points, attrib


def triangulation(points):
    tri = Delaunay(points)
    tri_points = tri.points.tolist()
    tri_indexes = tri.vertices.tolist()
    return tri_points, tri_indexes


def writeToJson(txtpath, jsonpath):
    ogpoints, ogattribs = getOGData(txtpath)
    points, indexes = triangulation(ogpoints)
    validIndexes = processTri(points, indexes)
    attribBoundary = {
        "max": max(ogattribs),
        "min": min(ogattribs)
    }

    with open(jsonpath, 'w') as jsonfile:
        print(f"=======writing {jsonpath}==========")
        jsonobj = {
            "vertex": points,
            "index": validIndexes,
            "attrib": ogattribs,
            "attribBoundary": attribBoundary,
        }
        json.dump(jsonobj, jsonfile, indent=2)


def writeAlltoJson():
    for i in range(0, 144):
        txtpath = f"./output/Add/zeta_XYDIF_{i}.txt"
        jsonpath = f"../../Field/Add/zetaTri_{i}.json"
        writeToJson(txtpath, jsonpath)


def processTri(points, indexes):
    lens = []
    validIndexes = []
    maxLen = 0.002
    print(len(indexes))
    for id in range(0, len(indexes)):
        a = points[indexes[id][0]]
        b = points[indexes[id][1]]
        c = points[indexes[id][2]]
        # print(f"======={id} triangle=========")
        # print(f"P1：{a}，P2:{b},P3:{c}")
        ab = distance.euclidean(a, b)
        ac = distance.euclidean(a, c)
        bc = distance.euclidean(b, c)
        # print(f"L1：{ab}，L2:{ac},L3:{bc}")
        lens.append(ab)
        lens.append(ac)
        lens.append(bc)
        if ac > maxLen or ab > maxLen or bc > maxLen:
            continue;
        else:
            validIndexes.append(indexes[id])

    print('=========result============')
    # print(max(lens))
    # print(min(lens))
    # print(sum(lens)/len(lens))
    print(len(validIndexes))
    return validIndexes


    # print(sorted(lens)[len(lens) // 2] if len(lens) % 2 != 0 else (sorted(lens)[len(lens) // 2 - 1] + sorted(lens)[len(lens) // 2]) / 2)

# writeToJson("./output/zetaDif/zeta_XYDIF_0.txt","zetaTri_1.json")
# writeToJson("./output/zetaDif/zeta_XYDIF_1.txt","zetaTri_2.json")
# writeToJson("./output/zetaDif/zeta_XYDIF_2.txt","zetaTri_3.json")
writeAlltoJson()