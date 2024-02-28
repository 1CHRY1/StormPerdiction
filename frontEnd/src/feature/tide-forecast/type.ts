export interface IStationInfo {
  name: string
  pinyin: string
  time: string
  lon: string
  lat: string
  type: string
}

export interface ITideSituationResponse {
  time: string
  hpre: number[]
  hyubao?: number[]
  hadd?: number[]
}

export interface ITideSituation {
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
