<template>
	<div class="box">
		<header-title content="订单详情"></header-title>
		<div class="mui-content" v-if = "orderInfo">
			<div class="order-status border-b">
                <div class="order-status-title">{{orderInfo.status |show('orderStatus',orderInfo.status)}}</div>
                <div class="order-status-con">{{orderInfo.status | orderStatus}}</div>
            </div>
            <div class="order-price border-b">
                <span class="order-price-title mui-pull-left">订单总价</span>
                <span class="order-price-con mui-pull-right">
                    <span class="price-icon">￥</span>
                    <span class="price">{{orderInfo.total_price}}</span>
                </span>
                <div class="clear"></div>
            </div>
            <div class="serviceUser-info border-b">
				<div class="serviceUser-portrait mui-pull-left">
					<img :src="orderInfo.service.user.portrait==null?'static/image/default-image/avatar.png':image(orderInfo.service.user.portrait,{width:165,height:165,type:'cut'})" class="portrait-size">

				</div>
				<div class="serviceUser-word">
					<div class="serviceUser-namesex">
						<span class="serviceUser-name">{{orderInfo.service.user.username}}</span>
						<span class="serviceUser-sex"><i class="icon iconfont sex-icon" :class="[orderInfo.service.user.sex==0?'didao-malesex':'didao-femalesex']">{{orderInfo.service.user.sex |show('sexview',orderInfo.service.user.sex)}}</i></span>
					</div>
					<div class="service-title">{{orderInfo.title}}</div>
					<div class="service-palce"><i class="icon iconfont place-icon">&#xe62c;</i>{{orderInfo.service.region.full_name}}</div>
				</div>
			</div>
			<div class="service-time border-b">
                <span class="service-time-title">服务时间：</span>
                <span class="service-time-con">{{orderInfo.begin_date}}&nbsp;至&nbsp;{{orderInfo.end_date}}</span>
            </div>
            <div class="service-item border-b">
                <span color="#999">服&emsp;&emsp;务：
                	<span v-for ="serviceItem in orderInfo.service.item">
                		{{serviceItem.serviceType.name}}
                	</span>
                </span>
            </div>
		</div>
	</div>
</template>
<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	import _ from 'underscore'
	export default {
	    data() {
	      return {
	        pageTitle:'订单详情',
	        orderInfo:null,
	        query:null,
	      }
	    },
	    filters: {
	        orderStatus:function(statu){
	        	var data = {
	        		100:'未设置保险，请设置',
	        		101:'等待商家确认订单',
	        		102:'商家已经确认，请在30分钟内支付订单，如未支付订单将取消',
	        		103:'您已经支付了订单',
	        		104:'服务已完成，可对本次服务进行评价',
	        		105:'已对本次服务做出了评价',
	        		201:'该订单已被您取消',
	        		202:'商家取消订单，如有疑问可进行在线询问',
	        	}
	        	return data[statu];
	        }
  		},
	    activated: function() {
	        	this.init()
	    },
	    methods:{
	    	init:function(){
	    		var self = this;
	    		if(!_.isEqual(this.$route.query,this.query)){
		            this.query = this.$route.query;
		            this.orderInfo = null;
		           	new rest().get('ordersListId',this.$route.query.orderId).parameter({
                		expand:'service.user,service.region,service.item.serviceType',
            		}).auth(true).success(function(data){
            			self.orderInfo = data;
            		}).run();
		       }
	    		
	    	},
	    	
	    },
	    mixins:[Lib.P]
  	}
</script>
<style scoped>
	.order-status{
		background-color: #fff;
		padding: 10px;
	}
	.order-status-title{
		font-size: 17px;
		color: #333;
	}
	.order-status-con{
		font-size: 12px;
		color: #ff8518;
		margin-top: 4px;
	}
	.order-price{
		padding: 10px;
		background-color: #fff;
	}
	.clear{
		clear: both;
	}
	.order-price-title{
		color: #999;
		font-size: 15px;
	}
	.order-price-con{
		font-size: 20px;
		color: #ff8518;
	}
	.price-icon{
		display: inline-block;
		font-size: 14px;
	}
	.price{
		display: inline-block;
		margin-left: -5px;
	}
	/*服务信息*/
	.serviceUser-info{
		height: 92px;
		padding: 0 10px;
		background-color: #fff;
		margin-top: 10px;
	}
	.serviceUser-portrait{
		line-height: 92px;
	}
	.portrait-size{
		width: 53px;
		height: 53px;
		border:1px #d7d7d7 solid;
		border-radius: 50%;
		vertical-align: middle;
	}
	.serviceUser-word{
		float: left;
		margin: 12px 0;
		margin-left: 10px;
	}
	.serviceUser-name{
		color: #333;
		font-size: 15px;
	}
	.service-title{
		font-size: 12px;
		color: #333;
		margin-top: 4px;
	}
	.service-palce{
		font-size: 12px;
		color: #999;
		margin-top: 4px;
	}
	/*服务时间*/
	.service-time{
		padding: 10px;
		font-size: 15px;
		color: #333;
		background-color: #fff;
	}
	.service-time-title{
		color: #999;
	}
	/*服务类型*/
	.service-item{
		padding: 10px;
		font-size: 15px;
		color: #333;
		background-color: #fff;
	}
</style>