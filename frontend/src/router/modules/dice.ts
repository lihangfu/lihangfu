export default {
  path: '/dice',
  name: 'Dice',
  meta: {
    icon: 'ri/information-line',
    showLink: false,
    title: '骰子工具',
  },
  component: () => import('@/views/dice/index.vue'),
} satisfies RouteConfigsTable
