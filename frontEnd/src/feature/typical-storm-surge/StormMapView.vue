<script setup lang="ts">
import { ElMessage } from 'element-plus'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, onMounted, ref, watch, reactive, watchEffect, onUnmounted } from 'vue'
import {
  addWaterLayer,
  addWaterLayer2,
  flow9711,
  prepareAddWaterLayer,
  prepareAddWaterLayer2,
  wind9711,
} from '../../components/LayerFromWebGPU'
import { router } from '../../router'
import { useMapStore } from '../../store/mapStore'
import { useStationStore } from '../../store/stationStore'
import { initScratchMap } from '../../util/initMap'
import flowLegend from '../../components/legend/flowLegend.vue'
import timestepCounter from '../../components/legend/timestepCounter.vue'
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

const stationStore = useStationStore()
const mapContainerRef: Ref<HTMLDivElement | null> = ref(null)
const radio: Ref<HTMLDivElement | null> = ref(null)
const selectPointID: Ref<string> = ref('0')
const selectPointData: Ref<null | IStormDataOfPoint> = ref(null)
const stormData: Ref<null | IStormData> = ref(null)
const tableData: Ref<null | IStormTableRow[]> = ref(null)
const selectStormType: Ref<'199711'> = ref('199711')
const mapStore = useMapStore()

const flowTimeStepRef: Ref<Number> = ref(0)
const flowMaxSpeedRef: Ref<Number> = ref(0)
const windTimeStepRef: Ref<Number> = ref(0)
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
  console.log('adwt!');

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

const wind = reactive(new wind9711())
const flow = reactive(new flow9711())

watchEffect(() => {
  flowTimeStepRef.value = flow.currentResourceUrl;
  flowMaxSpeedRef.value = flow.maxSpeed.n;
  windTimeStepRef.value = wind.currentResourceUrl
  windMaxSpeedRef.value = wind.maxSpeed.n;
})

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
      console.log('clearInterval()', adwtTicker);
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

  // addding
  switch (now) {
    case 0:
      ElMessage({
        offset: 50,
        message: '正在加载风场...',
      })
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
        console.log('set new timer', adwtTicker);

      }
      // setTimeout(() => {
      //   adwtHandler(adwtid, adwtid % 2)
      //   adwtid = (adwtid + 1) % 80
      //   adwtidRef.value = adwtid
      // }, 0)

      break
    default:
      break
  }
})

const onPause = () => {
}
const onPlay = () => {
}

const closeHandeler = () => {
  wind.hide()
  flow.hide()

  if (adwtTicker) {
    console.log('clearInterval()', adwtTicker);
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

  radio!.value!.forEach((item) => {
    item.checked = false
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

  const map: mapbox.Map = await initScratchMap(mapContainerRef.value)
  ElMessage({
    message: '地图加载完毕',
    type: 'success',
  })
  map.addLayer(wind)
  wind.hide()
  map.addLayer(flow)
  flow.hide()

  addStationLayer(map)
  await addStormLayer(map, selectStormType.value)
  await addTyphoonSymbol(map, [
    selectPointData.value.lng,
    selectPointData.value.lat,
  ])
  map.on('click', (event: mapbox.MapMouseEvent) => {
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
})

onUnmounted(()=>{
  closeHandeler()
})

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
      <!-- add water -->
      <!-- <adwtLegend v-show="selectedLayer == 2" :contour-data="contourDATA"></adwtLegend> -->

      <!-- flow/wind legend -->
      <flowLegend v-show="selectedLayer == 1 || selectedLayer == 0 || selectedLayer == 2"
        :max-speed="selectedLayer == 1 ? flowMaxSpeedRef : selectedLayer == 0 ? windMaxSpeedRef : { value: 999 }"
        :add-range="addRangeRef" :desc="selectedLayer == 1 ? '流速(m/s)' : selectedLayer == 0 ? '风速(m/s)' : '风暴增水(m)'">
      </flowLegend>
      <timestepCounter v-show="selectedLayer == 0 || selectedLayer == 1 || selectedLayer == 2"
        :timeStep="selectedLayer == 1 ? flowTimeStepRef : selectedLayer == 0 ? windTimeStepRef : adwtidRef"
        :totalCount="selectedLayer == 1 ? 131 : selectedLayer == 0 ? 41 : 80" @pause="onPause" :on-play="onPlay"
        :type="selectedLayer == 0 ? '9711wind' : selectedLayer == 1 ? '9711flow' : '9711adwt'"
        >
      </timestepCounter>


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

.timestep-counter {
  z-index: 3;

}

.card {
  position: absolute;
  top: 2vh;
  right: 5vw;
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
