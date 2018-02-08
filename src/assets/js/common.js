import _ from 'underscore'
import conf from 'assets/js/conf.js'

var Rxports = {
  storeReady: function(func) {
    var store = require('assets/js/store.js')
    if(store.state.isReady) {
      func()
    } else {
      window.addEventListener('storeReady', func)
    }
  },
  image: function(uri, options) {
    var url = conf.imageHost + uri;
    if(_.isEmpty(options)) {
      return url;
    }
    if(typeof options.ext == 'undefined') {
      var urlArray = url.split('.');
      options.ext = urlArray[urlArray.length - 1];
    }
    url += '@';
    var optionsStr = [];
    for(var i in options) {
      if(i == 'width') {
        optionsStr.push(options[i] + 'w');
      } else if(i == 'height') {
        optionsStr.push(options[i] + 'h');
      } else if(i == 'type') {
        if(options[i] == 'cut') {
          optionsStr.push('1c');
          optionsStr.push('1e');
        }
      } else if(i == 'force') {
        if(options[i] == false) {
          optionsStr.push('1l');
        }
      }
    }
    if(optionsStr.length > 0) {
      url += optionsStr.join('_');
    }
    url += '.' + options.ext;
    return url;
  },
  /**
   * 拷贝自vue核心库，触发一个vm实例的生命周期钩子
   * @param {Object} vm vue实例
   * @param {String} hook 钩子名称
   */
  callHook:function(vm,hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
      for (let i = 0, j = handlers.length; i < j; i++) {
        handlers[i].call(vm)
      }
    }
    vm.$emit('hook:' + hook)
  },
  /**
   * 清除html中的标签，返回其中的纯文本字符串
   * @param {String} html 要处理的字符串
   * @return {String} 处理后的纯文本字符串
   */
  strip: function(html) {
    let regex = /(<([^>]+)>)/ig
    let text = html.replace(regex, "");
    return text || "";
  },
  /**
   * 从一个多维对象中搜索目标值
   * @param {Object} obj 要搜索的对象
   * @param {String} key 要搜索的对象key值连接的字符串，例如：key1.key2.key3
   * @return 搜索到的内容
   */
  searchObj:function(obj,key){
    let keyArray = key.split('.')
    if(keyArray.length == 1){
      return obj[key]
    }else{
      let firstKey = keyArray.pop()
      let rt = obj[firstKey]
      if(_.isObject(rt)){
        return this.searchObj(rt,keyArray.join('.'))
      }else{
        return rt
      }
    }
  },
  setItem:function(name,value,expires){
    var obj = {
      'app':conf.appname,
      'value':value,
      'expires':expires?Math.floor(Date.now() / 1000)+expires:0
    }
    plus.storage.setItem(name+'-'+conf.appname,JSON.stringify(obj))
  },
  getItem:function(name){
    var obj = plus.storage.getItem(name+'-'+conf.appname)
    if(obj !== null){
      obj = JSON.parse(obj)
      if(obj.expires === 0 || obj.expires > Date.now() / 1000){
        return obj.value
      }
    }
    return null
  },
  removeItem:function(name){
    plus.storage.removeItem(name+'-'+conf.appname)
  },
  isEqual:function(obj1,obj2,strict){
    var _ = require('underscore')
    if(_.isEqual(obj1,obj2)){
      return true
    }
    if(strict){
      return false
    }else{
      if(_.isObject(obj1) && _.isObject(obj2)){
        for (var i in obj1){
          if(_.isNumber(obj1[i]) || _.isNumber(obj2[i])){
            if(obj1[i] != obj2[i]){
              return false
            }
          }else{
            if(!this.isEqual(obj1[i],obj2[i])){
              return false
            }
          }
        }
      }else{
        if(obj1 != obj2){
          return false
        }
      }
      
      return true
    }
    
  }
}

module.exports = Rxports