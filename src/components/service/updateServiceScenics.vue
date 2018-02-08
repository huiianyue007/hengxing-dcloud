<template>
  <div class="box">
    <header-title content="详情描述"></header-title>
    <div class="mui-content">
      <div class="mui-content-padded">
        <div :class="['mui-input-row','mui-search',flag?'mui-text-left':'mui-text-center']">
          <input type="text" :class="['mui-input-clear',flag?'mui-text-left':'mui-text-center']" v-model="message" @focusin="focusIn" @keyup.enter="submit" @focusout="focusOut" placeholder="搜索景点" />
          <span :class="['iconfont','search',flag?'':'width']">&#xe60f;</span>
        </div>
      </div>
      <ul class="mui-table-view mui-grid-view mui-grid-9">
        <li class='mui-table-view-cell mui-media mui-col-xs-6 mui-col-sm-6 op_li' v-for="(item,index) in serviceScenicAdr" @click='checked(item,index)'>
          <div class='mui-media-body'><img :src="image(item.scenic?item.scenic.bigpic:item.bigpic,{width:864,height:600,type:'cut'})" /></div>
          <div class="img_con"><span class='op_name'>{{item.scenic?item.scenic_name:item.name}}</span>
            <span class="iconfont checked" v-if="item.scenic">&#xe61b;</span>
          </div>
        </li>
        <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
          <p slot='no-results'>没有景点</p>
          <p slot='no-more'>加载完毕</p>
        </infinite-loading>
      </ul>
    </div>
  </div>

</template>

<script>
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js'
  import InfiniteLoading from 'vue-infinite-loading'
  export default {
    name: 'updateServiceScenic',
    data() {
      return {
        pageTitle: '详情描述',
        serviceScenicAdr: [],
        message: '',
        flag: false,
        code: ""
      }
    },
    components: {
      InfiniteLoading
    },
    activated: function() {
      this.message = "";
      this.init();
    },

    methods: {
      init: function() {
        this.serviceScenicAdr = [];
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset');
        this.rest = null;
        this.code = this.$route.query.code;
      },
      focusIn: function() {
        this.flag = true;
      },
      focusOut: function() {
        this.flag = false;
      },
      submit: function() {
        this.init();
      },
      onInfinite: function() {
        if(this.code == '') {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          return
        }
        var self = this;
        if(!this.message) {
          if(this.rest == null) {
            this.rest = new rest();
            this.rest.get("scenicFindByRegion").parameter({
              code: this.code,
            }).success(function(data) {
              self.compared(self.serviceScenics, data);
              self.serviceScenicAdr = self.serviceScenicAdr.concat(data);
              if(data.length >= 20) {
                self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
              } else {
                self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
              }
            }).run();
          } else {
            this.rest.getNextPage(self);
          }
        } else {
          if(this.rest == null) {
            this.rest = new rest();
            this.rest.get("searchScenic").parameter({
              name: this.message,
            }).success(function(data) {
              if(data.length > 0) {
                self.compared(self.serviceScenics, data);
                self.serviceScenicAdr = self.serviceScenicAdr.concat(data);
                if(data.length >= 20) {
                  self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                } else {
                  self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                }
              } else {
                self.toast("找不到景点");
              }
            }).run();
          } else {
            this.rest.getNextPage(self);
          }
        }
      },
      compared: function(obj, opt) {
        for(var i = 0; i < opt.length; i++) {
          for(var j = 0; j < obj.length; j++) {
            if(opt[i].id == obj[j].scenic_id) {
              opt[i] = obj[j];
            }
          }
        }
      },
      checked: function(opt, index) {
        var self = this;
        if(opt.scenic) {
          new rest().delete("serviceScenicsId", opt.id).auth(true).success(function(data) {
            self.getScenics(opt, index);
          }).error(function(er) {
            self.toast(er.message);
          }).run();
        } else {
          new rest().post("serviceScenics").auth(true).data({
            service_id: self.serviceId,
            scenic_id: opt.id
          }).success(function(data) {
            opt = data;
            self.$set(self.serviceScenicAdr, index, opt);
            var ar = self.serviceScenics;
            ar.push(data);
            self.$store.commit("setServiceScenics", ar);
          }).error(function(er) {
            self.toast(er.message);
          }).run();
        }
      },
      getScenics: function(opt, i) {
        var index = this.serviceScenics.indexOf(opt);
        this.serviceScenics.splice(index, 1);
        opt = opt.scenic;
        this.$set(this.serviceScenicAdr, i, opt);
        this.$store.commit("setServiceScenics", this.serviceScenics);
      }
    },
    watch: {
      serviceScenics: function() {
        this.serviceScenics = this.$store.state.serviceScenics;
      }
    },
    computed: {
      serviceScenics: function() {
        return this.$store.state.serviceScenics;
      },
      serviceId: function() {
        var data = this.$store.state.serviceInfo;
        if(data) {
          return data.id;
        }
      }
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .box {
    height: 100%;
  }
  
  .save {
    line-height: 44px;
    display: block;
    padding: 0 .5em;
    box-sizing: border-box;
  }
  
  .save_back {
    position: fixed;
    bottom: -10px;
    border: none;
    color: #F0AD4E;
    background: #f8f8f8;
    font-size: 20px;
    letter-spacing: .5em;
  }
  
  .mui-content {
    margin-bottom: 60px;
  }
  
  .mui-search input[type=text] {
    margin: 0;
    font-size: 14px;
    border: 1px solid #D7D7D7;
    border-radius: 30px;
    background-color: #fff;
    box-sizing: border-box;
    height: 34px;
    padding-left: 30px;
  }
  
  .mui-grid-view.mui-grid-9 {
    background: #f8f8f8;
    border: none;
    padding: 0 5px;
    margin-top: -5px
  }
  
  .mui-grid-view.mui-grid-9 .mui-table-view-cell {
    border: none;
    height: auto;
    padding: 5px;
  }
  
  .mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-body {
    margin: 0;
    height: auto;
  }
  
  .img_con {
    width: 100%;
    position: relative;
    line-height: 2em;
  }
  
  .op_name {
    width: 60%;
    margin: 0 auto;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
  
  .img_con .checked {
    position: absolute;
    top: 0;
    right: 10px;
    line-height: 2em;
    color: #00D060;
  }
  
  .search {
    position: absolute;
    top: 0px;
    left: 0;
    display: block;
    width: 34px;
    height: 34px;
    text-align: center;
    color: #999;
    line-height: 37px;
  }
  
  .width {
    left: 50%;
    margin-left: -3em;
    text-align: center;
  }
</style>