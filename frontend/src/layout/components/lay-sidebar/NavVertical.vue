<script setup lang="ts">
import { computed } from 'vue'
import LaySidebarItem from '../lay-sidebar/components/SidebarItem.vue'
import type { menuType } from '@/layout/types'

// mock 菜单数据，后续替换成真实数据
const menuData = computed(() => {
  return [
    {
      id: 1,
      name: 'https://example.com',
      path: 'https://example.com',
      noShowingChildren: true,
      meta: {
        title: 'External Link',
      },
    } as menuType,
    {
      id: 2,
      name: 'Welcome',
      path: 'Welcome',
      noShowingChildren: true,
      meta: {
        title: 'Welcome',
      },
    } as menuType,
  ]
})
</script>

<template>
  <!-- 定义侧边栏 -->
  <div :class="['sidebar-container']">
    <!-- logo 区域 -->
    <div class="text-xl">logo</div>
    <!-- 侧边栏菜单主体，支持滚动条 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu>
        <!-- 菜单项 -->
        <LaySidebarItem
          v-for="routes in menuData"
          :key="routes.path"
          :item="routes"
          :base-path="routes.path"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>
