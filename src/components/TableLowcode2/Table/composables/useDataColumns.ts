
import { h, computed, ref, Ref, inject } from 'vue';
import {
  NInput, NSelect, NSpace, NInputNumber, NDatePicker, NButton, NIcon
} from 'naive-ui';
import { ChevronDownOutline } from '@vicons/ionicons5';
import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
import { sorterFunctions } from '../utils/sorterFunctions';
import { TableConfig, TableData } from '@/types/table';
import { useColumnHeader } from './useColumnHeader';

export function useDataColumns(
  editingRowKey: Ref<DataTableRowKey | null>,
  editedData: Ref<TableData | null>,
  hoveredColumnKey: Ref<string | null>,
  onDropdownClick?: (columnKey: string, event: MouseEvent) => void
) {
  const config = inject('tableConfig') as Ref<TableConfig>;
  const { renderColumnHeader } = useColumnHeader(onDropdownClick);

  const dataColumns = computed(() => {
    const cols: DataTableColumns<TableData> = [];

    config.value.columns.forEach((col) => {
      if (!col.visible) return;

      const column: any = {
        title: () => renderColumnHeader(col.key, col.label, hoveredColumnKey, false),
        key: col.key,
        width: col.width || undefined,
        align: col.align,
        fixed: col.fixed || undefined,
        resizable: true,
        render: (row: TableData) => {
          if (config.value.editing.inlineEditingEnabled && config.value.editing.mode === 'row' && editingRowKey.value === row.key && col.editable) {
            const value = editedData.value ? editedData.value[col.key] : row[col.key];
            switch (col.dataType) {
              case 'number':
                return h(NInputNumber, {
                  value: value,
                  onUpdateValue: (val: number) => {
                    if (editedData.value) editedData.value[col.key] = val;
                  },
                  size: 'small',
                });
              case 'select':
                return h(NSelect, {
                  value: value,
                  options: col.selectOptions,
                  onUpdateValue: (val: string | number) => {
                    if (editedData.value) editedData.value[col.key] = val;
                  },
                  size: 'small',
                });
              case 'text':
              default:
                return h(NInput, {
                  value: value,
                  onUpdateInput: (val: string) => {
                    if (editedData.value) editedData.value[col.key] = val;
                  },
                  size: 'small',
                });
            }
          }
          return h('span', {}, row[col.key]);
        },
      };

      if (col.sortable) {
        // 使用自定义排序函数而不是 sorter: true，避免默认排序图标
        if (col.customSorter && sorterFunctions[col.customSorter]) {
          column.sorter = (row1: TableData, row2: TableData) =>
            sorterFunctions[col.customSorter!](row1, row2, col.key);
        } else {
          // 使用自定义排序函数替代 sorter: true
          column.sorter = (row1: TableData, row2: TableData) => {
            const val1 = row1[col.key];
            const val2 = row2[col.key];
            if (val1 < val2) return -1;
            if (val1 > val2) return 1;
            return 0;
          };
        }
        if (config.value.sortFilter.defaultSort.key === col.key && config.value.sortFilter.defaultSort.order) {
          column.defaultSortOrder = config.value.sortFilter.defaultSort.order;
        }
      }

      if (col.filterable) {
        column.filter = true;
        column.filterMultiple = false;
        if (col.filterType === 'enum' && col.filterOptions) {
          column.filterOptions = col.filterOptions.split(',').map((opt: string) => ({
            label: opt.trim(),
            value: opt.trim()
          }));
        } else if (col.filterType === 'boolean') {
          column.filterOptions = [
            { label: '是', value: 'true' },
            { label: '否', value: 'false' }
          ];
        }
        column.renderFilter = ({ value, confirm, clear }: any) => {
          if (col.filterType === 'text') {
            return h(NInput, {
              value: value || '',
              onUpdateValue: (val: string) => {
                value.value = val;
              },
              onKeydown: (e: KeyboardEvent) => {
                if (e.key === 'Enter') {
                  confirm();
                }
              },
              placeholder: '输入筛选条件',
              clearable: true
            });
          } else if (col.filterType === 'numberRange') {
            return h(NSpace, { vertical: true, size: 'small' }, () => [
              h(NInputNumber, {
                value: value?.[0] || null,
                onUpdateValue: (val: number | null) => {
                  if (!value.value) value.value = [null, null];
                  value.value[0] = val;
                },
                placeholder: '最小值',
                clearable: true
              }),
              h(NInputNumber, {
                value: value?.[1] || null,
                onUpdateValue: (val: number | null) => {
                  if (!value.value) value.value = [null, null];
                  value.value[1] = val;
                },
                placeholder: '最大值',
                clearable: true
              }),
              h(NSpace, { justify: 'end' }, () => [
                h(NButton, {
                  size: 'small',
                  onClick: () => clear()
                }, () => '重置'),
                h(NButton, {
                  size: 'small',
                  type: 'primary',
                  onClick: () => confirm()
                }, () => '确认')
              ])
            ]);
          } else if (col.filterType === 'dateRange') {
            return h(NDatePicker, {
              value: value || null,
              onUpdateValue: (val: [number, number] | null) => {
                value.value = val;
              },
              type: 'daterange',
              clearable: true,
              onConfirm: () => confirm(),
              onClear: () => clear()
            });
          }
          return null;
        };
      }
      cols.push(column);
    });

    return cols;
  });

  return { dataColumns };
}
