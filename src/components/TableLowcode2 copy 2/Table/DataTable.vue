<template>
  <div class="table-lowcode-container">
    <!-- 表格标题和描述 -->
    <div v-if="config.basic.title || config.basic.description" class="table-header mb-4">
      <h3 v-if="config.basic.title" class="table-title">{{ config.basic.title }}</h3>
      <p v-if="config.basic.description" class="table-description text-gray-500">{{ config.basic.description }}</p>
    </div>

    <!-- 顶部工具栏 -->
    <TableToolbar
      v-if="config.actions.batch && config.actions.batch.length > 0 && config.actions.batchPosition === 'top'"
      :batchActions="config.actions.batch"
      :handleBatchAction="handleBatchAction"
    />

    <!-- 表格容器 -->
    <div class="table-container" style="position: relative;">
      <!-- 固定操作栏 -->
      <div v-if="checkedRowKeys.length > 0" class="fixed-action-bar">
        <n-space size="small">
          <n-text>已选择 {{ checkedRowKeys.length }} 项</n-text>
          
          <!-- 原有操作按钮 -->
          <n-button
            v-for="action in config.actions.inline || []"
            :key="action.key"
            :type="action.type"
            size="small"
            @click="action.onClick && action.onClick(getSelectedRows())"
          >
            {{ action.label }}
          </n-button>
        </n-space>
      </div>

      <!-- 主表格 -->
    <n-data-table
      :columns="columns"
      :data="tableData"
      :pagination="paginationConfig"
      :loading="config.basic.loading"
      :row-key="rowKey"
      :scroll-x="config.basic.scrollX || undefined"
      :scroll-y="config.basic.maxHeight || config.basic.height || undefined"
      :bordered="config.basic.bordered"
      :single-line="!config.basic.striped"
      :row-props="rowProps"
      :max-height="config.basic.maxHeight || undefined"
      :height="config.basic.height || undefined"
      :size="config.basic.compact ? 'small' : 'medium'"
      :striped="config.basic.striped"
      :style="{
        '--n-font-size': config.basic.fontSize + 'px',
        '--n-th-height': config.basic.rowHeight + 'px',
        '--n-td-height': config.basic.rowHeight + 'px',
        '--n-merged-th-height': config.basic.rowHeight + 'px',
        '--n-merged-td-height': config.basic.rowHeight + 'px',
      }"
      @update:sorter="handleSorterChange"
      @update:filters="handleFiltersChange"
      :checked-row-keys="checkedRowKeys"
      @update:checked-row-keys="handleUpdateCheckedRowKeys"
      :row-class-name="(row) => {
        let className = rowClassName(row);
        if (selectedRowData === row) {
          className += ' selected-row';
        }
        return className;
      }"
    />
    </div>

    <!-- 底部工具栏 -->
    <TableToolbar
      v-if="config.actions.batch && config.actions.batch.length > 0 && config.actions.batchPosition === 'bottom'"
      :batchActions="config.actions.batch"
      :handleBatchAction="handleBatchAction"
    />

    <!-- 右键菜单 -->
    <TableContextMenu
      v-if="config.interaction.contextMenu"
      :showDropdown="showDropdown"
      :dropdownX="dropdownX"
      :dropdownY="dropdownY"
      :contextMenuOptions="contextMenuOptions"
      :onClickoutside="onClickoutside"
      :handleMenuSelect="handleMenuSelect"
    />
    <!-- 悬浮操作栏 -->
    <FloatingActionBar
      :show="showFloatingBar"
      :x="floatingBarX"
      :y="floatingBarY"
      :current-row="currentHoveredRow"
      :actions="config.actions.inline || []"
      @action="handleFloatingAction"
    />

    <!-- 列头下拉菜单 -->
    <ColumnHeaderDropdown
      v-model:show="showColumnDropdown"
      :x="columnDropdownX"
      :y="columnDropdownY"
      :column-key="currentColumnKey"
      :column-config="getCurrentColumnConfig()"
      @sort="handleSort"
      @filter="handleFilter"
      @hide="handleHide"
    />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import { useTableData } from '@/components/TableLowcode2/Table/composables/useTableData';
import { useTableEditing } from '@/components/TableLowcode2/Table/composables/useTableEditing';
import { useTableContextMenu } from '@/components/TableLowcode2/Table/composables/useTableContextMenu';
import { useTableRowInteraction } from '@/components/TableLowcode2/Table/composables/useTableRowInteraction';
import { useTableColumns } from '@/components/TableLowcode2/Table/composables/useTableColumns';
import { useColumnDropdown } from '@/components/TableLowcode2/Table/composables/useColumnDropdown';

import { useFloatingActionBar } from '@/components/TableLowcode2/Table/composables/useFloatingActionBar';

import TableToolbar from '@/components/TableLowcode2/TableToolbar.vue';
import TableContextMenu from '@/components/TableLowcode2/TableContextMenu.vue';
import ColumnHeaderDropdown from '@/components/TableLowcode2/Table/ColumnHeaderDropdown.vue';
import FloatingActionBar from '@/components/TableLowcode2/Table/FloatingActionBar.vue';
import { TableConfig } from '@/types/table';
import type { DataTableRowKey } from 'naive-ui';

// 注入共享的配置状态
const config = inject('tableConfig') as Ref<TableConfig>;

// 悬停行数据
const hoveredRowData = ref(null);
// 选中行数据
const selectedRowData = ref(null);

// 使用 composables
const {
  tableData,
  loading,
  paginationConfig,
  checkedRowKeys,
  fetchData,
  handleBatchAction,
  handleSorterChange,
  handleFiltersChange,
  currentPage,
  currentPagesize,
} = useTableData();

// 处理 checkedRowKeys 更新的函数
const handleUpdateCheckedRowKeys = (keys: DataTableRowKey[]) => {
  checkedRowKeys.value = keys;
};

const {
  editingRowKey,
  editedData,
  startEdit,
  handleSaveEdit,
  handleCancelEdit,
} = useTableEditing(tableData);

const {
  showDropdown,
  dropdownX,
  dropdownY,
  rightClickedRow,
  handleContextMenu,
  onClickoutside,
  contextMenuOptions,
  handleMenuSelect,
} = useTableContextMenu();

const {
  showFloatingBar,
  floatingBarX,
  floatingBarY,
  currentHoveredRow,
  handleRowHover,
  handleRowLeave,
  handleFloatingAction,
} = useFloatingActionBar();

const {
  rowProps,
  rowClassName,
  moveRowUp,
  moveRowDown,
  hoveredRowKey,
} = useTableRowInteraction(tableData, startEdit, handleContextMenu, editingRowKey, handleRowHover, handleRowLeave);

const {
  showDropdown: showColumnDropdown,
  dropdownX: columnDropdownX,
  dropdownY: columnDropdownY,
  currentColumnKey,
  handleDropdownClick,
  handleSort,
  handleFilter,
  handleHide,
  getCurrentColumnConfig,
} = useColumnDropdown();

const {
  columns,
} = useTableColumns(
  currentPage,
  currentPagesize,
  editingRowKey,
  editedData,
  startEdit,
  handleSaveEdit,
  handleCancelEdit,
  checkedRowKeys,
  handleUpdateCheckedRowKeys,
  tableData,
  hoveredRowKey,
  handleDropdownClick
);

// 行键函数
const rowKey = (row: any) => row.key;
const handleTableMouseOver = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  const row = target.closest('tr[data-key]');
  if (row) {
    const rowKey = row.getAttribute('data-key');
    const rowData = tableData.value.find(item => String(item.key) === rowKey);
    if (rowData) {
      console.log('表格悬停行:', rowData);
      handleRowHover(rowData, e);
    }
  }
};

const handleRowClick = (row: any) => {
  // 如果点击的是同一行，则取消选中
  if (selectedRowData.value === row) {
    selectedRowData.value = null;
  } else {
    selectedRowData.value = row;
  }
};

const getSelectedRows = () => {
  return tableData.value.filter(row => checkedRowKeys.value.includes(row.key));
};
</script>

<style scoped>
.table-lowcode-container {
  /* 表格容器样式 */
}

/* 行悬停效果 */
:deep(.table-row-hovered) {
  background-color: rgba(24, 160, 88, 0.05) !important;
}

/* 编辑中的行样式 */
:deep(.table-row-editing) {
  background-color: rgba(24, 160, 88, 0.1) !important;
}

/* 复选框和行号的基础样式 */
:deep(.table-selection-checkbox) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

:deep(.table-row-number) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  width: 100% !important;
}

/* 列头下拉图标样式 */
:deep(.n-data-table-th) {
  position: relative;
}

:deep(.n-data-table-th .n-icon) {
  transition: opacity 0.2s ease !important;
}

/* 确保列头内容对齐 */
:deep(.n-data-table-th .n-space) {
  width: 100% !important;
}

/* 动态行高样式 */
:deep(.n-data-table .n-data-table-td) {
  height: v-bind('config.basic.rowHeight + "px"') !important;
  max-height: v-bind('config.basic.rowHeight + "px"') !important;
  min-height: v-bind('config.basic.rowHeight + "px"') !important;
  padding: 0 12px !important;
  line-height: v-bind('(config.basic.rowHeight - 8) + "px"') !important;
}

:deep(.n-data-table .n-data-table-th) {
  height: v-bind('config.basic.rowHeight + "px"') !important;
  max-height: v-bind('config.basic.rowHeight + "px"') !important;
  min-height: v-bind('config.basic.rowHeight + "px"') !important;
  padding: 0 12px !important;
  line-height: v-bind('(config.basic.rowHeight - 8) + "px"') !important;
}

/* 动态字体大小 */
:deep(.n-data-table) {
  font-size: v-bind('config.basic.fontSize + "px"') !important;
}

/* 固定操作栏 */
.fixed-action-bar {
  position: absolute;
  top: -50px;
  right: 0;
  background: white;
  border: 1px solid #e0e0e6;
  border-radius: 6px;
  padding: 6px 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
  transition: opacity 0.2s ease;
}

:deep(.n-data-table tbody tr:hover) {
  background-color: rgba(24, 160, 88, 0.05) !important;
}

:deep(.n-data-table tbody tr.selected-row) {
  background-color: rgba(24, 160, 88, 0.15) !important;
}

:deep(.n-data-table tbody tr.selected-row:hover) {
  background-color: rgba(24, 160, 88, 0.2) !important;
}
</style>
