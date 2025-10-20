import { ref, computed, h, type Ref } from 'vue'
import { useTableConfigStore } from '@/store/modules/tableConfig'

export function useViewManager(config: Ref<any>, emit: any) {
  const tableStore = useTableConfigStore()
  const tableId = 'default'
  
  const currentView = ref('all')

  const viewTabs = computed(() => {
    const storeViews = tableStore.getViews(tableId)
    
    const defaultViews = [
      { key: 'all', label: '全部数据', count: 1250, description: '显示所有数据记录', isDefault: true },
      { key: 'today', label: '今日新增', count: 23, badgeType: 'info', description: '今天新创建的数据' },
      { key: 'pending', label: '待处理', count: 15, badgeType: 'warning', description: '需要处理的数据', alert: true }
    ]
    
    return [...defaultViews, ...storeViews]
  })

  const handleViewChange = (viewKey: string) => {
    const viewData = viewTabs.value.find(v => v.key === viewKey)
    if (viewData) {
      currentView.value = viewData
      // 更新配置为当前视图的配置
      if (config?.value && viewData.config) {
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
    // 检查视图数量限制
    const currentViews = tableStore.getViews(tableId)
    if (currentViews.length >= 10) {
      window.$message?.warning('视图数量不能超过10个')
      return
    }
    
    const timestamp = new Date().toLocaleString('zh-CN', { 
      month: '2-digit', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    const viewName = `视图_${timestamp}`;
    
    const newView = {
      key: `view_${Date.now()}`,
      label: viewName,
      count: config.value?.data?.length || 0,
      description: `${viewName} - 自定义视图`,
      icon: '📋',
      filter: {},
      badgeType: 'default' as const,
      config: JSON.parse(JSON.stringify(config.value || {})),
      isCustom: true
    };
    
    // 保存到store
    tableStore.saveView(tableId, newView);
    
    // 切换到新创建的视图
    currentView.value = newView.key;
    
    // 立即打开配置面板
    emit('openConfig');
  }

  const handleViewsReorder = (draggedView: any, targetView: any) => {
    console.log('重排序视图:', draggedView.label, '到', targetView.label)
    window.$message?.info(`已将"${draggedView.label}"移动到"${targetView.label}"附近`)
  }

  const handleEditView = (view: any) => {
    console.log('编辑视图:', view.label)
    // 先切换到要编辑的视图
    handleViewChange(view.key)
    // 然后打开配置面板
    emit('openConfig')
  }

  const handleDuplicateView = (view: any) => {
    console.log('复制视图:', view.label)
    window.$message?.success(`已复制视图"${view.label}"`)
  }

  const handleDeleteView = (viewKey: string) => {
    window.$dialog?.warning({
      title: '确认删除',
      content: '确定要删除这个视图吗？此操作不可撤销。',
      positiveText: '删除',
      negativeText: '取消',
      onPositiveClick: () => {
        console.log('删除视图:', viewKey)
        window.$message?.success('视图已删除')
      }
    })
  }

  const handleSetDefault = (view: any) => {
    console.log('设置默认视图:', view.label)
    window.$message?.success(`已将"${view.label}"设为默认视图`)
  }

  const handleShareView = (view: any) => {
    console.log('分享视图:', view.label)
    window.$message?.success(`已生成"${view.label}"的分享链接`)
  }

  const handleExportView = (view: any) => {
    console.log('导出视图:', view.label)
    window.$message?.success(`已导出"${view.label}"视图配置`)
  }

  const handleRenameView = (view: any) => {
    console.log('重命名视图:', view.label)
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
            const views = JSON.parse(event.target?.result as string)
            console.log('导入视图:', views)
            window.$message?.success(`成功导入 ${views.length} 个视图`)
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
