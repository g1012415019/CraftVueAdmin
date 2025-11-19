/**
 * 表格区域配置类型定义
 * 对应 components/TableSection.vue 组件
 */

/** 基础配置接口 */
export interface BasicConfig {
  /** 表格标题 */
  title?: string
  /** 表格描述信息 */
  description?: string
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示斑马纹 */
  striped?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 表格尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 行高密度 */
  density?: 'compact' | 'default' | 'comfortable'

  /** 是否悬停高亮 */
  hoverable?: boolean

  /** 空状态提示文本 */
  emptyText?: string
}
