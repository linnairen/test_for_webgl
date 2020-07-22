declare interface Number {
  /**
   * 保留指定小数位数
   * @param n 保留位数
   */
  roundFixed(n: number):number
}
Number.prototype.roundFixed = function(n: number) {
  return Math.round(this.valueOf()*Math.pow(10, n))/Math.pow(10, n)
}