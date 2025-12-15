<script setup lang="ts">
defineOptions({
  name: 'HomeView',
})
</script>

<template>
  <div class="home-test"><h1>Welcome</h1></div>
  <el-button type="primary">Primary</el-button>
</template>

<style lang="scss" scoped>
.home-test {
  h1 {
    color: #42b983;
  }
}
</style>
