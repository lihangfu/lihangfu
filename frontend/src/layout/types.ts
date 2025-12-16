// 定义菜单类型
export type menuType = {
  id?: number
  name?: string
  path?: string
  noShowingChildren?: boolean
  children?: menuType[]
  value: unknown
  meta?: {
    icon?: string
    title?: string
    rank?: number
    showParent?: boolean
    extraIcon?: string
  }
  showTooltip?: boolean
  parentId?: number
  pathList?: number[]
  redirect?: string
}
