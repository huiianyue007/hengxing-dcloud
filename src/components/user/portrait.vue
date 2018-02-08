<template>
	<div class="box">
		<header-title content="编辑" btn="选择图片" @clickme="editImg"></header-title>
		<div class="mui-content">
			<div class="mui-content-padded">
				<img :src="imgSrc?image(imgSrc):'static/image/default-image/avatar.png'" />
			</div>
		</div>
		<cramera @getImg="getImg" @clickCancel = "cancel" v-if="flag"></cramera>
		<div class="footer">
			<div class="mui-pull-right submit" @click="saveBack">确定</div>
		</div>

	</div>
</template>
<script>
	import Lib from 'assets/js/Lib.js'
	import cramera from 'components/component/cramera.vue'
	import rest from 'assets/js/rest.js'
	export default {
		name: 'version',
		data() {
			return {
				pageTitle: '版本信息',
				flag: false,
				imgSrc: ''
			}
		},
		activated() {
			this.flag = false;
			var self = this;
			new rest().get("self").auth(true).success(function(data) {
				if(data.portrait) {
					self.imgSrc = data.portrait;
				}
			}).run();
		},
		components: {
			cramera
		},
		methods: {
			editImg() {
				this.flag = true;
			},
			getImg(opt) {
				this.imgSrc = opt;
				this.flag = false;
			},
			cancel(){
				this.flag = false;
			},
			saveBack() {
				var self = this;
				new rest().put("users", this.userInfo.id).auth(true).data({
					portrait: this.imgSrc
				}).success(function(data) {
					self.toast("头像设置成功");
					self.$store.commit("setUser", data);
					self.$router.replace("/");
				}).run();
			}
		},
		computed: {
			userInfo() {
				return this.$store.state.user.data;
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-content {
		position: fixed;
		background: #333;
		width: 100%;
		height: 100%;
	}
	
	.mui-content-padded {
		margin: 0;
		padding: 0 10px 50px;
		width: 100%;
		display:-webkit-box;
		-webkit-box-align:center;
		height: 100%;
	}
	
	.mui-content-padded img {
		width: 100%;
		height: auto;
		display: block;
		margin: 0 auto;
	}
	
	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 50px;
		background: #f8f8f8;
		margin-bottom: 0;
	}
	
	.submit {
		width: 57px;
		height: 34px;
		background: #3AC9DC;
		color: #fff;
		text-align: center;
		line-height: 34px;
		margin: 8px;
		font-size: 16px;
		border-radius: 5px;
	}
</style>