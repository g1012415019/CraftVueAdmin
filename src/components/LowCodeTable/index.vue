<template>
  <div>
    <div class="flex justify-between mb-4">
      <TableToolbar v-if="toolbar" @refresh="handleRefresh" @export="handleExport" />
      <ViewManagement
        v-if="viewManagement"
        :views="views"
        @save-view="handleSaveView"
        @select-view="handleSelectView"
      />
    </div>
    <n-data-table :columns="tableColumns" :data="data" :pagination="pagination" :remote="true" />
  </div>
</template>

<script lang="ts" setup>
  import { NDataTable, TableColumn, NTag, NImage, NButton } from 'naive-ui';
  import { PropType, computed, h, ref, onMounted } from 'vue';
  import TableToolbar from './TableToolbar.vue';
  import ViewManagement from './ViewManagement.vue';

  interface ColumnConfig {
    fieldKey: string;
    title: string;
    type?: 'text' | 'number' | 'date' | 'datetime' | 'select' | 'tag' | 'image' | 'link' | 'slot';
    width?: string | number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right' | 'none';
    visible?: boolean;
    sortable?: boolean;
    filterable?: boolean;
    editable?: boolean;
    copyable?: boolean;
    formatter?: (row: any) => any;
    dict?: Record<string, any>;
    tooltip?: boolean | string;
    mergeCell?: (row: any) => any;
    customRender?: any;
  }

  interface ActionButton {
    label: string;
    icon?: string;
    action: 'add' | 'edit' | 'delete' | 'view' | 'custom';
    confirm?: boolean;
    onClick?: (row: any) => void;
    permission?: string[];
  }

  interface DataSource {
    mode: 'static' | 'api';
    staticData?: any[];
    apiUrl?: string;
    apiMethod?: 'GET' | 'POST';
    requestMap?: Record<string, string>;
    responseMap?: Record<string, string>;
  }

  const props = defineProps({
    columns: {
      type: Array as PropType<ColumnConfig[]>,
      required: true,
    },
    dataSource: {
      type: Object as PropType<DataSource>,
      required: true,
    },
    showIndex: {
      type: Boolean,
      default: false,
    },
    showSelection: {
      type: Boolean,
      default: false,
    },
    actions: {
      type: Array as PropType<ActionButton[]>,
      default: () => [],
    },
    pagination: {
      type: [Object, Boolean],
      default: true,
    },
    toolbar: {
      type: Boolean,
      default: false,
    },
    viewManagement: {
      type: Boolean,
      default: false,
    },
  });

  const data = ref<any[]>([]);
  const page = ref(1);
  const pageSize = ref(10);
  const total = ref(0);
  const views = ref<Record<string, any>>({});
  const visibleColumns = ref<string[]>(
    props.columns.filter((c) => c.visible !== false).map((c) => c.fieldKey)
  );

  async function fetchData() {
    if (props.dataSource.mode === 'static') {
      data.value = props.dataSource.staticData || [];
      total.value = data.value.length;
    } else if (props.dataSource.mode === 'api') {
      if (!props.dataSource.apiUrl) return;

      const requestParams = {
        [props.dataSource.requestMap?.page || 'page']: page.value,
        [props.dataSource.requestMap?.size || 'pageSize']: pageSize.value,
      };

      const response = await fetch(
        `${props.dataSource.apiUrl}?${new URLSearchParams(requestParams)}`,
        {
          method: props.dataSource.apiMethod || 'GET',
        }
      );
      const responseData = await response.json();

      const listKey = props.dataSource.responseMap?.list || 'list';
      const totalKey = props.dataSource.responseMap?.total || 'itemCount';

      data.value = responseData[listKey];
      total.value = responseData[totalKey];
    }
  }

  const pagination = computed(() => {
    if (!props.pagination) return false;
    return {
      page: page.value,
      pageSize: pageSize.value,
      itemCount: total.value,
      onChange: (p: number) => {
        page.value = p;
        fetchData();
      },
      onPageSizeChange: (ps: number) => {
        pageSize.value = ps;
        fetchData();
      },
    };
  });

  onMounted(() => {
    fetchData();
  });

  function handleRefresh() {
    fetchData();
  }

  function handleExport() {
    // Implement export logic
    console.log('export');
  }

  function handleSaveView(name: string) {
    views.value[name] = {
      visibleColumns: visibleColumns.value,
    };
  }

  function handleSelectView(name: string) {
    const view = views.value[name];
    if (view) {
      visibleColumns.value = view.visibleColumns;
    }
  }

  const tableColumns = computed(() => {
    const generatedColumns: TableColumn[] = [];

    if (props.showSelection) {
      generatedColumns.push({ type: 'selection' });
    }

    if (props.showIndex) {
      generatedColumns.push({
        title: '#',
        key: 'index',
        width: 60,
        align: 'center',
        render: (row, index) => index + 1,
      });
    }

    const mappedColumns = props.columns
      .filter((column) => visibleColumns.value.includes(column.fieldKey))
      .map((column) => {
        const tableColumn: TableColumn = {
          key: column.fieldKey,
          title: column.title,
          width: column.width,
          align: column.align,
          fixed: column.fixed === 'none' ? undefined : column.fixed,
          sorter: column.sortable,
          filter: column.filterable,
          render(row) {
            const value = row[column.fieldKey];
            switch (column.type) {
              case 'tag':
                return h(NTag, { type: 'info' }, { default: () => value });
              case 'image':
                return h(NImage, { width: 100, src: value });
              case 'link':
                return h(
                  NButton,
                  { text: true, tag: 'a', href: value, target: '_blank' },
                  { default: () => value }
                );
              default:
                return value;
            }
          },
        };
        return tableColumn;
      });

    if (props.actions.length > 0) {
      generatedColumns.push({
        title: 'Actions',
        key: 'actions',
        width: 160,
        align: 'center',
        render(row) {
          return props.actions.map((action) => {
            return h(
              NButton,
              {
                size: 'small',
                onClick: () => action.onClick?.(row),
              },
              { default: () => action.label }
            );
          });
        },
      });
    }

    return [...generatedColumns, ...mappedColumns];
  });
</script>

<style scoped>
  /* Styles for the low-code table component */
</style>
