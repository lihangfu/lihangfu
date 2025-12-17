<script setup lang="ts">
import type { menuType } from '@/layout/types'
import SidebarLinkItem from './SidebarLinkItem.vue'
import { computed, ref, toRaw, type CSSProperties, type PropType } from 'vue'
import { posix } from 'path-browserify'
import { useRenderIcon } from '@/components/ReIcon/src/hooks'

const props = defineProps({
  item: {
    type: Object as PropType<menuType>,
  },
  isNest: {
    type: Boolean,
    default: false,
  },
  basePath: {
    type: String,
    default: '',
  },
})

const getSubMenuIconStyle = computed((): CSSProperties => {
  return {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 5px 0 0',
  }
})

const onlyOneChild: menuType = ref(null)

// 判断菜单子项（children）是否满足 “单一显示相关” 条件，用于菜单显示逻辑控制，依赖 onlyOneChild.value 存储关键菜单项。
function hasOneShowingChild(children: menuType[] = [], parent: menuType) {
  const showingChildren = children.filter((item: any) => {
    onlyOneChild.value = item
    return true
  })

  if (showingChildren[0]?.meta?.showParent) {
    return false
  }

  if (showingChildren.length === 1) {
    return true
  }

  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  return false
}

// 处理路径（routePath），根据路径类型返回正确的解析结果，优先识别 HTTP/HTTPS 协议路径，非协议路径则按 POSIX 标准拼接基础路径。
function resolvePath(routePath) {
  const httpReg = /^http(s?):\/\//
  if (httpReg.test(routePath) || httpReg.test(props.basePath)) {
    return routePath || props.basePath
  } else {
    return posix.resolve(props.basePath, routePath)
  }
}
</script>

<template>
  <!-- 菜单项 -->
  <SidebarLinkItem
    v-if="
      hasOneShowingChild(item.children, item) &&
      (!onlyOneChild.children || onlyOneChild.noShowingChildren)
    "
    :to="item"
  >
    <!-- 插槽值 -->
    <el-menu-item>
      <div v-if="toRaw(item.meta.icon)" class="sub-menu-icon" :style="getSubMenuIconStyle">
        <component
          :is="useRenderIcon(toRaw(onlyOneChild.meta.icon) || (item.meta && toRaw(item.meta.icon)))"
        />
      </div>
      <el-text truncated class="w-full! px-3! min-w-13.5! text-center! text-inherit!">
        {{ onlyOneChild.meta.title }}
      </el-text>
    </el-menu-item>
  </SidebarLinkItem>

  <!-- 存在子菜单，递归 -->
  <el-sub-menu v-else ref="subMenu" teleported :index="resolvePath(item.path)">
    <sidebar-item
      v-for="child in item.children"
      :key="child.path"
      :is-nest="true"
      :item="child"
      :base-path="resolvePath(child.path)"
      class="nest-menu"
    />
  </el-sub-menu>
</template>
