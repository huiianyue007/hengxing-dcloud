<template>
	<div class="box">
		<header-title content="设置取款密码"></header-title>
		<div class="mui-content">
			<div class="mui-content-padded">
				<span class="title" v-if="!firstPassword">为了您的账号安全,请设置6位取款密码</span>
				<span class="title" v-else>为了您的账号安全请再次确认</span>
				<div class="input" @click="show">
					<span v-for="r in ar">{{r.message}}</span>
				</div>
				<div :class="['mui-btn','mui-btn-block','mui-btn-grey','margin-t-10',confirm?'orange':'grey']" v-if="firstPassword" @click="determine">确定</div>
			</div>
			<div class="jianpan" v-if="flag">
				<div class="mui-bar mui-bar-nav mui-bar-warning header_style jianpan_height">
					<a class="mui-btn mui-btn-warning mui-pull-left left_danjiao" @click="init">
						<span class="mui-icon mui-icon-left-nav font_color1"></span>
					</a>
					<div class="wancheng" @click="submit">完成</div>
					<div class="clear"></div>
				</div>
				<ul class="jianpan_ul">
					<li v-for="r in vAr" :class="[r=='.'||r=='chexiao'?'jianpan_style_col':'']" @click="setValue(r)">{{r!="chexiao"?r:""}}
						<i class="mui-icon mui-icon-arrowthinleft" v-if="r=='chexiao'"></i>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from "assets/js/rest.js"
	import sha from "assets/js/sha1.js"
	import blowfish from "assets/js/blowfish.js"
	export default {
		name: 'setPassWord',
		data() {
			return {
				pageTitle: '设置取款密码',
				title: "设置取款密码",
				flag: false,
				ar: [{
					message: ""
				}, {
					message: ""
				}, {
					message: ""
				}, {
					message: ""
				}, {
					message: ""
				}, {
					message: ""
				}],
				vAr: ["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "chexiao"],
				num: 0,
				token: null,
				firstPassword: '',
				secondPassword: '',
				str: '',
				confirm: false
			}
		},
		activated: function() {
			this.init();
		},
		methods: {
			init: function() {
				this.firstPassword = "";
				this.secondPassword = "";
				this.num = 0;
				this.str = "";
				this.clearValue();
				this.flag = false;
			},
			show: function() {
				this.flag = true;
			},
			clearValue: function() {
				for(var i = 0; i < this.ar.length; i++) {
					this.ar[i].message = "";
				}
			},
			submit: function() {
				if(this.num != 6) {
					this.toast("请输入6位密码");
					return;
				}
				if(this.firstPassword == "") {
					this.firstPassword = this.str;
					this.num = 0;
					this.str = "";
					this.clearValue();
					this.flag = false;
				} else {
					this.secondPassword = this.str;
					if(this.secondPassword == this.firstPassword) {
						this.confirm = true;
					} else {
						this.confirm = false;
						this.toast("两次密码不一致");
					}
				}
			},
			setValue(opt) {
				if(opt != "chexiao" && this.num < 6) {
					this.ar[this.num].message = opt;
					this.str += opt;
					this.num++;
				} else if(this.num > 0) {
					this.num--;
					this.str = this.str.substring(0, this.str.length - 1);
					this.ar[this.num].message = "";
				}

			},
			setPassword: function() {
				var self = this;
				var sha1_input = sha(this.secondPassword);
				new rest().get('ashKey').auth(true).success(function(data) {
					var crea_k = blowfish.encrypt(sha1_input, data.key, {
						cipherMode: 0,
						outputType: 0
					});
					var creata_key = {
						withdrawal_password: crea_k
					};
					self.createKey(creata_key)
				}).run()
			},
			createKey: function(opt) {
				var self = this;
				new rest().post('withdrawalPassword').data(opt).auth(true).success(function(data) {
					self.$router.replace("/addCard");
				}).run()
			},
			determine: function() {
				if(this.confirm) {
					this.setPassword();
				} else {
					this.toast("两次密码不一致");
				}
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.title {
		color: #333;
		font-size: 12px;
	}
	
	.mui-content-padded {
		margin: 0;
		padding: 30px 15px;
	}
	
	input {
		text-align: center;
		letter-spacing: 1em;
	}
	
	.margin-t-10 {
		margin-top: 20px;
	}
	
	.input {
		background: #fff;
		height: 39px;
		margin-top: 23px;
		box-shadow: 0 0 6px 2px #DEECEE;
		border-radius: 5px;
		padding: 0 5px;
		box-sizing: border-box;
	}
	
	.input span {
		display: block;
		width: 16.66%;
		border-right: 1px solid #cfcfcf;
		height: 100%;
		float: left;
		box-sizing: border-box;
		text-align: center;
		line-height: 39px;
		padding: 0;
	}
	
	.input span:last-child {
		border: none;
	}
	
	.jianpan {
		position: fixed;
		bottom: 0px;
		width: 100%;
	}
	
	.jianpan_height {
		background-color: #EFF0F1;
		line-height: 40px;
		position: static;
	}
	
	.font_color1 {
		color: #333 ! important;
	}
	
	.left_danjiao {
		background: transparent !important;
		margin-top: 5px ! important;
		padding: 0;
		top: 0;
		margin-top: 0 !important;
		line-height: 49px;
		position: absolute ! important;
	}
	
	.wancheng {
		/* position: absolute; */
		float: right;
		margin-right: 10px;
		color: #333 ! important;
	}
	
	.jianpan_ul {
		width: 100%;
		margin: 0;
		padding: 0;
		border-top: 1px solid #eee;
	}
	
	.jianpan_ul li {
		width: 33.3333%;
		line-height: 50px;
		text-align: center;
		float: left;
		border-bottom: 1px solid #eee;
		border-right: 1px solid #eee;
	}
	
	.jianpan_style_col {
		background-color: #EFF0F1;
	}
	
	.orange {
		background: #01BCD7;
	}
</style>