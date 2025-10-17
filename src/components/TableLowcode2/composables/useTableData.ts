import { ref, computed, type Ref } from 'vue'

export function useTableData(config: Ref<any>) {
  const totalCount = ref(1250)
  const filteredCount = ref(1250)
  const currentPage = ref(1)
  const currentPageSize = ref(10)
  const filterValues = ref({})
  const showAdvancedFilter = ref(false)
  const filterVisible = ref(true)

  const statusOptions = ref([
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' }
  ])

  const filterFields = computed(() => {
    return config.value?.filters?.selectedFieldsConfig || []
  })

  const filterBarFields = computed(() => filterFields.value)
  const advancedFilterFields = computed(() => filterFields.value.filter(field => field.advancedFilter))
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
