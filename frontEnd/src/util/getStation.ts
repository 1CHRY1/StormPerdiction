import { stationInfo } from '../asset/stationInfo.ts'
import { TToday } from './type.ts'

const getStation = async (type: TToday) => {
  const stationList = (await fetch(`/api/v1/data/station/today/${type}`)
    .then((res) => res.json())
    .then((value) => value.data)) as string[]

  return stationList
}

export const generateStationGeoJson = async (type: TToday) => {
  const geojson = (await fetch('/geojson/station.geojson')
    .then((res) => res.json())
    .then((value) => value)) as any

  const stationList = await getStation(type)
  const result = {
    type: 'FeatureCollection',
    name: 'station',
    features: [],
  }
  result.features = geojson.features.filter((value: any) =>
    stationList.includes(value.properties.pinyin),
  )

  return result
}

export const generateStationJson = async (type: TToday) => {
  const stationList = await getStation(type)
  const result = Object.values(stationInfo).filter((value: any) =>
    stationList.includes(value.pinyin),
  )

  return result
}
