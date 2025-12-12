<script setup lang="ts">
import noServer from '@/assets/status/500.svg?component'

defineOptions({
  name: '500',
})
</script>

<template>
  <div class="flex justify-center items-center h-[640px]">
    <noServer />
    <div class="ml-12">抱歉，服务器出错了</div>
  </div>
</template>
