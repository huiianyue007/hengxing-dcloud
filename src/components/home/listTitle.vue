<template>
	<div class="content-title">
		<span class="content-title-pre"></span>热门旅游地
		<a class="more-link moreSecnicList" @click = "openVue">{{city?city.name+'所有服务':'更多'}}</a>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'

	export default {
		name: 'listTitle',
		data() {
			return {
				
			}
		},
		methods:{
			openVue:function(){
				var city = this.city;
				this.$router.push({path:'/guidelist',query:{code:city.code,name:city.name}});
			}
		},
		computed:{
			city:function(){
				return this.$store.getters.city;
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.content-title {
		font-size: 12px;
		color: #929292;
		line-height:36px;
		height:36px;
	}
	
	.content-title .more-link {
		color: #00bcd4;
		float: right;
	}
	
	.content-title .content-title-pre {
		display: inline-block;
		width: 3px;
		height: 14px;
		margin-right: 12px;
		background-color: #00bcd6;
		vertical-align: middle;
		border-radius: 3px;
	}
</style>