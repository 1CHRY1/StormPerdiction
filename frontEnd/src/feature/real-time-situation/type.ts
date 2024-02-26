interface IStationInfo {
  name: string
  pinyin: string
  time: string
  lon: string
  lat: string
  type: string
}

interface IWaterSituationResponse {
  time: string
  hpre: number[]
}

interface IWaterSituation {
  time: string[]
  hpre: number[]
}

interface Tree {
  label: string
  id: string
  children?: Tree[]
}
