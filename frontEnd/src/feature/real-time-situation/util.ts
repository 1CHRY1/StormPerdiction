import * as echarts from 'echarts'
import mapbox from 'mapbox-gl'
import { Ref } from 'vue'
import { stationInfo } from './api'
import { IRealTideSituation, IStationInfo, Tree } from './type'

export const generateTreeDataOfStation = (): Tree[] => {
  const data: Tree[] = Object.entries(stationInfo).map((value) => ({
    id: value[0],
    label: value[1].name,
  }))

  return data
}

export const initEcharts = (ref: Ref) => {
  const myChart = echarts.init(ref.value)
  return myChart
}

export const drawEcharts = async (
  echart: echarts.ECharts,
  waterSituationData: IRealTideSituation,
  info: IStationInfo,
  isValid: boolean,
) => {
  const min = Math.min(...waterSituationData.hpre)
  const max = Math.max(...waterSituationData.hpre)
  const range = max - min
  type EChartsOption = echarts.EChartsOption
  const option: EChartsOption = {
    title: {
      text: `${info.name}站点 ${info.time} 实时水情折线图`,
      textStyle: {
        color: 'hsl(220, 50%, 50%)',
      },
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: [info.name],
      right: '15%',
      top: '1%',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: waterSituationData.time,
      axisLabel: {
        padding: [0, 0, 0, 50],
      },
    },
    yAxis: {
      type: 'value',
      min: min - range * 0.05,
      max: max + range * 0.05,
      axisLabel: {
        formatter: function (value: number) {
          return value.toFixed(2)
        },
      },
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    series: [
      {
        name: info.name,
        type: 'line',
        smooth: true,
        data: waterSituationData.hpre,
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

export const addLayer = async (map: mapbox.Map) => {
  map.addSource('stations', {
    type: 'geojson',
    data: '/geojson/station.geojson',
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
    },
  })
}

export const removeLayer = (map: mapbox.Map) => {
  map.removeLayer('stations')
  map.removeSource('stations')
  map.removeImage('station-marker')
}
