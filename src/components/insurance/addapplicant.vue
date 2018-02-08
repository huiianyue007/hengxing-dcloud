<template>
	<div class="box">
		<header-title content="投保人"></header-title>
		<div class="mui-content">
			<div class="tianjia-button">
				<button class="mui-btn mui-col-xs-12" @click='applicantInfo'>添加投保人</button>
			</div>
			<div class="applicationList">
				<li class="content-item aui-col-xs-12 li-loop border-b" v-for="(applicantInfo,key) in applicantInfos">
					<div class="mui-pull-left radio-btn" @click="radio(applicantInfo,key)">
						<span class="radio" :class="[applicantInfo.insuranceBeneficiary?'hide':'']"></span>
						<img src="static/image/zhifu/iconfont_xuanzeda.png" class="radio-check" :class="[!applicantInfo.insuranceBeneficiary?'hide':'']" />
					</div>
					<div class="aui-checkbox-name">
						<div class="insure-name">
							{{applicantInfo.insuranceBeneficiary?applicantInfo.insuranceBeneficiary.real_name:applicantInfo.real_name}}
						</div>
						<div class="insure-shenfen">
							<span class="card-type">身份证</span>
							<span class="card-number">{{applicantInfo.insuranceBeneficiary?applicantInfo.insuranceBeneficiary.id_card_number:applicantInfo.id_card_number|idCard}}</span>
						</div>
					</div>
				</li>
			</div>
		</div>
	</div>
</template>
<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	export default {
		name: 'paySuccess',
		data() {
			return {
				pageTitle: '订单信息',
				applicantInfos: [],
				idCard: '',
				keyv: '@',
				query: null,
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
		},
		methods: {
			init: function() {
				this.query = this.$route.query;
				var self = this;
				new rest().get('insuranceBeneficiaries').auth(true).success(function(data) {
					self.compared(data);
				}).run()
			},
			compared: function(opt) {
				var self = this;
				new rest().get('orderToInsurances').parameter({
					order_id: this.query.orderId,
					expand: 'insuranceBeneficiary',
				}).auth(true).success(function(data) {
					var obj = data;
					for(var i = 0; i < opt.length; i++) {
						for(var j = 0; j < obj.length; j++) {
							if(opt[i].id == obj[j].insurance_beneficiary_id) {
								opt[i] = obj[j];
							}
						}
					}
					self.applicantInfos = opt;
				}).run();
			},
			radio: function(applicantInfo, key) {
				if(applicantInfo.insuranceBeneficiary) {
					applicantInfo = applicantInfo.insuranceBeneficiary;
					this.$set(this.applicantInfos, key, applicantInfo);
					this.delApplicant(applicantInfo.id);
				} else {
					this.addApplicant(applicantInfo.id,key);
				}
			},
			addApplicant: function(id,key) {
				var self = this;
				new rest().post('orderToInsurances').parameter({
					expand: 'insuranceBeneficiary',
				}).data({
					order_id: self.query.orderId,
					insurance_beneficiary_id: id,
				}).auth(true).success(function(data) {
					self.$set(self.applicantInfos,key,data);
					self.toast("成功添加");
				}).error(function(data, err) {
					self.toast("最多添加" + self.query.totalPeople + "人");
				}).run();
			},
			delApplicant: function(id) {
				var self = this;
				new rest().delete('orderToInsurances').parameter({
					order_id: self.query.orderId,
					insurance_beneficiary_id: id,
				}).auth(true).success(function(data) {
					
					self.toast("成功取消");
				}).run();
			},
			applicantInfo: function() {
				this.$router.push({
					path: "/applicantInfor",
				});
			}
		},
		computed: {},
		components: {},
		mixins: [Lib.P]
	}
</script>
<style scoped>
	.tianjia-button {
		padding: 0 20px;
		margin-top: 10px;
	}
	
	.mui-btn {
		color: #00bcd4;
		background-color: #fff;
		border-color: #00bcd4;
		height: 44px;
		line-height: 30px;
		border-radius: 3px;
		font-size: 15px;
	}
	
	.mui-btn.mui-active,
	.mui-btn:active {
		color: #00bcd4;
		background-color: #fff;
		border-color: #00bcd4;
		border-radius: 3px;
	}
	
	.applicationList {
		background-color: #fff;
		margin-top: 10px;
	}
	
	.aui-checkbox-name {
		padding: 11px 0 0 0;
	}
	
	.content-item {
		height: 64px;
		padding: 0 10px;
	}
	
	.content-item:last-child {}
	
	.card-type {
		padding-right: 5px;
	}
	
	.insure-name {
		font-size: 15px;
		color: #333;
	}
	
	.insure-shenfen {
		font-size: 12px;
		margin-top: 2px;
		color: #333;
	}
	
	.radio-btn {
		margin: 21px 10px 0 0;
	}
	
	.radio {
		display: inline-block;
		width: 22px;
		height: 22px;
		background-color: #ffffff;
		border: solid 1px #d7d7d7;
		border-radius: 50%;
	}
	
	.radio-check {
		width: 22px;
		height: 22px;
	}
	
	.hide {
		display: none;
	}
	
	.show {
		display: block;
	}
</style>