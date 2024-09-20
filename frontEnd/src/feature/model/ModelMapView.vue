<script setup lang="ts">
import axios from 'axios'
import { ElMessage } from 'element-plus'
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, onMounted, ref } from 'vue'
import { router } from '../../router'
import { useModelStore } from '../../store/modelStore'
import { useStationStore } from '../../store/stationStore'
import { initMap } from '../../util/initMap'
import { getWaterModelStatus, runWaterModel } from './api'
import { addLayer } from './util'

const stationStore = useStationStore()
const mapContainerRef: Ref<HTMLDivElement | null> = ref(null)
const modelStore = useModelStore()




const typh: Ref<number> = ref(0)
// const text = computed(typh,()=>{
//   return typh==1?"当前有台风":"当前无台风"
// })
const runModel = async () => {
  console.log('run model')
  const status = await runWaterModel()
  console.log(status)
  if (status) {
    modelStore.run('')
    const id = setInterval(async () => {
      console.log('in')
      const status = await getWaterModelStatus()
      console.log(status)
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

  const map = await initMap(mapContainerRef.value!, { center: [120.55, 32.08], zoom: 6.5, })

  ElMessage({
    message: '地图加载完毕',
    type: 'success',
  })
  // map.addLayer(wind)
  // wind.hide()
  // map.addLayer(flow)
  // flow.hide()

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
    class="z-10 absolute flex flex-col top-6 left-6 h-64 w-72 rounded-xl shadow text-white shadow-slate-800 bg-[#262626]">
    <div class="h-10 leading-10 px-3 font-bold rounded-t-xl bg-[#3d6796]">
      模型计算
    </div>
    <div class="flex-auto m-2 rounded-md flex flex-col bg-[#494949]">
      <div class="my-2 mx-2 text-lg">
        <el-button type="info" class="w-full bg-slate-300 hover:bg-slate-400/90 border-0 text-black" @click="runModel"
          :disabled="modelStore.modelStatus === 'running'">运行模型</el-button>
      </div>
      <div class="flex flex-col flex-auto mb-3 text-base mx-2 bg-slate-300 rounded-md">
        <div class="h-8 leading-8 px-3 rounded-t-md bg-[#3d6796]">模型状态</div>
        <div class="flex flex-auto justify-center items-center text-black">
          <div v-if="modelStore.modelStatus === 'no'" class="relative bottom-1">
            当前无模型运行
          </div>
          <div v-else-if="modelStore.modelStatus === 'finish'" class="relative bottom-1 flex flex-col justify-center">
            <div class="m-3 pl-2">模型运行完成</div>
            <el-button type="primary" color="#3d6796" class="w-full border-0"
              @click="dispalyModelResult">显示模型运行结果</el-button>
          </div>
          <div v-else class="w-full px-3 relative bottom-1">
            <div class="mb-2">运行进度</div>
            <div class="flex items-center">
              <el-slider v-model="modelStore.modelProgress" class="w-[80%]"></el-slider>
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

.radio-button input[type='radio']:checked+.radio-circle::before {
  transform: translate(-50%, -50%) scale(1);
  background-color: #ffffff;
}

.radio-label {
  font-size: 14px;
  /*   font-weight: bold; */
}
</style>
