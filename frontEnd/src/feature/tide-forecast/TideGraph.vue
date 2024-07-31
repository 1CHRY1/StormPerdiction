<script setup lang="ts">
import * as echarts from 'echarts'
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { useStationStore } from '../../store/stationStore'
import {
  getStationInfo,
  getStationPredictionTideSituation,
} from './api'
import { ITideSituation } from './type'
import { drawEcharts_cover, initEcharts } from './util'

const isPopup = defineModel<boolean>()
let echart: echarts.ECharts | null = null
const echartsRef = ref()
const stationStore = useStationStore()
const stationInfo = computed(() =>
  getStationInfo(stationStore.currentStationID as any),
)

const waterSituationData: Ref<ITideSituation | null> = ref(null)
const isStationDataExist = computed(() => {
  if (
    waterSituationData.value === null ||
    waterSituationData.value.hpre.length !== 0
  ) {
    return true
  }
  return false
})

watch(stationStore, async () => {
  waterSituationData.value = await getStationPredictionTideSituation(
    stationStore.currentStationID as any,
  )
  console.log(isPopup.value)
  if (echart) {
    echart.clear()
    drawEcharts_cover(
      echart,
      waterSituationData.value,
      stationInfo.value,
      isStationDataExist.value,
      isPopup.value || false,
    )
  }
})

onMounted(async () => {
  waterSituationData.value = await getStationPredictionTideSituation(
    stationStore.currentStationID as any,
  )
  echart = initEcharts(echartsRef)
  if (isStationDataExist.value) {
    drawEcharts_cover(
      echart,
      waterSituationData.value,
      stationInfo.value,
      isStationDataExist.value,
      isPopup.value || false,
    )
  }
})
</script>

<template>
  <div ref="echartsRef" class="h-full w-full bg-white"></div>
</template>
