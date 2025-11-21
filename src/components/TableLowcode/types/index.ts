/**
 * TableLowcode 组件类型定义统一导出
 * 
 * 按功能模块组织类型定义：
 * - 基础类型：表格列、数据等
 * - 组件类型：各功能组件配置
 * - 配置类型：配置表单相关
 * - 外部接口：对外暴露的接口
 */

// ==================== 基础类型 ====================
export type { TableColumn } from './table/column'

// ==================== 组件类型 ====================
export type { PaginationConfig } from './components/pagination'
export type { FilterListConfig } from './components/filterSection'
export type { BasicConfig } from './components/tableSection'
export type { ViewConfig } from './components/viewManager'

// ==================== 配置类型 ====================
export type { 
  BasicSettingsConfig,
  PaginationSettingsConfig,
  FieldSettingsConfig,
  ConfigPanelProps 
} from './config/forms'

// 数据过滤配置
export type { 
  DataFilterConfig,
  FilterCondition,
  FilterGroup
} from './config/dataFilter'

// 排序配置
export type { 
  SortConfig,
  SortableField
} from './config/sortSettings'

// 筛选列表配置
export type { FilterListSettingsConfig } from './config/filterListSettings'

// ==================== 外部接口 ====================
export type { ExternalConfig, FeatureConfig } from './external'
