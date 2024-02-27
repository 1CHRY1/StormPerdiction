interface IStationInfo {
  name: string
  pinyin: string
  time: string
  lon: string
  lat: string
  type: string
}

interface ITideSituationResponse {
  time: string
  hpre: number[]
  hyubao?: number[]
  hadd?: number[]
}

interface ITideSituation {
  isTyphoon: boolean
  time: string[]
  hpre: number[]
  hyubao: number[]
  hadd: number[]
}

interface Tree {
  label: string
  id: string
  children?: Tree[]
}
