<template>
  <swiper :options='swiperOption'>
    <swiper-slide v-for='item in ar'><img :src="image(item.cover,{width:640,height:368,type:'cut'})" @click='openVue(item.id)' /></swiper-slide>
    <div class="swiper-pagination" slot="pagination"></div>
  </swiper>
</template>

<script>
  import Lib from 'assets/js/Lib.js'
  import rest from 'assets/js/rest.js'
  import {
    swiper,
    swiperSlide
  } from 'vue-awesome-swiper'
  export default {
    name: 'banner',
    data() {
      return {
        ar: [],
        swiperOption: {
          autoplay: 4000,
          speed: 300,
          loop: true,
          pagination: '.swiper-pagination',
          bulletActiveClass: 'my-bullet-active',
          onTouchEnd: function(swiper, even) {
            swiper.startAutoplay()
          }
        }
      }
    },
    mounted() {
      var self = this;
      new rest().get("article").data({
        on_homepage: 1,
        sort: '-weight',
        'per-page': 3
      }).success(function(data) {
        self.ar = data
      }).run();
    },
    components: {
      swiper,
      swiperSlide
    },
    methods: {
      openVue: function(id) {
        this.$router.push({
          path: '/article',
          query: {
            id: id
          }
        });
      }
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .my-bullet-active {
    background: #fff !important;
    opacity: .5 !important
  }
</style>