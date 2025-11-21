<template>
  <div class="table-lowcode-layout">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <ViewManager 
        :views="internalConfig.views" 
        :current-view-key="currentViewKey" 
        @add-view="handleAddView" 
        @view-change="handleViewChange" 
        @edit-view="handleEditView"
        @rename-view="handleRenameView" 
        @duplicate-view="handleDuplicateView" 
        @delete-view="handleDeleteView" 
      />
      <PaginationBar :config="currentViewConfig?.pagination" />
    </div>

    <!-- 筛选区域 -->
    <FilterSection :config="currentViewConfig?.filterList" />

    <!-- 表格主体 -->
    <TableSection 
      :data="internalConfig.data"
      :columns="currentViewConfig?.columns"
      :config="currentViewConfig"
      :loading="isTableLoading"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @sort-change="handleSortChange"
      @refresh="handleRefreshData"
      @open-config="handleOpenTableConfig"
      @export="handleExportData"
    />

    <!-- 配置面板 -->
    <ConfigPanel 
      v-if="showConfigPanel" 
      :current-view-name="currentViewName" 
      :view-key="currentViewKey" 
      :view-config="currentViewConfig" 
      @update:show="showConfigPanel = $event"
      @config-updated="handleConfigUpdated" 
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { ConfigManager } from './utils/configManager'

// 组件导入
import FilterSection from './components/FilterSection.vue'
import PaginationBar from './components/PaginationBar.vue'
import ViewManager from './components/ViewManager/index.vue'
import TableSection from './components/TableSection.vue'
import ConfigPanel from './Config/ConfigPanel.vue'

// 类型导入
import type { ExternalConfig } from './types'

const props = defineProps<{
  tableConfig: ExternalConfig
}>()

// ==================== 核心状态 ====================
const internalConfig = ref<ExternalConfig>(
  ConfigManager.initializeAllViews(cloneDeep(props.tableConfig))
)

const currentViewKey = ref<string>(
  internalConfig.value.views?.[0]?.key || ''
)

const showConfigPanel = ref<boolean>(false)
const isTableLoading = ref<boolean>(false)

// ==================== 计算属性 ====================
const currentViewName = computed(() =>
  internalConfig.value?.views?.find(v => v.key === currentViewKey.value)?.label || '默认视图'
)

const currentViewConfig = computed(() =>
  internalConfig.value?.views?.find(v => v.key === currentViewKey.value)
)

// ==================== 视图管理 ====================
const handleAddView = () => {
  const newViewKey = `view_${Date.now()}`
  const newViewConfig = cloneDeep(internalConfig.value._initialConfig)
  
  newViewConfig.key = newViewKey
  newViewConfig.label = `新视图_${Date.now().toString().slice(-4)}`
  
  if (!internalConfig.value.views) {
    internalConfig.value.views = []
  }
  internalConfig.value.views.push(newViewConfig)
  
  currentViewKey.value = newViewKey
  showConfigPanel.value = true
}

const handleViewChange = (viewKey: string) => {
  currentViewKey.value = viewKey
}

const handleEditView = (viewKey: string) => {
  currentViewKey.value = viewKey
  showConfigPanel.value = true
}

const handleRenameView = (viewKey: string, newName: string) => {
  const view = internalConfig.value.views?.find(v => v.key === viewKey)
  if (view) {
    view.label = newName
  }
}

const handleDuplicateView = (viewKey: string) => {
  const sourceView = internalConfig.value.views?.find(v => v.key === viewKey)
  if (!sourceView) return

  const newViewKey = `view_${Date.now()}`
  const newViewConfig = {
    ...cloneDeep(sourceView),
    key: newViewKey,
    label: `${sourceView.label}_副本`
  }

  if (!internalConfig.value.views) {
    internalConfig.value.views = []
  }
  internalConfig.value.views.push(newViewConfig)
  currentViewKey.value = newViewKey
}

const handleDeleteView = (viewKey: string) => {
  if (!internalConfig.value.views) return

  const viewIndex = internalConfig.value.views.findIndex(v => v.key === viewKey)
  if (viewIndex === -1) return

  internalConfig.value.views.splice(viewIndex, 1)

  if (currentViewKey.value === viewKey) {
    currentViewKey.value = internalConfig.value.views[0]?.key || ''
  }
}

// ==================== 配置更新 ====================
const handleConfigUpdated = (updatedViewConfig: any) => {
  if (!currentViewConfig.value) return

  const viewIndex = internalConfig.value.views?.findIndex(v => v.key === currentViewKey.value)
  if (viewIndex !== -1 && internalConfig.value.views) {
    internalConfig.value.views[viewIndex] = updatedViewConfig
  }
}

// ==================== 表格事件 ====================
const handleSelectionChange = (keys: any[], rows: any[]) => {
  console.log('选择变更:', keys, rows)
}

const handleRowClick = (row: any, index: number) => {
  console.log('行点击:', row, index)
}

const handleSortChange = (field: string, order: 'asc' | 'desc' | null) => {
  const view = internalConfig.value.views?.find(v => v.key === currentViewKey.value)
  if (view) {
    if (!view.sort) {
      view.sort = {}
    }
    view.sort.field = field
    view.sort.order = order || undefined
  }
}

const handleRefreshData = () => {
  isTableLoading.value = true
  setTimeout(() => {
    isTableLoading.value = false
  }, 1000)
}

const handleOpenTableConfig = () => {
  showConfigPanel.value = true
}

const handleExportData = (format: string, data: any[]) => {
  console.log('导出数据:', format, data)
}
</script>

<style lang="scss" scoped>
$border-color: #f0f0f0;
$background-color: #fafafa;
$white-color: white;
$padding-base: 12px 16px;

.table-lowcode-layout {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: $white-color;
  overflow: hidden;

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: $padding-base;
    border-bottom: 1px solid $border-color;
    background: $background-color;
    flex-shrink: 0;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      padding: 8px 12px;
    }
  }
}

:deep(.filter-section) {
  border-bottom: 1px solid $border-color;

  &.visible {
    padding: 12px 16px;
    background: #f9f9f9;
  }
}

:deep(.table-section) {
  flex: 1;
  overflow: hidden;

  .table-container {
    height: 100%;
    overflow: auto;
  }
}

:deep(.config-panel) {
  z-index: 1000;

  .n-drawer-content {
    padding: 0;
  }
}

@media (max-width: 1200px) {
  .table-lowcode-layout .top-bar {
    padding: 8px 12px;
  }
}

@media (max-width: 768px) {
  .table-lowcode-layout .top-bar {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
