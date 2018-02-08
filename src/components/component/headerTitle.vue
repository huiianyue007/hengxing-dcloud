<template>
	<header class="mui-bar mui-bar-nav">
		<a class="mui-icon mui-icon-left-nav mui-pull-left" @click='back'></a>
		<h1 class="mui-title">{{content}}</h1>
		<a class="mui-pull-right save" @click="clickme" v-if="btn">{{btn}}</a>
	</header>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
	export default {
		name: 'headerTitle',
		data() {
			return {
				items: null,
			}
		},
		mounted(){
      this.$el.style.cssText = 'top:'+tkStatusBarState.height()+'px'
    },
		methods:{
			clickme:function(){
				this.$emit("clickme");
			}
		},
		props: ['content',"btn"],
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	header .mui-icon {
		color: #888;
	}
	.save {
		line-height: 44px;
		display: block;
		padding: 0 .5em;
		color: #00BCD6;
		font-size: 15px;
		position: absolute;
		right:10px;
		z-index:2;
		box-sizing: border-box;
	}
</style>