/**
 * 数据表格配置类型定义
 * 对应 Table/DataTable.vue 组件
 */

/** 数据表格排序配置接口 */
export interface DataTableSortConfig {
  /** 是否启用排序功能 */
  enabled?: boolean
  /** 默认排序字段 */
  defaultField?: string
  /** 默认排序方向 */
  defaultOrder?: 'asc' | 'desc'
  /** 是否支持多字段排序 */
  multiple?: boolean
}
