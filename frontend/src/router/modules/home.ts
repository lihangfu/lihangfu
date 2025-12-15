import type { RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/layout/index.vue')

export default {
  path: '/',
  name: 'Home',
  component: Layout,
  redirect: '/welcome',
  meta: {
    icon: 'ep/home-filled',
    title: '首页',
    rank: 0,
  },
  children: [
    {
      path: '/welcome',
      name: 'Welcome',
      component: () => import('@/views/home/index.vue'),
      meta: {
        title: '首页',
      },
    },
  ],
} satisfies RouteRecordRaw
