<template>
	<div class="nodata">
		<div class="wushuju-img">
            <img src="static/image/default-image/no-content.png" class="img-pic">
        </div>
        <div class="wushuju-word">{{content}}</div>
	</div>
</template>
<script>
	import Lib from 'assets/js/Lib.js'
	export default {
		name: 'noData',
		data() {
			return {
				items: null,
			}
		},
		props: ['content'],
		mixins: [Lib.P]
	}
</script>
<style scoped>
	.nodata{
		background-color: #F8F8F8;
	}
	/*无数据显示*/
	.nodata{
		width: 100%;
		text-align: center;
		position: absolute;
		top: 50%;
		margin-top: -110px;
	}
	.img-pic{
		width: 150px;
		height: 150px;
	}
	.wushuju-word{
		margin-top: 42px;
		font-size: 15px;
		color: #999;
	}
</style>