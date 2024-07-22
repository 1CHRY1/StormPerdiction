import mapbox from 'mapbox-gl'
import {
  IStormDataOfPoint,
  IStormHistoryTableRow,
  IStormTableRow,
  StormDataList,
} from './type'

export const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)

  const formattedDate = month + '月' + day + '日 ' + hour + '时'
  return formattedDate
}

export const generateStormTableData = (
  data: StormDataList,
): IStormTableRow[] => {
  const result: IStormTableRow[] = data
    .filter((value) => value.isactive === '1')
    .map((value) => ({
      id: value.tfid,
      name: value.enname,
      enname: value.enname,
      startTime: value.starttime,
    }))

  return result
}

export const generateStormHistoryTableData = (
  data: IStormDataOfPoint[],
): IStormHistoryTableRow[] => {
  const result: IStormHistoryTableRow[] = data.map((value) => ({
    id: value.id,
    name: value.name,
    time: formatDate(value.time),
    powerAndStrong: `${value.power}`,
    speed: value.speed,
  }))

  return result
}

export const decimalToDMS = (decimal: number): string => {
  const degrees = Math.floor(decimal)
  const minutes = Math.floor((decimal - degrees) * 60)
  return degrees + '° ' + minutes + "'"
}

export const generatePointByCoord = (coord: [number, number]) => {
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

export const generateStormOfPoint = (storm: IStormDataOfPoint[]) => {
  const pointList = storm.map((point, index) => ({
    type: 'Feature',
    name: '',
    properties: {
      power: point.power,
      id: index,
    },
    geometry: {
      type: 'Point',
      coordinates: [point.lng, point.lat],
    },
  }))

  const result = {
    type: 'FeatureCollection',
    features: pointList,
  }

  return result
}

export const generateStormOfLine = (storm: IStormDataOfPoint[]) => {
  const result = {
    type: 'Feature',
    name: '',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: storm.map((point) => [point.lng, point.lat]),
    },
  }

  return result
}

export const addStormLayer = async (
  map: mapbox.Map,
  storm: IStormDataOfPoint[],
) => {
  const pointFeatureCollection = generateStormOfPoint(storm)
  const lineString = generateStormOfLine(storm)

  map.addSource(`storm-${storm[0].name}-point`, {
    type: 'geojson',
    data: pointFeatureCollection as any,
  })
  map.addSource(`storm-${storm[0].name}-line`, {
    type: 'geojson',
    data: lineString as any,
  })
  map.addLayer({
    id: `storm-${storm[0].name}-line`,
    source: `storm-${storm[0].name}-line`,
    type: 'line',
    paint: {
      'line-color': '#60a5fa',
      'line-width': 1.5,
    },
  })
  map.addLayer({
    id: `storm-${storm[0].name}-point`,
    source: `storm-${storm[0].name}-point`,
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

export const addTyphoonSymbolSource = async (map: mapbox.Map) => {
  const image = await new Promise((resolve) => {
    map.loadImage('/png/typhoon.png', (_, image) => {
      resolve(image)
    })
  })
  map.addImage(`typhoon-icon`, image as any)
  map.addSource(`typhoon`, {
    type: 'geojson',
    data: generatePointByCoord([0, 0]) as any,
  })
}

export const updateTyphoonSymbol = (
  map: mapbox.Map,
  coord: [number, number],
) => {
  const source = map.getSource('typhoon') as mapbox.GeoJSONSource
  source.setData(generatePointByCoord(coord) as any)
  if (!map.getLayer('typhoon')) {
    map.addLayer({
      id: 'typhoon',
      source: 'typhoon',
      type: 'symbol',
      layout: {
        'icon-image': 'typhoon-icon',
      },
    })
  }
}
