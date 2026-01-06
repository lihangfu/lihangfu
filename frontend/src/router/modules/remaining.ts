export default [
  {
    path: '/dice',
    name: 'Dice',
    component: () => import('@/views/dice/index.vue'),
    meta: {
      title: '骰子工具',
      showLink: false,
      rank: 101,
    },
  },
] satisfies Array<RouteConfigsTable>
