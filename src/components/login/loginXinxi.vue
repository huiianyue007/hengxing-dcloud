<template>
  <div class="longinxinxi">
    <header id="header" class="mui-bar mui-bar-nav" ref='header'>
      <div class="mui-title">完善个人信息</div>
      <a class="mui-action-back mui-icon mui-icon-left-nav mui-pull-left"></a>
    </header>
    <form class="mui-input-group margin-t-60">
      <div class="class-list">
        <label>昵称</label>
        <input placeholder="请输入昵称" v-model="name" class="mui-input-clear width66" type="text" />
      </div>
      <div class="weiyuansu"></div>
      <div class="class-list">
        <label>性别</label>
        <div id="div_left">
          <input type="radio" id="one" value="0" v-model="sex"><span class="sex_nan">男</span>
        </div>
        <div id="div_right">
          <input type="radio" id="two" value="1" v-model="sex"><span class="sex_nv">女</span>
        </div>

      </div>
      <div class="weiyuansu"></div>
      <div class="class-list" @click="chooseBirday">
        <label>生日</label>
        <input placeholder="请选择日期" id='demo' v-model="birthday" readonly/>
      </div>
    </form>
    <div class="login-word" @click="loginDone">开&nbsp;启&nbsp;旅&nbsp;程</div>
  </div>
</template>

<script>
  import 'assets/css/mui.picker.min.css';
  import Lib from 'assets/js/Lib.js';
  import rest from 'assets/js/rest.js';
  import config from 'assets/js/conf.js';
  import 'assets/js/mui.picker.min.js';
  //	import 'assets/js/vue-validator.js';
  import {
    tkStatusBarState
  } from 'vue-tk/dist/components/tkStatusBar'
  export default {
    name: 'hello',
    data() {
      return {
        pageTitle: '完善个人信息',
        name: null,
        birthday: '1998-10-17',
        sex: null,
        userId: null,
      }
    },
    created: function() {
      var self = this;
      //获取个人信息放在的id
      new rest().get('self').auth(true).success(function(data) {
        self.userId = data.id
      }).run()
    },
    mounted() {
      this.$refs.header.style.cssText = 'top:' + tkStatusBarState.height() + 'px'
    },
    methods: {
      chooseBirday() {
        var self = this;
        var dtpicker = new mui.DtPicker({
          type: "date", //设置日历初始视图模式
          beginDate: new Date(1980, 8, 25), //设置开始日期 
          endDate: new Date(2010, 4, 25), //设置结束日期 
          labels: ['Year', 'Mon', 'Day'], //设置默认标签区域提示语 
        })
        dtpicker.show(function(e) {
          self.birthday = e.text
        })
      },
      loginDone() {
        var self = this;
        if(this.name == null) {
          this.toast('昵称不能为空');
        } else if(this.sex == null) {
          this.toast('请选择性别');
        } else if(this.birthday == null) {
          this.toast('请选择您的生日');
        } else {
          var value = {
            username: self.name,
            sex: self.sex,
            birthday: self.birthday
          };
          new rest().put('users', self.userId).data(value).auth(true).success(function(data) {
            self.$store.commit('setUser',data);
            self.$router.replace('/');
          }).run()
        }

      },
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .margin-t-60 {
    margin-top: 50px;
  }
  
  .class-list {
    line-height: 50px;
    padding-left: 10px;
    overflow: hidden;
    border-bottom: 1px solid #eee;
  }
  
  .class-list label {
    display: block;
    float: left;
    width: 14%;
    line-height: 52px;
  }
  
  #div_left {
    float: left;
  }
  
  .sex_nan {
    margin-left: 10px;
    margin-right: 10px;
  }
  
  .sex_nv {
    margin-left: 10px;
    margin-right: 10px;
  }
  
  #div_right {
    float: left;
  }
  
  .weiyuansu {
    height: 10px;
    width: 100%;
    background-color: #F8F8F8;
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
    font-size: 16px;
  }
  
  .width66 {
    width: 66%;
  }
</style>