import { ref, computed, type Ref } from 'vue'
import { useTableConfigStore } from '@/store/modules/tableConfig'

export function useViewManager(config: Ref<any>, emit: any) {
  const tableStore = useTableConfigStore()
  const tableId = 'default'
  
  const currentView = ref('default')
  
  const currentViewName = computed(() => {
    const currentViewData = viewTabs.value.find(v => v.key === currentView.value)
    return currentViewData?.label || '默认视图'
  })

  const viewTabs = computed(() => {
    const storeViews = tableStore.getViews(tableId)
    
    // 确保始终有默认视图
    const defaultView = {
      key: 'default',
      label: '默认视图',
      count: config.value?.data?.length || 0,
      description: '默认数据视图',
      isDefault: true,
      isCustom: false
    }
    
    // 如果没有视图，返回默认视图
    if (storeViews.length === 0) {
      return [defaultView]
    }
    
    // 检查是否已有默认视图
    const hasDefault = storeViews.some(v => v.key === 'default')
    if (!hasDefault) {
      return [defaultView, ...storeViews]
    }
    
    return storeViews
  })

  const handleViewChange = (viewKey: string) => {
    const viewData = viewTabs.value.find(v => v.key === viewKey)
    if (viewData) {
      currentView.value = viewKey
      
      // 通知父组件视图切换
      emit('viewChange', viewKey)
      
      // 保存当前视图的配置
      if (config?.value && currentView.value !== viewKey) {
        tableStore.saveViewConfig(tableId, currentView.value, config.value)
      }
      
      // 加载新视图的独立配置
      const viewConfig = tableStore.getViewConfig(tableId, viewKey)
      if (viewConfig && config?.value) {
        Object.assign(config.value, viewConfig)
      } else if (config?.value && viewData.config) {
        Object.assign(config.value, viewData.config)
      }
      
      config?.value?.onViewChange?.(viewKey, viewData)
    }
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
    tableStore.reorderViews(tableId, draggedView.key, targetView.key)
    window.$message?.info(`已将"${draggedView.label}"移动到"${targetView.label}"附近`)
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

  return {
    viewTabs,
    currentView,
    currentViewName,
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
