import { computed, type Ref } from 'vue'

/**
 * 表格数据管理组合式函数
 * @param data 表格数据
 * @param config 表格配置
 */
export function useTableData(
  data: Ref<any[]>, 
  config?: Ref<any>
) {
  // ==================== 计算属性 ====================
  
  /**
   * 表格数据
   */
  const tableData = computed(() => data.value || [])
  
  /**
   * 数据总数
   */
  const totalCount = computed(() => tableData.value.length)
  
  /**
   * 是否为空
   */
  const isEmpty = computed(() => tableData.value.length === 0)
  
  // ==================== 数据操作 ====================
  
  /**
   * 刷新数据
   */
  const refreshData = () => {
    // 触发刷新事件
    config?.value?.events?.onRefresh?.()
  }
  
  /**
   * 添加行数据
   */
  const addRow = (row: any) => {
    data.value.push(row)
  }
  
  /**
   * 更新行数据
   */
  const updateRow = (index: number, row: any) => {
    if (data.value[index]) {
      data.value[index] = { ...data.value[index], ...row }
    }
  }
  
  /**
   * 删除行数据
   */
  const deleteRow = (index: number) => {
    if (data.value[index]) {
      data.value.splice(index, 1)
    }
  }
  
  /**
   * 批量删除行数据
   */
  const deleteRows = (indexes: number[]) => {
    // 从后往前删除，避免索引问题
    indexes.sort((a, b) => b - a).forEach(index => {
      deleteRow(index)
    })
  }
  
  /**
   * 获取指定行数据
   */
  const getRow = (index: number) => {
    return data.value[index] || null
  }
  
  /**
   * 查找行数据
   */
  const findRow = (predicate: (row: any, index: number) => boolean) => {
    return data.value.find(predicate)
  }
  
  /**
   * 查找行索引
   */
  const findRowIndex = (predicate: (row: any, index: number) => boolean) => {
    return data.value.findIndex(predicate)
  }

  return {
    // 计算属性
    tableData,
    totalCount,
    isEmpty,
    
    // 数据操作
    refreshData,
    addRow,
    updateRow,
    deleteRow,
    deleteRows,
    getRow,
    findRow,
    findRowIndex
  }
}
