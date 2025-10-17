
import { h, computed, inject } from 'vue';
import { NCheckbox, NIcon } from 'naive-ui';
import { ChevronDownOutline } from '@vicons/ionicons5';
import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
import { TableConfig, TableData } from '@/types/table';
import { useColumnHeader } from './useColumnHeader';

export function useSelectionColumn(
  currentPage: Ref<number>,
  currentPagesize: Ref<number>,
  checkedRowKeys: Ref<DataTableRowKey[]>,
  handleUpdateCheckedRowKeys: (keys: DataTableRowKey[]) => void,
  hoveredColumnKey: Ref<string | null>,
  tableData: Ref<TableData[]>,
  hoveredRowKey: Ref<DataTableRowKey | null>,
  onDropdownClick?: (columnKey: string, event: MouseEvent) => void
) {
  const config = inject('tableConfig') as Ref<TableConfig>;
  const { renderColumnHeader } = useColumnHeader(onDropdownClick);

  // 计算全选状态
  const isAllChecked = computed(() => {
    if (tableData.value.length === 0) return false;
    return tableData.value.every(row => checkedRowKeys.value.includes(row.key));
  });

  const isIndeterminate = computed(() => {
    const checkedCount = tableData.value.filter(row => checkedRowKeys.value.includes(row.key)).length;
    return checkedCount > 0 && checkedCount < tableData.value.length;
  });

  // 处理全选/取消全选
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = tableData.value.map(row => row.key);
      handleUpdateCheckedRowKeys(allKeys);
    } else {
      handleUpdateCheckedRowKeys([]);
    }
  };

  const selectionColumn = computed(() => {
    const isSelectionEnabled = config.value.selection.enabled;
    const showRowNumber = config.value.basic.showRowNumber;

    if (!isSelectionEnabled && !showRowNumber) {
      return null;
    }

    const col: DataTableColumns<TableData>[0] = {
      title: () => {
        if (isSelectionEnabled && config.value.selection.mode === 'multiple') {
          return h('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              position: 'relative'
            }
          }, [
            h(NCheckbox, {
              checked: isAllChecked.value,
              indeterminate: isIndeterminate.value,
              onUpdateChecked: handleSelectAll,
            }),
            h(NIcon, {
              style: {
                opacity: '1',
                cursor: 'pointer',
                position: 'absolute',
                right: '4px',
                fontSize: '14px'
              },
              onClick: (e: MouseEvent) => {
                e.stopPropagation();
                onDropdownClick?.('row-index-selection', e);
              }
            }, () => h(ChevronDownOutline))
          ]);
        }
        return renderColumnHeader('row-index-selection', '#', hoveredColumnKey, true);
      },
      key: 'row-index-selection',
      width: config.value.basic.rowNumberWidth || 60,
      align: config.value.basic.rowNumberAlign || 'center',
      fixed: config.value.selection.columnPosition || 'left',
      render: (row, index) => {
        const isRowHovered = hoveredRowKey.value === row.key;
        const rowNumber = (currentPage.value - 1) * currentPagesize.value + index + (config.value.basic.rowNumberStart || 1);
        
        return h('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
          }
        }, [
          // 复选框 - 在行悬停时显示，或者已选中时显示
          isSelectionEnabled && (isRowHovered || checkedRowKeys.value.includes(row.key))
            ? h(NCheckbox, {
                class: 'table-selection-checkbox',
                checked: checkedRowKeys.value.includes(row.key),
                onUpdateChecked: (val: boolean) => {
                  const newCheckedKeys = val
                    ? [...checkedRowKeys.value, row.key]
                    : checkedRowKeys.value.filter((key) => key !== row.key);
                  handleUpdateCheckedRowKeys(newCheckedKeys);
                },
              })
            : null,
          // 行号 - 在没有悬停且未选中时显示
          showRowNumber && (!isRowHovered || !isSelectionEnabled) && !checkedRowKeys.value.includes(row.key)
            ? h('span', { 
                class: 'table-row-number',
                style: {
                  fontSize: '12px',
                  color: '#999',
                  fontWeight: 'normal'
                }
              }, rowNumber)
            : null,
        ]);
      },
      onHeaderCell: (column) => ({
        onMouseenter: () => {
          hoveredColumnKey.value = column.key as string;
        },
        onMouseleave: () => {
          hoveredColumnKey.value = null;
        },
      }),
    };
    return col;
  });

  return { selectionColumn };
}
