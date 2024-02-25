<script lang="ts" setup>
import { Menu as IconMenu } from '@element-plus/icons-vue'
</script>

<template>
  <el-menu default-active="1-1">
    <el-sub-menu index="1">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>气象产品</span>
      </template>
      <el-menu-item index="1-1"
        ><router-link to="/weather/satellite"
          >实时卫星云图</router-link
        ></el-menu-item
      >
      <el-menu-item index="1-2"
        ><router-link to="/weather/radar">雷达拼图</router-link></el-menu-item
      >
      <el-menu-item index="1-3"
        ><router-link to="/weather/observation"
          >降水量实况图</router-link
        ></el-menu-item
      >
      <el-menu-item index="1-4"
        ><router-link to="/weather/precipitation"
          >降水量预报图</router-link
        ></el-menu-item
      >
      <el-menu-item index="1-5"
        ><router-link to="/weather/typhoon">台风路径</router-link></el-menu-item
      >
    </el-sub-menu>
    <el-sub-menu index="1">
      <template #title>
        <el-icon><icon-menu /></el-icon>
        <span>实测水情</span>
      </template>
      <el-menu-item index="2-1"
        ><router-link to="/real-time-situation/map"
          >地图地图</router-link
        ></el-menu-item
      >
      <el-menu-item index="2-2"
        ><router-link to="/real-time-situation/data"
          >站点数据</router-link
        ></el-menu-item
      >
    </el-sub-menu>
    <el-menu-item index="3">
      <el-icon><icon-menu /></el-icon>
      <router-link to="/tide-forecast">潮位预报</router-link>
    </el-menu-item>
    <el-menu-item index="4">
      <el-icon><icon-menu /></el-icon>
      <router-link to="/accuracy-assessment">预报精度评定</router-link>
    </el-menu-item>
    <el-menu-item index="5">
      <el-icon><icon-menu /></el-icon>
      <router-link to="/typical-storm-surge">历史典型风暴潮</router-link>
    </el-menu-item>
  </el-menu>
</template>
