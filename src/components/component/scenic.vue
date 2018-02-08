<template>
	<div class="device">
		<div class="swiper-container">
			<ul class="swiper-wrapper">
				<li class="swiper-slide" v-for="item in content">
					<span class="tag">{{item.scenic_name?item.scenic_name:item.scenic.name}}</span>
					<img :src="image(item.bigpic?item.bigpic:item.scenic.bigpic,{width:288,height:200,type:'cut'})" @load="init()">
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	import 'assets/css/idangerous.swiper.css'
	import Swiper from 'swiper'
	export default {
		activated() {
				this.init();
			},
			created(){
				this.init();
			},
			methods: {
				init() {
					var mySwiper = new Swiper('.swiper-container', {
						slideActiveClass: 'slide-active',
						setWrapperSize: true,
						centeredSlides: true,
						slidesPerView: 3,
						watchActiveIndex: true
					})
				}
			},
			props: ["content"],
			mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.swiper-wrapper,
	.swiper-slide {
		height: 100px;
		margin: 0;
		padding: 0;
	}
	
	.swiper-slide {
		padding: 12px;
		position: relative;
		box-sizing: border-box;
	}
	
	.slide-active {
		-webkit-transform: scale(1.2);
		transition: all linear .2s;
	}
	
	.tag {
		position: absolute;
		top: 50%;
		left: 0;
		display: block;
		width: 100%;
		text-align: center;
		color: #fff;
		font-size: 12px;
		margin-top: -10px;
		padding: 0 24px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		box-sizing: border-box;
	}
</style>