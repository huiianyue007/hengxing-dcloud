<template>
	<div class="mui-content">
		<header-title content="服务详情"></header-title>
		<div class="content-body" v-if="guideInfo||serviceInfo">
			<!--地导的个人信息-->
			<div class="content-didaoxinxi border-b border-t">
				<div class="guide-ziliao border-b">
					<div class="head-img mui-pull-left">

						<img :src="guideInfo.portrait==null?'static/image/default-image/avatar.png':image(guideInfo.portrait,{width:165,height:165,type:'cut'})" class="head-pic">
					</div>
					<div class="guide-xinxi">
						<span class="username">{{guideInfo.username}}</span>
						<span class="servicetitle" v-if="guideInfo&&serviceInfo">{{serviceId?guideInfo.title:serviceInfo.title}}</span>
						<span class="serviceplace"><i class="icon iconfont place-icon">&#xe62c;</i>{{serviceId?guideInfo.region_full_name:address}}</span>
					</div>
				</div>
				<div class="guide-tiaojian">
					<div class="fuwujiage">
						<span class="jiageicon">￥</span>&nbsp;<span class="service-price">{{serviceId?guideInfo.price:price}}</span>&nbsp;<span class="jiagedanwei">/天（9小时）</span>
						<span class="jiedairenshu">最大接待{{serviceId?guideInfo.max_number_of_services:maxNum}}人</span>
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
					<span class="content-title-pre"></span> &nbsp;景 点
				</div>
				<scenic :content="serviceScenics" v-if = "serviceId"></scenic>
				<scenic :content="serviceScenic" v-else></scenic>
				
			</div>
			<!--图文详情-->
			<div class="content-tuwen border-b">
				<div class="content-title border-b">
					<span class="content-title-pre"></span> &nbsp;图文详情
				</div>
				<div class="tuwen-body mui-col-xs-12" v-for="detail in details">
					<span v-if="detail.type=='text'">{{detail.value}}</span>
					<img :src="image(detail.value)" alt="" v-if="detail.type=='image'" />
				</div>
			</div>

			<!--footer-->
			<div style="height: 60px;width:100%;" v-if = "serviceId"></div>
			<div class="footer" v-if="serviceId">
				<div class="footer-item mui-row">
					<router-link type="button" class="mui-btn mui-btn-royal mui-col-xs-6 buy" :to="{path:'/sendService',query:{serviceId:guideInfo.id}}"><i class="icon iconfont icon-bianji7"></i>&nbsp;编辑服务</router-link>
					<div type="button" class="mui-btn mui-btn-success mui-col-xs-6 chat" @click="openService()"><i class="icon iconfont icon-kaiguan01"></i>&nbsp;{{flag?'关闭服务':'开启服务'}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import scenic from 'components/component/scenic.vue'
	import rest from 'assets/js/rest.js'
	export default {
		name: 'businessbackground',
		data() {
			return {
				pageTitle: '服务详情',
				guideInfo: [],
				serviceitems: [],
				details: [],
				imageHost: Lib.C.imageHost,
				query: null,
				address: '',
				items: [],
				flag: true,
				serviceScenics:null
			}
		},
		activated: function() {
			this.init();
		},
		methods: {
			init: function() {
				var self = this;
				if(this.serviceId) {
					var serviceId = this.$route.query.serviceId;
					new rest().get('service', serviceId).success(function(data) {
						self.guideInfo = data;
						self.serviceitems = data.service_item;
						self.serviceScenics = data.service_scenic;
						self.details = data.detail;
						if(data.status != '1') {
							self.flag = false;
						} else {
							self.flag = true;
						}
					}).run();
				} else {
					self.details = [];
					self.guideInfo = this.userInfo;
					self.serviceitems = this.serviceItem;
					self.details = this.serviceInfo.detail;
					this.getRegion(this.serviceInfo.service_region);
					this.items = this.serviceScenic;
				}
			},
			openService: function() {
				var self = this;
				if(this.flag) {
					new rest().get("serviceSwitch", "off").auth(true).success(function(data) {
						self.toast("服务已关闭");
						self.flag = false;
					}).error(function(er) {
						self.toast("服务关闭失败")
					}).run();
				} else {
					new rest().get("serviceSwitch", "on").auth(true).success(function(data) {
						self.toast("服务已开启")
						self.flag = true;
					}).error(function(er) {
						self.toast("服务开启失败")
					}).run();
				}

			},
			getRegion(opt) {
				var self = this;
				new rest().get("region", opt).success(function(data) {
					self.address = data.full_name;
				}).run();
			},
		},
		watch: {
			serviceInfo: function() {
				this.serviceInfo = this.$store.state.serviceInfo;
			},
			userInfo: function() {
				this.userInfo = this.$store.state.user.data;
			},
			serviceItem: function() {
				this.serviceItem = this.$store.state.serviceItem;
			},
			serviceId: function() {
				this.serviceId = this.$route.query.serviceId;
			},
			serviceScenic: function() {
				this.serviceScenic = this.$store.state.serviceScenics;
			}
		},
		computed: {
			serviceInfo: function() {
				return this.$store.state.serviceInfo;
			},
			userInfo: function() {
				return this.$store.state.user.data;
			},
			serviceItem: function() {
				return this.$store.state.serviceItem;
			},
			serviceId: function() {
				return this.$route.query.serviceId;
			},
			serviceScenic: function() {
				return this.$store.state.serviceScenics;
			},
			maxNum (){
			  if(this.serviceInfo){
          return this.serviceInfo.max_number_of_services
        }else{
          return ''
        }
			},
			price (){
			  if(this.serviceInfo){
			    return this.serviceInfo.price
			  }else{
			    return ''
			  }
			}
		},
		components:{
			scenic
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
	
	.mui-table-view-cell {
		height: auto;
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
	
	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 10;
	}
	
	.mui-btn-royal {
		height: 49px !important;
		line-height: 39px !important;
		background-color: #00bcd6 !important;
		border: none !important;
		border-radius: 0px !important;
	}
	
	.mui-btn-royal.mui-active,
	.mui-btn-royal:active {
		background-color: #008395;
		border: none;
	}
	
	.mui-btn-success {
		height: 49px !important;
		line-height: 40px !important;
		border: none !important;
		font-size: 16px !important;
		background-color: #f7f7f7 !important;
		color: #ff8518 !important;
		border-radius: 0px !important;
	}
	
	.mui-btn-success:active {
		color: #ff8518;
		background-color: #f7f7f7;
		border: 1px solid #f7f7f7;
	}
</style>