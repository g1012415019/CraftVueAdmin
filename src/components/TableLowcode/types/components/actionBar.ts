/**
 * 操作栏配置类型定义
 * 对应 components/ActionBar.vue 组件
 */

/** 操作栏配置接口 */
export interface ActionBarConfig {
  /** 是否启用操作栏 */
  enabled?: boolean
  /** 是否显示新增按钮 */
  showCreate?: boolean
  /** 是否显示导入按钮 */
  showImport?: boolean
  /** 是否显示导出按钮 */
  showExport?: boolean
  /** 是否显示刷新按钮 */
  showRefresh?: boolean
}
