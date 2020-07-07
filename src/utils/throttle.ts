/**
 * 节流：一段时间内只执行一次
 * @param fn 需要节流的方法
 * @param time 节流的判定时间（毫秒）
 * @param err 发生拦截时执行的方法
 */
export default function throttle(fn: Function, time: number = 1000, err?: Function) {
  let ready = true
  return function callback() {
    if (!ready) return err && err()
    ready = false
    setTimeout(() => {
      fn.apply(callback, arguments)
      ready = true
    }, time);
  }
}