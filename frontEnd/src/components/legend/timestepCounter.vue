<template>
    <div class="timestep-counter">
        <el-progress type="dashboard" :percentage="percentage">
            <template #default="{ percentage }">
                <span class="percentage-value">{{ timeStep}}</span>
                <span class="percentage-label">当前时间步</span>
            </template>
        </el-progress>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
    timeStep: Object,
    totalCount: Number,
})
const percentage = computed(()=>{
    return Math.ceil((props.timeStep!.value / props.totalCount!) * 100);
})

</script>

<style scoped>
.timestep-counter{
    position: absolute;
    right: 12vw;
    bottom: 4vh;
}
.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
  color: rgb(255, 255, 255);
  font-weight: 600;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  color: rgb(255, 255, 255);
}
:deep(.el-progress-circle__track){
    stroke: rgb(167,230,240);
    /* stroke-width: 4.8; */
    fill:rgba(19, 47, 97, 0.945);
    /* fill: rgb(170,221,167) */
}
:deep(.el-progress-circle__path){
    stroke: rgb(253,174,104);
    /* stroke-width: 4.8; */
}

</style>