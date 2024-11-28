import { createRouter, createWebHistory } from 'vue-router'
import NewLayout from '../layouts/NewLayout.vue' // 导入新布局组件
import NewPage from '../views/NewPage.vue' // 导入新页面组件

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/new-page', // 新页面的路径
      name: 'NewPage',
      component: NewLayout, // 使用新布局组件
      children: [
        {
          path: '',
          component: NewPage // 关联新页面组件
        }
      ]
    }
  ]
})

export default router
