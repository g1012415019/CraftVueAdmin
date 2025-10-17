<template>
  <div>
    <TableLowcode2Component @open-config="showConfigPanel = true" />
    <ConfigPanel 
      v-model:show="showConfigPanel"
    />
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
    // 视图配置
    views: {
      presetViews: [
        { 
          key: 'all', 
          label: '全部员工', 
          count: 1250,
          description: '显示所有员工记录',
          icon: '👥',
          filter: {},
          badgeType: 'default',
          config: {
            basic: {
              title: '全部员工'
            }
          }
        },
        { 
          key: 'active', 
          label: '在职员工', 
          count: 1180,
          description: '显示在职员工',
          icon: '✅',
          filter: { status: 'active' },
          badgeType: 'success',
          config: {
            basic: {
              title: '在职员工'
            }
          }
        },
        { 
          key: 'new', 
          label: '新入职', 
          count: 23,
          description: '最近30天入职的员工',
          icon: '🆕',
          filter: { joinDate: 'recent30days' },
          badgeType: 'info',
          alert: false,
          config: {
            basic: {
              title: '新入职'
            }
          }
        },
        { 
          key: 'pending', 
          label: '待审核', 
          count: 15,
          description: '待审核的员工信息',
          icon: '⏳',
          filter: { status: 'pending' },
          badgeType: 'warning',
          alert: true,
          config: {
            basic: {
              title: '待审核'
            }
          }
        }
      ]
    },
    // 筛选配置
    filters: {
      fields: [
        { 
          key: 'name', 
          type: 'text', 
          position: 'filterBar', 
          label: '员工姓名', 
          placeholder: '输入员工姓名搜索' 
        },
        { 
          key: 'status', 
          type: 'select', 
          position: 'filterBar', 
          label: '状态', 
          options: [
            { label: '在职', value: 'active' },
            { label: '离职', value: 'inactive' },
            { label: '待审核', value: 'pending' }
          ]
        },
        { 
          key: 'department', 
          type: 'select', 
          position: 'filterBar', 
          label: '部门', 
          options: [
            { label: '技术部', value: 'tech' },
            { label: '销售部', value: 'sales' },
            { label: '市场部', value: 'marketing' }
          ]
        },
        { 
          key: 'joinDate', 
          type: 'dateRange', 
          position: 'filterBar', 
          label: '入职时间' 
        },
        { 
          key: 'age', 
          type: 'numberRange', 
          position: 'advanced', 
          label: '年龄范围',
          min: 18,
          max: 65
        },
        { 
          key: 'salary', 
          type: 'slider', 
          position: 'advanced', 
          label: '薪资范围',
          min: 3000,
          max: 50000
        },
        { 
          key: 'skills', 
          type: 'multiSelect', 
          position: 'advanced', 
          label: '技能标签',
          options: [
            { label: 'Vue.js', value: 'vue' },
            { label: 'React', value: 'react' },
            { label: 'Node.js', value: 'nodejs' },
            { label: 'Python', value: 'python' }
          ]
        }
      ]
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
          window.$message?.success('新增员工');
        },
      },
      showInlineColumn: false,
      // 批量操作配置
      batch: [
        {
          key: 'activate',
          label: '批量激活',
          type: 'success',
          icon: 'check',
          showConfirmation: true,
          confirmationText: '确定要激活选中的员工吗？',
          onClick: (selectedRows) => {
            window.$message?.success(`已激活 ${selectedRows.length} 名员工`);
          }
        },
        {
          key: 'export',
          label: '导出数据',
          type: 'info',
          icon: 'download',
          onClick: (selectedRows) => {
            window.$message?.info(`正在导出 ${selectedRows.length} 条记录`);
          }
        },
        {
          key: 'transfer',
          label: '部门调动',
          type: 'warning',
          icon: 'swap',
          showConfirmation: true,
          confirmationText: '确定要调动选中员工的部门吗？',
          onClick: (selectedRows) => {
            window.$message?.warning(`${selectedRows.length} 名员工待调动`);
          }
        },
        {
          key: 'delete',
          label: '批量删除',
          type: 'error',
          icon: 'delete',
          showConfirmation: true,
          confirmationText: '删除后无法恢复，确定要删除选中的员工吗？',
          onClick: (selectedRows) => {
            window.$message?.error(`已删除 ${selectedRows.length} 名员工`);
          }
        }
      ],
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
    // 事件处理配置
    onSearch: (filterValues) => {
      console.log('执行搜索:', filterValues);
      window.$message?.info(`搜索条件已应用`);
    },
    onAdvancedSearch: (filterValues) => {
      console.log('执行高级搜索:', filterValues);
      window.$message?.info(`高级搜索条件已应用`);
    },
    onViewChange: (viewKey, viewData) => {
      console.log('切换视图:', viewKey, viewData);
      window.$message?.success(`已切换到: ${viewData.label}`);
    }
  });

  // 提供配置给子组件
  provide('tableConfig', tableConfig);
</script>
