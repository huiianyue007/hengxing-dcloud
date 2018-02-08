import Vue from 'vue'
import C from 'assets/js/common'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    complete:false,
    indexPage:'home',
    city:{
      ready:false,
      code:null,
      name:null
    },
    user:{
      isGuest:false,
      data:null
    },
    serviceInfo:null,
    serviceItem:null,
    serviceScenics:null,
    setServiceList:null,
    applicants:[],
    auth:null,
    isReady:false,
  },
  getters: {
    city: (state) => {
      if(state.city.ready == false){
        return null
      }else{
        if(state.city.code == null || state.city.name == null){
          return {
            code:130102,
            name:'石家庄市',
            ready:true
          }
        }else{
          return state.city
        }
      }
    }
  },
  mutations: {
    setIndexPage(state,auth){
      state.indexPage = auth;
    },
    setAuth(state,auth){
      state.auth = auth
    },
    setCity(state,opt){
      state.city = opt;
    },
    setServiceList(state,opt){
      state.setServiceList = opt;
    },
    setServiceScenics(state,data){
      state.serviceScenics = data;
    },
    setApplicants(state,data){
      state.applicants = data;
    },
    completed(state){
      state.complete = true;
    },
    ready(state){
      state.isReady = true
    },
    setServiceInfo(state,data){
      state.serviceInfo = data;
    },
    setServiceItem(state,data){
      state.serviceItem = data;
    },
    setUser(state,data){
      state.user.data = data;
      if(data){
        state.user.isGuest=true;
      }else{
        state.user.isGuest=false;
      }
      
    }
  },
  actions: {
    setAuth(context,auth){
      auth['endtime'] = Math.floor(Date.now() / 1000)+auth['expires_in']
      context.commit('setAuth',auth)
      C.setItem('auth',auth)
    },
    removeAuth(context){
      context.commit('setAuth',null)
      C.removeItem('auth')
    },
    removeUser(context){
      context.commit('setUser',null)
    }
  },
})
module.exports = store