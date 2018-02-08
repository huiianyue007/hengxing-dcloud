<template>
  <transition name="slide-bottom">
    <div class="calendar-pop">
      <tk-calendar-toolbar @handleCancel="handleCancel" @handleOk="handleOk"></tk-calendar-toolbar>
      <tk-calendar-pop-title @changeMonth="changeMonth" :month="months"></tk-calendar-pop-title>
      <tk-calendar-week></tk-calendar-week>
      <div class="calendar-date-container" ref="calendarDate">
        <transition :name="direction" v-for="month in months">
          <div class="calendar-date-slide" :key="month.format('X')">
            <tk-calendar-date :month="month" :option="option" @checked="check"></tk-calendar-date>
          </div>
        </transition>
      </div>
    </div>
  </transition>
</template>
<script>
  import tkCalendarToolbar from './tkCalendarToolbar'
  import tkCalendarPopTitle from './tkCalendarPopTitle'
  import tkCalendarWeek from './tkCalendarWeek.vue'
  import tkCalendarDate from './tkCalendarDate.vue'

  import moment from 'moment'
  import {swipe} from './swipeUtil'
  moment.locale('zh-cn')

  export default{
    name: 'tk-calendar-pop',
    props: {
      date: {
        type: Object,
        default: function () {
          return moment()
        }
      },
      min: {
        default: '2010-01-01'
      },
      max: {
        default: '2019-12-31'
      },
      type: {
        type: String,
        default: 'range'// display,picker,range,multiple
      },
      checkedInfo: {
        type: null,
        default: function () {
          return ['出发', '返程']
        }
      }
    },
    data: function () {
      return {
        checked: [],
        current: this.date,
        direction: '',
        active: true,
        months: [moment(this.current).startOf('month')]
      }
    },
    computed: {
      option: function () {
        return {
          min: moment(this.min),
          max: moment(this.max),
          checked: this.checked,
          type: this.type,
          checkedInfo: this.checkedInfo,
          range: this.range
        }
      }
    },
    components: {
      tkCalendarToolbar,
      tkCalendarPopTitle,
      tkCalendarWeek,
      tkCalendarDate
    },
    methods: {
      check: function (day) {
        let isBeChecked = false
        let removeSame = this.checked.filter(function (v) {
          if (v.isSame(day)) {
            isBeChecked = true
            return false
          }
          return true
        })
        if (this.type === 'picker') {
          this.checked = isBeChecked ? removeSame : [day]
        } else if (this.type === 'range') {
          if (isBeChecked) {
            this.checked = removeSame
          } else {
            if (this.checked.length === 1) {
              let firstDay = this.checked[0]
              this.checked = firstDay.isBefore(day) ? [firstDay, day] : [day, firstDay]
            } else if (this.checked.length === 2) {
              this.checked = []
            } else {
              this.checked = [day]
            }
          }
        } else if (this.type === 'multiple') {
          if (isBeChecked) {
            this.checked = removeSame
          } else {
            this.checked.push(day)
          }
        }
      },
      changeMonth: function (val) {
        this.direction = val > 0 ? 'slide-right' : 'slide-left'
        this.current = val > 0 ? moment(this.current).add(1, 'month').startOf('month') : moment(this.current).subtract(1, 'month').startOf('month')
        this.months.push(this.current)
        this.months.splice(0, 1)
      },
      handleOk: function () {
        let dateFormat = this.checked.map((date) => {
          return moment(date).format('YYYY-MM-DD')
        })

        switch (true) {
          case (this.type === 'range' && this.checked.length === 2):
            this.$emit('handleOk', dateFormat)
            break
          case (this.type === 'picker' && this.checked.length === 1):
            this.$emit('handleOk', dateFormat)
            break
          default:
            this.$emit('handleOk', [])
        }
      },
      handleCancel: function () {
        this.$emit('handleCancel')
      }
    },
    mounted: function () {
      let el = this.$refs.calendarDate
      swipe(el, this.changeMonth)
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/variables";
  @import "../../assets/scss/mixins";

  .calendar-pop {
    position: fixed;
    width: 100%;
    bottom: 0;
    background: $grey900;
    z-index: 101;

    .calendar-date-container {
      position: relative;
      height: 550px/$basic;

      .calendar-date-slide {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
      }
    }

  }

  .slide-bottom-enter-active,
  .slide-bottom-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active,
  .slide-right-enter-active,
  .slide-right-leave-active {
    @include transition($during: .4s, $timing: ease);
  }

  .slide-bottom-enter,
  .slide-bottom-leave-active {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  .slide-left-enter {
    transform: translate3d(-100%, 0, 0);
  }

  .slide-left-leave-active {
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }

  .slide-right-enter {
    transform: translate3d(100%, 0, 0);
  }

  .slide-right-leave-active {
    transform: translate3d(-100%, 0, 0);
    opacity: 0;
  }

</style>


