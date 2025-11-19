/**
 * 表格列配置类型定义
 * 用于配置表格列的显示、行为和交互特性
 */
export interface TableColumn {
  /** 列的唯一标识符，用于数据绑定 */
  key: string
  /** 列显示的标题文本 */
  label: string
  /** 列的备用标题，优先级高于 label */
  title?: string
  /** 列是否可见 */
  visible: boolean
  /** 列的固定宽度（像素） */
  width?: number
  /** 列的最小宽度（像素） */
  minWidth?: number
  /** 列的最大宽度（像素） */
  maxWidth?: number
  /** 列是否固定在左侧或右侧 */
  fixed?: 'left' | 'right' | false
  /** 列内容的对齐方式 */
  align?: 'left' | 'center' | 'right'
  /** 列是否支持排序 */
  sortable?: boolean
  /** 列宽是否可调整 */
  resizable?: boolean
  /** 内容过长时是否显示省略号 */
  ellipsis?: boolean
  /** 列的过滤器类型 */
  filterType?: 'input' | 'select' | 'number' | 'date' | 'daterange'
  /** 选择类型过滤器的选项列表 */
  filterOptions?: string[]
  /** 字段是否被选中（用于批量操作） */
  selected?: boolean
}
