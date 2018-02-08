<template>
  <div class="box">
    <header id="header" class="mui-bar mui-bar-nav" ref='header'>
      <div class="mui-title">{{cityname}}附近景点</div>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <div class="mui-content">
      <div class="list-template">
        <li class="mui-col-xs-6 jingdian-item" v-for="scenic in scenics" @click="guideList(scenic.id)">
          <img :src="image(scenic.bigpic,{width:864,height:600,type:'cut'})" class="jingdian-item-pic">
          <div class="jingdian-item-name" tapmode>
            <span>{{scenic.name}}</span>
          </div>
        </li>
        <infinite-loading ref="infiniteLoading" :on-infinite="onInfinite">
          <p slot="no-more">没有更多数据了</p>
      <p slot='no-results' class='dn'></p>
        </infinite-loading>
      </div>
    </div>
  </div>
</template>
<script>
  import _ from 'underscore'
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js'
  import InfiniteLoading from 'vue-infinite-loading'
  import {
    tkStatusBarState
  } from 'vue-tk/dist/components/tkStatusBar'
  export default {
    name: 'scenicList',
    data() {
      return {
        cityname: ' ',
        scenics: [],
        query: null,
        rest: null,
      }
    },
    computed: {

    },
    activated: function() {
      this.init();
    },
    watch: {},
    mounted() {
      this.$refs.header.style.cssText = 'top:' + tkStatusBarState.height() + 'px'
    },

    methods: {
      init: function() {
        if(!_.isEqual(this.$route.query, this.query)) {
          this.query = this.$route.query
          this.scenics = []
          this.cityname = ''
          if(this.$refs.InfiniteLoading) {
            this.$refs.InfiniteLoading.$emit('$InfiniteLoading:reset')
          }
          this.rest = null;
          this.cityname = this.query.cityname;
        }
      },
      onInfinite() {
        var self = this
        if(this.rest == null) {
          this.rest = new rest()
          this.rest.get('scenicFindByRegion').parameter({
            code: self.query.citycode
          }).success(function(data) {
            if(data.length >= 20) {
                self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
              } else {
                self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
              }
            self.scenics = self.scenics.concat(data)
          }).run()
        } else {
          this.rest.getNextPage(self)
        }
      },
      guideList: function(id) {
        this.$router.push({
          path: "/guidelist",
          query: {
            id: id
          }
        });
      }
    },
    components: {
      InfiniteLoading
    },
    mixins: [Lib.P]
  }
</script>
<style scoped>
.dn{display: none;}
</style>