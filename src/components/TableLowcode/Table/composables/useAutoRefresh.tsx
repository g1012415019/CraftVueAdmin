import { ref, inject, watch, onUnmounted } from 'vue'

export function useAutoRefresh(fetchData) {
  const config = inject('tableConfig')
  
  const refreshTimer = ref(null)
  const isRefreshing = ref(false)
  
  // 启动自动刷新
  const startAutoRefresh = () => {
    if (!config.value.autoRefresh?.enabled || refreshTimer.value) {
      return
    }
    
    const interval = (config.value.autoRefresh.interval || 30) * 1000 // 转换为毫秒
    
    refreshTimer.value = setInterval(async () => {
      if (!isRefreshing.value) {
        isRefreshing.value = true
        try {
          await fetchData()
        } catch (error) {
          console.error('自动刷新失败:', error)
        } finally {
          isRefreshing.value = false
        }
      }
    }, interval)
  }
  
  // 停止自动刷新
  const stopAutoRefresh = () => {
    if (refreshTimer.value) {
      clearInterval(refreshTimer.value)
      refreshTimer.value = null
    }
  }
  
  // 手动刷新
  const manualRefresh = async () => {
    if (isRefreshing.value) return
    
    isRefreshing.value = true
    try {
      await fetchData()
    } catch (error) {
      console.error('手动刷新失败:', error)
    } finally {
      isRefreshing.value = false
    }
  }
  
  // 监听配置变化
  watch(
    () => config.value.autoRefresh?.enabled,
    (enabled) => {
      if (enabled) {
        startAutoRefresh()
      } else {
        stopAutoRefresh()
      }
    },
    { immediate: true }
  )
  
  watch(
    () => config.value.autoRefresh?.interval,
    () => {
      if (config.value.autoRefresh?.enabled) {
        stopAutoRefresh()
        startAutoRefresh()
      }
    }
  )
  
  // 组件卸载时清理
  onUnmounted(() => {
    stopAutoRefresh()
  })
  
  return {
    isRefreshing,
    startAutoRefresh,
    stopAutoRefresh,
    manualRefresh
  }
}
