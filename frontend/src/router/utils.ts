import { buildHierarchyTree } from '@/utils/tree'
import { isAllEmpty } from '@pureadmin/utils'
import type { RouteRecordRaw } from 'vue-router'

// 根据路由信息中的 parentId、meta.rank、name 和 path 等字段，判断该路由是否满足特定的排序 / 筛选条件。
function handRank(routeInfo: any) {
  const { name, path, parentId, meta } = routeInfo
  // 只处理顶级路由
  return isAllEmpty(parentId)
    ? isAllEmpty(meta?.rank) || (meta?.rank === 0 && name !== 'Home' && path !== '/')
      ? true
      : false
    : false
}

/** 按照路由中meta下的rank等级升序来排序路由 */
function ascending(arr: any[]) {
  arr.forEach((v, index) => {
    // 当rank不存在时，根据顺序自动创建，首页路由永远在第一位
    if (handRank(v)) v.meta.rank = index + 2
  })
  return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
    return a?.meta.rank - b?.meta.rank
  })
}

/**
 * 一维数组处理成多级嵌套数组（三级及以上的路由全部拍成二级，keep-alive 只支持到二级缓存）
 * https://github.com/pure-admin/vue-pure-admin/issues/67
 * @param routesList 处理后的一维路由菜单数组
 * @returns 返回将一维数组重新处理成规定路由的格式
 */
function formatTwoStageRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList
  const newRoutesList: RouteRecordRaw[] = []
  // 遍历原始路由列表，逐个处理每个路由项
  routesList.forEach((v: RouteRecordRaw) => {
    // 判断当前路由是否是根路由（path 为 '/'）
    if (v.path === '/') {
      // 如果是根路由：创建一个新的根路由对象，初始化 children 为空数组
      newRoutesList.push({
        component: v.component,
        name: v.name,
        path: v.path,
        redirect: v.redirect,
        meta: v.meta,
        children: [],
      })
    } else {
      // 如果不是根路由：将当前路由添加到根路由的 children 数组中
      newRoutesList[0]?.children.push({ ...v })
    }
  })
  return newRoutesList
}

/**
 * 将多级嵌套路由处理成一维数组
 * @param routesList 传入路由
 * @returns 返回处理后的一维路由
 */
function formatFlatteningRoutes(routesList: RouteRecordRaw[]) {
  if (routesList.length === 0) return routesList
  let hierarchyList = buildHierarchyTree(routesList)
  for (let i = 0; i < hierarchyList.length; i++) {
    if (hierarchyList[i].children) {
      hierarchyList = hierarchyList
        .slice(0, i + 1)
        .concat(hierarchyList[i].children, hierarchyList.slice(i + 1))
    }
  }
  return hierarchyList
}

export { ascending, formatTwoStageRoutes, formatFlatteningRoutes }
