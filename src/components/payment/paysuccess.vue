<template>
	<div class="box">
		<header-title content="订单信息"></header-title>
		<div class="mui-content">
			<div class="information-content">
				<div class="information-div">
	                <img src="static/image/ico_cg.png">
	            </div>
	            <div class="font-size">               
	            	提交成功
	            </div>
	            <div class="color-eee"> 
	            	请耐心等待商家确认，在商家确认订单后，你才可以进行支付
	            </div>
	            <div class="order-list" @click='orderList'>查看订单</div>
	            <div class="back-index" @click='goHome'>返回首页</div>
			</div>
		</div>
	</div>
</template>
<script>
	import Lib from 'assets/js/Lib.js'
	export default {
		name: 'paySuccess',
		data() {
			return {
				pageTitle: '订单信息',
			}
		},
		activated: function() {
		},
		methods: {
			orderList:function(){
				this.$router.push({
					path: "/myOrder",
				});
			},
			goHome:function(){
				this.$router.push({
					path: "/",
				});
			}
		},
		mixins: [Lib.P]
	}
</script>
<style scoped>
	.information-content{
     	padding: 10px;
     	font-size: 15px;
     	width: 100%;
	    text-align: center;
	    position: absolute;
	    top: 50%;
	    margin-top: -159px;
    }
    .color-eee{
    	color: #d7d7d7;
    	margin-top: 5px;
    }
    .order-list{
    	width: 100%;
    	text-align: center;
    	background-color:#00BCD6;
    	color: #fff;
    	line-height: 50px;
    	margin-top: 10%;
    	border-radius: 2px;
    }
    .back-index{
    	width: 100%;
    	text-align: center;
    	background-color:#d7d7d7;
    	border-radius: 2px;
    	color: #fff;
    	line-height: 50px;
    	margin-top: 20px;
    }
    .information-div img{
    	width: 60px;
    	height: 60px;

    }
    .font-size{
    	font-size: 17px;
    	margin-top: 22px;
    	color: #333333;
    }
    .not-agree .agree{
    	color: #fff;
    }
</style>
