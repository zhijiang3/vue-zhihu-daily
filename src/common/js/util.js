export function formatDate (str, fmt, isTimestamp) {
  const now = new Date()

  /**
   * str 的默认格式为 20170803
   * 把str的格式重置为 2017-08-03
   */
  const date = isTimestamp ? new Date(str) : new Date(str.slice(0, 4) + '-' + str.slice(4, 6) + '-' + str.slice(6, 8))
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  if (!isTimestamp) {
    if (now.getFullYear() === year &&
        now.getMonth() + 1 === month &&
        now.getDate() === day) return '今日热闻'
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (year + '').substr(4 - RegExp.$1.length))
  }

  let o = {
    'M+': month,
    'd+': day,
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  }

  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }

  if (new RegExp('(D)').test(fmt)) {
    fmt = fmt.replace(RegExp.$1, getDayOfWeek(date.getDay()))
  }

  return fmt
}

export function formatTitle (str) {
  return str.replace(/\n/g, '<br>')
}

export function setTransform (el, val) {
  const prefixed = [ 'webkitTransform', 'mozTransform', 'msTransform', 'oTransform', 'transform' ]
  prefixed.forEach(item => {
    el.style[item] = val
  })
}

function getDayOfWeek (day) {
  const DAY = ['日', '一', '二', '三', '四', '五', '六']

  return DAY[day]
}

function padLeftZero (str) {
  return ('00' + str).substr(str.length)
}
