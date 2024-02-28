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
