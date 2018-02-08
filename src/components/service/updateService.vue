<template>
	<div class="box">
		<header-title :content = 'title' @clickme = 'save' btn = '保存'></header-title>
		<div class="mui-content">
			<div class="mui-input-row">
				<input type="text" placeholder="请输入标题" v-model="message" v-if="content=='title'" />
				<div v-if="content=='service_region'">
					<span class="mui-btn mui-btn-block btn_con" @click="openVue">{{message?message:'请选择地址'}}</span>
				</div>
			</div>
			<div v-if="content=='serviceItem'&&serviceItem">
				<p class="yi-save-p">以保存服务</p>
				<ul id="list" class="mui-table-view mui-table-view-chevron">
					<li class="mui-table-view-cell" v-for="item in serviceItem">
						<router-link :to="{path:'/updateServiceItem',query:{item:item}}" class="mui-navigate-right mui-text-left">
							<span class="field-title">{{item.type_name}}</span><span class="con">{{item.service_direction}}</span>
						</router-link>
					</li>
				</ul>
				<p class="yi-save-p">以保存服务</p>
				<div class="mui-content-padded diy">
					<span class="field-title mui-pull-left">
						自定义服务
					</span>
					<input type="text" v-model="message" class="input-text mui-pull-left" placeholder="服务名">

					<a @click="addItem" class="myslef-list-jiantou mui-pull-right">
						<span class="addthing">添加</span>
					</a>
					<div class="clear"></div>
				</div>
				<div class="mui-content-padded rm">
					<p class="field-title rm_title">国内热门</p>
					<div class="rm_con" v-if="hotService">
						<p class="rm_list" v-for="item in hotService">
							<span class="mui-btn rm_btn" :class="[item.is_hot==1?'blue':'grey',item.flag?'checked':'']" @click="checked(item,key)">{{item.name}}</span>
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from "assets/js/rest.js"
	import cityList from 'assets/js/cityList.js'
	import 'assets/js/mui.picker.min.js'
	import 'assets/css/mui.picker.min.css'
	export default {
		name: 'updateService',
		data() {
			return {
				pageTitle: '编辑服务',
				message: this.$route.query.con,
				content: this.$route.query.content,
				cityList: null,
				hotService: null
			}
		},
		activated: function() {
			this.init();
		},
		watch: {
			title: function() {
				this.message = this.$route.query.con;
				this.content = this.$route.query.content;
			},
			serviceItem: function() {
				this.serviceItem = this.$store.state.serviceItem;
			}
		},
		computed: {
			title: function() {
				return this.$route.query.title;
			},
			serviceItem: function() {
				var data = this.$store.state.serviceItem
				if(data) {
					return data;
				}
			}
		},
		methods: {
			init: function() {
				var self = this;
				if(this.content == 'serviceItem') {
					new rest().get("allServiceTypes").success(function(data) {
						data.forEach(function(item) {
							item.flag = false;
						})
						self.hotService = data;
					}).run();
				}
			},
			checked(opt, key) {
				if(opt.flag) {
					opt.flag = false;
				} else {
					opt.flag = true;
				}
				this.$router.push({
					path: '/updateServiceItem',
					query: {
						item: {
							id: opt.id,
							type_name: opt.name
						}
					}
				});
			},
			addItem: function() {
				var self = this;

				if(this.message && !(/\w+/g.test(this.message))) {
					new rest().get("findServiceType").parameter({
						name: this.message
					}).success(function(data) {
						self.$router.push({
							path: '/updateServiceItem',
							query: {
								item: {
									id: data.id,
									type_name: self.message
								}
							}
						});
					}).error(function(er) {
						self.addService()
					}).run();
				} else if(this.message) {
					this.toast("只能输入中文");
				} else {
					this.toast("请输入服务类型");
				}
			},
			addService: function() {
				var self = this;
				new rest().post("allServiceTypes").data({
					name: this.message
				}).success(function(data) {
					self.$router.push({
						path: '/updateServiceItem',
						query: {
							item: {
								id: data.id,
								type_name: self.message
							}
						}
					});
				}).run();
			},
			save: function() {
				var obj = {};
				var self = this;
				if(this.content == "title" || this.content == "service_region") {
					if(this.content == "service_region") {
						obj[this.content] = this.city
					} else {
						obj[this.content] = this.message;
					}
					new rest().put("serviceMain").parameter({
						expand: "service_item,service_scenic"
					}).auth(true).data(obj).success(function(data) {
						self.$store.commit("setServiceInfo", data);
					}).run();
				}
				this.$router.go(-1);
			},
			openVue: function() {
				this.getList();
			},
			getList(){
				var self = this;
				var cityPicker3 = new mui.PopPicker({
					layer: 3
				});
				
				cityPicker3.setData(cityList);
				cityPicker3.show(function(items) {
					if(items[2].value) {
						self.city = items[2].value;
						self.message = items[0].text + ' ' + items[1].text + ' ' + items[2].text;
					} else if(items[1].value) {
						self.city = items[1].value;
						self.message = items[0].text + ' ' + items[1].text
					} else {
						self.city = items[0].value;
						self.message = items[0].text;
					}
				});
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.save {
		line-height: 44px;
		display: block;
		padding: 0 .5em;
		box-sizing: border-box;
	}
	
	.mui-table-view-cell {
		height: auto;
		border-bottom: 1px solid #e7e7e7;
		padding: 0 10px;
	}
	
	.mui-table-view-cell:last-child {
		border: none;
	}
	
	.btn_con {
		width: 100%;
		float: none;
	}
	
	.mui-table-view-cell:after {
		display: none;
	}
	
	.mui-bar-nav {
		-webkit-box-shadow: none;
		box-shadow: none;
	}
	
	.mui-table-view-cell>a:not(.mui-btn) {
		margin: 0;
		line-height: 3em;
	}
	
	.field-title {
		font-size: 16px;
	}
	
	.rm_title {
		margin: 5px 5px 0 10px;
	}
	
	.rm {
		margin: 0;
		padding: 5px;
	}
	
	.con {
		position: absolute;
		width: 100%;
		display: block;
		text-align: center;
		left: 0;
		top: 0;
	}
	
	.myslef-list-jiantou {
		width: 20%;
	}
	
	.yi-save-p {
		line-height: 3em;
		border-top: 1px solid #e7e7e7;
		border-bottom: 1px solid #e7e7e7;
		font-size: 12px;
		padding: 0 10px;
		margin-bottom: 0;
		color: #333 ! important;
	}
	
	.diy {
		background: #fff;
		margin: 0;
		padding: 0 10px;
		line-height: 3em;
		border-bottom: 1px solid #e7e7e7;
	}
	
	.input-text {
		width: 35%;
		min-height: 0px;
		height: 2em;
		width: 40%;
		display: block;
		padding: 0px;
		line-height: 2em !important;
		text-align: center;
		margin-top: .3em;
		background-color: #f8f8f8;
		position: absolute;
		left: 50%;
		margin-left: -17%;
	}
	
	.addthing {
		display: block;
		width: 100%;
		text-align: center;
		line-height: 2em;
		background-color: #fea634;
		color: #fff;
		margin-top: .5em;
	}
	
	.rm_list {
		width: 25%;
		float: left;
		padding: 5px;
		box-sizing: border-box;
		margin-bottom: 0
	}
	
	.rm_btn {
		font-size: 14px;
		display: inline-block;
		width: 100%;
		height: 25px;
		line-height: 25px;
		padding: 0 10px;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.grey {
		border: 1px solid #707070;
		color: #707070;
	}
	
	.checked {
		background: #f8f8f8;
	}
	
	.blue {
		border: 1px solid #00BDD7;
		color: #00BDD7;
	}
</style>