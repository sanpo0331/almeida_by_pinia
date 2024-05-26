import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/components/Default.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/components/Home.vue')
      },
      {
        path: '/byoto/:byotoId',
        name: 'Byoto',
        component: () => import('@/components/HomeByoto.vue')
      }
    ]
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
