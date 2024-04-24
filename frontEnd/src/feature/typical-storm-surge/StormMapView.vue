<script setup lang="ts">
import { ElMessage } from 'element-plus'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, onMounted, ref, watch, reactive, watchEffect, onUnmounted,onBeforeUnmount } from 'vue'
import {
  addWaterLayer,
  addWaterLayer2,
  prepareAddWaterLayer,
  prepareAddWaterLayer2,
  lastFlow,
  lastFlow_mask
} from '../../components/LayerFromWebGPU'
import { router } from '../../router'
import { useMapStore } from '../../store/mapStore';
import { useStationStore } from '../../store/stationStore'
import { initScratchMap } from '../../util/initMap'
import flowLegend from '../../components/legend/flowLegend.vue'
import { decimalToDMS } from './util'

import { IStormData, IStormDataOfPoint, IStormTableRow } from './type'
import {
  addStationLayer,
  addStormLayer,
  addTyphoonSymbol,
  formatDate,
  generateStormTableData,
  getStormData,
  updateStormLayer,
  updateTyphoonSymbol,
} from './util'
import StormGraph from './StormGraph.vue'
import mapboxgl from 'mapbox-gl'
import controller from '../../components/legend/controller.vue'
import timeShower from '../../components/legend/timeShower.vue'

const isPopup: Ref<boolean> = ref(false)
const x: Ref<number> = ref(0)
const y: Ref<number> = ref(0)
const stationStore = useStationStore()
const mapContainerRef: Ref<HTMLDivElement | null> = ref(null)
const radio: Ref<HTMLDivElement | null> = ref(null)
const selectPointID: Ref<string> = ref('0')
const selectPointData: Ref<null | IStormDataOfPoint> = ref(null)
const stormData: Ref<null | IStormData> = ref(null)
const tableData: Ref<null | IStormTableRow[]> = ref(null)
const selectStormType: Ref<'199711'> = ref('199711')
const mapStore = useMapStore()

// const flowTimeStepRef: Ref<Number> = ref(0)
const flowMaxSpeedRef: Ref<Number> = ref(0)
// const windTimeStepRef: Ref<Number> = ref(0)
const windMaxSpeedRef: Ref<Number> = ref(0)
const addRangeRef: Ref<Array<Number>> = ref([0, 0])

const radioOptions = [
  { label: '风场', value: 0 },
  { label: '流场', value: 1 },
  { label: '增水场', value: 2 },
]
const selectedLayer: Ref<null | number> = ref(null)

const contourDATA: Ref<null | Object> = ref(null)

const handleTableSelectionChange = (selection: any) => {
  selectPointID.value = selection.id
}

const handleSelectChange = async () => {
  selectPointID.value = '0'
  stormData.value = await getStormData(selectStormType.value)
  tableData.value = generateStormTableData(stormData.value)
  selectPointData.value = stormData.value!.dataList[Number(selectPointID.value)]
  updateStormLayer(mapStore.map!, selectStormType.value)
  updateTyphoonSymbol(mapStore.map!, [
    selectPointData.value.lng,
    selectPointData.value.lat,
  ])
  mapStore.map!.flyTo({
    center: [selectPointData.value.lng, selectPointData.value.lat],
  })
}

let adwtid = 0
const adwtidRef: Ref<Number> = ref(0)
let adwtTicker: null | number = null
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
  

  timeStep.value = timeStep.value + 1

}

let wind9711src = new Array(22)
for (let i = 0; i < 22; i++) {
  wind9711src[i] = `/ffvsrc/9711wind/uv_${16 + i}.bin`
}
let flow9711src = new Array(22)
for (let i = 0; i < 22; i++) {
  if (i * 6 < 132)
    flow9711src[i] = `/ffvsrc/9711flow/uv_${i * 6}.bin`
}

let flow = reactive(new lastFlow_mask(
  'flow',
  '/ffvsrc/9711flow/station.bin',
  flow9711src,
  (url: String) => url.match(/uv_(\d+)\.bin/)![1],
  '/ffvsrc/flowbound2.geojson',
))
flow.framesPerPhase = 300
flow.speedFactor.n = 2.5

let wind = reactive(new lastFlow(
  'wind',
  '/ffvsrc/9711wind/station.bin',
  wind9711src,
  (url: String) => url.match(/uv_(\d+)\.bin/)![1],
))
wind.framesPerPhase = 150
wind.speedFactor.n = 1.0



watch(selectedLayer, async (now: null | number, old: null | number) => {
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
      break
    case 1:
      flow.hide()
      break
    case 2:
      clearInterval(adwtTicker!)
      adwtTicker = null;
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
      break
  }

  let index = Math.floor(timeStep.value / wind.uvUrlList.length * 100)
  if (index < 3) index = index - 3 + 100
  else index = index - 3

  // addding
  switch (now) {

    case 0:
      ElMessage({
        offset: 50,
        message: '正在加载风场...',
      })
      //保证同步
      wind.setProgress(index)
      wind.show()

      mapStore.map!.flyTo({
        center: [121.45, 31.37],
        zoom: 5.18,
        duration: 500,
      })
      break
    case 1:
      ElMessage({
        offset: 50,
        message: '正在加载流场...',
      })
      //保证同步
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
      if (!adwtTicker) {

        adwtTicker = setInterval(() => {
          adwtHandler(adwtid, adwtid % 2)
          adwtid = (adwtid + 1) % 80
          adwtidRef.value = adwtid
        }, 3000)
      }
      adwtHandler(adwtid, adwtid % 2)
      adwtid = (adwtid + 1) % 80
      adwtidRef.value = adwtid


      break
    default:
      break
  }
})



const closeHandeler = () => {
  wind.hide()
  flow.hide()

  if (adwtTicker) {
    clearInterval(adwtTicker!)
    adwtTicker = null;
  }
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

  radio!.value!.forEach((element) => {
    element.checked = false
  })

}

watch(selectPointID, () => {
  selectPointData.value = stormData.value!.dataList[Number(selectPointID.value)]
  if (mapStore.map) {
    mapStore.map.flyTo({
      center: [selectPointData.value.lng, selectPointData.value.lat],
    })
    updateTyphoonSymbol(mapStore.map, [
      selectPointData.value.lng,
      selectPointData.value.lat,
    ])
  }
})

onMounted(async () => {
  stormData.value = await getStormData(selectStormType.value)
  tableData.value = generateStormTableData(stormData.value)
  selectPointData.value = stormData.value!.dataList[Number(selectPointID.value)]

  const map: mapboxgl.Map = await initScratchMap(mapContainerRef.value!)
  ElMessage({
    message: '地图加载完毕',
    type: 'success',
  })
  map.addLayer(wind as mapboxgl.AnyLayer)
  wind.hide()
  map.addLayer(flow as mapboxgl.AnyLayer)
  flow.hide()

  addStationLayer(map)
  await addStormLayer(map, selectStormType.value)
  await addTyphoonSymbol(map, [
    selectPointData.value.lng,
    selectPointData.value.lat,
  ])
  map.on('click', (event: mapboxgl.MapMouseEvent) => {
    const box: [[number, number], [number, number]] = [
      [event.point.x - 3, event.point.y - 3],
      [event.point.x + 3, event.point.y + 3],
    ]

    if (map.getLayer('storm-point')) {
      const point = map.queryRenderedFeatures(box, {
        layers: ['storm-point'],
      })
      if (point && point[0]) {
        const id = point[0].properties!.id as string
        selectPointID.value = id
      }
    }

    if (map.getLayer('stations')) {
      const stations = map.queryRenderedFeatures(box, {
        layers: ['stations'],
      })
      if (stations && stations[0]) {
        const id = stations[0].properties!.id as string
        stationStore.currentStationID = id
        router.push('/typical-storm-surge/data')
      }
    }
  })

  map.on('mousemove', 'stations', (event: mapboxgl.MapMouseEvent) => {
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
  if (mapStore.map) {
    mapStore.map.removeLayer('flow')
    mapStore.map.removeLayer('wind')
  }
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

watchEffect(async() => {
  //progress
  let progress_flow = flow.currentResourcePointer / flow.uvUrlList.length
  flowProgress_flow.value = Math.floor(progress_flow * 100)

  //maxspeed
  flowMaxSpeedRef.value = flow.maxSpeed.n


  windMaxSpeedRef.value = wind.maxSpeed.n
  let progress_wind = wind.currentResourcePointer / wind.uvUrlList.length
  flowProgress_wind.value = Math.floor(progress_wind * 100)

  //both
  if(selectedLayer.value === 0)
      timeStep.value = wind.currentResourcePointer
  else if(selectedLayer.value === 1)
      timeStep.value = flow.currentResourcePointer

})

const getProgressValue_flow = (e) => {
  flowProgress_flow.value = e
  flow.setProgress(flowProgress_flow.value)
}
const getParticleNumValue_flow = (e) => {
  flow.particleNum.n = e;
}
const getSpeedValue_flow = (e) => {
  flow.speedFactor.n = e;
}
const getProgressValue_wind = (e) => {
  flowProgress_wind.value = e
  wind.setProgress(flowProgress_wind.value)
}
const getParticleNumValue_wind = (e) => {
  wind.particleNum.n = e;
}
const getSpeedValue_wind = (e) => {
  wind.speedFactor.n = e;
}



</script>

<template>
  <div class="flex h-full">
    <div class="flex h-full flex-auto relative justify-center">
      <div
        class="absolute z-10 top-3 py-1 px-16 text-yellow-400 font-bold text-2xl flex justify-center bg-slate-700/50 rounded">
        {{ stormData?.name }}
      </div>

      <div class="card">
        <div class="imge">
          <div class="title">图层控制</div>
        </div>

        <div class="Description">
          <div class="radio-buttons">
            <label v-for="opt in radioOptions" :key="opt.value" class="radio-button">
              <input ref="radio" type="radio" name="option" :value="opt.value" />
              <div class="radio-circle" @click="selectedLayer = opt.value"></div>
              <span class="radio-label" @click="selectedLayer = opt.value">{{
          opt.label
        }}</span>
            </label>
          </div>
        </div>
        <div class="imge2">
          <div class="close" @click="closeHandeler">关闭所有</div>
        </div>
      </div>

      <!-- flow/wind legend -->
      <flowLegend v-show="selectedLayer == 1 || selectedLayer == 0 || selectedLayer == 2"
        :max-speed="selectedLayer == 1 ? flowMaxSpeedRef : selectedLayer == 0 ? windMaxSpeedRef : 10.0"
        :add-range="addRangeRef" :desc="selectedLayer == 1 ? '流速(m/s)' : selectedLayer == 0 ? '风速(m/s)' : '风暴增水(m)'">
      </flowLegend>

      <timeShower v-show="selectedLayer == 1 || selectedLayer == 0 || selectedLayer == 2"
        :type="selectedLayer == 0 || selectedLayer == 1 ? '9711' : '9711adwt'" :time-step="timeStep">
      </timeShower>


      <controller v-show="selectedLayer == 1" :flow-progress="flowProgress_flow" :max-particle-num="flow.maxParticleNum"
        :now-particle-num="flow.particleNum.n" :now-speed="flow.speedFactor.n" :max-speed="10.0"
        @particle-num-value="getParticleNumValue_flow" @progress-value="getProgressValue_flow"
        @speed-value="getSpeedValue_flow">
      </controller>
      <controller v-show="selectedLayer == 0" :flow-progress="flowProgress_wind" :max-particle-num="wind.maxParticleNum"
        :now-particle-num="wind.particleNum.n" :now-speed="wind.speedFactor.n" :max-speed="10.0"
        @particle-num-value="getParticleNumValue_wind" @progress-value="getProgressValue_wind"
        @speed-value="getSpeedValue_wind">
      </controller>


      <div ref="mapContainerRef" class="map-container h-full w-full"></div>
      <canvas id="GPUFrame" class="playground"></canvas>
    </div>
    <div class="bg-white w-[22rem] flex flex-col">
      <div class="h-24 m-2 border border-zinc-300 bg-white">
        <div class="h-10 leading-10 px-3 bg-[#1b6ec8] text-white">
          历史风暴潮
        </div>
        <el-select v-model="selectStormType" class="m-2 w-[90%]" placeholder="Select" size="large"
          @change="handleSelectChange">
          <el-option key="199711" label="温妮 (199711)" value="199711" />
          <!-- <el-option key="200012" label="派比安 (200012)" value="200012" /> -->
        </el-select>
      </div>
      <div class="h-54 m-2 border border-zinc-300 bg-white">
        <div class="h-10 leading-10 px-3 bg-[#1b6ec8] text-white">历史信息</div>
        <div class="mx-2 my-2 flex flex-col">
          <div>
            <span class="inline-block pr-2 text-lg">当前时间:</span>
            <span class="inline-block pr-3">{{
          selectPointData && formatDate(selectPointData.time)
        }}</span>
          </div>
        </div>
        <div class="mx-2 my-2 flex flex-col">
          <div>
            <span class="inline-block pr-2 text-lg">中心位置:</span>
            <span class="inline-block pr-3">{{
            selectPointData && decimalToDMS(selectPointData.lng)
          }}</span>
            <span class="inline-block pr-3">{{
            selectPointData && decimalToDMS(selectPointData.lat)
          }}</span>
          </div>
        </div>
        <div class="mx-2 my-2 flex flex-col">
          <div>
            <span class="inline-block pr-2 text-lg">当前强度:</span>
            <span class="inline-block pr-3">{{
            selectPointData &&
            `${selectPointData?.power}级 (${selectPointData?.strong})`
          }}</span>
          </div>
        </div>
        <div class="mx-2 my-2 flex flex-col">
          <div>
            <span class="inline-block pr-2 text-lg">当前风速:</span>
            <span class="inline-block pr-3">{{
            selectPointData && selectPointData?.speed + 'm/s'
          }}</span>
          </div>
        </div>
      </div>
      <div class="m-2 mt-2 w-[21rem] bg-white">
        <div class="h-10 leading-10 px-3 bg-[#1b6ec8] text-white">历史路径</div>
        <div class="border border-zinc-300">
          <el-table stripe border table-layout="auto" :data="tableData" class="h-[57vh]"
            @current-change="handleTableSelectionChange">
            <el-table-column prop="time" label="时间" />
            <el-table-column prop="powerAndStrong" label="强度" />
            <el-table-column prop="speed" label="风速" />
          </el-table>
        </div>
      </div>
    </div>
  </div>
  <div
      class="absolute w-[500px] h-[400px] bg-white bg-opacity-70 p-2 rounded border border-black"
      :style="{
        zIndex: isPopup ? '10' : '-10',
        top: `${y - 450}px`,
        left: `${x - 350}px`,
      }"
    >
      <StormGraph v-model="isPopup" class="bg-blue-300 bg-opacity-30"></StormGraph>
    </div>
</template>

<style scoped>
:deep(.el-table__body tr.current-row > td.el-table__cell) {
  background-color: #dbeafe !important;
}

:deep(.el-table tbody tr:nth-child(2n) td) {
  background: #eff6ff !important;
}

:deep(.el-select--large .el-select__wrapper) {
  font-size: medium;
}

:deep(.el-table) {
  font-size: medium;
}

.adwtLegend {
  position: fixed;
  bottom: 10vh;
  right: 20vw;
  z-index: 3;
}

.flow-legend,
.wind-legend {
  z-index: 3;

}
.controller{
  position: absolute;
  left: 2vw;
  top: 2vh;
}


.timestep-counter {
  z-index: 3;

}

.card {
  position: absolute;
  top: 2vh;
  right: 4vw;
  width: 6vw;
  height: 20vh;
  background: rgb(38, 38, 38);
  box-shadow: 7px 5px 10px rgba(0, 0, 0, 0.333);
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

}

.imge {
  height: 4vh;
  width: 6vw;
  display: relative;
  background-color: #3d6796;
}

.title {
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
}

.close {
  font-size: smaller;
  font-weight: bolder;
  text-align: center;
  line-height: 3vh;
  color: white;
}

.Description {
  border-color: #141414;
  background-color: #414141;
  width: 6vw;
  height: 13vh;
  transform: scale(0.90);
  border-radius: 0.8vh;
}

.radio-buttons {
  height: calc(13vh * 0.9);
  display: flex;
  flex-direction: column;
  color: white;
  justify-content: space-evenly;
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
  padding-left: 0.5vw;
}

#GPUFrame {
  z-index: 2;
  pointer-events: none;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
}
</style>
