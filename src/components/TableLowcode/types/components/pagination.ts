/**
 * 分页配置类型定义
 * 对应 components/PaginationBar.vue 组件
 */

/** 分页配置接口 */
export interface PaginationConfig {
  /** 是否启用分页功能 */
  enabled?: boolean
  pageSize?: number
  /** 当前页码 */
  currentPage?: number
  /** 当前每页显示条数 */
  currentPageSize?: number
  /** 每页显示条数选项列表 */
  pageSizes?: number[]
}
