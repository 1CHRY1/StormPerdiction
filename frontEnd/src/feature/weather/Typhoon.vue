<script setup lang="ts">
import mapbox from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { useMapStore } from '../../store/mapStore'
import { initMap } from '../../util/initMap'
import { getStormDataMap } from './api'
import { IStormDataMap, IStormDataOfPoint, IStormTableRow } from './type'
import {
  addStormLayer,
  addTyphoonSymbol,
  decimalToDMS,
  formatDate,
  generateStormTableData,
} from './util'

const mapContainerRef: Ref<HTMLDivElement | null> = ref(null)
const selectStormID: Ref<string | null> = ref(null)
const activateStormDataMap: Ref<null | IStormDataMap> = ref(null)
const selectPointID: Ref<string> = ref('0')
const selectPointData: Ref<null | IStormDataOfPoint> = ref(null)
const mapStore = useMapStore()
const activateStormTableData: Ref<null | IStormTableRow[]> = ref(null)
const selectHistoryTableData = computed(() => {
  if (selectStormID.value && activateStormDataMap.value) {
    return generateStormTableData(
      activateStormDataMap.value[selectStormID.value],
    )
  } else {
    return []
  }
})

const activateStormList = computed(() => {
  const result: IStormDataOfPoint[] = []
  if (!activateStormDataMap.value) {
    return result
  }
  for (const key in activateStormDataMap.value) {
    const storm = activateStormDataMap.value[key]
    result.push(storm[storm.length - 1])
  }
  return result
})

const handleActivateTableSelectionChange = (selection: any) => {
  if (selection) {
    const currentStormData = activateStormList!.value.filter(
      (value) => value.id === selection.id,
    )[0]
    selectStormID.value = selection.id
    selectPointID.value = (
      activateStormDataMap.value![selection.id].length - 1
    ).toString()
    mapStore.map?.flyTo({
      center: [currentStormData.lng, currentStormData.lat],
    })
  }
}

const handleHistoryTableSelectionChange = (selection: any) => {
  if (selection) {
    selectPointID.value = selection.id
  }
}

watch(selectPointID, () => {
  selectPointData.value =
    activateStormDataMap.value![selectStormID.value!][
      Number(selectPointID.value)
    ]
  if (mapStore.map) {
    mapStore.map.flyTo({
      center: [selectPointData.value.lng, selectPointData.value.lat],
    })
  }
})

onMounted(async () => {
  activateStormDataMap.value = await getStormDataMap()
  activateStormTableData.value = generateStormTableData(activateStormList.value)

  const map: mapbox.Map = await initMap(
    mapContainerRef.value as HTMLDivElement,
    {
      center: [133.4, 30.2],
      zoom: 4,
    },
  )
  const mapboxLayerNames: string[] = []
  activateStormList!.value.forEach(async (storm) => {
    mapboxLayerNames.push(`storm-${storm.id}-point`)
    mapboxLayerNames.push(`storm-${storm.id}-line`)
    await addStormLayer(map, storm.id)
    await addTyphoonSymbol(map, [storm.lng, storm.lat], storm.id)
  })

  map.on('click', (event: mapbox.MapMouseEvent) => {
    const box: [[number, number], [number, number]] = [
      [event.point.x - 3, event.point.y - 3],
      [event.point.x + 3, event.point.y + 3],
    ]

    const point = map.queryRenderedFeatures(box, {
      layers: mapboxLayerNames,
    })
    if (point && point[0]) {
      const id = point[0].properties!.id as string
      selectPointID.value = id
      selectStormID.value = point[0].source.split('-')[1]
    }
  })
})
</script>

<template>
  <div class="flex h-full">
    <div ref="mapContainerRef" class="map-container h-full w-full" />
    <div class="bg-white w-[21rem] flex flex-col">
      <div class="h-48 m-2 border border-zinc-300 bg-white">
        <div class="h-10 leading-10 px-3 bg-[#1b6ec8] text-white">实时信息</div>
        <div class="mx-2 my-1 flex flex-col">
          <div>
            <span class="inline-block pr-2">台风名称:</span>
            <span class="inline-block pr-3">{{
              selectPointData && selectPointData.name
            }}</span>
          </div>
        </div>
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
      <div class="m-2 mt-3 w-80 bg-white">
        <div class="h-10 leading-10 px-3 bg-[#1b6ec8] text-white">实时台风</div>
        <div class="border border-zinc-300">
          <el-table
            stripe
            border
            table-layout="auto"
            :data="activateStormTableData"
            class="h-[12rem]"
            @current-change="handleActivateTableSelectionChange"
          >
            <el-table-column prop="name" label="名称" />
            <el-table-column prop="powerAndStrong" label="强度" />
            <el-table-column prop="speed" label="风速" />
          </el-table>
        </div>
      </div>
      <div class="m-2 mt-3 w-80 bg-white flex flex-col flex-auto">
        <div class="h-10 leading-10 px-3 bg-[#1b6ec8] text-white">历史路径</div>
        <div class="border border-zinc-300 flex-auto">
          <el-table
            stripe
            border
            table-layout="auto"
            :data="selectHistoryTableData"
            class="h-[37vh]"
            @current-change="handleHistoryTableSelectionChange"
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
