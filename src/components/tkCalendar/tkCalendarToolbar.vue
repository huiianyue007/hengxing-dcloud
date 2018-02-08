<template>
  <div class="calendar-toolbar">
    <span class="calendar-toolbar-close" @click="handleCancel">{{ close }}</span>
    <span class="calendar-toolbar-title">{{ title }}</span>
    <span class="calendar-toolbar-ok" @click="handleOk">{{ ok }}</span>
  </div>
</template>

<script>
  export default {
    name: 'tk-calendar-toolbar',
    data: function () {
      return {
        close: '关闭',
        title: '请选择日期',
        ok: '确定'
      }
    },
    methods: {
      handleCancel: function () {
        this.$emit('handleCancel')
      },
      handleOk: function () {
        this.$emit('handleOk')
      }
    }
  }
</script>

<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/variables";
  @import "../../assets/scss/mixins";

  .calendar-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 1;
    padding: 15px/$basic 21px/$basic;
    background: $grey800;
    font-size: 30px/$basic;
    color: $grey200;

    span {
      display: block;
    }

    &-close {
      text-align: left;
    }
    &-ok {
      color: $blue100;
      text-align: right;
    }
  }
</style>
