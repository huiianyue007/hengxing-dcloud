import C from 'assets/js/conf'
import M from 'assets/js/common'
import _ from 'underscore'
import U from 'assets/js/mui'
var Rxports = {
  methods: {
    setPageTitle: function() {
      document.title = this.pageTitle ? this.pageTitle : C.appname
    },
    image:function(url,options){
      return M.image(url,options)
    },
    back:function(){
      this.$router.go(-1);
    },
    toast:function(str){
//    if(window.plus.nativeUI){
//      plus.nativeUI.toast(str);
//    }else{
//      alert(str);
//    }
			mui.toast(str);
  },
    isEmpty:function(opt){
      return _.isEmpty(opt);
    },
  },
  watch: {
    pageTitle: function() {
      this.setPageTitle();
    }
  },
  created: function() {
    this.setPageTitle()
  },
  activated:function(){
    for(let i=0,j=this.$children.length;i<j;i++){
      M.callHook(this.$children[i],'activated')
    }
    this.setPageTitle()
  },
  deactivated:function(){
    for(let i=0,j=this.$children.length;i<j;i++){
      M.callHook(this.$children[i],'deactivated')
    }
  }
}

module.exports = Rxports