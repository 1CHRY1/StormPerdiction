import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/weather/satellite',
  },
  {
    path: '/test',
    component: ()=>import('../components/HelloWorld copy.vue'),
  },
  {
    path: '/weather',
    children: [
      {
        path: 'satellite',
        name: 'Satellite',
        component: ()=>import ('../feature/weather/Satellite.vue'),
        meta: {
          index: 1,
        },
      },
      {
        path: 'radar',
        name: 'Radar',
        component: ()=>import('../feature/weather/Radar.vue'),
        meta: {
          index: 1,
        },
      },
      {
        path: 'observation',
        name: 'Observation',
        component: ()=>import('../feature/weather/Observation.vue'),
        meta: {
          index: 1,
        },
      },
      {
        path: 'precipitation',
        name: 'Precipitation',
        component: ()=>import('../feature/weather/Precipitation.vue'),
        meta: {
          index: 1,
        },
      },
      {
        path: 'typhoon',
        name: 'Typhoon',
        component: ()=>import('../feature/weather/Typhoon.vue'),
        meta: {
          index: 1,
        },
      },
    ],
  },
  {
    path: '/real-time-situation',
    children: [
      {
        path: 'map',
        name: 'WaterMapView',
        component: ()=>import ('../feature/real-time-situation/WaterMapView.vue'),
        meta: { index: 2 },
      },
      {
        path: 'data',
        name: 'WaterSituationDetail',
        component: ()=>import ('../feature/real-time-situation/WaterSituationDetail.vue'),
        meta: { index: 2 },
      },
    ],
  },
  {
    path: '/tide-forecast',
    children: [
      {
        path: 'map',
        name: 'TideMapView',
        component: ()=>import ('../feature/tide-forecast/TideMapView.vue'),
        meta: { index: 3 },
      },
      {
        path: 'data',
        name: 'TideDetail',
        component: ()=>import ('../feature/tide-forecast/TideDetail.vue'),
        meta: { index: 3 },
      },
    ],
  },
  {
    path: '/accuracy-assessment',
    children: [
      {
        path: 'map',
        name: 'AccuracyMapView',
        component: ()=>import('../feature/accuracy-assessment/AccuracyMapView.vue'),
        meta: { index: 4 },
      },
      {
        path: 'data',
        name: 'AccuracyDetail',
        component: ()=>import('../feature/accuracy-assessment/AccuracyDetail.vue'),
        meta: { index: 4 },
      },
    ],
  },
  {
    path: '/typical-storm-surge',
    children: [
      {
        path: 'map',
        name: 'StormMapView',
        component: ()=>import('../feature/typical-storm-surge/StormMapView.vue'),
        meta: { index: 5 },
      },
      {
        path: 'data',
        name: 'StormDetail',
        component: ()=>import('../feature/typical-storm-surge/StormDetail.vue'),
        meta: { index: 5 },
      },
    ],
  },
  {
    path: '/model',
    children: [
      {
        path: 'map',
        name: 'ModelMapView',
        component: ()=>import('../feature/model/ModelMapView.vue'),
        meta: { index: 6 },
      },
      {
        path: 'data',
        name: 'ModelDetail',
        component: ()=>import('../feature/model/ModelDetail.vue'),
        meta: { index: 6 },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export{
  router
}