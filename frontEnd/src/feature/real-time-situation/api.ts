import {
  IRealTideSituation,
  IRealTideSituationResponse,
  IStationInfo,
} from './type'

import { stationInfo } from '../../asset/stationInfo'

const nameList = [
  '大通',
  '杨林',
  '芜湖',
  '六滧',
  '马鞍山',
  '高桥',
  '南京',
  '吴淞',
  '镇江',
  '凤凰颈站下',
  '江阴',
  '裕溪闸下',
  '天生港',
  '新桥闸下',
  '徐六泾',
  '射阳河口',
  '黄沙港闸下',
  '新洋港闸',
  '斗龙港闸下',
  '乍浦',
  '澉浦',
  '盐官',
  '金桥',
]

const decimalToDMS = (decimal: number): string => {
  const degrees = Math.floor(decimal)
  const minutes = Math.floor((decimal - degrees) * 60)
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

export const getStationCurrentWaterSituation = async (
  id: keyof typeof stationInfo,
): Promise<IRealTideSituation> => {
  const name = stationInfo[id].name
  if (!nameList.includes(name)) {
    return {
      time: [],
      hpre: [],
    }
  }
  const time0 = new Date(Date.now() + 8 * 60 * 60 * 1000)
  const time1 = new Date(time0.getTime() - 72 * 60 * 60 * 1000)
  const isoTime0 = time0.toISOString().replace(/(?<=T\d\d).*/, ':00:00')
  const isoTime1 = time1.toISOString().replace(/(?<=T\d\d).*/, ':00:00')
  const dataMap = (await fetch(
    `https://geomodeling.njnu.edu.cn/waterLevel/YangtzeDownstream/getInfoByStationAndTime/${name}/${isoTime1}/${isoTime0}`,
  )
    .then((res) => {
      if (res.status === 200) {
        return res.json
      } else {
        return {
          code: '',
          data: [],
        }
      }
    })
    .then((data) => data)) as IRealTideSituationResponse

  if (dataMap.data.length === 0) {
    return {
      time: [],
      hpre: [],
    }
  }
  const time: string[] = []
  const hpre: number[] = []
  dataMap.data.forEach((value) => {
    time.push(value.time)
    hpre.push(value.waterLevel)
  })

  return {
    time: [],
    hpre: [],
  }
}
