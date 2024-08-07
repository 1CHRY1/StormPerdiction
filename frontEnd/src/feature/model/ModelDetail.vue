<script setup lang="ts">
import * as echarts from 'echarts'
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { useStationStore } from '../../store/stationStore'
import { getStationInfo, getStationPredictionTideSituation } from './api'
import { ITideSituation } from './type'
import { drawEcharts, generateTreeDataOfStation, initEcharts } from './util'
import { Tree } from './type'

let echart: echarts.ECharts | null = null
const echartsRef = ref()
// const activeName = ref('graph')
const stationStore = useStationStore()
const treeData = ref<Tree[]>([])
const waterSituationData: Ref<ITideSituation | null> = ref(null)
const stationInfo = computed(() =>
  getStationInfo(stationStore.currentStationID as any),
)

const isStationDataExist = computed(() => {
  if (
    waterSituationData.value === null ||
    waterSituationData.value.hpre.length !== 0
  ) {
    return true
  }
  return false
})
const stationTable = computed(() => {
  if (!waterSituationData.value) {
    return []
  } else {
    const result: {
      hpre: number
      hyubao: number | null
      hadd: number | null
      time: string
    }[] = []
    waterSituationData.value!.hpre.forEach((value, index) => {
      result.push({
        hpre: value,
        time: waterSituationData.value!.time[index],
        hyubao: waterSituationData.value!.isTyphoon
          ? waterSituationData.value!.hyubao[index]
          : null,
        hadd: waterSituationData.value!.isTyphoon
          ? waterSituationData.value!.hadd[index]
          : null,
      })
    })
    return result
  }
})

watch(stationStore, async () => {
  waterSituationData.value = await getStationPredictionTideSituation(
    stationStore.currentStationID as any,
  )
  if (echart) {
    echart.clear()
    drawEcharts(
      echart,
      waterSituationData.value,
      stationInfo.value,
      isStationDataExist.value,
    )
  }
})

onMounted(async () => {
  treeData.value = await generateTreeDataOfStation();
  waterSituationData.value = await getStationPredictionTideSituation(
    stationStore.currentStationID as any,
  )
  echart = initEcharts(echartsRef)
  if (isStationDataExist.value) {
    drawEcharts(
      echart,
      waterSituationData.value,
      stationInfo.value,
      isStationDataExist.value,
    )
  }
})
</script>

<template>
  <div class="h-full w-full flex bg-slate-300">
    <div class="flex-auto flex flex-col items-center bg-white px-4 m-3">
      <div class="p-4 text-2xl font-semibold text-[#406abf]">
        {{ `模型计算结果` }}
      </div>
      <el-table
        :data="stationTable"
        class="h-[84vh]"
        :highlight-current-row="true"
      >
        <el-table-column prop="time" label="时间" />
        <el-table-column align="center" prop="hpre" label="天文潮位 (hpre)" />
        <el-table-column
          v-if="waterSituationData?.isTyphoon"
          align="center"
          prop="hyubao"
          label="总潮位 (hyubao)"
        />
        <el-table-column
          v-if="waterSituationData?.isTyphoon"
          align="center"
          prop="hadd"
          label="台风增水"
        />
      </el-table>
    </div>
    <div class="flex flex-col w-[20rem] bg-white">
      <div class="h-52 m-2 border border-zinc-300">
        <div class="h-10 leading-10 px-2 bg-[#1b6ec8] text-white">站点详情</div>
        <div class="mx-3 my-2 flex flex-col">
          <div class="my-1 text-lg">
            <span class="inline-block pr-2">站点名称:</span>
            <span class="inline-block pr-3">{{ stationInfo.name }}</span>
          </div>
          <div class="my-1">
            <span class="inline-block pr-2 text-lg">站点类型:</span>
            <span class="inline-block pr-3">{{
              stationInfo.type === 'sea' ? '沿海' : '沿江'
            }}</span>
          </div>
          <div class="my-1">
            <span class="inline-block pr-2 text-lg">站点位置:</span>
            <span class="inline-block pr-3">{{ stationInfo.lon }}</span
            ><span>{{ stationInfo.lat }}</span>
          </div>
          <div class="my-1">
            <span class="inline-block pr-2 text-lg">当前时间:</span>
            <span class="inline-block pr-3">{{ stationInfo.time }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col flex-auto m-2 top-1 border border-zinc-300">
        <div class="h-10 leading-10 px-2 bg-[#1b6ec8] text-white">站点选择</div>
        <el-radio-group
          v-model="stationStore.currentStationID"
          class="py-2 px-4 block overflow-auto h-[66vh]"
        >
          <el-radio
            v-for="item in treeData"
            :key="item.id"
            :label="item.id"
            class="block"
            >{{ item.label }}</el-radio
          >
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-table tbody tr:nth-child(2n) td) {
  background: #eff6ff !important;
}

:deep(.el-radio__label) {
  font-size: large;
}

:deep(.el-tabs__item) {
  font-size: medium;
}

:deep(.el-table) {
  font-size: medium;
}
</style>
