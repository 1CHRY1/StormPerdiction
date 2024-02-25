<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

type EChartsOption = echarts.EChartsOption
let option: EChartsOption
option = {
  title: {
    text: 'Stacked Line',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['Email', 'Union Ads', 'Video Ads', 'Direct', 'Search Engine'],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true,
  },
  toolbox: {
    feature: {
      saveAsImage: {},
    },
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  },
  yAxis: {
    type: 'value',
  },
  series: [
    {
      name: 'Email',
      type: 'line',
      stack: 'Total',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
    {
      name: 'Union Ads',
      type: 'line',
      stack: 'Total',
      data: [220, 182, 191, 234, 290, 330, 310],
    },
    {
      name: 'Video Ads',
      type: 'line',
      stack: 'Total',
      data: [150, 232, 201, 154, 190, 330, 410],
    },
    {
      name: 'Direct',
      type: 'line',
      stack: 'Total',
      data: [320, 332, 301, 334, 390, 330, 320],
    },
    {
      name: 'Search Engine',
      type: 'line',
      stack: 'Total',
      data: [820, 932, 901, 934, 1290, 1330, 1320],
    },
  ],
}

const echartsRef = ref()
const activeName = ref('graph')

onMounted(() => {
  // const myChart = echarts.init(echartsRef.value)
  // option && myChart.setOption(option)
})
</script>

<template>
  <div class="h-full w-full flex bg-slate-300">
    <div class="flex-auto">
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="折线图" name="graph">
          <div ref="echartsRef" class="flex-auto"></div>
        </el-tab-pane>
        <el-tab-pane label="数据表" name="table">Config</el-tab-pane>
      </el-tabs>
    </div>
    <div class="flex flex-col w-[300px] bg-white">
      <div class="h-24 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-blue-500 text-white">时间范围</div>
        <div class="mb-2 flex flex-col text-sm"></div>
      </div>
      <div class="h-24 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-blue-500 text-white">时间范围</div>
        <div class="mb-2 flex flex-col text-sm"></div>
      </div>
      <!-- <div
        class="flex h-10 leading-10 tracking-widest justify-center my-0.5 text-xl"
      >
        {{ `${stationInfo.name}` }}
      </div>
      <div class="h-[1px] bg-zinc-600"></div>
      <div class="mx-3 my-2 flex flex-col">
        <div class="my-1">
          <span class="inline-block pr-2">当前时间:</span>
          <span class="inline-block pr-3">{{ stationInfo.time }}</span>
        </div>
        <div class="my-1">
          <span class="inline-block pr-2">站点位置:</span>
          <span class="inline-block pr-3">{{ stationInfo.lon }}</span
          ><span>{{ stationInfo.lat }}</span>
        </div>
        <div class="my-1">
          <span class="inline-block pr-2">当前潮位:</span>
          <span class="inline-block pr-3">{{ stationInfo.lon }}</span
          ><span>{{ stationInfo.lat }}</span>
        </div>
      </div> -->
    </div>
  </div>
</template>
