import { RouteRecordRaw } from 'vue-router'
import MapView from '../feature/real-time-situation/MapView.vue'
import WaterSituationDetail from '../feature/real-time-situation/WaterSituationDetail.vue'
import Satellite from '../feature/weather/Satellite.vue'

const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/weather/satellite',
  },
  {
    path: '/weather',
    children: [
      {
        path: 'satellite',
        component: Satellite,
      },
      {
        path: 'radar',
        component: Home,
      },
      {
        path: 'observation',
        component: Home,
      },
      {
        path: 'precipitation',
        component: Home,
      },
      {
        path: 'typhoon',
        component: Home,
      },
    ],
  },
  {
    path: '/real-time-situation',
    children: [
      {
        path: 'map',
        component: MapView,
      },
      {
        path: 'data',
        component: WaterSituationDetail,
      },
    ],
  },
  {
    path: '/tide-forecast',
    component: About,
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
