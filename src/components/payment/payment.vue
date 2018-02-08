<template>
	<div class="box">
		<header-title content="支付订单"></header-title>
		<div class="mui-content" v-if="orderInfo">
			<div class="price">
				<span class="price_title">订单总价</span><span class="price_total">{{orderInfo.total_price}}</span>
			</div>
			<ul id="list" class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell" @click="check(true)">
					<span class="iconfont gre"></span>
					<div class="con">
						<p class="ban_title">微信支付</p>
						<p class="ban_tip">推荐安装微信及以上版本的用户使用</p>
					</div>
					<span class="iconfont re" v-if="flag"></span>
					<span class="iconfont grey" v-else></span>
				</li>
				<li class="mui-table-view-cell" @click="check(false)">
					<span class="iconfont bl"></span>
					<div class="con">
						<p class="ban_title">支付宝支付</p>
						<p class="ban_tip">推荐安装微信及以上版本的用户使用</p>
					</div>
					<span class="iconfont re" v-if="!flag"></span>
					<span class="iconfont grey" v-else></span>
				</li>

			</ul>
			<div class="mui-content-padded">
				<div class="mui-btn mui-btn-block submit" @click="submit">￥{{orderInfo.total_price}}&nbsp;确认支付</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from "assets/js/rest.js"
	export default {
		name: 'hello',
		data() {
			return {
				pageTitle: '支付提示',
				flag: true
			}
		},
		methods: {
			check(opt) {
				this.flag = opt;
			},
			submit() {
				var self = this;
				if(this.flag) {
					var str = "wxpay";
				} else {
					var str = "alipay"
				}
				if(plus.payment) {
					plus.payment.getChannels(function(data) {
						data = data.filter(function(item) {
							if(item.id == str) {
								return item;
							}
						})
						self.checkServices(data[0]);
						self.getInfo(data[0]);
					}, function(er) {
						self.toast("获取支付通道失败：" + e.message);
					})
				}else if(str=='alipay'){
					window.location.href = 'https://d.alipay.com/i/index2.htm';
				}
			},
			checkServices(pc) {
				if(!pc.serviceReady) {
					var txt = null;
					switch(pc.id) {
						case "alipay":
							txt = "检测到系统未安装“支付宝快捷支付服务”，无法完成支付操作，是否立即安装？";
							break;
						default:
							txt = "系统未安装“" + pc.description + "”服务，无法完成支付，是否立即安装？";
							break;
					}
					plus.nativeUI.confirm(txt, function(e) {
						if(e.index == 0) {
							pc.installService();
						}
					}, pc.description);
				}
			},
			getInfo(opt) {
				var self = this;
				new rest().get("ordersPay", self.orderInfo.order_id).auth(true).success(function(data) {
					self.pay(data, opt);
				}).error(function(er) {
					self.toast(er.message);
				}).run();
			},
			pay(opt, obj) {
				var self = this;
				plus.payment.request(obj, opt, function(result) {
					self.$router.replace({
						path: "/payResults",
						query: {
							results: "true"
						}
					});
				}, function(e) {
					self.$router.replace({
						path: "/payResults",
						query: {
							results: "false"
						}
					});
				});
			}
		},
		computed: {
			orderInfo: function() {
				return this.$route.query.orderInfo;
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.price {
		padding: 10px;
		background: #fff;
		border-bottom: 1px solid #dfdfdf;
		margin-bottom: 10px;
		line-height: 2em;
		overflow:hidden;
	}
	.price:after{
	  content:'';
	  clear:both;
	}
	.price .price_title {
		float:left
	}
	
	.price .price_total {
	  float:right;
		text-align: right;
		font-size: 20px;
	}
	
	.mui-table-view-cell:after {
		display: none;
	}
	
	.mui-table-view-chevron .mui-table-view-cell {
		padding-right: 10px;
	}
	
	.mui-table-view-cell {
		border-bottom: 1px solid #dfdfdf;
		height: auto;
	}
	
	.mui-table-view-cell .iconfont {
		line-height: 2em;
		font-size: 20px;
		float:left;
		text-align: center;
	}
	
	.mui-table-view-cell .iconfont.gre {
		color: #00B676;
	}
	
	.mui-table-view-cell .iconfont.grey {
	  float:right;
		color: #DBDBDB;
	}
	
	.mui-table-view-cell .iconfont.bl {
		color: #017EBB;
	}
	
	.mui-table-view-cell .iconfont.re {
	  float:right;
		color: #24AFB7;
	}
	
	.mui-table-view-cell .con {
		float:left;
	}
	
	.mui-table-view-cell .con .ban_title {
		font-size: 20px;
		line-height: 1em;
		color: #333;
	}
	
	.mui-table-view-cell .con .ban_tip {
		line-height: 2em;
		font-size: 12px;
	}
	
	.submit {
		border: none;
		background: #FEA634;
		color: #fff;
	}
</style>