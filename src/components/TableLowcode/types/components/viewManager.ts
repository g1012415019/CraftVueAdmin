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
