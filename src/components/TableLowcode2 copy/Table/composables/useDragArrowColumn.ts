import { computed, inject, h } from 'vue';
import type { DataTableRowKey } from 'naive-ui';
import { TableConfig, TableData } from '@/types/table';

export function useDragArrowColumn(
  moveRowUp: (key: DataTableRowKey) => void,
  moveRowDown: (key: DataTableRowKey) => void
) {
  const config = inject('tableConfig') as Ref<TableConfig>;

  const dragArrowColumn = computed(() => {
    if (!config.value.interaction.dragSort) {
      return null;
    }

    return {
      key: 'drag-arrows',
      title: '',
      width: 50,
      render: (row: TableData) => {
        return h('div', {
          style: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            padding: '2px'
          }
        }, [
          h('button', {
            style: {
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '2px 4px',
              color: '#666',
              fontSize: '12px',
              lineHeight: '1'
            },
            onClick: (e: Event) => {
              e.stopPropagation();
              moveRowUp(row.key);
            },
            onMouseenter: (e: Event) => {
              (e.target as HTMLElement).style.color = '#18a058';
            },
            onMouseleave: (e: Event) => {
              (e.target as HTMLElement).style.color = '#666';
            }
          }, '↑'),
          h('button', {
            style: {
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '2px 4px',
              color: '#666',
              fontSize: '12px',
              lineHeight: '1'
            },
            onClick: (e: Event) => {
              e.stopPropagation();
              moveRowDown(row.key);
            },
            onMouseenter: (e: Event) => {
              (e.target as HTMLElement).style.color = '#18a058';
            },
            onMouseleave: (e: Event) => {
              (e.target as HTMLElement).style.color = '#666';
            }
          }, '↓')
        ]);
      }
    };
  });

  return {
    dragArrowColumn,
  };
}
