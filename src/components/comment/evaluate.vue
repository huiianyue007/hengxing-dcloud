<template>
	<div class="box">
		<header-title content="我来评价"></header-title>
		<div class="mui-content">
			<div class="con df">
				<div class="title">
					评价星级
				</div>
				<div class="con_pre">
					<span :class="['iconfont',r=='1'?'or':'']" v-for = "(r,index) in ar" @click = "checked(index)"></span>
				</div>
				<div class="con_tip">
					{{score}}分
				</div>
			</div>
			<div class="con">
				<div class="c_title">评价内容</div>
				<textarea class="c_con" placeholder="请输入评价内容" v-model = "message">
					
				</textarea>
			</div>
			<div class="mui-content-padded footer">
				<div class="mui-btn mui-btn-block btn" @click = "submit">提交</div>
			</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import rest from "assets/js/rest.js"
	export default {
		name: 'evaluate',
		data() {
			return {
				pageTitle: '我来评价',
				ar:["0","0","0","0","0"],
				score:0,
				message:''
			}
		},
		methods:{
			checked(opt){
				var self = this;
				this.ar.forEach(function(item,key){
					if(key<=opt&&item=="0"){
						self.$set(self.ar,key,"1");
					}else if(key>=opt&&item=="1"){
						self.$set(self.ar,key,"0");
					}
				})
			},
			submit(){
				var self = this;
				new rest().post("commentsList").auth(true).data({
					score:this.score,
					content:this.message,
					order_id:this.orderId
				}).success(function(data){
					self.toast("评价添加成功");
					self.$router.replace("/myOrder");
				}).error(function(er){
					self.toast('评价添加失败');
				}).run();
			}
		},
		watch:{
			ar(){
				var self = this;
				self.score = 0;
				this.ar.forEach(function(item){
					if(item=="1"){
						self.score++
					}
				})
			}
		},
		computed:{
			orderId(){
				return this.$route.query.orderId;
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.con{width:100%;line-height:4em;font-size:14px;background:#fff;margin-top:10px;}
	.con.df{display:flex;padding:0 10px;}
	.con .title{flex-grow: 1;text-align:center;color:#333;}
	.con .con_pre{flex-grow:1;text-align:center;height:56px;}
	.con .con_pre .iconfont{font-size:16px;text-align:center;padding:0 3px;color:#ccc;display:inline-block;height:100%;}
	.con .con_pre .iconfont.or{color:#FF8D00;}
	.con .con_tip{flex-grow:8;text-align: left;color:#13C1D9;}
	.con .c_title{padding:0 10px;}
	.con .c_con{border-radius: 0;border:none;border-top:1px solid #f8f8f8;margin:0;padding:10px;line-height:2em;font-size:14px;height:90px;}
	.btn{background:#00BCD6;color:#fff;border:none;font-size:16px;}
	.footer{position:fixed;bottom:20px;width:100%;margin:0;padding:10px;}
</style>