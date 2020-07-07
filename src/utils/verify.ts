
export namespace TypeVerify {
  /**
   * 先判断是否为null
   * 再判断是对象还是typeof能识别的其他类型
   * @param target 验证元素
   */
  export function GetType (target: any):string {
    if(target === null){
      return 'null'
    }
    var ret = typeof(target)
    if(ret == "object"){
      var str = Object.prototype.toString.call(target)
      let reg = /^\[(object [a-z]+)\]$/
      let res  = str.toLowerCase().match(reg)
      return res ? res[1] : ''
    } else {
      return ret
    }
  }
  /**
   * 验证数组
   * @param target 验证元素
   */
  export function IsArray (target: any) {
    return GetType(target) === 'object array'
  }
  /**
   * 验证布尔值
   * @param target 验证元素
   */
  export function IsBoolean(target: any) {
    return GetType(target) === 'object boolean'
  }
  /**
   * 验证方法（函数）
   * @param target 验证元素
   */
  export function IsFunction(target: any) {
    return GetType(target) === 'function'
  }
  /**
   * 验证空
   * @param target 验证元素
   */
  export function IsNull(target: any) {
    return GetType(target) === 'null'
  }
  /**
   * 验证数字
   * @param target 验证元素
   */
  export function IsNumber(target: any) {
    return GetType(target) === 'number'
  }
  /**
   * 验证字符串
   * @param target 验证元素
   */
  export function IsString(target: any) {
    return GetType(target) === 'string'
  }
  /**
   * 验证对象
   * @param target 验证元素
   */
  export function IsObject(target: any) {
    return GetType(target) === 'object object'
  }
  /**
   * 验证布尔对象
   * @param target 验证元素
   */
  export function IsObjectBoolean(target: any) {
    return GetType(target) === 'object boolean'
  }
  /**
   * 验证数字对象
   * @param target 验证元素
   */
  export function IsObjectNumber(target: any) {
    return GetType(target) === 'object number'
  }
  /**
   * 验证字符串对象
   * @param target 验证元素
   */
  export function IsObjectString(target: any) {
    return GetType(target) === 'object string'
  }
}