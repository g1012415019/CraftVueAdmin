<template>
  <div class="data-table-container">
    <!-- 表格容器 -->
    <div class="table-container" style="position: relative;">
      <!-- 主表格 -->
      <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="false"
        :loading="config.basic.loading"
        :row-key="rowKey"
        :scroll-x="config.basic.scrollX || undefined"
        :scroll-y="config.basic.maxHeight || config.basic.height || undefined"
        :bordered="config.basic.bordered || config.interaction?.mode === 'spreadsheet'"
        :single-line="config.interaction?.mode === 'spreadsheet' ? false : !config.basic.striped"
        :row-props="rowProps"
        :max-height="config.basic.maxHeight || undefined"
        :height="config.basic.height || undefined"
        :size="getTableSize()"
        :striped="config.basic.striped || config.interaction?.mode === 'spreadsheet'"
        :style="getTableStyle()"
        @update:sorter="handleSorterChange"
        @update:filters="handleFiltersChange"
        :checked-row-keys="checkedRowKeys"
        @update:checked-row-keys="handleUpdateCheckedRowKeys"
        :row-class-name="getRowClassName"
        :allow-checking-not-loaded="config.selection.allowCheckingNotLoaded"
        :cascade="config.selection.cascade"
        :children-key="config.basic.childrenKey"
        :default-expand-all="config.basic.defaultExpandAll"
        :indent="config.basic.indent"
        :flex-height="config.basic.flexHeight"
        :summary="config.basic.showSummaryRow ? getSummaryData : undefined"
        :render-cell="config.basic.renderCell"
        :render-expand-icon="config.basic.renderExpandIcon"
        @click="handleTableClick"
      />
    </div>

    <!-- 右键菜单已移除 -->
    
    <!-- 右键菜单 -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="contextMenuX"
      :y="contextMenuY"
      :options="contextMenuOptions"
      :show="showContextMenu"
      :on-clickoutside="hideContextMenu"
      @select="handleContextMenuSelect"
    />
    
    <!-- 悬浮操作栏已移除 -->

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

<style scoped>
/* 电子表格模式单元格选中样式 */
:deep(.n-data-table td.selected-cell) {
  background-color: #e6f7ff !important;
  border: 2px solid #1890ff !important;
}
</style>

<script setup lang="ts">
import { inject, onMounted, ref, computed, h } from 'vue';
import { useTableData } from '@/components/TableLowcode2/Table/composables/useTableData.tsx';
import { useTableEditing } from '@/components/TableLowcode2/Table/composables/useTableEditing.tsx';
import { useTableContextMenu } from '@/components/TableLowcode2/Table/composables/useTableContextMenu.tsx';
import { useTableRowInteraction } from '@/components/TableLowcode2/Table/composables/useTableRowInteraction.tsx';
import { useTableColumns } from '@/components/TableLowcode2/Table/composables/useTableColumns.tsx';
import { useColumnDropdown } from '@/components/TableLowcode2/Table/composables/useColumnDropdown.tsx';
import { useFloatingActionBar } from '@/components/TableLowcode2/Table/composables/useFloatingActionBar.tsx';

import { useAutoRefresh } from '@/components/TableLowcode2/Table/composables/useAutoRefresh.tsx';

import ColumnHeaderDropdown from '@/components/TableLowcode2/Table/ColumnHeaderDropdown.vue';
import { TableConfig } from '@/types/table';
import type { DataTableRowKey } from 'naive-ui';

// 定义 emits
const emit = defineEmits(['update-checked-keys']);

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
  emit('update-checked-keys', keys);
};

const {
  editingRowKey,
  editedData,
  startEdit,
  handleSaveEdit,
  handleCancelEdit,
} = useTableEditing(tableData);

const {
  showContextMenu,
  contextMenuX,
  contextMenuY,
  currentRow,
  handleContextMenu,
  hideContextMenu
} = useTableContextMenu();

// 右键菜单选项
const contextMenuOptions = computed(() => [
  {
    label: '编辑',
    key: 'edit',
    icon: () => h('i', { class: 'i-mdi-pencil' })
  },
  {
    label: '删除',
    key: 'delete',
    icon: () => h('i', { class: 'i-mdi-delete' })
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '复制',
    key: 'copy',
    icon: () => h('i', { class: 'i-mdi-content-copy' })
  },
  {
    label: '查看详情',
    key: 'detail',
    icon: () => h('i', { class: 'i-mdi-eye' })
  }
]);

// 右键菜单选择处理
const handleContextMenuSelect = (key: string) => {
  if (!currentRow.value) return;
  
  switch (key) {
    case 'edit':
      console.log('编辑行:', currentRow.value);
      config.events?.onEdit?.(currentRow.value);
      break;
    case 'delete':
      console.log('删除行:', currentRow.value);
      config.events?.onDelete?.(currentRow.value);
      break;
    case 'copy':
      console.log('复制行:', currentRow.value);
      // 复制到剪贴板
      navigator.clipboard?.writeText(JSON.stringify(currentRow.value));
      break;
    case 'detail':
      console.log('查看详情:', currentRow.value);
      config.events?.onRecordDetail?.(currentRow.value);
      break;
  }
  
  hideContextMenu();
};

// const {
//   showFloatingBar,
//   floatingBarX,
//   floatingBarY,
//   currentHoveredRow,
//   handleRowHover,
//   handleRowLeave,
//   handleFloatingAction,
// } = useFloatingActionBar();

const {
  rowProps,
  rowClassName,
  moveRowUp,
  moveRowDown,
  hoveredRowKey,
  selectedCell,
  selectedRowKey,
  handleCellClick,
  handleCellDoubleClick,
  openRecordDetail,
} = useTableRowInteraction(tableData, startEdit, handleContextMenu, editingRowKey, null, null);

// 将选中状态暴露给全局，供单元格使用
window.tableSelectedCell = selectedCell;

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
  handleDropdownClick,
  selectedCell
);

const {
  isRefreshing,
  manualRefresh
} = useAutoRefresh(fetchData);

// 表格点击处理
const handleTableClick = (e: MouseEvent) => {
  if (config.value.interaction?.mode !== 'spreadsheet') return
  
  const target = e.target as HTMLElement
  const cell = target.closest('td')
  if (!cell) return
  
  const row = cell.closest('tr')
  if (!row) return
  
  // 移除之前的选中样式
  document.querySelectorAll('.selected-cell').forEach(el => {
    el.classList.remove('selected-cell')
  })
  
  const rowIndex = Array.from(row.parentElement!.children).indexOf(row)
  const cellIndex = Array.from(row.children).indexOf(cell)
  
  if (rowIndex >= 0 && cellIndex >= 0 && tableData.value[rowIndex]) {
    const rowData = tableData.value[rowIndex]
    const columnData = columns.value[cellIndex]
    
    if (columnData && columnData.key !== 'row-index-selection' && columnData.key !== 'actions') {
      selectedCell.value = { rowKey: rowData.key, columnKey: columnData.key }
      // 添加选中样式到当前单元格
      cell.classList.add('selected-cell')
      console.log('单元格选中:', rowData.key, columnData.key)
    }
  }
}

// 行键函数
const rowKey = (row: any) => row.key;

// 调试信息
onMounted(() => {
  console.log('DataTable mounted');
  console.log('selectedCell:', selectedCell.value);
  console.log('Config interaction mode:', config.value.interaction?.mode);
  console.log('Columns:', columns.value);
});

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

// 获取表格尺寸
const getTableSize = () => {
  if (config.value.basic.compact) return 'small';
  if (config.value.basic.size) return config.value.basic.size;
  return 'medium';
};

// 获取表格样式
const getTableStyle = () => {
  const rowHeight = getRowHeight();
  return {
    '--n-font-size': config.value.basic.fontSize + 'px',
    '--n-th-height': rowHeight + 'px',
    '--n-td-height': rowHeight + 'px',
    '--n-merged-th-height': rowHeight + 'px',
    '--n-merged-td-height': rowHeight + 'px',
  };
};

// 获取行高
const getRowHeight = () => {
  // 优先使用自定义行高
  if (config.value.basic?.customRowHeight) {
    return config.value.basic.customRowHeight;
  }
  
  // 使用配置中的行高
  if (config.value.basic?.rowHeight) {
    return config.value.basic.rowHeight;
  }
  
  // 根据密度计算行高
  const densityMap = {
    compact: 28,
    medium: 36,
    high: 44,
    ultra: 52
  };
  
  return densityMap[config.value.basic?.rowDensity] || 36;
};

// 获取行类名
const getRowClassName = (row) => {
  let className = rowClassName.value(row);
  if (selectedRowData.value === row) {
    className += ' selected-row';
  }
  return className;
};

// 获取汇总数据
const getSummaryData = () => {
  if (!config.value.basic.showSummaryRow) return undefined;
  
  // 这里可以根据配置计算汇总数据
  const summary = {};
  config.value.columns.forEach(col => {
    if (col.summaryType) {
      switch (col.summaryType) {
        case 'sum':
          summary[col.key] = tableData.value.reduce((sum, row) => sum + (Number(row[col.key]) || 0), 0);
          break;
        case 'avg':
          const values = tableData.value.map(row => Number(row[col.key]) || 0);
          summary[col.key] = values.reduce((sum, val) => sum + val, 0) / values.length;
          break;
        case 'count':
          summary[col.key] = tableData.value.length;
          break;
        case 'max':
          summary[col.key] = Math.max(...tableData.value.map(row => Number(row[col.key]) || 0));
          break;
        case 'min':
          summary[col.key] = Math.min(...tableData.value.map(row => Number(row[col.key]) || 0));
          break;
      }
    }
  });
  
  return summary;
};
</script>

<style scoped>
.data-table-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-container {
  flex: 1;
  overflow: hidden;
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
