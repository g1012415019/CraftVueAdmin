
import { h, computed, ref, Ref, inject } from 'vue';
import { NButton, NPopconfirm, NSpace, NIcon } from 'naive-ui';
import { ChevronDownOutline } from '@vicons/ionicons5';
import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
import { TableConfig, TableData } from '@/types/table';
import { useColumnHeader } from './useColumnHeader';

export function useActionColumn(
  editingRowKey: Ref<DataTableRowKey | null>,
  handleSaveEdit: (key: DataTableRowKey) => void,
  handleCancelEdit: (key: DataTableRowKey) => void,
  hoveredColumnKey: Ref<string | null>,
  onDropdownClick?: (columnKey: string, event: MouseEvent) => void
) {
  const config = inject('tableConfig') as Ref<TableConfig>;
  const { renderColumnHeader } = useColumnHeader(onDropdownClick);

  const actionColumn = computed(() => {
    // 默认不显示操作列，使用悬浮操作栏
    if (!config.value.actions.inline || config.value.actions.inline.length === 0) {
      return null;
    }
    
    // 可以通过配置控制是否显示传统操作列
    if (config.value.actions.showInlineColumn === false) {
      return null;
    }

    const col: DataTableColumns<TableData>[0] = {
      title: () => renderColumnHeader('actions', '操作', hoveredColumnKey, false),
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (row: TableData) => {
        if (config.value.editing.inlineEditingEnabled && editingRowKey.value === row.key) {
          return h(NSpace, {}, () => [
            h(NButton, { size: 'small', type: 'primary', onClick: () => handleSaveEdit(row.key) }, () => '保存'),
            h(NButton, { size: 'small', onClick: () => handleCancelEdit(row.key) }, () => '取消'),
          ]);
        }
        return h(NSpace, {}, () => [
          ...config.value.actions.inline.map((action) => {
            const button = h(
              NButton,
              {
                size: 'small',
                type: action.type || 'default',
                style: { 'margin-right': '8px', 'margin-bottom': '4px' },
                onClick: () => {
                  if (action.onClick) {
                    action.onClick(row);
                  }
                },
              },
              { default: () => action.label }
            );
            if (action.showConfirmation) {
              return h(
                NPopconfirm,
                {
                  onPositiveClick: () => {
                    if (action.onClick) {
                      action.onClick(row);
                    }
                  },
                  negativeText: '取消',
                  positiveText: '确定'
                },
                {
                  trigger: () => button,
                  default: () => action.confirmationText || '确定要执行此操作吗？'
                }
              );
            } else {
              return button;
            }
          }),
        ]);
      },
    };
    return col;
  });

  return { actionColumn };
}
