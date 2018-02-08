<template>
	<div class="box">
		<header-title :content="info"></header-title>
		<div class="mui-content">
			<ul id="list" class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell" v-for=" (item,key) in userInfo" v-if="data" @click="openVue(item.title,key)">
					<a class="mui-navigate-right mui-text-center">
						<span class="field-title">{{key}}</span><span class="content">{{item.content}}</span>
					</a>
				</li>
			</ul>
		</div>
		<div class="list_content">
			<ul id="list" class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell" v-for=" (item,key) in addressInfo" v-if="addressInfo" @click="openVue(item.title,key)">
					<a :class="[item.title=='phone'?'':'mui-navigate-right','mui-text-center']">
						<span class="field-title">{{key}}</span><span class="content">{{item.content}}</span>
					</a>
				</li>
			</ul>
		</div>
		<div class="list_content">
			<ul id="list" class="mui-table-view mui-table-view-chevron">
				<li class="mui-table-view-cell" v-for=" (item,key) in profile" v-if="profile" @click="openVue(item.title,key)">
					<a class="mui-navigate-right mui-text-center">
						<span class="field-title">{{key}}</span><span class="content">{{item.content}}</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js';
	export default {
		name: 'MyselfMessage',
		data() {
			return {
				info: "个人信息"
			}
		},
		watch: {
			data: function() {
				var data = this.$store.state.user.data;
				if(this.data) {
					this.userInfo = {
						"昵称": {
							title: "username",
							content: this.data.username
						},
						"性别": {
							title: "sex",
							content: this.data.sex =='0'? "男" : "女"
						},
						"生日": {
							title: "birthday",
							content: this.data.birthday
						},
					};
					this.addressInfo = {
						"电话": {
							title: "phone",
							content: this.data.phone
						},
						"城市": {
							title: "region_code",
							content: this.data.region ? this.data.region.full_name : "选择城市"
						}
					};
					this.profile = {
						"简介": {
							title: "profile",
							content: this.data.profile
						}
					};
				}
			}
		},
		computed: {
			data: function() {
				return this.$store.state.user.data;
			},
			userInfo: function() {
				if(this.data) {
					var data = {
						"昵称": {
							title: "username",
							content: this.data.username
						},
						"性别": {
							title: "sex",
							content: this.data.sex=="0" ? "男" : "女"
						},
						"生日": {
							title: "birthday",
							content: this.data.birthday
						},
					};
					return data;
				}
			},
			addressInfo: function() {
				if(this.data) {
					var data = {
						"电话": {
							title: "phone",
							content: this.data.phone
						},
						"城市": {
							title: "region_code",
							content: this.data.region ? this.data.region.full_name: "选择城市"
						}
					};
					return data;
				}
			},
			profile: function() {
				if(this.data) {
					var data = {
						"简介": {
							title: "profile",
							content: this.data.profile
						}
					};
					return data;
				}
			}
		},
		methods: {
			openVue: function(str, key) {
				if(str=="phone"){
					return false;
				}
				this.$router.push({
					path: '/setUserInfo',
					query: {
						setInfo: key,
						title: str,
						id:this.data.id
					}
				});
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	body {
		background: #f8f8f8;
	}
	
	.list_content {
		margin-top: 15px;
	}
	
	.mui-table-view .field-title {
		color: #999;
		width: 15%;
		min-width: 2rem;
		float: left;
	}
	
	.mui-table-view .content {
		text-align: center;
		max-width: 70%;
		display: block;
		margin-left: auto;
		margin-right: auto;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}
</style>