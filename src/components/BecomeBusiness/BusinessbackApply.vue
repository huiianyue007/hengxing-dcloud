<template>
	<div class="mui-content">
		<header-title content="服务申请"></header-title>
		<div class="content">
			<div class="shenhetu" v-show='show'>
				<div class="shenhezhong">
					<img src="static/image/shenhe/under_review.png" v-if="!carmerImage" />
				</div>
				<div class="shenheshibai">
					<img src="static/image/shenhe/review_failure.png" v-if="carmerImage" />
				</div>
			</div>

			<div class="mui-input-row">
				<label>真实姓名</label>
				<input type="text" class="mui-input-clear" placeholder="请填写真实姓名" v-model="name">
			</div>
			<div class="mui-input-row margin-t-10">
				<p class="text-lf size12"><span class="iconfont icon">&#xe60e;</span>请务必填写您本人的身份信息,否则将无法提取</p>
				<label>身份证号</label>
				<input type="text" class="mui-input-clear" placeholder="请填写您的身份证号" v-model="userCard">
			</div>
			<div class="photo_div">
				<p class="text-lf size14">身份证正反面照片</p>
				<p class="text-lf size12">需要身份证文字清晰可见</p>
				<div class="photo">
					<div class="photo_img" @click="getImage(key)" v-for="(item,key) in items">
						<!--一个是有相片,一个是没有相片-->
						<img :src="item?item:'static/image/id_frontend.png'" :class="[item?'zhaopian_lf':'shilitu_lf']" />
					</div>
				</div>
			</div>
		</div>
		<button class="foot" @click="sentCheck">
			提交审核
		</button>
		<cramera v-if="flag" @getImg="setImg" @clickCancel = "cancel"></cramera>
	</div>

</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import agreement from 'components/BecomeBusiness/BusinessbackApply.vue'
	import cramera from 'components/component/cramera.vue'
	import rest from "assets/js/rest.js"
	export default {
		data() {
				return {
					pageTitle: '商户协议',
					name: '',
					userCard: '',
					display: true,
					show: true,
					carmerImage: false,
					items: {
						fontIdCard: '',
						backIdCard: ''
					},
					flag: false,
					idCard: ''
				}
			},
			created: function() {
				this.init()
			},
			activated: function() {
				this.init()
			},
			components: {
				cramera
			},
			methods: {
				init(){
					this.flag = false;
				},
				getImage(str) {
					this.idCard = str;
					this.flag = true;
				},
				cancel(){
					this.flag = false;
				},
				sentCheck: function() {
					var self = this;
					new rest().post("applyGuide").auth(true).data({
						real_name: self.name,
						id_card_number: self.userCard,
						front_of_id_card: self.items.fontIdCard,
						back_of_id_card: self.items.backIdCard,
					}).success(function(data) {
						self.toast("用户信息已经提交");
						self.$router.push("/");
					}).error(function(er) {
						if(Array.isArray(er)) {
							self.toast(er[0].message);
						} else {
							self.toast(er.message);
						}
					}).run();
				},
				setImg(opt) {
					this.items[this.idCard] = this.image(opt, {
						width: 340,
						height: 242,
						type: 'cut'
					});
					this.flag = false;
				}
			},
			mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.content {
		padding-top: 60px;
	}
	
	.mui-input-row {
		background-color: #fff;
		font-size: 14px;
		box-shadow: 0 0 10px #dfdfdf;
	}
	
	.mui-input-row input {
		float: left;
	}
	
	.mui-input-row label {
		padding: 0px 15px;
		line-height: 50px;
		padding-top: 0px;
		width: 80px;
		padding-left: 10px;
		padding-right: 10px;
	}
	
	.content {
		background-color: #F8F8F8;
	}
	
	.mui-input-row label~textarea {
		float: left;
	}
	
	.margin-t-10 {
		margin-top: 10px;
	}
	
	.size14 {
		font-size: 14px;
	}
	
	.size12 {
		font-size: 12px;
	}
	
	.text-lf {
		padding-left: 10px;
		margin-bottom: 0;
		line-height: 3em;
	}
	
	.text-lf .icon {
		color: #F0AD4E;
		margin-right: .5em;
	}
	
	.photo_div {
		margin-top: 10px;
		background-color: #fff;
		width: 100%
	}
	
	.clear_both {
		clear: both;
	}
	
	.photo {
		display: flex;
		padding: 0 5px;
		box-sizing: content-box;
	}
	
	.photo_img {
		background-color: #F8F8F8;
		margin: 5px;
		width: 42.5%;
		margin-bottom: 20px;
		flex-grow: 1;
	}
	
	.shilitu_rt,
	.shilitu_lf {
		display: block;
		width: 35%;
		height: auto;
		margin: 27px auto;
	}
	
	.zhaopian_lf,
	.zhaopian_rt {
		width: 100%;
		height: auto;
	}
	
	.foot {
		position: fixed;
		bottom: 0px;
		left: 0px;
		text-align: center;
		width: 100%;
		color: #fff;
		background: #e8a440;
		height: 45px;
	}
	
	.shenhetu img {
		width: 64px;
		display: block;
		margin: 10px auto;
	}
</style>