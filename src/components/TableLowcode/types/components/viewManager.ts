/**
 * 视图管理器配置类型定义
 * 对应 components/ViewManager/ 目录下的视图管理组件
 */

/** 视图配置接口 - 对应 ViewManager/index.vue */
export interface ViewConfig {
  /** 视图唯一标识 */
  key: string
  /** 视图显示名称 */
  label: string
  /** 视图描述 */
  description?: string
  /** 是否为默认视图 */
  isDefault?: boolean
  /** 视图图标 */
  icon?: string
}

/** 视图标签页配置接口 - 对应 ViewTabs.vue */
export interface ViewTabsConfig {
  /** 当前激活的视图 */
  activeView: string
  /** 视图列表 */
  views: ViewConfig[]
  /** 是否显示添加按钮 */
  showAddButton?: boolean
  /** 标签页类型 */
  type?: 'line' | 'card' | 'segment'
}

/** 视图操作配置接口 - 对应 ViewActions.vue */
export interface ViewActionsConfig {
  /** 是否显示编辑按钮 */
  showEdit?: boolean
  /** 是否显示复制按钮 */
  showCopy?: boolean
  /** 是否显示删除按钮 */
  showDelete?: boolean
  /** 是否显示设置按钮 */
  showSettings?: boolean
}

/** 视图上下文菜单配置接口 - 对应 ViewContextMenu.vue */
export interface ViewContextMenuConfig {
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
    /** 是否显示分隔线 */
    divider?: boolean
  }>
}
