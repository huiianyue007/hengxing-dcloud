<template>
  <div class="calendar-date-day" @click="checked()">
    <div :class="{'disable': isDisabled}" class="day">
      <div class="day-transition" :class="{'active': isActive}"></div>
      <div class="day-number" :class="{'active': isActive, 'disable': isDisabled}">
        {{display}}
      </div>
    </div>
    <div class="background" :class="{'show':isInRange, 'first-show': isFirstShow, 'second-show': isSecondShow}"></div>
    <p :class="{'active': isActive}" class="content">{{ info }}</p>
  </div>
</template>
<script>
  import {lunar} from './dateUtil'
  import moment from 'moment'
  moment.locale('zh-cn')

  export default{
    name: 'tk-calendar-day',
    data: function () {
      return {}
    },
    computed: {
      display: function () {
        if (this.day.month() !== this.month.month()) return
        return this.day.format('D')
      },
      isDisabled: function () {
        return this.overLimit || this.day.month() !== this.month.month() || moment(this.day).isBefore(moment(), 'date')
      },
      isActive: function () {
        if (this.display === undefined) return
        for (let i of this.option.checked) {
          if (this.day.isSame(i)) {
            return true
          }
        }
        return false
      },
      isInRange: function () {
        return !this.overLimit && this.display !== undefined && this.option.type === 'range' && this.option.checked.length === 2 && this.day.isBefore(this.option.checked[1]) && this.day.isAfter(this.option.checked[0])
      },
      isFirstShow: function () {
        return this.display !== undefined && !this.overLimit && this.option.type === 'range' && this.option.checked.length === 2 && this.day.isSame(this.option.checked[0])
      },
      isSecondShow: function () {
        return this.display !== undefined && !this.overLimit && this.option.type === 'range' && this.option.checked.length === 2 && this.day.isSame(this.option.checked[1])
      },
      info: function () {
        if (!this.isDisabled && this.isActive && this.option.checkedInfo) {
          if (typeof this.option.checkedInfo === 'string') {
            return this.option.checkedInfo
          } else if (Array.isArray(this.option.checkedInfo)) {
            for (let k in this.option.checked) {
              if (this.day.isSame(this.option.checked[k]) && this.option.checkedInfo[k]) {
                return this.option.checkedInfo[k]
              }
            }
          }
        } else {
          if (!this.display) return
          if (this.option.noHoliday) return
          return lunar.getHoliday(this.day)
        }
      }
    },
    methods: {
      checked: function () {
        if (this.option.type === 'display') return
        if (!this.isDisabled && this.display) {
          this.$emit('checked', this.day)
        }
      }
    },
    props: ['day', 'option', 'overLimit', 'month']
  }
</script>
<style lang="scss" rel="stylesheet/scss">
  @import "../../assets/scss/variables";
  @import "../../assets/scss/mixins";

  .calendar-date {
    background: $grey900;

    &-row {
      display: flex;
      justify-content: space-between;
      position: relative;

      &:first-child {
        margin-top: 10px/$basic;
      }
      &:last-child {
        margin-bottom: 10px/$basic;
      }
    }

    &-day {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      flex-grow: 1;
      position: relative;
      text-align: center;
      font-size: 28px/$basic;

      .day {
        @include transition(0.2s);
        margin: 0 auto;
        display: block;
        position: relative;
        height: 54px/$basic;
        width: 54px/$basic;
        background: transparent;

        .day-number {
          @include transition(0.2s);
          position: relative;
          line-height: 54px/$basic;
          font-weight: 400;
          z-index: 100;

          &.active {
            color: $grey900;
          }
          &.disable {
            color: $grey300;
          }
        }
        .day-transition {
          @include transition(0.2s);
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: transparent;
          opacity: 0;
          z-index: 0;

          &.active {
            background: $blue100;
            opacity: 1;
          }
        }
      }
      .background {
        @include transition(0.2s);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 54px/$basic;
        background: transparent;

        &.show {
          background: rgba(0, 188, 282, .2);
        }
        &.first-show {
          right: 0;
          left: auto;
          top: 0;
          width: 50%;
          background: rgba(0, 188, 282, .2);
        }
        &.second-show {
          width: 50%;
          background: rgba(0, 188, 282, .2);
        }
      }

      .content {
        display: block;
        width: 70px/$basic;
        height: 36px/$basic;
        line-height: 36px/$basic;
        margin: 0 auto;
        padding: 0 0;
        font-size: 20px/$basic;
        color: $grey300;
        text-align: center;

        &.active {
          color: $blue100;
        }
      }
    }
  }
</style>


