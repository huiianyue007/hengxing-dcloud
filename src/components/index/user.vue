<template>
  <div class="mui-content">
    <div id="my-header">
      <img src="static/image/bg_img_tx.png" class="myself-b-g">
      <div class="header">个人中心</div>
      <router-link class="tb-left" to="/version"><span class="iconfont icon-blue">&#xe602;</span></router-link>
      <div class="my-pic-mes">
        <!--个人头像-->
        <div @click="openVue('/portrait')" class="div-img-picture">
          <img v-if="portrait" :src="image(portrait)" class="my-pitctur">
          <img v-else src="static/image/default-image/avatar.png" class="my-pitctur">
        </div>
        <!--个人信息-->
        <div class="my-message text-center">
          <div class="user-name">{{flag?username:'未登录'}}</div>
          <div v-if="flag" class="sex-age">
            <span class="sex">{{sex|sex}}</span>
            <span>|</span>
            <span class="age">{{age}}</span>
          </div>
        </div>

      </div>
    </div>
    <ul class="mui-table-view margin-t-10">
      <div class="border-t"></div>
      <li class="mui-table-view-cell">
        <!--<a class="mui-navigate-right">个人信息</a>-->
        <a class="mui-navigate-right" @click="openVue('/myself')"><span class="iconfont icon-blue">&#xe627;</span>个人信息</a>
      </li>
      <li class="mui-table-view-cell">
        <a class="mui-navigate-right" v-if="flag&&data.is_service_provider=='2'" @click="openVue('/busBack')"><span class="iconfont icon-green icon-green">&#xe628;</span>商家后台</a>
        <a class="mui-navigate-right" @click="openVue('/applyService')" v-if="flag&&(data.is_service_provider=='1'||data.is_service_provider=='0')"><span class="iconfont icon-green icon-green">&#xe628;</span>成为商家</a>
        <a class="mui-navigate-right" @click="openVue('/login')" v-if="!flag"><span class="iconfont icon-green icon-green">&#xe628;</span>成为商家</a>
      </li>
      <div class="border-b"></div>
    </ul>
    <ul class="mui-table-view margin-t-10">
      <div class="border-t"></div>
      <li class="mui-table-view-cell">
        <a class="mui-navigate-right" @click="openVue('/myOrder')"><span class="iconfont icon-red">&#xe625;</span>我的订单</a>
      </li>
      <li class="mui-table-view-cell">
        <a class="mui-navigate-right" @click="openVue('/collectlist')"><span class="iconfont icon-orange">&#xe626;</span>我的收藏</a>
      </li>
      <div class="border-b"></div>
    </ul>
    <a class="foot margin-t-10 border-b border-t" v-if="flag" @click="clearUser">退出登录</a>
    <router-link class="foot margin-t-10" to="/login" v-else>用户登录</router-link>
  </div>
</template>

<script>
  import Lib from 'assets/js/Lib.js'
  import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
  export default {
    name: 'contact',
    data() {
      return {
        imageHost: Lib.C.imageHost
      }
    },
    filters: {
      sex: function(opt) {
        var data = {
          0: "男",
          1: "女"
        }
        return data[opt]
      }
    },
    activated() {
      tkStatusBarState.hide();
    },
    deactivated() {
      tkStatusBarState.show();
    },
    computed: {
      flag: function() {
        return this.$store.state.user.isGuest;
      },
      data: function() {
        return this.$store.state.user.data;
      },
      username: function() {
        if(this.flag) {
          return this.data.username;
        }
      },
      sex: function() {
        if(this.flag) {
          return this.data.sex;
        }
      },
      portrait: function() {
        if(this.flag) {
          return this.data.portrait;
        }
      },
      age: function() {
        if(this.flag) {
          return this.getAge(this.getDate(this.data.birthday));
        }
      }
    },
    watch: {
      flag: function() {
        this.flag = this.$store.state.user.isGuest;
      },
      data: function() {
        this.data = this.$store.state.user.data;
        if(this.data) {
          this.username = this.data.username;
          this.sex = this.data.sex;
          this.portrait = this.data.portrait;
          this.age = this.getAge(this.getDate(this.data.birthday));
        }
      }
    },
    methods: {
      openVue: function(str) {
        if(this.flag) {
          this.$router.push(str);
        } else {
          this.$router.replace("/login");
        }
      },
      clearUser: function() {
        this.$store.commit("setUser");
        this.$store.dispatch("removeAuth");
        this.$store.commit("setServiceInfo");
        this.$router.replace("/login");
      },
      getAge: function(num) {
        var birthday = num;
        var now = new Date().getTime();
        return Math.floor((now - birthday) / 1000 / 60 / 60 / 24 / 365);
      },
      getDate: function(str) {
        return new Date(str.replace(/-/g, '/')).getTime();
      },
      selectPic() {
        var self = this;
        if(this.flag) {
          plus.gallery.pick(function(e) {
            self.$router.push({
              path: '/selectPic',
              query: {
                imageSrc: e
              }
            });
          }, function(e) {
            self.toast('取消选择图片');
          }, {
            filter: "image",
            multiple: false,
            system: false
          });
        } else {
          self.$router.replace("/login");
        }
      }
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #my-header {
    position: relative;
    background-repeat: no-repeat;
    background-size: 100% auto;
    width: 100%;
  }
  
  .myself-b-g {
    width: 100%;
    height: auto;
  }
  
  .header {
    color: #FFFFFF;
    position: absolute;
    text-align: center;
    width: 100%;
    top: 20px;
    left: 0px;
  }
  
  .mui-navigate-right {
    font-size: 13px;
  }
  
  .mui-table-view-cell:after {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 15px;
    height: 1px;
    content: '';
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
    background-color: #c8c7cc;
  }
  
  .foot {
    display: block;
    color: #333;
    text-align: center;
    line-height: 40px;
    font-size: 13px;
    background-color: #fff;
  }
  
  .margin-t-10 {
    margin-top: 10px;
  }
  
  .text-center {
    text-align: center;
  }
  
  .my-pic-mes {
    position: absolute;
    text-align: center;
    width: 100%;
    top: 43%;
  }
  
  .div-img-picture {
    width: 60px;
    height: 60px;
    margin: 0 auto;
  }
  
  .my-pitctur {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  
  .user-name {
    font-size: 14px;
    line-height: 30px;
    margin-top: 6px;
    color: #333;
  }
  
  .sex-age {
    margin-top: -4px;
  }
  
  .my-message {
    font-size: 12px;
    color: #999;
  }
  
  .tb-left {
    position: absolute;
    right: 10px;
    top: 20px;
    color: #fff;
  }
  
  .iconfont {
    margin-right: 0.5em;
  }
  
  .icon-blue {
    color: #00adf2;
  }
  
  .icon-green {
    color: #00d060;
  }
  
  .icon-red {
    color: #ff505d;
  }
  
  .icon-orange {
    color: #fb8b46;
  }
</style>