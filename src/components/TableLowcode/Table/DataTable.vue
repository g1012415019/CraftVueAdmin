<template>
  <div class="data-table-container">
    <n-data-table
      :columns="tableColumns"
      :data="tableData"
      :pagination="false"
      :loading="loading"
      :row-key="rowKey"
      :scroll-x="scrollX"
      :scroll-y="scrollY"
      :bordered="bordered"
      :striped="striped"
      :size="size"
      :max-height="maxHeight"
      :height="height"
      :checked-row-keys="checkedRowKeys"
      @update:checked-row-keys="handleUpdateCheckedRowKeys"
      @update:sorter="handleSorterChange"
      @update:filters="handleFiltersChange"
      :row-props="getRowProps"
      :row-class-name="getRowClassName"
      @click="handleTableClick"
    />

    <!-- 右键菜单 -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="contextMenuX"
      :y="contextMenuY"
      :options="contextMenuOptions"
      :show="showContextMenu"
      @clickoutside="hideContextMenu"
      @select="handleContextMenuSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { TableColumn } from '../types'

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
  /** 加载状态 */
  loading?: boolean
  /** 行键名 */
  rowKey?: string | ((row: any) => string)
  /** 选中的行键 */
  checkedRowKeys?: any[]
}>()

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 选中行变更 */
  'update-checked-keys': [keys: any[]]
  /** 行点击 */
  'row-click': [row: any, index: number]
  /** 行双击 */
  'row-double-click': [row: any, index: number]
  /** 单元格点击 */
  'cell-click': [row: any, column: TableColumn, cellValue: any]
  /** 排序变更 */
  'sort-change': [field: string, order: 'asc' | 'desc' | null]
  /** 筛选变更 */
  'filter-change': [filters: any]
  /** 选择变更 */
  'selection-change': [keys: any[]]
}>()

// ==================== 内部状态 ====================

const contextMenuX = ref(0)
const contextMenuY = ref(0)
const showContextMenu = ref(false)
const currentContextRow = ref<any>(null)

// ==================== 计算属性 ====================

const tableData = computed(() => 
  props.data || []
)

const tableColumns = computed(() => 
  props.columns || []
)

const rowKey = computed(() => 
  props.rowKey || ((row: any) => row.id || row.key)
)

const scrollX = computed(() => 
  props.config?.basic?.scrollX
)

const scrollY = computed(() => 
  props.config?.basic?.scrollY || props.config?.basic?.maxHeight
)

const bordered = computed(() => 
  props.config?.basic?.bordered !== false
)

const striped = computed(() => 
  props.config?.basic?.striped === true
)

const size = computed(() => 
  props.config?.basic?.size || 'medium'
)

const maxHeight = computed(() => 
  props.config?.basic?.maxHeight
)

const height = computed(() => 
  props.config?.basic?.height
)

const checkedRowKeys = computed(() => 
  props.checkedRowKeys || []
)

const contextMenuOptions = computed(() => [
  { label: '查看详情', key: 'view' },
  { label: '编辑', key: 'edit' },
  { label: '复制', key: 'copy' },
  { type: 'divider' },
  { label: '删除', key: 'delete' }
])

// ==================== 工具方法 ====================

const getRowProps = (row: any, index: number) => {
  return {
    onContextmenu: (e: MouseEvent) => {
      e.preventDefault()
      showContextMenu.value = true
      contextMenuX.value = e.clientX
      contextMenuY.value = e.clientY
      currentContextRow.value = row
    },
    onClick: () => {
      emit('row-click', row, index)
    },
    onDblclick: () => {
      emit('row-double-click', row, index)
    }
  }
}

const getRowClassName = (row: any, index: number) => {
  const classes = []
  
  if (checkedRowKeys.value.includes(rowKey.value(row))) {
    classes.push('row-selected')
  }
  
  if (row._status === 'editing') {
    classes.push('row-editing')
  }
  
  if (row._status === 'error') {
    classes.push('row-error')
  }
  
  return classes.join(' ')
}

// ==================== 事件处理 ====================

const handleUpdateCheckedRowKeys = (keys: any[]) => {
  emit('update-checked-keys', keys)
  emit('selection-change', keys)
}

const handleSorterChange = (sorter: any) => {
  if (sorter) {
    emit('sort-change', sorter.columnKey, sorter.order)
  } else {
    emit('sort-change', '', null)
  }
}

const handleFiltersChange = (filters: any) => {
  emit('filter-change', filters)
}

const handleTableClick = (e: MouseEvent) => {
  // 点击表格其他区域时隐藏右键菜单
  if (showContextMenu.value) {
    showContextMenu.value = false
  }
}

const hideContextMenu = () => {
  showContextMenu.value = false
  currentContextRow.value = null
}

const handleContextMenuSelect = (key: string) => {
  const row = currentContextRow.value
  if (!row) return
  
  switch (key) {
    case 'view':
      console.log('查看详情:', row)
      break
    case 'edit':
      console.log('编辑:', row)
      break
    case 'copy':
      console.log('复制:', row)
      break
    case 'delete':
      console.log('删除:', row)
      break
  }
  
  hideContextMenu()
}

// ==================== 公开方法 ====================

const clearSelection = () => {
  emit('update-checked-keys', [])
}

const scrollToRow = (index: number) => {
  // 滚动到指定行的实现
  console.log('滚动到行:', index)
}

const scrollToTop = () => {
  // 滚动到顶部的实现
  console.log('滚动到顶部')
}

const scrollToBottom = () => {
  // 滚动到底部的实现
  console.log('滚动到底部')
}

// 暴露方法给父组件
defineExpose({
  clearSelection,
  scrollToRow,
  scrollToTop,
  scrollToBottom
})
</script>

<style scoped>
.data-table-container {
  position: relative;
  width: 100%;
  height: 100%;
}

:deep(.n-data-table-th) {
  background: #fafafa;
  font-weight: 600;
}

:deep(.n-data-table-td) {
  transition: all 0.3s ease;
}

:deep(.n-data-table-td:hover) {
  background: #f5f5f5;
}

:deep(.row-selected) {
  background: #e6f7ff;
}

:deep(.row-editing) {
  background: #fff7e6;
  border: 1px solid #faad14;
}

:deep(.row-error) {
  background: #fff2f0;
  border: 1px solid #ff4d4f;
}

@media (max-width: 768px) {
  :deep(.n-data-table) {
    font-size: 12px;
  }
}
</style>
