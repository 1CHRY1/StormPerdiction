interface IStormData {
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

interface IStormTableRow {
  id: string
  time: string
  powerAndStrong: string
  speed: number
}

interface IStormDataOfPoint {
  id: string
  time: string
  strong: string
  power: number
  speed: number
  lng: number
  lat: number
}
