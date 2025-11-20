/**
 * 表格区域配置类型定义
 * 对应 components/TableSection.vue 组件
 */

/** 基础配置接口 */
export interface BasicConfig {
  /** 行高设置 */
  rowHeight?: 'compact' | 'medium' | 'large' | 'extra-large'
  /** 显示序号列 */
  showIndex?: boolean
  /** 显示记录快捷方式 */
  showRecordShortcut?: boolean
  /** 显示汇总行 */
  showSummaryRow?: boolean
  /** 显示垂直分隔线 */
  showVerticalLines?: boolean
  /** 显示行交替色 */
  showAlternateRowColors?: boolean
  /** 标题自动换行 */
  headerTextWrap?: boolean
  /** 交互模式 */
  interactionMode?: 'classic' | 'spreadsheet'
  /** 启用行内编辑 */
  allowInlineEdit?: boolean
  /** 自动刷新数据 */
  autoRefresh?: boolean
  /** 自动刷新间隔（秒） */
  autoRefreshInterval?: number
  
  // 兼容属性
  /** 是否显示边框 */
  bordered?: boolean
  /** 是否显示斑马纹 */
  striped?: boolean
  /** 是否显示加载状态 */
  loading?: boolean
  /** 表格尺寸 */
  size?: 'small' | 'medium' | 'large'
  /** 是否悬停高亮 */
  hoverable?: boolean
  /** 空状态提示文本 */
  emptyText?: string
}
