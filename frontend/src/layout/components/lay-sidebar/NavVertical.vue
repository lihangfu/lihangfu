<script setup lang="ts">
defineOptions({
  name: '',
})
</script>

<template>
  <div :class="['sidebar-container']">
    <div>logo</div>
    <el-scrollbar wrap-class="scrollbar-wrapper"><el-menu> test </el-menu></el-scrollbar>
  </div>
</template>
