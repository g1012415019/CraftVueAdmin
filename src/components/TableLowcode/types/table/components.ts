/**
 * 表格组件类型定义
 * 对应 Table/ 目录下的各种表格相关组件
 */

/** 列头下拉菜单配置接口 - 对应 ColumnHeaderDropdown.vue */
export interface ColumnHeaderDropdownConfig {
  /** 菜单项列表 */
  items: Array<{
    /** 菜单项键名 */
    key: string
    /** 菜单项标签 */
    label: string
    /** 菜单项图标 */
    icon?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 点击处理函数 */
    onClick?: () => void
  }>
}

/** 浮动操作栏配置接口 - 对应 FloatingActionBar.vue */
export interface FloatingActionBarConfig {
  /** 是否显示 */
  visible?: boolean
  /** 操作按钮列表 */
  actions: Array<{
    /** 按钮键名 */
    key: string
    /** 按钮标签 */
    label: string
    /** 按钮类型 */
    type?: 'default' | 'primary' | 'success' | 'warning' | 'error'
    /** 按钮图标 */
    icon?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 点击处理函数 */
    onClick?: () => void
  }>
  /** 显示位置 */
  position?: 'top' | 'bottom' | 'fixed'
}
