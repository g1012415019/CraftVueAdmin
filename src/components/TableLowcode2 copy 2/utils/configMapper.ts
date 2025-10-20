// 简化配置接口
export interface SimpleTableConfig {
  // 基础信息
  title?: string;
  data?: any[];
  
  // 字段配置 - 只需要核心信息
  fields: {
    key: string;
    label: string;
    type?: 'text' | 'number' | 'date' | 'select' | 'image';
    width?: number;
    sortable?: boolean;
    filterable?: boolean;
  }[];
  
  // 功能开关
  features?: {
    pagination?: boolean;
    search?: boolean;
    export?: boolean;
    selection?: boolean;
    editing?: boolean;
  };
  
  // 样式主题
  theme?: 'light' | 'dark' | 'compact';
}

// 映射到完整的 table-config
export function mapToTableConfig(simpleConfig: SimpleTableConfig) {
  const { title = '数据表格', data = [], fields, features = {}, theme = 'light' } = simpleConfig;
  
  return {
    basic: {
      title,
      description: `${title} - 数据展示`,
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
      theme,
      striped: theme !== 'compact',
      compact: theme === 'compact',
      bordered: true,
      rowHeight: theme === 'compact' ? 36 : 42,
      fontSize: theme === 'compact' ? 12 : 14,
      headerFixed: true,
    },
    
    // 视图配置
    views: {
      presetViews: [
        { 
          key: 'all', 
          label: '全部数据', 
          count: data.length || 0,
          description: '显示所有数据记录',
          icon: '📊',
          filter: {},
          badgeType: 'default',
          config: { basic: { title: '全部数据' } }
        }
      ]
    },
    
    // 筛选配置
    filters: {
      fields: fields
        .filter(field => field.filterable)
        .map(field => ({
          key: field.key,
          type: getFilterType(field.type),
          position: 'filterBar',
          label: field.label,
          placeholder: `输入${field.label}搜索`,
          ...(field.type === 'select' ? {
            options: [
              { label: '选项1', value: 'option1' },
              { label: '选项2', value: 'option2' }
            ]
          } : {})
        }))
    },
    
    // 选择配置
    selection: {
      enabled: features.selection ?? false,
      mode: 'multiple',
      columnPosition: 'left',
      keepOnPageChange: false,
      defaultSelectedRowKeys: [],
    },
    
    // 排序筛选配置
    sortFilter: {
      columnSort: true,
      showGlobalSearch: features.search ?? true,
      showFilterTags: true,
      defaultSort: { key: null, order: 'ascend' },
      sortMode: 'backend',
      filterMode: 'backend',
      debounceDelay: 300,
      globalSearchColumns: [],
    },
    
    // 分页配置
    pagination: {
      position: 'bottom',
      pageSizeOptions: '10,20,50,100',
      simple: false,
      showTotal: true,
      showQuickJumper: true,
      serverSidePagination: features.pagination ?? true,
    },
    
    // 数据配置
    data: {
      refreshInterval: 0,
    },
    
    // 交互配置
    interaction: {
      rowClick: false,
      rowDblClick: false,
      dragSort: true,
      contextMenu: true,
    },
    
    // 编辑配置
    editing: {
      inlineEditingEnabled: features.editing ?? false,
      mode: 'row',
      trigger: 'dblclick',
      buttonsPosition: 'inline',
    },
    
    // 字段映射
    columns: fields.map((field, index) => ({
      key: field.key,
      label: field.label,
      visible: true,
      width: field.width || getDefaultWidth(field.type),
      fixed: index === 0 ? 'left' : null,
      align: getDefaultAlign(field.type),
      sortable: field.sortable ?? true,
      defaultSortOrder: null,
      customSorter: null,
      filterable: field.filterable ?? false,
      filterType: getFilterType(field.type),
      filterOptions: field.type === 'select' ? [
        { label: '选项1', value: 'option1' },
        { label: '选项2', value: 'option2' }
      ] : [],
      defaultFilterValue: null,
      editable: features.editing ?? false,
      dataType: field.type || 'text',
      ...(field.type === 'select' ? {
        selectOptions: [
          { label: '选项1', value: 'option1' },
          { label: '选项2', value: 'option2' }
        ]
      } : {})
    })),
    
    // 操作配置
    actions: {
      create: {
        onClick: () => {
          window.$message?.success('新增数据');
        },
      },
      showInlineColumn: false,
      batch: features.selection ? [
        {
          key: 'delete',
          label: '批量删除',
          type: 'error',
          onClick: (selectedRows: any[]) => {
            window.$message?.success(`已删除 ${selectedRows.length} 条数据`);
          },
        },
      ] : [],
      inline: [
        {
          key: 'edit',
          label: '编辑',
          type: 'primary',
          onClick: (row: any) => {
            window.$message?.info(`编辑: ${row.name || row.id}`);
          },
        },
        {
          key: 'delete',
          label: '删除',
          type: 'error',
          onClick: (row: any) => {
            window.$message?.error(`删除: ${row.name || row.id}`);
          },
        },
      ],
    },
    
    // 数据
    data: data,
    
    // 事件处理
    events: {
      onRowClick: (row: any) => console.log('行点击:', row),
      onRowDoubleClick: (row: any) => console.log('行双击:', row),
      onSelectionChange: (selectedRows: any[]) => console.log('选择变化:', selectedRows),
      onSortChange: (sortInfo: any) => console.log('排序变化:', sortInfo),
      onFilterChange: (filterInfo: any) => console.log('筛选变化:', filterInfo),
      onPageChange: (pageInfo: any) => console.log('分页变化:', pageInfo),
      onRefresh: () => window.$message?.success('数据已刷新'),
      onExport: (type: string) => window.$message?.success(`正在导出 ${type} 格式`),
      onImport: (type: string) => window.$message?.success(`正在导入 ${type} 格式`),
    },
  };
}

// 获取筛选类型
function getFilterType(type?: string): string {
  switch (type) {
    case 'number': return 'number';
    case 'date': return 'date';
    case 'select': return 'select';
    default: return 'text';
  }
}

// 获取默认宽度
function getDefaultWidth(type?: string): number {
  switch (type) {
    case 'number': return 100;
    case 'date': return 160;
    case 'image': return 80;
    case 'select': return 120;
    default: return 150;
  }
}

// 获取默认对齐方式
function getDefaultAlign(type?: string): 'left' | 'center' | 'right' {
  switch (type) {
    case 'number': return 'right';
    case 'image': return 'center';
    case 'date': return 'center';
    default: return 'left';
  }
}
