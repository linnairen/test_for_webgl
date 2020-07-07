import Base from './Base'
import {EquipmentType, EquipmentPosition} from './Equipment'
import Equipment from './Equipment'

/**
 * 角色
 */
interface Person {
  Equipments: Array<Equipment>
}

class Person extends Base {
  constructor(person:Person) {
    super(person)
    let { Equipments } = person
    this.Equipments = Equipments || new Array()
  }
  // get EquipmentsTotalProp():any {
  //   return this.Equipments.length ? this.Equipments.reduce((i, k) => (i)) : {}
  // }

  get AttackOuter():number {
    return this.Equipments.length ? this.Equipments.map(it => it.Attack).reduce((i, k) => i + k) : 0
  }
  get AdefOuter():number {
    return this.Equipments.length ? this.Equipments.map(it => it.Adef).reduce((i, k) => i + k) : 0
  }

  /**
   * 佩戴装备
   * @param equipment 装备实例
   */
  WaerEquipment(equipment: Equipment) {
    /**
     * 当前该位置的装备列表
     */
    let nowEquipments = this.Equipments.filter(it => it.Position === equipment.Position)
    /**
     * 统计当前位置占用值
     */
    let nowOccupy = nowEquipments.length ? nowEquipments.map(it => it.Occupy).reduce((i, k) => i + k) : 0
    /**
     * 获取当前装备位置配置信息
     */
    let limitItem = EquipmentPosition.find(it => it.key === equipment.Position)
    /**
     * 获取当前装备位置佩戴限制
     */
    let limit = limitItem ? limitItem.limit : 0
    if (nowOccupy + equipment.Occupy <= limit) {
      this.Equipments.push(equipment)
    }
  }
}

export default Person