<script setup lang="ts">
import noExist from '@/assets/status/404.svg?component'

defineOptions({
  name: '404',
})
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <noExist />
    <div class="ml-12">抱歉，你访问的页面不存在</div>
  </div>
</template>
