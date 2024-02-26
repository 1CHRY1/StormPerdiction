export interface IWeatherTypeInfo {
  type: string
  url: string
}

export interface IWeatherImageInfo {
  imageUrl: string
  time: string
}

export interface ISatelliteTypeAndTimeResponse {
  time: string
  type1: string
  type2: string
  type3: string
}

export interface ISatelliteTypeAndTime {
  imageType: string
  type: Set<string>
  time: Record<string, Set<string>>
}
