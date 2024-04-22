<script setup lang="ts">
import { ElMessage } from 'element-plus'
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, computed, onMounted, ref, watch, reactive, watchEffect } from 'vue'
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
import { useStationStore } from '../../store/stationStore'
import { initScratchMap2 } from '../../util/initMap'
import { addLayer } from './util'
import flowLegend from '../../components/legend/flowLegend.vue'
import timestepCounter from '../../components/legend/timestepCounter.vue'
import axios from 'axios'

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
const wind = reactive(new windd())
const flow = reactive(new floww())
const flowTimeStepRef: Ref<Number> = ref(0)
const flowMaxSpeedRef: Ref<Number> = ref(0)
const windTimeStepRef: Ref<Number> = ref(0)
const windMaxSpeedRef: Ref<Number> = ref(0)
const addRangeRef: Ref<Array<Number>> = ref([0, 0])
const adwtidRef: Ref<Number> = ref(0)

watchEffect(() => {
  flowTimeStepRef.value = flow.currentResourceUrl;
  flowMaxSpeedRef.value = flow.maxSpeed.n;
  windTimeStepRef.value = wind.currentResourceUrl
  windMaxSpeedRef.value = wind.maxSpeed.n;
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
        center: [121.45, 31.38],
        zoom: 5.18,
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
  return typh.value == 1 ? '当前有台风 !' : '当前无台风 !'
})

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
        router.push('/tide-forecast/data')
      }
    }
  })
})
</script>

<template>
  <div ref="mapContainerRef" class="map-container h-full w-full" />
  <canvas id="GPUFrame" class="playground"></canvas>
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
    :max-speed="selectedLayer == 1 ? flowMaxSpeedRef : selectedLayer == 0 ? windMaxSpeedRef : { value: 999 }"
    :add-range="addRangeRef" :desc="selectedLayer == 1 ? '流速(m/s)' : selectedLayer == 0 ? '风速(m/s)' : '风暴增水(m)'">
  </flowLegend>
  <timestepCounter v-show="selectedLayer == 0 || selectedLayer == 1 || selectedLayer == 2"
    :timeStep="selectedLayer == 1 ? flowTimeStepRef : selectedLayer == 0 ? windTimeStepRef : adwtidRef"
    :totalCount="selectedLayer == 1 ? 144 : selectedLayer == 0 ? 144 : 144"
    :type="'normal'"
    >
  </timestepCounter>
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

.card {
  position: absolute;
  top: 3vh;
  right: 10vw;
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
</style>
