/**
 * 排序设置表单类型定义
 * 对应 Config/forms/SortSettingsForm.vue
 */

import type { TableColumn } from '../table/column'

/** 排序字段扩展接口 */
export interface SortableField extends TableColumn {
  /** 字段是否被选中（用于批量操作） */
  selected?: boolean
  /** 排序类型 */
  sortType?: 'text' | 'number' | 'date'
  /** 默认排序方向 */
  defaultOrder?: 'asc' | 'desc'
}

/** 排序配置接口 */
export interface SortConfig {
  /** 是否启用排序 */
  enabled?: boolean
  /** 默认排序字段 */
  defaultField?: string
  /** 默认排序方向 */
  defaultDirection?: 'asc' | 'desc'
  /** 多列排序配置 */
  multiSort?: boolean
  /** 排序字段列表 */
  fields?: SortableField[]
}
