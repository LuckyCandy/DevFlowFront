/**
 *
 * @param {String} format
 */
export function getDatetimeWithFormat(date, format = '') {
  let ret
  const opt = {
    'Y+': date.getFullYear().toString(), // 年
    'm+': (date.getMonth() + 1).toString(), // 月
    'd+': date.getDate().toString(), // 日
    'H+': date.getHours().toString(), // 时
    'M+': date.getMinutes().toString(), // 分
    'S+': date.getSeconds().toString() // 秒
  }
  if (format === '') {
    format = 'YYYY-mm-dd HH:MM:SS'
  }
  for (const k in opt) {
    ret = new RegExp('(' + k + ')').exec(format)
    if (ret) {
      format = format.replace(ret[1], (ret[1].length === 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, '0')))
    }
  }
  return format
}
