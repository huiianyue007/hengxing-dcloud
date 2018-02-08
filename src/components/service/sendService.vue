<template>
  <div class="box">
    <header-title content="发布服务" btn="预览" v-on:clickme="openVue"></header-title>
    <div class="mui-content">
      <ul class="mui-table-view mui-table-view-chevron" v-if="serviceInfo">
        <li class="mui-table-view-cell">
          <router-link :to="{path:'/updateService',query:{title:'标题',content:'title',con:serviceInfo.title}}" class="mui-navigate-right mui-text-left">
            <span class="field-title ls">标&emsp;&emsp;题:</span><span class="content">{{serviceInfo.title}}</span>
          </router-link>
        </li>
        <li class="mui-table-view-cell">
          <router-link :to="{path:'/updateService',query:{title:'服务区域',content:'service_region',con:address}}" class="mui-navigate-right mui-text-left">
            <span class="field-title">服务区域:</span><span class="content">{{address}}</span>
          </router-link>
        </li>
        <li class="mui-table-view-cell" v-if="serviceInfo">
          <router-link :to="{path:'/updateService',query:{title:'提供服务',content:'serviceItem'}}" class="mui-navigate-right mui-text-left">
            <span class="field-title">提供服务:</span>
            <span class="con" v-for="item in serviceItem">{{item.type_name}}</span>
            </router>
        </li>
      </ul>
      <ul class="mui-table-view mui-table-view-chevron margin-t-10" v-if="serviceInfo">
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right mui-text-left">
            <span class="field-title ls">价&emsp;&emsp;格:</span>
            <input type="text" v-model="price" :placeholder="serviceInfo.price">
            <span class="font-bold mui-margin-l-10">元/天</span>
          </a>
        </li>
        <li class="mui-table-view-cell">
          <a class="mui-navigate-right mui-text-left">
            <span class="field-title">最多接待:</span><input type="text" v-model="max_number_of_services" :placeholder="serviceInfo.max_number_of_services">
            <span class="font-bold mui-margin-l-10">人</span>
          </a>
        </li>
      </ul>
      <ul class="mui-table-view mui-table-view-chevron margin-t-10" v-if="serviceInfo">
        <li class="mui-table-view-cell">
          <a @click='openVue("scenic")' class="mui-navigate-right mui-text-left">
            <span class="field-title">服务景点</span>
          </a>
        </li>
        <li class="mui-table-view-cell scenic" v-if = 'serviceInfo.service_region'>
          <scenic :content="serviceScenics"></scenic>
        </li>
        <li class="mui-table-view-cell">
          <router-link to="/serviceDetails" class="mui-navigate-right mui-text-left">
            <span class="field-title">详情描述</span>
            <span class="content">点此修改</span>
          </router-link>
        </li>

      </ul>
      <div class="mui-btn mui-btn-block mui-btn-grey submit_btn" @click="submitService">提交审核</div>
    </div>
  </div>
</template>

<script>
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js'
  import scenic from 'components/component/scenic.vue'
  export default {
    name: 'sendService',
    data() {
      return {
        pageTitle: '发布服务',
        price: '',
        max_number_of_services: '',
        address: ''
      }
    },
    activated: function() {
      this.init();
    },
    components: {
      scenic
    },
    watch: {
      serviceInfo: function() {
        this.serviceInfo = this.$store.state.serviceInfo;

        if(this.serviceInfo) {
          this.getRegion(this.serviceInfo.service_region);
        }
      },
      serviceItem: function() {
        this.serviceItem = this.$store.state.serviceItem;
      },
      serviceScenics: function() {
        this.serviceScenics = this.$store.state.serviceScenics;
      }
    },
    computed: {
      serviceInfo: function() {
        var data = this.$store.state.serviceInfo;
        if(data) {
          this.getRegion(data.service_region);
          return data;
        }
      },
      serviceItem: function() {
        var data = this.$store.state.serviceItem;
        if(data) {
          return data;
        }
      },
      serviceScenics: function() {
        var data = this.$store.state.serviceScenics;
        if(data) {
          return data;
        }
      }
    },
    methods: {
      init: function() {
        var self = this;
        self.price = '';
        self.max_number_of_services = '';
        if(!this.serviceInfo) {
          new rest().get("serviceMain").parameter({
            version: "head"
          }).auth(true).success(function(data) {
            self.$store.commit("setServiceInfo", data);
          }).run();
          new rest().get("getSever").parameter({
            version: "head"
          }).auth(true).success(function(data) {
            if(!Array.isArray(data))data = [];
            self.$store.commit("setServiceItem", data);
          }).run();

          new rest().get("serviceScenics").parameter({
            version: "head"
          }).auth(true).success(function(data) {
            self.$store.commit("setServiceScenics", data);
          }).run();
        }
      },
      getRegion(opt) {
        var self = this;
        new rest().get("region", opt).success(function(data) {
          self.address = data.full_name;
        }).run();
      },
      submitService: function() {
        var self = this;
        var obj = {
          title: self.serviceInfo.title,
          service_region: self.serviceInfo.service_region,
          price: self.price ? self.price : self.serviceInfo.price,
          max_number_of_services: self.max_number_of_services ? self.max_number_of_services : self.serviceInfo.max_number_of_services,
          detail: self.serviceInfo.detail
        };
        new rest().put("serviceMain").auth(true).data(obj).success(function(data) {
          self.serviceMainSent();
        }).error(function(er) {
          self.toast("服务提交失败");
        }).run();
      },
      openVue: function(opt) {
        if(opt == 'scenic') {
          if(this.serviceInfo.service_region) {
            this.$router.push({
              path: '/updateServiceScenics',
              query: {
                code: this.serviceInfo.service_region
              }
            });
          } else {
            this.toast('请选择服务区域')
          }
        } else {
          this.serviceInfo.price = this.price;
          this.serviceInfo.max_number_of_services = this.max_number_of_services;
          this.$store.commit('setServiceInfo',this.serviceInfo);
          this.$router.push({
            path: "/myService"
            });
        }
      },
      serviceMainSent: function() {
        var self = this;
        new rest().get("serviceMainSent").auth(true).success(function(data) {
          self.toast("服务已提交");
        }).error(function(er) {
          self.toast(er.message);
        }).run();
      }
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .box {
    margin-bottom: 70px;
  }
  
  .mui-table-view-cell {
    height: auto;
  }
  
  .mui-table-view-cell .field-title {
    width: 75px;
    display: block;
    float: left;
    color: #999;
    text-align: justify;
  }
  
  .mui-bar-nav~.mui-content {
    padding-bottom: 57px;
  }
  
  .margin-t-10 {
    margin-top: 10px;
  }
  
  .mui-table-view-cell.scenic {
    padding: 0;
  }
  
  .mui-table-view-cell input,
  span {
    line-height: 2em;
  }
  .mui-table-view-cell input {
    width: 70px;
    overflow: hidden;
    float: left;
    text-align: center;
    height: 2em;
    padding: 0px;
    min-height: 0px!important;
    margin-left: 11px;
    background-color: #F8F8F8;
    height: 30px;
    margin-right: 9px;
  }
  
  .mui-table-view-cell .mui-navigate-right .con {
    margin-right: 10px;
  }
  
  .banner {
    width: 200%;
    overflow: hidden;
  }
  
  .banner li {
    width: 25%;
    float: left;
    padding: .3em;
    box-sizing: border-box;
  }
  
  .submit_btn {
    position: fixed;
    bottom: 0;
    margin-bottom: 0;
    background: #FEA634;
  }
</style>