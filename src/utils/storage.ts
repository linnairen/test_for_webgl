import { TypeVerify } from './verify'
import 'websql'

/**
 * 通用本地存储
 */
export namespace CommonStore {
  /**
   * 数据库接入信息
   */
  interface WebSqlDbI {
    /**
     * 数据库名称
     */
    name: string,
    /**
     * 数据库版本
     */
    version: string,
    /**
     * 数据库描述
     */
    describ?: string,
    /**
     * 数据库尺寸
     */
    size?: number,
    /**
     * 创建数据库后的回调
     */
    createCallBack: DatabaseCallback
  }

  /**
   * websql封装类
   */
  export class WebSqlDb {
    /**
     * 数据库对象
     */
    db?: Database

    constructor({name, version, describ = '', size = 2*1024*1024, createCallBack = d => d}: WebSqlDbI) {
      if(!TypeVerify.IsString(name)) throw new TypeError('name should be string')
      if(!TypeVerify.IsString(version)) throw new TypeError('version should be string')
      if(!TypeVerify.IsString(describ)) throw new TypeError('describ should be string')
      if(!TypeVerify.IsNumber(size)) throw new TypeError('size should be number')
      this.db = window.openDatabase(name, version, describ, size, createCallBack)
    }
    /**
     * sql 处理函数
     * @param str sql语句
     */
    DealSql(str: string): Promise<SQLResultSet> {
      return new Promise((res, rej) => {
        if (this.db) {
          this.db.transaction(function(tx) {
            tx.executeSql(str, [], function(t, rs) {
              return res(rs)
            }, function(t, er) {
              rej(er)
              return false
            })
          })
        } else {
          return rej('Database is not defined')
        }
      })
    }
    /**
     * 表格处理
     */
    table = {
      /**
       * 添加表格
       * @param tablename 要添加的表格名称
       * @param columns 要添加的表格列名组合(可加修饰符 如：['id unique', 'name'])
       */
      create: async (tablename: string, columns: string[] = []) => {
        if (!tablename) { throw new TypeError('tablename is requested') }
        return await this.DealSql('create table if not exists ' + tablename + ' (' + columns.join() + ')')
      },
      /**
       * 删除表格
       * @param tablename 要删除的表格名称
       */
      delete: async (tablename: string) => {
        if (!tablename) { throw new TypeError('tablename is requested') }
        return await this.DealSql('drop table ' + tablename)
      }
    }
    /**
     * 查询数据
     * @param tablename 数据来源表格名
     * @param columns 查询列名组合
     * @param selectors 查询条件组合（暂时只支持等于 如：name = "Bob"）
     */
    select = async (tablename: string, columns:string[] = [], selectors?: Array<{ key: string, value: string }>) => {
      if (!tablename) { throw new TypeError('tablename is requested') }
      let qStr = 'select ' + (columns.join() || '*') + ' from ' + tablename
      if (selectors) {
        qStr += ' where '
        for(let i in selectors) {
          qStr += selectors[i].key + '="' + selectors[i].value + '" '
        }
      }
      return await this.DealSql(qStr)
    }
    /**
     * 插入数据
     * @param tablename 要插入数据的表格名
     * @param data 插入数据 格式为：[ { key: "name", value: "Bob" } ]
     */
    add = async (tablename: string, data: Array<{ key: string, value: string }>) => {
      if (!tablename) { throw new TypeError('tablename is requested') }
      let qStr = 'insert into ' + tablename
      if (TypeVerify.IsArray(data)) {
        let keys = data.map(it => it.key)
        let values = data.map(it => it.value)
        if (keys.length !== values.length) {
          throw new TypeError('param data is not Array<{ key: string, value: string }>')
        }
        qStr += ' (' + keys.join() + ') values (' + values.join() + ') ' 
      }
      return await this.DealSql(qStr)
    }
  }

}