import {
  IAccurateAssessmentTableRow,
  IRealTideSituationResponse,
  IStationInfo,
  ITideSituation,
  ITideSituationResponse,
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
) => {
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

  if (!dataMap.data || dataMap.data.length === 0) {
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

export const getFakeData = async (
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
  let hpre = dataMap.hpre
  const hyubao = dataMap.hyubao || []
  if (id === '0') {
    hpre = hpre.map((value) => value + 1.857)
  }
  const hadd = dataMap.hadd || []
  const length = dataMap.hpre.length
  const startTime = new Date(dataMap.time)
  for (let i = 0; i < length; i++) {
    const nextHour = new Date(startTime.getTime() - i * 60 * 60 * 1000)
    time.push(nextHour.toLocaleString().replace(/:\d\d$/, ''))
  }
  return { time, isTyphoon, hyubao, hpre, hadd }
}

export const getStationPredictionTideSituation = async (
  id: keyof typeof stationInfo,
): Promise<ITideSituation> => {
  const fakeStation = await getFakeData(id)
  const relaStation = await getStationCurrentWaterSituation(id)
  const timeList = fakeStation.time.slice().reverse()
  const isTyphoon = true
  let realIndex = 0
  const hpre = timeList.map((time) => {
    const currentTime = new Date(time).getTime()
    let result = 0
    for (let index = realIndex; index < relaStation.time.length; index++) {
      const realTime = new Date(relaStation.time[index]).getTime()
      if (realTime >= currentTime - 3 * 3600 * 1000) {
        result = relaStation.hpre[index]
        realIndex = index
        break
      }
    }
    return result
  })
  hpre[hpre.length - 1] = hpre[hpre.length - 2]
  const hyubao = fakeStation.hpre
  const hadd =
    hpre.map((value, index) => {
      const result = value - hyubao[index]
      return result
    }) || []
  return { time: timeList, isTyphoon, hyubao, hpre, hadd }
}

const getAccurateAssessmentTable = async (): Promise<
  IAccurateAssessmentTableRow[]
> => {
  const response = await fetch(`/api/v1/data/nc/txt`)
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
  for (let index = 1; index < length; index++) {
    const temp: IAccurateAssessmentTableRow = {
      name: response[0][index],
      'mae(m)': response[1][index],
      'mae(m)-aftercorrection': response[2][index],
      'rmse(m)': response[3][index],
      'rmse(m)-aftercorrection': response[4][index],
      'hegelv(%)': response[5][index],
      'hegelv(%)-aftercorrection': response[6][index],
    }
    result.push(temp)
  }

  return result
}

export { getAccurateAssessmentTable }
