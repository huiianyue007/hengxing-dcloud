<template>
  <div class="mui-content">
    <header id="header" class="mui-bar mui-bar-nav" ref='header'>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" v-on:click="back"></a>
      <li class="mui-col-xs-5 header-lijianju1 ">
        <router-link :to="{path:'./guidelist',query:{id:scenicid}}" replace>服务</router-link>
      </li>
      <li class="mui-col-xs-5 header-lijianju2 SecnicList" tapmode>
        <span class="tab-border">详情</span>
      </li>
    </header>
    <div class="content-body">
      <div class="contentshow-box">
        <div class="content-show-box">
          <img :src="scenicInfo.bigpic==null?'static/image/default-image/common.png':image(scenicInfo.bigpic,{width:640,height:368,type:'cut'})">
        </div>
        <div class="content-show-title">
          <div class="content-show-jingdianname">{{scenicInfo.name}}</div>
          <div class="content-show-jingdianplace"><i class="icon iconfont place-icon">&#xe62c;</i>&nbsp;{{regionCode}}</div>
        </div>
      </div>
      <div class="scenic-introduction border-b">
        <div class="scenic-introduction-title">
          景区介绍
        </div>
        <div class="introduction-warp collapse-item hide">
          <div class="introduction-body mui-col-xs-12" v-bind:style="{ height: introductionHeight }">
            {{scenicInfo.introduction}}
          </div>
          <div class="introduction-more" @click="show">
            <i class="icon iconfont arrow-icon" v-if="block"></i>
            <i class="icon iconfont icon-fold arrow-icon" v-if="!block"></i>
          </div>
        </div>
      </div>
      <div class="scenic-message border-b">
        <div class="scenic-message-list collapse-item border-b" v-bind:style="{ height: menpiaoHeight }" @click="menpiao">
          <span class="scenic-message-con menpiao"><span class="title-color">门票信息：</span>{{scenicInfo.pricedesc}}</span>
          <span class="icon-word mui-pull-right" v-if="menpiaoFlag">
                    	<i class="icon iconfont arrow-icon"  v-if="dis"></i>
                    	<i class="icon iconfont icon-fold arrow-icon"  v-if="!dis"></i>
                   </span>
        </div>
        <div class="scenic-message-list collapse-item border-b" v-bind:style="{ height: visitHeight }" @click="visit">
          <span class="scenic-message-con visit"><span class="title-color">开放信息：</span>{{scenicInfo.recommend_visit_time}}</span>
          <span class="icon-word mui-pull-right" v-if="visitFlag">
                    	<i class="icon iconfont arrow-icon"  v-if="disp"></i>
                    	<i class="icon iconfont icon-fold arrow-icon"  v-if="!disp"></i>
                   </span>
        </div>
        <div class="scenic-message-list collapse-item" v-bind:style="{ height: markHeight }" @click="mark">
          <span class="scenic-message-con mark"><span class="title-color">乘车路线：</span>{{scenicInfo.mark}}</span>
          <span class="icon-word mui-pull-right" v-if="flag">
                    	<i class="icon iconfont arrow-icon"  v-if="display"></i>
                    	<i class="icon iconfont icon-fold arrow-icon"  v-if="!display"></i>
                   </span>
        </div>
      </div>
      <div class="scenic-message-list collapse-item border-b" ref="menpiao" style="opacity: 0;">
        <span class="scenic-message-con menpiao"><span class="title-color">门票信息：</span>{{scenicInfo.pricedesc}}</span>
      </div>
      <div class="scenic-message-list collapse-item" ref="car" style="opacity: 0;">
        <span class="scenic-message-con mark"><span class="title-color">乘车路线：</span>{{scenicInfo.mark}}</span>
      </div>
      <div class="scenic-message-list collapse-item border-b" ref="visit" style="opacity: 0;">
        <span class="scenic-message-con visit"><span class="title-color">开放信息：</span>{{scenicInfo.recommend_visit_time}}</span>
      </div>
    </div>
  </div>
</template>
<script>
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js'
  import _ from 'underscore'
  import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
  export default {
    data() {
        return {
          scenicid: '',
          scenicInfo: [],
          regionCode: [],
          query: null,
          introductionHeight: 100 + 'px',
          menpiaoHeight: '45px',
          visitHeight: '45px',
          markHeight: 'auto',
          //控制是否显示或者隐藏的
          block: true,
          display: true,
          dis: true,
          disp: true,
          flag: false,
          menpiaoFlag: false,
          visitFlag: false
        }
      },
      components: {

      },
      mounted() {
        this.$refs.header.style.cssText = 'top:' + tkStatusBarState.height() + 'px'
      },

      activated: function() {
        this.init();
      },
      updated() {
        var height = this.$refs.car.offsetHeight;
        var menpiaoHeight = this.$refs.menpiao.offsetHeight;
        var visitHeight = this.$refs.visit.offsetHeight;
        this.flag = this.compared(height);
        this.menpiaoFlag = this.compared(menpiaoHeight);
        this.visitFlag = this.compared(visitHeight);
      },
      methods: {
        compared(opt, flag) {
          if(opt > 52) {
            return true;
          } else {
            return false;
          }
        },
        init: function() {
          var self = this;
          this.markHeight = "auto";
          if(!_.isEqual(this.$route.query, this.query)) {
            this.query = this.$route.query;
            this.scenicInfo = [];
            this.regionCode = [];
            this.scenicid = [];
            this.introductionHeight = 100 + 'px';
            new rest().get('scenicXq', this.query.scenicid).success(function(data) {
              self.scenicInfo = data;
              regionName(data.region_code);
            }).run();

            function regionName(regionCode) {
              new rest().get('regions').parameter({
                code: regionCode,
              }).success(function(ret) {
                self.regionCode = ret[0].full_name;
                self.markHeight = "45px";
              }).run();
            }
            self.scenicid = this.query.scenicid
          }
        },
        show: function() {
          if(this.block == true) {
            this.introductionHeight = 'auto';
            this.block = false;
          } else {
            this.introductionHeight = 100 + 'px';
            this.block = true;
          }
        },
        menpiao: function() {
          if(!this.menpiaoFlag) return;
          if(this.dis == true) {
            this.menpiaoHeight = 'auto';
            this.dis = false;
          } else {
            this.menpiaoHeight = '45px';
            this.dis = true;
          }
        },
        visit: function() {
          if(!this.visitFlag) return;
          if(this.disp == true) {
            this.visitHeight = 'auto';
            this.disp = false;
          } else {
            this.visitHeight = '45px';
            this.disp = true;
          }
        },
        mark: function() {
          if(!this.flag) return;
          if(this.display == true) {
            this.markHeight = 'auto';
            this.display = false;
          } else {
            this.markHeight = '45px';
            this.display = true;
          }
        }
      },
      mixins: [Lib.P]
  }
</script>
<style scoped>
  .header-lijianju1 {
    float: left;
    text-align: right;
    padding-right: 5px;
    line-height: 44px;
  }
  
  #header {
    font-size: 16px;
    z-index:99
  }
  
  .tab-border {
    display: inline-block;
    border-bottom: 3px solid #00bcd6;
    height: 44px;
  }
  
  .header-lijianju2 {
    float: left;
    text-align: left;
    padding-left: 5px;
    line-height: 44px;
  }
  
  .content-body {
    margin-top: 44px;
  }
  
  .arrow-icon {
    color: #999;
    font-size: 15px;
  }
  /*景点封面和名称*/
  
  .content-show-title {
    top: 50%;
    margin-top: -168px;
    position: absolute;
    text-align: center;
    color: white;
    z-index: 10;
    width: 100%;
  }
  
  .content-show-jingdianname {
    font-size: 25px;
    display: block;
  }
  
  .content-show-jingdianplace {
    font-size: 12px;
    display: block;
    margin-top: 30px;
  }
  
  .content-show-box {
    background-repeat: no-repeat;
    background-size: cover;
  }
  
  .place-icon {
    font-size: 13px;
  }
  /*景区介绍*/
  
  .scenic-introduction {
    margin-top: -5px;
    padding: 5px 10px;
    background-color: #fff;
  }
  
  .scenic-introduction-title {
    color: #000;
    font-size: 20px;
    padding: 8px 0;
    font-weight: 600;
  }
  
  .introduction-body {
    color: #333;
    font-size: 14px;
    line-height: 1.8;
    overflow: hidden;
    word-wrap: break-word;
  }
  
  .introduction-more {
    text-align: center;
  }
  /*景点信息*/
  
  .scenic-message {
    background-color: #fff;
    margin: 10px 0;
    padding: 0 10px;
  }
  
  .scenic-message-list {
    padding: 12px 20px 12px 0;
    font-size: 14px;
    color: #333;
    overflow: hidden;
    word-wrap: break-word;
    line-height: 28px;
  }
  
  .title-color {
    color: #666666;
  }
  
  .collapse-item {
    position: relative;
  }
  
  .collapse-item .scenic-message-con {
    width: 100%;
    padding-right: 25px;
    height: 21px;
    overflow: hidden;
  }
  
  .collapse-item .icon-word {
    position: absolute;
    top: 10px;
    right: 0px;
  }
</style>