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
    hshice: number[]
    time: string
  } | null
}

export interface IForecastTideSituationResponse {
  code: string
  data: {
    hybresult: number[]
    time: string
  } | null
}

export interface ITideSituation {
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
  '平均误差(m)': string
  '均方根误差(m)': string
  '潮位合格率(%)': string
}
