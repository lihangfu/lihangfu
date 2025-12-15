<script setup lang="ts">
import NavVertical from './components/lay-sidebar/NavVertical.vue'
</script>

<template>
  <div ref="appWrapperRef" :class="['app-wrapper']">
    <NavVertical />
    <div>
      <div>主体头部</div>
      <div>主体内容</div>
      <RouterView />
    </div>
  </div>
</template>
