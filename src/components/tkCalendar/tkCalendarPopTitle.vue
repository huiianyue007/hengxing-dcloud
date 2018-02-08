<template>
  <div class="calendar-title">
    <span class="calendar-title-pre" @click="preMonth">&lt;</span>
    <span>{{ dateString }}</span>
    <span class="calendar-title-next" @click="nextMonth">&gt;</span>
  </div>
</template>
<script>
  import moment from 'moment'

  export default{
    name: 'tk-calendar-pop-title',
    props: {
      month: {
        type: Array
      }
    },
    computed: {
      dateString: function () {
        return moment(this.month[0]).format('YYYY年MM月')
      }
    },
    methods: {
      preMonth: function () {
        this.$emit('changeMonth', -1)
      },
      nextMonth: function () {
        this.$emit('changeMonth', 1)
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
    background: $grey900;
    border-top: 1px solid $grey700;
    border-bottom: 1px solid $grey700;

    span {
      padding: 15px/$basic 0;
      line-height: 1;
      font-size: 30px/$basic;
      font-weight: 600;
      color: $grey000;

      &.calendar-title-pre {
        margin-right: 96px/$basic;
      }
      &.calendar-title-next {
        margin-left: 96px/$basic;
      }
    }
  }
</style>


