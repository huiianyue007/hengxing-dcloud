<template>
  <div class="box">
    <tk-loading v-if="!complete" type='bounce' color = 'rgba(0,189,215,.5)'></tk-loading>
    <tk-gradients-bar :end='num' :startColor='transparent' endColor='#fff' :container='container' @gradients='scrollTo' :style='top'>
      <header-top leftto="/citylist" rightto='/serach' :flag='flag'></header-top>
    </tk-gradients-bar>
    <banner></banner>
    <div class="mui-content">
      <list-title></list-title>
      <scenic-list></scenic-list>
    </div>
  </div>
</template>

<script>
  import Lib from 'assets/js/Lib.js';
  import rest from 'assets/js/rest.js';
  //import banner from 'components/home/banner.vue';
  const banner = resolve => require(['components/home/banner.vue'], resolve)
  import headerTop from 'components/home/headerTop.vue';
  import listTitle from 'components/home/listTitle.vue';
  import scenicList from 'components/home/scenicList.vue';
  import {
    tkStatusBarState
  } from 'vue-tk/dist/components/tkStatusBar';
  import TkGradientsBar from "vue-tk/dist/components/tkGradientsBar"
  import TkLoading from 'vue-tk/dist/components/tkLoading'
  export default {
    name: 'home',
    data() {
      return {
        pageTitle: '首页',
        flag: true,
        container: null,
        transparent: 'transparent',
        num: 0
      }
    },
    activated() {
      this.transparent = 'transparent'
      tkStatusBarState.setColor('transparent');
    },
    deactivated() {
      tkStatusBarState.setColor('rgb(215,215,215)')
    },
    mounted() {
      this.container = window;
      this.num = this.$el.offsetWidth / 640 * 368;
    },
    computed: {
      top() {
        return {
          top: tkStatusBarState.height() + 'px'
        }
      },
      complete() {
        return this.$store.state.complete;
      } 
    },
    methods: {
      scrollTo(state) {
        var scrollTop = state.scrollTop;
        var num = state.percentage / 100;
        if(scrollTop >= state.end) {
          this.flag = false;
          tkStatusBarState.setColor("rgb(215,215,215)")
        } else {
          this.flag = true;
          tkStatusBarState.setColor("rgba(215,215,215," + num + ")")
        }
      }
    },
    components: {
      banner,
      headerTop,
      listTitle,
      scenicList,
      TkGradientsBar,
      TkLoading
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .box {
    padding-bottom: 50px;
  }
  
  .tk-gradients-header {
    position: fixed;
    z-index: 10;
    width: 100%;
    left: 0;
    height: 48px;
  }
</style>