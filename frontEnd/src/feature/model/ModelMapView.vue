<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, computed, onMounted, ref, watch } from 'vue'
import {
  addWaterLayer,
  addWaterLayer2,
  floww,
  prepareAddWaterLayer,
  prepareAddWaterLayer2,
  windd,
} from '../../components/LayerFromWebGPU'
import { router } from '../../router'
import { useMapStore } from '../../store/mapStore'
import { useModelStore } from '../../store/modelStore'
import { useStationStore } from '../../store/stationStore'
import { initScratchMap2 } from '../../util/initMap'
import { runWaterModel } from './api'
import { addLayer } from './util'

const radio: Ref<HTMLDivElement | null> = ref(null)
const radio2: Ref<HTMLDivElement | null> = ref(null)
const mapStore = useMapStore()
const stationStore = useStationStore()
const mapContainerRef: Ref<HTMLDivElement | null> = ref(null)
const modelStore = useModelStore()
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

const wind = new windd() as mapboxgl.AnyLayer
const flow = new floww() as mapboxgl.AnyLayer

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

  radio2!.value!.checked = false
  radio.value.forEach((element) => {
    element.checked = false
  })

  // (radio.value![0]! as any).checked = false
  // (radio.value![1]! as any).checked = false
  // (radio.value![2]! as any).checked = false
}

const typh: Ref<number> = ref(0)
// const text = computed(typh,()=>{
//   return typh==1?"当前有台风":"当前无台风"
// })
const text = computed(() => {
  return typh.value == 1 ? '当前有台风' : '当前无台风'
})

const runModel = async () => {
  console.log('run model')
  const status = await runWaterModel()
  if (status) {
    modelStore.run('')
    const id = setInterval(() => {
      console.log('in')
      const currentProgress = (modelStore.modelProgress += 5 * Math.random())
      if (currentProgress > 100) {
        modelStore.modelProgress = 100
        modelStore.finish()
        clearInterval(id)
        ElMessage({
          message: '模型运行完成',
          type: 'success',
        })
      } else {
        modelStore.modelProgress = currentProgress
      }
    }, 100)
  } else {
    modelStore.reset()
    ElMessage({
      message: '模型运行失败',
      type: 'warning',
    })
    console.log('fail')
  }
}

const dispalyModelResult = () => {
  router.push('/model/data')
}

onMounted(async () => {
  // const map: mapbox.Map = await initMap(
  //   mapContainerRef.value as HTMLDivElement,
  //   {
  //     center: [120.55, 32.08],
  //     zoom: 6.5,
  //   },
  // )

  typh.value = (await axios.get(`/api/v1/data/level/typh`)).data.data
  // typh.value = 1;

  const map: mapbox.Map = await initScratchMap2(mapContainerRef.value)
  ElMessage({
    message: '地图加载完毕',
    type: 'success',
  })
  map.addLayer(wind)
  wind.hide()
  map.addLayer(flow)
  flow.hide()

  window.addEventListener('keydown', (e) => {
    if (e.key === '\\') console.log(map)
  })

  addLayer(map)

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
        router.push('/model/data')
      }
    }
  })
})
</script>

<template>
  <div
    class="z-10 absolute flex flex-col top-6 left-6 h-64 w-72 rounded-xl shadow text-white shadow-slate-800 bg-[#262626]"
  >
    <div class="h-10 leading-10 px-3 font-bold rounded-t-xl bg-[#3d6796]">
      模型计算
    </div>
    <div class="flex-auto m-2 rounded-md flex flex-col bg-[#494949]">
      <div class="my-2 mx-2 text-lg">
        <el-button
          type="info"
          class="w-full bg-slate-300 hover:bg-slate-400/90 border-0 text-black"
          @click="runModel"
          >运行模型</el-button
        >
      </div>
      <div
        class="flex flex-col flex-auto mb-3 text-base mx-2 bg-slate-300 rounded-md"
      >
        <div class="h-8 leading-8 px-3 rounded-t-md bg-[#3d6796]">模型状态</div>
        <div class="flex flex-auto justify-center items-center text-black">
          <div v-if="modelStore.modelStatus === 'no'" class="relative bottom-1">
            当前无模型运行
          </div>
          <div
            v-else-if="modelStore.modelStatus === 'finish'"
            class="relative bottom-1 flex flex-col justify-center"
          >
            <div class="m-3 pl-2">模型运行完成</div>
            <el-button
              type="primary"
              color="#3d6796"
              class="w-full border-0"
              @click="dispalyModelResult"
              >显示模型运行结果</el-button
            >
          </div>
          <div v-else class="w-full px-3 relative bottom-1">
            <div class="mb-2">运行进度</div>
            <div class="flex items-center">
              <el-slider
                v-model="modelStore.modelProgress"
                class="w-[80%]"
              ></el-slider>
              <div class="pl-4">
                {{ modelStore.modelProgress.toFixed(1) + '%' }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div ref="mapContainerRef" class="map-container h-full w-full" />
  <canvas id="GPUFrame" class="playground"></canvas>
  <!-- <radioVue></radioVue> -->
  <!-- <div class="card">
    <div class="imge">
      <div class="title">图层控制</div>
    </div>

    <div class="Description">
      <div class="typh">{{ text }}</div>
      <div class="radio-buttons">
        <label
          v-for="opt in radioOptions"
          :key="opt.value"
          class="radio-button"
        >
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
      <div class="close" @click="closeHandeler">关闭所有</div>
    </div>
  </div>
  <adwtLegend
    v-show="selectedLayer == 2"
    :contour-data="contourDATA"
  ></adwtLegend> -->
</template>

<style scoped>
.adwtLegend {
  position: absolute;
  bottom: 5vh;
  right: 5vw;
  z-index: 2;
}

#GPUFrame {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 2;
  top: 0;
  pointer-events: none;
}

.card {
  position: absolute;
  top: 2vh;
  right: 10vw;
  width: 6vw;
  height: 23vh;
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
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-color: #141414;
  background-color: #414141;
  transform: translate(5%, 8%);
  width: 90%;
  height: 60%;
  border-radius: 5px;
}

.typh {
  font-size: 1.8vh;
  height: 30%;
  color: #ffffff;
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
</style>
