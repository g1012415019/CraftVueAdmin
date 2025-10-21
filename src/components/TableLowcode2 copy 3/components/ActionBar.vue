<template>
  <div v-if="config.actionBar?.enabled" class="action-bar">
    <div class="action-left">
      <n-button 
        v-if="config.actionBar?.showCreate" 
        type="primary" 
        @click="$emit('create')"
      >
        <template #icon>
          <n-icon><PlusIcon /></n-icon>
        </template>
        新增
      </n-button>
      
      <n-dropdown 
        v-if="config.actionBar?.showImport"
        :options="importOptions" 
        @select="handleImportSelect"
      >
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
      
      <n-dropdown 
        v-if="config.actionBar?.showExport"
        :options="exportOptions" 
        @select="handleExportSelect"
      >
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
        <n-tooltip v-if="config.actionBar?.showRefresh" trigger="hover">
          <template #trigger>
            <n-button size="small" quaternary @click="$emit('refresh')">
              <template #icon>
                <n-icon><RefreshIcon /></n-icon>
              </template>
            </n-button>
          </template>
          刷新数据
        </n-tooltip>
        
        <n-tooltip v-if="config.actionBar?.showPrint" trigger="hover">
          <template #trigger>
            <n-button size="small" quaternary @click="$emit('print')">
              <template #icon>
                <n-icon><PrintIcon /></n-icon>
              </template>
            </n-button>
          </template>
          打印表格
        </n-tooltip>
        
        <n-tooltip v-if="config.actionBar?.showFullscreen" trigger="hover">
          <template #trigger>
            <n-button size="small" quaternary @click="$emit('fullscreen')">
              <template #icon>
                <n-icon><FullscreenIcon /></n-icon>
              </template>
            </n-button>
          </template>
          全屏显示
        </n-tooltip>
        
        <n-tooltip v-if="config.actionBar?.showConfig" trigger="hover">
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
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { 
  PlusOutlined as PlusIcon,
  ImportOutlined as ImportIcon,
  ExportOutlined as ExportIcon,
  DownOutlined as ChevronDownIcon,
  ReloadOutlined as RefreshIcon,
  PrinterOutlined as PrintIcon,
  FullscreenOutlined as FullscreenIcon,
  SettingOutlined as SettingIcon
} from '@vicons/antd'

// 注入配置
const config = inject('tableConfig')

// 事件定义
const emit = defineEmits(['create', 'import', 'export', 'refresh', 'print', 'fullscreen', 'config'])

// 导入选项
const importOptions = computed(() => [
  {
    label: 'Excel 导入',
    key: 'excel'
  },
  {
    label: 'CSV 导入',
    key: 'csv'
  },
  {
    label: 'JSON 导入',
    key: 'json'
  }
])

// 导出选项
const exportOptions = computed(() => [
  {
    label: '导出 Excel',
    key: 'excel'
  },
  {
    label: '导出 CSV',
    key: 'csv'
  },
  {
    label: '导出 JSON',
    key: 'json'
  },
  {
    label: '导出 PDF',
    key: 'pdf'
  }
])

// 导入处理
const handleImportSelect = (key: string) => {
  emit('import', key)
}

// 导出处理
const handleExportSelect = (key: string) => {
  emit('export', key)
}
</script>

<style scoped>
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  min-height: 40px;
}

.action-left {
  display: flex;
  gap: 8px;
  align-items: center;
}

.action-right {
  display: flex;
  align-items: center;
}
</style>
