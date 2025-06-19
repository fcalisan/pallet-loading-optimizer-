import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory('/demo/palet-yukleme-test'),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/palet-girisi',
      name: 'palet-girisi',
      component: () => import('../views/PaletGirisiView.vue'),
    },
    {
      path: '/yukleme-planlama',
      name: 'yukleme-planlama',
      component: () => import('../views/YuklemePlanlamaView.vue'),
    },
    {
      path: '/raporlar',
      name: 'raporlar',
      component: () => import('../views/RaporlarView.vue'),
    },
    {
      path: '/proje-yonetimi',
      name: 'proje-yonetimi',
      component: () => import('../views/ProjeYonetimiView.vue'),
    },
  ],
})

export default router
