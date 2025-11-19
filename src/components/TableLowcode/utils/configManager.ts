import type { BasicSettingsConfig } from '../types/config/basicSettings'
import type { PaginationSettingsConfig } from '../types/config/paginationSettings'
import type { SortConfig } from '../types/config/sortSettings'
import type { FilterListConfig } from '../types/components/filterSection'
import type { FieldSettingsConfig } from '../types/config/fieldSettings'
import type { DataFilterConfig } from '../types/config/dataFilter'
import { cloneDeep } from 'lodash-es'
/**
 * 配置管理类
 * 统一管理各模块的默认配置
 */
export class ConfigManager {
  
  /**
   * 获取基础配置默认值
   */
  static getBasicDefaults(): BasicSettingsConfig {
    return {
      title: '默认视图',
      description: '',
      size: 'medium',
      bordered: true,
      striped: false,
      hoverable: true
    }
  }

  /**
   * 获取分页配置默认值
   */
  static getPaginationDefaults(): PaginationSettingsConfig {
    return {
      enabled: true,
      pageSize: 10,
      pageSizes: [10, 20, 50, 100],
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: true,
      position: 'bottom'
    }
  }

  /**
   * 获取排序配置默认值
   */
  static getSortDefaults(): SortConfig {
    return {
      enabled: true,
      defaultField: '',
      defaultDirection: 'asc',
      multiSort: false,
      fields: []
    }
  }

  /**
   * 获取筛选配置默认值
   */
  static getFilterListDefaults(): FilterListConfig {
    return {
      enabled: true,
      filters: []
    }
  }

  /**
   * 获取字段设置默认值
   */
  static getFieldSettingsDefaults(): FieldSettingsConfig {
    return {
      fields: [],
      visibility: {},
      order: []
    }
  }

  /**
   * 获取数据筛选默认值
   */
  static getDataFilterDefaults(): DataFilterConfig {
    return {
      enabled: true,
      filters: []
    }
  }

  /**
   * 初始化视图的完整默认配置
   */
  static initializeViewConfig(view: any): any {
    // 保存初始默认配置，合并传入的 view 配置
    if (!view._initialConfig) {
      view._initialConfig = {
        basic: { ...this.getBasicDefaults(), ...view.basic },
        pagination: { ...this.getPaginationDefaults(), ...view.pagination },
        sort: { ...this.getSortDefaults(), ...view.sort },
        filterList: { ...this.getFilterListDefaults(), ...view.filterList },
        dataFilter: { ...this.getDataFilterDefaults(), ...view.dataFilter },
        columnVisibility: { ...view.columnVisibility },
        columns: [...(view.columns || [])]
      }
    }

    // 只初始化不存在的配置
    if (!view.basic) {
      view.basic = this.getBasicDefaults()
    }
    
    if (!view.pagination) {
      view.pagination = this.getPaginationDefaults()
    }
    
    if (!view.sort) {
      view.sort = this.getSortDefaults()
    }
    
    if (!view.filterList) {
      view.filterList = this.getFilterListDefaults()
    }

    if (!view.dataFilter) {
      view.dataFilter = this.getDataFilterDefaults()
    }
    
    if (!view.columnVisibility) {
      view.columnVisibility = {}
    }

    return view
  }





  /**
   * 批量初始化所有视图配置
   */
  static initializeAllViews(config: any): any {
    if (!config.views) return config
    
    config.views.forEach((view: any) => {
      this.initializeViewConfig(view)
    })

    config._initialConfig= cloneDeep(config.views[0]._initialConfig);
    
    return config
  }
}
