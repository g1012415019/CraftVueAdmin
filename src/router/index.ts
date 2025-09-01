import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: '/admin/users'
    },
    {
      path: '/admin/users',
      name: 'UserManagement',
      component: () => import('@/views/admin/UserManagement.vue')
    }
  ]
})

export default router
