/**
 * 数据过滤表单类型定义
 * 对应 Config/forms/DataFilterForm.vue
 */

/** 过滤条件接口 */
export interface FilterCondition {
  /** 筛选字段名 */
  field: string
  /** 筛选操作符（equals、contains、gt、lt等） */
  operator: string
  /** 筛选值 */
  value: any
  /** 条件间的逻辑关系 */
  logic?: 'AND' | 'OR'
  /** 范围操作的最小值 */
  minValue?: number
  /** 范围操作的最大值 */
  maxValue?: number
}

/** 条件组接口 */
export interface FilterGroup {
  /** 条件组名称 */
  name?: string
  /** 条件组内的逻辑关系（AND/OR） */
  logic?: 'AND' | 'OR'
  /** 该组与下一组的逻辑关系 */
  groupLogic?: 'AND' | 'OR'
  /** 具体的筛选条件列表 */
  conditions?: FilterCondition[]
}

/** 数据过滤配置接口 */
export interface DataFilterConfig {
  /** 是否启用过滤 */
  enabled?: boolean
  /** 过滤条件组列表 */
  groups?: FilterGroup[]
}
