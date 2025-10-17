import { inject, ref, computed, watch, onMounted } from 'vue'

export function useTableData() {
  // 注入共享的配置状态
  const config = inject('tableConfig')

  // 模拟数据
  const mockData = ref([
    { key: 1, name: '张三', age: 28, address: '北京市朝阳区', email: 'zhangsan@example.com', status: 'active', createTime: '2023-01-01' },
    { key: 2, name: '李四', age: 32, address: '上海市浦东新区', email: 'lisi@example.com', status: 'inactive', createTime: '2023-02-15' },
    { key: 3, name: '王五', age: 24, address: '广州市天河区', email: 'wangwu@example.com', status: 'active', createTime: '2023-03-20' },
    { key: 4, name: '赵六', age: 35, address: '深圳市南山区', email: 'zhaoliu@example.com', status: 'active', createTime: '2023-04-10' },
    { key: 5, name: '钱七', age: 29, address: '杭州市西湖区', email: 'qianqi@example.com', status: 'inactive', createTime: '2023-05-05' },
    { key: 6, name: '孙八', age: 40, address: '成都市武侯区', email: 'sunba@example.com', status: 'active', createTime: '2023-06-18' },
    { key: 7, name: '周九', age: 22, address: '武汉市洪山区', email: 'zhoujiu@example.com', status: 'active', createTime: '2023-07-22' },
    { key: 8, name: '吴十', age: 30, address: '南京市玄武区', email: 'wushi@example.com', status: 'inactive', createTime: '2023-08-01' },
    { key: 9, name: '郑十一', age: 26, address: '重庆市渝北区', email: 'zhengshiyi@example.com', status: 'active', createTime: '2023-09-11' },
    { key: 10, name: '冯十二', age: 33, address: '苏州市工业园区', email: 'fengshier@example.com', status: 'active', createTime: '2023-10-25' },
  ])

  // 当前分页状态
  const currentPage = ref(1)
  const currentPagesize = ref(
    config.value.pagination?.pageSizeOptions?.split(',')[0]
      ? parseInt(config.value.pagination.pageSizeOptions.split(',')[0])
      : 10
  )

  // 过滤和排序状态
  const currentFilters = ref({})
  const currentSorter = ref({
    columnKey: config.value.sortFilter?.defaultSort?.key || null,
    order: config.value.sortFilter?.defaultSort?.order || false
  })

  // 数据加载状态
  const loading = ref(false)

  // 表格数据
  const tableData = ref([])

  // 总数据量（用于后端分页）
  const totalCount = ref(0)

  // 选中的行
  const checkedRowKeys = ref([])

  // 模拟API请求
  const fetchData = async () => {
    loading.value = true

    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500))

      if (config.value.sortFilter?.filterMode === 'backend' || config.value.sortFilter?.sortMode === 'backend') {
        // 后端处理过滤和排序
        console.log('向后端发送请求，参数:', {
          page: currentPage.value,
          pageSize: currentPagesize.value,
          filters: currentFilters.value,
          sorter: currentSorter.value
        })

        // 模拟后端响应
        let result = [...mockData.value]

        // 模拟后端过滤
        if (config.value.sortFilter?.filterMode === 'backend') {
          result = result.filter(row => {
            for (const key in currentFilters.value) {
              const filterValue = currentFilters.value[key]
              if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
                const rowValue = String(row[key]).toLowerCase()
                if (!rowValue.includes(String(filterValue).toLowerCase())) {
                  return false
                }
              }
            }
            return true
          })
        }

        // 模拟后端排序
        if (config.value.sortFilter?.sortMode === 'backend' && currentSorter.value.columnKey) {
          result.sort((a, b) => {
            const aVal = a[currentSorter.value.columnKey]
            const bVal = b[currentSorter.value.columnKey]
            if (currentSorter.value.order === 'ascend') {
              return aVal > bVal ? 1 : -1
            } else if (currentSorter.value.order === 'descend') {
              return aVal < bVal ? 1 : -1
            }
            return 0
          })
        }

        totalCount.value = result.length

        // 模拟分页
        if (config.value.pagination?.enabled) {
          const start = (currentPage.value - 1) * currentPagesize.value
          const end = start + currentPagesize.value
          result = result.slice(start, end)
        }

        tableData.value = result
      } else {
        // 前端处理，直接返回所有数据
        tableData.value = [...mockData.value]
        totalCount.value = mockData.value.length
      }

      // Initialize checkedRowKeys based on defaultSelectedRowKeys
      if (config.value.selection?.enabled && config.value.selection?.defaultSelectedRowKeys) {
        checkedRowKeys.value = tableData.value
          .filter(config.value.selection.defaultSelectedRowKeys)
          .map(row => row.key)
      }

    } catch (error) {
      console.error('获取数据失败:', error)
    } finally {
      loading.value = false
    }
  }

  // 分页配置
  const paginationConfig = computed(() => {
    if (!config.value.pagination?.enabled) return false

    return {
      page: currentPage.value,
      pageSize: currentPagesize.value,
      itemCount: totalCount.value,
      pageSizes: config.value.pagination.pageSizeOptions?.split(',').map(size => parseInt(size.trim())) || [10, 20, 50, 100],
      showSizePicker: config.value.pagination.showSizeChanger,
      showQuickJumper: config.value.pagination.showQuickJumper,
      onUpdatePage: (page) => {
        currentPage.value = page
        fetchData()
      },
      onUpdatePageSize: (pageSize) => {
        currentPagesize.value = pageSize
        currentPage.value = 1
        fetchData()
      }
    }
  })

  // 批量操作处理
  const handleBatchAction = (action) => {
    if (action.showConfirmation) {
      window.$dialog?.warning({
        title: '确认操作',
        content: `确定要${action.label}选中的 ${checkedRowKeys.value.length} 条记录吗？`,
        positiveText: '确定',
        onPositiveClick: () => {
          if (action.onClick) {
            action.onClick(checkedRowKeys.value)
          } else {
            console.log(`Batch action "${action.label}" confirmed for keys:`, checkedRowKeys.value)
          }
        },
        negativeText: '取消'
      })
    } else {
      if (action.onClick) {
        action.onClick(checkedRowKeys.value)
      } else {
        console.log(`Batch action "${action.label}" clicked for keys:`, checkedRowKeys.value)
      }
    }
  }

  // 排序变化处理
  const handleSorterChange = (sorter) => {
    currentSorter.value = sorter
    if (config.value.sortFilter?.sortMode === 'backend') {
      fetchData()
    }
  }

  // 筛选变化处理
  const handleFiltersChange = (filters) => {
    currentFilters.value = filters
    if (config.value.sortFilter?.filterMode === 'backend') {
      currentPage.value = 1
      fetchData()
    }
  }

  // 初始化数据
  onMounted(() => {
    fetchData()
  })

  return {
    tableData,
    loading,
    paginationConfig,
    checkedRowKeys,
    fetchData,
    handleBatchAction,
    handleSorterChange,
    handleFiltersChange,
    currentPage,
    currentPagesize,
  }
}
