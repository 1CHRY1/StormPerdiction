<template>
    <div class="timestep-counter">
        <el-progress type="dashboard" :percentage="percentage">
            <template #default="{ percentage }">
                <span class="percentage-value">{{ timeStep}}</span>
                <span class="percentage-label">当前时间步</span>
                <!-- <span class="play" @click="clickHandler">{{ buttonText }}</span> -->
            </template>
        </el-progress>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
    timeStep: Number,
    totalCount: Number,
})
const percentage = computed(()=>{
    return Math.ceil((props.timeStep! / props.totalCount!) * 100);
})

// const emit = defineEmits(['play','pause'])
// const buttonText = ref('暂停')
// const clickHandler = () => {
//     if(buttonText.value == '暂停'){
//         buttonText.value ='播放' 
//         console.log('emit pause');
        
//         emit('pause')
//     }else{
//         buttonText.value ='暂停'
//         emit('play')
//     }
// }

</script>

<style scoped>
.timestep-counter{
    position: absolute;
    right: 12vw;
    bottom: 4vh;
}
.percentage-value {
  display: block;
  margin-top: 0px;
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
/* .play{
  display: block;
  margin-top:5px;
  height: 20px;
  width: 100%;
  font-size: 12px;
  line-height: 20px;
  color: rgb(255, 255, 255);
  &:hover{
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    transition: 300ms;
  }
} */

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