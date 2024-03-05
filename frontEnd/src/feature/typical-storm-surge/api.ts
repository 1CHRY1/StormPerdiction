import { stationInfo } from '../../asset/stationInfo'
import { IHistoryTide, IHistoryTideResponse, IStationInfo } from './type'

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

export const getStationHistoryTide = async (
  id: keyof typeof stationInfo,
): Promise<IHistoryTide> => {
  const url = `/geojson/199711-station/${stationInfo[id].pinyin}.json`
  const data = (await fetch(url)
    .then((res) => {
      if (res.status === 200) {
        return res.json()
      } else {
        return {
          time: [],
          hpre: [null],
          hyubao: [null],
          hadd: [null],
        }
      }
    })
    .then((data) => data)) as IHistoryTideResponse

  if (
    data.hadd.includes(null) ||
    data.hyubao.includes(null) ||
    data.hpre.includes(null)
  ) {
    return {
      isTyphoon: false,
      time: [],
      hpre: [],
      hyubao: [],
      hadd: [],
    }
  }
  return {
    isTyphoon: true,
    time: data.time,
    hpre: data.hpre as number[],
    hyubao: data.hyubao as number[],
    hadd: data.hadd as number[],
  }
}
