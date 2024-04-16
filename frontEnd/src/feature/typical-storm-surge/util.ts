import * as echarts from 'echarts'
import * as mapbox from 'mapbox-gl'
import { Ref } from 'vue'
import { stationInfo } from '../../asset/stationInfo'
import {
  IHistoryTide,
  IStationInfo,
  IStormData,
  IStormTableRow,
  Tree,
} from './type'

export const getStormData = async (
  stormType: '199711',
): Promise<IStormData> => {
  const stormData = await fetch(`/geojson/${stormType}-stormData.geojson`)
    .then((res) => res.json())
    .then((result) => result)
  const result: IStormData = {
    name: stormData.name,
    dataList: [],
  }

  for (const feature of stormData.features) {
    const coord = feature.geometry.coordinates as [number, number]
    const properties = feature.properties
    const temp = {
      id: properties.id,
      time: properties.time,
      strong: properties.strong,
      power: Number(properties.power),
      speed: Number(properties.speed),
      lng: coord[0],
      lat: coord[1],
    }
    result.dataList.push(temp)
  }
  return result
}

export const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate)
  const month = ('0' + (date.getMonth() + 1)).slice(-2)
  const day = ('0' + date.getDate()).slice(-2)
  const hour = ('0' + date.getHours()).slice(-2)

  const formattedDate = month + '月' + day + '日 ' + hour + '时'
  return formattedDate
}

export const generateStormTableData = (data: IStormData): IStormTableRow[] => {
  const result: IStormTableRow[] = data.dataList.map((value) => ({
    id: value.id,
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

export const addStormLayer = async (
  map: mapbox.Map,
  type: '199711' | '200012',
) => {
  map.addSource('storm-point', {
    type: 'geojson',
    data: `/geojson/${type}-point.geojson`,
    attribution: 'name',
  })
  map.addSource('storm-line', {
    type: 'geojson',
    data: `/geojson/${type}-line.geojson`,
    attribution: 'name',
  })
  map.addLayer({
    id: 'storm-line',
    source: 'storm-line',
    type: 'line',
    paint: {
      'line-color': '#60a5fa',
      'line-width': 1.5,
    },
  })
  map.addLayer({
    id: 'storm-point',
    source: 'storm-point',
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
export const updateStormLayer = async (
  map: mapbox.Map,
  type: '199711' | '200012',
) => {
  const point = map.getSource('storm-point') as mapbox.GeoJSONSource
  point.setData(`/geojson/${type}-point.geojson`)
  const line = map.getSource('storm-line') as mapbox.GeoJSONSource
  line.setData(`/geojson/${type}-line.geojson`)
}

export const addTyphoonSymbol = async (
  map: mapbox.Map,
  coord: [number, number],
) => {
  map.addSource('typhoon', {
    type: 'geojson',
    data: generateGeoJSONByCoord(coord) as any,
  })

  const image = await new Promise((resolve) => {
    map.loadImage('/png/typhoon.png', (_, image) => {
      resolve(image)
    })
  })
  map.addImage('typhoon-icon', image as any)
  map.addLayer({
    id: 'typhoon',
    source: 'typhoon',
    type: 'symbol',
    layout: {
      'icon-image': 'typhoon-icon',
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

export const addStationLayer = async (map: mapbox.Map) => {
  map.addSource('stations', {
    type: 'geojson',
    data: '/geojson/199711-station.geojson',
    attribution: 'name',
  })

  const image = await new Promise((resolve) => {
    map.loadImage('/png/custom_marker.png', (_, image) => {
      resolve(image)
    })
  })
  map.addImage('station-marker', image as any)
  map.addLayer({
    id: 'stations',
    source: 'stations',
    type: 'symbol',
    layout: {
      'icon-image': 'station-marker',
      'icon-size': 0.6,
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 1.25],
      'text-anchor': 'top',
      'text-size': 18,
    },
    paint: {
      'text-color': '#e2e8f0',
    },
  })
}

export const generateTreeDataOfStation = (): Tree[] => {
  const stationFilterID = ['1', '6', '7', '8', '10', '14']
  const data: Tree[] = stationFilterID.map((value) => ({
    id: value,
    label: stationInfo[value as keyof typeof stationInfo].name,
  }))

  return data
}

export const initEcharts = (ref: Ref) => {
  const myChart = echarts.init(ref.value)
  return myChart
}

export const drawEcharts = async (
  echart: echarts.ECharts,
  waterSituationData: IHistoryTide,
  stationInfo: IStationInfo,
  isValid: boolean,
) => {
  type EChartsOption = echarts.EChartsOption
  const tideMin = Math.min(
    ...waterSituationData.hpre,
    ...waterSituationData.hyubao,
  )
  const tideMax = Math.max(
    ...waterSituationData.hpre,
    ...waterSituationData.hyubao,
  )
  const tideRange = tideMax - tideMin
  const haddMin = Math.min(...waterSituationData.hadd)
  const haddMax = Math.max(...waterSituationData.hadd)
  const haddRange = haddMax - haddMin
  const option: EChartsOption = {
    title: {
      text: `${stationInfo.name}站点 ${stationInfo.time} 历史潮位图`,
      textStyle: {
        color: 'hsl(220, 50%, 50%)',
        fontSize: 20,
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['天文潮位', '总潮位', '台风增水'],
      right: '15%',
      top: '1%',
    },
    grid: [
      {
        left: 60,
        right: 50,
        height: '35%',
      },
      {
        left: 60,
        right: 50,
        top: '55%',
        height: '35%',
      },
    ],
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        saveAsImage: {},
      },
    },
    axisPointer: {
      link: [
        {
          xAxisIndex: 'all',
        },
      ],
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: waterSituationData.time,
        axisLabel: {
          padding: [15, 0, 0, 50],
        },
      },
      {
        gridIndex: 1,
        data: waterSituationData.time,
        axisLabel: {
          show: false,
        },
        position: 'top',
      },
    ],
    yAxis: [
      {
        type: 'value',
        min: tideMin - tideRange * 0.05,
        max: tideMax + tideRange * 0.05,
        axisLabel: {
          formatter: function (value: number) {
            return value.toFixed(2)
          },
        },
      },
      {
        type: 'value',
        gridIndex: 1,
        min: haddMin - haddRange * 0.05,
        max: haddMax + haddRange * 0.05,
        axisLabel: {
          formatter: function (value: number) {
            return value.toFixed(2)
          },
        },
      },
    ],
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
        xAxisIndex: [0, 1],
      },
      {
        start: 0,
        end: 100,
        xAxisIndex: [0, 1],
      },
    ],
    series: [
      {
        name: '天文潮位',
        type: 'line',
        smooth: true,
        data: waterSituationData.hpre,
      },
      {
        name: '总潮位',
        type: 'line',
        smooth: true,
        data: waterSituationData.hyubao,
      },
      {
        name: '台风增水',
        type: 'line',
        smooth: true,
        data: waterSituationData.hadd,
        yAxisIndex: 1,
        xAxisIndex: 1,
      },
    ],
  }
  if (!isValid) {
    option.graphic = {
      type: 'text', // 类型：文本
      left: 'center',
      top: 'middle',
      silent: true, // 不响应事件
      invisible: waterSituationData.hpre.length > 0, // 有数据就隐藏
      style: {
        fill: '#9d9d9d',
        fontWeight: 'bold',
        text: '该时间段暂无数据',
        fontFamily: 'Microsoft YaHei',
        fontSize: '25px',
      },
    }
  }
  option && echart.setOption(option)
}
