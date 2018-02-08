<template>
  <div id="hengxing">
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>
<script>
  import {
    default as TKStatusBar,
    tkStatusBarState
  } from 'vue-tk/dist/components/tkStatusBar'
  
  export default {
    name: 'app',
    components: {
      'tk-status-bar': TKStatusBar
    },
    created() {
      tkStatusBarState.setColor('rgb(215,215,215)')
    }
  }
</script>

<style>
  #hengxing {
    min-height: 100%;
  }
</style>