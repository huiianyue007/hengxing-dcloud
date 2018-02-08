<template>
	<div class="box">
		<header-title content="我的订单"></header-title>
		<div class="mui-content">
			<div class="body-box" v-if="block">
				<li class="aui-col-xs-12 didao-item border-b border-t" v-for="(order,index) in orders">
					<router-link :to="{path:'/buyerOrderXq',query:{orderId:order.order_id}}">
						<div class="didao-ziliao DidaoXq border-b" tapmode>
							<img :src="order.service.user.portrait==null?'static/image/default-image/avatar.png':image(order.service.user.portrait,{width:90,height:90,type:'cut'})" class="didao-pic">
							<span class="didao-name">{{order.service.user.username}}</span>
							<span class="didao-sex" v-html=""><i class="icon iconfont sex-icon" :class="[order.service.user.sex==0?'didao-malesex':'didao-femalesex']">{{order.service.user.sex |show('sexview',order.service.user.sex)}}</i></span>
							<span class="didao-pingfen">{{order.status |show("orderStatus",order.status)}}</span>
						</div>
						<div class="didao-fuwu DidaoXq border-b" tapmode>
							<div class="didaofuwutitle">
								<span class="fuwutitle">{{order.title}}</span>
								<span class="fuwuprice mui-pull-right">￥{{order.total_price}}</span>
							</div>
							<div class="didao-fuwuriqi">
								<span class="start-time">{{order.begin_date}}&nbsp;至&nbsp;{{order.end_date}}</span>
								<span class="fuwutime">({{order.total_price/order.price}}天)</span>
							</div>
							<div class="didao-fuwujingdian">
								<i class="icon iconfont scenic-icon">&#xe632;</i>
								<span class="fuwu-secnic" v-for="secnic in order.service.scenic">
		                    		{{secnic.info.name}}&nbsp;
					            </span>
							</div>
						</div>
					</router-link>
					<div class="cancel-btn">
						<div class="mui-pull-right bottom-btn">
							<a :class="[order.status==100||order.status==101||order.status==102?'show':'hide']" @click="cancelOrder(order,index)"><button class="mui-btn btnone quxiao">取消订单</button></a>
							<a :class="[order.status==201||orders.status==202?'show':'hide']"><button class="mui-btn btnone guanbi btnbtn">交易关闭</button></a>
							<a :class="[order.status==105?'show':'hide']"><button class="mui-btn btnone wancheng btnbtn">交易完成</button></a>
							<router-link :class="[order.status==102?'show':'hide']" tag="a" :to="{path:'/payment',query:{orderInfo:order}}"><button class="mui-btn btnone fukuan">立即付款</button></router-link>
							<router-link :to="{path:'/evaluate',query:{orderId:order.order_id}}" :class="[order.status==104?'show':'hide']"><button class="mui-btn btnone pingjia">我来评价</button></router-link>
							<a :class="[order.status==103?'show':'hide']" @click="confirm(order,index)"><button class="mui-btn btnone guanbi">确认收货</button></a>
							<router-link :class="[order.status==100?'show':'hide']" tag="a" :to="{path:'/setInsurance',query:{orderId:order.order_id,}}"><button class="mui-btn btnone baoxian">设置保险</button></router-link>
						</div>
					</div>
				</li>
				<infinite-loading ref="infiniteLoading" :on-infinite="onInfinite">
				  <p slot ='no-results' class="dn"></p>
				  <p slot ='no-more'>加载完毕</p>
				</infinite-loading>
			</div>
			<noData content="暂时还没有订单哦！" v-if="!block"></noData>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	import _ from 'underscore'
	import noData from 'components/component/noData.vue'
	import InfiniteLoading from 'vue-infinite-loading'
	export default {
		data() {
				return {
					pageTitle: '我的订单',
					orders: [],
					block: true,
				}
			},
			activated: function() {
				this.init()
			},
			methods: {
				init: function() {
					this.block = true;
					this.orders = [];
					this.rest = null;
					this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')

				},
				onInfinite() {
					var self = this;
					if(this.rest) {
						this.rest.getNextPage(self);
					} else {
						this.rest = new rest();
						this.rest.get('ordersList').parameter({
							type: 'buyer',
							sort: '-created_at',
							expand: 'service.user,service.item.serviceType,service.scenic.info,orderInsurance',
						}).auth(true).success(function(data) {
							if(data.length == 0) {
								self.block = false;
							}
							if(data.length >= 20) {
								self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
							} else {
								self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
							}
						
							self.orders = self.orders.concat(data);

						}).run();
					}
				},
				cancelOrder: function(opt, i) {
					var self = this;
					new rest().put('ordersListId', opt.order_id).auth(true).data({
						type: "order_cancel",
					}).success(function(data) {
						self.toast("订单已取消");
						opt.status = data.status;
						self.$set(self.orders, i, opt)
					}).error(function(er) {
						if(Array.isArray(er)) {
							er.forEach(function(item) {
								self.toast(item.message);
							})
						} else {
							self.toast(er.message);
						}
					}).run();
				},
				confirm(opt,i) {
					var self = this;
					new rest().put('ordersListId', opt.order_id).auth(true).data({
						type: "order_confirm_payed"
					}).success(function(data) {
						self.toast("确认收货成功");
						opt.status = data.status;
						self.$set(self.orders, i, opt)
					}).run();
				}
			},
			components: {
				noData,
				InfiniteLoading
			},
			mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.fuwutitle {
		font-size: 17px;
		color: #333;
		width: 75%;
		display: inline-block;
		text-overflow: ellipsis !important;
		overflow: hidden;
		white-space: nowrap;
	}
	
	.fuwuprice {
		font-size: 17px;
		color: #333;
		font-weight: 600;
	}
	
	.didao-fuwuriqi {
		font-size: 12px;
		color: #333;
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
	/*按钮*/
	.dn{display:none;}
	.cancel-btn {
		padding: 0 10px;
		height: 39px;
	}
	
	.mui-btn {
		height: 24px;
		width: 70px;
		margin-top: 7px;
		margin-left: 4px;
		color: #333;
		border-radius: 2px;
		font-size: 13px;
		line-height: 9px;
		padding: 0px;
		border-color: #333;
	}
	
	.mui-btn.active,
	.mui-btn:active {
		color: #999;
		background-color: #fff;
		border: 1px solid #333;
	}
	
	.btnbtn {
		color: #999;
		background-color: #fff;
		border-color: #d7d7d7;
	}
	
	.hide {
		display: none;
	}
	
	.show {
		display: inline-block;
	}
</style>