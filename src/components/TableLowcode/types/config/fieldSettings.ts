/**
 * 字段设置表单类型定义
 * 对应 Config/forms/FieldSettingsForm.vue
 */

import type { TableColumn } from '../table/column'

/** 字段设置配置接口 */
export interface FieldSettingsConfig {
  /** 字段列表 */
  fields?: TableColumn[]
  /** 字段可见性配置 */
  visibility?: Record<string, boolean>
  /** 字段排序配置 */
  order?: string[]
}
