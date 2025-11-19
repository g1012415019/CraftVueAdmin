/**
 * 分页设置表单类型定义
 * 对应 Config/forms/PaginationSettingsForm.vue
 */

import type { PaginationConfig } from '../components/pagination'

/** 分页设置配置接口 */
export interface PaginationSettingsConfig extends PaginationConfig {
  /** 每页显示条数选项 */
  pageSizeOptions?: number[]
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean
  /** 是否显示总数信息 */
  showSizeChanger?: boolean
}
