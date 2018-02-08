<template>
	<div class="box">
		<header-title content="投保人" btn="确定" v-on:clickme="saveApplicat"></header-title>
		<div class="mui-content">
			<div class="mui-input-row border-b">
				<label class="labelbel">姓&emsp;&emsp;名</label>
		    	<input type="text" class="mui-input-clear" placeholder="请输入姓名" v-model="name">
		    </div>
		    <div class="mui-input-row border-b">
				<label class="labelbel">身份证号</label>
		    	<input type="text" class="mui-input-clear" placeholder="请输入身份证号码" v-model="idCardnumber">
		    </div>
		    <div class="mui-input-row border-b">
				<label class="labelbel">手&ensp;机&ensp;号</label>
		    	<input type="number" class="mui-input-clear" placeholder="请输入手机号码" v-model="phone">
		    </div>
		</div>
	</div>
</template>
<script>
	import Lib from 'assets/js/Lib.js'
	import rest from 'assets/js/rest.js'
	export default {
		name: 'paySuccess',
		data() {
			return {
				pageTitle: '添加投保人信息',
				idCardnumber:null,
				name:null,
				phone:null,
			}
		},
		activated: function() {
		},
		methods: {
			saveApplicat:function(){
				var self = this;
				if(this.name == null){
					this.toast("姓名不能为空")
				}else if(this.idCardnumber == null){
					this.toast("身份证号不能为空")
				}else if(this.idCardnumber == null){
					this.toast("手机号不能为空")
				}else{
					var ret = {
                        phone:this.phone,
                        real_name:this.name,
                        id_card_number:this.idCardnumber,
                    }
					new rest().post('insuranceBeneficiaries').data(ret).auth(true).success(function(data){
	        
	                    self.$router.go(-1);
	                }).run()
				}
			}
		},
		components: {
		},
		mixins: [Lib.P]
	}
</script>
<style scoped>
	.mui-input-row{
		background-color: #FFFFFF;
	}
	.labelbel{
		font-size: 14px;
		line-height: 26px;
		width: auto;
	}
	.mui-input-row label {
    	float: left;
    	width: 87px;
	}
	.mui-input-row label~input, .mui-input-row label~select, .mui-input-row label~textarea {
	    float: left;
	    width:auto;
	}
</style>
