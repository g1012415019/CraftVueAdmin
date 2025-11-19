/**
 * 外部配置类型定义
 * 用于定义外部传入的配置对象结构
 * 
 * 设计理念：
 * - 数据与视图分离：data 存储原始数据，views 定义不同的展示方式
 * - 配置继承覆盖：全局配置作为基础，视图配置可以覆盖特定项
 * - 减少重复配置：相同配置只需在全局定义一次
 */

import type { TableColumn } from './table/column'
import type { BasicConfig } from './components/tableSection'
import type { ActionBarConfig } from './components/actionBar'
import type { PaginationConfig } from './components/pagination'
import type { FilterListConfig } from './components/filterSection'
import type { SortConfig } from './config/sortSettings'
import type { DataFilterConfig } from './config/dataFilter'
import { BasicSettingsConfig } from './config/basicSettings'

/** 基础表格配置接口 */
export interface BaseTableConfig {
  /** 基础配置 - 控制表格的基本外观和行为特性 */
  basic?: BasicSettingsConfig
  
  /** 列配置 - 定义表格列的显示、样式和交互行为 */
  columns?: TableColumn[]
  
  /** 分页配置 - 控制数据分页显示的行为和样式 */
  pagination?: PaginationConfig
  
  /** 操作栏配置 - 控制表格顶部操作按钮的显示 */
  actionBar?: ActionBarConfig
  
  /** 排序配置 - 控制数据排序的行为和默认状态 */
  sort?: SortConfig
  
  /** 筛选列表配置 - 控制表格顶部快速筛选栏的显示和行为 */
  filterList?: FilterListConfig
}

/** 视图特定配置接口 */
export interface ViewSpecificConfig {
  /** 
   * 列可见性覆盖
   * 只需指定与全局配置不同的列可见性
   */
  columnVisibility?: Record<string, boolean>
  
  /** 
   * 数据过滤配置
   * 定义该视图特有的数据筛选条件
   */
  dataFilter?: DataFilterConfig
}

/** 外部配置接口 */
export interface ExternalConfig {
  _initialConfig:any
  /** 
   * 表格数据
   * 所有视图共享的原始数据源，支持任意结构的对象数组
   */
  data?: any[]

  /** 列配置 - 定义表格列的显示、样式和交互行为 */
  columns?: TableColumn[]
  
  /** 
   * 全局默认配置
   * 作为所有视图的基础配置，视图可以覆盖特定项
   */
  defaultConfig?: BaseTableConfig
  
  /** 
   * 视图配置列表
   * 定义不同的数据展示方式，继承全局配置并可覆盖特定项
   */
  views?: Array<{
    /** 视图唯一标识，用于视图切换和状态管理 */
    key: string
    /** 视图显示名称，在视图切换器中显示 */
    label: string
    /** 视图描述信息，用于说明视图的用途和特点 */
    description?: string
  } & Partial<BaseTableConfig> & ViewSpecificConfig>
}

/** 
 * 功能特性配置接口
 * 定义表格的高级功能开关
 */
export interface FeatureConfig {
  /** 是否启用行选择功能（复选框） */
  selection?: boolean
  /** 是否启用拖拽排序功能 */
  draggable?: boolean
  /** 是否启用虚拟滚动（大数据量优化） */
  virtualScroll?: boolean
  /** 是否启用右键菜单 */
  contextMenu?: boolean
}
