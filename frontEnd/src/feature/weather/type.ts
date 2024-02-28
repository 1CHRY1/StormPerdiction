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
  time: Record<string, Set<string>>
}
export type ImageType = 'cloud' | 'radar' | 'rainfall' | 'rainfallpre'

export type IStormDataMap = Record<string, IStormDataOfPoint[]>
export interface IStormDataOfPoint {
  id: string
  name: string
  time: string
  strong: string
  power: string
  speed: string
  lng: number
  lat: number
}
export interface IStormTableRow {
  id: string
  name: string
  time: string
  powerAndStrong: string
  speed: string
}
