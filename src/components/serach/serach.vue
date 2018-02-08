<template>
	<div class="box">
		<header id="header" class="mui-bar mui-bar-nav mui-col-xs-12" ref = 'header'>
			<span class="mui-icon mui-icon-search dingwei-tub"></span>
			<div class="mui-input-row mui-search mui-col-xs-10 mui-pull-left">
			    <input type="search" class="mui-input-clear " placeholder="搜索城市/景点/服务" v-model="msg" @keyup.enter = "search" ref = 'input'>
			</div>
			<a class="mui-col-xs-2 search-cancle mui-pull-right"  @click="cancel">取消</a>
		</header>
	<div class="mui-content">
		<div class="search-result" v-if="!block">
			<div class="content-place">
				<div class="place-title" v-show="display">
					旅游地
				</div>
				<ul class="mui-table-view mui-table-view-chevron place-bodybox">
					<li class="mui-table-view-cell mui-media searchlist-item" v-for="palce in palces">
						<router-link :to="{path:'/sceniclists',query:{citycode:palce.code,cityname:palce.name}}">
							<a class="mui-navigate-right">
								<img class="mui-media-object mui-pull-left search-img" src="static/image/edd.png">
								<div class="mui-media-body searchplace-body">
									<p class="important-word place-name">{{palce.full_name}}</p>
								</div>
							</a>
						</router-link>
					</li>
				</ul>
			</div>
			<div class="content-secnic">
				<div class="secnic-title" v-show="display">
					景点
				</div>
				<ul class="mui-table-view mui-table-view-chevron">
					<li class="mui-table-view-cell mui-media searchlist-item" v-for="scenicse in scenicses">
						<router-link :to="{path:'/guidelist',query:{id:scenicse.id}}">
							<a class="mui-navigate-right">
								<img :src="image(scenicse.bigpic,{width:150,height:150,type:'cut'})" class="mui-media-object mui-pull-left search-img">
								<div class="mui-media-body searchsecnic-body">
									<p class="important-word">{{scenicse.name}}</p>
									<p class="mui-ellipsis fuzhu-word">{{scenicse.introduction}}</p>
								</div>
							</a>
						</router-link>
					</li>
				</ul>
			</div>
			<div class="content-didao">
				<div class="didao-title" v-show="display">
					商家
				</div>
				<ul class="mui-table-view mui-table-view-chevron">
					<li class="mui-table-view-cell mui-media searchlist-item" v-for="guide in guides">
						<router-link :to="{path:'/guidelist',query:{id:guide.id}}">
						<a class="mui-navigate-right">
							<img :src="guide.portrait==null?'static/image/default-image/avatar.png':image(guide.portrait,{width:150,height:150,type:'cut'})" class="mui-media-object mui-pull-left search-img didao-img">
							<div class="mui-media-body searchfuwu-body">
								<p class="important-word">{{guide.username}}</p>
								<p class="mui-ellipsis fuzhu-word">{{guide.title}}</p>
								<p class="fuzhu-ruoword">{{guide.region_full_name}}</p>
							</div>
						</a>
						</router-link>
					</li>
				</ul>
			</div>
		</div>
		<div class="nosearch border-b" v-if="block">
			<div class="content-localHot border-b">
				<div class="localHot-title">
					本地热门
				</div>
				<div class="localHot-body">
					<div class="localHot-bodybox">
						<span class="hotSecnic" v-for="scenic in scenics" @click="openVue(scenic.id)">
							{{scenic.name}}
						</span>
					</div>
				</div>
			</div>
			<div class="content-searchHistor">
				<div class="searchHistor-title border-b">
					历史搜索
				</div>
				<div class="searchHistor-body border-b">
					<div class="searchHistor-bodylist">
						<div class="bodylist-item" v-for="searchHistory in searchHistorys" @click = 'searchValue(searchHistory.value)'>
							<span class="item-name"><i class="icon iconfont icon-shijian icon-size"></i>{{searchHistory.value}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="content-clearRecord" @click = "removeRecord">
				<div class="clearRecord-body" v-bind:style="{ color: eliminateColor }">
					<i class="icon iconfont icon-Eliminate eliminate-icon"></i>&nbsp;{{hostoryRecod}}
				</div>
			</div>
		</div>
	</div>
	</div>
</template>

<script>
	import InfiniteLoading from 'vue-infinite-loading'
  	import Lib from 'assets/js/Lib.js'
  	import rest from 'assets/js/rest.js'
  	import _ from 'underscore'
  	import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
	export default {
		data() {
			return {
				scenics:[],
				msg: '',
				palces:[],
				scenicses:[],
				guides:[],
				searchHistorys:plus.storage.getItem("history")?eval("("+plus.storage.getItem("history")+")"):[],
				eliminateColor:' ',
				hostoryRecod:' ',
				//控制是否显示或者隐藏的
				block: true,
				//控制是否显示或者隐藏的
				display: true,
			}
		},
		created: function() {
		},
		activated: function() {
			this.init();
			this.historyRecod();
		},
		mounted(){
      this.$refs.header.style.cssText = 'top:'+tkStatusBarState.height()+'px'
    },

		methods:{
			init:function(){
				this.block = true;
				var self = this;
				new rest().get('scenicFindByRegion').parameter({
					code:this.$route.query.citycode,
					sort:'-weight',
					'per-page':8,
				}).success(function(data){
					self.scenics = data;
				}).run();
			},
			historyRecod:function(){
				var self = this;
				var searchHistory = JSON.stringify(this.searchHistorys);
				if(searchHistory == '[]'){
					self.hostoryRecod='暂无搜索记录';
					self.eliminateColor = '#333';
				}
				else{
					self.hostoryRecod='清除搜索记录';
					self.eliminateColor = '#00bcd6';
				}
			},
			removeRecord(){
				this.searchHistorys = [];
				plus.storage.setItem("history",JSON.stringify(this.searchHistorys));
				this.historyRecod();
			},
			openVue:function(id){
				this.$router.push({
					path: "/guidelist",
					query: {
						id: id
					}
				});
			},
			searchValue(opt){
			  this.msg = opt;
			  this.search();
			},
			//取消按钮特效
			cancel() {
				if(this.msg !='') {
					this.block = true;
					this.msg = '';
				} else {
					this.$router.go(-1)
				}
			},
			search:function(){
				var self = this;
				self.block = false;
				var keyword = self.msg;
				this.saveTest(keyword);
				this.keywordPalce(keyword);
				this.keywordSecnic(keyword);
				this.keywordDidao(keyword);
				this.historyRecod();
				this.keyword="";
			},
			saveTest:function(keyword){
				this.searchHistorys.push({
					value:keyword
				});
				plus.storage.setItem("history",JSON.stringify(this.searchHistorys));
			},  
			keywordPalce:function(keyword){
				var self = this;
				new rest().get('regions').parameter({
					name: keyword,
				}).success(function(data){
					if(JSON.stringify(data) == '[]'){
						self.display = false;
					}
					else{
						self.palces = data;
						self.display = true;
					}
					
				}).run()
			},
			keywordSecnic:function(keyword){
				var self = this;
				new rest().get('searchScenic').parameter({
					name: keyword,
				}).success(function(data){
					if(JSON.stringify(data) == '[]'){
						self.display = false;
					}
					else{
						self.scenicses = data;
						self.display = true;
					}
				}).run()
			},
			keywordDidao:function(keyword){
				var self = this;
				new rest().get('searchService').parameter({
					username: keyword,
				}).success(function(data){
					if(JSON.stringify(data) == '[]'){
						self.display = false;
					}
					else{
						self.guides = data;
						self.display = true;
					}
				}).run()
			},
			keywordSearch:function(keyword){
				new rest().get('searchService').parameter({
					username: keyword,
				}).success(function(data){
					if(JSON.stringify(data) == '[]'){
						self.display = false;
					}
					else{
						self.guides = data;
						self.display = true;
					}
				}).run()
			},
		},
		mixins: [Lib.P]
	}
</script>
<style scoped>
	header a:hover{
		color: #00bcd6;
	}
	.nosearch{
		background-color: #FFFFFF;
		padding: 0 10px;
	}
	.dingwei-tub {
		position: absolute;
		font-size: 21px;
		left: 14px;
		top: 2px;
	}
	.eliminate-icon{
		font-size: 13px;
	}
	/*本地热门*/
	.content-localHot{
		padding-bottom: 15px;
	}
	.localHot-title{
		height: 29px;
		line-height: 39px;
		color: #999;
		font-size: 14px;
	}
	.hotSecnic{
		border: 1px solid #d7d7d7;
		display: inline-block;
		margin-right: 4px;
		margin-top: 10px;
		padding: 3px 10px 1px 10px;
		border-radius: 2px;
		color: #666;
		font-size: 14px;
	}
	.hotSecnic:hover{
		color: #fff;
		border: 1px solid #00bcd6;
		background-color: #00bcd6;
	}
	/*历史搜索*/
	.searchHistor-title{
		height: 39px;
		line-height: 39px;
		color: #888;
		font-size: 14px;
	}
	.bodylist-item{
		padding: 7.5px 0;
		font-size: 14px;
		color: #333;
	}
	/*清除历史记录*/
	.clearRecord-body{
		height: 39px;
		line-height: 39px;
		text-align: center;
		font-size: 14px;
	}
	.nojilu{ 
		color: #333;
	}
	.youjilu{
		color: #4ed4e4;
	}
	.icon-size{
		font-size: 18px;
	}
	/*搜索結果*/
	/*.search-result{
		display: none;
	}*/
	.content-didao .mui-navigate-right:after, .mui-push-right:after {
	    margin-top: 9px;
	    right: 10px;
	    content: '\E583';
	}
	.content-place .mui-navigate-right:after, .mui-push-right:after {
	    margin-top: 8px;
	    right: 10px;
	    content: '\E583';
	}
	.content-secnic .mui-navigate-right:after, .mui-push-right:after {
	    margin-top: 11px;
	    right: 10px;
	    content: '\E583';
	}
	
	.mui-table-view-cell:after {
	    left: 0px;
	    right: 0px;
	    background-color: #D7D7D7;
	}
	/*搜索結果——旅遊地*/
	.place-title{
		padding: 13px 10px;
		font-size: 14px;
		color: #999;
		background-color: #f8f8f8;
	}
	/*搜索結果——景点*/
	.secnic-title{
		padding: 13px 10px;
		font-size: 14px;
		color: #888;
		background-color: #f8f8f8;
	}
	/*搜索結果——地导*/
	.didao-title{
		padding: 13px 10px;
		font-size: 14px;
		color: #888;
		background-color: #f8f8f8;
	}
	.didao-img{
		border-radius: 50%;
	}
</style>