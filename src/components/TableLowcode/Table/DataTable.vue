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
  import { computed, h } from 'vue';
  import { NDataTable, NButton } from 'naive-ui';
  import type { DataTableColumn } from 'naive-ui';
  import { useTableStore } from '../../../store/modules/table';
  import { useTableData } from '../../../hooks/web/useTableData';
  import { ActionButton } from '../../types/ActionColumnConfig';

  const tableStore = useTableStore();
  const { tableData, loading, total } = useTableData();

  const columns = computed<DataTableColumn[]>(() => {
    const cols: DataTableColumn[] = [];
    const { getTableGeneralSettings, getColumnsConfig, getActionColumnConfig } = tableStore;

    if (getTableGeneralSettings.showIndexColumn) {
      cols.push({
        title: '#',
        key: 'index',
        width: 60,
        render: (row, index) => index + 1,
      });
    }

    getColumnsConfig.forEach((col) => {
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

    if (getActionColumnConfig.actions && getActionColumnConfig.actions.length > 0) {
      cols.push({
        title: '操作',
        key: 'actions',
        width: getActionColumnConfig.width,
        fixed: getActionColumnConfig.fixed === 'none' ? undefined : getActionColumnConfig.fixed,
        render: (row) => {
          return getActionColumnConfig.actions.map((action: ActionButton) => {
            // Basic rendering for now, will be expanded with permission/confirm logic
            return h(
              NButton,
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

  const pagination = computed(() => ({
    pageSize: tableStore.getTableGeneralSettings.pageSize,
    page: 1, // Assuming page 1 for now, will be dynamic later
    itemCount: total.value,
    showSizePicker: true,
    pageSizes: [10, 20, 30, 50],
    onUpdatePage: (page: number) => {
      // Handle page change
      console.log('Page changed to:', page);
    },
    onUpdatePageSize: (pageSize: number) => {
      // Handle page size change
      console.log('Page size changed to:', pageSize);
    },
  }));

  const rowKey = computed(() => {
    const keyName = tableStore.getTableGeneralSettings.rowKey || 'id';
    return (row: any) => row[keyName];
  });
  const scrollX = computed(() => tableStore.getTableGeneralSettings.scrollX || undefined);
  const scrollY = computed(() => tableStore.getTableGeneralSettings.scrollY || undefined);
  const displaySettings = computed(() => tableStore.getViewConfig.displaySettings);

  const rowProps = ({ row }: { row: any }) => {
    return {
      onClick: () => {
        console.log('Row clicked:', row);
        // Emit row-click event or handle rowClickAction
      },
    };
  };
</script>
