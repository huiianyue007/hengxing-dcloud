<template>
	<div class="box">
		<header class="mui-bar mui-bar-nav" ref = 'header'>
			<a class="mui-icon mui-icon-left-nav mui-pull-left" @click='back'></a>
			<h1 class="mui-title" v-if="item">{{item.type_name}}</h1>
			<a class="mui-pull-right save" @click="deleteItem" v-if="item&&item.service_direction">删除</a>
		</header>
		<div class="mui-content" v-if="item">
			<div class="mui-content-padded mui-input-group" >
				<div class="mui-input-row">
					<label>{{item.type_name}}</label><input type="text" v-model="message" placeholder="请输入昵称" />
				</div>
			</div>
			<div :class="['mui-btn','mui-btn-block','save_back',message&&message!=item.service_direction?'orange':'grey']" @click="saveBack">保存</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	import {tkStatusBarState} from 'vue-tk/dist/components/tkStatusBar'
	export default {
		name: 'updateServiceItem',
		data() {
			return {
				pageTitle: '编辑服务',
				title: "",
				message: '',
				index: "",
			}
		},
		activated: function() {
			this.init();
		},
		mounted() {
        this.$refs.header.style.cssText = 'top:' + tkStatusBarState.height() + 'px'
      },
		methods: {
			init: function() {
				this.message = this.item && this.item.service_direction ? this.item.service_direction :'';
				this.index = this.serviceItem.indexOf(this.item);
			},
			saveBack: function() {
				var self = this;
				if(this.message==this.item.service_direction){
					this.toast("请输入服务内容");
					return false;
				}
				if(this.item && this.item.service_direction) {
					new rest().put("deleteSever", this.item.id).data({
						service_direction: this.message
					}).parameter({
						version: "head"
					}).auth(true).success(function(data) {
						self.serviceItem[self.index] = data;
						self.$store.commit("setServiceItem", self.serviceItem);
						self.$router.go(-1);
					}).error(function(er) {
						self.toast(er.message);
					}).run();
				} else if(this.item && this.item.id) {
					new rest().post("deleteSever").data({
						type_id: this.item.id,
						service_direction: this.message
					}).parameter({
						version: "head"
					}).auth(true).success(function(data) {
						self.serviceItem.push(data);
						self.$store.commit("setServiceItem", self.serviceItem);
						self.$router.go(-1);
					}).error(function(er) {
						self.toast(er[0].message);
						self.$router.go(-1);
					}).run();
				}
			},
			deleteItem: function() {
				var self = this;
				new rest().delete("deleteSever", this.item.id).parameter({
					version: 'head'
				}).auth(true).success(function(data) {
					self.serviceItem.splice(self.index, 1);
					self.$store.commit("setServiceItem", self.serviceItem);
					self.$router.go(-1);
				}).error(function(er) {
					self.toast(er.message);
				}).run()
			}
		},
		computed: {
			item: function() {
				return this.$route.query.item;
			},
			serviceItem: function() {
				var serviceItem = this.$store.state.serviceItem;
				if(serviceItem){
				  return serviceItem 
				}else{
				  return [];
				}
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
	.mui-content-padded{margin:10px 0px;}
	.mui-input-group .mui-input-row {
	  padding:0 10px;
		height: auto;
	}
	
	.mui-input-row label {
		line-height: 40px;
		padding: 0
	}
	
	.mui-input-row input {
		height: 40px;
		line-height: 2em;
	}
	.save_back{color:#fff;border:none;position: fixed;bottom:0;margin-bottom: 0;}
	.grey{
		background:#ececec;
	}
	.orange{
		background:#F0AD4E
	}
</style>