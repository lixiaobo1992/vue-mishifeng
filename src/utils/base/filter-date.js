import { formatDate } from '@/utils/base/date';

/**
 * 获取当前时间戳
 * 时间转10位时间戳
 * 显示时间格式为: 今天 昨天 和 H:F
 * @param {*} date
 * @returns
 */
export function dateFilter(val, weekStatus = false) {
  let timestamp = Math.floor(parseInt(Date.parse(new Date())) / 1000),
    day = timestamp - val,
    numDay = 24 * 3600,
    days = Math.floor(day / numDay),
    weekArr = [
      '星期日',
      '星期一',
      '星期二',
      '星期三',
      '星期四',
      '星期五',
      '星期六',
    ],
    weekDay = weekArr[new Date(formatDate(val, 'Y-M-D')).getDay()],
    yearStatus = formatDate(timestamp * 1000, 'Y') !== formatDate(val, 'Y'),
    dayStatus =
      formatDate(timestamp * 1000, 'Y-M-D') == formatDate(val * 1000, 'Y-M-D');
  if (days == 0 && dayStatus) {
    val = '今天' + formatDate(val, 'H:F');
  } else if (days == 1 || (days == 0 && !dayStatus)) {
    val = '昨天' + formatDate(val, ' H:F');
  } else if (weekStatus && days > 7) {
    val = '更早';
  } else if (weekStatus && days < 7) {
    val = weekDay;
  } else if (yearStatus) {
    val = formatDate(val, 'Y-M-D H:F');
  } else {
    val = formatDate(val, 'M-D H:F');
  }
  return val;
}
