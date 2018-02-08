<template>
	<div class="box">
		<header-title content="支付提示"></header-title>
		<div class="mui-content">
			<div class="con" v-if="results=='false'">
				<img src="static/image/zhifu/sb.png"/>
				<p class="title">支付失败</p>
			</div>
			<div class="con" v-if="results=='true'">
				<img src="static/image/zhifu/cg.png"/>
				<p class="title">支付成功</p>
			</div>
			
		</div>
		<div class="mui-content-padded">
			<router-link tag = "div" to = "/myOrder" class="mui-btn mui-btn-block grey" >返回订单</router-link>
		</div>
	</div>
</template>

<script>
import Lib from 'assets/js/Lib.js'

  export default {
    name: 'hello',
    data() {
      return {
        pageTitle:'第三页',
      }
    },
    computed:{
    	results:function(){
    		return this.$route.query.results;
    	}
    },
    mixins:[Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.con{width:100%;height:125px;background:url(../../../static/image/zhifu/zhifubg.png);background-size:contain;text-align:center;line-height:2em;margin-bottom: 35px;}
.con img{width:36px;height:36px;margin-top:30px;}
.title{font-size:18px;color:#333;}
.grey{color:#fff;background:#00BDD7;border:none;}
</style>