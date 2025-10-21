import { computed, ref } from 'vue'
import { useSelectionColumn } from './useSelectionColumn.tsx'
import { useDataColumns } from './useDataColumns.tsx'
import { useActionColumn } from './useActionColumn.tsx'

export function useTableColumns(
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
  onDropdownClick,
  selectedCell
) {
  const hoveredColumnKey = ref(null)

  const { selectionColumn } = useSelectionColumn(
    currentPage,
    currentPagesize,
    checkedRowKeys,
    handleUpdateCheckedRowKeys,
    hoveredColumnKey,
    tableData,
    hoveredRowKey,
    onDropdownClick
  )

  const { dataColumns } = useDataColumns(
    editingRowKey,
    editedData,
    hoveredColumnKey,
    onDropdownClick,
    selectedCell
  )

  const { actionColumn } = useActionColumn(
    editingRowKey,
    handleSaveEdit,
    handleCancelEdit,
    hoveredColumnKey,
    onDropdownClick
  )

  const columns = computed(() => {
    const cols = []

    // 添加选择/序号列
    if (selectionColumn.value) {
      cols.push(selectionColumn.value)
    }

    // 添加数据列
    cols.push(...dataColumns.value)

    // 添加操作列
    if (actionColumn.value) {
      cols.push(actionColumn.value)
    }

    return cols
  })

  return {
    columns,
  }
}
