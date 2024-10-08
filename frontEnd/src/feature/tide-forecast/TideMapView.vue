<script setup lang="ts">
import { ElMessage } from 'element-plus'
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, computed, onMounted, ref, watch, reactive, watchEffect, onUnmounted, onBeforeUnmount } from 'vue'
import {
  addWaterLayer,
  addWaterLayer2,
  prepareAddWaterLayer,
  prepareAddWaterLayer2,
} from '../../components/LayerFromWebGPU'
import { router } from '../../router'
import { useMapStore } from '../../store/mapStore'
import { useStationStore } from '../../store/stationStore'
import { initMap } from '../../util/initMap'
import { addLayer } from './util'
import flowLegend from '../../components/legend/flowLegend.vue'
import timeShower from '../../components/legend/timeShower.vue'
import controller from '../../components/legend/controller.vue'
import TideGraph from './TideGraph.vue'
import tideLineChart from '../../components/tideLineChart.vue'
import axios from 'axios'

import WebGLFlowLayer from '../../components/webgl/flowLayerWithMask'
import { config_normalWind, config_normalFlow } from '../../components/webgl/config'


const isPopup: Ref<boolean> = ref(false)
const x: Ref<number> = ref(0)
const y: Ref<number> = ref(0)
const radio: Ref<HTMLDivElement | null> = ref(null)
const radio2: Ref<HTMLDivElement | null> = ref(null)
const mapStore = useMapStore()
const stationStore = useStationStore()
const mapContainerRef: Ref<HTMLDivElement | null> = ref(null)
const radioOptions = [
  { label: '风场', value: 0 },
  { label: '流场', value: 1 },
  // { label: '增水场', value: 2 }
]
const optt = { label: '增水场', value: 2 }
const selectedLayer: Ref<null | number> = ref(null)
const contourDATA: Ref<null | Object> = ref(null)

let adwtid = 0
const adwtTicker: Ref<number> = ref(0)
const adwtHandler = async (addwaterCount: number, swapTag: number) => {
  const jsonPrefix = `/ffvsrc/9711add/contour_`
  const picPrefix = `/ffvsrc/9711add/addWater_`
  if (swapTag) {
    const addWaterID = addwaterCount
    const addWaterSrcIds = ['pngsource', 'contourSrc']
    // remove
    const addWaterLayerIds = ['addWater', 'contourLayer', 'contourLabel']
    // remove
    addWaterLayerIds.forEach((layerid) => {
      mapStore.map!.getLayer(layerid) && mapStore.map!.removeLayer(layerid)
    })
    addWaterSrcIds.forEach((srcid) => {
      mapStore.map!.getSource(srcid) && mapStore.map!.removeSource(srcid)
    })
    // add
    contourDATA.value = await prepareAddWaterLayer(mapStore.map!, addWaterID, jsonPrefix, picPrefix)
    addWaterLayer(mapStore.map!, addWaterID)
  } else {
    const addWaterID = addwaterCount
    const addWaterSrcIds = ['pngsource2', 'contourSrc2']
    const addWaterLayerIds = ['addWater2', 'contourLayer2', 'contourLabel2']
    // remove
    addWaterLayerIds.forEach((layerid) => {
      mapStore.map!.getLayer(layerid) && mapStore.map!.removeLayer(layerid)
    })
    addWaterSrcIds.forEach((srcid) => {
      mapStore.map!.getSource(srcid) && mapStore.map!.removeSource(srcid)
    })
    // add
    contourDATA.value = await prepareAddWaterLayer2(mapStore.map!, addWaterID, jsonPrefix, picPrefix)
    addWaterLayer2(mapStore.map!, addWaterID)
  }

  const getAddRange = (geojson: any) => {
    let features: Array<any> = geojson["features"]
    let maxAdd: Number = -999
    let minAdd: Number = 999
    features.forEach((feat: any) => {
      if (feat['properties']['addWater'] && feat['properties']['addWater'] > maxAdd) {
        maxAdd = feat['properties']['addWater']
      } else if (feat['properties']['addWater'] && feat['properties']['addWater'] < minAdd) {
        minAdd = feat['properties']['addWater']
      }
    })
    return [maxAdd, minAdd]
  }
  addRangeRef.value = getAddRange(contourDATA.value)
}


let wind = reactive(new WebGLFlowLayer(config_normalWind))
let flow = reactive(new WebGLFlowLayer(config_normalFlow))


const flowMaxSpeedRef: Ref<Number> = ref(0)
const windMaxSpeedRef: Ref<Number> = ref(0)
const addRangeRef: Ref<Array<Number>> = ref([0, 0])
const adwtidRef: Ref<Number> = ref(0)

watchEffect(() => {
  flowMaxSpeedRef.value = flow.maxSpeed;
  windMaxSpeedRef.value = wind.maxSpeed;
})




watch(selectedLayer, async (now: null | number, old: null | number) => {
  // clear
  if (!mapStore.map) {
    ElMessage({
      message: '地图尚未加载完毕，请等待..',
      type: 'warning',
    })
    return
  }
  switch (old) {
    case 0:
      wind.hide()
      timeStep.value = wind.currentResourcePointer

      break
    case 1:
      flow.hide()
      timeStep.value = flow.currentResourcePointer
      break
    case 2:
      clearInterval(adwtTicker.value)
      const addWaterSrcIds = [
        'pngsource',
        'contourSrc',
        'pngsource2',
        'contourSrc2',
      ]
      const addWaterLayerIds = [
        'addWater',
        'contourLayer',
        'contourLabel',
        'addWater2',
        'contourLayer2',
        'contourLabel2',
      ]

      addWaterLayerIds.forEach((layerid) => {
        mapStore.map!.getLayer(layerid) && mapStore.map!.removeLayer(layerid)
      })
      addWaterSrcIds.forEach((srcid) => {
        mapStore.map!.getSource(srcid) && mapStore.map!.removeSource(srcid)
      })
      break
    default:
      console.log('do nothing')
      break
  }

  // 同步progress
  let index = Math.floor(timeStep.value / wind.uvUrlList.length * 100)
  // if (index < 1) index = index - 1 + 100
  // else index = index - 1
  if (index > 1) index = index - 1



  // addding
  switch (now) {
    case 0:
      ElMessage({
        offset: 50,
        message: '正在加载风场...',
      })
      wind.setProgress(index)
      wind.show()

      mapStore.map!.flyTo({
        center: [121.45, 32.68],
        zoom: 5.08,
        duration: 500,
      })
      break
    case 1:
      ElMessage({
        offset: 50,
        message: '正在加载流场...',
      })
      flow.setProgress(index)
      flow.show()

      mapStore.map!.flyTo({
        center: [121.5, 31.56],
        zoom: 7,
        duration: 500,
      })
      break
    case 2:
      ElMessage({
        offset: 50,
        message: '正在加载增水场...',
      })

      mapStore.map!.flyTo({
        center: [121.5, 31.56],
        zoom: 7,
        duration: 500,
      })

      adwtid = 4
      adwtidRef.value = 4
      adwtTicker.value = setInterval(() => {
        adwtHandler(adwtid, adwtid % 2)
        adwtid = (adwtid + 1) % 80
        adwtidRef.value = adwtid
      }, 3000)
      setTimeout(() => {
        adwtHandler(adwtid, adwtid % 2)
        adwtid = (adwtid + 1) % 80
        adwtidRef.value = adwtid
      }, 0)

      break
    default:
      break
  }
})

const closeHandeler = () => {
  wind.hide()
  flow.hide()

  adwtTicker.value && clearInterval(adwtTicker.value)
  const addWaterSrcIds = [
    'pngsource',
    'contourSrc',
    'pngsource2',
    'contourSrc2',
  ]
  const addWaterLayerIds = [
    'addWater',
    'contourLayer',
    'contourLabel',
    'addWater2',
    'contourLayer2',
    'contourLabel2',
  ]
  addWaterLayerIds.forEach((layerid) => {
    mapStore.map!.getLayer(layerid) && mapStore.map!.removeLayer(layerid)
  })
  addWaterSrcIds.forEach((srcid) => {
    mapStore.map!.getSource(srcid) && mapStore.map!.removeSource(srcid)
  })

  selectedLayer.value = null

  if (radio2.value) { (radio2!.value! as any).checked = false }
  (radio.value as any).forEach((element: any) => {
    element.checked = false
  })

}

const typh: Ref<number> = ref(0)
// const text = computed(typh,()=>{
//   return typh==1?"当前有台风":"当前无台风"
// })
const text = computed(() => {
  return typh.value === 1 ? ' 当前有台风!' : '当前无台风 !'
})

onMounted(async () => {

  const typhJudge = (await axios.get('/api/v1/data/level/typh')).data.data
  typh.value = typhJudge === null ? 0 : 1

  const map = await initMap(mapContainerRef.value!, { center: [120.55, 32.08], zoom: 6.5, })
  ElMessage({
    message: '地图加载完毕',
    type: 'success',
  })
  await addLayer(map)

  map.addLayer(wind as mapboxgl.AnyLayer, 'stations')
  wind.hide()
  map.addLayer(flow as mapboxgl.AnyLayer, 'stations')
  flow.hide()


  ////// add tide station
  const tide_station_geojson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "name": "吴淞",
          "en_name": "wusong",
        },
        "geometry": {
          "coordinates": [
            121.4908778, 31.43670452
          ],
          "type": "Point"
        }
      }
    ]
  }

  const image = await new Promise((resolve) => {
    map.loadImage('/png/tide.png', (_, image) => {
      resolve(image)
    })
  })
  map.addImage('tide-station-marker', image as any)
  map.addSource('tide-station-source', {
    type: 'geojson',
    data: tide_station_geojson as any
  })
  map.addLayer({
    id: 'tide-station',
    source: 'tide-station-source',
    type: 'symbol',
    layout: {
      'icon-image': 'tide-station-marker',
      'icon-size': 0.13,
      'icon-allow-overlap': true,
      'text-field': ['get', 'name'],
      'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
      'text-offset': [0, 1.0],
      'text-anchor': 'top',
      'text-size': 18,
    },
    paint: {
      'text-color': '#e2e8f0',
    },
  })



  map.on('click', (event: mapbox.MapMouseEvent) => {
    const box: [[number, number], [number, number]] = [
      [event.point.x - 3, event.point.y - 3],
      [event.point.x + 3, event.point.y + 3],
    ]

    if (map.getLayer('stations')) {
      const stations = map.queryRenderedFeatures(box, {
        layers: ['stations'],
      })
      if (stations && stations[0]) {
        const id = stations[0].properties!.id as string
        stationStore.currentStationID = id
        router.push('/tide-forecast/data')
      }
    }
  })
  map.on('mousemove', 'stations', (event: mapbox.MapMouseEvent) => {
    const box: [[number, number], [number, number]] = [
      [event.point.x - 3, event.point.y - 3],
      [event.point.x + 3, event.point.y + 3],
    ]

    if (map.getLayer('stations')) {
      const stations = map.queryRenderedFeatures(box, {
        layers: ['stations'],
      })
      if (stations && stations[0]) {
        const id = stations[0].properties!.id as string
        stationStore.currentStationID = id
        isPopup.value = true
        x.value = event.point.x
        y.value = event.point.y
      }
    }
  })

  map.on('mouseleave', 'stations', () => {
    isPopup.value = false
  })

  map.on('mousemove', 'stations', (event: mapbox.MapMouseEvent) => {
    const box: [[number, number], [number, number]] = [
      [event.point.x - 3, event.point.y - 3],
      [event.point.x + 3, event.point.y + 3],
    ]

    if (map.getLayer('stations')) {
      const stations = map.queryRenderedFeatures(box, {
        layers: ['stations'],
      })
      if (stations && stations[0]) {
        const id = stations[0].properties!.id as string
        stationStore.currentStationID = id
        isPopup.value = true
        x.value = event.point.x
        y.value = event.point.y
      }
    }
  })

  map.on('mouseleave', 'stations', () => {
    isPopup.value = false
  })
})


const removeFieldResource = () => {
  flow.destroy()
  wind.destroy()
  console.log('destroy');

}
onUnmounted(() => {
  removeFieldResource()
  mapStore.map!.remove()
})
onBeforeUnmount(() => {
  closeHandeler()
})
///////controller 
const flowProgress_flow = ref(0)
const flowProgress_wind = ref(0)
const timeStep = ref(0)

watchEffect(() => {
  //progress
  let progress_flow = flow.currentResourcePointer / flow.uvUrlList.length
  flowProgress_flow.value = Math.floor(progress_flow * 100)

  //maxspeed
  flowMaxSpeedRef.value = flow.maxSpeed


  windMaxSpeedRef.value = wind.maxSpeed
  let progress_wind = wind.currentResourcePointer / wind.uvUrlList.length
  flowProgress_wind.value = Math.floor(progress_wind * 100)

  //both
  if (selectedLayer.value === 0)
    timeStep.value = wind.currentResourcePointer
  else if (selectedLayer.value === 1)
    timeStep.value = flow.currentResourcePointer
})

const getProgressValue_flow = (e: any) => {
  flowProgress_flow.value = e
  flow.setProgress(flowProgress_flow.value)
}
const getParticleNumValue_flow = (e: any) => {
  flow.particleNum = e;
}
const getSpeedValue_flow = (e: any) => {
  flow.speedFactor = e;
}
const getProgressValue_wind = (e: any) => {
  flowProgress_wind.value = e
  wind.setProgress(flowProgress_wind.value)
}
const getParticleNumValue_wind = (e: any) => {
  wind.particleNum = e;
}
const getSpeedValue_wind = (e: any) => {
  wind.speedFactor = e;
}

</script>

<template>
  <div ref="mapContainerRef" class="map-container h-full w-full" />
  <!-- <radioVue></radioVue> -->
  <div class="card">
    <div class="imge">
      <div class="title">图层控制</div>
    </div>
    <div class="Description">
      <div class="typh">{{ text }}</div>
      <div class="radio-buttons">
        <label v-for="opt in radioOptions" :key="opt.value" class="radio-button">
          <input ref="radio" type="radio" name="option" :value="opt.value" />
          <div class="radio-circle" @click="selectedLayer = opt.value"></div>
          <span class="radio-label" @click="selectedLayer = opt.value">{{
            opt.label
          }}</span>
        </label>
        <label v-show="typh" class="radio-button">
          <input ref="radio2" type="radio" name="option" :value="optt.value" />
          <div class="radio-circle" @click="selectedLayer = optt.value"></div>
          <span class="radio-label" @click="selectedLayer = optt.value">{{
            optt.label
          }}</span>
        </label>
      </div>
    </div>
    <div class="imge2">
      <div class="close" @click="closeHandeler">关闭所有 </div>
    </div>
  </div>

  <flowLegend v-show="selectedLayer == 1 || selectedLayer == 0 || selectedLayer == 2"
    :max-speed="selectedLayer == 1 ? flowMaxSpeedRef : selectedLayer == 0 ? windMaxSpeedRef : 10.0"
    :add-range="addRangeRef" :desc="selectedLayer == 1 ? '流速(m/s)' : selectedLayer == 0 ? '风速(m/s)' : '风暴增水(m)'">
  </flowLegend>
  <div class="absolute w-[500px] h-[400px] bg-white bg-opacity-70 p-2 rounded border border-black" :style="{
    zIndex: isPopup ? '10' : '-10',
    top: `${y - 450}px`,
    left: `${x - 350}px`,
  }">
    <TideGraph v-model="isPopup" class="bg-blue-300 bg-opacity-30 backdrop-blur"></TideGraph>
  </div>

  <timeShower v-show="selectedLayer == 1 || selectedLayer == 0 || selectedLayer == 2" :type="'normal'"
    :time-step="timeStep">
  </timeShower>


  <controller v-show="selectedLayer == 1" :flow-progress="flowProgress_flow" :max-particle-num="flow.maxParticleNum"
    :now-particle-num="flow.particleNum" :now-speed="flow.speedFactor" :max-speed="flow.maxSpeed"
    @particle-num-value="getParticleNumValue_flow" @progress-value="getProgressValue_flow"
    @speed-value="getSpeedValue_flow">
  </controller>
  <controller v-show="selectedLayer == 0" :flow-progress="flowProgress_wind" :max-particle-num="wind.maxParticleNum"
    :now-particle-num="wind.particleNum" :now-speed="wind.speedFactor" :max-speed="wind.maxSpeed"
    @particle-num-value="getParticleNumValue_wind" @progress-value="getProgressValue_wind"
    @speed-value="getSpeedValue_wind">
  </controller>

  <div class="tide-line-chart-block" v-show="selectedLayer == 1">
    <tideLineChart :progress="timeStep"></tideLineChart>
  </div>
</template>

<style scoped>
.adwtLegend {
  position: absolute;
  bottom: 5vh;
  right: 5vw;
  z-index: 2;
}

.flow-legend,
.wind-legend {
  z-index: 3;

}

.timestep-counter {
  z-index: 3;

}

#GPUFrame {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  top: 0;
  pointer-events: none;
}

.controller {
  position: absolute;
  left: 2vw;
  top: 3vh;
}

.card {
  position: absolute;
  top: 3vh;
  right: 5vw;
  width: 6vw;
  height: 22vh;
  background: rgb(38, 38, 38);
  box-shadow: 7px 5px 10px rgba(0, 0, 0, 0.333);
  z-index: 3;
}

.title {
  height: 4vh;
  width: 6vw;
  font-size: calc(0.6vw + 0.8vh);
  font-weight: 600;
  text-align: center;
  line-height: 4vh;
  color: white;
}

.imge2 {
  height: 3vh;
  display: absolute;
  background-color: #3d6796;
  width: 100%;
  cursor: pointer;
  position: absolute;
  bottom: 0;
}

.close {
  font-size: smaller;
  font-weight: bolder;
  text-align: center;
  line-height: 3vh;
  color: white;
}

.imge {
  height: 3rem;
  display: fixed;
  background-color: #3d6796;
}

.Description {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  border-color: #141414;
  background-color: #414141;
  height: 15vh;
  width: 6vw;
  transform: scale(0.9);
  border-radius: 5px;
}

.typh {
  font-size: calc(0.5vw + 0.7vh);
  height: 3vh;
  line-height: 3vh;
  color: #ffffff;
  text-align: center;
}

.radio-buttons {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  color: white;
  height: 70%;
}

.radio-button {
  display: flex;
  align-items: center;
  cursor: pointer;
  justify-content: flex-start;
  padding-left: 0.5vw;
}

.radio-button input[type='radio'] {
  display: none;
}

.radio-circle {
  width: calc(1vh + 0.5vw);
  height: calc(1vh + 0.5vw);
  border-radius: 50%;
  border: 2px solid #aaa;
  position: relative;
  margin-right: 10px;
}

.radio-circle::before {
  content: '';
  display: block;
  width: calc(1vh + 0.3vw);
  height: calc(1vh + 0.3vw);
  border-radius: 50%;
  background-color: #ddd;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.2s ease-in-out;
}

.radio-button input[type='radio']:checked+.radio-circle::before {
  transform: translate(-50%, -50%) scale(1);
  background-color: #ffffff;
}

.radio-label {
  font-size: calc(0.7vh + 0.5vw);
  /*   font-weight: bold; */
}

.tide-line-chart-block {
  position: absolute;
  bottom: 3.3vh;
  left: .5vw;
  z-index: 3;
}
</style>
