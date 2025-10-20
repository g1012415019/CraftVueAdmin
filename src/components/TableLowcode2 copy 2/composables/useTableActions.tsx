import { ref, computed } from 'vue'

export function useTableActions(config) {
  // 选中的行键
  const checkedRowKeys = ref([])

  // 批量操作配置
  const batchActions = computed(() => [
    {
      key: 'delete',
      label: '批量删除',
      type: 'error'
    },
    {
      key: 'export',
      label: '导出选中',
      type: 'default'
    },
    {
      key: 'edit',
      label: '批量编辑',
      type: 'primary'
    }
  ])

  // 处理批量操作
  const handleBatchAction = (action) => {
    console.log('批量操作:', action.key, '选中行:', checkedRowKeys.value)
    
    switch (action.key) {
      case 'delete':
        // 批量删除逻辑
        if (confirm('确定要删除选中的记录吗？')) {
          console.log('执行批量删除')
          config.value.events?.onBatchDelete?.(checkedRowKeys.value)
        }
        break
      case 'export':
        // 导出选中记录
        console.log('导出选中记录')
        config.value.events?.onBatchExport?.(checkedRowKeys.value)
        break
      case 'edit':
        // 批量编辑
        console.log('批量编辑')
        config.value.events?.onBatchEdit?.(checkedRowKeys.value)
        break
    }
  }

  // 处理新增
  const handleCreate = () => {
    console.log('新增记录')
    config.value.events?.onCreate?.()
  }

  // 处理打印
  const handlePrint = () => {
    console.log('打印表格')
    window.print()
  }

  // 处理全屏
  const handleFullscreen = () => {
    console.log('全屏显示')
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  // 处理刷新
  const handleRefreshView = () => {
    console.log('刷新数据')
    config.value.events?.onRefresh?.()
  }

  // 更新选中行
  const updateCheckedRowKeys = (keys) => {
    console.log('更新选中行:', keys)
    checkedRowKeys.value = keys
  }

  return {
    checkedRowKeys,
    batchActions,
    handleBatchAction,
    handleCreate,
    handlePrint,
    handleFullscreen,
    handleRefreshView,
    updateCheckedRowKeys
  }
}
