import mapbox from 'mapbox-gl'
import { IStormDataOfPoint, IStormTableRow } from './type'

export const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)

  const formattedDate = month + '月' + day + '日 ' + hour + '时'
  return formattedDate
}

export const generateStormTableData = (
  data: IStormDataOfPoint[],
): IStormTableRow[] => {
  const result: IStormTableRow[] = data.map((value) => ({
    id: value.id,
    name: value.name,
    time: formatDate(value.time),
    powerAndStrong: `${value.power} (${value.strong})`,
    speed: value.speed,
  }))

  return result
}

export const decimalToDMS = (decimal: number): string => {
  const degrees = Math.floor(decimal)
  const minutes = Math.floor((decimal - degrees) * 60)
  return degrees + '° ' + minutes + "'"
}

export const generateGeoJSONByCoord = (coord: [number, number]) => {
  const result = {
    type: 'Feature',
    name: '',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: coord,
    },
  }

  return result
}

export const addStormLayer = async (map: mapbox.Map, stormID: string) => {
  map.addSource(`storm-${stormID}-point`, {
    type: 'geojson',
    data: `/geojson/${stormID}-point.geojson`,
    attribution: 'name',
  })
  map.addSource(`storm-${stormID}-line`, {
    type: 'geojson',
    data: `/geojson/${stormID}-line.geojson`,
    attribution: 'name',
  })
  map.addLayer({
    id: `storm-${stormID}-line`,
    source: `storm-${stormID}-line`,
    type: 'line',
    paint: {
      'line-color': '#60a5fa',
      'line-width': 1.5,
    },
  })
  map.addLayer({
    id: `storm-${stormID}-point`,
    source: `storm-${stormID}-point`,
    type: 'circle',
    paint: {
      'circle-stroke-color': '#71717a',
      'circle-stroke-width': 1,
      'circle-radius': [
        'case',
        ['<=', ['to-number', ['get', 'power']], 8],
        4,
        ['+', ['*', ['to-number', ['get', 'power']], 0.2], 2.5],
      ],
      'circle-color': [
        'case',
        ['<=', ['to-number', ['get', 'power']], 8],
        '#4ef04e',
        ['<=', ['to-number', ['get', 'power']], 9],
        '#5281e6',
        ['<=', ['to-number', ['get', 'power']], 11],
        '#e7e827',
        ['<=', ['to-number', ['get', 'power']], 13],
        '#e49c26',
        ['<=', ['to-number', ['get', 'power']], 15],
        '#e276de',
        '#cd0000',
      ],
    },
  })
}

export const addTyphoonSymbol = async (
  map: mapbox.Map,
  coord: [number, number],
  stormID: string,
) => {
  const image = await new Promise((resolve) => {
    map.loadImage('/png/typhoon.png', (_, image) => {
      resolve(image)
    })
  })
  map.addImage(`typhoon-${stormID}-icon`, image as any)
  map.addSource(`typhoon-${stormID}`, {
    type: 'geojson',
    data: generateGeoJSONByCoord(coord) as any,
  })
  map.addLayer({
    id: `typhoon-${stormID}`,
    source: `typhoon-${stormID}`,
    type: 'symbol',
    layout: {
      'icon-image': `typhoon-${stormID}-icon`,
    },
  })
}

export const updateTyphoonSymbol = (
  map: mapbox.Map,
  coord: [number, number],
) => {
  const source = map.getSource('typhoon') as mapbox.GeoJSONSource
  source.setData(generateGeoJSONByCoord(coord) as any)
}
