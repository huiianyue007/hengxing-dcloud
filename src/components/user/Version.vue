<template>
	<div class="box">
		<header-title content="版本信息"></header-title>
		<div class="mui-content mui-text-center">
			<img src="../../../static/image/logo.png" alt="" />
			<p>当前版本 </p>
			<p>{{version}}</p>
		</div>
		<div class="btn">
			<div class="mui-btn mui-btn-block blue">已是最新版本</div>
		</div>
	</div>
</template>

<script>
import Lib from 'assets/js/Lib.js'
import rest from 'assets/js/rest.js'
  export default {
    name: 'version',
    data() {
      return {
        pageTitle:'版本信息',
        version:''
      }
    },
    activated(){
    	var model = plus.device.model;
    	this.version = plus.runtime.version;
    	new rest().get("checkUpdate").parameter({
    		system_type:model,
    		version:this.version
    	}).success(function(data){
    		if(!data){
    			
    		}
    	}).error(function(er){
    	
    	}).run()
    },
    mixins:[Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.btn{position: fixed;bottom:0;width:100%;padding:0 10px;box-sizing: border-box;}
	.blue{background:#ccc;color:#fff;}
	.mui-text-center img{border-radius: 20px;margin-top:2rem}
</style>