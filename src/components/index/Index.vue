<template>
  <div class="content">
    <keep-alive>
      <component :is="page"></component>
    </keep-alive>
    <nav class="mui-bar mui-bar-tab">
      <a v-for='(item,key) in items' :class="['mui-tab-item',key==page?'mui-active':'']" @click="openVue(key)">
        <span class='iconfont' v-html='item.icon'></span>
        <span class="mui-tab-label">{{item.txt}}</span>
      </a>
    </nav>
  </div>
</template>

<script>
  import Lib from 'assets/js/Lib.js'
  import rest from "assets/js/rest.js"
  import home from 'components/index/home.vue'
  import chat from 'components/index/chat.vue'
  import contact from 'components/index/user.vue'
  import mui from 'assets/js/mui.js'
  import {
    tkStatusBarState
  } from 'vue-tk/dist/components/tkStatusBar';
  export default {
    name: 'Index',
    data() {
      return {
        items: {
          home: {
            icon: "&#xe624;",
            txt: "首页"
          },
          chat: {
            icon: "&#xe603;",
            txt: "聊天"
          },
          contact: {
            icon: "&#xe621;",
            txt: "我"
          },
        }
      }
    },
    components: {
      home,
      chat,
      contact
    },
    computed: {
      page: function() {
        return this.$store.state.indexPage;
      },
      city() {
        return this.$store.state.city;
      }
    },
    created() {
      var self = this;
      var version = Lib.U.os.version;
      if(Lib.U.os.android) {
        var num = 0
        let time = setInterval(() => {
          if(!this.city.ready && num < 6) {
            Lib.U.plusReady(function() {
              self.cityInit()
              num++
            })
          } else {
            clearInterval(time);
          }
        }, 1000);
      } else if(!this.city.ready) {
        this.cityInit();
      }
    },
    activated() {
      tkStatusBarState.setSpace(false);
    },
    deactivated() {
      tkStatusBarState.setSpace(true);
    },
    watch: {
      page: function() {
        this.page = this.$store.state.indexPage;
      }
    },
    methods: {
      cityInit() {
        var self = this;
        plus.geolocation.getCurrentPosition(function(position) {  
          self.getCityFromLocation(position)
        }, function(e) {
          self.toast('定位失败');
          self.$store.commit("setCity", {
            code: '130102',
            name: '石家庄',
            province: '河北省',
            ready: true
          })
          self.getServiceList('130102')
        }, {
          geocode: true,
          provider: 'amap'
        })
      },
      getCityFromLocation(location) {
        var self = this;
        new rest().get("http://restapi.amap.com/v3/geocode/regeo").parameter({
          key: '5ace4711bee045e7f6fe9dd4573d02a5',
          location: location.coords.longitude + ',' + location.coords.latitude,
        }).success(function(data) {
          var code = data.regeocode.addressComponent.adcode;
          if(code.length > 0) {
            var city = {
              code: data.regeocode.addressComponent.adcode,
              name: data.regeocode.addressComponent.city.length ? data.regeocode.addressComponent.city : data.regeocode.addressComponent.province,
              province: data.regeocode.addressComponent.province,
              ready: true
            }
            self.$store.commit("setCity", city)
            self.getServiceList(city.code);
          }
        }).error(function() {
          self.$store.commit("setCity", {
            ready: true
          })
        }).run();
      },
      getServiceList(citycode) {
        var self = this;
        new rest().get('searchService').parameter({
          region_code: citycode,
          'per-page': 40,
        }).success(function(data) {
          self.$store.commit("setServiceList", data)
        }).run()
      },
      openVue: function(page) {
        this.$store.commit("setIndexPage", page);
      }
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content {
    min-height: 100%;
    background: #f8f8f8;
  }
  
  .mui-bar-tab {
    box-sizing: border-box;
    background: rgba(255, 255, 255, .95);
    box-shadow: 0 0 1px #d9d9d9;
    z-index:10000000;
  }
  
  .mui-bar-tab .mui-tab-item {
    height: 49px;
    overflow: hidden;
  }
  
  .mui-bar-tab .mui-tab-item .iconfont {
    display: block;
    margin-top: 5px;
    font-size: 20px;
  }
  
  .mui-bar-tab .mui-tab-item.mui-active {
    color: #00bcd4;
  }
  
  .mui-bar-tab .mui-tab-item.mui-active .iconfont {
    color: #00bcd6;
  }
  
  .mui-bar-tab .mui-tab-item .mui-tab-label {
    font-size: 12px;
  }
</style>