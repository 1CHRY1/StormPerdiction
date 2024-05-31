import { stationInfo } from '../../asset/stationInfo'
import { IStationInfo, ITideSituation, ITideSituationResponse } from './type'

const decimalToDMS = (decimal: number): string => {
  const degrees = Math.floor(decimal)
  const minutes = Math.floor((decimal - degrees) * 60)
  return degrees + '° ' + minutes + "'"
}

export const runWaterModel = async () => {
  const url = `/api/v1/process/model/run/once`
  const data = (await fetch(url)
    .then((res) => res.json())
    .then((value) => value.data)) as string

  return data
}

export const getWaterModelStatus = async () => {
  const url = `/api/v1/process/model/run/once/condition`
  const data = (await fetch(url)
    .then((res) => res.json())
    .then((value) => value.data)) as string

  return data
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
  const url = `/api/v1/data/level/station/72?station=${stationInfo[id].pinyin}`
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
