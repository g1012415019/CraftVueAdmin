import { ref, computed, nextTick, type Ref } from 'vue'
import { useTableConfigStore } from '@/store/modules/tableConfig'

export function useViewManager(config: Ref<any>, emit: any) {
  const tableStore = useTableConfigStore()
  const tableId = 'default'
  
  const currentView = ref('all')
  const viewTabs = ref([])
  const currentViewName = ref('默认视图')
  
  // 更新视图列表
  const updateViewTabs = () => {
    if (config?.value?.views && Array.isArray(config.value.views)) {
      viewTabs.value = config.value.views.map(view => ({
        ...view,
        count: 0, // 暂时设为0，避免递归
        description: view.description || `${view.label} - 自定义视图`,
        isDefault: view.key === 'all',
        isCustom: view.key !== 'all'
      }))
    } else {
      const storeViews = tableStore.getViews(tableId)
      const defaultView = {
        key: 'default',
        label: '默认视图',
        count: 0,
        description: '默认数据视图',
        isDefault: true,
        isCustom: false
      }
      
      if (storeViews.length === 0) {
        viewTabs.value = [defaultView]
      } else {
        const hasDefault = storeViews.some(v => v.key === 'default')
        viewTabs.value = hasDefault ? storeViews : [defaultView, ...storeViews]
      }
    }
    
    // 更新当前视图名称
    const currentViewData = viewTabs.value.find(v => v.key === currentView.value)
    currentViewName.value = currentViewData?.label || '默认视图'
  }
  
  // 计算过滤后的数据数量
  const getFilteredDataCount = (filter: any) => {
    if (!config?.value?.data || Object.keys(filter).length === 0) {
      return config?.value?.data?.length || 0
    }
    
    return config.value.data.filter(row => {
      return Object.entries(filter).every(([key, value]) => {
        if (!value) return true
        const rowValue = row[key]
        return String(rowValue).toLowerCase().includes(String(value).toLowerCase())
      })
    }).length
  }

  const handleViewChange = (viewKey: string) => {
    if (currentView.value === viewKey) return
    currentView.value = viewKey
  }

  const handleViewMenuSelect = (key: string) => {
    switch (key) {
      case 'import':
        handleImportViews()
        break
      case 'export':
        handleExportViews()
        break
    }
  }

  const handleAddView = () => {
    const currentViews = tableStore.getViews(tableId)
    if (currentViews.length >= 5) {
      window.$message?.warning('视图数量不能超过5个')
      return
    }
    
    // 计算下一个视图编号，从2开始（因为有默认视图）
    const customViews = currentViews.filter(v => v.isCustom)
    const viewNumber = customViews.length + 2
    const viewName = `表格${viewNumber}`
    
    // 创建默认配置，而不是复制当前配置
    const defaultConfig = {
      columns: config.value?.columns?.map((col: any) => ({ ...col, visible: true })) || [],
      filters: {},
      sorting: {},
      pagination: { page: 1, pageSize: 20 },
      // 其他默认配置...
    }
    
    const newView = {
      key: `view_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      label: viewName,
      count: 0,
      description: `${viewName} - 自定义视图`,
      icon: '📋',
      filter: {},
      badgeType: 'default' as const,
      config: defaultConfig,
      isCustom: true
    }
    
    tableStore.saveView(tableId, newView)
    
    // 切换到新视图并加载默认配置
    currentView.value = newView.key
    if (config?.value) {
      Object.assign(config.value, defaultConfig)
    }

    emit('openConfig')
  }

  const handleViewsReorder = (draggedView: any, targetView: any) => {
    if (draggedView.key === targetView.key) return
    tableStore.reorderViews(tableId, draggedView.key, targetView.key)
  }

  const handleEditView = (view: any) => {
    handleViewChange(view.key)
    emit('openConfig')
  }

  const handleDuplicateView = (view: any) => {
    const currentViews = tableStore.getViews(tableId)
    if (currentViews.length >= 5) {
      window.$message?.warning('视图数量不能超过5个')
      return
    }

    const newView = {
      ...JSON.parse(JSON.stringify(view)),
      key: `view_${Date.now()}`,
      label: `${view.label}_副本`
    }
    
    tableStore.saveView(tableId, newView)
    window.$message?.success(`已复制视图"${view.label}"`)
  }

  const handleDeleteView = (viewKey: string) => {
    window.$dialog?.warning({
      title: '确认删除',
      content: '确定要删除这个视图吗？此操作不可撤销。',
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: () => {
        tableStore.deleteView(tableId, viewKey)
        if (currentView.value === viewKey) {
          const remainingViews = tableStore.getViews(tableId)
          currentView.value = remainingViews[0]?.key || ''
        }
        window.$message?.success('视图已删除')
      }
    })
  }

  const handleSetDefault = (view: any) => {
    tableStore.setDefaultView(tableId, view.key)
    window.$message?.success(`已将"${view.label}"设为默认视图`)
  }

  const handleShareView = (view: any) => {
    const shareData = {
      key: view.key,
      label: view.label,
      config: view.config,
      filter: view.filter
    }
    const shareUrl = `${window.location.origin}${window.location.pathname}?view=${encodeURIComponent(JSON.stringify(shareData))}`
    navigator.clipboard?.writeText(shareUrl)
    window.$message?.success(`已生成"${view.label}"的分享链接并复制到剪贴板`)
  }

  const handleExportView = (view: any) => {
    const exportData = {
      key: view.key,
      label: view.label,
      description: view.description,
      config: view.config,
      filter: view.filter
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `${view.label}-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    window.$message?.success(`已导出"${view.label}"视图配置`)
  }

  const handleRenameView = (view: any) => {
    tableStore.updateView(tableId, view.key, { label: view.label })
    window.$message?.success(`视图已重命名为"${view.label}"`)
  }

  const handleImportViews = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          try {
            const viewData = JSON.parse(event.target?.result as string)
            const newView = {
              ...viewData,
              key: `view_${Date.now()}`,
              label: `${viewData.label}_导入`
            }
            tableStore.saveView(tableId, newView)
            window.$message?.success(`成功导入视图"${newView.label}"`)
          } catch (error) {
            window.$message?.error('导入失败，文件格式不正确')
          }
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const handleExportViews = () => {
    const views = viewTabs.value.map(view => ({
      key: view.key,
      label: view.label,
      description: view.description,
      config: view.config,
      filter: view.filter || {}
    }))
    
    const dataStr = JSON.stringify(views, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `table-views-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    
    URL.revokeObjectURL(url)
    window.$message?.success('视图配置已导出')
  }

  // 初始化视图列表
  updateViewTabs()
  
  // 初始化时应用默认视图
  if (config?.value?.views && config.value.views.length > 0) {
    const defaultView = config.value.views[0]
    handleViewChange(defaultView.key)
  }

  return {
    viewTabs,
    currentView,
    currentViewName,
    updateViewTabs,
    handleViewChange,
    handleViewMenuSelect,
    handleAddView,
    handleViewsReorder,
    handleEditView,
    handleDuplicateView,
    handleDeleteView,
    handleSetDefault,
    handleShareView,
    handleExportView,
    handleRenameView
  }
}
