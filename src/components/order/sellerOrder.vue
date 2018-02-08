<template>
	<div class="box" v-if="order">
		<header-title :content="order.title"></header-title>
		<div class="mui-content">
			<ul class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell">
					<p class="title">{{order.status|show("orderStatus",order.status)}}</p>
					<p class="desc">{{order.status|getStatusDesciption}}</p>
				</li>
				<li class="mui-table-view-cell">
					订单总价 <span class="mui-pull-right price"><span>￥</span>{{order.total_price}}</span>
				</li>
			</ul>
			<ul class="mui-table-view mui-table-view-chevron" v-if="order.buyer">
				<li class="mui-table-view-cell buyer">
					<div class='mui-media-body mui-text-left' v-if='order.buyer'>
						<img :src="order.buyer.portrait?image(order.buyer.portrait,{width:40,height:40,type:'cut'}):'static/image/default-image/avatar.png'" alt="" /> {{order.buyer.username}}
						<i :class="['iconfont',order.buyer.sex=='1'?'icon_wom':'icon_man']">{{order.buyer.sex|show("sexview",order.buyer.sex)}}</i>
						<p class="buyer_desc">{{order.begin_date|setTime}}<span>-</span> {{order.end_date|setTime}}<span v-if="day">(<span  class="icon_man">{{day}}天</span>)</span>
						</p>
						<p class="person_num"><span>{{order.number_of_adults}}成人</span><span>{{order.number_of_children}}儿童</span></p>
					</div>
				</li>
				<li class="mui-table-view-cell mui-text-center dizhi">
					<span class="begin"></span> <span class="address">{{beginAddress}}</span>(出发地)<span class="region_end"></span><span class="end"></span><span class="address">{{endAddress}}</span>(目的地)
				</li>
				<li class="mui-table-view-cell">
					<p class="title">留言</p>
					<p class="desc">{{order.buyer_message}}</p>
				</li>
				<li class="mui-table-view-cell ly_phone">
					<div class="mui-pull-left mui-text-center ly mui-col-xs-6">
						<span class="iconfont"></span>在线交谈
					</div>
					<div class="mui-pull-right mui-col-xs-6 mui-text-center phone" @click="phone" >
						<span class="iconfont"></span>电话联系
					</div>
				</li>
			</ul>
			<ul class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell serviceType">
					服务:<span v-for="item in order.serviceType">{{item.name}}</span>
				</li>
			</ul>
			<div class="footer mui-text-center" v-if="order.status=='101'">
				<div class="change_price" @click="openVue('change')">
					<span class="iconfont"></span> 改价
				</div>
				<div class="cancel" @click="cancel()">取消订单</div>
				<div class="ok" @click="openVue('ok')">确认订单</div>
			</div>
		</div>
		<div class="box_shadow" v-if="flag">
			<div class="shadow_box" :class="{pt_25:shaDow=='ok'}">
				<img :src="order.buyer.portrait?image(order.buyer.portrait,{width:40,height:40,type:'cut'}):'static/image/default-image/avatar.png'" alt="" v-if="shaDow=='ok'" class="portrait" />
				<ul class="mui-table-view mui-table-view-chevron">
					<li class="mui-table-view-cell" v-if="shaDow=='change'">
						<label class="label_price">订单总价</label> <input type="text" v-model="price" class="input_price" />
					</li>
					<li class="mui-table-view-cell" v-if="shaDow=='ok'">
						<label class="label_price">买家有效付款时间</label>
						<div class="mui-numbox input_price" style="width: 150px;">
							<button class="mui-btn mui-btn-numbox-minus" type="button" @click="setExpires(false)">-</button>
							<input class="mui-input-numbox" type="text" disabled v-model="expires" />
							<button class="mui-btn mui-btn-numbox-plus" type="button" @click="setExpires(true)">+</button>
						</div>
					</li>
					<li class="mui-table-view-cell" v-if="shaDow=='ok'">
						<label class="label_price">锁定服务日期</label>
						<div :class="['mui-switch', locked?'mui-active':'','input_price']" @click="lockService">
							<div class="mui-switch-handle"></div>
						</div>
					</li>
				</ul>
				<div class="mui-btn mui-btn-block" :class="[shaDow=='change'?'change':'ok']" @click="submit(shaDow)">确定</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	export default {
		name: 'setOrder',
		data() {
			return {
				pageTitle: this.order ? this.order.title : '订单管理',
				order: null,
				beginAddress: '',
				endAddress: '',
				flag: false,
				shaDow: '',
				price: '',
				expires: '',
				locked: false,
				status:Lib.U.os.plus
			}
		},
		filters: {
			getStatusDesciption: function(opt) {
				var data = {
					"100": "待设置保险",
					"101": "等待商家确认订单",
					"102": "地导已确认,请在30分钟内支付订单,如未支付,订单将取消",
					"103": "已完成付款",
					"104": "订单已完成",
					"105": "评价完成",
					"201": "订单已取消",
					"202": "交易已关闭"
				}
				return data[opt];
			},
			setTime(opt) {
				opt = opt.replace("-", "年").replace("-", "月") + "日"
				return opt;
			}
		},
		activated: function() {
			this.init();
		},
		methods: {
			init() {
				var self = this;
				new rest().get("ordersListId", this.orderId).auth(true).parameter({
					expand: 'buyer,serviceType,orderInsurance.inceptionRegion,destinationRegion'
				}).success(function(data) {
					self.order = data;
					self.expires = (data.expires ? data.expires : 0) + '小时';
					self.getRegion("endAddress", data.service_region)
					self.getRegion("beginAddress", data.buyer.region_code);
				}).run()
			},
			getRegion(str, opt) {
				var self = this;
				new rest().get('regions').parameter({
					code: opt
				}).success(function(data) {
					self[str] = data[0].name
				}).run()
			},
			phone() {
				if(this.order.buyer.phone&&this.status) {
					plus.device.dial(this.order.buyer.phone, true);
				}else{
					this.toast('当前环境不支持拨打电话')
				}
			},
			openVue: function(opt) {
				this.flag = true;
				this.shaDow = opt;
			},
			setExpires: function(opt) {
				this.expires = parseInt(this.expires);
				if(opt) {
					this.expires++
				} else {
					if(this.expires == 0) {
						this.toast("有效时间不能小于0");
						this.expires += "小时";
						return;
					}
					this.expires--
				}
				this.expires += "小时";
			},
			submit: function(opt) {
				var self = this;
				var obj = {};
				if(opt == "change") {
					obj = {
						type: "order_change",
						total_price: this.price
					}
				} else if(opt == "ok") {
					obj = {
						type: "order_confirm",
						expires: Math.floor(new Date().getTime() / 1000) + parseInt(this.expires) * 60 * 60,
						lock_service_days: this.locked ? 1 : 0
					}
				}
				new rest().put("ordersListId", this.orderId).auth(true).data(obj).success(function(data) {
					self.toast("订单修改成功");
					self.back();
				}).error(function(er) {
					if(Array.isArray(er)) {
						self.toast(er[0].message);
					} else {
						self.toast(er.message)
					}
				}).run()
				this.flag = false;
			},
			cancel: function() {
				var self = this;
				new rest().put("ordersListId", this.orderId).auth(true).data({
					type: "order_reject"
				}).success(function(data) {
					self.toast("订单已取消");
		
				}).error(function(er) {
					if(Array.isArray(er)) {
						self.toast(er[0].message);
					} else {
						self.toast(er.message)
					}
				}).run()
			},
			lockService: function() {
				if(this.locked) {
					this.locked = false;
				} else {
					this.locked = true;
				}
			}
		},
		computed: {
			orderId: function() {
				return this.$route.query.orderId;
			},
			day: function() {
				if(this.order) {
					var end = new Date(this.order.end_date).getTime();
					var begin = new Date(this.order.begin_date).getTime();
					var time = (end - begin) / 86400000;
					return Math.floor(time);
				}
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.box {
		margin-bottom: 40px;
	}
	
	.mui-table-view {
		margin-bottom: 10px;
	}
	
	.mui-table-view-cell {
		height: auto;
		color: #666;
	}
	.mui-table-view-cell.dizhi{font-size:12px;color:#999;}
	.mui-table-view-cell.mui-active {
		background: #fff;
	}
	
	.price {
		color: #FF8500;
		font-size: 18px;
	}
	
	.price span {
		font-size: 10px;
		line-height: 2em;
	}
	
	.mui-table-view-chevron .mui-table-view-cell {
		padding-right: 10px;
		border-bottom: 1px solid #eee;
	}
	
	.mui-table-view:after {
		background: #eee;
	}
	
	.mui-table-view-cell:after {
		display: none;
	}
	
	.mui-content>.mui-table-view:first-child {
		margin-top: 0;
	}
	
	.title {
		font-size: 16px;
		color: #333;
	}
	
	.desc {
		color: #FF8500;
		font-size: 12px;
	}
	
	.mui-table-view-cell p {
		line-height: 2em;
	}
	
	.mui-table-view .mui-media-body img {
		width: 30px;
		height: 30px;
		border-radius: 50%;
		vertical-align: middle;
	}
	
	.icon_wom {
		color: #F999AE;
	}
	
	.icon_man {
		color: #63D4E5;
	}
	.address{white-space: nowrap;display:inline-block;width:3em;overflow:hidden;text-overflow: ellipsis;line-height:1em;color:#333;font-size:14px;}
	.begin,
	.end {
		display: inline-block;
		width: 1.5em;
		height: 1.5em;
		border-radius: 50%;
		margin: -.4em .4em
	}
	
	.begin {
		border: 1px solid #0CBED7
	}
	
	.end {
		border: 1px solid #FF8500
	}
	
	.buyer p {
		color: #333;
	}
	
	.buyer_desc {
		font-size: 14px;
	}
	
	.person_num {
		font-size: 12px;
	}
	
	.region_end {
		display: inline-block;
		width: 2em;
		height: 2px;
		background: #666;
		margin: .3em .5em
	}
	
	.ly_phone {
		padding: 0 15px;
	}
	
	.ly_phone .iconfont {
		color: #0CBED7;
		font-size: 24px;
		margin-right: 10px;
	}
	
	.phone,
	.ly {
		padding: .5em 0;
		line-height: 2em;
		font-size: 14px
	}
	
	.phone:focus,
	.ly:focus {
		background: #f8f8f8;
	}
	
	.phone {
		border-left: 1px solid #eee;
		box-sizing: border-box;
	}
	
	.serviceType {
		font-size: 14px;
		line-height: 2em;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	
	.serviceType span {
		margin-left: 1em;
		color: #333;
	}
	
	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		line-height: 3em;
		background: #FDFDFD;
		color: #fff;
		display: box;
		display: -webkit-box;
	}
	
	.footer .change_price {
		color: #666;
		-webkit-box-flex: 1;
	}
	
	.footer .cancel {
		background: #FF8500;
		-webkit-box-flex: 5;
	}
	
	.footer .ok {
		background: #01BCD6;
		-webkit-box-flex: 5
	}
	
	.box_shadow {
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(100, 100, 100, .3);
		top: 0;
		z-index: 11;
	}
	
	.shadow_box {
		position: absolute;
		bottom: 0;
		width: 100%;
		background: #f8f8f8;
	}
	
	.pt_25 {
		padding-top: 25px;
		background: #fff;
	}
	
	.shadow_box .mui-btn-block {
		margin-bottom: 0;
		color: #fff;
		border: none;
	}
	
	.change {
		background: #FF8500;
	}
	
	.shadow_box .ok {
		background: #01BCD6
	}
	
	.shadow_box .mui-table-view-cell {
		width: 100%;
		display: -webkit-box;
	}
	
	.shadow_box .mui-table-view-cell .label_price {
		-webkit-box-flex: 1;
		display: block
	}
	
	.shadow_box .mui-table-view-cell input.input_price {
		text-align: right;
		padding: 0;
		height: auto;
	}
	
	.shadow_box .portrait {
		position: absolute;
		width: 50px;
		height: 50px;
		top: -25px;
		border-radius: 50%;
		left: 10px;
		z-index: 2
	}
</style>