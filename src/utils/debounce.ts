/**
 * 防抖: 短时间连续点击只执行最后一次
 * @param fn 需要防抖的方法
 * @param timeout 防抖的判定时间（毫秒）
 */
export default function debounce(fn: Function, timeout: number = 100) {
  let timekey = 0
  return function callback() {
    clearTimeout(timekey)
    timekey = setTimeout(() => {
      fn.apply(callback, arguments)
    }, timeout);
  }
}