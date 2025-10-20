import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTableConfigStore = defineStore('tableConfig', () => {
  const configs = ref<Record<string, any>>({})
  
  const saveConfig = (tableId: string, config: any) => {
    configs.value[tableId] = JSON.parse(JSON.stringify(config))
  }
  
  const getConfig = (tableId: string) => {
    return configs.value[tableId] || null
  }
  
  const saveViewConfig = (tableId: string, viewKey: string, config: any) => {
    if (!configs.value[tableId]) {
      configs.value[tableId] = { views: { presetViews: [] } }
    }
    if (!configs.value[tableId].viewConfigs) {
      configs.value[tableId].viewConfigs = {}
    }
    configs.value[tableId].viewConfigs[viewKey] = JSON.parse(JSON.stringify(config))
  }
  
  const getViewConfig = (tableId: string, viewKey: string) => {
    return configs.value[tableId]?.viewConfigs?.[viewKey] || null
  }

  const saveView = (tableId: string, view: any) => {
    if (!configs.value[tableId]) {
      configs.value[tableId] = { views: { presetViews: [] } }
    }
    if (!configs.value[tableId].views) {
      configs.value[tableId].views = { presetViews: [] }
    }
    if (!configs.value[tableId].views.presetViews) {
      configs.value[tableId].views.presetViews = []
    }
    
    configs.value[tableId].views.presetViews.push(view)
  }
  
  const getViews = (tableId: string) => {
    return configs.value[tableId]?.views?.presetViews || []
  }

  const deleteView = (tableId: string, viewKey: string) => {
    const views = configs.value[tableId]?.views?.presetViews
    if (views) {
      const index = views.findIndex((v: any) => v.key === viewKey)
      if (index > -1) {
        views.splice(index, 1)
      }
    }
  }

  const updateView = (tableId: string, viewKey: string, updates: any) => {
    const views = configs.value[tableId]?.views?.presetViews
    if (views) {
      const view = views.find((v: any) => v.key === viewKey)
      if (view) {
        Object.assign(view, updates)
      }
    }
  }

  const reorderViews = (tableId: string, draggedKey: string, targetKey: string) => {
    const views = configs.value[tableId]?.views?.presetViews
    if (views) {
      const draggedIndex = views.findIndex((v: any) => v.key === draggedKey)
      const targetIndex = views.findIndex((v: any) => v.key === targetKey)
      
      if (draggedIndex > -1 && targetIndex > -1) {
        const [draggedView] = views.splice(draggedIndex, 1)
        views.splice(targetIndex, 0, draggedView)
      }
    }
  }

  const setDefaultView = (tableId: string, viewKey: string) => {
    const views = configs.value[tableId]?.views?.presetViews
    if (views) {
      views.forEach((v: any) => {
        v.isDefault = v.key === viewKey
      })
    }
  }
  
  return {
    configs,
    saveConfig,
    getConfig,
    saveViewConfig,
    getViewConfig,
    saveView,
    getViews,
    deleteView,
    updateView,
    reorderViews,
    setDefaultView
  }
}, {
  persist: true
})
