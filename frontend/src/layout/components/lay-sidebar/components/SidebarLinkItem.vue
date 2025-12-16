<script setup lang="ts">
import type { menuType } from '@/layout/types'
import { isUrl } from '@pureadmin/utils'
import { computed } from 'vue'

const props = defineProps<{
  to: menuType
}>()

const isExternalLink = computed(() => isUrl(props.to.name ? props.to.name : ''))

const getLinkProps = (item: menuType) => {
  if (isExternalLink.value) {
    return {
      href: item.name,
      target: '_blank',
      rel: 'noopener',
    }
  }
  return {
    to: item,
  }
}
</script>

<template>
  <!-- 子菜单最终展示 -->
  <!-- component 如果 to.name 是链接则加载 a 标签，如果非链接则加载 router-link -->
  <component :is="isExternalLink ? 'a' : 'router-link'" v-bind="getLinkProps(to)">
    <slot />
  </component>
</template>
