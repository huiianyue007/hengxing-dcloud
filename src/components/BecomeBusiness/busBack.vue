<template>
  <div class="box">
    <header-title content="商家后台"></header-title>
    <div class="mui-content">
      <ul class="mui-table-view">
        <li class="mui-table-view-cell mui-media">
          <a href="javascript:;">
            <img class="mui-media-object mui-pull-left" v-if="portraitSrc" :src="image(portraitSrc,{width:100,height:100,type:'cut'})">
            <img class="mui-media-object mui-pull-left" v-else src='static/image/default-image/avatar.png' />
            <div class="mui-media-body">
              {{username}}
              <p class='mui-ellipsis'>{{address}}</p>
            </div>
          </a>
        </li>
        <li class="mui-table-view-cell mui-media list">
          <span class="mui-col-sm-4 mui-text-center btn">收藏 0</span>
          <span class="mui-col-sm-4 mui-text-center btn btn_ct">浏览 0</span>
          <span class="mui-col-sm-4 mui-text-center btn" v-if = 'serviceInfo'>评分 {{serviceInfo.score}}</span>
        </li>
        <li class="mui-table-view-cell mui-media list" v-if="status">
          <div class="mui-table-btn">{{status}}</div>
        </li>
      </ul>
      <ul class="mui-table-view margin-t-10" v-if="serviceInfo">
        <li class="mui-table-view-cell">
          <a @click='openVue' class="mui-navigate-right mui-text-left">
            <span class="content">我的服务</span>
          </a>
        </li>
        <li class="mui-table-view-cell">
          <router-link :to="{path:'/sendService',query:{serviceId:serviceInfo.id}}" class="mui-navigate-right mui-text-left">
            <span class="content">发布服务</span>
          </router-link>
        </li>
      </ul>
      <ul class="mui-table-view margin-t-10">
        <li class="mui-table-view-cell">
          <router-link to="/myAccount" class="mui-navigate-right mui-text-left">
            <span class="content">我的账户</span>
          </router-link>
        </li>
      </ul>
      <ul class="mui-table-view margin-t-10">
        <li class="mui-table-view-cell">
          <router-link to="order_manage" class="mui-navigate-right mui-text-left">
            <span class="content">订单管理</span>
          </router-link>
        </li>
      </ul>
    </div>

  </div>
</template>
<script>
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js'
  export default {
    name: 'busback',
    data() {
      return {
        pageTitle: '商家后台',
        serviceInfo: null,
        status: ''
      }
    },
    activated: function() {
      this.init();
    },
    computed: {
      data() {
        return this.$store.state.user.data;
      },
      portraitSrc: function() {
        if(this.data) {
          return this.data.portrait;
        }
      },
      username: function() {
        if(this.data) {
          return this.data.username;
        }
      },
      address: function() {
        if(this.data && this.data.region) {
          return this.data.region.full_name
        }
      }
    },
    methods: {
      init: function() {
        var self = this;
        new rest().get("serviceMain").parameter({
          version: "current"
        }).auth(true).success(function(data) {
          self.serviceInfo = data;
          if(data.status == '0') {
            self.status = "没有能够上线的版本";
          } else if(data.status == '2') {
            self.status = "离线状态";
          } else if(data.status == '1' && data.review_status == '0') {
            self.status = "审核通过";
          } else if(data.status == "1" && data.review_status == "1") {
            self.status = "未提交审核";
          } else if(data.status == "1" && data.review_status == "2") {
            self.status = "正在审核中";
          } else if(data.status == "1" && data.review_status == "4") {
            self.status = "审核未通过";
          }
        }).run();
      },
      openVue() {
        if(this.serviceInfo.status != '0') {
          this.$router.push({
            path: '/myService',
            query: {
              serviceId: this.serviceInfo.id
            }
          })
        }else{
          this.toast('您还没有上线的服务')
        }
      },
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mui-table-view-cell {
    height: auto;
  }
  
  .mui-table-view-cell img {
    border-radius: 50%;
  }
  
  .list {
    padding: 1em 0em!important;
    box-sizing: border-box;
  }
  
  .list .btn {
    display: block;
    float: left;
    width: 33.3%;
    box-sizing: border-box;
  }
  
  .list .btn_ct {
    border-left: 1px solid #dfdfdf;
    border-right: 1px solid #dfdfdf
  }
  
  .margin-t-10 {
    margin-top: 10px;
    border-top: 1px solid #dfdfdf;
    border-bottom: 1px solid #dfdfdf;
  }
  
  .mui-table-btn {
    text-align: center;
    width: 80%;
    margin: 0 auto;
    line-height: 2em;
    background: #acacac;
    border-radius: 5px;
    color: #fff;
  }
</style>