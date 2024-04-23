import { stationInfo } from '../asset/stationInfo.ts'

const getStation = async () => {
  const stationList = (await fetch('/api/v1/data/station/today')
    .then((res) => res.json())
    .then((value) => value.data)) as string[]

  return stationList
}

export const generateStationGeoJson = async () => {
  const geojson = (await fetch('/geojson/station.geojson')
    .then((res) => res.json())
    .then((value) => value)) as any

  const stationList = await getStation()
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

export const generateStationJson = async () => {
  const stationList = await getStation()
  const result = Object.values(stationInfo).filter(
    (value: any) => stationList.includes(value.pinyin)
  );
  
  return result;
}
