import { computed, ref } from 'vue';
import type { DataTableRowKey } from 'naive-ui';
import { useSelectionColumn } from './useSelectionColumn';
import { useDataColumns } from './useDataColumns';
import { useActionColumn } from './useActionColumn';
import { TableData } from '@/types/table';

export function useTableColumns(
  currentPage: Ref<number>,
  currentPagesize: Ref<number>,
  editingRowKey: Ref<DataTableRowKey | null>,
  editedData: Ref<TableData | null>,
  startEdit: (key: DataTableRowKey) => void,
  handleSaveEdit: (key: DataTableRowKey) => void,
  handleCancelEdit: (key: DataTableRowKey) => void,
  checkedRowKeys: Ref<DataTableRowKey[]>,
  handleUpdateCheckedRowKeys: (keys: DataTableRowKey[]) => void,
  tableData: Ref<TableData[]>,
  hoveredRowKey: Ref<DataTableRowKey | null>,
  onDropdownClick?: (columnKey: string, event: MouseEvent) => void
) {
  const hoveredColumnKey = ref<string | null>(null);

  const { selectionColumn } = useSelectionColumn(
    currentPage,
    currentPagesize,
    checkedRowKeys,
    handleUpdateCheckedRowKeys,
    hoveredColumnKey,
    tableData,
    hoveredRowKey,
    onDropdownClick
  );

  const { dataColumns } = useDataColumns(
    editingRowKey,
    editedData,
    hoveredColumnKey,
    onDropdownClick
  );

  const { actionColumn } = useActionColumn(
    editingRowKey,
    handleSaveEdit,
    handleCancelEdit,
    hoveredColumnKey,
    onDropdownClick
  );

  const columns = computed(() => {
    const cols = [];
    if (selectionColumn.value) {
      cols.push(selectionColumn.value);
    }
    cols.push(...dataColumns.value);
    if (actionColumn.value) {
      cols.push(actionColumn.value);
    }
    return cols;
  });

  return {
    columns,
    hoveredColumnKey,
  };
}