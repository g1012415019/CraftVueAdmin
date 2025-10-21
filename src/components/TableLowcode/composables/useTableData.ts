import { ref, computed, type Ref } from 'vue'

export function useTableData(config: Ref<any>) {
  const totalCount = ref(1250)
  const filteredCount = ref(1250)
  const currentPage = ref(1)
  const currentPageSize = ref(10)
  const filterValues = ref({})
  const showAdvancedFilter = ref(false)

  const statusOptions = ref([
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ])

  const filterFields = computed(() => {
    return config.value?.filters?.selectedFieldsConfig || []
  })

  const filterBarFields = computed(() => {
    const currentViewKey = config?.value?.currentViewKey || 'all'
    const currentView = config?.value?.views?.find(v => v.key === currentViewKey)
    
    console.log('重新计算筛选字段:', currentViewKey)
    
    // 优先使用主配置的 filters
    if (config?.value?.filters && Array.isArray(config.value.filters)) {
      const fields = config.value.filters.filter(f => f.show !== false)
      console.log('使用主配置筛选字段:', fields)
      return fields
    }
    
    // 其次使用视图配置的 filters
    if (currentView?.config?.filters) {
      const fields = currentView.config.filters.filter(f => f.show !== false)
      console.log('使用视图配置筛选字段:', fields)
      return fields
    }
    
    console.log('使用默认筛选字段:', filterFields.value)
    return filterFields.value
  })
  
  // 筛选可见性 - 有筛选字段时显示
  const filterVisible = computed(() => {
    const hasFields = filterBarFields.value.length > 0
    console.log('筛选可见性:', hasFields, '字段数量:', filterBarFields.value.length)
    return hasFields
  })
  const advancedFilterFields = computed(() => {
    const currentViewKey = config?.value?.currentViewKey || 'all'
    const currentView = config?.value?.views?.find(v => v.key === currentViewKey)
    
    if (currentView?.config?.filters) {
      const advancedFields = currentView.config.filters.filter(f => f.advancedFilter && f.show !== false)
      console.log('高级筛选字段:', advancedFields)
      return advancedFields
    }
    
    return filterFields.value.filter(field => field.advancedFilter)
  })
  const pageCount = computed(() => Math.ceil(totalCount.value / currentPageSize.value))

  const advancedFilterCount = computed(() => {
    let count = 0
    advancedFilterFields.value.forEach(field => {
      const value = filterValues.value[field.key]
      if (field.type === 'numberRange') {
        if (filterValues.value[field.key + 'Min'] || filterValues.value[field.key + 'Max']) count++
      } else if (field.type === 'multiSelect' && value?.length > 0) {
        count++
      } else if (value) {
        count++
      }
    })
    return count
  })

  const updateFilter = (key: string, value: any) => {
    filterValues.value[key] = value
  }

  const handleSearch = () => config?.value?.onSearch?.(filterValues.value)
  const handleReset = () => Object.keys(filterValues.value).forEach(key => filterValues.value[key] = null)
  const handleAdvancedSearch = () => {
    showAdvancedFilter.value = false
    config?.value?.onAdvancedSearch?.(filterValues.value)
  }
  const handleAdvancedReset = () => handleReset()
  const handleRefreshView = () => console.log('刷新视图')

  return {
    totalCount,
    filteredCount,
    currentPage,
    currentPageSize,
    pageCount,
    filterValues,
    showAdvancedFilter,
    filterVisible,
    filterBarFields,
    advancedFilterFields,
    advancedFilterCount,
    updateFilter,
    handleSearch,
    handleReset,
    handleAdvancedSearch,
    handleAdvancedReset,
    handleRefreshView
  }
}
