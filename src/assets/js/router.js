import Vue from 'vue'
import mui from 'assets/js/mui.js'
import VueRouter from 'vue-router'
import common from 'assets/js/common.js'

const historyList = [];

//基底框架
import Index from 'components/index/Index.vue'
import contact from 'components/index/user.vue'
import article from 'components/home/article.vue'
import version from 'components/user/Version.vue'
import portrait from 'components/user/portrait.vue'
import serach from 'components/serach/serach.vue'
import CityList from 'components/citylist/CityList.vue'
import GuideList from 'components/guide/GuideList.vue'
import GuideXq from 'components/guide/GuideXq.vue'
import CommentList from 'components/comment/CommentList.vue'
import evaluate from 'components/comment/evaluate.vue'
import ScenicXq from 'components/scenic/ScenicXq.vue'
import scenicLists from 'components/scenic/scenicLists.vue'
import login from 'components/login/login.vue'
import loginxinxi from 'components/login/loginXinxi.vue'
import agreement from 'components/login/agreement.vue'
import noData from 'components/component/noData.vue'
import myself from 'components/myself/MyselfMessage.vue'
import setUserInfo from 'components/myself/setUserInfo.vue'
import CollectList from 'components/collect/myCollection.vue'
import applyService from 'components/BecomeBusiness/applyService.vue'
import busBack from 'components/BecomeBusiness/busBack.vue'
import myService from 'components/service/myService.vue'
import sendService from 'components/service/sendService.vue'
import updateService from 'components/service/updateService.vue'
import updateServiceItem from 'components/service/updateServiceItem.vue'
import updateServiceScenics from 'components/service/updateServiceScenics.vue'
import serviceDetails from 'components/service/serviceDetails.vue'
import myAccount from 'components/myAccount/myAccount.vue'
import addCard from 'components/myAccount/addCard.vue'
import setCard from 'components/myAccount/setCard.vue'
import applyCash from 'components/myAccount/applyCash.vue'
import applyRecord from 'components/myAccount/applyRecord.vue'
import selectBank from 'components/myAccount/selectBank.vue'
import setPassWord from 'components/myAccount/setPassWord.vue'
import applyOver from 'components/myAccount/applyOver.vue'
import myOrder from 'components/order/buyerOrder.vue'
import buyerOrderXq from 'components/order/buyerOrderxq.vue'
import firmorder from 'components/order/firmorder.vue'
import orderManage from 'components/order/sellerOrderxq.vue'
import setOrder from 'components/order/sellerOrder.vue'
import setInsurance from 'components/insurance/setinsurance.vue'
import addApplicant from 'components/insurance/addapplicant.vue'
import applicantInfor from 'components/insurance/applicantinfor.vue'
import paySuccess from 'components/payment/paysuccess.vue'
import payment from 'components/payment/payment.vue'
import payResults from 'components/payment/payResults.vue'
/*const Index = resolve => require(['components/index/Index.vue'], resolve)
const contact = resolve => require(['components/index/user.vue'], resolve)
  //首页
const article = resolve => require(['components/home/article.vue'], resolve)

//个人中心
const version = resolve => require(['components/user/Version.vue'], resolve)
const portrait = resolve => require(['components/user/portrait.vue'], resolve)
  //搜索页面
const serach = resolve => require(['components/serach/serach.vue'], resolve)

//城市列表
const CityList = resolve => require(['components/citylist/CityList.vue'], resolve)

//服务
const GuideList = resolve => require(['components/guide/GuideList.vue'], resolve)
const GuideXq = resolve => require(['components/guide/GuideXq.vue'], resolve)

//评价
const CommentList = resolve => require(['components/comment/CommentList.vue'], resolve)
const evaluate = resolve => require(['components/comment/evaluate.vue'], resolve)

//景点
const ScenicXq = resolve => require(['components/scenic/ScenicXq.vue'], resolve)
const scenicLists = resolve => require(['components/scenic/scenicLists.vue'], resolve)

//登录
const login = resolve => require(['components/login/login.vue'], resolve)
const loginxinxi = resolve => require(['components/login/loginXinxi.vue'], resolve)
const agreement = resolve => require(['components/login/agreement.vue'], resolve)

//公用vue
const noData = resolve => require(['components/component/noData.vue'], resolve)

//个人信息
const myself = resolve => require(['components/myself/MyselfMessage.vue'], resolve)
const setUserInfo = resolve => require(['components/myself/setUserInfo.vue'], resolve)

//收藏列表
const CollectList = resolve => require(['components/collect/myCollection.vue'], resolve)

//商家后台
const applyService = resolve => require(['components/BecomeBusiness/applyService.vue'], resolve)
const busBack = resolve => require(['components/BecomeBusiness/busBack.vue'], resolve)

//商家后台服务
const myService = resolve => require(['components/service/myService.vue'], resolve)
const sendService = resolve => require(['components/service/sendService.vue'], resolve)
const updateService = resolve => require(['components/service/updateService.vue'], resolve)
const updateServiceItem = resolve => require(['components/service/updateServiceItem.vue'], resolve)
const updateServiceScenics = resolve => require(['components/service/updateServiceScenics.vue'], resolve)
const serviceDetails = resolve => require(['components/service/serviceDetails.vue'], resolve)

//商家后台账户
const myAccount = resolve => require(['components/myAccount/myAccount.vue'], resolve)
const addCard = resolve => require(['components/myAccount/addCard.vue'], resolve)
const setCard = resolve => require(['components/myAccount/setCard.vue'], resolve)
const applyCash = resolve => require(['components/myAccount/applyCash.vue'], resolve)
const applyRecord = resolve => require(['components/myAccount/applyRecord.vue'], resolve)
const selectBank = resolve => require(['components/myAccount/selectBank.vue'], resolve)
const setPassWord = resolve => require(['components/myAccount/setPassWord.vue'], resolve)
const applyOver = resolve => require(['components/myAccount/applyOver.vue'], resolve)

//订单部分
const myOrder = resolve => require(['components/order/buyerOrder.vue'], resolve)
const buyerOrderXq = resolve => require(['components/order/buyerOrderxq.vue'], resolve)
const firmorder = resolve => require(['components/order/firmorder.vue'], resolve)
const orderManage = resolve => require(['components/order/sellerOrderxq.vue'], resolve)
const setOrder = resolve => require(['components/order/sellerOrder.vue'], resolve)

//设置保险部分
const setInsurance = resolve => require(['components/insurance/setinsurance.vue'], resolve)
const addApplicant = resolve => require(['components/insurance/addapplicant.vue'], resolve)
const applicantInfor = resolve => require(['components/insurance/applicantinfor.vue'], resolve)

//订单支付
const paySuccess = resolve => require(['components/payment/paysuccess.vue'], resolve)
const payment = resolve => require(['components/payment/payment.vue'], resolve)
const payResults = resolve => require(['components/payment/payResults.vue'], resolve)*/

import _ from 'underscore'

Vue.use(VueRouter)

const routes = [
  //基地框架
  {
    path: '/',
    component: Index
  }, {
    path: '/contact',
    component: contact
  },

  //首页
  {
    path: '/article',
    component: article
  },

  //搜索页面
  {
    path: '/serach',
    component: serach
  },

  //城市列表
  {
    path: '/citylist',
    component: CityList
  },

  //公用页面
  {
    path: '/noData',
    component: noData
  },

  //个人中心
  {
    path: '/version',
    component: version
  }, {
    path: '/portrait',
    component: portrait
  },

  //服务
  {
    path: '/guidelist',
    component: GuideList
  }, {
    path: '/guidexq',
    component: GuideXq
  },

  //景点
  {
    path: '/scenicxq',
    component: ScenicXq
  }, {
    path: '/sceniclists',
    component: scenicLists
  },

  //评价
  {
    path: '/commentlist',
    component: CommentList
  }, {
    path: '/evaluate',
    component: evaluate
  },

  //登录
  {
    path: '/login',
    component: login
  }, {
    path: '/loginxinxi',
    component: loginxinxi
  }, {
    path: '/agreement',
    component: agreement
  },

  //个人信息
  {
    path: '/myself',
    component: myself
  }, {
    path: '/setUserInfo',
    component: setUserInfo
  },

  //收藏
  {
    path: '/collectlist',
    component: CollectList
  },

  ///商家后台
  {
    path: '/applyService',
    component: applyService
  }, {
    path: '/busBack',
    component: busBack
  },

  //商家后台服务
  {
    path: '/myService',
    component: myService
  }, {
    path: '/sendService',
    component: sendService
  }, {
    path: '/updateService',
    component: updateService
  }, {
    path: '/updateServiceItem',
    component: updateServiceItem
  }, {
    path: '/updateServiceScenics',
    component: updateServiceScenics
  }, {
    path: '/serviceDetails',
    component: serviceDetails
  },

  //商家后台账户
  {
    path: '/myAccount',
    component: myAccount
  }, {
    path: '/addCard',
    component: addCard
  }, {
    path: '/setCard',
    component: setCard
  }, {
    path: '/applyCash',
    component: applyCash
  }, {
    path: '/applyRecord',
    component: applyRecord
  }, {
    path: '/selectBank',
    component: selectBank
  }, {
    path: '/setPassWord',
    component: setPassWord
  }, {
    path: '/apply_over',
    component: applyOver
  },

  //订单部分
  {
    path: '/myOrder',
    component: myOrder
  }, {
    path: '/buyerOrderXq',
    component: buyerOrderXq
  }, {
    path: '/firmorder',
    component: firmorder
  }, {
    path: '/order_manage',
    component: orderManage
  }, {
    path: '/set_order',
    component: setOrder
  },

  //支付
  {
    path: '/paySuccess',
    component: paySuccess
  }, {
    path: '/payment',
    component: payment
  }, {
    path: '/payResults',
    component: payResults
  },

  //设置保险
  {
    path: '/setInsurance',
    component: setInsurance
  }, {
    path: '/addApplicant',
    component: addApplicant
  }, {
    path: '/applicantInfor',
    component: applicantInfor
  },

]

const router = new VueRouter({
  routes
})

function buildLocation(location) {
  return {
    location: location
  }
}

function isLocationEqual(location1, location2) {
  if(location1.path != location2.path || !common.isEqual(location1.query, location2.query)) {
    return false
  }
  return true
}

router.oldReplace = router.replace;
router.replace = function(location) {
  historyList.pop();
  historyList.push(buildLocation(location));
  return this.oldReplace(location);
}

router.oldPush = router.push;
router.push = function(location) {
  historyList.push(buildLocation(location));
  return this.oldPush(location);
}

router.beforeEach((to, from, next) => {
  var length = historyList.length
    //打开首页时
  if(length == 0) {
    historyList.push(buildLocation(to))
    next()
    return
  }

  var backStep = 0;
  var isHistoryBack = false;

  //判断最后一条历史是否跟目标一致，如不一致则代表用户后退了页面
  var last = _.last(historyList)
  if(!isLocationEqual(last.location, to)) {
    isHistoryBack = true;
  }
  //遍历历史记录，跳过最后一条
  for(var i = 0; i < length - 1; i++) {
    //如果当前页面在历史记录中，在记录中添加当前的页面滚动位置
    if(isLocationEqual(historyList[i].location, from)) {
      var top = window.pageYOffset || document.documentElement.scrollTop
      historyList[i].top = top
    }
    //如果目标页面在历史记录中，删掉目标页面之后的历史记录，并计算目标页面距当前页面的步数
    if(isLocationEqual(historyList[i].location, to)) {
      backStep = i - length + 2;
      for(var j = 0; j < -backStep + 1; j++) {
        historyList.pop()
      }
      break
    }
  }
  if(!isHistoryBack && backStep != 0) {
    router.go(backStep)
  } else {
    next()
  }
})

Vue.directive('keep-scroll-position', {
  inserted: function(el) {
    var location = _.last(historyList)
    if(location.top) {
      document.body.scrollTop = document.documentElement.scrollTop = location.top
    } else {
      document.body.scrollTop = document.documentElement.scrollTop = 0
    }
  }
})
const comeBack = function() {
  mui.back();
}
mui.plusReady(function() {
  if(mui.os.android) {
    var closeApp = false
    mui.back = function() {
      if(historyList.length == 1) {
        console.log(closeApp)
        if(closeApp) {
          plus.runtime.quit()
        } else {
          mui.toast('再按一次退出应用')
          closeApp = true
          setTimeout(function() {
            closeApp = false
          }, 2000)
        }
      } else {
        router.go(-1);
      }
    }
    var timer = setInterval(function() {
      plus.key.removeEventListener('backbutton', comeBack)
      plus.key.addEventListener('backbutton', comeBack, false)
    }, 1000)
  }
})
module.exports = router