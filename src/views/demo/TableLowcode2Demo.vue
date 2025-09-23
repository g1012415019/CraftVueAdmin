<template>
  <div>
    <TableLowcode2Component @open-config="showConfigPanel = true" />
    <ConfigPanel v-model:show="showConfigPanel" />
  </div>
</template>

<script setup lang="ts">
  import { ref, provide } from 'vue';
  import TableLowcode2Component from '@/components/TableLowcode2/TableLowcode2.vue';
  import ConfigPanel from '@/components/TableLowcode2/Config/ConfigPanel.vue';

  const showConfigPanel = ref(false);

  // 表格配置
  const tableConfig = ref({
    basic: {
      title: '我的表格',
      description: '这是一个功能强大的表格',
      showRowNumber: true,
      rowNumberStart: 1,
      rowNumberWidth: 60,
      rowNumberAlign: 'center',
      loading: false,
      loadingAnimation: 'default',
      loadingText: '正在加载...',
      height: null,
      maxHeight: 600,
      scrollX: null,
      theme: 'light',
      striped: true,
      compact: false,
      bordered: true,
      rowHeight: 42,
      fontSize: 14,
      headerFixed: true,
    },
    selection: {
      enabled: true,
      mode: 'multiple',
      columnPosition: 'left',
      keepOnPageChange: false,
      defaultSelectedRowKeys: [],
    },
    sortFilter: {
      columnSort: true,
      showGlobalSearch: true,
      showFilterTags: true,
      defaultSort: { key: null, order: 'ascend' },
      sortMode: 'backend',
      filterMode: 'backend',
      debounceDelay: 300,
      globalSearchColumns: [],
    },
    pagination: {
      position: 'bottom',
      pageSizeOptions: '10,20,50,100',
      simple: false,
      showTotal: true,
      showQuickJumper: true,
      serverSidePagination: true,
    },
    data: {
      refreshInterval: 0,
    },
    interaction: {
      rowClick: false,
      rowDblClick: false,
      dragSort: true,
      contextMenu: true,
    },
    editing: {
      inlineEditingEnabled: true,
      mode: 'row',
      trigger: 'dblclick',
      buttonsPosition: 'inline',
    },
    columns: [
      {
        key: 'name',
        label: '姓名',
        visible: true,
        width: 150,
        fixed: null,
        align: 'left',
        sortable: true,
        defaultSortOrder: null,
        customSorter: null,
        filterable: true,
        filterType: 'text',
        filterOptions: [],
        defaultFilterValue: null,
        editable: true,
        dataType: 'text',
      },
      {
        key: 'age',
        label: '年龄',
        visible: true,
        width: 80,
        fixed: null,
        align: 'center',
        sortable: true,
        defaultSortOrder: null,
        customSorter: null,
        filterable: true,
        filterType: 'numberRange',
        filterOptions: [],
        defaultFilterValue: null,
        editable: true,
        dataType: 'number',
      },
      {
        key: 'address',
        label: '地址',
        visible: true,
        width: 300,
        fixed: null,
        align: 'left',
        sortable: false,
        defaultSortOrder: null,
        customSorter: null,
        filterable: true,
        filterType: 'text',
        filterOptions: [],
        defaultFilterValue: null,
        editable: true,
        dataType: 'text',
      },
      {
        key: 'email',
        label: '邮箱',
        visible: false,
        width: 250,
        fixed: null,
        align: 'left',
        sortable: false,
        defaultSortOrder: null,
        customSorter: null,
        filterable: true,
        filterType: 'text',
        filterOptions: [],
        defaultFilterValue: null,
        editable: true,
        dataType: 'text',
      },
      {
        key: 'status',
        label: '状态',
        visible: true,
        width: 100,
        fixed: null,
        align: 'center',
        sortable: true,
        defaultSortOrder: null,
        customSorter: null,
        filterable: true,
        filterType: 'enum',
        filterOptions: 'active,inactive',
        defaultFilterValue: null,
        editable: true,
        dataType: 'select',
        selectOptions: [
          { label: '活跃', value: 'active' },
          { label: '不活跃', value: 'inactive' },
        ],
      },
    ],
    actions: {
      create: {
        onClick: () => {
          window.$message?.success('新增操作');
        },
      },
      showInlineColumn: false, // 禁用传统操作列
      top: [
        {
          key: 'add',
          label: '新增',
          type: 'primary',
          icon: 'add',
          showConfirmation: false,
          confirmationText: '',
          onClick: () => {
            window.$message?.success('新增操作');
          },
        },
        {
          key: 'delete',
          label: '批量删除',
          type: 'error',
          icon: 'delete',
          showConfirmation: true,
          confirmationText: '确定要删除选中的项目吗？',
          onClick: () => {
            window.$message?.error('批量删除操作');
          },
        },
      ],
      inline: [
        {
          key: 'edit',
          label: '编辑',
          type: 'default',
          icon: 'edit',
          showConfirmation: false,
          confirmationText: '',
          onClick: (row) => {
            window.$message?.info(`编辑: ${row.name}`);
          },
        },
        {
          key: 'delete',
          label: '删除',
          type: 'error',
          icon: 'delete',
          showConfirmation: true,
          confirmationText: '确定要删除该行吗？',
          onClick: (row) => {
            window.$message?.error(`删除: ${row.name}`);
          },
        },
      ],
      batch: [
        {
          label: '批量删除',
          key: 'batch-delete',
          type: 'error',
          showConfirmation: true,
          confirmationText: '确定要删除选中的项目吗？',
          onClick: (selectedRows) => {
            window.$message?.error(`批量删除 ${selectedRows.length} 行`);
          },
        },
        {
          label: '批量导出',
          key: 'batch-export',
          type: 'info',
          showConfirmation: false,
          onClick: (selectedRows) => {
            window.$message?.info(`批量导出 ${selectedRows.length} 行`);
          },
        },
      ],
      batchPosition: 'top',
      contextMenu: [
        {
          label: '编辑',
          key: 'edit',
          onClick: (row) => {
            window.$message?.info(`右键编辑: ${row.name}`);
          },
        },
        {
          label: '删除',
          key: 'delete',
          onClick: (row) => {
            window.$message?.error(`右键删除: ${row.name}`);
          },
        },
      ],
    },
  });

  // 提供配置给子组件
  provide('tableConfig', tableConfig);
</script>
