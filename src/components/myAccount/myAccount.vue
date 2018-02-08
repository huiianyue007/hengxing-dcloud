<template>
  <div class="box">
    <header class="mui-bar mui-bar-nav" ref='header'>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @click='back'></a>
      <h1 class="mui-title">我的账户</h1>
      <a class="save" @click="openVue('/applyRecord')">提现记录</a>
    </header>
    <div class="mui-content">
      <div class="circle">
        <p class="circle_p1">账户余额(元)</p>
        <p class="circle_p2">{{balance}}</p>
      </div>
    </div>
    <div class="foot">
      <div class="foot_left addcard" @click='openVue("/addCard")'>添加卡片</div>
      <div class="foot_right applymoney" @click='openVue("/applyCash")'>申请提现</router-link>
      </div>
    </div>
</template>

<script>
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js'
  import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
  export default {
    name: 'myAccount',
    data() {
      return {
        pageTitle: '我的账户',
        balance: 0,
        set_withdrawal_password: false,
        bankNum: 0
      }
    },
    activated: function() {
      this.init();
      tkStatusBarState.hide();
    },
    deactivated() {
      tkStatusBarState.show();
    },
    mounted() {
      this.$refs.header.style.cssText = 'top:' + tkStatusBarState.height() + 'px'
    },

    methods: {
      init() {
        var self = this;
        new rest().get("account").auth(true).success(function(data) {
          self.balance = data.balance;
          self.set_withdrawal_password = data.set_withdrawal_password;
        }).run();
        this.getBankList();
      },
      getBankList: function() {
        var self = this;
        new rest().get("backCards").auth(true).success(function(data) {
          self.bankNum = data.length;
        }).run();
      },
      openVue(str) {
        if(this.set_withdrawal_password) {
          if(this.bankNum == 0&&str != '/applyRecord') {
            this.$router.push("/setCard");
          } else {
            this.$router.push(str);
          }
        } else {
          this.$router.push('/setPassWord');
        }
      }
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .save {
    line-height: 44px;
    display: block;
    padding: 0 .5em;
    color: #fff;
    position: absolute;
    right: 10px;
    z-index: 2;
    box-sizing: border-box;
  }
  
  .mui-bar-nav {
    background: transparent;
    color: #fff;
    box-shadow: none;
  }
  
  .mui-bar-nav.mui-bar .mui-icon {
    color: #fff;
  }
  
  header .mui-title {
    color: #fff !important;
  }
  
  .mui-content {
    background: url(../../../static/image/myAccount/bg.png);
    padding-bottom: 5px;
  }
  
  .circle {
    width: 120px;
    height: 120px;
    border: 5px solid #00DFFE;
    border-radius: 50%;
    text-align: center;
    line-height: 50px;
    margin: 50px auto;
  }
  
  .circle p {
    color: #fff;
  }
  
  .circle_p1 {
    line-height: 20px;
    font-size: 14px;
    margin-top: 30px;
  }
  
  .circle_p2 {
    line-height: 30px;
    font-size: 23px;
  }
  
  .foot {
    margin: 0px auto;
    background-color: #fff;
    padding-top: 50px;
  }
  
  .foot_left {
    width: 40%;
    text-align: center;
    line-height: 45px;
    float: left;
    margin-left: 5%;
    border-radius: 5px;
    border: 1px solid #eee;
  }
  
  .foot_right {
    width: 40%;
    text-align: center;
    line-height: 45px;
    float: right;
    margin-right: 5%;
    background-color: #00A6EC;
    color: #fff;
  }
</style>