import Base from './Base'

/**
 * 装备位置类型
 */
export enum EquipmentType {
  HAND = 1,
  HEAD = 2,
  UPPER = 3,
  LOWER = 4,
  FOOT = 5
}

/**
 * 装备位置单个配置
 */
class EquipmentPositionConfig {
  /**
   * 装备位置携带装备占用限制
   */
  limit = 1
  /**
   * 装备位置名称
   */
  name = ""
  /**
   * 装备鉴别值
   */
  key: EquipmentType = 0
  /**
   * 
   * @param key 装备鉴别值
   * @param name 装备位置名称
   * @param limit 装备位置携带装备占用限制
   */
  constructor(key: EquipmentType, name?: string, limit?: number) {
    if (key === null || key === 0 || key === undefined) {
      throw TypeError('装备位置键值必填')
    }
    this.key = key
    this.name = name || this.name
    this.limit = limit || this.limit
  }
}

/**
 * 装备位置配置信息
 */
export const EquipmentPosition = [
  new EquipmentPositionConfig(EquipmentType.HAND, '手持', 2),
  new EquipmentPositionConfig(EquipmentType.HEAD, '头戴'),
  new EquipmentPositionConfig(EquipmentType.UPPER, '上衣', 3),
  new EquipmentPositionConfig(EquipmentType.LOWER, '下装', 3),
  new EquipmentPositionConfig(EquipmentType.FOOT, '脚穿', 2)
]

/**
 * 装备
 */
interface Equipment {
  /**
   * 装备佩戴位置
   */
  Position: EquipmentType,
  /**
   * 装备占用值
   */
  Occupy: number
}

/**
 * @description 装备说明：每件装备都存在占用值，而每个位置都有占用值上限
 */
class Equipment extends Base {
  Occupy = 1
  constructor(equipment: Equipment) {
    super(equipment)
    this.Occupy = equipment.Occupy
    this.Position = equipment.Position
  }
}


export default Equipment