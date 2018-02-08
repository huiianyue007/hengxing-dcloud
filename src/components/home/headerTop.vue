<template>
  <header :class="['header',flag?'header1':'header2']">
    <div class="aui-arrow">
      <router-link :to='leftto' class="mui-pull-left location"><span id="address" class="mui-pull-left">{{city?city.name:'定位中'}}</span><i class="mui-icon mui-icon-arrowdown mui-pull-left"></i></router-link>
      <div class="search-bar-wrap mui-pull-right">
        <a @click="openVue" tag='a' class="search-bar"><i class="mui-icon mui-icon-search"></i>搜索城市/景点/导游</a>
      </div>
    </div>
  </header>
</template>

<script>
  import Lib from 'assets/js/Lib.js'
  export default {
    computed: {
      city: function() {
        return this.$store.getters.city;
      }
    },
    methods: {
      openVue: function() {
        var city = this.city;
        this.$router.push({
          path: this.rightto,
          query: {
            citycode: city.code
          }
        });
      }
    },
    computed: {
      city: function() {
        return this.$store.getters.city;
      }
    },
    props: ['leftto', 'rightto', 'flag'],
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    background:transparent;
    width: 100%;
    line-height:49px;
    color: #FFFFFF;
  }
  .header1 a {
    color: #fff;
  }
  
  .header2 a {
    color: #5AD8E8
  }
  
  .aui-arrow {
    position: relative;
    width: 100%;
    overflow: hidden;
    padding: 0 10px;
  }
  
  #address {
    width: 42px;
    white-space: nowrap;
    overflow: hidden;
  }
  
  .header .location {
    overflow: hidden;
    text-align: left;
    box-sizing: border-box;
    width: 30%;
    line-height: 49px;
    font-size: 14px;
  }
  
  .header .location .mui-icon {
    padding: 0 6px;
    font-size: 16px;
    line-height: 49px;
  }
  
  .header .location span {
    display: inline-block;
  }
  
  .search-bar-wrap {
    text-align: center;
    width: 70%;
  }
  
  .header .search-bar {
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    display: inline-block;
    border-radius: 30px;
    box-shadow: 2px 2px 10px rgba(255, 255, 255, 0.2);
    border: none;
    font-size: 14px;
    height: 32px;
    margin-top:8px;
    line-height: 32px;
  }
  
  .header1 .search-bar {
    background-color: rgba(0, 0, 0, 0.5);
    color: #f7f7f7;
  }
  
  .header2 .search-bar {
    background-color: #fff;
    color: #e0e0e0;
    border:1px solid #D7D7D7;
  }
  
  .header .search-bar .mui-icon {
    font-size: 22px;
    line-height: 22px;
    padding: 0;
  }
</style>