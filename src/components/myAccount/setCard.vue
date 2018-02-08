<template>
	<div class="box">
		<header class="mui-bar mui-bar-nav" ref = 'header'>
			<a class="mui-icon mui-icon-left-nav mui-pull-left" @click='back'></a>
			<h1 class="mui-title">添加卡片</h1>
		</header>

		<div class="mui-content">
			<div class="mui-content-padded">
				<span class="title">请绑定您的银行卡</span>
				<ul class="mui-table-view mui-table-view-chevron mui-input-group">
					<li class="mui-table-view-cell mui-input-row">
						<label>持卡人</label>
						<input type="text" v-model="username" placeholder="请输入用户名">
					</li>
					<li class="mui-table-view-cell mui-input-row">
						<label>卡&nbsp;&nbsp;&nbsp;&nbsp;号</label>
						<input type="text" v-model="cardNum" placeholder="请输入银行卡号">
					</li>
					<li class="mui-table-view-cell">
						<router-link to="/selectBank" class="mui-navigate-right mui-text-center">
							<span class="field-title mui-text-center mui-pull-left">银行</span><span class="content" v-if="str||bank">{{str=="{}"?'请选择银行':bank.name}}</span>
						</router-link>
					</li>
				</ul>
				<div class="mui-content-padded margin-t-10">
					<div :class="['mui-btn','mui-btn-block',flag?'orange':'mui-btn-grey']" @click="next">下一步</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
	export default {
		name: 'setCard',
		data() {
			return {
				pageTitle: '添加卡片',
				username: '',
				cardNum: '',
				flag: false,
				bank: null,
				str: ''
			}
		},
		activated: function() {
			this.init();
		},
		mounted(){
      this.$refs.header.style.cssText = 'top:'+tkStatusBarState.height()+'px'
    },

		methods: {
			init: function() {
				this.bank = this.$route.query;
				this.str = JSON.stringify(this.bank);
				if(this.str == "{}") {
					this.username = "";
					this.cardNum = "";
				}
			},
			next: function() {
				this.verification();
				var self = this;
				new rest().post("backCards").data({
					bank_id: this.bank.id,
					bank_card: this.cardNum
				}).auth(true).success(function(data) {
					self.toast("银行卡添加成功");
					self.$router.replace("/addCard");
				}).error(function(er) {
					var i = 0;
					var len = er.length;
					for(; i < len; i++) {
						self.toast(er[i].message);
					}
				}).run()
			},
			verification() {
				var uLen = this.username.length;
				var uReg = /\w/g.test(this.username);
				if(uReg || uLen < 1 || uLen > 3) {
					this.toast("用户名格式不对");
					this.flag = false;
					return;
				}
				var cLen = this.cardNum.length;
				var cReg = /\D/.test(this.cardNum);
				if(cReg) {
					this.toast("只能输入数字");
					this.flag = false;
					return;
				}
				if(cLen < 18 || cLen > 21) {
					this.toast("卡号位数不正确");
					this.flag = false;
					return;
				}
				if(this.str == "{}") {
					this.toast("请选择银行");
					return;
				}
				this.flag = true;
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-bar-nav {
		box-shadow: none;
		border-bottom: 1px solid #f2f2f2;
	}
	
	.mui-table-view-cell {
		height: auto;
	}
	
	.mui-content-padded {
		margin: 0 10px;
	}
	
	.title {
		color: #b6b6b6;
		font-size: 14px;
		line-height: 2em;
	}
	
	.mui-input-row {
		border-bottom: 1px solid #f2f2f2;
	}
	
	.mui-input-row label~input,
	.mui-input-row label {
		padding: 0;
		height: 1.5em;
		line-height: 1.5em;
	}
	
	.mui-input-row label {
		width: 20%;
		text-align: center;
	}
	
	.mui-input-row input {
		width: 80%;
	}
	
	.field-title {
		width: 25%;
		letter-spacing: 1em;
	}
	
	.margin-t-10 {
		margin-top: 20px;
	}
	
	.orange {
		background: #01BCD7;
		color: #fff;
	}
</style>