<template>
	<div class="box">
		<header-title content="信息提交成功"></header-title>
		<div class="mui-content">
			<div class="mui-content-padded mui-text-center">
				<div class="agree"></div>
				<p>提交成功</p>
				<p>您的信息已提交,我们将尽快审核</p>
				<div class="mui-btn mui-btn-block mui-btn-grey" :class="{blue:flag}" @click = "openVue('/applyRecord')">提现记录</div>
				<div class="mui-btn mui-btn-block mui-btn-grey" :class="{blue:!flag}" @click = "openVue('/')">返回首页</div>
			</div>
		</div>
	</div>
</template>

<script>
import Lib from 'assets/js/Lib.js'
  export default {
    name: 'applyOver',
    data() {
      return {
        pageTitle:'提现完成',
        flag: true
      }
    },
    methods:{
    	openVue:function(str){
    		this.flag = str=="/applyRecord";
    		this.$router.replace(str);
    	}
    },
    mixins:[Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.agree{width:100px;height:100px;margin:100px auto;background:url(../../assets/image/zhifu/iconfont_xuanzeda.png) no-repeat center center;background-size:100%;}
	.blue{background:#01BCD6;}
</style>