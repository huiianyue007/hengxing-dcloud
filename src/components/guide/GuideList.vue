<template>
  <div class="mui-content">
    <header id="header" class="mui-bar mui-bar-nav" ref='header'>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" v-on:click="back"></a>
      <div class="mui-title" v-bind:style="{ display: listtitle }">{{cityname}}所有服务</div>
      <div v-bind:style="{ display: listtle }">
        <li class="mui-col-xs-5 header-lijianju1 ">
          <span class="tab-border" style="color:#00bcd6">服务</span>
        </li>
        <li class="mui-col-xs-5 header-lijianju2 SecnicList" tapmode>
          <router-link :to="{path:'./scenicxq',query:{scenicid:scenicid}}" replace>详情</router-link>
        </li>
      </div>
    </header>
    <div class="screen-condition border-b border-t" ref='screen'>
      <div class="mui-row">
        <div class="mui-col-xs-3 mui-col-sm-3 condition-item paixu">
          <!-- @click="sortfun" v-bind:style="{ color: sortcol}"-->
                  销量排序
          <i class="icon iconfont" >&#xe62f;</i>   <!--v-if="sortarrow"-->
          <!--<i class="icon iconfont icon-iconfontjiantou-copy" v-if="!sortarrow"></i>-->
        </div>
        <div class="mui-col-xs-6 mui-col-sm-6 condition-item riqi">
          <!--@click='selectDate'-->
          <!--{{startDate?startDate:'2016-06-24'}}~{{endDate?endDate:'2016-07-01'}}-->
                  日期选择
          <i class="icon iconfont">&#xe62f;</i>
          <!--v-if="riqiarrow"-->
          <!--<i class="icon iconfont icon-iconfontjiantou-copy" v-if="!riqiarrow"></i>-->
        </div>
        <div class="mui-col-xs-3 mui-col-sm-3 condition-item shaixuan">
          <!--@click="screenfun" v-bind:style="{ color: screencol}"-->
          筛选
          <i class="icon iconfont">&#xe62f;</i>
          <!-- v-if="screenarrow"-->
          <!--<i class="icon iconfont icon-iconfontjiantou-copy" v-if="!screenarrow"></i>-->
        </div>
      </div>
    </div>
    <div class="shadow" :style='top' v-if="shaow">
      <div class="sort border-t" v-if="sort">
        <li class="paixu-item moren-paixu border-b" @click="sortService()">
          默认排序
        </li>
        <li class="paixu-item xiaoliang-paixu border-b" @click="sortService('count_of_service')">
          销量排序
        </li>
        <li class="paixu-item score-paixu border-b" @click='sortService("score")'>
          评分排序
        </li>
      </div>
      <div class="date" v-if='dateFlag'>
        <tk-calendar @handleOk='getDate' @handleCancel='handleCancel'></tk-calendar>
      </div>
      <div class="screen border-t" v-if="screen">
        <div class="price">
          <div class="price-title">
            价格
          </div>
          <div class="price-content">
            <input type="number" class="minPrice" id="minPrice" v-model="min_price">
            <span class="ge">
              <div class="fenge"></div>
            </span>
            <input type="number" class="maxPrice" id="maxPrice" v-model="max_price">
            <button class="mui-btn mui-btn-warning qingkong mui-pull-right" @click="clear">清空</button>
          </div>
        </div>
        <div class="sex">
          <div class="sex-title">
            性别
          </div>
          <div class="sex-content mui-row">
            <div class="mui-col-xs-3 sex-content-con" :class="{'checked':!sex}" @click="setSex()">不限</div>
            <div class="mui-col-xs-3 sex-content-con" :class="{'checked':sex=='1'}" @click="setSex('1')">女 </div>
            <div class="mui-col-xs-3 sex-content-con" :class="{'checked':sex=='0'}" @click="setSex('0')">男 </div>
          </div>
        </div>
        <div class="fuwu">
          <div class="fuwu-title">
            服务
          </div>
          <div class="fuwu-content">
            <div class="fuwu-item mui-row">
              <div class="mui-col-xs-3 fuwu-content-con" v-for="(servicesitem,key) in servicesitems">
                <div :class="['fuwu-content-pag',servicesitem.flag?'checked':'']" @click="setSeviceItem(key)">{{servicesitem.name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div class="anniu mui-col-xs-12">
          <button class="mui-btn quxiao" @click="cancel">重&nbsp;置</button>
          <button class="mui-btn aui-btn-warning queding" @click="submit">确&nbsp;定</button>
          <div class="clear"></div>
        </div>
      </div>
    </div>
    <div class="content-body">
      <div class="didaobox" v-if="block">

        <li class="mui-col-xs-12 didao-item border-b border-t" v-for="(service,index) in services">
          <router-link :to="{path:'./guidexq',query:{fuwuid:index}}">
            <!--fuwuid:service.id,userid:service.user_id-->
            <div class="didao-ziliao DidaoXq border-b" tapmode>
              <img :src="service.portrait==null?'static/image/default-image/avatar.png':image(service.portrait,{width:90,height:90,type:'cut'})" class="didao-pic">
              <span class="didao-name">{{service.username}}</span>
              <span class="didao-sex" v-html=""><i class="icon iconfont sex-icon" :class="[service.sex==0?'didao-malesex':'didao-femalesex']">{{service.sex |show('sexview',service.sex)}}</i></span>

              <span class="didao-pingfen">{{service.score}}分</span>
            </div>
            <div class="didao-fuwu DidaoXq">
              <div class="didao-fuwutitle">{{service.title}}</div>
              <div class="didao-fuwujingdian">
                <i class="icon iconfont scenic-icon">&#xe632;</i>
                <span class="fuwu-secnic" v-for="secnic in service.service_scenic">
	            		{{secnic.scenic_name}}&nbsp;
	            	</span>
              </div>
              <div class="didao-fuwuxiangmu">
                <span v-for="serviceitem in service.service_item">
	                        		{{serviceitem.type_name}}&nbsp;
	                        	</span>
              </div>
              <div>
                <span class="didao-fuwudidian"><i class="icon iconfont place-icon">&#xe62c;</i>{{service.region_full_name}}</span>
                <div class="didao-fuwujiage"><span class="jiageicon">￥</span><span class="service-price">{{service.price}}</span><span class="jiagedanwei">/天</span></div>
              </div>
            </div>
          </router-link>
        </li>
        <!--<infinite-loading ref="InfiniteLoading" :on-infinite="onInfinite">
				</infinite-loading>-->
      </div>
      <noData content="暂时没有服务哦！" v-if="!block"></noData>
    </div>
  </div>
</template>
<script>
  //	import InfiniteLoading from 'vue-infinite-loading'
  import Lib from 'assets/js/Lib.js'
  import noData from 'components/component/noData.vue'
  import tkCalendar from 'components/tkCalendar/tkCalendarPop.vue'
  import rest from 'assets/js/rest.js'
  import _ from 'underscore'
  import guidelist from 'assets/js/guidlist.js'
  import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
  export default {
    data() {
        return {
          pageTitle: '地导列表',
          services: [],
          scenicid: '',
          cityname: '周边',
          listtitle: '',
          listtle: '',
          servicesitems: [],
          query: null,
          rest: null,
          block: true,
          //筛选定义
          sortcol: '#666',
          sortarrow: true,
          screenarrow: true,
          riqiarrow: true,
          shaow: false,
          sort: false,
          screen: false,
          sortBy: '',
          sortTitle: '默认排序',
          min_price: "",
          max_price: '',
          sex: '',
          serviceItems: [],
          top: '',
          dateFalg: false,
          startDate: '',
          endDate: ''
        }
      },
      activated: function() {
        this.init();
//      this.serviceItem();
//      this.cancel();
      },
      components: {
        //				InfiniteLoading,
        'tk-calendar': tkCalendar,
        noData
      },
      mounted() {
        this.$refs.header.style.cssText = 'top:' + tkStatusBarState.height() + 'px'
        this.$refs.screen.style.cssText = 'top:' + (tkStatusBarState.height() + 44) + 'px'
        this.top = "top:" + (tkStatusBarState.height() + 83) + "px"
      },
      computed: {
        city() {
          return this.$store.state.city;
        }
      },
      methods: {
        init: function() {
          this.query = this.$route.query
//        this.services = []
//        this.scenicid = ''
//        this.listtle = 'block'
//        this.listtitle = 'none'
//        this.block = true;
//        this.shaow = false;

          //					if(this.$refs.InfiniteLoading) {
          //						this.$refs.InfiniteLoading.$emit('$InfiniteLoading:reset')
          //					}
          //					this.rest = null;
//        this.setService(this.seviceList);
          if(this.query.code == undefined) {
            this.listtitle = 'none';
            this.listtle = 'block';
            this.scenicid = this.query.id;
          } else {
//          this.cityname = this.query.name;
            this.listtle = 'none';
            this.listtitle = 'block';
          }
          this.services = guidelist;
        },
//      selectDate() {
//        this.shaow = true;
//        this.screen = false;
//        this.sort = false;
//        this.dateFlag = true;
//      },
//      handleCancel() {
//        this.shaow = false;
//        this.dateFlag = false;
//      },
//      getDate(date) {
//        var self = this;
//        this.services = [];
//        this.startDate = date[0];
//        this.endDate = date[1];
//        new rest().get('searchService').parameter({
//          begin_date: date[0],
//          end_date: date[1],
//          region_code: self.city.code,
//          'per-page': 40,
//        }).success(function(data) {
//          self.$store.commit("setServiceList", data)
//          self.setService(data)
//          self.shaow = false;
//          self.dateFlag = false;
//        }).run()
//      },
//      setService(opt) {
//        this.services = opt;
//        if(this.services) {
//          this.block = true;
//        } else {
//          this.block = false;
//        }
//      },
//      cancel() {
//        this.min_price = '';
//        this.max_price = '';
//        this.sex = '';
//        this.serviceItems = [];
//        var self = this;
//        this.servicesitems.forEach(function(item, key) {
//          item.flag = false;
//          self.$set(self.servicesitems, key, item)
//        });
//
//      },
//      clear() {
//        this.max_price = '';
//        this.min_price = '';
//      },
//      submit() {
          //this.serviceItems = this.serviceItems.substring(0, this.serviceItems.length - 1);

//        var self = this;
//        var service = this.seviceList;
//        var ar = [];
//        if(self.sex) {
//          service = service.filter(function(item) {
//            if(item.sex == self.sex) {
//              return item;
//            }
//          })
//        }
//        if(self.min_price) {
//          service = service.filter(function(item) {
//            if(item.price > self.min_price) {
//              return item
//            }
//          })
//        }
//        if(self.max_price) {
//          service = service.filter(function(item) {
//            if(item.price < self.max_price) {
//              return item;
//            }
//          })
//        }
//        if(self.serviceItems.length > 0) {
//          service.forEach(function(item) {
//            item.service_item.forEach(function(value) {
//              if(self.serviceItems.indexOf(value.type_id) != -1) {
//                ar.push(item);
//              }
//            })
//          })
//          service = ar;
//        }
//        this.setService(service);
//        this.screenarrow = true;
//        this.screencol = '#666';
//        this.shaow = false;
//      },
//      setSeviceItem(opt) {
//        var item = this.servicesitems[opt];
//        if(item.flag) {
//          //						this.serviceItems = this.serviceItems.replace("-"+item.id+',',"");
//          this.serviceItems = this.serviceItems.splice(opt, 1);
//          item.flag = false;
//          this.$set(this.servicesitems, opt, item);
//        } else {
//          item.flag = true;
//          this.serviceItems.push(item.id);
//          this.$set(this.servicesitems, opt, item);
//        }
//      },
//      sortService(opt) {
//        this.init();
//        if(opt) {
//          //this.sortBy = opt;
//          var service = this.seviceList.sort(function(item1, item2) {
//            return item2[opt] - item1[opt];
//          });
//          this.setService(service);
//          if(opt == 'count_of_service') {
//            this.sortTitle = '销量排序'
//          } else if(opt == 'score') {
//            this.sortTitle = '评分排序'
//          }
//        } else {
//          this.sortTitle = '默认排序';
//          this.setService(this.seviceList);
//        }
//        this.sortarrow = true;
//        this.sortcol = '#666';
//        this.shaow = false;
//      },
//      setSex(opt) {
//        if(opt) {
//          this.sex = opt;
//        } else {
//          this.sex = "";
//        }
//      },
        //				onInfinite() {
        //					var self = this
        //					if(this.rest == null) {
        //										if(this.query.code == undefined) {
        //											self.listtitle = 'none';
        //											self.listtle = 'block';
        //											self.scenicid = this.query.id;
        //											var parameter = {
        //												service_scenic: this.query.id
        //											}
        //										} else {
        //											self.cityname = this.query.name;
        //											self.listtle = 'none';
        //											self.listtitle = 'block';
        //											var parameter = {
        //												region_code: this.query.code
        //											}

        //										}
        //						if(self.sortBy) {
        //							parameter.sort = this.sortBy
        //						}else{
        //							delete parameter.sort
        //						}
        //						if(this.min_price){
        //							parameter.min_price = this.min_price;
        //						}else{
        //							delete parameter.min_price
        //						}
        //						if(this.max_price){
        //							parameter.max_price = this.max_price;
        //						}else{
        //							delete parameter.max_price
        //						}
        //						if(this.sex){
        //							parameter.sex = this.sex;
        //						}else{
        //							delete parameter.sex
        //						}
        //						if(this.serviceItems){
        //							parameter.service_item = this.serviceItems;
        //						}else{
        //							delete parameter.service_item;
        //						}
        //						this.rest = new rest()
        //						this.rest.get('searchService').parameter(parameter).success(function(data) {
        //							self.services = self.services.concat(data)
        //							self.$refs.InfiniteLoading.$emit('$InfiniteLoading:loaded')
        //						}).run()
        //					} else {
        //						this.rest.getNextPage(self)
        //					}
        //				},
        //获取服务的项目
//      serviceItem: function() {
//        var self = this;
//        new rest().get('allServiceTypes').success(function(data) {
//          self.servicesitems = data;
//          self.servicesitems.forEach(function(item) {
//            item.flag = false;
//          })
//        }).run();
//      },
//      //点击排序
//      sortfun: function() {
//        this.screen = false;
//        this.screenarrow = true;
//        this.dateFlag = false;
//        this.screencol = '#666';
//        if(this.sort == false) {
//          this.shaow = true;
//          this.sort = true;
//          this.sortarrow = false;
//          this.sortcol = '#00bcd6';
//        } else {
//          this.shaow = false;
//          this.sort = false;
//          this.sortarrow = true;
//          this.sortcol = '#666';
//        }
//      },
//      //点击筛选
//      screenfun: function() {
//        this.sort = false;
//        this.sortarrow = true;
//        this.sortcol = '#666';
//        this.dateFlag = false;
//        if(this.screen == false) {
//          this.shaow = true;
//          this.screen = true;
//          this.screenarrow = false;
//          this.screencol = '#00bcd6';
//        } else {
//          this.shaow = false;
//          this.screen = false;
//          this.screenarrow = true;
//          this.screencol = '#666';
//        }
//      }
      },
      mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .header-lijianju1 {
    float: left;
    text-align: right;
    padding-right: 5px;
    line-height: 44px;
    /*display: block;*/
  }
  
  #header {
    font-size: 16px;
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
    margin-top: 94px;
  }
  /*筛选条件*/
  
  .screen-condition {
    width: 100%;
    background-color: #F8F8F8;
    font-size: 12px;
    color: #666;
    height: 40px;
    top: 44px;
    position: fixed;
    z-index: 10;
  }
  /*筛选遮罩*/
  
  .shadow {
    position: fixed;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    top: 83px;
    left: 0;
    z-index: 11;
  }
  
  .condition-item {
    text-align: center;
    border-right: 1px solid #D7D7D7;
    margin-top: 8px;
  }
  /*排序*/
  
  .sort {
    background-color: #FFFFFF;
  }
  
  .paixu-item {
    margin: 0 10px;
    height: 44px;
    font-size: 14px;
    color: #666;
    line-height: 44px;
  }
  /*条件筛选*/
  
  .screen {
    background-color: #F8F8F8;
  }
  
  .price {
    padding: 13px 15px;
    background-color: #FFFFFF;
  }
  
  .price-title {
    font-size: 15px;
    color: #666;
  }
  
  .price-content {
    margin-top: 5px;
  }
  
  .price input {
    background-color: #f8f8f8;
    border-color: #f8f8f8;
    height: 32px;
    width: 91px;
    border-radius: 1.5px;
    padding: 0 15px;
  }
  
  .qingkong {
    color: #ffffff;
    background-color: #fea634;
    border: 1px solid #fea634;
    border-radius: 1.5px;
    height: 32px;
    line-height: 20px;
    width: 69px;
    font-size: 14px;
  }
  
  .qingkong:active {
    color: #fff;
    background-color: #fea634;
    border: 1px solid #fea634;
  }
  
  .ge {
    display: inline-block;
  }
  
  .fenge {
    display: inline-block;
    width: 18px;
    height: 1px;
    background-color: #666;
    margin: 0 5px;
  }
  
  .xian {
    display: inline-block;
    width: 18px;
    height: 5px;
    background-color: #fff;
    margin: 0 5px;
  }
  
  .sex {
    background-color: #fff;
    padding: 0 15px;
    padding-bottom: 14px;
    margin-top: 10px;
  }
  
  .sex-title {
    padding-top: 12px;
    font-size: 15px;
    color: #666;
  }
  
  .sex-content {
    margin-top: 5px;
  }
  
  .sex-content-con {
    margin-right: 10px;
    height: 29px;
    border: 1px solid #d7d7d7;
    color: #333;
    font-size: 14px;
    text-align: center;
    line-height: 29px;
    border-radius: 1.5px;
  }
  
  .fuwu {
    background-color: #fff;
    padding: 0 10px;
    margin-top: 10px;
  }
  
  .fuwu-title {
    padding-top: 12px;
    font-size: 15px;
    color: #666;
    padding-left: 5px;
    padding-bottom: 5px;
  }
  
  .fuwu-content-con {
    padding: 0 5px;
    margin-bottom: 10px;
  }
  
  .fuwu-content-pag {
    border: 1px solid #d7d7d7;
    border-radius: 1.5px;
    color: #333;
    font-size: 14px;
    text-align: center;
    line-height: 29px;
  }
  
  .fuwu-content-pag-more {
    border: 1px solid #d7d7d7;
    border-radius: 1.5px;
    color: #333;
    font-size: 14px;
    text-align: center;
    line-height: 29px;
  }
  
  .anniu {
    background-color: #fff;
    padding: 25px 15px;
  }
  
  .quxiao {
    height: 39px;
    width: 135px;
    border-radius: 0px;
    color: #333;
    font-size: 15px;
    background-color: #e5e5e5;
    border-color: #e5e5e5;
  }
  
  .quxiao:active {
    color: #333;
    background-color: #e5e5e5;
  }
  
  .queding {
    background-color: #ee9c31;
    border: 1px solid #ee9c31;
    border-radius: 0px;
    height: 39px;
    color: #fff;
    font-size: 15px;
    width: 135px;
    float: right;
  }
  
  .queding:active {
    color: #fff;
    background-color: #ee9c31;
    border: 1px solid #ee9c31;
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
  
  .checked {
    border: 1px solid #00bcd6;
    color: #00bcd6;
  }
</style>