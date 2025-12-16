<script setup lang="ts">
import { defineComponent, h } from 'vue'
import NavVertical from './components/lay-sidebar/NavVertical.vue'
import LayContent from './components/lay-content/index.vue'

const LayHeader = defineComponent({
  name: 'LayHeader',
  render() {
    return h('div')
  },
})
</script>

<template>
  <div ref="appWrapperRef" :class="['app-wrapper']">
    <!-- 侧边栏 -->
    <NavVertical />
    <!-- 主区域 -->
    <div :class="['main-container']">
      <div>
        <LayHeader />
        <LayContent />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-wrapper {
  width: 100%;
  height: 100%;
}
</style>
