import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import WaterMapView from '../feature/real-time-situation/WaterMapView.vue'
import WaterSituationDetail from '../feature/real-time-situation/WaterSituationDetail.vue'
import Observation from '../feature/weather/Observation.vue'
import Precipitation from '../feature/weather/Precipitation.vue'
import Radar from '../feature/weather/Radar.vue'
import Satellite from '../feature/weather/Satellite.vue'

const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/weather/satellite',
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
        component: Home,
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
  {
    path: '/tide-forecast',
    children: [
      {
        path: 'map',
        name: 'TideMapView',
        component: WaterMapView,
        meta: { index: 2 },
      },
      {
        path: 'data',
        name: 'TideDetail',
        component: WaterSituationDetail,
        meta: { index: 2 },
      },
    ],
  },
  {
    path: '/accuracy-assessment',
    component: About,
  },
  {
    path: '/typical-storm-surge',
    component: About,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes: routes,
})
