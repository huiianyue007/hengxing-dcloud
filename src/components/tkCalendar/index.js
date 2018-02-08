import tkCalendar from './tkCalendar'
import tkCalendarPop from './tkCalendarPop'

export default function install (Vue) {
  Vue.component('tk-calendar', Vue.extend(tkCalendar))
  Vue.component('tk-calendarPop', Vue.extend(tkCalendarPop))
}
