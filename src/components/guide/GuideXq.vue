<template>
  <div class="mui-content">
    <header-title content="服务详情"></header-title>
    <div class="content-body">
      <!--地导的个人信息-->
      <div class="content-didaoxinxi border-b border-t">
        <div class="guide-ziliao border-b">
          <div class="head-img mui-pull-left">
            <img :src="guideInfo.portrait==null?'static/image/default-image/avatar.png':image(guideInfo.portrait,{width:165,height:165,type:'cut'})" class="head-pic">
          </div>
          <div class="guide-xinxi">
            <span class="username">{{guideInfo.username}}</span>
            <span class="servicetitle">{{guideInfo.title}}</span>
            <span class="serviceplace"><i class="icon iconfont place-icon">&#xe62c;</i>{{guideInfo.region_full_name}}</span>
          </div>
        </div>
        <div class="guide-tiaojian">
          <div class="fuwujiage">
            <span class="jiageicon">￥</span>&nbsp;<span class="service-price">{{guideInfo.price}}</span>&nbsp;<span class="jiagedanwei">/天（9小时）</span>
            <span class="jiedairenshu">最大接待{{guideInfo.max_number_of_services}}人</span>
          </div>
        </div>
      </div>
      <!--地导服务项目-->
      <div class="content-fuwu border-b">
        <div class="content-title border-b">
          <span class="content-title-pre"></span> &nbsp;服务
        </div>
        <div class="fuwu-body">
          <div class="fuwu-item border-b" v-for="serviceitem in serviceitems">
            <span class="fuwu-item-title" style="color:#888">{{serviceitem.type_name}}：</span>
            <span class="fuwu-item-neirong">{{serviceitem.service_direction}}</span>
          </div>
        </div>
      </div>
      <!--地导服务景点-->
      <div class="content-scenic border-b">
        <div class="content-title border-b">
          <span class="content-title-pre"></span> &nbsp;景点
        </div>
        <scenic :content="guideInfo.service_scenic"></scenic>
      </div>
      <!--地导的可用日程-->
      <div class="content-rili border-b">
        <div class="content-title border-b">
          <span class="content-title-pre"></span> &nbsp;可用日程
        </div>
        <div class="rili-body">
          <div class="rili-zhuangtai border-b">
            <span class="rili-bukeyong-kuai"></span>
            <span class="rili-zhuangtaiword">不可选</span>
            <span class="rili-keyong-kuai"></span>
            <span class="rili-zhuangtaiword">可选日期</span>
            <span class="rili-yiyong-kuai"></span>
            <span class="rili-zhuangtaiword">已预订日程</span>
          </div>
        </div>
      </div>
      <!--地导评价-->
      <div class="content-pingjia">
        <div class="content-title border-b">
          <span class="content-title-pre"></span> &nbsp;评价
        </div>
        <div class="pingjia-body">
          <div class="pingjia-pingfen border-b">
            <span class="star">
	                        <span class="nor"><img src='static/image/nor.png' class="nor-star"></span>
            <span class="set" v-bind:style="{ width: scroewidth + 'px' }"></span>
            </span>
            <span class="pingfen-fenshu">{{guideInfo.score}}分</span>
            <router-link class="pingfen-pingjiarenshu mui-pull-right" :to="{path:'./commentlist',query:{fuwuid:guideInfo.id}}">
              {{commentsNum}}人评价&nbsp;<i class="icon iconfont pingjia-icon">&#xe61d;</i>
            </router-link>
          </div>
          <div class="pingjia-box">
            <div class="pingjia-list mui-col-xs-12 border-b" v-for="comment in comments">
              <div class="pingjia-xinxi">
                <img :src="comment.commentpor==null?'static/image/default-image/avatar.png':image(comment.commentpor,{width:90,height:90,type:'cut'})" class="touxiang">
                <span class="nicheng">{{comment.username}}</span>
                <span class="fenshu">{{comment.score}}分</span>
                <span class="pingjiashijian">{{comment.time}}</span>
              </div>
              <div class="pingjia-word">
                <span>
	                                {{comment.content}}
	                            </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--图文详情-->
      <div class="content-tuwen border-b">
        <div class="content-title border-b">
          <span class="content-title-pre"></span> &nbsp;图文详情
        </div>
        <div class="tuwen-body mui-col-xs-12" v-for="detail in details">
          <span>{{detail.texts}}</span>
          <span><img :src="detail.images"></span>
        </div>
      </div>
      <!--footer-->
      <div class="height" style="height: 70px;width:100%;"></div>
      <div class="footer">
        <div class="footer-item mui-row">
          <div type="button" class="mui-btn mui-btn-royal mui-col-xs-4 shoucang" @click="collect"><i class="icon iconfont footer-icon" v-bind:style="{ color: collectColor}">&#xe626;</i>&nbsp;{{collectWord}}</div>
          <div type="button" class="mui-btn mui-btn-success mui-col-xs-4 chat">聊&nbsp;<i class="icon iconfont footer-icon">&#xe603;</i>&nbsp;聊</div>
          <div type="button" class="mui-btn mui-btn-royal mui-col-xs-4 buy" @click="buy"><i class="icon iconfont icon-buy"></i>&nbsp;购买</div>
        </div>
      </div>
      <div class="shadow" v-if="shaow"></div>
      <div class="date" v-if='dateFlag'>
        <tk-calendar @handleOk='getDate' @handleCancel='handleCancel'></tk-calendar>
      </div>
    </div>
  </div>
</template>

<script>
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js'
  import guidelist from 'assets/js/guidlist.js'
  import tkCalendar from 'components/tkCalendar/tkCalendarPop.vue'
  import scenic from 'components/component/scenic.vue'
  import _ from 'underscore'
  export default {
    data() {
        return {
          pageTitle: '服务详情',
          guideInfo: [],
          serviceitems: [],
          comments: [],
          commentsNum: [],
          details: [],
          imageHost: Lib.C.imageHost,
          scroewidth: [],
          version: ' ',
          collectWord: ' ',
          collectColor: ' ',
          collectShuju: [],
          query: null,
          dateFalg: false,
          shaow: false,
        }
      },
      computed: {
        flag: function() {
          return this.$store.state.user.isGuest;
        },
        data: function() {
          return this.$store.state.user.data;
        },
        userid: function() {
          if(this.flag) {
            return this.data.id;
          }
        }
      },
      components: {
        scenic,
        'tk-calendar': tkCalendar,
      },
      created: function() {},
      activated: function() {
        this.init();
        this.setUser();
      },
      methods: {
        init: function() {
          var self = this;
          if(!_.isEqual(this.$route.query, this.query)) {
            this.query = this.$route.query;
            this.guideInfo = [];
            this.serviceitems = [];
            this.details = [];
            this.scroewidth = [];
            this.comments = [];
            this.commentsNum = [];
            var data = guidelist[this.query.fuwuid];
            self.guideInfo = data;
            self.serviceitems = data.service_item;
            //评价分数星星显示
            var commentScore = data.score;
            loopStar(commentScore);
            //显示该地导服务做得到的星星
            function loopStar(commentScore) {
              var setStar = numDivision(commentScore);
              var newstr = setStar.replace(/%/, "");
              newstr = newstr / 100;
              var shiWidth = newstr * 100;
              self.scroewidth = shiWidth;
            }
            //两数相除得到百分比
            function numDivision(commentScore) {
              return(Math.round(commentScore / 5 * 10000) / 100.00 + "%"); //小数点后两位百分比
            }
            //图文详情
            var detail = data.detail;
          }
          //          new rest().get('service', this.query.fuwuid).parameter({
          //            expand: 'scenic'
          //          }).success(function(data) {
          //            self.guideInfo = data;
          //            self.serviceitems = data.service_item;
          //            //评价分数星星显示
          //            var commentScore = data.score;
          //            loopStar(commentScore);
          //            //显示该地导服务做得到的星星
          //            function loopStar(commentScore) {
          //              var setStar = numDivision(commentScore);
          //              var newstr = setStar.replace(/%/, "");
          //              newstr = newstr / 100;
          //              var shiWidth = newstr * 100;
          //              self.scroewidth = shiWidth;
          //            }
          //            //两数相除得到百分比
          //            function numDivision(commentScore) {
          //              return(Math.round(commentScore / 5 * 10000) / 100.00 + "%"); //小数点后两位百分比
          //            }
          //            //图文详情
          //            var detail = data.detail;
          //            for(var i = 0; i < detail.length; i++) {
          //              if(detail[i].type == 'text') {
          //                self.details.push({
          //                  texts: detail[i].value,
          //                });
          //              } else if(detail[i].type == 'image') {
          //                self.details.push({
          //                  images: self.imageHost + detail[i].value,
          //                });
          //              }
          //            }
          //          }).run();
          //评价总人数
          new rest().get('commentsList').parameter({
            service_id: this.query.fuwuid.user_id,
          }).success(function(data) {
            self.commentsNum = data.length;
          }).run();
          //评价列表
          new rest().get('commentsList').parameter({
            service_id: this.query.fuwuid.user_id,
            expand: 'user',
            //          sort:'-created_at',
            'per-page': 2,
          }).success(function(data) {
            for(var i = 0; i < data.length; i++) {
              self.comments.push({
                username: data[i].user.username,
                commentpor: data[i].user.portrait,
                score: data[i].score,
                content: data[i].content,
                time: userDate(data[i].created_at),
              });
            }
            //把时间戳格式转换成时间格式
            function userDate(uData) {
              var myDate = new Date(uData * 1000);
              var year = myDate.getFullYear();
              var month = myDate.getMonth() + 1;
              var day = myDate.getDate();
              return year + '-' + month + '-' + day;
            }
          }).run();

        },
        setUser: function() {
          if(this.flag) {
            this.whetherCollection();
          } else {
            this.collectWord = '收藏';
          }
        },
        //一进入页面判断是否收藏
        whetherCollection: function() {
          var self = this;
          new rest().get('collectList').parameter({
            service_id: this.guideInfo.id,
          }).auth(true).success(function(data) {
            self.collectWord = ' ';
            self.collectColor = ' ';
            self.collectShuju = JSON.stringify(data);
            if(self.collectShuju == '[]') {
              self.collectWord = '收藏';
              self.collectColor = '#fff';
            } else {
              self.collectWord = '已收藏';
              self.collectColor = '#fca524';
            }
          }).run();
        },
        collect: function() {
          if(this.flag) {
            
            if(this.collectWord == '收藏') {
              this.addCollect();
            } else {
              this.deleteCollect();

            }
          } else {
            this.$router.push("/login");
          }
        },
        //添加一个收藏
        addCollect: function() {
          var self = this;
          self.collectWord = ' '
          self.collectColor = ' ';
          new rest().post('addCollect').data({
            service_id: this.guideInfo.id,
            version: this.guideInfo.version,
          }).auth(true).success(function(data) {
            self.collectWord = '已收藏';
            self.collectColor = '#fca524';
          }).run();
        },
        //删除一个收藏
        deleteCollect: function() {
          var self = this;
          new rest().get('collectList').parameter({
            service_id: this.guideInfo.id,
          }).auth(true).success(function(data) {
         
            var collectId = data[0].id;
            new rest().delete('deleteCollect', collectId).auth(true).success(function(data) {
              self.collectWord = '收藏';
              self.collectColor = '#fff';
            }).error(function(er) {
              self.toast(er.message);
            }).run();
          }).run()
        },
        handleCancel() {
          this.shaow = false;
          this.dateFlag = false;
        },
        getDate(date) {
          var self = this;
          this.$router.push({
            path: "/firmorder",
            query: {
              fuwuId: self.guideInfo.id,
              startDate: date[0],
              endDate: date[1]
            }
          });
          this.shaow = false;
          this.dateFlag = false;
        },
        //购买
        buy: function(id) {
          if(this.userid == this.guideInfo.user_id) {
            this.toast("不能购买自己的服务哦！")
          } else if(this.flag) {
            this.shaow = true;
            this.dateFlag = true;
          } else {
            this.$router.push("/login");
          }
        }
      },
      mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .content-body {
    margin-top: 54px;
  }
  /*地导信息*/
  
  .content-didaoxinxi {
    background-color: #fff;
    margin-top: 10px;
  }
  
  .guide-ziliao {
    height: 92px;
    padding: 0 10px;
  }
  
  .head-img {
    margin-right: 10px;
    margin-top: 17.5px;
  }
  
  .head-pic {
    border: 1px solid #d7d7d7;
    height: 55px;
    width: 55px;
    border-radius: 50%;
  }
  
  .guide-xinxi {
    padding-top: 15px;
  }
  
  .username {
    color: #333;
    font-size: 15px;
    display: block;
  }
  
  .servicetitle {
    color: #333;
    font-size: 12px;
    display: block;
  }
  
  .serviceplace {
    color: #999;
    font-size: 12px;
    display: block;
  }
  
  .place-icon {
    font-size: 14px !important;
  }
  
  .guide-tiaojian {
    padding: 0 10px;
    height: 43px;
    line-height: 43px;
  }
  
  .jiageicon {
    font-size: 12px;
    color: #ff8518;
  }
  
  .jiagedanwei {
    font-size: 14px;
    color: #999;
  }
  
  .jiedairenshu {
    float: right;
    font-size: 12px;
    color: #999;
  }
  /*地导服务*/
  
  .content-fuwu {
    margin-top: 10px;
    background-color: #FFFFFF;
  }
  
  .fuwu-body {
    margin: 0 10px;
  }
  
  .fuwu-item {
    font-size: 14px;
    padding: 12px 0;
    color: #333;
  }
  
  .fuwu-item-title {
    width: 100%;
    word-wrap: break-word;
  }
  /*地导服务景点*/
  
  .content-scenic {
    background-color: #FFFFFF;
    margin-top: 10px;
  }
  
  .jingdian-body {
    width: 100%;
    position: relative;
    height: 99px;
  }
  /*地导可用日程*/
  
  .content-rili {
    background-color: #FFFFFF;
    margin-top: 10px;
  }
  
  .rili-zhuangtai {
    padding: 0 10px;
    height: 43px;
    line-height: 43px;
  }
  
  .rili-bukeyong-kuai {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 2px;
    background-color: #999999;
    vertical-align: middle;
    margin-right: 4px;
  }
  
  .rili-zhuangtaiword {
    display: inline-block;
    color: #333;
    font-size: 12px;
    margin-right: 4px;
  }
  
  .rili-keyong-kuai {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 2px;
    background-color: #333333;
    vertical-align: middle;
  }
  
  .rili-yiyong-kuai {
    display: inline-block;
    width: 14px;
    height: 14px;
    border-radius: 2px;
    background-color: #db1e1a;
    vertical-align: middle;
    margin-right: 4px;
  }
  /*评价*/
  
  .content-pingjia {
    background-color: #fff;
    margin-top: 10px;
  }
  
  .pingjia-pingfen {
    height: 43px;
    line-height: 43px;
    padding: 0 10px;
  }
  
  .pingjia-body .pingfen-fenshu {
    font-size: 12px;
    color: #00bcd4;
    margin-left: 2px;
  }
  
  .nor-star {
    width: 100px;
    height: 15px;
  }
  
  .set {
    position: absolute;
    background-image: url(../../../static/image/set100.png);
    left: 10px;
    top: 11px;
    height: 15px;
  }
  
  .pingjia-body .pingfen-pingjiarenshu {
    color: #999;
    font-size: 12px;
  }
  
  .pingjia-icon {
    font-size: 12px !important;
  }
  
  .pingjia-xinxi .touxiang {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    vertical-align: middle;
  }
  
  .pingjia-xinxi {
    margin-top: 10px;
    vertical-align: middle;
  }
  
  .pingjia-xinxi .nicheng {
    padding-left: 4px;
    color: #333;
    font-size: 12px;
  }
  
  .pingjia-xinxi .fenshu {
    color: #00bcd4;
    font-size: 12px;
    margin-left: 3px;
  }
  
  .pingjia-xinxi .pingjiashijian {
    color: #999;
    font-size: 12px;
    float: right;
    padding-top: 5px;
  }
  
  .pingjia-list {
    border-bottom: 1px solid #fff;
    padding: 0 10px;
  }
  
  .pingjia-word {
    color: #333;
    font-size: 12px;
    margin-top: 7px;
    margin-bottom: 11px;
  }
  /*图文详情*/
  
  .content-tuwen {
    background-color: #fff;
    margin-top: 10px;
  }
  
  .tuwen-body {
    padding: 10px;
    font-size: 14px;
    color: #333;
  }
  
  .content-tuwen img {
    width: 100%;
  }
  /*footer*/
  
  .footer-item {
    height: 42px;
    margin: 0 20px;
    font-size: 14px;
    background-color: #00BCD6;
    border-radius: 40px;
    -moz-box-shadow: 2px 2px 10px #909090;
    -webkit-box-shadow: 2px 2px 10px #909090;
    box-shadow: 2px 2px 10px #909090;
  }
  
  .footer {
    position: fixed;
    bottom: 10px;
    width: 100%;
    z-index: 10;
  }
  
  .footer-icon {
    font-size: 14px !important;
  }
  
  .mui-btn-royal {
    height: 42px !important;
    line-height: 33px !important;
    background-color: #00bcd6 !important;
    border: none !important;
    border-radius: 0px !important;
  }
  
  .mui-btn-royal.mui-active,
  .mui-btn-royal:active {
    background-color: #008395;
    border: none;
  }
  
  .shoucang {
    border-top-left-radius: 40px !important;
    border-bottom-left-radius: 40px !important;
  }
  
  .buy {
    border-top-right-radius: 40px !important;
    border-bottom-right-radius: 40px !important;
  }
  
  .mui-btn-success {
    height: 42px !important;
    line-height: 33px !important;
    border: none !important;
    background-color: #f7f7f7 !important;
    color: #00bcd6 !important;
    border-radius: 0px !important;
  }
  
  .mui-btn-success:active {
    color: #00bcd6;
    background-color: #f7f7f7;
    border: 1px solid #f7f7f7;
  }
  
  .icon-color {
    color: #fca524;
  }
  
  .shadow {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    top: 0;
    left: 0;
    z-index: 11;
  }
</style>