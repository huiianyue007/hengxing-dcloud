<template>
  <div class="calendar-week">
    <span v-for="week in weeks">{{ week }}</span>
  </div>
</template>
<script>
  export default{
    name: 'tk-calendar-week',
    data: function () {
      return {
        weeks: ['日', '一', '二', '三', '四', '五', '六']
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/variables";
  @import "../../assets/scss/mixins";

  .calendar-week {
    display: flex;
    justify-content: center;
    width: 100%;

    span {
      display: block;
      flex-grow: 1;
      line-height: 1;
      padding: 15px/$basic 0;
      background: $grey800;
      font-size: 30px/$basic;
      text-align: center;
      color: $grey000;
    }
  }
</style>


