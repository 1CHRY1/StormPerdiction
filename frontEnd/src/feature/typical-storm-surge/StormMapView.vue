<script setup lang="ts">
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, onMounted, ref, watch } from 'vue'
import { router } from '../../router'
import { useMapStore } from '../../store/mapStore'
import { useStationStore } from '../../store/stationStore'
import { initMap } from '../../util/initMap'
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
const selectPointID: Ref<string> = ref('0')
const selectPointData: Ref<null | IStormDataOfPoint> = ref(null)
const stormData: Ref<null | IStormData> = ref(null)
const tableData: Ref<null | IStormTableRow[]> = ref(null)
const selectStormType: Ref<'199711' | '200012'> = ref('199711')
const mapStore = useMapStore()

const handleTableSelectionChange = (selection: any) => {
  selectPointID.value = selection.id
}

const handleSelectChange = () => {
  selectPointID.value = '0'
  stormData.value = getStormData(selectStormType.value)
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
  stormData.value = getStormData(selectStormType.value)
  tableData.value = generateStormTableData(stormData.value)
  selectPointData.value = stormData.value!.dataList[Number(selectPointID.value)]

  const map: mapbox.Map = await initMap(
    mapContainerRef.value as HTMLDivElement,
    {
      center: [131, 30],
      zoom: 3,
    },
  )
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
      <div ref="mapContainerRef" class="map-container h-full w-full" />
    </div>
    <div class="bg-white w-[21rem] flex flex-col">
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
          <el-option key="200012" label="派比安 (200012)" value="200012" />
        </el-select>
      </div>
      <div class="h-40 m-2 border border-zinc-300 bg-white">
        <div class="h-10 leading-10 px-3 bg-[#1b6ec8] text-white">历史信息</div>
        <div class="mx-2 my-1 flex flex-col">
          <div>
            <span class="inline-block pr-2">当前时间:</span>
            <span class="inline-block pr-3">{{
              selectPointData && formatDate(selectPointData.time)
            }}</span>
          </div>
        </div>
        <div class="mx-2 my-1 flex flex-col">
          <div>
            <span class="inline-block pr-2">中心位置:</span>
            <span class="inline-block pr-3">{{
              selectPointData && decimalToDMS(selectPointData.lng)
            }}</span>
            <span class="inline-block pr-3">{{
              selectPointData && decimalToDMS(selectPointData.lat)
            }}</span>
          </div>
        </div>
        <div class="mx-2 my-1 flex flex-col">
          <div>
            <span class="inline-block pr-2">当前强度:</span>
            <span class="inline-block pr-3">{{
              selectPointData &&
              `${selectPointData?.power}级 (${selectPointData?.strong})`
            }}</span>
          </div>
        </div>
        <div class="mx-2 my-1 flex flex-col">
          <div>
            <span class="inline-block pr-2">当前风速:</span>
            <span class="inline-block pr-3">{{
              selectPointData && selectPointData?.speed + 'm/s'
            }}</span>
          </div>
        </div>
      </div>
      <div class="m-2 mt-2 w-80 bg-white">
        <div class="h-10 leading-10 px-3 bg-[#1b6ec8] text-white">历史路径</div>
        <div class="border border-zinc-300">
          <el-table
            stripe
            border
            table-layout="auto"
            :data="tableData"
            class="h-[32rem]"
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
</style>
