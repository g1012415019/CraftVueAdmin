<template>
  <div class="table-section">
    <!-- 表格容器 -->
    <div class="table-wrapper">
      <DataTable 
        ref="dataTableRef"
        :data="tableData"
        :columns="tableColumns"
        :config="tableConfig"
        @update-checked-keys="handleUpdateCheckedKeys"
        @row-click="handleRowClick"
        @row-double-click="handleRowDoubleClick"
        @cell-click="handleCellClick"
        @sort-change="handleSortChange"
        @selection-change="handleSelectionChange"
      />
    </div>

    <!-- 表格底部信息 -->
    <div v-if="showFooter" class="table-footer">
      <div class="footer-left">
        <n-text depth="3" style="font-size: 12px;">
          共 {{ totalCount }} 条数据
          <span v-if="hasSelection">
            ，已选中 {{ selectedCount }} 条
          </span>
        </n-text>
      </div>
      
      <div class="footer-right">
        <n-space size="small">
          <n-button 
            v-if="hasSelection"
            size="tiny" 
            @click="handleClearSelection"
          >
            取消选择
          </n-button>
          
          <n-button 
            size="tiny" 
            @click="handleRefreshData"
            :loading="isRefreshing"
          >
            刷新
          </n-button>
          
          <n-button 
            size="tiny" 
            @click="handleOpenConfig"
          >
            设置
          </n-button>
        </n-space>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="isEmpty" class="empty-state">
      <n-empty description="暂无数据">
        <template #extra>
          <n-button size="small" @click="handleRefreshData">
            刷新数据
          </n-button>
        </template>
      </n-empty>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-overlay">
      <n-spin size="large">
        <template #description>
          {{ loadingText }}
        </template>
      </n-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import DataTable from '../Table/DataTable.vue'
import type { TableColumn } from '../types'
import { msg } from '../utils/message'

// ==================== 组件定义 ====================

/**
 * 组件 Props 定义
 */
const props = defineProps<{
  /** 表格数据 */
  data?: any[]
  /** 表格列配置 */
  columns?: TableColumn[]
  /** 表格配置 */
  config?: any
  /** 是否显示底部信息 */
  showFooter?: boolean
  /** 加载状态 */
  loading?: boolean
}>()

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 选择变更事件 */
  'selection-change': [keys: any[], rows: any[]]
  /** 行点击事件 */
  'row-click': [row: any, index: number]
  /** 行双击事件 */
  'row-double-click': [row: any, index: number]
  /** 单元格点击事件 */
  'cell-click': [row: any, column: TableColumn, cellValue: any]
  /** 排序变更事件 */
  'sort-change': [field: string, order: 'asc' | 'desc' | null]
  /** 刷新数据事件 */
  'refresh': []
  /** 打开配置事件 */
  'open-config': []
  /** 导出数据事件 */
  'export': [format: string, data: any[]]
}>()

// ==================== 内部状态 ====================

const dataTableRef = ref()
const checkedRowKeys = ref<any[]>([])
const isRefreshing = ref(false)
const loadingText = ref('加载中...')

// ==================== 计算属性 ====================

const tableData = computed(() => 
  props.data || []
)

const tableColumns = computed(() => 
  props.columns || []
)

const tableConfig = computed(() => 
  props.config || {}
)

const totalCount = computed(() => 
  tableData.value.length
)

const selectedCount = computed(() => 
  checkedRowKeys.value.length
)

const hasSelection = computed(() => 
  checkedRowKeys.value.length > 0
)

const isEmpty = computed(() => 
  tableData.value.length === 0 && !isLoading.value
)

const isLoading = computed(() => 
  props.loading || isRefreshing.value
)

const showFooter = computed(() => 
  props.showFooter !== false
)

// ==================== 工具方法 ====================

const getSelectedRows = () => {
  return tableData.value.filter((row, index) => 
    checkedRowKeys.value.includes(row.id || index)
  )
}

// ==================== 事件处理 ====================

const handleUpdateCheckedKeys = (keys: any[]) => {
  checkedRowKeys.value = keys
  emit('selection-change', keys, getSelectedRows())
}

const handleRowClick = (row: any, index: number) => {
  emit('row-click', row, index)
}

const handleRowDoubleClick = (row: any, index: number) => {
  emit('row-double-click', row, index)
}

const handleCellClick = (row: any, column: TableColumn, cellValue: any) => {
  emit('cell-click', row, column, cellValue)
}

const handleSortChange = (field: string, order: 'asc' | 'desc' | null) => {
  emit('sort-change', field, order)
  msg.success(`已按 ${field} ${order === 'asc' ? '升序' : '降序'} 排序`)
}

const handleSelectionChange = (keys: any[]) => {
  handleUpdateCheckedKeys(keys)
}

const handleClearSelection = () => {
  checkedRowKeys.value = []
  dataTableRef.value?.clearSelection?.()
  emit('selection-change', [], [])
  msg.success('已取消选择')
}

const handleRefreshData = () => {
  isRefreshing.value = true
  loadingText.value = '刷新中...'
  
  setTimeout(() => {
    isRefreshing.value = false
    loadingText.value = '加载中...'
    emit('refresh')
    msg.success('数据已刷新')
  }, 1000)
}

const handleOpenConfig = () => {
  emit('open-config')
}

const handleExportData = (format: 'excel' | 'csv' | 'json' = 'excel') => {
  const data = hasSelection.value ? getSelectedRows() : tableData.value
  emit('export', format, data)
  msg.success(`正在导出 ${format.toUpperCase()} 格式`)
}

// ==================== 公开方法 ====================

const selectAll = () => {
  const allKeys = tableData.value.map((row, index) => row.id || index)
  handleUpdateCheckedKeys(allKeys)
  msg.success(`已选择全部 ${allKeys.length} 条数据`)
}

const selectInvert = () => {
  const allKeys = tableData.value.map((row, index) => row.id || index)
  const invertedKeys = allKeys.filter(key => !checkedRowKeys.value.includes(key))
  handleUpdateCheckedKeys(invertedKeys)
  msg.success(`已反选 ${invertedKeys.length} 条数据`)
}

const scrollToRow = (index: number) => {
  dataTableRef.value?.scrollToRow?.(index)
}

const scrollToTop = () => {
  dataTableRef.value?.scrollToTop?.()
}

const scrollToBottom = () => {
  dataTableRef.value?.scrollToBottom?.()
}

const getTableInfo = () => {
  return {
    totalCount: totalCount.value,
    selectedCount: selectedCount.value,
    columnCount: tableColumns.value.length,
    visibleColumnCount: tableColumns.value.filter(col => col.visible !== false).length,
    hasData: !isEmpty.value,
    isLoading: isLoading.value
  }
}

// 暴露方法给父组件
defineExpose({
  selectAll,
  selectInvert,
  clearSelection: handleClearSelection,
  exportData: handleExportData,
  scrollToRow,
  scrollToTop,
  scrollToBottom,
  getTableInfo,
  getSelectedRows
})
</script>

<style scoped>
.table-section {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
}

.table-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-top: 1px solid #e8e8e8;
  background: #fafafa;
}

.footer-left {
  flex: 1;
}

.footer-right {
  flex-shrink: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-footer {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
  
  .footer-left,
  .footer-right {
    text-align: center;
  }
}
</style>
