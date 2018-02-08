<template>
	<div class="box">
		<header class="mui-bar mui-bar-nav" ref = 'header'>
			<a class="mui-icon mui-icon-left-nav mui-pull-left" @click='back'></a>
			<h1 class="mui-title">添加卡片</h1>
			<a class="mui-pull-right save" @click = "setCards">{{flag?'完成':'删除'}}</a>
		</header>
		<div class="mui-content">
			<div class="mui-content-padded">
				<ul class="mui-table-view mui-table-view-chevron">
					<li class="mui-table-view-cell" v-for=" item in backCards">
						<div class='mui-media-body mui-grid-view mui-grid-9'>
							<div class="mui-col-xs-2 mui-pull-left left">
								<img :src="image(item.bank.icon,{width:100,height:100})">
							</div>
							<div class="mui-col-xs-10 mui-pull-right">
								<p class="title">{{item.bank.name}}</p>
								<p class="con">储蓄卡</p>
								<p>{{item.bank_card|setCard}}</p>
							</div>
							<div class="shadow" v-if="flag">
								<div class="mui-pull-right del" @click = "delCards(item)">
									<span>删除</span>
								</div>
							</div>
						</div>
					</li>
					<li class="mui-table-view-cell">
						<router-link tag="div" to="/setCard" class='mui-media-body mui-grid-view mui-grid-9'>
							<img src="static/image/myAccount/bg_img_tianjia.png" alt="" />
							<p class="mui-text-center font_color_bcd">添加银行卡</p>
						</router-link>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	  import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
	export default {
		name: 'addCard',
		data() {
			return {
				pageTitle: '添加卡片',
				backCards: [],
				flag:false,
			}
		},
		filters:{
			setCard:function(opt){
				opt = '*****  *****  ****  '+opt.substring(opt.length-4);
				
				return opt
			}
		},
		mounted(){
      this.$refs.header.style.cssText = 'top:'+tkStatusBarState.height()+'px'
    },

		activated: function() {
			this.init();
		},
		methods: {
			init: function() {
				this.flag = false;
				var self = this;
				new rest().get("backCards").parameter({
					expand: "bank"
				}).auth(true).success(function(data) {
					self.backCards = data;
				}).run()
			},
			delCards:function(opt){
				var self = this;
				new rest().delete("backCardsId",opt.id).auth(true).success(function(data){
					self.toast("银行卡删除成功");
					self.backCards.length--;
					if(self.backCards.length<=0){
						self.$router.replace("/setCard");
					}else{
						self.init();
					}
				}).error(function(er){
					self.toast(er.message);
				}).run();
			},
			setCards:function(){
				if(this.flag){
					this.flag = false
				}else{
					this.flag = true;
				}
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
	
	.mui-table-view-cell {
		height: auto;
		margin-top: 10px;
		padding: 0;
		background: #f8f8f8;
		border: none !important;
	}
	
	.mui-table-view-cell:after {
		background: transparent;
	}
	
	.mui-media-body {
		background: url(../../assets/image/myAccount/bg.png) top center no-repeat;
		backgorund-size: cover;
		border-radius: 5px;
		color: #fff;
		padding: 10px;
		box-sizing: border-box;
	}
	
	.mui-media-body p {
		color: #fff;
		line-height: 2em;
	}
	
	.left {
		padding-right: 10px;
		box-sizing: border-box;
	}
	
	.mui-media-body .title {
		font-size: 30px;
		line-height: 50px;
	}
	
	.mui-media-body .con {
		font-size: 12px;
	}
	
	.mui-table-view-cell:last-child .mui-media-body {
		background: #f8f8f8;
		border: 1px dashed #4FCFE1;
	}
	
	.mui-table-view-cell:last-child .mui-media-body img {
		display: block;
		margin: 14px auto;
		width: 50px;
		height: 50px
	}
	
	.mui-media-body .font_color_bcd {
		color: #00BCD6;
	}
	.shadow{width:100%;height:100%;background:rgba(100,100,100,.5);border-radius:5px;position:absolute;top:0;left:0;}
	.del{width:75px;height:100%;background:#F0AD4E;border-bottom-right-radius: 5px;border-top-right-radius: 5px;font-size:16px;box-sizing: border-box;line-height:100%;position: relative;}
	.del span{display: block;position: absolute;left:50%;top:50%;margin:-.5em -1em;width:100px;}
</style>