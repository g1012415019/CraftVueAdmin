import { ref, computed } from 'vue'

/**
 * 筛选管理组合式函数
 * @param initialFilters 初始筛选值
 * @param onSearch 搜索回调函数
 * @param onReset 重置回调函数
 */
export function useFilterManager(
  initialFilters: Record<string, any> = {},
  onSearch?: (filters: Record<string, any>) => void,
  onReset?: () => void
) {
  // ==================== 状态 ====================
  
  const filterValues = ref<Record<string, any>>({ ...initialFilters })
  const filterPresets = ref<any[]>([])
  const isSearching = ref(false)
  const showAdvanced = ref(false)

  // ==================== 计算属性 ====================
  
  /**
   * 获取有效的筛选条件
   */
  const activeFilters = computed(() => {
    return Object.entries(filterValues.value)
      .filter(([_, value]) => value !== null && value !== undefined && value !== '')
      .reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {} as Record<string, any>)
  })
  
  /**
   * 是否有筛选条件
   */
  const hasFilters = computed(() => {
    return Object.keys(activeFilters.value).length > 0
  })
  
  /**
   * 高级筛选数量
   */
  const advancedFilterCount = computed(() => {
    // 这里需要根据具体的筛选配置来计算
    return 0
  })

  // ==================== 基础操作 ====================

  /**
   * 更新筛选字段的值
   */
  const updateFilter = (key: string, value: any) => {
    filterValues.value[key] = value
  }

  /**
   * 重置筛选值
   */
  const resetFilters = (fields?: string[]) => {
    if (fields) {
      fields.forEach(key => {
        filterValues.value[key] = null
      })
    } else {
      Object.keys(filterValues.value).forEach(key => {
        filterValues.value[key] = null
      })
    }
  }

  // ==================== 搜索操作 ====================

  /**
   * 执行搜索
   */
  const handleSearch = () => {
    isSearching.value = true
    
    setTimeout(() => {
      isSearching.value = false
      onSearch?.(activeFilters.value)
    }, 300)
  }

  /**
   * 重置筛选
   */
  const handleReset = () => {
    resetFilters()
    onReset?.()
  }

  /**
   * 高级筛选搜索
   */
  const handleAdvancedSearch = () => {
    handleSearch()
    showAdvanced.value = false
  }

  /**
   * 重置高级筛选
   */
  const handleAdvancedReset = (advancedFields: string[]) => {
    resetFilters(advancedFields)
  }

  /**
   * 切换高级筛选面板
   */
  const toggleAdvanced = () => {
    showAdvanced.value = !showAdvanced.value
  }

  // ==================== 预设管理 ====================

  /**
   * 保存筛选预设
   */
  const saveAsPreset = (name?: string) => {
    if (Object.keys(activeFilters.value).length === 0) {
      return { success: false, message: '请先设置筛选条件' }
    }

    const presetName = name || `筛选预设 ${filterPresets.value.length + 1}`
    const preset = {
      id: Date.now(),
      name: presetName,
      filters: { ...activeFilters.value },
      active: false,
      createTime: new Date().toISOString()
    }
    
    filterPresets.value.push(preset)
    return { success: true, message: `已保存筛选预设：${presetName}`, preset }
  }

  /**
   * 应用筛选预设
   */
  const applyPreset = (preset: any) => {
    resetFilters()
    Object.assign(filterValues.value, preset.filters)
    
    // 更新预设状态
    filterPresets.value.forEach(p => p.active = false)
    preset.active = true
    
    handleSearch()
    return { success: true, message: `已应用筛选预设：${preset.name}` }
  }

  /**
   * 删除筛选预设
   */
  const removePreset = (preset: any) => {
    const index = filterPresets.value.findIndex(p => p.id === preset.id)
    if (index > -1) {
      filterPresets.value.splice(index, 1)
      return { success: true, message: `已删除筛选预设：${preset.name}` }
    }
    return { success: false, message: '预设不存在' }
  }

  // ==================== 工具方法 ====================

  /**
   * 导出筛选配置
   */
  const exportFilters = () => {
    const exportData = {
      filters: filterValues.value,
      presets: filterPresets.value,
      exportTime: new Date().toISOString()
    }
    
    return {
      data: exportData,
      filename: `筛选配置_${new Date().toISOString().split('T')[0]}.json`
    }
  }
  
  /**
   * 导入筛选配置
   */
  const importFilters = (importData: any) => {
    try {
      if (importData.filters) {
        filterValues.value = { ...importData.filters }
      }
      if (importData.presets) {
        filterPresets.value = [...importData.presets]
      }
      return { success: true, message: '筛选配置导入成功' }
    } catch (error) {
      return { success: false, message: '筛选配置导入失败' }
    }
  }

  return {
    // 状态
    filterValues,
    filterPresets,
    isSearching,
    showAdvanced,
    
    // 计算属性
    activeFilters,
    hasFilters,
    advancedFilterCount,
    
    // 基础操作
    updateFilter,
    resetFilters,
    
    // 搜索操作
    handleSearch,
    handleReset,
    handleAdvancedSearch,
    handleAdvancedReset,
    toggleAdvanced,
    
    // 预设管理
    saveAsPreset,
    applyPreset,
    removePreset,
    
    // 工具功能
    exportFilters,
    importFilters
  }
}
