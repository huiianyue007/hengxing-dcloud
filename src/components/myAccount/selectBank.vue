<template>
	<div class="box">
		<header-title content="选择银行"></header-title>
		<div class="mui-content">
			<ul class="mui-table-view margin-t-10" v-if= "bankAr.length>0">
				<li class="mui-table-view-cell" v-for = "item in bankAr" @click = "openVue(item)">
					<a class="mui-navigate-right"><img :src="image(item.icon,{width:100,height:100,type:'cut'})"/>{{item.name}}</a>
				</li>
			</ul>

		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from "assets/js/rest.js"
	export default {
		name: 'selectBanK',
		data() {
			return {
				pageTitle: '选择银行',
				bankAr:[]
			}
		},
		created:function(){
			var self = this;
			new rest().get("back").auth(true).success(function(data){
				self.bankAr = data
			}).run();
		},
		methods:{
			openVue(item){
				this.$router.replace({path:'/setCard',query:item});
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mui-table-view{background:#f8f8f8;}
	.mui-table-view-cell{height:auto;margin-top:1em;background:#fff;}
	.mui-table-view-cell img{height:70px;vertical-align: middle;margin-right:2em;}
	.mui-table-view-cell a{line-height:70px;padding:0;}
</style>