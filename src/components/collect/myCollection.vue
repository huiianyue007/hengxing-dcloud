<template>
	<div class="box">
		<header-title content="我的收藏"></header-title>
		<div class="mui-content">
			<div class="body-box" v-if = "block"> 
	            <li class="aui-col-xs-12 didao-item border-b border-t" v-for="collect in collects">
                    <div class="didao-ziliao DidaoXq border-b" tapmode>
                        <img :src="collect.service.user.portrait==null?'static/image/default-image/avatar.png':image(collect.service.user.portrait,{width:90,height:90,type:'cut'})" class="didao-pic">
                        <span class="didao-name">{{collect.service.user.username}}</span>
                        <span class="didao-sex didao-femalesex"><i class="icon iconfont sex-icon" :class="[collect.service.user.sex==0?'didao-malesex':'didao-femalesex']">{{collect.service.user.sex | sexview}}</i></span>
                        <button class="mui-btn btn mui-pull-right" @click='deleteCollect(collect.id)'>取消收藏</button>
                    </div>
	                    <div class="didao-fuwu DidaoXq" tapmode>
	                    	<div class="fuwu mui-col-xs-12 mui-row">
	                    		<div class="mui-col-xs-9">
	                    			<div class="didao-fuwutitle">{{collect.service.title}}</div>
			                        <div class="didao-fuwujingdian">
			                        	<i class="icon iconfont scenic-icon">&#xe632;</i>
			                        	<span class="fuwu-secnic" v-for="secnic in collect.service.scenic">
	                        				{{secnic.info.name}}&nbsp;
	                        			</span>
			                        </div>
			                        <div class="didao-fuwuxiangmu">
			                        	<span v-for="serviceitem in collect.service.item">
			                        		{{serviceitem.serviceType.name}}&nbsp;
			                        	</span>
			                        </div>
	                    		</div>
	                    		<div class="mui-col-xs-3 fuwu-status">
	                    			<img src="static/image/collect/list_ico_ysx.png" class="status-img" :class="[collect.service.status==0||collect.service.status==3?'show':'hide']"/>
	                    			<img src="static/image/collect/list_ico_fftz.png" class="status-img" :class="[collect.service.status==2?'show':'hide']"/>
	                    			<img src="static/image/collect/list_ico_ffgx.png" class="status-img" :class="[collect.service.status==1&&collect.version!=collect.service.version?'show':'hide']"/>
	                    		</div>
	                    	</div>
	                        
	                        <div class="mui-col-xs-12">
	                        	<div>
		                            <span class="didao-fuwudidian"><i class="icon iconfont place-icon">&#xe62c;</i>{{collect.service.region.full_name}}</span>
		                            <div class="didao-fuwujiage"><span class="jiageicon">￥</span><span class="service-price">{{collect.service.price}}</span><span class="jiagedanwei">/天</span></div>
		                        </div>
	                        </div>
	                    </div>
	            </li>
	        </div>
			<noData content="暂时还没有收藏哦！" v-if = "!block"></noData>
		</div>
	</div>
</template>
<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	import _ from 'underscore'
	import noData from 'components/component/noData.vue'
	import Vue from 'vue'
	export default {
	    data() {
		    return {
		    	pageTitle:'收藏列表',
		    	collects:[],
		    	block:true,
		    }
	    },
	    filters: {
			sexview: function(sex) {
				var data = {
					0: '',
					1: '',
				}
				return data[sex];
			},
		},
	    created:function(){
	    },
	    activated: function() {
        	this.init()
      	},
	    components: {
			noData
		},
	    methods:{
	    	init:function(){
	    		var self = this;
	    		self.block = true;
    			self.collects = [];
		    	new rest().get('collectList').parameter({
	                sort:'-created_at',
	                expand:'service.user,service.region,service.item,service.item.serviceType,service.scenic,service.scenic.info',
	          }).auth(true).success(function(data){
	            	if(data.length == 0){
	            		self.block = false;
	            	}else{
	            		self.block = true;
	            		self.collects = data;
	            	}
	            }).run();
	    	},
	    	deleteCollect:function(collectId,index){
	    		var self = this;
	    		new rest().delete('deleteCollect',collectId).auth(true).success(function(data){
	    			self.collects.splice(index, 1)
	    			if(self.collects.length==0){
	    				self.block = false;
	    			}
	    		}).run();
	    	}
	    },
	    mixins:[Lib.P]
  	}
</script>
<style scoped>
	.didao-ziliao .mui-btn{
		height: 24px;
		width: 70px;
		margin-top: 7px;
		color: #999;
		border-radius: 2px;
		font-size: 13px;
		line-height: 9px;
		padding: 0px;
	}
	.mui-btn.active, .mui-btn:active {
		color: #999;
		background-color: #fff;
		border:1px solid #d7d7d7;
	}
	/*收藏状态*/
	.status-img{
		height: 40px;
		float: right;
	}
	/*字体图标的大小*/
	.sex-icon{
		font-size: 13px !important;
		padding-left: 1px !important;
	}
	.scenic-icon{
		font-size: 13px !important;
	}
	.place-icon{
		font-size: 13px !important;
	}
	.hide{
		display: none;
	}
	.show{
		display: inline-block;
	}
</style>