import { IAccurateAssessmentTableRow, IStationInfo, ITideSituation, ITideSituationResponse } from "./type"

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
  '15': {
    coord: [120.567, 33.883],
    name: '射阳河口',
    pinyin: 'sheyanghekou',
    type: 'sea',
  },
  '16': {
    coord: [120.633, 33.583],
    name: '黄沙港闸下',
    pinyin: 'huangshagangzhaxia',
    type: 'sea',
  },
  '17': {
    coord: [120.6, 33.633],
    name: '新洋港闸下',
    pinyin: 'xinyanggangzhaxia',
    type: 'sea',
  },
  '18': {
    coord: [120.667, 33.517],
    name: '斗龙港闸下',
    pinyin: 'doulonggangzhaxia',
    type: 'sea',
  },
  '19': {
    coord: [120.917, 33.083],
    name: '川东港闸下',
    pinyin: 'chuandonggangzhaxia',
    type: 'sea',
  },
  '20': {
    coord: [121.1, 30.583],
    name: '乍浦',
    pinyin: 'zhapu',
    type: 'sea',
  },
  '21': {
    coord: [120.917, 30.367],
    name: '澉浦',
    pinyin: 'ganpu',
    type: 'sea',
  },
  '22': {
    coord: [120.55, 30.4],
    name: '盐官',
    pinyin: 'yanguan',
    type: 'sea',
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

export const getStationPredictionTideSituation = async (
  id: keyof typeof stationInfo,
): Promise<ITideSituation> => {
  const url = `/api/v1/data/level/station/typh/72?station=${stationInfo[id].pinyin}`
  const dataMap = (await fetch(url)
    .then((res) => res.json())
    .then((data) => data.data)) as ITideSituationResponse

  if (!dataMap.hpre) {
    return {
      time: [],
      hpre: [],
      isTyphoon: false,
      hadd: [],
      hyubao: [],
    }
  }

  const time: string[] = []
  const isTyphoon = Boolean(dataMap.hadd)
  const hpre = dataMap.hpre
  const hyubao = dataMap.hyubao || []
  const hadd = dataMap.hadd || []
  const length = dataMap.hpre.length
  const startTime = new Date(dataMap.time)
  for (let i = 0; i < length; i++) {
    const nextHour = new Date(startTime.getTime() + i * 60 * 60 * 1000)
    time.push(nextHour.toLocaleString().replace(/:\d\d$/, ''))
  }
  return { time, isTyphoon, hyubao, hpre, hadd }
}

const getAccurateAssessmentTable = async (
  time: string,
): Promise<IAccurateAssessmentTableRow[]> => {
  const response = await fetch(
    `/api/v1/data/nc/txt?time=${time}`,
  )
    .then((res) => {
      return res.json()
    })
    .then((result) => {
      return result.data as string[][]
    })

  const result: IAccurateAssessmentTableRow[] = []
  if (response.length === 0) {
    return result
  }

  const length = response[0].length
  for (let index = 0; index < length; index++) {
    const temp = {} as any
    temp['name'].push(response[0][index])
    temp['mae(m)'].push(response[1][index])
    temp['mae(m)-aftercorrection'].push(response[2][index])
    temp['rmse(m)'].push(response[3][index])
    temp['rmse(m)-aftercorrection'].push(response[4][index])
    temp['hegelv(%)'].push(response[5][index])
    temp['hegelv(%)-aftercorrection'].push(response[6][index])
    result.push(temp)
  }

  return result
}

export {
  getAccurateAssessmentTable
}
