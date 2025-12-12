<script setup lang="ts">
import noAccess from '@/assets/status/403.svg?component'

defineOptions({
  name: '403',
})
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <noAccess />
    <div class="ml-12">抱歉，你无权访问该页面</div>
  </div>
</template>
