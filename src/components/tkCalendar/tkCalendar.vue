<template>
  <div class="calendar-wraper">
    <div class="calendar" @scroll="scroll" ref="calendar">
      <div class="calendarMonth" v-for="month in months">
        <tk-calendar-Title :date="month"></tk-calendar-Title>
        <tk-calendar-week></tk-calendar-week>
        <tk-calendar-date :month="month" :option="option" @checked="check"></tk-calendar-date>
      </div>
    </div>
  </div>
</template>
<script>
  import tkCalendarTitle from './tkCalendarTitle.vue'
  import tkCalendarWeek from './tkCalendarWeek.vue'
  import tkCalendarDate from './tkCalendarDate.vue'
  import moment from 'moment'
  moment.locale('zh-cn')

  export default{
    name: 'tk-calendar',
    props: {
      date: null,
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
      },
      noHoliday: {
        type: Boolean,
        default: false
      }
    },
    data: function () {
      let vm = this

      function transformDate () {
        let date = []
        if (Array.isArray(vm.date)) {
          vm.date.forEach(function (day) {
            date.push(moment(day))
          })
        } else if (typeof (vm.date) === 'string') {
          date.push(moment(vm.date))
        }
        return date
      }

      let date = transformDate()
      let currentDate = date[0] ? date[0] : moment()
      let currentMonth = currentDate.startOf('month')

      return {
        months: [],
        currentMonth: currentMonth,
        checked: date,
        calendarCount: 3
      }
    },
    mounted: function () {
      this.months = this.createMonths()
      let vm = this
      this.$nextTick(function () {
        vm.$refs.calendar.scrollTop = 1
      })
    },
    computed: {
      option: function () {
        return {
          min: moment(this.min),
          max: moment(this.max),
          checked: this.checked,
          type: this.type,
          checkedInfo: this.checkedInfo,
          range: this.range,
          noHoliday: this.noHoliday
        }
      }
    },
    components: {
      tkCalendarTitle,
      tkCalendarWeek,
      tkCalendarDate
    },
    methods: {
      createMonths: function () {
        let months = []
        let clone = moment(this.currentMonth)
        clone.subtract(1, 'months')

        for (let i = 0; i < this.calendarCount; i++) {
          months.push(moment(clone))
          clone.add(1, 'months')
        }
        return months
      },
      scroll: function () {
        let scrollTop = this.$refs.calendar.scrollTop
        let scrollHeight = this.$refs.calendar.scrollHeight
        let offsetHeight = this.$refs.calendar.offsetHeight
        let vm = this
        if (scrollTop < 10) {
          this.currentMonth = this.months[0]
          this.months = []
          this.months = this.createMonths()
          this.$nextTick(function () {
            let offsetHeight = vm.$refs.calendar.firstChild.offsetHeight
            vm.$refs.calendar.scrollTop += offsetHeight
          })
        } else if (scrollTop + offsetHeight > scrollHeight - 10) {
          this.currentMonth = this.months[2]
          this.months = this.createMonths()
          this.$nextTick(function () {
            let offsetHeight = vm.$refs.calendar.lastChild.offsetHeight
            vm.$refs.calendar.scrollTop = vm.$refs.calendar.scrollHeight - vm.$refs.calendar.offsetHeight - offsetHeight
          })
        }
      },
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
          this.$emit('getDate', this.checked)
        } else if (this.type === 'range') {
          if (isBeChecked) {
            this.checked = removeSame
          } else {
            if (this.checked.length === 1) {
              let firstDay = this.checked[0]
              this.checked = firstDay.isBefore(day) ? [firstDay, day] : [day, firstDay]

              let dateFormat = this.checked.map((date) => {
                return moment(date).format('YYYY-MM-DD')
              })
              this.$emit('getDate', dateFormat)
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
      }
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/variables";

  .calendar-wraper {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    overflow: hidden;

    .calendar {
      overflow: auto;
      max-height: 100%;
      min-height: 100%;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
  }


</style>


