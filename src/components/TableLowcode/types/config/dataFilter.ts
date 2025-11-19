/**
 * 数据过滤表单类型定义
 * 对应 Config/forms/DataFilterForm.vue
 */

/** 数据过滤配置接口 */
export interface DataFilterConfig {
  /** 是否启用数据过滤 */
  enabled?: boolean
  /** 过滤条件组列表 */
  groups?: Array<{
    /** 条件组名称 */
    name?: string
    /** 条件组内的逻辑关系（AND/OR） */
    logic?: 'AND' | 'OR'
    /** 具体的筛选条件列表 */
    conditions?: Array<{
      /** 筛选字段名 */
      field: string
      /** 筛选操作符（equals、contains、gt、lt等） */
      operator: string
      /** 筛选值 */
      value: any
    }>
  }>
  /** 条件组之间的逻辑关系 */
  groupLogic?: 'AND' | 'OR'
}
