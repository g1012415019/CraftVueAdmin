/**
 * 配置面板类型定义
 * 对应 Config/ConfigPanel.vue
 */

/** 配置面板 Props 接口 */
export interface ConfigPanelProps {
  /** 是否显示配置面板 */
  show: boolean
  /** 表格ID */
  tableId?: string
  /** 当前视图名称 */
  currentViewName?: string
  /** 视图键名 */
  viewKey?: string
  /** 当前视图配置对象 */
  viewConfig: any
}
