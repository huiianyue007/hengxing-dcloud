<template>
	<div class="mui-content">
		<div id='list' class="mui-indexed-list">
			<div class="mui-indexed-list-search mui-input-row mui-search mui-bar mui-bar-nav mui-col-xs-12 positon-relitive">
				<span class="mui-icon mui-icon-search dingwei-tub"></span>
				<div class="mui-input-row mui-search mui-col-xs-10 mui-pull-left">
					<input type="search" class="mui-input-clear mui-indexed-list-search-input yuanjiao" @click="searIn" @input="search" placeholder="搜索城市" v-model="msg">
				</div>
				<a class="mui-col-xs-2 search-cancle mui-pull-right" @click="cancel">取消</a>
			</div>

			<div class="mui-indexed-list-bar" v-show="block">
				<a>A</a>
				<a>B</a>
				<a>C</a>
				<a>D</a>
				<a>E</a>
				<a>F</a>
				<a>G</a>
				<a>H</a>
				<a>I</a>
				<a>J</a>
				<a>K</a>
				<a>L</a>
				<a>M</a>
				<a>N</a>
				<a>O</a>
				<a>P</a>
				<a>Q</a>
				<a>R</a>
				<a>S</a>
				<a>T</a>
				<a>U</a>
				<a>V</a>
				<a>W</a>
				<a>X</a>
				<a>Y</a>
				<a>Z</a>
			</div>
			<div class="mui-indexed-list-alert"></div>
			<div class="mui-indexed-list-inner">
				<div class="mui-indexed-list-empty-alert">没有数据</div>
				<ul class="mui-table-view" id="li_sea" v-if="!block">
					<li v-for="item in searCity" class="mui-table-view-cell" @click="closeWin({name:item.name,code:item.code})" v-if="!display">{{item.name}} ({{item.full_name}})</li>
					<li class="mui-table-view-cell text-center" v-if="display">没有匹配的结果</li>
				</ul>
				<ul class="mui-table-view" id="li_con" v-if="block">
					<li class="mui-table-view-divider mui-indexed-list-group">当前定位</li>
					<li class="mui-table-view-cell mui-indexed-list-item" @click="closeWin({name:localCity.name,code:localCity.code})">{{localCity.province}} {{localCity.name}}</li>
					<li class="mui-table-view-divider mui-indexed-list-group">热门城市</li>
					<li class="mui-table-view-cell mui-indexed-list-item">
						<div class="mui-content">
							<span class="mui-btn" v-for="item in hotCity" @click="closeWin({name:item.name,code:item.code})">{{item.name}}</span>
						</div>
					</li>
					<li v-for="item in city" v-bind:data-group="[item.code?'':item]" v-bind:data-value="[item.code?item.acronym:'']" v-bind:data-tag="[item.code?item.acronym:'']" v-bind:class='[item.code?"mui-table-view-cell mui-indexed-list-item":"mui-table-view-divider mui-indexed-list-group"]' @click="closeWin({name:item.name,code:item.code})">{{item.name?item.name:item}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
	import 'assets/css/icon/iconfont.css';
	import 'assets/css/mui.indexedlist.css';
	import Lib from 'assets/js/Lib.js';
	import 'assets/js/mui.indexedlist.js';
	import rest from 'assets/js/rest.js';
	import _ from 'underscore'
	import citylistII from 'assets/js/citylistII.js'
	export default {
		data() {
				return {
					//热门城市
					hotCity: [],
					//城市列表
					city: [],
					//搜索出来的城市
					searCity: [],
					//title
					pageTitle: '城市列表',
					//搜索的value
					msg: '',
					//控制是否显示或者隐藏的
					block: true,
					//定位的城市
					localCity: {
						name: '',
						code: '',
						province: '',
					},
					citydata: [],
					//控制是否显示或者隐藏的
					display: false,
				}
			},
			created(){
			  this.localCity = this.$store.state.city;
			},
			activated: function() {
				this.init();
				this.CityList();
			},
			methods: {
				init: function() {
					var self = this;
					//获取所有城市
//					new rest().get('regions').parameter({
//						page: 1,
//						is_city: 1,
//						sort: 'pinyin',
//						'per-page': 5000
//					}).success(function(data) {
//						alert(JSON.stringify(data));
//						console.log(data);
//						if(!_.isEqual(self.citydata, data)) {
//							self.citydata = self.citydata.concat(data)
//							self.CityList(data);
//						}
//					}).run();
					//获取热门城市
					new rest().get('regions').parameter({
						page: 1,
						is_city: 1,
						sort: 'pinyin',
						is_hot:1,
					}).success(function(data) {
						if(!_.isEqual(self.hotCity, data)) {
							self.hotCity=self.hotCity.concat(data)
						}
					}).run()
					//当前定位
				}, //将的到的城市循环放在下面
				CityList: function() {
					var data = citylistII;
					var self = this;
					var dLen = data.length;
					var c = 'A';
					var sc = '';
					var ec = '';
					for(var i = 0; i < dLen; i++) {
						if(i == 0) {
							self.city.push(c);
							self.city.push({
								code: data[0].code,
								name: data[0].name,
								acronym: data[0].acronym
							});
						} else {
							sc = data[i - 1].acronym.charAt(0);
							ec = data[i].acronym.charAt(0);
							if(ec == sc) {
								self.city.push({
									code: data[i].code,
									name: data[i].name,
									acronym: data[i].acronym
								});
							} else if(ec != sc) {
								c = ec.toUpperCase();
								self.city.push(c);
								self.city.push({
									code: data[i].code,
									name: data[i].name,
									acronym: data[i].acronym
								});
							}
						}
					}
					var list = document.getElementById('list');
					list.style.height = (document.body.scrollHeight + 'px')
					window.indexedList = new mui.IndexedList(list);
				},
				//点击城市需要改变vuex和打开某个页面
				closeWin(data) {
					this.$store.commit("setIndexPage", 'home');
					this.$store.commit("setCity", data);
					this.$router.go(-1);
				},
				//点击事件
				searIn() {
					this.block = false
				},
				//查询走的API
				search() {
					this.searCity = [];
					var self = this;
					var v = self.msg;
					new rest().get("https://api.gpcph.com/v1/regions").parameter({
						name: v,
						'per-page': 100,
					}).success(function(data) {
						if(data == '') {
							self.display = true;
						} else {
							self.searCity = data;
							self.display = false;
						}

					}).run()
				},
				//取消按钮特效
				cancel() {
					if(this.block == false) {
						this.block = true;
						this.msg = '';
					} else {
						this.$router.go(-1)
					}
				}
			},

			mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.positon-relitive {
		position: relative;
	}
	
	.dingwei-tub {
		position: absolute;
		font-size: 21px;
		left: 14px;
		top: 2px;
	}
	
	.yuanjiao {
		border-radius: 30px;
	}
	
	.mui-table-view-cell {
		height: auto;
	}
	
	.mui-content .mui-btn {
		margin-right: 2em;
	}
	
	.mui-content {
		background: transparent;
	}
	
	.text-center {
		text-align: center;
	}
</style>