import Base from "./Base";

/**
 * 世界平衡值
 */
const BALANCENUMBER: number = 520

/**
 * 常用概率指数转换概率值计算器
 * @param exponent 概率指数
 */
export function ExponentCal(exponent: number):number {
  return exponent > 0 ? exponent / (BALANCENUMBER + exponent) : 0
}

/**
 * 常用概率指数概率计算器
 * @param exponent 概率指数
 */
export function CommonRamdom(exponent: number) {
  /**
   * 概率
   */
  let Rate = ExponentCal(exponent)
  /**
   * 概率参考值
   */
  let random = Math.random()
  return Rate >= random
}

/**
 * 伤害命中计算规则
 * 算法版本： 
 *  1.0、命中率实际值为攻击方的命中率减去承受方的闪避率
 *  2.0、命中率实际值为攻击方的命中率占有攻击方命中率和承受方闪避率总和的占比
 *  3.0、命中指数为源目标命中指数减指向目标闪避率
 * @param From 伤害源
 * @param To 伤害目标
 */
export function RuleOfHitRate(From: Base, To: Base):number {
  /**
   * 命中指数
   */
  let exponent = From.HIT - To.DOD
  return ExponentCal(exponent)
}
