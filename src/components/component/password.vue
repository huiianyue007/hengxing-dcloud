<template>
	<div class="box">
		<div class="content">
			<div class="jianpan">
				<!--<div class="mui-bar mui-bar-nav mui-bar-warning header_style jianpan_height">
					<a class="mui-btn mui-btn-warning mui-pull-left left_danjiao" @click="init">
						<span class="mui-icon mui-icon-left-nav font_color1"></span>
					</a>
				
					<div class="wancheng" @click="submit">完成</div>
					<div class="clear"></div>
				</div>-->
				<div class="mui-bar mui-bar-nav mui-bar-warning header_style jianpan_height">
					<a class="mui-icon mui-icon-left-nav mui-pull-left" @click='init'></a>
					<h1 class="mui-title">输入支付密码</h1>
					<a class="mui-pull-right save" @click="submit">完成</a>
				</div>
				<div class="mui-content-padded">
					<div class="input" @click="show">
						<span v-for="r in ar">{{r.message}}</span>
					</div>
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
	export default {
		name: 'setPassWord',
		data() {
			return {
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
				str: '',
				confirm: false
			}
		},
		activated: function() {
			this.init();
		},
		methods: {
			init: function() {
				this.num = 0;
				this.str = "";
				this.clearValue();
				this.flag = false;
				this.$emit("back");
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
				this.$emit("submit", this.str);
			},
			setValue(opt) {
				if(opt != "chexiao" && this.num < 6) {
					if(this.type == "password") {
						this.ar[this.num].message = "*";
					} else {
						this.ar[this.num].message = opt;
					}
					this.str += opt;
					this.num++;
				} else if(this.num > 0) {
					this.num--;
					this.str = this.str.substring(0, this.str.length - 1);
					this.ar[this.num].message = "";
				}

			},
		},
		props: ["type"],
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.save {
		line-height: 44px;
		display: block;
		padding: 0 .5em;
		color: #333;
		position: absolute;
		right: 10px;
		z-index: 2;
		box-sizing: border-box;
	}
	
	.jianpan_height .mui-icon {
		color: #888;
	}
	
	.box {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(100, 100, 100, .3);
		z-index: 11;
	}
	
	.content {
		position: absolute;
		bottom: 0;
		width: 100%;
	}
	
	.title {
		color: #333;
		font-size: 12px;
	}
	
	.mui-content-padded {
		margin: 0;
		padding: 10px 15px;
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
		background: #fff;
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
</style>