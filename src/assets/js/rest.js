import conf from 'assets/js/conf.js'
import Promise from 'es6-promise'
import _ from 'underscore'
import common from 'assets/js/common.js'
import store from 'assets/js/store.js'

var r = function() {
  this.init();
}

r.prototype.constructor = r;

r.prototype.init = function() {
  this.option = {
    data: {},
    headers: {
      'Content-Type': 'application/json',
    },
  };

  this.resulttHandle = {
    success: this.defaultSuccessHandle,
    error: this.defaultErrorHandle,
    401: this.refreshTokenHandle
  }

  this.urlPath = null
  this.expires = 0
  this.promiseList = []
  this.useCache = false
  this.cacheId = ''
  this.urlParams = {}
  this.refresh = false
  this.request = null
}

r.prototype.rulers = conf.restRoute

r.prototype.apiHost = conf.apiHost

r.prototype.defaultSuccessHandle = function(data) {
  console.log('rest执行默认成功方法',data)
}

r.prototype.defaultErrorHandle = function(data,request) {
  var msg = this.getErrorMsg(data,request)
  if(conf.debug) {
    alert(msg);
  } else {
    mui.toast(msg)
  }
}

r.prototype.getErrorMsg = function(data,request){
  if(typeof data == 'string'){
    return data
  }else if(!_.isEmpty(data.message)){
    return data.message
  }else if(request.status == 422){
    return data[0]['message']
  }else{
    return '未知错误'
  }
}

r.prototype.get = function(url, parameter) {
  this.option.url = this.urlPath = this.generateUrl(url, parameter);
  this.option.method = 'GET';
  return this;
}

r.prototype.post = function(url, parameter) {
  this.option.url = this.urlPath = this.generateUrl(url, parameter);
  this.option.method = 'POST';
  return this;
}

r.prototype.put = function(url, parameter) {
  this.option.url = this.urlPath = this.generateUrl(url, parameter);
  this.option.method = 'PUT';
  return this;
}

r.prototype.delete = function(url, parameter) {
  this.option.url = this.urlPath = this.generateUrl(url, parameter);
  this.option.method = 'DELETE';
  return this;
}

r.prototype.generateUrl = function(name, parameter) {
  if(this.rulers[name]) {
    var url = this.apiHost + this.rulers[name];
    if(typeof parameter === 'object') {
      for(i in parameter) {
        url = url.replace('{'+i+'}', parameter[i]);
      }
    } else if(typeof parameter === 'string' || typeof parameter === 'number') {
      url = url.replace(/\{\w+\}/, parameter);
    }
    url = url.replace(/\{\w+\}/g, '');
    return url.replace(/\/*$/, '');
  } else {
    return name;
  }
}

r.prototype.data = function(values) {
  this.option.data = values;
  return this;
}

r.prototype.header = function(self) {
  this.option.headers = _.extend(this.option.headers, self);
  return this;
}

r.prototype.case = function(name, func) {
  if(typeof name == 'object'){
    var self = this
    _.each(name,function(val){
      self.resulttHandle[val]=func
    })
  }else{
    this.resulttHandle[name]=func
  }
  
  return this
}

r.prototype.success = function(func) {
  return this.case('success', func)
}

r.prototype.error = function(func) {
  return this.case('error', func)
}

r.prototype.end = function(func) {
  return this.case('end', func)
}

r.prototype.parameter = function(params) {
  this.urlParams = _.extend(this.urlParams,params)
  return this
}

r.prototype.linkUrlWithParams = function() {
  if(this.urlParams != null) {
    this.option.url = this.urlPath + '?'

    for(var i in this.urlParams) {
      this.option.url += i + '=' + this.urlParams[i] + '&'
    }
    this.option.url = this.option.url.slice(0,-1)
  }
  return this
}

r.prototype.auth = function(token){
    if(typeof token === 'string'){
        this.header({'Authorization':'Bearer '+token});
    }else if(token === true){
        this.promiseList.push(this.setAuth());
    }
    return this;
}

r.prototype.setAuth = function(){
  var auth = this.getAuth()
  var self = this
  return this.authHandle(auth).then(function(authToken){
    self.header({
      'Authorization':'Bearer '+authToken
    })
    return Promise.resolve('set token success')
  })
}

r.prototype.getAuth = function() {
  return store.state.auth
}

r.prototype.saveAuth = function(auth){
  store.dispatch('setAuth',auth)
}

r.prototype.removeAuth = function(){
  store.dispatch('removeAuth')
}

r.prototype.authHandle = function(auth){
  if(auth == null){
      this.login()
      return Promise.reject('auth缓存为空')
  }else{
      if(typeof auth.endtime != 'undefined' && auth.endtime <= Math.floor(Date.now() / 1000)){
          return this.refreshToken(auth['refresh_token'])
      }else{
          return Promise.resolve(auth.access_token)
      }
  }
}

r.prototype.refreshToken = function(refresh_token){
    var $r = new r();
    return $r.post('token').case('success',function(data,err){
        $r.saveAuth(data);
        return Promise.resolve(data.access_token);
    }).case([400,401,'error'],function(data,code){
        return Promise.reject('刷新token失败');
    }).data({
        client_id:conf.client_id,
        client_secret:conf.client_secret,
        'refresh_token':refresh_token,
        grant_type:'refresh_token',
    }).run()
}

r.prototype.login = function(data) {
  //TODO 完成login方法
}

r.prototype.cache = function(expires){
  if(typeof expires == 'undefined'){
    expires = 24*3600
  }
  this.expires = expires
  this.useCache = true
  return this
}

r.prototype.convertRequest = function(request){
  if(request.cache){
    return new cacheRequest(request)
  }else{
    return {
      readyState:request.readyState,
      responseText:request.responseText,
      responseType:request.responseType,
      responseURL:request.responseURL,
      status:request.status,
      statusText:request.statusText,
      cache:true,
      allHeader:request.getAllResponseHeaders(),
      header:this.converRequestHeader(request.getAllResponseHeaders())
    }
  }
}

r.prototype.converRequestHeader = function(headerString){
  var lineArray = headerString.match(/[^\r\n]+/g)
  var header = {}
  _.each(lineArray,function(lineString){
    var arr = lineString.split(':')
    var name = arr.shift()
    header[name]=arr.join(':')
  })
  return header
}

r.prototype.run = function() {
  var self = this
  
  this.linkUrlWithParams()
  
  if(this.promiseList.length == 0){
    return self.ajax()
  }else{
    return Promise.all(this.promiseList).then(function() {
      return self.ajax();
    }, function(error) {
      return new Promise(function(resolve,reject){
        self.runResultHandle(null,resolve,reject,error)
      })
    })
  }
}
r.prototype.ajax = function() {
  var self = this;
  this.ajaxBeginTime = Date.now() / 1000
  return new Promise(function(resolve, reject) {
    if(self.useCache && self.option.method == 'GET'){
      var sha1 = require('sha1')
      var name = sha1(JSON.stringify(self.option))
      var cacheRequestData = common.getItem(name)
      if(cacheRequestData != null){
        var request = self.convertRequest(cacheRequestData)
        self.runResultHandle(request,resolve,reject)
        return
      }
    }
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4){
        self.runResultHandle(xhr,resolve,reject)
      }
    }
    xhr.open( self.option.method, self.option.url )
    for(name in self.option.headers){
        xhr.setRequestHeader(name,self.option.headers[name])
    }
    xhr.send(JSON.stringify(self.option.data))
  })
}

r.prototype.checkError = function(code) {
  if(code >= 200 && code < 300) {
    return true;
  } else {
    return false;
  }
}

r.prototype.runResultHandle = function(request,resolve,reject,error){
  if(this.resulttHandle['end']){
    this.resulttHandle['end'].call(this,data,request)
  }
  
  if(request){
    this.request = request
    var isSuccess = this.checkError(request.status)
    
    if(isSuccess && this.useCache && this.option.method === 'GET'){
      var requestCache = this.convertRequest(request)
      var sha1 = require('sha1')
      var name = sha1(JSON.stringify(this.option))
      common.setItem(name,requestCache,this.expires)
    }else if(isSuccess && this.option.method != 'GET'){
      var optionCopy = _.clone(this.option)
      optionCopy.method = 'GET'
      var sha1 = require('sha1')
      var name = sha1(JSON.stringify(optionCopy))
      common.removeItem(name)
    }
    
    try{
      var data = JSON.parse(request.responseText)
    }catch(e){
      var data = {}
    }
    if(this.resulttHandle[request.status]){
      var rt = this.resulttHandle[request.status].call(this,data,request)
    }else if(isSuccess){
      var rt = this.resulttHandle['success'].call(this,data,request)
    }else{
      var rt = this.resulttHandle['error'].call(this,data,request)
    }
  }else{
    var rt = this.resulttHandle['error'].call(this,error,request)
  }
  
  if(conf.debug) {
    console.group('rest已完成')
    var restData = {
      '请求地址':this.option.url,
      '请求类型':this.option.method,
      '请求数据':this.option.data,
      '用户token':this.option.headers.Authorization,
      
    }
    if(request){
      restData = _.extend(restData,{
        '使用缓存':request.cache?true:false,
        '响应状态':request.status
      })
      if(isSuccess){
        restData['ajax耗时'] = Date.now()/1000 - this.ajaxBeginTime + ' 秒'
      }else{
        restData['错误信息'] = this.getErrorMsg(data,request)
      }
    }
    if(error){
      restData['错误信息'] = error
    }
    for(var i in restData){
      if(!_.isEmpty(restData[i])){
        console.log(i,restData[i])
      }
    }
    console.log('返回数据',JSON.parse(JSON.stringify(data)))
    console.log('request对象',request)
    console.groupEnd()
  }
  if(typeof rt == 'object' && typeof rt.then === 'function') {
    rt.then(function(data){
      resolve(data)
    },function(err){
      reject(err)
    })
  } else {
    if(isSuccess) {
      resolve(request);
    } else {
      reject(request);
    }
  }
}

r.prototype.getNextPage = function(vm){
  if(this.request == null || !this.checkError(this.request.status)){
    console.warn('rest未完成初始请求，无法执行方法 getNextPage')
    if(typeof vm != 'undefined'){
      vm.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
    }
    return
  }
  
  if(this.checkComplete()){
    if(typeof vm != 'undefined'){
      vm.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
    }
    return
  }
  
  var page = this.urlParams.page ? this.urlParams.page+1 : 2
  this.parameter({page:page})
  
  if(typeof vm != 'undefined'){
    this.run().then(function(){
      if(this.checkComplete()){
        vm.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
      }else{
        vm.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
      }
    },function(){
      if(this.checkComplete()){
        vm.$refs.infiniteLoading.$emit('$InfiniteLoading:complete')
      }else{
        vm.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded')
      }
    })
  }else{
    this.run()
  }
  
  
}

r.prototype.checkComplete = function(){
  var totalPage = this.request.getResponseHeader('X-Pagination-Page-Count')
  var page = this.urlParams.page ? this.urlParams.page:1
  try{
    var data = JSON.parse(this.request.responseText)
  }catch(e){
    var data = {}
  }
  
  return (_.isEmpty(data) || (totalPage != null && totalPage <= page))
}

var cacheRequest = function(option){
  var self = this
  _.each(option,function(val,name){
    self[name]=val
  })
}

cacheRequest.prototype.getResponseHeader = function(name){
  if(typeof this.header[name] != 'undefined'){
    return this.header[name]
  }
  return null
}

cacheRequest.prototype.getAllResponseHeaders = function(){
  return this.allHeader
}

module.exports = r
