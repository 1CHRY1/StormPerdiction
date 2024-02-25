export const stationInfo = {
  0: {
    name: '大通',
    pinyin: 'datong',
    coord: [117.63333333333334, 30.766666666666666],
  },
  1: {
    name: '杨林',
    pinyin: 'yanglin',
    coord: [121.26666666666667, 31.583333333333332],
  },
  2: {
    name: '射阳河口',
    pinyin: 'sheyanghekou',
    coord: [120.56666666666666, 33.88333333333333],
  },
  3: { name: '芜湖', pinyin: 'wuhu', coord: [118.35, 31.35] },
  4: { name: '六滧', pinyin: 'liuyao', coord: [121.7, 31.5] },
  5: {
    name: '黄沙港闸下',
    pinyin: 'huangshagangzhaxia',
    coord: [120.63333333333334, 33.583333333333336],
  },
  6: {
    name: '马鞍山',
    pinyin: 'maanshan',
    coord: [118.45, 31.716666666666665],
  },
  7: {
    name: '高桥',
    pinyin: 'gaoqiao',
    coord: [121.55, 31.383333333333333],
  },
  8: {
    name: '新洋港闸下',
    pinyin: 'xinyanggangzhaxia',
    coord: [120.6, 33.63333333333333],
  },
  9: {
    name: '南京',
    pinyin: 'nanjing',
    coord: [118.71666666666667, 32.083333333333336],
  },
  10: {
    name: '吴淞',
    pinyin: 'wusong',
    coord: [121.23333333333333, 31.266666666666666],
  },
  11: {
    name: '斗龙港闸下',
    pinyin: 'doulonggangzhaxia',
    coord: [120.66666666666667, 33.516666666666666],
  },
  12: {
    name: '镇江',
    pinyin: 'zhenjiang',
    coord: [119.43333333333334, 32.21666666666667],
  },
  13: {
    name: '凤凰颈站下',
    pinyin: 'fenghuangjingzhanxia',
    coord: [117.78333333333333, 31.133333333333333],
  },
  14: {
    name: '川东港闸下',
    pinyin: 'chuandonggangzhaxia',
    coord: [120.91666666666667, 33.083333333333336],
  },
  15: { name: '江阴', pinyin: 'jiangyin', coord: [120.3, 31.95] },
  16: {
    name: '裕溪闸闸下',
    pinyin: 'yuxizhazhaxia',
    coord: [118.31666666666666, 31.433333333333334],
  },
  17: { name: '乍浦', pinyin: 'zhapu', coord: [121.1, 30.583333333333332] },
  18: {
    name: '天生港',
    pinyin: 'tianshenggang',
    coord: [120.75, 32.03333333333333],
  },
  19: {
    name: '新桥闸闸下',
    pinyin: 'xinqiaozhazhaxia',
    coord: [118.36666666666666, 31.533333333333335],
  },
  20: {
    name: '澉浦',
    pinyin: 'ganpu',
    coord: [120.91666666666667, 30.366666666666667],
  },
  21: { name: '徐六泾', pinyin: 'xuliujing', coord: [120.95, 31.75] },
  22: { name: '盐官', pinyin: 'yanguan', coord: [120.55, 30.4] },
}

const decimalToDMS = (decimal: number): string => {
  var degrees = Math.floor(decimal)
  var minutes = Math.floor((decimal - degrees) * 60)
  return degrees + '° ' + minutes + "'"
}

export const getStationInfo = (id: keyof typeof stationInfo): IStationInfo => {
  const info = stationInfo[id]
  const result = {
    name: info.name,
    pinyin: info.pinyin,
    time: new Date(Date.now()).toLocaleString().replace(/:\d\d$/, ''),
    lon: decimalToDMS(info.coord[0]),
    lat: decimalToDMS(info.coord[1]),
  }
  return result
}

export const getStationCurrentWaterSituation = async (
  id: keyof typeof stationInfo,
): Promise<IWaterSituation> => {
  const url = `/api/v1/data/level/station/notyph/72?station=${stationInfo[id].pinyin}`
  const dataMap = (await fetch(url)
    .then((res) => res.json())
    .then((data) => data.data)) as IWaterSituation[]
  const time = dataMap[0].time
  const data = dataMap[0].hpre
  return { time, hpre: data }
}
