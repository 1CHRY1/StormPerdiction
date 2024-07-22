<script setup lang="ts">
import * as echarts from 'echarts'
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { useStationStore } from '../../store/stationStore'
import { getStationHistoryTide, getStationInfo } from './api'
import { IHistoryTide } from './type'
import { drawEcharts, generateTreeDataOfStation, initEcharts } from './util'

let echart: echarts.ECharts | null = null
const echartsRef = ref()
const activeName = ref('graph')
const stationStore = useStationStore()
const treeData = generateTreeDataOfStation()
const waterSituationData: Ref<IHistoryTide | null> = ref(null)
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
  waterSituationData.value = await getStationHistoryTide(
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
  if (stationStore.currentStationID === '0') {
    stationStore.currentStationID = '1'
  }
  waterSituationData.value = await getStationHistoryTide(
    stationStore.currentStationID as any,
  )
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
          <div ref="echartsRef" class="h-[86vh]"></div>
        </el-tab-pane>
        <el-tab-pane
          label="数据表"
          name="table"
          class="flex flex-col items-center justify-center max-w-[80rem]"
        >
          <div class="text-xl font-semibold text-[#406abf]">
            {{ `${stationInfo.name}站点 ${stationInfo.time} 历史潮位表` }}
          </div>
          <el-table
            :data="stationTable"
            class="h-[84vh]"
            :highlight-current-row="true"
          >
            <el-table-column prop="time" label="时间" />
            <el-table-column
              align="center"
              prop="hpre"
              label="天文潮位 (hpre)"
            />
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="flex flex-col w-[20rem] bg-white">
      <div class="h-60 m-2 border border-zinc-300">
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
            <span class="inline-block pr-2 text-lg">台风状况:</span>
            <span class="inline-block pr-3">{{
              waterSituationData?.isTyphoon ? '有台风' : '无台风'
            }}</span>
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
          class="py-2 px-4 block overflow-auto h-[62vh]"
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

:deep(.el-radio) {
  margin: 4px 0px;
}
</style>
