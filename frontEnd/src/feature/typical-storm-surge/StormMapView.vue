<script setup lang="ts">
import { ElMessage } from 'element-plus'
import { default as mapbox, default as mapboxgl } from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, onMounted, ref, watch } from 'vue'
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
import adwtLegend from './adwtLegend.vue'
import flowLegend from '../../components/legend/flowLegend.vue'
import windLegend from '../../components/legend/windLegend.vue'
import timestepCounter from '../../components/legend/timestepCounter.vue'

import { IStormData, IStormDataOfPoint, IStormTableRow } from './type'
import {
  addStationLayer,
  addStormLayer,
  addTyphoonSymbol,
  decimalToDMS,
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
const adwtTicker: Ref<number> = ref(0)
const adwtHandler = async (addwaterCount: number) => {
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
  contourDATA.value = await prepareAddWaterLayer(mapStore.map!, addWaterID)
  addWaterLayer(mapStore.map!, addWaterID)
}
const adwtHandler2 = async (addwaterCount: number) => {
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
  contourDATA.value = await prepareAddWaterLayer2(mapStore.map!, addWaterID)
  addWaterLayer2(mapStore.map!, addWaterID)
}

const wind = new wind9711() as mapboxgl.AnyLayer
const flow = new flow9711() as mapboxgl.AnyLayer


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
      // if (mapStore.map!.getLayer('WindLayer9711'))
      //   mapStore.map!.removeLayer('WindLayer9711')
      wind.hide()

      break
    case 1:
      // if (mapStore.map!.getLayer('FlowLayer9711'))
      //   mapStore.map!.removeLayer('FlowLayer9711')
      flow.hide()
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

      // adwtTicker&&clearInterval(adwtTicker)

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
      // mapStore.map!.addLayer(new WindLayer9711() as mapboxgl.AnyLayer);
      // mapStore.map!.addLayer(new wind9711() as mapboxgl.AnyLayer)
      // mapStore.map!.addLayer(new wind() as mapboxgl.AnyLayer)
      wind.show()

      mapStore.map!.flyTo({
        center: [122.92069384160902, 33.5063086220937],
        zoom: 5.184918089769568,
        duration: 500,
      })
      break
    case 1:
      ElMessage({
        offset: 50,
        message: '正在加载流场...',
      })
      // mapStore.map!.addLayer(new FlowLayer9711() as mapboxgl.AnyLayer);
      // mapStore.map!.addLayer(new flow9711() as mapboxgl.AnyLayer)
      // mapStore.map!.addLayer(new flow() as mapboxgl.AnyLayer)
      flow.show()

      mapStore.map!.flyTo({
        center: [122.92069384160902, 32.0063086220937],
        zoom: 7.512044631152661,
        duration: 500,
      })
      break
    case 2:
      ElMessage({
        offset: 50,
        message: '正在加载增水场...',
      })

      mapStore.map!.flyTo({
        center: [122.92069384160902, 32.0063086220937],
        zoom: 6.912044631152661,
        duration: 500,
      })

      // adwtTicker = adwtHandeler()
      // static
      // let addWaterID = 26
      // let addWaterSrcIds = ['pngsource', 'contourSrc']
      // if (mapStore.map!.getSource(addWaterSrcIds[0]) && mapStore.map!.getSource(addWaterSrcIds[1]))
      //   addWaterLayer(mapStore.map!, addWaterID)
      // else {
      //   mapStore.map!.getSource(addWaterSrcIds[0]) && mapStore.map!.removeSource(addWaterSrcIds[0])
      //   mapStore.map!.getSource(addWaterSrcIds[1]) && mapStore.map!.removeSource(addWaterSrcIds[1])
      //   contourDATA.value = await prepareAddWaterLayer(mapStore.map!, addWaterID)
      //   addWaterLayer(mapStore.map!, addWaterID)
      // }
      adwtid = 4
      adwtTicker.value = setInterval(() => {
        adwtid % 2 && adwtHandler(adwtid)
        !(adwtid % 2) && adwtHandler2(adwtid)

        adwtid = (adwtid + 1) % 195
      }, 3000)

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

  radio!.value!.forEach((item) => {
    item.checked = false
  })

  // (radio.value![0]! as any).checked = false
  // (radio.value![1]! as any).checked = false
  // (radio.value![2]! as any).checked = false
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

  // const map: mapbox.Map = await initMap(
  //   mapContainerRef.value as HTMLDivElement,
  //   {
  //     center: [131, 30],
  //     zoom: 3,
  //   },
  // )
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
</script>

<template>
  <div class="flex h-full">
    <div class="flex h-full flex-auto relative justify-center">
      <div
        class="absolute z-10 top-3 py-1 px-16 text-yellow-400 font-bold text-2xl flex justify-center bg-slate-700/50 rounded"
      >
        {{ stormData?.name }}
      </div>

      <div class="card">
        <div class="imge">
          <div class="title">图层控制</div>
        </div>

        <div class="Description">
          <div class="radio-buttons">
            <label
              v-for="opt in radioOptions"
              :key="opt.value"
              class="radio-button"
            >
              <input
                ref="radio"
                type="radio"
                name="option"
                :value="opt.value"
              />
              <div
                class="radio-circle"
                @click="selectedLayer = opt.value"
              ></div>
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
      <adwtLegend
        v-show="selectedLayer == 2"
        :contour-data="contourDATA"
      ></adwtLegend>

      <!-- flow/wind legend -->
      <flowLegend
        v-show="selectedLayer == 1 || selectedLayer == 0"
        :max-speed="selectedLayer == 1?flow.maxSpeedRef:selectedLayer ==0?wind.maxSpeedRef:{value:10.0}"
        :desc="selectedLayer == 1?'流速(m/s)':selectedLayer == 0?'风速(m/s)':'' "
      >
      </flowLegend>
      <timestepCounter
        v-show="selectedLayer == 0 || selectedLayer == 1"
        :timeStep="selectedLayer == 1?flow.timeStepRef:selectedLayer ==0?wind.timeStepRef:{value:10}"
        :totalCount="selectedLayer == 1?41:selectedLayer ==0?41:{value:10}"
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
        <el-select
          v-model="selectStormType"
          class="m-2 w-[90%]"
          placeholder="Select"
          size="large"
          @change="handleSelectChange"
        >
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
          <el-table
            stripe
            border
            table-layout="auto"
            :data="tableData"
            class="h-[57vh]"
            @current-change="handleTableSelectionChange"
          >
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
.flow-legend, .wind-legend{
  z-index: 3;

}
.timestep-counter{
  z-index: 3;

}

.card {
  position: fixed;
  margin-top: 2vh;
  right: 20vw;
  width: 6vw;
  height: 20vh;
  background: rgb(38, 38, 38);
  box-shadow: 7px 5px 10px rgba(0, 0, 0, 0.333);
  z-index: 3;
}

.title {
  font-size: larger;
  font-weight: bolder;
  text-align: center;
  line-height: 3rem;
  color: white;
}

.imge2 {
  margin-top: 10px;
  height: 1.5rem;
  display: fixed;
  background-color: #3d6796;
  width: 100%;
  cursor: pointer;
}

.close {
  font-size: smaller;
  font-weight: bolder;
  text-align: center;
  line-height: 1.5rem;
  color: white;
}

.imge {
  height: 3rem;
  display: fixed;
  background-color: #3d6796;
}

.Description {
  display: flex;
  justify-content: center;
  align-items: center;
  border-color: #141414;
  background-color: #414141;
  transform: translate(5%, 8%);
  width: 90%;
  height: 55%;
  border-radius: 5px;
}

.radio-buttons {
  display: flex;
  flex-direction: column;
  color: white;
}

.radio-button {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.radio-button input[type='radio'] {
  display: none;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #aaa;
  position: relative;
  margin-right: 10px;
}

.radio-circle::before {
  content: '';
  display: block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: #ddd;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0);
  transition: all 0.2s ease-in-out;
}

.radio-button input[type='radio']:checked + .radio-circle::before {
  transform: translate(-50%, -50%) scale(1);
  background-color: #ffffff;
}

.radio-label {
  font-size: 14px;
  /*   font-weight: bold; */
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
