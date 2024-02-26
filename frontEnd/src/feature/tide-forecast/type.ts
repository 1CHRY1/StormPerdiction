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
}

interface ITideSituation {
  time: string[]
  hpre: number[]
}

interface Tree {
  label: string
  id: string
  children?: Tree[]
}
