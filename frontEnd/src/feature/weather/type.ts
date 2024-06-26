export interface IWeatherTypeInfo {
  type: string
  url: string
}

export interface IWeatherImageInfo {
  imageUrl: string
  time: string
}

export interface IImageTypeAndTimeResponse {
  time: string
  type1: string
  type2: string
  type3: string
}
export interface IImageTypeAndTime {
  imageType: string
  type: Set<string>
  time: Map<string, Set<string>>
}
export type ImageType = 'cloud' | 'radar' | 'rainfall' | 'rainfallpre'

export interface IStormDataResponse {
  name: string
  points: {
    time: string
    lng: string
    lat: string
    strong: string
    power: string
    speed: string
    pressure: string
    movespeed: string
    movedirection: string
  }[]
}

export interface IStormDataOfPoint {
  id: string
  name: string
  time: string
  lng: number
  lat: number
  strong: string
  power: string
  speed: string
  pressure: string
  moveSpeed: string
  moveDirection: string
}

export interface IStormTableRow {
  id: string
  name: string
  time: string
  powerAndStrong: string
  speed: string
}

export type IStormDataMap = Record<string, IStormDataOfPoint[]>
