<template>
	<div class="box">
		<header-title content="取现记录"></header-title>
		<div class="mui-content">
			<no-data v-if="flag" content="没有更多提现记录"></no-data>
			<ul class="mui-table-view mui-table-view-chevron" v-if="!flag">
				<li class="mui-table-view-cell" v-for="item in applyRecord">
					<a class="mui-navigate-right">
						<p><span class="field-title card_title">提现至{{item.bankCard.bank.name}}{{item.bankCard.bank_card}}</span><span class="mui-pull-right" :class="{'nopass':item.status=='2','pass':item.status=='1'}">{{item.amount}}</span></p>
						<p><span class="field-title">{{item.updated_at}}</span><span class="content mui-pull-right">{{item.status|getStatus}}</span></p>
					</a>
				</li>
			</ul>
			<infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
				<p slot ='no-results' class="dn"></p>
			</infinite-loading>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import noData from 'components/component/noData.vue'
	import InfiniteLoading from 'vue-infinite-loading';
	import rest from 'assets/js/rest.js'

	export default {
		name: 'applyRecord',
		data() {
			return {
				pageTitle: '取现记录',
				applyRecord: [],
				flag: false,
			}
		},
		filters: {
			getStatus: function(opt) {
				var data = {
					"0": "正在审核中",
					"1": '审核已通过',
					"2": "请求被驳回"
				}
				return data[opt];
			}
		},
		activated: function() {
			this.init();
		},
		methods: {
			init: function() {
				this.flag = false;
				this.applyRecord = [];
				this.rest = null;
				this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
			},
			onInfinite() {
				var self = this;
				if(!this.rest) {
					this.rest = new rest();
					this.rest.get("encashmentRecords").parameter({
						expand: 'bankCard.bank',
						sort: '-created_at',
					}).auth(true).success(function(data) {
						if(data.length) {
							self.applyRecord = data.filter(function(item){
								item.updated_at = self.getTime(item.updated_at * 1000);
								item.bankCard.bank_card = self.getString(item.bankCard.bank_card);
								return item;
							})
							if(data.length < 20) {
								self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
							} else {
								self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
							}
						} else {
							self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
							self.flag = true;
						}
					}).run();
				} else {
					this.rest.getNextPage(self);
				}
			},
			getTime: function(str) {
				var d = new Date(str);
				var year = d.getFullYear();
				var month = d.getMonth();
				var date = d.getDate();
				var hour = d.getHours() >= 10 ? d.getHours() : '0' + d.getHours();
				var mm = d.getMinutes() >= 10 ? d.getMinutes() : '0' + d.getMinutes();
				year + "-" + month + "-" + date + " " + hour + ":" + mm;
				return year + "-" + month + "-" + date + " " + hour + ":" + mm;
			},
			getString: function(opt) {
				return opt.substring(opt.length - 4, opt.length);
			}
		},
		components: {
			noData,
			InfiniteLoading
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.dn{display:none;}
	.mui-table-view-cell {
		height: auto;
	}
	
	.card_title {
		color: #333;
	}
	
	.pass {
		color: #D0F6D4
	}
	
	.nopass {
		color: #E26461;
	}
</style>