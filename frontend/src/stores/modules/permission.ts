import { defineStore } from 'pinia'
import { ref } from 'vue'
import { store } from '..'

export const usePermissionStore = defineStore('permission', () => {
  const data = ref({
    // 整体路由生成的菜单（静态、动态）
    wholeMenus: [],
  })

  /** 组装整体路由生成的菜单 */
  function handleWholeMenus(routes: any[]) {
    data.value.wholeMenus = routes
  }

  return { data, handleWholeMenus }
})

export function usePermissionStoreHook() {
  return usePermissionStore(store)
}
