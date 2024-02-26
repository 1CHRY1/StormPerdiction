export const stationInfo = {
  '0': {
    coord: [117.633, 30.767],
    name: '大通',
    pinyin: 'datong',
    type: 'river',
  },
  '1': {
    coord: [121.267, 31.583],
    name: '杨林',
    pinyin: 'yanglin',
    type: 'river',
  },
  '2': {
    coord: [118.35, 31.35],
    name: '芜湖',
    pinyin: 'wuhu',
    type: 'river',
  },
  '3': {
    coord: [121.7, 31.5],
    name: '六滧',
    pinyin: 'liulang',
    type: 'river',
  },
  '4': {
    coord: [118.45, 31.717],
    name: '马鞍山',
    pinyin: 'maanshan',
    type: 'river',
  },
  '5': {
    coord: [121.55, 31.383],
    name: '高桥',
    pinyin: 'gaoqiao',
    type: 'river',
  },
  '6': {
    coord: [118.717, 32.083],
    name: '南京',
    pinyin: 'nanjing',
    type: 'river',
  },
  '7': {
    coord: [121.233, 31.267],
    name: '吴淞',
    pinyin: 'wusong',
    type: 'river',
  },
  '8': {
    coord: [119.433, 32.217],
    name: '镇江',
    pinyin: 'zhenjiang',
    type: 'river',
  },
  '9': {
    coord: [117.783, 31.133],
    name: '凤凰颈站下',
    pinyin: 'fenghuangjingzhanxia',
    type: 'river',
  },
  '10': {
    coord: [120.3, 31.95],
    name: '江阴',
    pinyin: 'jiangyin',
    type: 'river',
  },
  '11': {
    coord: [118.317, 31.433],
    name: '裕溪闸闸下',
    pinyin: 'yuxizhaxia',
    type: 'river',
  },
  '12': {
    coord: [120.75, 32.033],
    name: '天生港',
    pinyin: 'tianshenggang',
    type: 'river',
  },
  '13': {
    coord: [118.367, 31.533],
    name: '新桥闸闸下',
    pinyin: 'xinqiaozhaxia',
    type: 'river',
  },
  '14': {
    coord: [120.95, 31.75],
    name: '徐六泾',
    pinyin: 'xuliujing',
    type: 'river',
  },
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
    type: info.type,
  }
  return result
}

export const getStationCurrentTideSituation = async (
  id: keyof typeof stationInfo,
): Promise<ITideSituation> => {
  const url = `/api/v1/data/level/station/notyph/72?station=${stationInfo[id].pinyin}`
  const dataMap = (await fetch(url)
    .then((res) => res.json())
    .then((data) => data.data)) as ITideSituationResponse[]

  if (dataMap.length === 0) {
    return {
      time: [],
      hpre: [],
    }
  }
  const data = dataMap[0].hpre

  let time: string[] = []
  const length = data.length
  const startTime = new Date(dataMap[0].time)
  for (let i = 0; i < length; i++) {
    const nextHour = new Date(startTime.getTime() + i * 60 * 60 * 1000)
    time.push(nextHour.toLocaleString().replace(/:\d\d$/, ''))
  }
  return { time, hpre: data }
}
