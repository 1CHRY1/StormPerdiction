import {
  IAccurateAssessmentTableRow,
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
  const response = await fetch(`/api/v1/data/nc/txt?time=${time}`)
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
