import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import HelloWorld from '../components/HelloWorld.vue'
import AccuracyDetail from '../feature/accuracy-assessment/AccuracyDetail.vue'
import AccuracyMapView from '../feature/accuracy-assessment/AccuracyMapView.vue'
import ModelDetail from '../feature/model/ModelDetail.vue'
import ModelMapView from '../feature/model/ModelMapView.vue'
import WaterMapView from '../feature/real-time-situation/WaterMapView.vue'
import WaterSituationDetail from '../feature/real-time-situation/WaterSituationDetail.vue'
import TideDetail from '../feature/tide-forecast/TideDetail.vue'
import TideMapView from '../feature/tide-forecast/TideMapView.vue'
import StormDetail from '../feature/typical-storm-surge/StormDetail.vue'
import StormMapView from '../feature/typical-storm-surge/StormMapView.vue'
import Observation from '../feature/weather/Observation.vue'
import Precipitation from '../feature/weather/Precipitation.vue'
import Radar from '../feature/weather/Radar.vue'
import Satellite from '../feature/weather/Satellite.vue'
import Typhoon from '../feature/weather/Typhoon.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/weather/satellite',
  },
  {
    path: '/test',
    component: HelloWorld,
  },
  {
    path: '/weather',
    children: [
      {
        path: 'satellite',
        name: 'Satellite',
        component: Satellite,
        meta: {
          index: 1,
        },
      },
      {
        path: 'radar',
        name: 'Radar',
        component: Radar,
        meta: {
          index: 1,
        },
      },
      {
        path: 'observation',
        name: 'Observation',
        component: Observation,
        meta: {
          index: 1,
        },
      },
      {
        path: 'precipitation',
        name: 'Precipitation',
        component: Precipitation,
        meta: {
          index: 1,
        },
      },
      {
        path: 'typhoon',
        name: 'Typhoon',
        component: Typhoon,
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
        component: WaterMapView,
        meta: { index: 2 },
      },
      {
        path: 'data',
        name: 'WaterSituationDetail',
        component: WaterSituationDetail,
        meta: { index: 2 },
      },
    ],
  },
  // {
  //   path: '/tide-forecast',
  //   children: [
  //     {
  //       path: 'map',
  //       name: 'TideMapView',
  //       component: TideMapView,
  //       meta: { index: 3 },
  //     },
  //     {
  //       path: 'data',
  //       name: 'TideDetail',
  //       component: TideDetail,
  //       meta: { index: 3 },
  //     },
  //   ],
  // },
  {
    path: '/accuracy-assessment',
    children: [
      {
        path: 'map',
        name: 'AccuracyMapView',
        component: AccuracyMapView,
        meta: { index: 4 },
      },
      {
        path: 'data',
        name: 'AccuracyDetail',
        component: AccuracyDetail,
        meta: { index: 4 },
      },
    ],
  },
  // {
  //   path: '/typical-storm-surge',
  //   children: [
  //     {
  //       path: 'map',
  //       name: 'StormMapView',
  //       component: StormMapView,
  //       meta: { index: 5 },
  //     },
  //     {
  //       path: 'data',
  //       name: 'StormDetail',
  //       component: StormDetail,
  //       meta: { index: 5 },
  //     },
  //   ],
  // },
  // {
  //   path: '/model',
  //   children: [
  //     {
  //       path: 'map',
  //       name: 'ModelMapView',
  //       component: ModelMapView,
  //       meta: { index: 6 },
  //     },
  //     {
  //       path: 'data',
  //       name: 'ModelDetail',
  //       component: ModelDetail,
  //       meta: { index: 6 },
  //     },
  //   ],
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export{
  router
}