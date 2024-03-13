export interface IStormData {
  name: string
  dataList: {
    id: string
    time: string
    strong: string
    power: number
    speed: number
    lng: number
    lat: number
  }[]
}

export interface IStormTableRow {
  id: string
  time: string
  powerAndStrong: string
  speed: number
}

export interface IStormDataOfPoint {
  id: string
  time: string
  strong: string
  power: number
  speed: number
  lng: number
  lat: number
}

export interface IStationInfo {
  name: string
  pinyin: string
  time: string
  lon: string
  lat: string
  type: string
}

export interface IHistoryTideResponse {
  time: string[]
  hpre: (number | null)[]
  hyubao: (number | null)[]
  hadd: (number | null)[]
}

export interface IHistoryTide {
  isTyphoon: boolean
  time: string[]
  hpre: number[]
  hyubao: number[]
  hadd: number[]
}

export interface Tree {
  label: string
  id: string
  children?: Tree[]
}
