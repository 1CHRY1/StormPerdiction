import {
  IImageTypeAndTime,
  IImageTypeAndTimeResponse,
  IStormDataMap,
  IStormDataResponse,
  ImageType,
} from './type'

const nameMap: Record<string, string> = {
  weixingyuntu: '卫星云图',
  卫星云图: 'weixingyuntu',
  FY4Azhencaise: 'FY4A真彩色',
  FY4A真彩色: 'FY4Azhencaise',
  FY4Ahongwai: 'FY4A红外',
  FY4A红外: 'FY4Ahongwai',
  FY4Akejianguang: 'FY4A可见光',
  FY4A可见光: 'FY4Akejianguang',
  FY4Ashuiqi: 'FY4A水汽',
  FY4A水汽: 'FY4Ashuiqi',
  FY2Gkejianguang: 'FY2G可见光',
  FY2G可见光: 'FY2Gkejianguang',
  FY2Gzengqiangtu: 'FY2G增强图',
  FY2G增强图: 'FY2Gzengqiangtu',
  shuiqi: '水汽',
  水汽: 'shuiqi',
  hongwaiyi: '红外一',
  红外一: 'hongwaiyi',
  hongwaier: '红外二',
  红外二: 'hongwaier',
  FY2Gheibaitu: 'FY2G黑白图',
  FY2G黑白图: 'FY2Gheibaitu',
  kejianguang: '可见光',
  可见光: 'kejianguang',
  zhonghongwai: '中红外',
  中红外: 'zhonghongwai',
  FY2Gyuanpantu: 'FY2G圆盘图',
  FY2G圆盘图: 'FY2Gyuanpantu',
  caiseyuanpantu: '彩色圆盘图',
  彩色圆盘图: 'caiseyuanpantu',
  hongwaiyiyuanpantu: '红外一圆盘图',
  红外一圆盘图: 'hongwaiyiyuanpantu',
  hongwaieryuanpantu: '红外二圆盘图',
  红外二圆盘图: 'hongwaieryuanpantu',
  zhonghongwaiyuanpantu: '中红外圆盘图',
  中红外圆盘图: 'zhonghongwaiyuanpantu',
  shuiqiyuanpantu: '水汽圆盘图',
  水汽圆盘图: 'shuiqiyuanpantu',
  kejianguangyuanpantu: '可见光圆盘图',
  可见光圆盘图: 'kejianguangyuanpantu',
  jiangshuiliangyubao: '降水量预报',
  降水量预报: 'jiangshuiliangyubao',
  '24xiaoshijiangshuiliang': '24小时降水量',
  '24小时降水量': '24xiaoshijiangshuiliang',
  '24xiaoshi': '24小时',
  '24小时': '24xiaoshi',
  '48xiaoshi': '48小时',
  '48小时': '48xiaoshi',
  '72xiaoshi': '72小时',
  '72小时': '72xiaoshi',
  '96xiaoshi': '96小时',
  '96小时': '96xiaoshi',
  '120xiaoshi': '120小时',
  '120小时': '120xiaoshi',
  '144xiaoshi': '144小时',
  '144小时': '144xiaoshi',
  '168xiaoshi': '168小时',
  '168小时': '168xiaoshi',
  '6xiaoshijiangshuiliang': '6小时降水量',
  '6小时降水量': '6xiaoshijiangshuiliang',
  '6xiaoshi': '6小时',
  '6小时': '6xiaoshi',
  '12xiaoshi': '12小时',
  '12小时': '12xiaoshi',
  '18xiaoshi': '18小时',
  '18小时': '18xiaoshi',
  leidapintu: '雷达拼图',
  雷达拼图: 'leidapintu',
  quanguo: '全国',
  全国: 'quanguo',
  huabei: '华北',
  华北: 'huabei',
  dongbei: '东北',
  东北: 'dongbei',
  huadong: '华东',
  华东: 'huadong',
  huazhong: '华中',
  华中: 'huazhong',
  huanan: '华南',
  华南: 'huanan',
  xinan: '西南',
  西南: 'xinan',
  xibei: '西北',
  西北: 'xibei',
  jiangshuiliangshikuang: '降水量实况',
  降水量实况: 'jiangshuiliangshikuang',
  '1xiaoshijiangshuiliang': '1小时降水量',
  '1小时降水量': '1xiaoshijiangshuiliang',
  jin30tianjiangshuiliang: '近30天降水量',
  近30天降水量: 'jin30tianjiangshuiliang',
  jin10tianjiangshuiliang: '近10天降水量',
  近10天降水量: 'jin10tianjiangshuiliang',
  jin20tianjiangshuiliang: '近20天降水量',
  近20天降水量: 'jin20tianjiangshuiliang',
  jin30tianjiangshuiliangjuping: '近30天降水量距平',
  近30天降水量距平: 'jin30tianjiangshuiliangjuping',
  jin10tianjiangshuiliangjupingbaifenlv: '近10天降水量距平百分率',
  近10天降水量距平百分率: 'jin10tianjiangshuiliangjupingbaifenlv',
  jin20tianjiangshuiliangjupingbaifenlv: '近20天降水量距平百分率',
  近20天降水量距平百分率: 'jin20tianjiangshuiliangjupingbaifenlv',
  jin30tianjiangshuiliangjupingbaifenlv: '近30天降水量距平百分率',
  近30天降水量距平百分率: 'jin30tianjiangshuiliangjupingbaifenlv',
}

export const getSatelliteTypeAndTime = async (
  imageType: ImageType,
): Promise<IImageTypeAndTime> => {
  const data = (await fetch(`/api/v1/data/meteorology/${imageType}`)
    .then((res) => res.json())
    .then((value) => value.data)) as IImageTypeAndTimeResponse[]

  const typeName = nameMap[data[0].type1]
  const typeMap: Set<string> = new Set()
  const timeMap: Map<string, Set<string>> = new Map()
  data.forEach((value) => {
    const type =
      value.type3.length === 0
        ? nameMap[value.type2]
        : nameMap[value.type2] + ' - ' + nameMap[value.type3]
    typeMap.add(type)
    const timeSet = timeMap.get(type)
    if (timeSet) {
      timeSet.add(value.time)
    } else {
      timeMap.set(type, new Set())
      const timeSet = timeMap.get(type) as Set<string>
      timeSet.add(value.time)
    }
  })

  return {
    imageType: typeName,
    type: typeMap,
    time: timeMap,
  }
}

export const getSatelliteImage = async (
  imageType: string,
  type: string,
  time: string,
) => {
  console.log(imageType, type)
  let type2 = type
  let type3 = ''
  if (type.includes('-')) {
    type2 = type.split(' - ')[0]
    type3 = type.split(' - ')[1]
  }
  const url = `/api/v1/data/meteorology/time&type?time=${time}&type1=${nameMap[imageType]}&type2=${nameMap[type2]}&type3=${nameMap[type3]}`
  const imageBlob = await fetch(url)
    .then((res) => res.blob())
    .then((blob) => blob)
  const imageUrl = URL.createObjectURL(imageBlob)
  return imageUrl
}

export const getStormDataMap = async (): Promise<IStormDataMap> => {
  const result: IStormDataMap = {}

  const month = new Date(Date.now() + 8 * 3600 * 1000)
    .getMonth()
    .toString()
    .padStart(2, '0')

  const year = new Date(Date.now() + 8 * 3600 * 1000).getFullYear().toString()
  const url = `http://typhoon.zjwater.gov.cn/Api/TyphoonInfo/${year}${month}`
  const response = (await fetch(url)
    .then((res) => res.json())
    .then((json) => json)
    .catch(() => {
      return null
    })) as IStormDataResponse | null

  if (response?.name) {
    const points = response.points.map((value, index) => ({
      id: index.toString(),
      name: response.name,
      time: value.time,
      lng: Number(value.lng),
      lat: Number(value.lat),
      strong: value.strong,
      power: value.power,
      speed: value.speed,
      pressure: value.pressure,
      moveSpeed: value.movespeed,
      moveDirection: value.movedirection,
    }))
    result[response.name] = points

    return result
  }
  return {}
}
