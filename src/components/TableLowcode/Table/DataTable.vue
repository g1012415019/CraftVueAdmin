<template>
  <n-data-table
    :columns="columns"
    :data="data"
    :pagination="pagination"
    :loading="loading"
    :row-key="rowKey"
    :scroll-x="scrollX"
    :scroll-y="scrollY"
    :bordered="displaySettings?.showBorder"
    :single-line="!displaySettings?.showStripe"
    :row-props="rowProps"
    :max-height="scrollY || undefined"
  />
</template>

<script lang="ts" setup>
import { ref, computed, h } from 'vue';
import { NDataTable, NButton } from 'naive-ui';
import type { DataTableColumn } from 'naive-ui';
import { ColumnConfig } from '../../types/ColumnConfig';
import { ActionColumnConfig, ActionButton } from '../../types/ActionColumnConfig';
import { TableGeneralSettings } from '../../types/TableGeneralSettings';
import { ViewConfig } from '../../types/ViewConfig';

interface Props {
  columnsConfig?: ColumnConfig[];
  actionsConfig?: ActionColumnConfig;
  tableGeneralSettings?: TableGeneralSettings;
  viewConfig?: ViewConfig;
  data: any[];
  loading?: boolean;
  pagination?: any; // Naive UI pagination object
}

const props = defineProps<Props>();

const columns = computed<DataTableColumn[]>(() => {
  const cols: DataTableColumn[] = [];

  if (props.tableGeneralSettings?.showIndexColumn) {
    cols.push({
      title: '#',
      key: 'index',
      width: 60,
      render: (row, index) => index + 1,
    });
  }

  props.columnsConfig?.forEach(col => {
    const column: DataTableColumn = {
      key: col.field,
      title: col.title,
      width: col.width === 'auto' ? undefined : col.width,
      align: col.align,
      sorter: col.sortable ? 'default' : undefined,
      resizable: col.resizable,
      fixed: col.fixed === 'none' ? undefined : col.fixed,
      ellipsis: col.ellipsis,
    };

    // Basic custom render for now, can be expanded
    if (col.customRender) {
      column.render = (row) => {
        // This is a placeholder. In a real scenario, you'd dynamically load
        // a component or execute a function based on col.customRender.
        return h('span', {}, `Custom Render for ${row[col.field]}`);
      };
    }

    cols.push(column);
  });

  if (props.actionsConfig && props.actionsConfig.actions.length > 0) {
    cols.push({
      title: '操作',
      key: 'actions',
      width: props.actionsConfig.width,
      fixed: props.actionsConfig.fixed === 'none' ? undefined : props.actionsConfig.fixed,
      render: (row) => {
        return props.actionsConfig?.actions.map((action: ActionButton) => {
          // Basic rendering for now, will be expanded with permission/confirm logic
          return h(NButton,
            {
              size: 'small',
              type: action.type === 'link' ? 'info' : 'default',
              text: action.type === 'link',
              onClick: () => {
                console.log(`Action ${action.label} clicked for row:`, row);
                // In a real scenario, you'd execute the function referenced by action.onClick
              },
              disabled: action.disabled,
              hidden: action.hidden,
            },
            { default: () => action.label }
          );
        });
      },
    });
  }

  return cols;
});

const loading = computed(() => props.loading || false);
const rowKey = computed(() => props.tableGeneralSettings?.rowKey || 'id');
const scrollX = computed(() => props.tableGeneralSettings?.scrollX || undefined);
const scrollY = computed(() => props.tableGeneralSettings?.scrollY || undefined);
const displaySettings = computed(() => props.viewConfig?.displaySettings);

const rowProps = ({ row }: { row: any }) => {
  return {
    onClick: () => {
      console.log('Row clicked:', row);
      // Emit row-click event or handle rowClickAction
    },
  };
};

</script>
