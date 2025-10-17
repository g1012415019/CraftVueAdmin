<template>
  <div class="table-section">
    <!-- 批量操作浮层 -->
    <div v-if="checkedRowKeys.length > 0" class="batch-action-overlay">
      <div class="batch-action-content">
        <div class="batch-info">
          <n-icon class="batch-icon"><CheckCircleIcon /></n-icon>
          <n-text depth="2">已选择 {{ checkedRowKeys.length }} 条记录</n-text>
          <n-button size="small" text @click="$emit('clear-selection')">
            <template #icon>
              <n-icon><CloseIcon /></n-icon>
            </template>
            取消选择
          </n-button>
        </div>
        <div class="batch-actions">
          <template v-for="action in batchActions" :key="action.key">
            <n-button 
              size="small" 
              :type="action.type || 'default'"
              @click="$emit('batch-action', action)"
            >
              <template #icon>
                <n-icon><component :is="getBatchActionIcon(action.key)" /></n-icon>
              </template>
              {{ action.label }}
            </n-button>
          </template>
        </div>
      </div>
    </div>

    <!-- 表格操作栏 -->
    <div class="table-action-bar">
      <div class="action-left">
        <n-button type="primary" @click="$emit('create')">
          <template #icon>
            <n-icon><PlusIcon /></n-icon>
          </template>
          新增
        </n-button>
        
        <n-dropdown :options="importOptions" @select="handleImportSelect">
          <n-button>
            <template #icon>
              <n-icon><ImportIcon /></n-icon>
            </template>
            导入
            <template #suffix>
              <n-icon><ChevronDownIcon /></n-icon>
            </template>
          </n-button>
        </n-dropdown>
        
        <n-dropdown :options="exportOptions" @select="handleExportSelect">
          <n-button>
            <template #icon>
              <n-icon><ExportIcon /></n-icon>
            </template>
            导出
            <template #suffix>
              <n-icon><ChevronDownIcon /></n-icon>
            </template>
          </n-button>
        </n-dropdown>
      </div>
      
      <div class="action-right">
        <n-space>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button size="small" quaternary @click="$emit('refresh')">
                <template #icon>
                  <n-icon><RefreshIcon /></n-icon>
                </template>
              </n-button>
            </template>
            刷新数据
          </n-tooltip>
          
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button size="small" quaternary @click="$emit('print')">
                <template #icon>
                  <n-icon><PrintIcon /></n-icon>
                </template>
              </n-button>
            </template>
            打印表格
          </n-tooltip>
          
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button size="small" quaternary @click="$emit('fullscreen')">
                <template #icon>
                  <n-icon><FullscreenIcon /></n-icon>
                </template>
              </n-button>
            </template>
            全屏显示
          </n-tooltip>
          
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button size="small" quaternary @click="$emit('config')">
                <template #icon>
                  <n-icon><SettingIcon /></n-icon>
                </template>
              </n-button>
            </template>
            表格设置
          </n-tooltip>
        </n-space>
      </div>
    </div>

    <!-- 表格本身 -->
    <div class="table-wrapper">
      <DataTable 
        ref="dataTableRef" 
        @update-checked-keys="$emit('update-checked-keys', $event)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'
import DataTable from '../Table/DataTable.vue'

interface Props {
  checkedRowKeys: any[]
  batchActions: any[]
}

defineProps<Props>()
defineEmits([
  'batch-action', 'create', 'print', 'config', 'update-checked-keys',
  'clear-selection', 'refresh', 'fullscreen'
])

// 导入选项
const importOptions = [
  { label: 'Excel 文件', key: 'excel' },
  { label: 'CSV 文件', key: 'csv' },
  { label: 'JSON 文件', key: 'json' }
]

// 导出选项
const exportOptions = [
  { label: '导出 Excel', key: 'excel' },
  { label: '导出 CSV', key: 'csv' },
  { label: '导出 PDF', key: 'pdf' },
  { type: 'divider' },
  { label: '导出选中项', key: 'selected' },
  { label: '导出当前页', key: 'current' }
]

// 处理导入选择
const handleImportSelect = (key: string) => {
  console.log('导入:', key)
}

// 处理导出选择
const handleExportSelect = (key: string) => {
  console.log('导出:', key)
}

// 获取批量操作图标
const getBatchActionIcon = (actionKey: string) => {
  const iconMap = {
    'edit': EditIcon,
    'copy': CopyIcon,
    'delete': DeleteIcon,
    'export': ExportIcon,
    'archive': ArchiveIcon
  }
  return iconMap[actionKey] || EditIcon
}

// 图标组件
const PlusIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' })
])

const ImportIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z' })
])

const ExportIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-5.5-2L9 14.5l1.41-1.41L12 14.67V10h2v4.67l1.59-1.58L17 14.5 13.5 18z' })
])

const RefreshIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z' })
])

const PrintIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z' })
])

const FullscreenIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z' })
])

const SettingIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z' })
])

const CheckCircleIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z' })
])

const CloseIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' })
])

const ChevronDownIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z' })
])

const EditIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' })
])

const CopyIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z' })
])

const DeleteIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' })
])

const ArchiveIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12l.94 1H5.12z' })
])
</script>

<style scoped>
.table-section {
  position: relative;
  flex: 1;
}

.batch-action-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.1) 0%, rgba(24, 144, 255, 0.05) 100%);
  border: 1px solid #1890ff;
  border-radius: 6px;
  padding: 12px 16px;
  margin-bottom: 16px;
  backdrop-filter: blur(4px);
}

.batch-action-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.batch-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.batch-icon {
  color: #1890ff;
  font-size: 18px;
}

.batch-actions {
  display: flex;
  gap: 8px;
}

.table-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  margin-bottom: 16px;
}

.action-left {
  display: flex;
  gap: 8px;
}

.table-wrapper {
  flex: 1;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>
