import {
  IAccurateAssessmentTableRow,
  IForecastTideSituationResponse,
  IRealTideSituationResponse,
  IStationInfo,
  ITideSituation,
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
  const yubaoUrl = `/api/v1/data/level/station/yubao/48?station=${stationInfo[id].pinyin}`
  const yubaoData = await fetch(yubaoUrl)
    .then((res) => res.json())
    .then((data: IForecastTideSituationResponse) => data.data)
  if (!yubaoData) {
    return {
      time: [],
      hpre: [],
      hadd: [],
      hyubao: [],
    }
  }

  const realUrl = `/api/v1/data/level/station/shice/48?station=${stationInfo[id].pinyin}`
  const realData = await fetch(realUrl)
    .then((res) => res.json())
    .then((data: IRealTideSituationResponse) => data.data)
  if (!realData) {
    return {
      time: [],
      hpre: [],
      hadd: [],
      hyubao: [],
    }
  }

  const startTime = yubaoData.time
  const hpre: number[] = realData.hshice || []
  const hyubao: number[] = yubaoData.hybresult || []
  const hadd: number[] = realData.hshice.map(
    (value, index) => value - hyubao[index],
  )
  const timeList: string[] = []
  for (let i = 0; i < 49; i++) {
    const nextHour = new Date(
      new Date(startTime).getTime() + i * 60 * 60 * 1000,
    )
    timeList.push(nextHour.toLocaleString().replace(/:\d\d$/, ''))
  }
  console.log(timeList)
  return { time: timeList, hyubao, hpre, hadd }
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
      '平均误差(m)': response[1][index],
      '均方根误差(m)': response[2][index],
      '潮位合格率(%)': response[3][index],
    }
    result.push(temp)
  }

  return result
}

export { getAccurateAssessmentTable }
