import U from 'assets/js/mui.js'
import FastClick from 'fastclick'
import conf from 'assets/js/conf.js'
import store from 'assets/js/store.js'
import Vue from 'vue'
import headerTitle from "components/component/headerTitle.vue"
import cityList from 'assets/js/cityList.js'
//全局加载过滤器
import * as filters from 'assets/js/filter.js'
import 'assets/css/style.css'
import 'assets/js/flexible.js'
import Swiper from 'swiper'
for(let name in filters) {
	Vue.filter(name, filters[name])
}
//mui全局化
window.mui = U
mui.init()
if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}
	//为非dcloud平台虚拟plus对象
mui.plusReady(function() {
	if(conf.debug) {
		plus.device.setWakelock(true);
	}
})
if(typeof mui.os.plus == 'undefined') {
	var plusFaker = {
		geolocation: {
			getCurrentPosition: function() {
				navigator.geolocation.getCurrentPosition.apply(navigator.geolocation, arguments)
			}
		},
		storage: localStorage,
		nativeUI: {
			dom: document.createElement('div'),
			init() {
				this.dom.style.cssText = "width:44px;height:44px;position:absolute;top:50%;left:50%;margin:-15px;border-radius:20%;background:#333;z-index:999";
				var span = document.createElement('span');
				span.innerHTML = '&#xe668;';
				span.style.cssText = "font-size:20px;line-height:44px;display:block;width:100%;height:100%;text-align:center;transform-origin: center;color:#fff;animation: rotate infinite 5s;"
				span.className = 'iconfont';
				this.dom.appendChild(span);
				document.body.appendChild(this.dom)
			},
			showWaiting() {
				this.init();
				return this;
			},
			close() {
				if(this.dom) {
					document.body.removeChild(this.dom);
				}
			}
		},
		gallery: {
			pick(success, error, opt) {
				var input = document.createElement('input');
				input.type = 'file';
				document.body.appendChild(input);
				input.style.cssText = "display:none;"
				input.click();
				var value;
				input.onchange = function() {
					value = input.files;
					success(value);
					document.body.removeChild(input);
				}
			}
		},
		uploader: {
			method: '',
			server: '',
			data: null,
			xhr: new XMLHttpRequest(),
			formData: new FormData(),
			createUpload(server, opt, fn) {
				this.method = opt.method;
				this.server = server;
				this.data = opt;
				this.xhr.onreadystatechange = function() {
					if(this.readyState == '4') {
						fn(this, this.status);
					}
				}
				return this;
			},
			addFile(path, opt) {
				this.formData.append(opt.key, path[0]);
				this.xhr.open(this.method, this.server, true);
			},
			start() {
				this.xhr.send(this.formData);
			}
		}
	}
	window.plus = plusFaker
}

(function(store, window, mui) {
	var authInit = function() {
		var C = require('assets/js/common.js')
		var auth = C.getItem('auth')
		if(auth != null) {
			store.dispatch('setAuth', auth)
		} else {
			store.dispatch('removeAuth')
		}
	}
	var userInit = function() {
		var auth = store.state.auth
		if(auth != null) {
			var rest = require('assets/js/rest.js')
			new rest().parameter({
				expand: "region"
			}).get('self').auth(true).success(function(data) {
				store.commit('setUser', data)
			}).error(function() {
				store.commit('setAuth', null)
			}).run()
		}
	}
//
//	var cityInit = function() {
//		plus.geolocation.getCurrentPosition(function(position) {
//			getCityFromLocation(position)
//		}, function(e) {
//			if(window.plus.nativeUI) {
//				U.toast("定位失败");
//			}
//			store.commit("setCity", {
//			  code:'130102',
//			  name: '石家庄市',
//			  province:'河北省',
//				ready: true
//			})
//			getServiceList('130102')
//		}, {
//			geocode: true,
//			provider: 'amap'
//		})
//	}
//	var getCityFromLocation = function(location) {
//		var rest = require('assets/js/rest.js');
//		new rest().get("http://restapi.amap.com/v3/geocode/regeo").parameter({
//			key: '5ace4711bee045e7f6fe9dd4573d02a5',
//			location: location.coords.longitude + ',' + location.coords.latitude,
//		}).success(function(data) {
//			var code = data.regeocode.addressComponent.adcode;
//			if(code.length > 0) {
//				var city = {
//					code: data.regeocode.addressComponent.adcode,
//					name: data.regeocode.addressComponent.city,
//					province: data.regeocode.addressComponent.province,
//					ready: true
//				}
//				store.commit("setCity", city)
//				getServiceList(city.code);
//			}
//		}).error(function() {
//			store.commit("setCity", {
//				ready: true
//			})
//		}).run();
//	}
//	var getServiceList = function(citycode){
//		var rest = require('assets/js/rest.js')
//		new rest().get('searchService').parameter({
//			region_code: citycode,
//			'per-page': 40,
//		}).success(function(data) {
//			store.commit("setServiceList", data)
//		}).run()
//	}
	var init = function() {
		authInit()
		store.commit('ready')
		mui.trigger(window, 'storeReady')
		userInit()
//		cityInit()
	}

	if(mui.os.plus) {
		init()
	} else {
		init()
	}
})(store, window, U)
Vue.component("header-title", headerTitle);