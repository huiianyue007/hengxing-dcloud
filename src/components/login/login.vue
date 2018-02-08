<template>
  <div class="login">
    <header class="header">
      <!--	<span class="content-title">Heng Xing</span>-->
      <a class="mui-icon mui-icon-left-nav mui-pull-left aui-con" @click="back"></a>
      <img class="hender-img" src="static/image/login_bg.png" />
    </header>
    <form class="mui-input-group">
      <div class="mui-input-row">
        <label for = 'phone'>手机号</label>
        <input type="text" class="mui-input-clear" id = 'phone' v-model="message" @keyup="keyUpInput">
      </div>
      <div class="mui-input-row">
        <label for = 'verification'>验证码</label>
        <input type="text" class="" id = 'verification' v-model="verification_password">
        <input v-model="verification" class="verification-code" v-bind:class="classObject" type="button" v-bind:disabled="shuxing" @click="sendSms" />
      </div>

    </form>
    <div class="login-word" @click="login">登录</div>
    <p class="login-p">
      登录即代表同意
      <router-link class="foot margin-t-10" to="/agreement" tag="span">用户协议</router-link>
    </p>
  </div>
</template>

<script>
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js';
  import config from 'assets/js/conf.js';
  import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
  export default {
    data() {
        return {
          //页面title
          pageTitle: '登录页',
          //登录手机号
          message: '',
          //登录验证码
          verification_password: '',
          //将类的取消或者出现
          classObject: {
            'class-a': false,
          },
          //button是否能使用
          shuxing: '',
          //button上面的文字
          verification: '发送验证码',
          //验证码时间
          time: 60,
        }
      },
      activated() {
        this.verification_password = '';
        tkStatusBarState.hide();
      },
      deactivated() {
        tkStatusBarState.show();
      },
      methods: {
        //判断手机号的
        keyUpInput() {
          var phone = this.message;
          var self = this;
          if(phone.length == 11 && !isNaN(phone)) {
            self.classObject = {
              'class-a': true,
            }
            self.shuxing = false
          } else {
            self.classObject = {
              'class-a': false,
            }
            self.shuxing = 'disabled'
          }
        },
        //发送短信的
        sendSms() {
          var self = this;
          new rest().post('sms').data({
              'phone': self.message
            }).success(function(data) {
              plus.nativeUI.toast('短信已发送');
            }).error(function(xhr) {
              plus.nativeUI.toast('短信出现错误');
            }).run()
            //短信的倒计时
          this.verification = "重新发送(" + self.time + ")";
          self.shuxing = 'disabled';
          var timeid = setInterval(function() {
            self.time--;
            self.verification = "重新发送(" + self.time + ")";
            if(self.time <= 0) {
              clearInterval(timeid);
              self.time = 60;
              self.verification = '重新发送'
              self.shuxing = false;
            }
          }, 1000)
        },
        //				点击登录的效果
        login() {
          var self = this;
          if(self.message.length == 11 && !isNaN(self.message) && self.verification_password.length == 4 && !isNaN(self.verification_password)) {
            new rest().post('token').data({
              "grant_type": "password",
              "username": self.message,
              "password": self.verification_password,
              "client_id": config.client_id,
              "client_secret": config.client_secret
            }).success(function(data) {
              self.loginCallback(data)
              self.$store.dispatch('setAuth', data);
            }).error(function(data) {
              self.toast('验证码错误');
            }).run()
          } else {
            self.toast('请填写正确的手机号验证码');
          }
        },
        //点击登陆后的跳转效果
        loginCallback(data) {
          var self = this;
          new rest().get('self').parameter({
            expand: "region"
          }).auth(data.access_token).success(function(ret) {

            if(ret.birthday == null || ret.username == null || ret.sex == null) {
              self.$router.push('/loginxinxi')
            } else {
              self.$store.commit('setUser', ret);
              self.$router.go(-1);
            }
          }).error(function(err) {
            self.toast(er.message)
          }).run()
        },
        back() {
          this.$router.replace('/');
        },
      },
      mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header {
    position: relative;
    background-color: #FFF;
  }
  
  .aui-con {
    position: absolute;
    color: #FFFFFF;
    left: 10px;
    top: 10px;
  }
  
  .content-title {
    position: absolute;
    width: 100%;
    top: 45%;
    color: #FFFFFF;
    font-size: 32px;
    font-weight: 700;
    text-align: center;
  }
  
  .mui-input-row {
    position: relative;
  }
  
  .hender-img {
    width: 100%;
  }
  
  .mui-input-row label {
    color: #999999;
    padding: 0px 15px;
    line-height: 50px;
    padding-top: 2px;
    width: 27%;
  }
  
  .mui-input-row label~input {
    width: 72%;
  }
  
  .mui-input-group:before {
    height: 0px;
  }
  
  .mui-input-group .mui-input-row {
    height: 50px;
  }
  
  .mui-input-row .verification-code {
    width: 100px;
    position: absolute;
    right: 0px;
    top: 9px;
    height: 30px;
    text-align: center;
    color: #999999;
    padding-left: 10px;
  }
  
  .login-word {
    width: 70%;
    line-height: 40px;
    color: #FFFFFF;
    text-align: center;
    margin: 0 auto;
    margin-top: 25px;
    background-color: #00bcd6;
    border-radius: 18px;
    font-size: 14px;
  }
  
  .login-p {
    margin-top: 20px;
    padding-left: 15px;
    font-size: 13px;
  }
  
  .user-agreement {
    color: #333;
    text-decoration: underline
  }
  /*动态绑定的类*/
  
  .mui-input-row .class-a {
    color: #00bcd6;
  }
  
  .foot {
    text-decoration: underline
  }
</style>