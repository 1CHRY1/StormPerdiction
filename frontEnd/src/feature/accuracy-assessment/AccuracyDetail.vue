<script setup lang="ts">
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { useStationStore } from '../../store/stationStore'
import {
  getAccurateAssessmentTable,
  getStationInfo,
  getStationPredictionTideSituation,
} from './api'
import { drawEcharts, generateTreeDataOfStation, initEcharts } from './util'

let echart: echarts.ECharts | null = null
const echartsRef = ref()
const activeName = ref('graph')
const stationStore = useStationStore()
const treeData = generateTreeDataOfStation()
const stationInfo = computed(() =>
  getStationInfo(stationStore.currentStationID as any),
)
const stationTable: Ref<IAccurateAssessmentTableRow[] | null> = ref(null)
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
  stationTable.value = await getAccurateAssessmentTable('2023-08-30 00:00:00')
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
  waterSituationData.value = await getStationPredictionTideSituation(
    stationStore.currentStationID as any,
  )
  stationTable.value = await getAccurateAssessmentTable('2023-08-30 00:00:00')
  if (isStationDataExist.value) {
    echart = initEcharts(echartsRef)
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
    <div class="flex-auto">
      <el-tabs v-model="activeName" type="border-card" class="bg-white h-full">
        <el-tab-pane label="折线图" name="graph">
          <div ref="echartsRef" class="h-[36rem] w-[60rem]"></div>
        </el-tab-pane>
        <el-tab-pane
          label="数据表"
          name="table"
          class="flex flex-col items-center"
        >
          <div class="text-lg font-semibold text-blue-500">
            {{ `${stationInfo.name}站点 ${stationInfo.time} 精度统计表` }}
          </div>
          <el-table
            :data="stationTable"
            class="w-[60rem] h-[34rem]"
            :highlight-current-row="true"
          >
            <el-table-column prop="name" label="name" align="center" />
            <el-table-column prop="mae(m)" label="mae(m)" align="center" />
            <el-table-column
              prop="mae(m)-aftercorrection"
              label="mae(m)-aftercorrection"
              align="center"
            />
            <el-table-column prop="rmse(m)" label="rmse(m)" align="center" />
            <el-table-column
              prop="rmse(m)-aftercorrection"
              label="rmse(m)-aftercorrection"
              align="center"
            />
            <el-table-column
              prop="hegelv(%)"
              label="hegelv(%)"
              align="center"
            />
            <el-table-column
              prop="hegelv(%)-aftercorrection"
              label="hegelv(%)-aftercorrection"
              align="center"
            />
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="flex flex-col w-[300px] bg-white">
      <div class="h-44 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-blue-500 text-white">站点详情</div>
        <div class="mx-3 my-2 flex flex-col">
          <div class="my-1">
            <span class="inline-block pr-2">站点名称:</span>
            <span class="inline-block pr-3">{{ stationInfo.name }}</span>
          </div>
          <div class="my-1">
            <span class="inline-block pr-2">站点类型:</span>
            <span class="inline-block pr-3">{{
              stationInfo.type === 'sea' ? '沿海' : '沿江'
            }}</span>
          </div>
          <div class="my-1">
            <span class="inline-block pr-2">站点位置:</span>
            <span class="inline-block pr-3">{{ stationInfo.lon }}</span
            ><span>{{ stationInfo.lat }}</span>
          </div>
          <div class="my-1">
            <span class="inline-block pr-2">当前时间:</span>
            <span class="inline-block pr-3">{{ stationInfo.time }}</span>
          </div>
        </div>
      </div>
      <div class="flex flex-col flex-auto m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-blue-500 text-white">站点列表</div>
        <el-radio-group
          v-model="stationStore.currentStationID"
          class="py-2 px-4 block overflow-auto h-[25rem]"
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
</style>
