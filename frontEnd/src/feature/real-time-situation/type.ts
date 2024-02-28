export interface IStationInfo {
  name: string
  pinyin: string
  time: string
  lon: string
  lat: string
  type: string
}

export interface IRealTideSituationResponse {
  time: string
  hpre: number[]
}

export interface IRealTideSituation {
  time: string[]
  hpre: number[]
}

export interface Tree {
  label: string
  id: string
  children?: Tree[]
}
