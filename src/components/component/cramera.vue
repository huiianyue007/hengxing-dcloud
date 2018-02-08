<template>
	<div class="shadow" @click="shadow">
		<div class="con">
			<div class="c_title">选择图片</div>
			<div class="c_con" @click.stop="camera" v-if = 'status'>相机选择</div>
			<div class="c_con" @click.stop="gallery">相册选择</div>
		</div>
	</div>
</template>

<script>
	import Lib from 'assets/js/Lib.js'
	export default {
		name: 'version',
		data() {
			return {
				pageTitle: '版本信息',
				version: '',
				status:true
			}
		},
		created(){
			if(!Lib.U.os.plus){
				this.status = false;
			}else{
				this.status = true
			}
		},
		methods: {
			camera() {
				var self = this;
				var cmr = plus.camera.getCamera();
				var res = cmr.supportedImageResolutions[0];
				var fmt = cmr.supportedImageFormats[0];
				cmr.captureImage(function(path) {
						plus.gallery.save(path);
						self.getImg(path);
					},
					function(error) {
						self.toast("Capture image failed: " + error.message);
					}, {
						resolution: res,
						format: fmt
					}
				);
			},
			shadow() {
				this.$emit("clickCancel");
			},
			getImg: function(opt) {
				var self = this;
				var server = "http://api.gpcph.com/v1/public/upload";
				var wt = plus.nativeUI.showWaiting();
				var task = plus.uploader.createUpload(server, {
						method: "POST"
					},
					function(t, status) { //上传完成
						if(status == 200) {
							var data = JSON.parse(t.responseText);
							self.$emit("getImg", data.uri);
							wt.close();
						} else {
							this.toast("上传失败：" + status);
							wt.close();
						}
					}
				);
				task.addFile(opt, {
					key: "file"
				});
				task.start();

			},
			gallery() {
				var self = this;
				plus.gallery.pick(function(path) {
					self.getImg(path);
				}, function(e) {
					self.toast("取消选择图片");
				}, {
					filter: "image",
					multiple: false,
					system: false
				});
			}
		},
		mixins: [Lib.P]
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.shadow {
		position: fixed;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		top: 0;
		left: 0;
		z-index: 11;
	}
	
	.shadow .con {
		width: 70%;
		margin: 0 auto;
		background: #fff;
		position: absolute;
		top: 35%;
		left: 15%;
		color: #3CBAE4;
		border-radius: 5px;
		text-align: center;
		padding: 0;
		line-height: 4em;
		font-size: 16px!important;
		box-sizing: border-box;
	}
	
	.c_title {
		color: #999;
	}
	
	.c_con {
		border-top: 1px solid #ddd;
	}
</style>