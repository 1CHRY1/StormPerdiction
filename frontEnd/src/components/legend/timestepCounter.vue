<template>
    <div class="timestep-counter">
        <el-progress type="dashboard" :percentage="percentage">
            <template #default="{ percentage }">
                <span class="percentage-value">{{ hour + '时' }}</span>
                <span class="percentage-label">{{ day }}</span>
            </template>
        </el-progress>
    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import dayjs from 'dayjs'

const props = defineProps({
    timeStep: Number,
    totalCount: Number,
    type: String,
})
const percentage = computed(() => {
    return Math.ceil((props.timeStep! / props.totalCount!) * 100);
})

const timee = computed(() => {
    if (props.type == 'normal') {
        let today0 = dayjs().startOf('day')
        let passHour = props.timeStep! / 6  //正常是一天144个  10分钟一个  6个一小时
        return today0.add(passHour, 'hour').format('YYYY/MM/DD HH')
    }

    else if(props.type == '9711wind') {
        let today0 = dayjs('1997-08-16').startOf('day')
        let passHour = props.timeStep! * 6  //9711-wind是 6小时一个
        return today0.add(passHour, 'hour').format('YYYY/MM/DD HH')
    }
    else if(props.type == '9711flow') {
        let today0 = dayjs('1997-08-16').startOf('day')
        let passHour = props.timeStep! * 1 //9711-flow 1小时一个
        return today0.add(passHour, 'hour').format('YYYY/MM/DD HH')
    }
    else if(props.type == '9711adwt'){
        let today0 = dayjs('1997-08-12').startOf('day')
        let passHour = props.timeStep! * 1 //9711-adwt 1小时一个
        return today0.add(passHour, 'hour').format('YYYY/MM/DD HH')
    }
    

})
const hour = computed(() => {
    return timee.value!.split(' ')[1]
})
const day = computed(() => {
    return timee.value!.split(' ')[0]
})

onMounted(() => {
})

</script>

<style scoped>
.timestep-counter {
    position: absolute;
    right: 12vw;
    bottom: 4vh;
}

.percentage-value {
    display: block;
    margin-top: 0px;
    font-size: 24px;
    color: rgb(255, 255, 255);
    font-weight: 600;
}

.percentage-label {
    display: block;
    margin-top: 10px;
    font-size: 14px;
    color: rgb(255, 255, 255);
}

:deep(.el-progress-circle__track) {
    stroke: rgb(167, 230, 240);
    /* stroke-width: 4.8; */
    fill: rgba(19, 47, 97, 0.945);
    /* fill: rgb(170,221,167) */
}

:deep(.el-progress-circle__path) {
    stroke: rgb(253, 174, 104);
    /* stroke-width: 4.8; */
}
</style>