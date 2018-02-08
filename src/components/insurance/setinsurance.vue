<template>
	<div class="box">
		<header-title content="保险提示"></header-title>
		<div class="mui-content">
			<div class="baoxian-time border-b">
                <div class="time-title">
                    <span class="time-title-start">开始</span>
                    <span class="time-title-con">有效期</span>
                    <span class="time-title-end">截止</span>
                </div>
                <div class="time-con">
                    <span class="time-con-start">{{starttime}}</span>
                    <span class="time-con-con">——</span>
                    <span class="time-con-end">{{endtime}}</span>
                </div>
            </div>
            <div class="baoxian-place border-b">
                <div class="place-con">
                    <span class="qishidi-con"><i class="icon iconfont icon-quan qishidi-icon"></i>{{startpalce}}</span>
                    <span class="qishidi-title">(出发地)</span>
                    <span class="place-jie">——</span>
                    <span class="mudidi-con"><i class="icon iconfont icon-quan mudidi-icon"></i>{{endpalce}}</span>
                    <span class="mudidi-title">(目的地)</span>
                    <span class="mui-pull-right"><i class="icon iconfont icon-enter icon-size"></i></span>
                    <div class="clear"></div>
                </div>
            </div>
            <div class="baoxian-insure">
	            <div class="insure-title border-b">
	                <span class="insure-ti">投保人</span>
	                <span class="insure-jie">(最多{{totalPeople}}人)</span>
	                <span class="mui-pull-right add-insureren" @click='openvue(totalPeople,query.orderId)'><i class="icon iconfont icon-title-add add-icon-style"></i></span>
	            </div>
	            <div class="insure-con">
	            	<li class="insure-item border-b" v-for="insurance in insurances">
	                    <span  class="delete-icon mui-pull-left" @click="delInsurance(insurance.order_id,insurance.insuranceBeneficiary.id)">
	                    	<i class="icon iconfont icon-shanchu delete-icon-style"></i>
	                    </span>
	                    <div class="insure-item-con">
	                        <div class="insure-name">
                            	{{insurance.insuranceBeneficiary.real_name}}
	                        </div>
	                        <div class="insure-shenfen">
	                            <span class="card-type">身份证</span>
                                <span class="card-number">{{insurance.insuranceBeneficiary.id_card_number|idCard}}</span>
	                        </div>
	                    </div>
	                </li>
	            </div>
	        </div>
	        <div class="height" style="height:60px;width:100%;"></div>
	        <div class="footer">
	        	<div class="mui-btn mui-btn-primary mui-col-xs-12" @click='submitOder'>确定</div>
	        </div>
		</div>
	</div>
</template>
<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	import _ from 'underscore'
	export default {
		name: 'paySuccess',
		data() {
			return {
				pageTitle: '保险提示',
				startpalce:'',
				endpalce:'',
				starttime:'',
				endtime:'',
				totalPeople:'',
				insurances:[],
				query:null,
			}
		},
		filters:{
      idCard:function(data){
        data = '*****  *****  ****  '+data.substring(data.length-4);
        
        return data
      }
    },
		activated: function() {
			this.init();
			this.InsurancesList();
		},
		computed: {
			city: function() {
				return this.$store.getters.city;
			}
		},
		methods: {
			init:function(){
				this.startpalce = this.city.name;
				if(!_.isEqual(this.$route.query,this.query)){
					this.query = this.$route.query;
					this.endpalce = '';
					this.starttime = '';
					this.endtime = '';
					this.totalPeople = '';
					this.insurancename = '',
					this.insurances = [],
					this.orderInfo(this.query.orderId);
				}
			},
			orderInfo:function(orderId){
				var self = this;
				new rest().get('ordersListId',orderId).auth(true).success(function(data){
        			self.starttime = userDate(Date.parse(new Date(data.begin_date)) / 1000);
        			self.endtime = userDate(Date.parse(new Date(data.end_date)) / 1000);
        			self.endPalce(data.service_region);
        			self.totalPeople = data.number_of_adults+data.number_of_children;
        			function userDate(uData){
		                var myDate = new Date(uData*1000);
		                var month = myDate.getMonth() + 1;
		                var day = myDate.getDate();
		                return month + '月' + day +'日';
		            }
        		}).run();
			},
			endPalce:function(serviceRegion){
				var self = this;
				new rest().get('region',serviceRegion).parameter({
                    code:serviceRegion,
                }).success(function(data){
                    self.endpalce = data.name; 
                }).run();
			},
			InsurancesList:function(){
				this.query = this.$route.query;
				var self = this;
				new rest().get('orderToInsurances').parameter({
                    order_id:this.query.orderId,
                    expand:'insuranceBeneficiary',
                }).auth(true).success(function(data){
                	self.insurances = data;
                }).run();
			},
			delInsurance:function(orderId,id,index){
				var self = this;
				new rest().delete('orderToInsurances').parameter({
                    order_id:orderId,
                    insurance_beneficiary_id:id,
                }).auth(true).success(function(data){
                	self.insurances.splice(index, 1)
                    self.toast("成功取消");
                }).run();
			},
			openvue:function(totalPeople,orderId){
				this.$router.push({
					path: "/addApplicant",
					query: {
						orderId: orderId,
						totalPeople: totalPeople,
					}
				});
			},
			submitOder:function(){
				var self = this;
				var orderId = this.$route.query.orderId
				new rest().put('ordersListId',orderId).data({
                    type:'set_insurance',
                }).auth(true).success(function(data){
                   self.$router.push({
						path: "/paySuccess",
					});
                }).run();
			}
		},
		components: {
		},
		mixins: [Lib.P]
	}
</script>
<style scoped>
	/*保险时效*/
	.baoxian-time{
		background-color: #fff;
		margin-top: 10px;
		padding: 10px 0 ;
	}
	.time-title{
		text-align: center;
	}
	.time-title-start{
		font-size: 10px;
		color: #999;
		padding-right: 40px;
	}
	.time-title-end{
		font-size: 10px;
		color: #999;
		padding-left: 40px;
	}
	.time-con{
		text-align: center;
	}
	.time-title-con{
		font-size: 14px;
		color: #333;
	}
	.time-con-start{
		font-size: 17px;
		color: #333;
		padding-right: 30px;
	}
	.time-con-end{
		font-size: 17px;
		color: #333;
		padding-left: 30px;
	}
	/*出行地点*/
	.place-con{
		text-align: center;
	}
	.baoxian-place{
		background-color: #fff;
		margin-top: 10px;
		padding: 12px 10px;
	}
	.qishidi-icon{
		color: #24c6ff;
		font-size: 11px;
		padding-right: 5px;
	}
	.qishidi-con{
		font-size: 15px;
		color: #333;
		padding: 0 5px;
	}
	.qishidi-title{
		font-size: 14px;
		color: #999;
	}
	.place-jie{
		padding: 0 5px;
	}
	.place-icon-style{
		font-size: 23px;
	}
	.mudidi-icon{
		font-size: 11px;
		padding-right: 5px;
		color: #ff0000;
	}
	.mudidi-con{
		font-size: 15px;
		color: #333;
		padding: 0 5px;
	}
	.mudidi-title{
		font-size: 14px;
		color: #999;
	}
	.icon-size{
		color: #999;
		font-size: 14px;
	}
	/*投保人*/
	.baoxian-insure{
		background-color: #fff;
		margin-top: 10px;
	}
	.insure-title{
		padding: 10px;
	}
	.insure-ti{
		font-size: 15px;
		color: #333;
		padding-right: 5px;
	}
	.insure-jie{
		font-size: 14px;
		color: #999;
	}
	.add-icon-style{
		font-size: 26px;
		color: #01bcd6;
	}
	.add-insureren{
		margin-top: 2px;
	}
	.insure-item{
		padding: 10px;
	}
	.delete-icon{
		padding-right: 10px;
		margin-top: 6px;
	}
	.delete-icon-style{
		font-size: 22px;
		color: #ff0000;
	}
	.insure-name{
		font-size: 15px;
		color: #333;
	}
	.insure-shenfen{
		font-size: 12px;
		margin-top: 2px;
		color: #333;
	}
	.footer{
		position:fixed; 
		bottom: 0; 
		width: 100%;
		z-index: 10;
	}
	.mui-btn-primary{
		line-height: 33px;
		font-size: 15px;
		color: #FFFFFF !important;
		height: 44px !important;
	}
</style>
