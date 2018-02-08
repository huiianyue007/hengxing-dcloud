/**
 * @desc touch swipe事件
 * @param el {Object} - DOM 对象
 * @param callBack {Function} - 回调函数
 */

export function swipe (el, callBack) {
  let swipeOpt = {}
  swipeOpt.sX = 0
  swipeOpt.sY = 0
  swipeOpt.eX = 0
  swipeOpt.eY = 0

  let minX = 50
  let maxX = 70
  let minY = 50
  let maxY = 70
  let direction = ''
  el.addEventListener('touchstart', (e) => {
    let t = e.changedTouches[0]
    swipeOpt.sX = t.screenX
    swipeOpt.sY = t.screenY
  }, false)
  el.addEventListener('touchmove', (e) => {
    e.preventDefault()
  })
  el.addEventListener('touchend', (e) => {
    let t = e.changedTouches[0]
    swipeOpt.eX = t.screenX
    swipeOpt.eY = t.screenY

    if ((((swipeOpt.eX - minX > swipeOpt.sX) || (swipeOpt.eX + minX < swipeOpt.sX)) && ((swipeOpt.eY < swipeOpt.sY + maxY) && (swipeOpt.sY > swipeOpt.eY - maxY)))) {
      if (swipeOpt.eX > swipeOpt.sX) {
        direction = 'right'
      } else {
        direction = 'left'
      }
    }
    if ((((swipeOpt.eY - minY > swipeOpt.sY) || (swipeOpt.eY + minY < swipeOpt.sY)) && ((swipeOpt.eX < swipeOpt.sX + maxX) && (swipeOpt.sX > swipeOpt.eX - maxX)))) {
      if (swipeOpt.eY > swipeOpt.sY) {
        direction = 'down'
      } else {
        direction = 'up'
      }
    }
    if (direction === '') return
    let val = (direction === 'right') ? -1 : 1
    callBack(val)
    direction = ''
  })
}
