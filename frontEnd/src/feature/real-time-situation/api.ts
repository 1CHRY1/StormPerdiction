import {
  IRealTideSituation,
  IRealTideSituationResponse,
  IStationInfo,
} from './type'

import { stationInfo } from '../../asset/stationInfo'

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
  const url = `/api/v1/data/level/station/real?station=${stationInfo[id].pinyin}`
  const dataMap = (await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json()
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
    hpre.push(value.level)
  })

  return {
    time,
    hpre,
  }
}
