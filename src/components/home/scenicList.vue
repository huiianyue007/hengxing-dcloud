<template>
  <ul class="mui-table-view mui-grid-view mui-grid-9">
    <li class='mui-table-view-cell mui-media mui-col-xs-6 mui-col-sm-6 op_li' v-for="(item,index) in adrAr" @click="openVue(item.id)">
      <span class='mui-icon mui-icon-location op_name'>{{item.name}}</span>
      <div class='mui-media-body'><img :src="image(item.bigpic,{width:864,height:600,type:'cut'})" @load = 'loaded(index)'/></div>
    </li>
    <infinite-loading :on-infinite="onInfinite" ref="infiniteLoading">
      <tk-loading slot='spinner' type='clip' v-if='complete' color = 'rgba(0,189,215,.5)'></tk-loading>
      <p slot="no-more">没有更多数据了</p>
      <p slot='no-results' class='dn'></p>
    </infinite-loading>
  </ul>
</template>

<script>
  import InfiniteLoading from 'vue-infinite-loading';
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js'
  import TkLoading from 'vue-tk/dist/components/tkLoading'
  export default {
    name: 'scenicList',
    data() {
      return {
        adrAr: [],
        rest: null,
      }
    },
    computed: {
      city: function() {
        return this.$store.getters.city;
      },
      complete() {
        return this.$store.state.complete;
      }
    },
    watch: {
      city: function() {
        this.init()
      }
    },
    methods: {
      loaded (index) {
        if(index==19 && !this.complete){
          this.$store.commit('completed')
        }
      },
      onInfinite() {
        if(this.city == null) {
          this.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
          return
        }
        var self = this
        if(this.rest == null) {
          this.rest = new rest()
          this.rest.get("scenicFindByRegion").parameter({
            code: this.city.code,
          }).success(function(data) {
            if(data.length >= 20) {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
            } else {
              self.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
            }
            self.adrAr = self.adrAr.concat(data)
          }).run();
        } else {
          this.rest.getNextPage(self)
        }
      },
      openVue: function(id) {
        this.$router.push({
          path: "/guidelist",
          query: {
            id: id
          }
        });
      },
      init: function() {
        this.adrAr = []
        this.rest = null
        this.$refs.infiniteLoading.$emit('$InfiniteLoading:reset')
      }
    },
    components: {
      InfiniteLoading,
      TkLoading
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .mui-content {
    padding: 0;
  }
  
  .mui-grid-view.mui-grid-9 {
    border: none;
    background: #f8f8f8;
    padding: 0 5px
  }
  
  .mui-grid-view.mui-grid-9 .mui-media {
    padding: 5px;
    height: auto;
    box-sizing: border-box;
  }
  
  .mui-grid-view.mui-grid-9 .mui-media .mui-icon {
    font-size: 16px;
  }
  
  .mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-body {
    height: auto;
    margin: 0px;
  }
  
  .mui-table-view.mui-grid-view .mui-table-view-cell .mui-media-body img {
    border-radius: 5px;
  }
  
  .dn {
    display: none
  }
  
  .op_li {
    position: relative;
  }
  
  .mui-grid-view.mui-grid-9 .mui-media .op_name {
    position: absolute;
    display: block;
    width: 100%;
    height: auto;
    color: #fff;
    top: 50%;
    margin-top: -.5em;
    left: 0;
  }
  
  .mui-grid-view.mui-grid-9 .mui-table-view-cell {
    border: none;
  }
</style>