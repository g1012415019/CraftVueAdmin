/**
 * 筛选器组件类型定义
 * 对应 filters/ 目录下的各种筛选器组件
 */

/** 筛选器基础配置接口 */
export interface FilterBaseConfig {
  /** 字段键名 */
  key: string
  /** 显示标签 */
  label: string
  /** 占位符文本 */
  placeholder?: string
  /** 是否禁用 */
  disabled?: boolean
}

/** 输入框筛选器配置 - 对应 FilterInput.vue */
export interface FilterInputConfig extends FilterBaseConfig {
  type: 'input'
  /** 是否大小写敏感 */
  caseSensitive?: boolean
  /** 是否精确匹配 */
  exactMatch?: boolean
}

/** 选择器筛选器配置 - 对应 FilterSelect.vue */
export interface FilterSelectConfig extends FilterBaseConfig {
  type: 'select'
  /** 选项列表 */
  options: Array<{ label: string; value: any }>
  /** 是否多选 */
  multiple?: boolean
}

/** 数字筛选器配置 - 对应 FilterNumber.vue */
export interface FilterNumberConfig extends FilterBaseConfig {
  type: 'number'
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 步长 */
  step?: number
}

/** 日期筛选器配置 - 对应 FilterDate.vue */
export interface FilterDateConfig extends FilterBaseConfig {
  type: 'date'
  /** 日期格式 */
  format?: string
}

/** 日期范围筛选器配置 - 对应 FilterDateRange.vue */
export interface FilterDateRangeConfig extends FilterBaseConfig {
  type: 'daterange'
  /** 日期格式 */
  format?: string
  /** 分隔符 */
  separator?: string
}

/** 复选框筛选器配置 - 对应 FilterCheckbox.vue */
export interface FilterCheckboxConfig extends FilterBaseConfig {
  type: 'checkbox'
  /** 选中值 */
  checkedValue?: any
  /** 未选中值 */
  uncheckedValue?: any
}

/** 单选框筛选器配置 - 对应 FilterRadio.vue */
export interface FilterRadioConfig extends FilterBaseConfig {
  type: 'radio'
  /** 选项列表 */
  options: Array<{ label: string; value: any }>
}

/** 开关筛选器配置 - 对应 FilterSwitch.vue */
export interface FilterSwitchConfig extends FilterBaseConfig {
  type: 'switch'
  /** 选中值 */
  checkedValue?: any
  /** 未选中值 */
  uncheckedValue?: any
}

/** 筛选器配置联合类型 */
export type FilterComponentConfig = 
  | FilterInputConfig
  | FilterSelectConfig
  | FilterNumberConfig
  | FilterDateConfig
  | FilterDateRangeConfig
  | FilterCheckboxConfig
  | FilterRadioConfig
  | FilterSwitchConfig
