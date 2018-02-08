<template>
  <div class="box">
    <header class="mui-bar mui-bar-nav" ref='header'>
      <a class="mui-icon mui-icon-left-nav mui-pull-left" @click='back'></a>
      <h1 class="mui-title">图文详情</h1>
      <a class="mui-icon mui-icon-image mui-pull-right save" @click="getImage"></a>
    </header>
    <div class="mui-content">
      <div class="mui-content-padded de_con needsclick" ref="content" @click='change' @keyup="change">
        <p class='needsclick' v-for="item in data.detail">
          {{item.type=="text"?item.value:''}}
          <img :src="image(item.value)" alt="" v-if="item.type == 'image'" />
        </p>
      </div>
    </div>
    <cramera @getImg="getImg" @clickCancel="cancel" v-if="flag"></cramera>
    <div class="mui-btn mui-btn-block save_back" @click="saveBack()">保存</div>
  </div>
</template>

<script>
  import Lib from 'assets/js/Lib.js'
  import cramera from "components/component/cramera.vue"
  import MediumEditor from 'medium-editor'
  import "medium-editor/dist/css/medium-editor.css"
  import 'font-awesome/css/font-awesome.css'
  import {
    tkStatusBarState
  } from 'vue-tk/dist/components/tkStatusBar'
  export default {
    name: 'serviceDetails',
    data() {
      return {
        pageTitle: '图文详情',
        editor: null,
        flag: false,
        range: null,
        html: '',
      }
    },
    activated: function() {
      this.init();
    },
    components: {
      cramera
    },
    mounted() {
      this.$refs.header.style.cssText = 'top:' + tkStatusBarState.height() + 'px'
    },
    updated() {
      var content = this.$refs.content;
      content.innerHTML = this.html;
    },
    methods: {
      init() {
        this.flag = false;
        this.editor = new MediumEditor(".de_con", {
          toolbar: false,
          placeholder: false
        });
        this.editor.setup();
      },
      getImg(opt) {
        var selectionSate = this.editor.selectionState;
        this.editor.importSelection(selectionSate);
        document.execCommand("insertImage", false, this.image(opt));
        this.flag = false;
      },
      cancel() {
        this.flag = false;
      },
      change() {
        this.editor.saveSelection();
      },
      getImage() {
        if(this.editor.selectionState) {
          this.flag = true;
        } else {
          this.toast("请选择编辑内容");
        }
      },
      saveBack() {
        var content = this.$refs.content;
        var child = content.children;
        var len = child.length;
        var index = Lib.C.imageHost.length;
        var item = [];
        for(var i = 0; i < len; i++) {
          var nodes = child[i].childNodes;
          var imgLen = nodes.length;
          for(var j = 0; j < imgLen; j++) {
            if(nodes[j].nodeName) {
              if(nodes[j].nodeName.toLowerCase() == 'img') {
                var src = nodes[j].src.substring(index);
                item.push({
                  type: 'image',
                  value: src
                })
              } else {
                var textContent = nodes[j].textContent;
                textContent = textContent.replace(/\n/g, '').replace(/\t/g, '');
                if(textContent) {
                  item.push({
                    type: 'text',
                    value: textContent
                  })
                }
              }
            }
          }
        }
        this.data.detail = item;
        this.html = content.innerHTML
        this.$store.commit("setServiceInfo", this.data);
        this.editor.resetContent(content);

        this.editor.destroy()
        this.$router.go(-1);
      }
    },
    computed: {
      data: function() {
        var data = this.$store.state.serviceInfo
        if(data) {
          return data
        }
      }
    },
    mixins: [Lib.P]
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .save {
    line-height: 44px;
    display: block;
    padding: 0 .5em;
    box-sizing: border-box;
  }
  
  .box {
    margin-bottom: 70px;
  }
  
  .mui-content-padded {
    min-height: 100px !important;
  }
  
  .de_con,
  .de_con * {
    -webkit-user-select: auto;
    -webkit-user-modify: read-write;
    user-select: auto;
    user-modify: read-write;
  }
  
  .de_con span {
    line-height: 2em;
    display: block;
  }
  
  .de_con img {
    width: 100%;
    display: block;
  }
  
  .save_back {
    position: fixed;
    bottom: 0;
    margin-bottom: 0;
  }
</style>