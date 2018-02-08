<template>
  <div class="calendar-date">
    <div class="calendar-date-row" v-for="group in groups">
      <tk-calendar-day v-for="day in group"
                    @checked="checked"
                    :month="month"
                    :overLimit="overLimit"
                    :day="day"
                    :option="option">
      </tk-calendar-day>
    </div>
  </div>
</template>
<script>
  import moment from 'moment'
  import tkCalendarDay from './tkCalendarDay.vue'
  moment.locale('zh-cn')

  export default{
    name: 'tk-calendar-date',
    data: function () {
      return {
        overLimit: this.month.isBefore(this.option.min) || this.month.isAfter(this.option.max)
      }
    },
    computed: {
      currentMonth: function () {
        return this.month
      },
      groups: function () {
        let groups = []
        let firstDayInMonth = this.month.day()
        let daysInMonth = this.month.daysInMonth()
        let daysLength = firstDayInMonth + daysInMonth > 35 ? 42 : 35
        let firstDay = moment(this.month).subtract(firstDayInMonth, 'days')

        for (let i = 0; i < daysLength; i++) {
          let groupIndex = (i - i % 7) / 7
          if (i % 7 === 0) {
            groups[groupIndex] = []
          }
          groups[groupIndex].push(moment(firstDay))
          firstDay.add(1, 'days')
        }
        return groups
      }
    },
    methods: {
      checked: function (day) {
        this.$emit('checked', day)
      }
    },
    components: {
      tkCalendarDay
    },
    props: ['month', 'option']
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/variables";
  @import "../../assets/scss/mixins";

  .calendar-date {
    display: flex;
    flex-direction: column;
    background: $grey900;

    &-row {
      display: flex;
      justify-content: center;
      position: relative;

      &:first-child {
        margin-top: 20px/$basic;
      }
      &:last-child {
        margin-bottom: 10px/$basic;
      }
    }
  }
</style>


