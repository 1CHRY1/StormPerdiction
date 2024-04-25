import * as echarts from 'echarts'
import mapbox from 'mapbox-gl'
import { Ref } from 'vue'
// import { stationInfo } from '../../asset/stationInfo'
import { generateStationGeoJson, generateStationJson } from '../../util/getStation'
import { IStationInfo, ITideSituation, Tree } from './type'

export const generateTreeDataOfStation = async (): Promise<Tree[]> => {
  const stationInfo = await generateStationJson()
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
) => {
  type EChartsOption = echarts.EChartsOption
  let option: EChartsOption
  if (waterSituationData.isTyphoon) {
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
    option = {
      title: 
      {
        text: `${stationInfo.name}站点 ${stationInfo.time} 72 小时逐时潮位预报图`,
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
      toolbox:
      {
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
          min: tideMin - tideRange * 5,
          max: tideMax + tideRange * 5,
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
      dataZoom:
      [
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
  } else {
    const min = Math.min(...waterSituationData.hpre)
    const max = Math.max(...waterSituationData.hpre)
    const range = max - min
    option = {
      title: {
        text: `${stationInfo.name}站点 ${stationInfo.time} 72 小时逐时潮位预报图`,
        textStyle: {
          color: 'hsl(220, 50%, 50%)',
          fontSize: 20,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['天文潮位'],
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
        min: min - range * 5,
        max: max + range * 5,
        axisLabel: {
          formatter: function (value: number) {
            return value.toFixed(2)
          },
        },
      },
      series: [
        {
          name: '天文潮位',
          type: 'line',
          smooth: true,
          data: waterSituationData.hpre,
        },
      ],
    }
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

export const drawEcharts_cover = async (
  echart: echarts.ECharts,
  waterSituationData: ITideSituation,
  stationInfo: IStationInfo,
  isStationDataExist: boolean,
  isPopup: boolean,
) => {
  console.log(isPopup)
  type EChartsOption = echarts.EChartsOption
  let option: EChartsOption
  if (waterSituationData.isTyphoon) {
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
    option = {
      title: 
      {
        text: `${stationInfo.name}站点 ${stationInfo.time} 72 小时逐时潮位预报`,
        top: '1%',
        textStyle: {
          color: 'hsl(220, 50%, 50%)',
          fontSize: 15,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['天文潮位', '总潮位', '台风增水'],
        right: '15%',
        top: '8%',
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
      toolbox: isPopup
      ? undefined
      :  {
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
          min: Math.ceil(tideMin - 1),
          max: Math.ceil(tideMax - 1),
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
      dataZoom:isPopup
      ? undefined
      : [
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
  } else {
    const min = Math.min(...waterSituationData.hpre)
    const max = Math.max(...waterSituationData.hpre)
    const range = max - min
    option = {
      title: {
        text: `${stationInfo.name}站点 ${stationInfo.time} 72 小时逐时潮位预报`,
        top: '1%',
        textStyle: {
          color: 'hsl(220, 50%, 50%)',
          fontSize: 15,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['天文潮位'],
        right: '15%',
        top: '8%',
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
        min: Math.ceil(min - 1),
        max: Math.floor(max + 1),
        axisLabel: {
          formatter: function (value: number) {
            return value.toFixed(2)
          },
        },
      },
      series: [
        {
          name: '天文潮位',
          type: 'line',
          smooth: true,
          data: waterSituationData.hpre,
        },
      ],
    }
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
  const geojson = await generateStationGeoJson()
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
