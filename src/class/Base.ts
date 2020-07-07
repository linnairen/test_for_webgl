import { RuleOfHitRate } from './Rules';
import Creator from './Creator';

/**
 * 基础元素
 * 版本改动：
 *  2019.11.11 1.移除暴击及抗暴概念 并调整命中及闪避作用  2.移除魔法同法力值，伤害类型统一为直接伤害 3.移除星级 4.移除百分比加成 5.新增性别和构造器
 */
interface Base {
  /**
   * 名称
   */
  Name: string,
  /**
   * 等级
   */
  Level: number,
  /**
   * 性别
   */
  Sex: number,
  /**
   * 图片
   */
  Image: string,
  /**
   * 生命值
   */
  _HP: number,
  /**
   * 生命值回复
   */
  _HPR: number,
  /**
   * 生命值成长值
   */
  _HPG: number,
  /**
   * 物理伤害
   */
  _Attack: number,
  /**
   * 物理防御
   */
  _Adef: number,
  /**
   * 闪避指数
   */
  _DOD: number,
  /**
   * 命中指数
   */
  _HIT: number,
  /**
   * 物理伤害成长值
   */
  _AttackG: number,
  /**
   * 物理防御成长值
   */
  _AdefG: number,
  /**
   * 闪避指数成长值
   */
  _DODG: number,
  /**
   * 命中指数成长值
   */
  _HITG: number,
  /**
   * 当前受伤值
   */
  _Damage: number,
  /**
   * 历史受伤总数统计
   */
  _DamageCount: number,
  /**
   * 攻击状态
   */
  _AttackStatus: boolean,
  /**
   * 单次攻击所需时间
   */
  _AttackTime: number
}

class Base {
  constructor(base: Base) {
    this.Name = base.Name || ''
    this.Image = base.Image || ''
    this._HP = base._HP || 0
    this._HPR = base._HPR || 0
    this._HPG = base._HPG || 0
    this._Attack = base._Attack || 0
    this._Adef = base._Adef || 0
    this._DOD = base._DOD || 0
    this._HIT = base._HIT || 0
    this._AttackG = base._AttackG || 0
    this._AdefG = base._AdefG || 0
    this._DODG = base._DODG || 0
    this._HITG = base._HITG || 0
    this._AttackTime = base._AttackTime || 200
  }

  //#region 简单属性值及其处理

  Name = ''
  Image = ''
  Level = 0
  _HP = 0
  _HPR = 0
  _HPG = 0
  _Attack = 0
  _Adef = 0
  _DOD = 0
  _HIT = 0
  _AttackG = 0
  _AdefG = 0
  _DODG = 0
  _HITG = 0
  _AttackStatus = false
  _Damage = 0
  _DamageCount = 0
  _AttackTime = 200

  /**
   * 计算后的生命值
   */
  get HP():number {
    return this._HP + this.Level * this._HPG + this.HPOuter
  }
  /**
   * 计算后的物理伤害
   */
  get Attack():number {
    return (this._Attack + this.Level * this._AttackG + this.AttackOuter)
  }
  /**
   * 计算后的物理防御
   */
  get Adef():number {
    return (this._Adef + this.Level * this._AdefG + this.AdefOuter)
  }
  /**
   * 计算后的闪避指数
   */
  get DOD():number {
    return this._DOD + this.Level * this._DODG
  }
  /**
   * 计算后的命中指数
   */
  get HIT():number {
    return this._HIT + this.Level * this._HITG
  }
  /**
   * 外部的生命值
   */
  get HPOuter():number {
    return 0
  }
  /**
   * 外部的生命值回复
   */
  get HPROuter():number {
    return 0
  }
  /**
   * 外部的物理伤害
   */
  get AttackOuter():number {
    return 0
  }
  /**
   * 外部的物理防御
   */
  get AdefOuter():number {
    return 0
  }
  /**
   * 生存状态
   */
  get ALive():boolean {
    return this.HP > this._Damage
  }
  /**
   * 受伤状态
   */
  get Injured():boolean {
    return this._Damage <= 0
  }

  //#endregion

  /**
   * 子元素构造器
   */
  GiveBirth = new Creator()
  
  /**
   * 承受攻击
   * 攻击计算流程： 通过命中指数及闪避指数计算伤害命中率 --> 扣除防御 --> 承受伤害值及累计承受伤害值增加
   * @param {Base} AttackOne 伤害来源
   * @returns {number} 返回结算伤害值
   */
  RecieveAttack(AttackOne: Base):number {
    if (!this.ALive) {
      return 0
    }
    /**
     * 受伤值
     */
    let Damage = 0
    // 发生命中则初始化受伤值为攻击者伤害值
    Damage = AttackOne.Attack * RuleOfHitRate(AttackOne, this)
    // 这里扣除物理防御
    Damage = Damage > this.Adef ? Damage - this.Adef : 0

    // 攻击无效则直接结算，节省后续判断
    if (Damage === 0) {
      return 0
    }
    //判断伤害值是否大于生命值
    if (this.HP < Damage + this._Damage) {
      Damage = this.HP - this._Damage
    }
    // 这里输出伤害，承受伤害值及累计承受伤害值增加
    this._Damage += Damage
    this._DamageCount += Damage
    return Damage
  }
  /**
   * 生命回复触发器
   * 说明：生命回复的效果为减少当前所受伤害
   */
  HPREmiter() {
    this._Damage -= this._Damage > this._HPR + this.HPROuter ? this._HPR + this.HPROuter : 0
  }
  /**
   * 攻击动画，现在啥都没有，假装要0.2秒释放时间
   */
  async AttackAnimation() {
    return new Promise((res, rej) => {
      setTimeout(() => {
        res(`用了${this._AttackTime}毫秒`)
      }, this._AttackTime);
    })
  }
  /**
   * 攻击触发器，默认为单体攻击，群攻以后再说，流程为：物理攻击状态设为释放中--->播放物理释放动画--->扣除伤害--->物理攻击状态设为普通
   * @param {Base} To 攻击对象
   * @returns {Promise<number>} 伤害值
   */
  async AttackEmiter(To: Base):Promise<number> {
    this._AttackStatus = true
    await this.AttackAnimation()
    let Damage = To.RecieveAttack(this)
    this._AttackStatus = false
    return Damage
  }
}

export default Base
