export interface IStationInfo {
  name: string
  pinyin: string
  time: string
  lon: string
  lat: string
  type: string
}

export interface IRealTideSituationResponse {
  code: string
  data: {
    time: string
    level: number
  }[]
}

export interface IForecastTideSituationResponse {
  hz: number[]
  time: string
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

export interface IAccurateAssessmentTableRow {
  name: string
  'mae(m)': string
  'mae(m)-aftercorrection': string
  'rmse(m)': string
  'rmse(m)-aftercorrection': string
  'hegelv(%)': string
  'hegelv(%)-aftercorrection': string
}
