<template>
	<div class="box">
		<header-title :content="setInfo" btn="保存" v-on:clickme="saveBack"></header-title>
		<div class="mui-content">

			<div class="mui-input-row">
				<input type="text" placeholder="请输入昵称" v-model="message" v-if="title=='username'" />
				<div v-if="title=='sex'">
					<span class="mui-btn mui-btn-block btn_con" @click="openVue('sex')">{{message=="0"?"男":"女"}}</span>
				</div>
				<div v-if="title=='birthday'">
					<span class="mui-btn mui-btn-block btn_con" @click="openVue('birthday')">{{message}}</span>
				</div>
				<div v-if="title=='region_code'">
					<span class="mui-btn mui-btn-block btn_con" @click="openVue('region_code')">{{city}}</span>
				</div>
				<textarea placeholder="请输入简介" v-model="message" v-if="title=='profile'" /></textarea>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from "assets/js/rest"
	import 'assets/js/mui.picker.min.js'
	import cityList from 'assets/js/cityList.js'
	import 'assets/css/mui.picker.min.css'
	export default {
		name: 'setUserInfo',
		data() {
			return {
				message: "",
				city: "",
				cityList: null
			}
		},
		created: function() {
			this.init();
		},
		activated: function() {
			this.init()
		},
		computed: {
			title: function() {
				return this.$route.query.title;
			},
			setInfo: function() {
				return this.$route.query.setInfo;
			},
		},
		methods: {
			init: function() {
				var self = this;
				if(this.title == "username") {
					this.message = this.$store.state.user.data.username;
				} else if(this.title == "sex") {
					this.message = this.$store.state.user.data.sex;
				} else if(this.title == "birthday") {
					this.message = this.$store.state.user.data.birthday;
				} else if(this.title == "region_code") {
					this.city = this.$store.state.user.data.region ? this.$store.state.user.data.region.full_name : "选择城市";
				} else if(this.title == "profile") {
					this.message = this.$store.state.user.data.profile;
				}
			},
			saveBack: function() {
				var self = this;
				var obj = {};
				obj[this.title] = this.message;
				if(self.title == "region_code") {
					new rest().put("users", this.$route.query.id).auth(true).data(obj).success(function(data) {
						self.$store.commit("setUser", data);
						new rest().get("self").parameter({
							expand: "region"
						}).auth(true).success(function(data) {
							self.$store.commit("setUser", data);
						}).run();
					}).run();
				} else {
					new rest().parameter({
						expand: "region"
					}).put("users", this.$route.query.id).auth(true).data(obj).success(function(data) {
						self.$store.commit("setUser", data);
					}).run();
				}
				this.$router.go(-1);
			},
			openVue: function(opt) {
				var self = this;
				if(opt == "sex") {
					var userPicker = new mui.PopPicker();
					userPicker.setData([{
						value: "0",
						text: "男"
					}, {
						value: "1",
						text: "女"
					}]);
					userPicker.show(function(items) {
						self.message = items[0].value;
					});
				} else if(opt == "birthday") {
					var dtpicker = new mui.DtPicker({
						type: "date", //设置日历初始视图模式
						beginDate: new Date(1960, 8, 25), //设置开始日期 
						endDate: new Date(2010, 4, 25), //设置结束日期 
						labels: ['Year', 'Mon', 'Day'], //设置默认标签区域提示语 
					})
					dtpicker.show(function(e) {
						self.message = e.text
					})
				} else if(opt == "region_code") {
					var cityPicker3 = new mui.PopPicker({
						layer: 3
					});
					cityPicker3.setData(cityList);
					cityPicker3.show(function(items) {
						if(items[2].value) {
							self.message = items[2].value;
							self.city = items[0].text + ' ' + items[1].text + ' ' + items[2].text;
						} else if(items[1].value) {
							self.message = items[1].value;
							self.city = items[0].text + ' ' + items[1].text
						} else {
							self.message = items[0].value;
							self.city = items[0].text;
						}
					});
				}
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.btn_con {
		width: 100%;
		float: none;
	}
</style>