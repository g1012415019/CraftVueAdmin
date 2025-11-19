/**
 * TableLowcode 组件类型定义统一导出
 * 
 * 完全按照组件目录层次组织类型定义，一一对应：
 * - components/ 目录对应各组件配置
 * - table/ 目录对应表格相关配置  
 * - filters/ 目录对应筛选器组件
 * - config/ 目录对应配置表单
 * - external 组合所有类型
 */

// 组件类型 - 对应 components/ 目录
export type { ActionBarConfig } from './components/actionBar'
export type { PaginationConfig } from './components/pagination'
export type { FilterListConfig } from './components/filterSection'
export type { BasicConfig } from './components/tableSection'
export type { 
  ViewConfig, 
  ViewTabsConfig, 
  ViewActionsConfig, 
  ViewContextMenuConfig 
} from './components/viewManager'

// 表格类型 - 对应 Table/ 目录
export type { TableColumn } from './table/column'
export type { DataTableSortConfig } from './table/dataTable'
export type { 
  ColumnHeaderDropdownConfig, 
  FloatingActionBarConfig 
} from './table/components'

// 筛选器类型 - 对应 filters/ 目录
export type { FilterConfig } from './filters/filter'
export type { 
  FilterBaseConfig,
  FilterInputConfig,
  FilterSelectConfig,
  FilterNumberConfig,
  FilterDateConfig,
  FilterDateRangeConfig,
  FilterCheckboxConfig,
  FilterRadioConfig,
  FilterSwitchConfig,
  FilterComponentConfig
} from './filters'

// 配置类型 - 对应 Config/ 目录
export type { 
  DataFilterConfig, 
  SortConfig,
  SortableField,
  BasicSettingsConfig,
  PaginationSettingsConfig,
  FilterListSettingsConfig,
  FieldSettingsConfig,
  ConfigPanelProps 
} from './config/forms'

// 外部接口
export type { ExternalConfig, FeatureConfig } from './external'
