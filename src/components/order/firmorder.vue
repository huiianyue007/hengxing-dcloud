<template>
  <div class="box">
    <header-title content="确认订单"></header-title>
    <div class="mui-content">
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
      <div class="didao-fuwu border-b">
        <div class="fuwu-scenic">
          <span class="fuwu-scenic-item">
                    	<span class="fuwu-title">景点：</span>
          <span v-for="servicescenic in servicescenics">
                    		{{servicescenic.scenic_name}}&nbsp;
                    	</span>
          </span>
        </div>
        <div class="fuwu-type">
          <span class="fuwu-type-item">
                    	<span class="fuwu-title">服务：</span>
          <span v-for="serviceitem in serviceitems">
                    		{{serviceitem.type_name}}&nbsp;
                    	</span>
          </span>
        </div>
      </div>
      <div class="didao-jiedai border-b">
        <div class="jiedai-renshu">
          最大接待{{guideInfo.max_number_of_services}}人
        </div>
        <div class="jiedai-leixing mui-row">
          <div class="chengren mui-col-xs-6">
            <span class="jiedai-title">成人</span>
            <span class="box">
                            <span class="crjian jian" @click="crExpires(false)">—</span>
            <input class="crnumb numb" v-model="crexpires">
            <span class="crjia jia" @click="crExpires(true)">+</span>
            </span>
          </div>
          <div class="ertong mui-col-xs-6">
            <span class="jiedai-title">儿童</span>
            <span class="box">
                            <span class="etjian jian" @click="etExpires(false)">—</span>
            <input class="etnumb numb" v-model="etexpires">
            <span class="etjia jia" @click="etExpires(true)">+</span>
            </span>
          </div>
        </div>
      </div>
      <div class="chuxingTime border-b" id="demo" @click="selectDate">
        <span class="time-item">{{startDate}}&nbsp;至&nbsp;{{endDate}}</span>
        <span class="mui-pull-right right-arrow"><i class="icon iconfont icon-enter"></i></span>
      </div>
      <div class="insurance border-b">
        <div class="baoxian-title border-b">
          平安保险
        </div>
        <div class="insurance-box">
          <li class="insurance-item border-b clear" v-for="(insurance,key) in insurances">
            <span class="mui-pull-left" @click="radio(insurance.id,key)">
                			<span class="radio" v-if="keyv!=key" ></span>
            <img src="static/image/zhifu/iconfont_xuanzeda.png" class="radio-check" v-else />
            </span>
            <span class="insurance-type">
                            <span class="insurance-title">{{insurance.name}}
                            	<span class="free-word" :class="[insurance.type==2?'show':'hide']">
                            		(横行赠送)
                            	</span>
            </span>
            <span class="mui-pull-right" @click="show(key)">
                            	<span class="insurance-pirce">
	                            	￥{{insurance.price}}x1/份
	                                <div class="free" :class="[insurance.type==2?'show':'hide']"></div>
	                            </span>
            <span class="insurance-icon">
	                                <i class="icon iconfont icon-enter right-icon"></i>
	                            </span>
            </span>
            </span>
            <div class="insurance-detail" v-if="showv==key">{{insurance.detail}}</div>
          </li>
        </div>
      </div>
      <div class="liuyan">
        <div class="mui-input-row" style="margin: 10px 0;">
          <label class="liuyan-title">买家留言:</label>
          <textarea class="buymess" id="textarea" rows="5" cols="30" placeholder="有什么特殊需求，尽管留言吧！" v-model="textareaValue"></textarea>
        </div>
      </div>
      <div style="height: 60px;"></div>
      <div class="mui-btn mui-btn-primary mui-col-xs-12 firmorderbtn" @click='submitOder'>{{orderWord}}</div>
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
  import tkCalendar from 'components/tkCalendar/tkCalendarPop.vue'
  import _ from 'underscore'
  export default {
    data() {
        return {
          pageTitle: '确认订单',
          guideInfo: [],
          serviceitems: [],
          servicescenics: [],
          insurances: [],
          orderWord: '',
          startDate: '',
          endDate: '',
          crexpires: '1',
          etexpires: '0',
          price: '',
          totalPrice: ' ',
          textareaValue: '',
          keyv: '',
          showv: '',
          query: null,
          block: true,
          display: true,
          dateFalg: false,
          shaow: false,
          orderArray: {
            service_id: '',
            inception: '130102',
            need_insurance: 0,
            insurance_id: '',
            begin_date: '',
            end_date: '',
            number_of_adults: 1,
            number_of_children: 0,
            buyer_message: '',
          }
        }
      },
      created: function() {},
      activated: function() {
        this.init();
        this.insurance();
      },
      computed: {
        city: function() {
          return this.$store.getters.city;
        }
      },
      components: {
        'tk-calendar': tkCalendar,
      },
      methods: {
        init: function() {
          var self = this;
          self.keyv = '@';
          self.showv = '@';
          if(!_.isEqual(this.$route.query, this.query)) {
            this.query = this.$route.query;
            this.guideInfo = [];
            this.serviceitems = [];
            this.servicescenics = [];
            self.startDate = this.query.startDate;
            self.endDate = this.query.endDate;
            self.orderArray.begin_date = this.query.startDate;
            self.orderArray.end_date = this.query.endDate;
            new rest().get('service', this.query.fuwuId).success(function(data) {
              self.dddd(data)
              self.guideInfo = data;
              self.orderArray.service_id = data.id;
              self.serviceitems = data.service_item;
              self.servicescenics = data.service_scenic;
            }).run();
          }
        },
        dddd: function(data) {
          var beginTime = new Date(this.startDate.replace(/-/g, '/')).getTime();
          var endTime = new Date(this.endDate.replace(/-/g, '/')).getTime();
          var time = (Math.floor(endTime - beginTime) / 1000 / 86400) + 1;
          this.totalPrice = time * data.price;
          this.orderWord = "￥" + this.totalPrice + "提交订单";
        },
        insurance: function() {
          var self = this;
          new rest().get('insuranceList').success(function(data) {
            self.insurances = data;
          }).run()
        },
        radio: function(id, key) {
          if(this.keyv == key) {
            this.keyv = '@';
            this.orderArray.need_insurance = 0;
            this.orderArray.insurance_id = '';
            this.orderWord = "￥" + this.totalPrice + "提交订单";
          } else {
            this.keyv = key;
            this.orderArray.need_insurance = 1;
            this.orderArray.insurance_id = id;
            this.orderWord = '下一步';
          }
        },
        show: function(key) {
          if(this.showv == key) {
            this.showv = '@';
          } else {
            this.showv = key;
          }
        },
        crExpires: function(opt) {
          var people = this.guideInfo.max_number_of_services;
          var zongnum = (this.crexpires - 0) + (this.etexpires - 0);
          if(opt) {
            if(this.crexpires < people && zongnum < people) {
              this.crexpires++
            } else {
              this.toast("最大接待人数为" + people + "人")
            }

          } else {
            if(this.crexpires >= 1) {
              this.crexpires--;
            }
          }
          this.orderArray.number_of_adults = this.crexpires;
        },
        etExpires: function(opt) {
          var people = this.guideInfo.max_number_of_services;
          var zongnum = (this.crexpires - 0) + (this.etexpires - 0);
          if(opt) {
            if(this.etexpires < people && zongnum < people) {
              this.etexpires++
            } else {
              this.toast("最大接待人数为" + people + "人")
            }
          } else {
            if(this.etexpires >= 1) {
              this.etexpires--;
            }
          }
          this.orderArray.number_of_children = this.etexpires;
        },
        selectDate() {
          this.shaow = true;
          this.dateFlag = true;
        },
        handleCancel() {
          this.shaow = false;
          this.dateFlag = false;
        },
        getDate(date) {
          this.startDate = date[0];
          this.endDate = date[1];
          this.orderArray.begin_date = date[0];
          this.orderArray.end_date = date[1];
          this.shaow = false;
          this.dateFlag = false;
        },
        submitOder: function() {
          this.orderArray.inception = this.city.code;
          this.orderArray.buyer_message = this.textareaValue;
          var self = this;

          new rest().post('ordersList').data(this.orderArray).auth(true).success(function(data) {
            console.log('2')
            var orderId = data.order_id;
            if(self.orderWord == "下一步") {
              self.$router.push({
                path: "/setInsurance",
                query: {
                  orderId: orderId,
                }
              });
            } else {
              self.$router.push({
                path: "/paySuccess",
              });
            }
          }).run();
        }
      },
      mixins: [Lib.P]
  }
</script>
<style scoped>
  .shadow {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    top: 0;
    left: 0;
    z-index: 11;
  }
  
  .hide {
    display: none;
  }
  
  .show {
    display: inline-block;
  }
  /*地导信息*/
  
  .guide-ziliao {
    height: 92px;
    margin: 0 10px;
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
  
  .didao-fuwu {
    padding: 10px;
  }
  
  .fuwu-title {
    color: #666666;
  }
  
  .fuwu-scenic {
    width: 90%;
    text-overflow: ellipsis !important;
    overflow: hidden;
    white-space: nowrap;
  }
  
  .fuwu-scenic-item {
    color: #333;
    font-size: 12px;
  }
  
  .fuwu-type-item {
    color: #333;
    font-size: 12px;
  }
  /*接待人数*/
  
  .jiedai-renshu {
    color: #999;
    font-size: 12px;
    padding: 10px 10px;
  }
  
  .jiedai-title {
    color: #333;
    font-size: 15px;
    float: left;
    padding-right: 10px;
  }
  
  .jiedai-leixing {
    background-color: #fff;
    height: 44px;
    line-height: 44px;
    padding: 0 10px;
  }
  
  .box {
    height: 24px;
    line-height: 23px;
  }
  
  .jian {
    display: inline-block;
    margin-top: 10px;
    width: 24px;
    height: 24px;
    float: left;
    border: 1px solid #999;
    color: #999;
    text-align: center;
  }
  
  .numb {
    margin-top: 10px;
    border: 0px;
    width: 24px;
    height: 24px;
    text-align: center;
    overflow: hidden;
    font-size: 14px;
    float: left;
  }
  
  .jia {
    margin-top: 10px;
    display: inline-block;
    width: 24px;
    height: 24px;
    float: left;
    border: 1px solid #1fbdc4;
    color: #1fbdc4;
    text-align: center;
  }
  /*出行时间*/
  
  .chuxingTime {
    margin-top: 10px;
    background-color: #fff;
    padding: 0 10px;
    height: 44px;
    line-height: 44px;
  }
  
  .time-item {
    font-size: 15px;
    color: #333;
  }
  /*保险*/
  
  .insurance {
    background-color: #fff;
    padding: 0 10px;
    margin-top: 10px;
  }
  
  .free-word {
    color: #999999;
  }
  
  .baoxian-title {
    height: 44px;
    line-height: 44px;
    font-size: 15px;
    color: #333;
  }
  
  .insurance-item {
    margin-bottom: -1px;
  }
  
  .insurance-type {
    line-height: 43px;
    vertical-align: middle;
    height: 44px;
  }
  
  .insurance-title {
    color: #333;
    font-size: 15px;
    margin-left: 10px;
  }
  
  .insurance-pirce {
    display: inline-block;
    color: #fca524;
    font-size: 15px;
    padding-right: 3px;
    position: relative;
  }
  
  .insurance-detail {
    color: #999;
    font-size: 12px;
    padding-left: 32px;
    padding-bottom: 10px;
  }
  
  .radio {
    display: inline-block;
    width: 22px;
    height: 22px;
    background-color: #ffffff;
    border: solid 1px #d7d7d7;
    border-radius: 50%;
    margin-top: 11px;
  }
  
  .radio-check {
    width: 22px;
    height: 22px;
    margin-top: 11px;
  }
  
  .free {
    height: 1px;
    background-color: #fca524;
    background-color: none;
    width: 53px;
    position: absolute;
    top: 21px;
    left: 15px;
  }
  /*买家留言*/
  
  .buymess {
    padding-left: 7px;
  }
  
  .liuyan-title {
    font-size: 14px;
    padding: 10px;
  }
  
  .mui-input-row label {
    float: left;
    width: auto;
  }
  
  .mui-input-row label~input,
  .mui-input-row label~select,
  .mui-input-row label~textarea {
    float: left;
    width: auto;
  }
  
  .liuyan {
    background-color: #FFFFFF;
    width: 100%;
  }
  
  textarea {
    font-size: 14px;
    margin-top: -3px;
  }
  
  input[type=color],
  input[type=date],
  input[type=datetime-local],
  input[type=datetime],
  input[type=email],
  input[type=month],
  input[type=number],
  input[type=password],
  input[type=search],
  input[type=tel],
  input[type=text],
  input[type=time],
  input[type=url],
  input[type=week],
  select,
  textarea {
    line-height: 21px;
    width: 100%;
    margin-bottom: 15px;
    padding: 10px 5px;
    -webkit-user-select: text;
    border: 1px solid #fff;
    border-radius: 0px;
    outline: 0;
    background-color: #fff;
    -webkit-appearance: none;
  }
  
  .mui-btn-primary {
    margin-top: 20px;
    height: 44px;
    font-size: 15px;
    line-height: 33px;
  }
  
  .firmorderbtn {
    bottom: 0;
    position: fixed;
  }
  /*字体图标的大小*/
  
  .sex-icon {
    font-size: 13px !important;
    padding-left: 1px !important;
  }
  
  .scenic-icon {
    font-size: 13px;
  }
  
  .place-icon {
    font-size: 13px;
  }
  
  .right-icon {
    font-size: 13px;
    color: #999999;
  }
</style>