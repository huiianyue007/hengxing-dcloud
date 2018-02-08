<template>
  <div class="calendar-title">
    <span>{{ dateString }}</span>
  </div>
</template>
<script>
  import moment from 'moment'

  export default{
    name: 'tk-calendar-title',
    props: {
      date: {
        type: Object
      }
    },
    computed: {
      dateString: function () {
        return moment(this.date).format('YYYY年MM月')
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/variables";
  @import "../../assets/scss/mixins";

  .calendar-title {
    display: flex;
    width: 100%;
    justify-content: center;
    background: $grey800;

    span {
      display: block;
      padding: 15px/$basic 0;
      line-height: 1;
      font-size: 34px/$basic;
      font-weight: 600;
      color: $grey000;
    }
  }
</style>


