<template>
	<div class="box">

		<header-title content="我的订单"></header-title>
		<div class="mui-content">
			<no-data v-if="flag" content="没有订单"></no-data>
			<ul class="mui-table-view mui-grid-view mui-grid-9" v-if="!flag">
				<router-link :to="{path:'/set_order',query:{orderId:item.order_id}}" tag="li" class='mui-table-view-cell mui-media mui-col-xs-12 mui-col-sm-12 margin-t-10' v-for="item in orderList">
					<p class="title"><span class='mui-pull-left'>{{item.title}}</span><span class="mui-pull-right status">{{item.status|show("orderStatus",item.status)}}</span></p>
					<div class='mui-media-body mui-text-left' v-if='item.buyer'>
						<img :src="item.buyer.portrait?image(item.buyer.portrait,{width:40,height:40,type:'cut'}):'static/image/default-image/avatar.png'" alt="" /> {{item.buyer.username}}
						<i :class="['iconfont',item.buyer.sex=='1'?'icon_wom':'icon_man']">{{item.buyer.sex|show("sexview",item.buyer.sex)}}</i>
						<p>{{item.begin_date}}到{{item.end_date}} <span v-if="item.time">(<span  class="icon_man">{{item.time}}天</span>)</span>
						</p>
						<p class="service"><span v-for="r in item.serviceType" class="service_item">{{r.name}}</span></p>
						<p><span class="mui-pull-left">共{{item.number_of_adults+item.number_of_children}}</span>
							<span class="mui-pull-right price">￥{{item.total_price}}</span>
						</p>
					</div>
					<p class="order" v-if="item.status=='101'">
						<span class="mui-btn mui-pull-right btn" v-if="item.refund_status=='1'">处理退款</span>
						<span class="mui-btn mui-pull-right btn">处理订单</span>
					</p>
				</router-link>
				<infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
				  <p slot ='no-results' class="dn"></p>
				  <p slot ='no-more'>加载完毕</p>
				</infinite-loading>
			</ul>

		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import InfiniteLoading from 'vue-infinite-loading';
	import noData from 'components/component/noData.vue'
	import rest from 'assets/js/rest.js'
	export default {
		name: 'orderManage',
		data() {
			return {
				pageTitle: '订单管理',
				orderList: [],
				flag: false
			}
		},
		activated: function() {
			this.init();
		},
		methods: {
			init: function() {
				this.flag = false;
				this.orderList = [];
				this.rest = null;
				if(this.$refs.infiniteLoading){
				  this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
				}
			},
			onInfinite: function() {
				if(!this.rest) {
					var self = this;
					this.rest = new rest();
					this.rest.get("ordersList").auth(true).parameter({
						type: 'seller',
						sort: '-created_at',
						expand: 'buyer,serviceType'
					}).success(function(data) {
						if(data.length == 0) {
							self.flag = true;
						}
						self.setTime(data);
						if(data.length < 20) {
							self.orderList = self.orderList.concat(data);
							self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
						} else {
							self.orderList = self.orderList.concat(data);
							self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
						}
					}).run();
				} else {
					this.rest.getNextPage(self)
				}
			},
			setTime: function(opt) {
				var i = 0;
				var len = opt.length;
				for(; i < len; i++) {
					var beginTime = new Date(opt[i].begin_date.replace(/-/g, '/')).getTime();
					var endTime = new Date(opt[i].end_date.replace(/-/g, '/')).getTime();
					opt[i].time = Math.floor(endTime - beginTime) / 1000 / 86400;
				}
			}
		},
		components: {
			InfiniteLoading,
			noData
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-table-view-cell,
	.mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-body {
		height: auto;
	}
	
	.mui-grid-view.mui-grid-9:after {
		display: none;
	}
	
	.mui-grid-view.mui-grid-9 .mui-table-view-cell {
		padding: 5px 0;
	}
	
	.mui-grid-view.mui-grid-9 {
		border: none;
	}
	
	.title {
		border-bottom: 1px solid #eee;
		line-height: 2em;
	}
	
	.title,
	.mui-media-body {
		padding: 0 10px;
		overflow: hidden;
	}
	
	.mui-grid-view.mui-grid-9 .mui-table-view-cell.margin-t-10 {
		margin-top: 10px;
		background: #fff;
	}
	
	.mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-body img {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		vertical-align: middle;
	}
	
	.icon_wom {
		color: #F999AE;
	}
	
	.icon_man {
		color: #63D4E5;
	}
	
	.service {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.service_item {
		margin-right: 1em;
	}
	
	.mui-media-body p {
		line-height: 2em;
	}
	
	.price {
		font-size: 18px;
		color: #FF8500;
	}
	
	.order {
		padding: 5px 10px;
		border-top: 1px solid #eee;
	}
	
	.btn {
		height: 24px;
    width: 70px;
    margin-left: 4px;
    border-radius: 2px;
    font-size: 13px;
    line-height: 19px;
    padding: 0px;
    padding-top: 2px;
		color: #FF8500;
		border: 1px solid #FF8500
	}
	
    border-color: #333;
	
	.status {
		color: #02BDD6;
	}
	
	.con {
		text-align: center;
	}
	
	.con img {
		width: 150px;
		height: 150px;
		margin-top: 150px;
	}
	
	.con p {
		margin-top: 2em;
	}
</style>