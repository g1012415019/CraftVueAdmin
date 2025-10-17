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
        @edit-view="handleEditView"
        @duplicate-view="handleDuplicateView"
        @delete-view="handleDeleteView"
        @set-default="handleSetDefault"
        @share-view="handleShareView"
        @export-view="handleExportView"
        @rename-view="handleRenameView"
      />
      
      <PaginationBar
        :total-count="totalCount"
        :filtered-count="filteredCount"
        :current-page="currentPage"
        :current-page-size="currentPageSize"
        :page-count="pageCount"
        @refresh="handleRefreshView"
        @page-change="currentPage = $event"
        @page-size-change="currentPageSize = $event"
      />
    </div>

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
      @config="emit('openConfig')"
      @update-checked-keys="updateCheckedRowKeys"
      @clear-selection="checkedRowKeys = []"
      @refresh="handleRefreshView"
      @fullscreen="handleFullscreen"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, provide, onMounted, onUnmounted, type Ref } from 'vue'
import ViewManager from './components/ViewManager.vue'
import PaginationBar from './components/PaginationBar.vue'
import FilterSection from './components/FilterSection.vue'
import TableSection from './components/TableSection.vue'
import { useViewManager } from './composables/useViewManager'
import { useTableData } from './composables/useTableData'
import { useTableActions } from './composables/useTableActions'

const emit = defineEmits(['openConfig'])
const config = inject('tableConfig') as Ref<any>

// 使用组合式函数分离职责
const {
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
} = useViewManager(config, emit)

const {
  totalCount,
  filteredCount,
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

// 键盘快捷键
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey && event.key >= '1' && event.key <= '4') {
    event.preventDefault()
    const targetView = viewTabs.value[parseInt(event.key) - 1]
    if (targetView) handleViewChange(targetView.key)
  }
}

onMounted(() => document.addEventListener('keydown', handleKeydown))
onUnmounted(() => document.removeEventListener('keydown', handleKeydown))

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
