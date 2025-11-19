/**
 * 表格区域配置类型定义
 * 对应 components/TableSection.vue 组件
 */

/** 基础配置接口 */
export interface BasicConfig {
  // 行高设置
  /** 行高：紧凑、中等、高、超高 */
  rowHeight?: 'compact' | 'medium' | 'large' | 'extra-large'
  
  // 显示设置
  /** 显示序号 */
  showIndex?: boolean
  /** 显示记录快捷方式 */
  showRecordShortcut?: boolean
  /** 显示汇总行 */
  showSummaryRow?: boolean
  /** 显示垂直表格线 */
  showVerticalLines?: boolean
  /** 显示交替行颜色 */
  showAlternateRowColors?: boolean
  /** 标题行文字换行 */
  headerTextWrap?: boolean
  
  // 表格交互方式
  /** 交互模式：经典模式、点整行打开记录、电子表格模式 */
  interactionMode?: 'classic' | 'row-click' | 'spreadsheet'
  
  // 更多设置
  /** 允许行内编辑 */
  allowInlineEdit?: boolean
  
  // 自动刷新
  /** 自动刷新开关 */
  autoRefresh?: boolean
  /** 自动刷新间隔（秒） */
  autoRefreshInterval?: number
  
  // 兼容旧配置
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
