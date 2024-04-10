<script setup lang="ts">
import { Ref, computed, onMounted, ref, watch } from 'vue'
import { getSatelliteImage, getSatelliteTypeAndTime } from './api'

const options: Ref<Record<string, string>[]> = ref([])
const timeListArray: Ref<string[]> = ref([])
const currentImageType = ref()
const selectType = ref()
const currentTime = ref()
const tableLoading = ref(true)
const isPlay = ref(false)
const playRate = ref(300)
const playTag = ref(0)
const imageUrl = ref()

const tableData = computed(() => {
  return timeListArray.value.map((value) => ({ time: value }))
})

onMounted(async () => {
  const { type, time, imageType } = await getSatelliteTypeAndTime('rainfallpre')
  currentImageType.value = imageType
  options.value = [...type].map((value) => ({
    value,
    label: value,
  }))

  timeListArray.value = [...time].sort().reverse()
  selectType.value = options.value[0].value
  currentTime.value = timeListArray.value[0]
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
  currentTime.value = timeListArray.value[0]
})

const handleTableSelectionChange = (selection: any) => {
  if (selection) {
    currentTime.value = selection.time
  } else {
    currentTime.value = timeListArray.value[0]
  }
}

const handlePlayClick = () => {
  if (!isPlay.value) {
    const length = timeListArray.value.length
    let index = length - 1
    playTag.value = setInterval(() => {
      currentTime.value = timeListArray.value[index]
      index === 0 ? (index = length - 1) : (index -= 1)
    }, playRate.value)
  } else {
    clearInterval(playTag.value)
    currentTime.value = timeListArray.value[0]
  }
  isPlay.value = !isPlay.value
}
</script>

<template>
  <div class="flex h-full">
    <div class="flex flex-auto justify-center items-center bg-zinc-200">
      <img class="flex-auto m-4 max-h-[85vh] object-contain" :src="imageUrl" />
    </div>
    <div class="flex flex-col w-[18rem] bg-white">
      <div class="h-24 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-[#1b6ec8] text-white">图片类型</div>
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
      <div class="flex-auto h-24 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-[#1b6ec8] text-white">图片列表</div>
        <el-table
          v-loading="tableLoading"
          :data="tableData"
          stripe
          class="w-full h-[68vh]"
          :highlight-current-row="true"
          @current-change="handleTableSelectionChange"
        >
          <el-table-column prop="time" label="时间" />
        </el-table>
      </div>
      <div class="flex flex-col h-24 relative m-2 top-1 border border-zinc-300">
        <div class="h-8 leading-8 px-2 bg-[#1b6ec8] text-white">图片动画</div>
        <div class="flex flex-auto items-center">
          <el-input-number
            v-model="playRate"
            :min="1"
            :max="100000"
            :step="200"
            class="m-3"
          />
          <div class="m-3">
            <el-button
              v-if="!isPlay"
              type="primary"
              class="bg-[#1b6ec8]"
              @click="handlePlayClick"
              >播放动画</el-button
            >
            <el-button
              v-else
              type="danger"
              class="bg-[#1b6ec8]"
              @click="handlePlayClick"
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
