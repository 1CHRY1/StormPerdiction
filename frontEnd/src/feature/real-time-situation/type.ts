interface IStationInfo {
  name: string
  pinyin: string
  time: string
  lon: string
  lat: string
  type: string
}

interface IRealTideSituationResponse {
  time: string
  hpre: number[]
}

interface IRealTideSituation {
  time: string[]
  hpre: number[]
}

interface Tree {
  label: string
  id: string
  children?: Tree[]
}
