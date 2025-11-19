/**
 * 过滤器配置类型定义
 * 用于配置表格列的过滤功能和交互方式
 */
export interface FilterConfig {
  /** 过滤器对应的数据字段键名 */
  key: string
  /** 过滤器显示的标签文本 */
  label: string
  /** 过滤器类型，支持输入框、选择器、数字、日期等 */
  filterType: 'input' | 'select' | 'number' | 'date' | 'daterange'
  /** 过滤器是否显示 */
  show?: boolean
  /** 选项列表（用于select等类型） */
  options?: string[]
  /** 是否为高级过滤器 */
  advancedFilter?: boolean
  /** 过滤器输入框的占位符文本 */
  placeholder?: string
}
