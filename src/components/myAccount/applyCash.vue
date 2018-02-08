<template>
	<div class="box">
		<header class="mui-bar mui-bar-nav" ref = 'header'>
			<a class="mui-icon mui-icon-left-nav mui-pull-left" @click='back'></a>
			<h1 class="mui-title">申请提现</h1>
			<router-link class="mui-pull-right save" to="/applyRecord">提现记录</router-link>
		</header>
		<div class="mui-content margin-t-10">
			<ul class="mui-table-view mui-table-view-chevron" v-if="item">
				<li class="mui-table-view-cell" @click="selectCard">
					<a class="mui-navigate-right bankCard">
						<img :src="image(item.bank.icon,{width:75,height:75})" alt="" class="mui-pull-left" />
						<div class="mui-pull-left right">
							<p class="title">{{item.bank.name}}</p>
							<p>储蓄卡|{{item.bank_card}}</p>
						</div>
					</a>
				</li>
				<li class="mui-table-view-cell mui-input-group apply">
					<div class="mui-input-row">
						<label class="con mui-pull-left">金&nbsp;&nbsp;&nbsp;&nbsp;额</label>
						<input type="text" :placeholder='balance' v-model="account" disabled v-if="show"/>
						<input type="text" :placeholder='balance' v-model="account" v-else/>
					</div>
				</li>
			</ul>
			<div class="mui-content-padded">
				<div class="mui-btn mui-btn-block primary" @click="apply">下一步</div>
			</div>
			<password v-if="show" type = "password" @back="comeBack" @submit="submit"></password>
			<div class="content" v-if="flag">
				<header class="mui-bar mui-bar-nav mb_bar">
					<a class="mui-icon mui-icon-left-nav mui-pull-left" @click='hidden'></a>
					<h1 class="mui-title">选择卡片</h1>
				</header>
				<ul class="mui-table-view mui-table-view-chevron margin-t-10" v-if="bankAr">
					<li class="mui-table-view-cell" v-for="(item,key) in bankAr" @click="getBank(key)">
						<a class="mui-navigate-right">
							{{item.bank.name}}({{item.bank_card}})
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import password from "components/component/password.vue"
	import rest from 'assets/js/rest.js'
	import sha from "assets/js/sha1.js"
	import blowfish from "assets/js/blowfish.js"
	import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
	export default {
		name: 'applyCash',
		data() {
			return {
				pageTitle: '申请提现',
				bankAr: [],
				balance:0,
				item: null,
				flag: false,
				show: false,
				account:""
			}
		},
		activated: function() {
			this.init();
		},
		components: {
			password
		},
		mounted(){
      this.$refs.header.style.cssText = 'top:'+tkStatusBarState.height()+'px'
    },

		methods: {
			init() {
				var self = this;
				this.flag = false;
				this.show = false;
				new rest().get("backCards").auth(true).parameter({
					expand: 'bank'
				}).success(function(data) {
					self.bankAr = data;
					self.item = data[0];
				}).run();
				new rest().get("account").auth(true).success(function(data) {
          self.balance = "最多可提现" + data.balance + "元";
        }).run();
			},
			hidden: function() {
				this.flag = false;
			},
			getBank: function(n) {
				if(this.bankAr.length > 0) {
					this.item = this.bankAr[n];
				}
			},
			comeBack: function() {
				this.show = false;
			},
			submit: function(msg) {
				this.setPassword(msg);
			},
			selectCard: function() {
				if(this.flag) {
					this.flag = false;
				} else {
					this.flag = true;
				}
			},
			setPassword: function(opt) {
				var self = this;
				var sha1_input = sha(opt);
				new rest().get('ashKey').auth(true).success(function(data) {
					var crea_k = blowfish.encrypt(sha1_input, data.key, {
						cipherMode: 0,
						outputType: 0
					});
					var creata_key = {
						card_id: self.item.id,
						amount: self.account,
						withdrawal_password: crea_k
					};
					self.createKey(creata_key)
				}).run()
			},
			createKey: function(opt) {
				var self = this;
				new rest().post("encashmentRecords").auth(true).data(opt).success(function(data) {
					self.toast("您的信息已提交,正在审核中");
					self.$router.replace("/apply_over");
				}).error(function(er) {
					if(Array.isArray(er)){
						self.toast(er[0].message)
					}else{
						self.toast(er.message);
					}
				}).run();
			},
			apply: function() {
				this.show = true;
			},
			openVue() {
				this.$router.replace("/applyRecord");
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.box {
		position: relative;
	}
	
	.mb_bar {
		position: relative;
	}
	
	.content {
		width: 100%;
		position: fixed;
		bottom: 0px;
	}
	
	.save {
		line-height: 44px;
		display: block;
		padding: 0 .5em;
		color: #01BCD6;
		position: absolute;
		right: 10px;
		z-index: 2;
		box-sizing: border-box;
	}
	
	.mui-table-view {
		background: #f8f8f8;
	}
	
	.margin-t-10 {
		margin-top: 10px;
	}
	
	.mui-table-view-cell:after,
	.mui-table-view:after,
	.mui-input-group .mui-input-row:after {
		display: none;
	}
	
	.mui-table-view-cell {
		height: auto;
	}
	
	.mui-table-view-cell .bankCard {
		background: url(../../../static/image/myAccount/bg_img.png) top center;
		background-size: cover;
		padding: 1em;
		box-sizing: border-box;
		border-radius: 5px;
		color: #fff;
		margin: -15px -11px;
	}
	
	.mui-table-view-cell .bankCard:after {
		color: #fff;
	}
	
	.mui-table-view-cell .mui-navigate-right .right {
		margin-left: 1em;
	}
	
	.mui-table-view-cell .mui-navigate-right p {
		color: #fff;
		line-height: 2em;
	}
	
	.mui-table-view-cell .mui-navigate-right .right .title {
		font-size: 20px
	}
	
	.mui-table-view-cell.apply {
		background: #fff;
		margin: 10px 0;
		padding: 0;
		border-bottom: 1px solid #dfdfdf;
	}
	
	.mui-table-view-cell.apply .mui-input-row {
		padding: 1em 0;
		height: auto;
	}
	
	.mui-table-view-cell.apply .con {
		font-size: 16px;
	}
	
	.mui-table-view-cell.apply input {
		height: auto;
	}
	
	.primary {
		color: #fff;
		background: #01BCD7
	}
</style>