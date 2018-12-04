<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
// App.vue 是单文件组件,会被根实例main.js引入去渲染,所以是 根组件
export default {
  name: 'App'
}
</script>

<style>
  #app{
    width: 100%;
    height: 100%;
  }
</style>
