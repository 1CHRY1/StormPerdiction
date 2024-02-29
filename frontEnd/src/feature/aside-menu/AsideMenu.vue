<script lang="ts" setup>
import { Menu as IconMenu } from '@element-plus/icons-vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const path = computed(() => route.path)
</script>

<template>
  <el-menu
    :default-active="path"
    router
    unique-opened
    class="w-56 border-0"
    background-color="#1f2937"
    text-color="#cbd5e1"
    active-text-color="#0ea5e9"
  >
    <el-sub-menu index="/weather">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>气象产品</span>
      </template>
      <el-menu-item index="/weather/satellite"
        ><router-link to="/weather/satellite"
          >实时卫星云图</router-link
        ></el-menu-item
      >
      <el-menu-item index="/weather/radar"
        ><router-link to="/weather/radar">雷达拼图</router-link></el-menu-item
      >
      <el-menu-item index="/weather/observation"
        ><router-link to="/weather/observation"
          >降水量实况图</router-link
        ></el-menu-item
      >
      <el-menu-item index="/weather/precipitation"
        ><router-link to="/weather/precipitation"
          >降水量预报图</router-link
        ></el-menu-item
      >
      <el-menu-item index="/weather/typhoon"
        ><router-link to="/weather/typhoon">台风路径</router-link></el-menu-item
      >
    </el-sub-menu>
    <el-sub-menu index="/real-time-situation">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>实测水情</span>
      </template>
      <el-menu-item index="/real-time-situation/map"
        ><router-link to="/real-time-situation/map"
          >地图底图</router-link
        ></el-menu-item
      >
      <el-menu-item index="/real-time-situation/data"
        ><router-link to="/real-time-situation/data"
          >站点数据</router-link
        ></el-menu-item
      >
    </el-sub-menu>
    <el-sub-menu index="/tide-forecast">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>潮位预报</span>
      </template>
      <el-menu-item index="/tide-forecast/map"
        ><router-link to="/tide-forecast/map"
          >地图底图</router-link
        ></el-menu-item
      >
      <el-menu-item index="/tide-forecast/data"
        ><router-link to="/tide-forecast/data"
          >站点数据</router-link
        ></el-menu-item
      >
    </el-sub-menu>
    <el-sub-menu index="/accuracy-assessment">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>精度评估</span>
      </template>
      <el-menu-item index="/accuracy-assessment/map"
        ><router-link to="/accuracy-assessment/map"
          >地图底图</router-link
        ></el-menu-item
      >
      <el-menu-item index="/accuracy-assessment/data"
        ><router-link to="/accuracy-assessment/data"
          >站点数据</router-link
        ></el-menu-item
      >
    </el-sub-menu>
    <el-sub-menu index="/typical-storm-surge">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>历史典型风暴潮</span>
      </template>
      <el-menu-item index="/typical-storm-surge/map"
        ><router-link to="/typical-storm-surge/map"
          >地图底图</router-link
        ></el-menu-item
      >
      <el-menu-item index="/typical-storm-surge/data"
        ><router-link to="/typical-storm-surge/data"
          >站点数据</router-link
        ></el-menu-item
      >
    </el-sub-menu>
  </el-menu>
</template>
