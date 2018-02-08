<template>
	<div class="box">
		<header class="mui-bar mui-bar-nav" ref = 'header'>
			<h1 class="mui-title">聊天</h1>
		</header>
		<div class="mui-content">
			<div class="logout-info" v-if="!flag">
				<img src="static/image/im-logout.png" class="im-logout-pic" />
				<div class="no-chat">获取更多聊天信息</div>
				<router-link :to="{path:'./login'}" class="mui-btn btn-primary login" tag='a'>登录</router-link>
			</div>
			<div class="no-sess" v-if="flag">
				<img src="static/image/default-image/no-message.png" class="no-message" />
				<div class="no-chat">没有最近联系人</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
	export default {
		name: 'myAccount',
		data() {
			return {
				pageTitle: '聊天列表'
			}
		},
		activated(){
		  tkStatusBarState.setSpace(false)
		},
		
		mounted(){
      this.$refs.header.style.cssText = 'top:'+tkStatusBarState.height()+'px'
    },
		computed: {
			flag: function() {
				return this.$store.state.user.isGuest;
			},
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.logout-info,
	.no-sess {
		position: absolute;
		top: 50%;
		width: 100%;
		margin-top: -190px;
		text-align: center;
	}
	
	.logout-info,
	.no-sess {
		color: #999;
		font-size: 17px;
	}
	
	img.im-logout-pic {
		width: 70%;
		margin-bottom: 1rem;
	}
	
	img.no-message {
		width: 30%;
		margin-top: 15%;
		margin-bottom: 1rem;
	}
	
	.login {
		width: 50%;
		height: 35px;
		line-height: 27px;
		margin-top: 1.5rem;
		background-color: #00BCD6;
		color: #FFFFFF !important;
		border: none;
	}
</style>