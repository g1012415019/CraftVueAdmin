<template>
  <div class="table-lowcode2-layout">
    <!-- 视图和分页栏 -->
    <div class="top-bar">
      <ViewManager
        :view-tabs="viewTabs"
        :current-view="currentView"
        @view-change="handleViewChange"
        @menu-select="handleViewMenuSelect"
        @add-view="handleAddView"
        @views-reorder="handleViewsReorder"
        @edit-view="showConfigPanel = true"
        @duplicate-view="handleDuplicateView"
        @delete-view="handleDeleteView"
        @set-default="handleSetDefault"
        @share-view="handleShareView"
        @export-view="handleExportView"
        @rename-view="handleRenameView"
      />
      
      <PaginationBar
        :total-count="totalCount"
        :current-page="currentPage"
        :current-page-size="currentPageSize"
        :page-count="pageCount"
        @page-change="currentPage = $event"
        @page-size-change="currentPageSize = $event"
      />
    </div>

    <!-- 顶部操作区域 -->
    <ActionBar
      @create="handleCreate"
      @import="handleImport"
      @export="handleExport"
      @refresh="handleRefreshView"
      @print="handlePrint"
      @fullscreen="handleFullscreen"
      @config="showConfigPanel = true"
    />

    <!-- 筛选控制区 -->
    <FilterSection
      :visible="filterVisible"
      :filter-bar-fields="filterBarFields"
      :advanced-filter-fields="advancedFilterFields"
      :filter-values="filterValues"
      :advanced-filter-count="advancedFilterCount"
      :show-advanced="showAdvancedFilter"
      @search="handleSearch"
      @reset="handleReset"
      @show-advanced="showAdvancedFilter = true"
      @update-advanced="showAdvancedFilter = $event"
      @update-filter="updateFilter"
      @advanced-search="handleAdvancedSearch"
      @advanced-reset="handleAdvancedReset"
    />

    <!-- 数据表格区域 -->
    <TableSection
      :checked-row-keys="checkedRowKeys"
      :batch-actions="batchActions"
      @batch-action="handleBatchAction"
      @create="handleCreate"
      @print="handlePrint"
      @config="showConfigPanel = true"
      @update-checked-keys="updateCheckedRowKeys"
      @clear-selection="checkedRowKeys = []"
      @refresh="handleRefreshView"
      @fullscreen="handleFullscreen"
    />
    
    <!-- 配置面板 -->
    <ConfigPanel 
      :show="showConfigPanel" 
      :current-view-name="currentViewName"
      :table-id="'default'"
      :view-key="currentView"
      @update:show="showConfigPanel = $event"
      @config-change="handleConfigChange"
      @update-view-name="handleUpdateViewName"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, provide, watch, type Ref } from 'vue'
import ActionBar from './components/ActionBar.vue'
import PaginationBar from './components/PaginationBar.vue'
import ViewManager from './components/ViewManager/index.vue'
import FilterSection from './components/FilterSection.vue'
import TableSection from './components/TableSection.vue'
import ConfigPanel from './Config/ConfigPanel.vue'
import { useViewManager } from './composables/useViewManager'
import { useTableData } from './composables/useTableData'
import { useTableActions } from './composables/useTableActions'
import { useTableConfigStore } from '@/store/modules/tableConfig'

const emit = defineEmits(['openConfig', 'viewNameChange', 'viewChange'])
const config = inject('tableConfig') as Ref<any>
const tableStore = useTableConfigStore()

// 合并默认配置
if (config?.value) {
  const defaultConfig = {
    basic: {
      loading: false,
      scrollX: undefined,
      maxHeight: undefined,
      height: undefined,
      bordered: true,
      striped: false,
      compact: false,
      size: 'medium',
      fontSize: 14,
      childrenKey: 'children',
      defaultExpandAll: false,
      showSummaryRow: false,
      rowDensity: 'medium',
      rowHeight: 36,
      customRowHeight: undefined,
      showRowNumber: false,
      headerTextWrap: false
    },
    interaction: {
      mode: 'classic',
      showRecordShortcut: false
    },
    selection: {
      allowCheckingNotLoaded: false,
      cascade: false,
      enabled: false
    },
    actionBar: {
      enabled: true,
      showCreate: true,
      showImport: true,
      showExport: true,
      showRefresh: true,
      showPrint: true,
      showFullscreen: true,
      showConfig: true
    },
    pagination: {
      enabled: true,
      defaultPageSize: 10,
      showSizeChanger: true,
      showQuickJumper: true,
      pageSizeOptions: ['10', '20', '50', '100']
    },
    autoRefresh: {
      enabled: false,
      interval: 30
    },
    editing: {},
    filters: [],
    actions: [],
    dataFilter: {
      groups: [{
        name: '条件组 1',
        logic: 'AND',
        groupLogic: 'AND',
        conditions: []
      }]
    }
  }
  
  // 深度合并配置
  Object.keys(defaultConfig).forEach(key => {
    if (!config.value[key]) {
      config.value[key] = defaultConfig[key]
    } else if (typeof defaultConfig[key] === 'object' && !Array.isArray(defaultConfig[key])) {
      config.value[key] = { ...defaultConfig[key], ...config.value[key] }
    }
  })
}

// 配置面板控制
const showConfigPanel = ref(false)

// 使用组合式函数分离职责
const {
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
} = useViewManager(config, emit)

const {
  totalCount,
  currentPage,
  currentPageSize,
  pageCount,
  filterValues,
  showAdvancedFilter,
  filterVisible,
  filterBarFields,
  advancedFilterFields,
  advancedFilterCount,
  updateFilter,
  handleSearch,
  handleReset,
  handleAdvancedSearch,
  handleAdvancedReset,
  handleRefreshView
} = useTableData(config)

const {
  checkedRowKeys,
  batchActions,
  handleBatchAction,
  handleCreate,
  handlePrint,
  handleFullscreen,
  updateCheckedRowKeys
} = useTableActions(config)

// 监听视图名称变化并传递给父组件
watch(currentViewName, (newName) => {
  emit('viewNameChange', newName)
}, { immediate: true })

// 暴露方法给父组件调用
const updateCurrentViewName = (newName: string) => {
  // 更新当前视图的名称到 store
  const views = tableStore.getViews('default')
  const currentViewData = views.find(v => v.key === currentView.value)
  if (currentViewData) {
    tableStore.updateView('default', currentView.value, { label: newName })
  }
}

// 暴露给父组件
defineExpose({
  updateCurrentViewName
})

// 导入导出处理
const handleImport = (type: string) => {
  console.log('导入:', type)
  config.value.events?.onImport?.(type)
}

const handleExport = (type: string) => {
  console.log('导出:', type)
  config.value.events?.onExport?.(type)
}

// 配置面板处理
const handleConfigChange = (newConfig: any) => {
  console.log('配置已更新:', newConfig)
}

const handleUpdateViewName = (newName: string) => {
  emit('viewNameChange', newName)
}

provide('checkedRowKeys', checkedRowKeys)
provide('totalCount', totalCount)
</script>

<style scoped>
.table-lowcode2-layout {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: white;
  border-radius: 8px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
}
</style>
