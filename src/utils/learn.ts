import { CommonStore } from './storage'

const DatabaseName = 'IntelligentDb'
const DatabaseVersion = '1.0.0'
const DatabaseDescrib = 'it is used to collect the data for Intelligent Analyze'
const DatabaseSize = 5*1024*1024
const TableName = 'OperationLog'
const TableColumns = ['time', 'who', 'type', 'stage', 'platform', 'infomation']

interface CommonInput {
  type: string,
  stage: string,
  who: string,
  infomation: string
}

interface CommonQuery {
  type?: string,
  stage?: string,
  who: string,
  infomation?: string
}

interface CommonSave {
  type: string,
  stage: string,
  who: string,
  infomation: string,
  time: string,
  platform: string
}

/**
 * Intelligent Learning
 * 假装智能学习
 */
export class IL {
  constructor() {
    this.InitDatabase()
  }
  /**
   * 数据库对象
   */
  DB?: CommonStore.WebSqlDb

  /**
   * 输入接口
   * @param i 输入对象
   */
  Input(i: CommonInput) {
    this.Save({ time: String(new Date().getTime()), platform: navigator.platform, ...i })
  }

  /**
   * 输出接口
   * @param q 查询条件
   * @param n 查询条数
   */
  async Output(q: CommonQuery, n?: number) {
    if(this.DB) {
      let res = await this.DB.select(TableName, TableColumns, [ { key: 'who', value: q.who } ])
      console.log(res.rows)
      let rows: CommonSave[] = []
      try {
        for(let i in res.rows) {
          rows.push(res.rows.item(Number(i)))
        }
      } catch(e) {
        throw e
      }
      /******下面就是重头戏了******/ 
      // 先筛选了舞台和信息存在时完全没有关联信息的数据
      if (q.stage && rows.length) {
        if (q.infomation) {
          let qs = q.infomation.split('')
          rows = rows.filter(a => {
            let n = qs.map(it => Number(a.infomation.indexOf(it) !== -1 ? 1 : 0)).reduce((x, y) => x + y)
            return a.stage === q.stage && n !== 0
          })
        } else {
          rows = rows.filter(it => it.stage === q.stage)
        }
      }
      // 排序操作类型 如果存在信息那这步操作可能显得不太有意义，所以排除了信息存在的情况用于节省性能
      if (q.type && rows.length && !q.infomation) {
        rows = rows.sort((a, b) => {
          if (a.type === q.type) {
            if (b.type === q.type) {
              return 0
            } else {
              return -1
            }
          } else {
            if (b.type === q.type) {
              return 1
            } else {
              return 0
            }
          }
        })
      }
      // #region 这部分性能损耗较大，按情况分排，可选择注释
      // 信息筛选，先按关联字数排序
      if (q.infomation && rows.length) {
        let qs = q.infomation.split('')
        rows = rows.sort((a, b) => {
          let aqa = qs.map(it => a.infomation.indexOf(it))
          let bqa = qs.map(it => b.infomation.indexOf(it))
          let an = aqa.filter(it => it !== -1).length
          let bn = bqa.filter(it => it !== -1).length
          if (an > bn) {
            return -1
          } else if(an == bn) {
            aqa = aqa.sort((x, y) => x - y)
            bqa = bqa.sort((x, y) => x - y)
            let al = aqa.map((it, i) => aqa.length > i + 1 ? it - aqa[i + 1] : 0).filter(it => it === 1).length
            let bl = bqa.map((it, i) => bqa.length > i + 1 ? it - bqa[i + 1] : 0).filter(it => it === 1).length
            if (al > bl) {
              return -1
            } else if (al === bl) {
              return 0
            } else {
              return 1
            }
          } else {
            return 1
          }
        })
      }
      // #endregion
      // 收尾处理
      return Array.from(new Set(rows.map(it => it.infomation)))
    } else {
      return []
    }
  }

  /**
   * 存储数据
   * @param s 数据存储对象
   */
  Save(s: CommonSave) {
    if (this.DB) {
      this.DB.add(TableName, 
        [
          { key: 'time', value: s.time },
          { key: 'who', value: s.who },
          { key: 'type', value: s.type },
          { key: 'stage', value: s.stage },
          { key: 'platform', value: s.platform },
          { key: 'infomation', value: s.infomation },
        ]
      )
    }
  }

  /**
   * 初始化数据库
   */
  InitDatabase() {
    this.DB = new CommonStore.WebSqlDb({ 
      name: DatabaseName, 
      version: DatabaseVersion, 
      describ: DatabaseDescrib, 
      size: DatabaseSize, 
      createCallBack: () => {
        this.DB && this.DB.table.create(TableName, TableColumns)
      } 
    })
  }
}