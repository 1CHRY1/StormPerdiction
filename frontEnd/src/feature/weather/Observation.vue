<script setup lang="ts">
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { getSatelliteImage, getSatelliteTypeAndTime } from './api'

const options: Ref<Record<string, string>[]> = ref([])
const timeListMap: Ref<Record<string, Record<number, string[]>>> = ref({})
const currentImageType = ref()
const selectType = ref()
const timeRange = ref(24)
const currentTime = ref()
const tableLoading = ref(true)
const isPlay = ref(false)
const playRate = ref(300)
const playTag = ref(0)
const imageUrl = ref()

const timeListOfType = computed(() => {
  if (timeListMap.value[selectType.value]) {
    return timeListMap.value[selectType.value][timeRange.value]
      .toSorted()
      .toReversed()
  } else {
    return []
  }
})
const tableData = computed(() => {
  return timeListOfType.value.map((value: any) => ({ time: value }))
})

onMounted(async () => {
  const { type, time, imageType } = await getSatelliteTypeAndTime('rainfall')
  currentImageType.value = imageType
  options.value = [...type].map((value) => ({
    value,
    label: value,
  }))

  for (const key in time) {
    const timeList = [...time[key]]
    timeListMap.value[key] = {
      24: timeList.slice(0, 24),
      48: timeList.slice(0, 48),
      72: timeList.slice(0, 72),
    }
  }

  selectType.value = options.value[0].value
  currentTime.value = timeListMap.value[selectType.value][24][0]
  imageUrl.value = await getSatelliteImage(
    currentImageType.value,
    selectType.value,
    currentTime.value,
  )

  tableLoading.value = false
})

watch([selectType, currentTime], async () => {
  imageUrl.value = imageUrl.value = await getSatelliteImage(
    currentImageType.value,
    selectType.value,
    currentTime.value,
  )
})

watch(tableData, () => {
  isPlay.value = false
  clearInterval(playTag.value)
  currentTime.value = timeListMap.value[selectType.value][24][0]
})

const handleTableSelectionChange = (selection: any) => {
  if (selection) {
    currentTime.value = selection.time
  } else {
    currentTime.value = timeListMap.value[selectType.value][24][0]
  }
}

const handlePlayClick = () => {
  if (!isPlay.value) {
    const length = timeListOfType.value.length
    let index = length - 1
    playTag.value = setInterval(() => {
      currentTime.value = timeListOfType.value[index]
      index === 0 ? (index = length - 1) : (index -= 1)
    }, playRate.value)
  } else {
    clearInterval(playTag.value)
    currentTime.value = timeListMap.value[selectType.value][24][0]
  }
  isPlay.value = !isPlay.value
}
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-auto justify-center items-center bg-zinc-200">
      <img class="flex-auto m-4 max-h-[38rem] object-contain" :src="imageUrl" />
    </div>
    <div class="flex flex-col w-[300px] bg-white">
      <div class="h-24 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-blue-500 text-white">图片类型</div>
        <el-select
          v-model="selectType"
          class="m-2 w-[90%]"
          placeholder="Select"
          size="large"
          change="selectChange"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="h-24 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-blue-500 text-white">时间范围</div>
        <div class="mb-2 flex flex-col text-sm">
          <el-radio-group v-model="timeRange">
            <el-radio :label="24" size="large" class="m-2">24 小时</el-radio>
            <el-radio :label="48" size="large" class="m-2">48 小时</el-radio>
            <el-radio :label="72" size="large" class="m-2">72 小时</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div class="flex-auto h-24 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-blue-500 text-white">图片列表</div>
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          stripe
          height="260"
          class="w-full"
          :highlight-current-row="true"
          @current-change="handleTableSelectionChange"
        >
          <el-table-column prop="time" label="时间" />
        </el-table>
      </div>
      <div class="flex flex-col h-24 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-blue-500 text-white">图片动画</div>
        <div class="flex flex-auto items-center">
          <el-input-number
            v-model="playRate"
            :min="1"
            :max="100000"
            :step="200"
            class="m-3"
          />
          <div class="m-3">
            <el-button v-if="!isPlay" type="primary" @click="handlePlayClick"
              >播放动画</el-button
            >
            <el-button v-else type="danger" @click="handlePlayClick"
              >停止动画</el-button
            >
          </div>
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
