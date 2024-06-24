import * as echarts from 'echarts'
import mapbox from 'mapbox-gl'
import { Ref } from 'vue'
// import { stationInfo } from '../../asset/stationInfo'
import {
  generateStationGeoJson,
  generateStationJson,
} from '../../util/getStation'
import { IStationInfo, ITideSituation, Tree } from './type'

export const generateTreeDataOfStation = async (): Promise<Tree[]> => {
  const stationInfo = await generateStationJson('precise')
  const data: Tree[] = Object.entries(stationInfo).map((value) => ({
    id: value[1].id,
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
  waterSituationData: ITideSituation,
  stationInfo: IStationInfo,
  isStationDataExist: boolean,
  isPopup: boolean,
) => {
  type EChartsOption = echarts.EChartsOption
  const min = Math.min(...waterSituationData.hpre, ...waterSituationData.hyubao)
  const max = Math.max(...waterSituationData.hpre, ...waterSituationData.hyubao)
  const option: EChartsOption = {
    title: isPopup
      ? undefined
      : {
          text: `${stationInfo.name}站点 ${stationInfo.time.split(' ')[0]} 精度评定折线图`,
          textStyle: {
            color: 'hsl(220, 50%, 50%)',
            fontSize: 20,
          },
        },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['预报数据', '实测数据'],
      right: '15%',
      top: '1%',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true,
    },
    toolbox: isPopup
      ? undefined
      : {
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
        showMaxLabel: true,
        alignMaxLabel: 'right',
      },
    },
    yAxis: {
      type: 'value',
      min: Math.ceil(min - 3),
      max: Math.floor(max + 3),
      axisLabel: {
        formatter: function (value: number) {
          return value.toFixed(2)
        },
      },
    },
    dataZoom: isPopup
      ? undefined
      : [
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
        name: '预报数据',
        type: 'line',
        smooth: true,
        data: waterSituationData.hyubao,
      },
      {
        name: '实测数据',
        type: 'scatter',
        symbolSize: 10,
        data: waterSituationData.hpre,
        zlevel: 10,
      },
    ],
    graphic: {
      elements: [
        {
          type: 'text',
          style: {
            text: '单位:(m)',
            x: 3,
            y: 730,
            fontSize: 13,
          },
        },
      ],
    },
  }
  if (!isStationDataExist) {
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
  const geojson = await generateStationGeoJson('precise')
  map.addSource('stations', {
    type: 'geojson',
    data: geojson as any,
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

export const removeLayer = (map: mapbox.Map) => {
  map.removeLayer('stations')
  map.removeSource('stations')
  map.removeImage('station-marker')
}
