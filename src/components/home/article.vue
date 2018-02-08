<template>
	<div class="mui-content">
		<header-title :content="info"></header-title>
		<div class="mui-content" v-if="items">
			<img :src="image(items.cover,{width:640,height:368,type:'cut'})" alt="" />
		</div>
		<h1 class="title" v-if="items">{{items.title}}
			<span class="bre"></span>
			<span v-if = "items.updated_at" class="title_tip">时间:{{items.updated_at}}</span></h1>
		<div class="mui-content-padded" v-if="items" v-html="items.body">
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	export default {
		name: 'article',
		data() {
			return {
				items: null,
				info: "小编推荐"
			}
		},
		computed: {
			id: function() {
				return this.$route.query.id;
			}
		},
		created: function() {
			this.init();
		},
		watch:{
			id:function(){
				this.id = this.$route.query.id;
				this.init();
			}
		},
		methods: {
			init: function() {
				var opt = this;
				new rest().get("articleXq", this.id).parameter().success(function(data) {
					var date = new Date(data.updated_at * 1000);
					data.updated_at = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
					opt.items = data;
				}).run();
			}
		},

		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	header .mui-icon {
		color: #888;
	}
	
	.title {
		text-align: center;
		font-size: 20px;
		overflow: hidden;
		line-height: 2em;
	}
	
	.mui-title,
	.title {
		color: #000;
	}
	
	.title .bre {
		width: 20%;
		display: block;
		height: 1px;
		background: #ccc;
		margin: 0 auto;
	}
	
	.title .title_tip {
		display: block;
		font-size: 12px;
		color: #999;
		letter-spacing: .1em;
		line-height: 2em;
	}
	
	.mui-content-padded p {
		font-size: 14px;
		color: #383838;
	}
</style>