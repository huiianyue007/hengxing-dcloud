<template>
	<div class="mui-content">
			<header-title content = '评论列表'></header-title>
			<div class="content-body">
					<div class="pingjia-list border-b" v-for="comment in comments">
							<div class="pingjia-xinxi">
									<img :src="comment.commentpor==null?'static/image/default-image/avatar.png':image(comment.commentpor,{width:90,height:90,type:'cut'})" class="touxiang">
									<span class="nicheng">{{comment.username}}</span>
									<span class="fenshu">{{comment.score}}分</span>
									<span class="pingjiashijian">{{comment.time}}</span>
							</div>
							<div class="pingjia-word">
									{{comment.content}}
							</div>
					</div>
			</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	export default {
		data() {
				return {
					pageTitle: '第三页',
					comments: [],
					imageHost: Lib.C.imageHost,
				}
		},
		created: function() {
				var self = this;
				var fuwuid = this.$route.query.fuwuid;
				new rest().get('commentsList').parameter({
						service_id: fuwuid,
						expand: 'user',
//							sort:'-created_at',
						'per-page': 2,
				}).success(function(data) {
						for(var i = 0; i < data.length; i++) {
								self.comments.push({
										username: data[i].user.username,
										commentpor: data[i].user.portrait,
										score: data[i].score,
										content: data[i].content,
										time: userDate(data[i].created_at),
								});
						}
						//把时间戳格式转换成时间格式
						function userDate(uData) {
								var myDate = new Date(uData * 1000);
								var year = myDate.getFullYear();
								var month = myDate.getMonth() + 1;
								var day = myDate.getDate();
								return year + '-' + month + '-' + day;
						}
				}).run();
		},
		methods :{
			colseBack:function(){
				this.$router.go(-1);
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
		.content-body {
			margin-top: 54px;
		}
		
		.pingjia-list {
			background-color: #fff;
			margin-top: 10px;
		}
		
		.pingjia-xinxi {
			padding-top: 8px;
		}
		
		.pingjia-xinxi .touxiang {
			width: 30px;
			height: 30px;
			border-radius: 50%;
			vertical-align: middle;
		}
		
		.pingjia-xinxi {
			margin-top: 10px;
			vertical-align: middle;
		}
		
		.pingjia-xinxi .nicheng {
			padding-left: 4px;
			color: #333;
			font-size: 12px;
		}
		
		.pingjia-xinxi .fenshu {
			padding-left: 3px;
			color: #00bcd4;
			font-size: 12px;
		}
		
		.pingjia-xinxi .pingjiashijian {
			color: #999;
			font-size: 12px;
			float: right;
			padding-top: 5px;
		}
		
		.pingjia-list {
			border-bottom: 1px solid #f8f8f8;
			padding: 0 10px;
		}
		
		.pingjia-word {
			color: #333;
			font-size: 12px;
			margin-top: 7px;
			margin-bottom: 11px;
		}
</style>