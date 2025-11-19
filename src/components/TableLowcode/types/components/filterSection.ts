/**
 * 筛选区域配置类型定义
 * 对应 components/FilterSection.vue 组件
 */

/** 筛选器字段配置接口 */
export interface FilterFieldConfig {
  /** 字段键名 */
  key: string
  /** 显示标签 */
  label: string
  /** 筛选器类型 */
  type: 'input' | 'select' | 'number' | 'date' | 'daterange' | 'checkbox' | 'radio' | 'switch'
  /** 显示位置：基础筛选栏或高级筛选抽屉 */
  position: 'basic' | 'advanced' | 'both'
  /** 选择类型筛选器的选项列表 */
  options?: Array<{ label: string; value: any }>
}

/** 筛选列表配置接口 */
export interface FilterListConfig {
  /** 筛选字段的详细配置 */
  filters?: FilterFieldConfig[]
}
