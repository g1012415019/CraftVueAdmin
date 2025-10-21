# TableLowcode2 组件文档

## 🚀 简介

TableLowcode2 是一个功能强大的低代码表格组件，基于 Naive UI 构建，提供丰富的配置选项和交互功能。支持拖拽排序、复选框批量操作、悬浮操作栏、内联编辑等高级功能，完全可配置化，开箱即用。

## 🌟 核心特性

- ✅ **拖拽排序**：支持行拖拽重新排序，带视觉反馈
- ✅ **批量操作**：复选框选中后显示操作栏
- ✅ **悬浮操作**：选中行时显示固定操作栏
- ✅ **内联编辑**：双击行进入编辑模式
- ✅ **右键菜单**：丰富的上下文菜单操作
- ✅ **响应式设计**：自适应不同屏幕尺寸
- ✅ **配置化**：可视化配置表格列和功能
- ✅ **主题定制**：支持多种主题和样式配置

## 🚀 快速开始

### 1. 基础使用

```vue
<template>
  <div>
    <TableLowcode2Component />
    <ConfigPanel v-model:show="showConfigPanel" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import TableLowcode2Component from '@/components/TableLowcode2/Table/DataTable.vue';
import ConfigPanel from '@/components/TableLowcode2/Config/ConfigPanel.vue';

const showConfigPanel = ref(false);

// 最小配置示例
const tableConfig = ref({
  basic: {
    title: '我的表格',
    showRowNumber: true,
    bordered: true,
    striped: true,
  },
  selection: {
    enabled: true,
    mode: 'multiple',
  },
  columns: [
    {
      key: 'name',
      label: '姓名',
      visible: true,
      width: 150,
      editable: true,
      dataType: 'text',
    },
    {
      key: 'age',
      label: '年龄',
      visible: true,
      width: 80,
      editable: true,
      dataType: 'number',
    }
  ]
});

provide('tableConfig', tableConfig);
</script>
```

### 2. 配置面板

点击表格右上角的"配置"按钮打开配置面板，实时调整表格功能：

- **基础设置**：标题、样式、尺寸等
- **选择功能**：单选/多选模式配置
- **列配置**：显示/隐藏、宽度、对齐等
- **排序过滤**：排序规则、过滤器配置
- **分页设置**：分页位置、每页条数等
- **交互功能**：拖拽、编辑、右键菜单等

## ✨ 核心功能

### 1. 基础配置
- **表格样式**：支持斑马纹、边框、紧凑模式等
- **尺寸设置**：可配置行高、字体大小、表格高度
- **主题支持**：明亮/暗黑主题切换
- **行号显示**：可配置行号起始值、宽度、对齐方式

### 2. 选择功能
- **多选模式**：支持单选/多选/禁用
- **智能交互**：鼠标悬停显示复选框，离开显示行号
- **全选功能**：表头复选框支持全选/取消全选
- **选中状态**：已选中行始终显示复选框

### 3. 列配置
- **动态列**：可显示/隐藏列
- **列宽调整**：支持固定宽度和自适应
- **列对齐**：左对齐/居中/右对齐
- **列固定**：支持左侧/右侧固定
- **列头交互**：悬停显示下拉菜单图标

### 4. 排序与过滤
- **排序功能**：支持前端/后端排序
- **多种过滤**：文本、数字范围、日期范围、枚举过滤
- **默认排序**：可配置默认排序字段和方向
- **自定义排序**：支持自定义排序函数

### 5. 分页功能
- **分页配置**：可配置页码选项、快速跳转
- **位置设置**：顶部/底部/两端显示
- **服务端分页**：支持后端分页模式
- **总数显示**：可显示数据总数

### 6. 行内编辑
- **编辑模式**：支持行编辑/单元格编辑
- **触发方式**：双击/按钮触发
- **数据类型**：文本、数字、下拉选择
- **编辑状态**：编辑中行高亮显示

### 7. 操作功能
- **内联操作**：行内操作按钮
- **批量操作**：支持批量删除、导出等
- **确认对话框**：危险操作需确认
- **右键菜单**：上下文菜单操作

### 8. 交互功能
- **行点击**：单击/双击行事件
- **拖拽排序**：支持行拖拽重排
- **右键菜单**：自定义上下文菜单
- **悬停效果**：行悬停高亮

## 🎯 详细配置

### 完整配置示例

```typescript
const tableConfig = ref({
  // 基础配置
  basic: {
    title: '用户管理表格',
    description: '管理系统用户信息',
    showRowNumber: true,
    rowNumberStart: 1,
    rowNumberWidth: 60,
    rowNumberAlign: 'center',
    loading: false,
    height: null,
    maxHeight: 600,
    bordered: true,
    striped: true,
    compact: false,
    rowHeight: 42,
    fontSize: 14,
    theme: 'light', // 'light' | 'dark'
  },
  
  // 选择配置
  selection: {
    enabled: true,
    mode: 'multiple', // 'single' | 'multiple'
    columnPosition: 'left', // 'left' | 'right'
    keepOnPageChange: false,
  },
  
  // 列配置
  columns: [
    {
      key: 'name',
      label: '姓名',
      visible: true,
      width: 150,
      align: 'left', // 'left' | 'center' | 'right'
      fixed: null, // null | 'left' | 'right'
      sortable: true,
      filterable: true,
      filterType: 'text', // 'text' | 'numberRange' | 'dateRange' | 'enum'
      editable: true,
      dataType: 'text', // 'text' | 'number' | 'select'
    },
    {
      key: 'status',
      label: '状态',
      visible: true,
      width: 100,
      align: 'center',
      editable: true,
      dataType: 'select',
      selectOptions: [
        { label: '活跃', value: 'active' },
        { label: '不活跃', value: 'inactive' },
      ],
    }
  ],
  
  // 操作配置
  actions: {
    // 顶部操作按钮
    top: [
      {
        key: 'add',
        label: '新增',
        type: 'primary',
        onClick: () => console.log('新增'),
      }
    ],
    
    // 行内操作（悬浮显示）
    inline: [
      {
        key: 'edit',
        label: '编辑',
        type: 'default',
        onClick: (row) => console.log('编辑', row),
      },
      {
        key: 'delete',
        label: '删除',
        type: 'error',
        showConfirmation: true,
        confirmationText: '确定要删除吗？',
        onClick: (row) => console.log('删除', row),
      }
    ],
    
    // 批量操作
    batch: [
      {
        key: 'batch-delete',
        label: '批量删除',
        type: 'error',
        showConfirmation: true,
        onClick: (selectedRows) => console.log('批量删除', selectedRows),
      }
    ],
    
    // 右键菜单
    contextMenu: [
      {
        key: 'copy',
        label: '复制',
        onClick: (row) => console.log('复制', row),
      }
    ]
  },
  
  // 分页配置
  pagination: {
    position: 'bottom', // 'top' | 'bottom' | 'both'
    pageSizeOptions: '10,20,50,100',
    simple: false,
    showTotal: true,
    showQuickJumper: true,
    serverSidePagination: true,
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
    inlineEditingEnabled: true,
    mode: 'row', // 'row' | 'cell'
    trigger: 'dblclick', // 'dblclick' | 'button'
  }
});
```

## 🎯 使用方式

### 基础用法

### 事件处理

```typescript
// 在组件中监听表格事件
const handleRowClick = (row: any) => {
  console.log('行点击:', row);
};

const handleSelectionChange = (selectedKeys: string[]) => {
  console.log('选择变化:', selectedKeys);
};

const handleDataChange = (newData: any[]) => {
  console.log('数据变化:', newData);
};

// 在配置中绑定事件
tableConfig.value.events = {
  onRowClick: handleRowClick,
  onSelectionChange: handleSelectionChange,
  onDataChange: handleDataChange,
};
```

### 自定义渲染

```typescript
// 自定义列渲染
const customRender = (row: any, column: any) => {
  if (column.key === 'status') {
    return h(NTag, {
      type: row.status === 'active' ? 'success' : 'error'
    }, () => row.status === 'active' ? '活跃' : '不活跃');
  }
  return row[column.key];
};

// 在列配置中使用
columns: [
  {
    key: 'status',
    label: '状态',
    render: customRender,
  }
]
```

## 📋 API 参考

### TableConfig 接口

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| basic | BasicConfig | - | 基础配置 |
| selection | SelectionConfig | - | 选择功能配置 |
| columns | ColumnConfig[] | - | 列配置数组 |
| actions | ActionConfig | - | 操作配置 |
| pagination | PaginationConfig | - | 分页配置 |
| interaction | InteractionConfig | - | 交互配置 |
| editing | EditingConfig | - | 编辑配置 |

### BasicConfig 接口

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | - | 表格标题 |
| description | string | - | 表格描述 |
| showRowNumber | boolean | true | 显示行号 |
| rowNumberStart | number | 1 | 行号起始值 |
| bordered | boolean | true | 显示边框 |
| striped | boolean | true | 斑马纹 |
| loading | boolean | false | 加载状态 |
| height | number | - | 表格高度 |
| maxHeight | number | 600 | 最大高度 |

### ColumnConfig 接口

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | string | - | 列键值 |
| label | string | - | 列标题 |
| visible | boolean | true | 是否显示 |
| width | number | - | 列宽度 |
| align | 'left' \| 'center' \| 'right' | 'left' | 对齐方式 |
| fixed | 'left' \| 'right' | - | 固定位置 |
| sortable | boolean | false | 可排序 |
| filterable | boolean | false | 可过滤 |
| editable | boolean | false | 可编辑 |
| dataType | 'text' \| 'number' \| 'select' | 'text' | 数据类型 |

### ActionConfig 接口

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| top | ActionItem[] | [] | 顶部操作按钮 |
| inline | ActionItem[] | [] | 行内操作按钮 |
| batch | ActionItem[] | [] | 批量操作按钮 |
| contextMenu | ActionItem[] | [] | 右键菜单项 |

### ActionItem 接口

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| key | string | - | 操作键值 |
| label | string | - | 操作标签 |
| type | 'default' \| 'primary' \| 'info' \| 'success' \| 'warning' \| 'error' | 'default' | 按钮类型 |
| showConfirmation | boolean | false | 显示确认对话框 |
| confirmationText | string | - | 确认文本 |
| onClick | Function | - | 点击事件处理函数 |

## 🎨 样式定制

### CSS 变量

```css
:root {
  --table-row-height: 42px;
  --table-font-size: 14px;
  --table-border-color: #e0e0e6;
  --table-hover-color: rgba(24, 160, 88, 0.05);
  --table-selected-color: rgba(24, 160, 88, 0.1);
}
```

### 自定义样式类

```css
/* 悬停行样式 */
:deep(.table-row-hovered) {
  background-color: var(--table-hover-color) !important;
}

/* 选中行样式 */
:deep(.table-row-selected) {
  background-color: var(--table-selected-color) !important;
}

/* 编辑行样式 */
:deep(.table-row-editing) {
  background-color: rgba(255, 193, 7, 0.1) !important;
}

/* 固定操作栏样式 */
.fixed-action-bar {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}
```

## 🔧 组件架构

### 目录结构
```
TableLowcode2/
├── Table/
│   ├── DataTable.vue           # 主表格组件
│   ├── composables/            # 组合式函数
│   │   ├── useTableColumns.ts  # 列管理
│   │   ├── useTableData.ts     # 数据管理
│   │   ├── useSelectionColumn.ts # 选择列
│   │   ├── useDataColumns.ts   # 数据列
│   │   ├── useActionColumn.ts  # 操作列
│   │   ├── useTableEditing.ts  # 编辑功能
│   │   └── useTableRowInteraction.ts # 行交互
│   └── utils/
│       └── sorterFunctions.ts  # 排序函数
├── Config/
│   ├── ConfigPanel.vue         # 配置面板
│   └── forms/                  # 配置表单
│       ├── BasicSettingsForm.vue
│       ├── SelectionSettingsForm.vue
│       └── ...
├── TableToolbar.vue            # 工具栏
└── TableContextMenu.vue        # 右键菜单
```

### 核心 Composables

- **useTableColumns**: 管理表格列配置和渲染
- **useTableData**: 处理数据获取、分页、排序、过滤
- **useSelectionColumn**: 处理选择列的复选框和行号切换
- **useTableEditing**: 管理行内编辑功能
- **useTableRowInteraction**: 处理行交互（点击、悬停、拖拽）

## 🎨 交互特性

### 选择列交互
- 默认显示行号
- 鼠标悬停行时，复选框替换行号
- 已选中的行始终显示复选框
- 表头支持全选/取消全选

### 列头交互
- 鼠标悬停列头显示下拉菜单图标
- 支持排序、过滤等操作

### 行编辑交互
- 双击行进入编辑模式
- 编辑中的行高亮显示
- 支持保存/取消操作

### 拖拽排序
- 启用后可拖拽行重新排序
- 实时更新数据顺序

## 📝 类型定义

主要类型定义在 `@/types/table.d.ts` 中：

```typescript
interface TableConfig {
  basic: BasicConfig;
  selection: SelectionConfig;
  columns: ColumnConfig[];
  actions: ActionConfig;
  // ...更多配置
}

interface TableData {
  key: number;
  [key: string]: any;
}
```

## 🚀 扩展开发

### 添加新的列类型

1. **定义新类型**
```typescript
// 在 types/table.d.ts 中添加
type DataType = 'text' | 'number' | 'select' | 'date' | 'image';
```

2. **实现渲染逻辑**
```typescript
// 在 useDataColumns.ts 中添加
const renderCell = (row: any, column: ColumnConfig) => {
  switch (column.dataType) {
    case 'date':
      return h('span', formatDate(row[column.key]));
    case 'image':
      return h('img', { src: row[column.key], style: 'width: 50px; height: 50px;' });
    default:
      return row[column.key];
  }
};
```

3. **添加配置选项**
```vue
<!-- 在 ConfigPanel 中添加 -->
<n-form-item label="数据类型">
  <n-select
    v-model:value="column.dataType"
    :options="[
      { label: '文本', value: 'text' },
      { label: '数字', value: 'number' },
      { label: '选择', value: 'select' },
      { label: '日期', value: 'date' },
      { label: '图片', value: 'image' }
    ]"
  />
</n-form-item>
```

### 添加新的操作类型

```typescript
// 定义新操作
const customAction = {
  key: 'export',
  label: '导出',
  type: 'info',
  onClick: (row: any) => {
    // 导出逻辑
    exportToExcel([row]);
  }
};

// 添加到配置中
tableConfig.value.actions.inline.push(customAction);
```

### 自定义过滤器

```typescript
// 添加自定义过滤器
const customFilter = {
  type: 'custom',
  component: MyCustomFilter,
  filterFn: (value: any, row: any, column: ColumnConfig) => {
    // 自定义过滤逻辑
    return row[column.key].includes(value);
  }
};
```

## 🐛 常见问题

### 1. 配置不生效

**问题**：修改配置后表格没有更新

**解决方案**：
- 检查 `provide/inject` 是否正确设置
- 确认配置对象是响应式的（使用 `ref` 或 `reactive`）
- 验证配置项名称拼写是否正确

```typescript
// ✅ 正确
const tableConfig = ref({ ... });
provide('tableConfig', tableConfig);

// ❌ 错误
const tableConfig = { ... };
provide('tableConfig', tableConfig);
```

### 2. 选择功能异常

**问题**：复选框显示异常或选择状态不正确

**解决方案**：
- 确保数据有唯一的 `key` 字段
- 检查 `rowKey` 函数是否正确
- 验证选择模式配置

```typescript
// 确保数据格式正确
const data = [
  { key: 1, name: '张三' }, // key 必须唯一
  { key: 2, name: '李四' },
];
```

### 3. 编辑功能问题

**问题**：双击编辑不生效或保存失败

**解决方案**：
- 检查列配置中的 `editable: true`
- 确认编辑模式配置正确
- 验证数据类型匹配

```typescript
// 列配置示例
{
  key: 'name',
  editable: true,
  dataType: 'text', // 确保类型正确
}
```

### 4. 样式问题

**问题**：自定义样式不生效

**解决方案**：
- 使用 `:deep()` 选择器
- 检查 CSS 优先级
- 确认类名是否正确

```css
/* 使用深度选择器 */
:deep(.n-data-table-td) {
  padding: 8px 12px !important;
}
```

### 5. 性能问题

**问题**：大数据量时表格卡顿

**解决方案**：
- 启用服务端分页
- 减少不必要的计算属性
- 使用虚拟滚动（如需要）

```typescript
// 启用服务端分页
pagination: {
  serverSidePagination: true,
  pageSizeOptions: '20,50,100', // 减少每页数量
}
```

## 💡 最佳实践

### 1. 配置管理

```typescript
// 使用 Pinia 管理全局配置
export const useTableConfigStore = defineStore('tableConfig', () => {
  const defaultConfig = ref({...});
  
  const updateConfig = (path: string, value: any) => {
    set(defaultConfig.value, path, value);
  };
  
  return { defaultConfig, updateConfig };
});
```

### 2. 数据处理

```typescript
// 统一数据格式处理
const normalizeData = (rawData: any[]) => {
  return rawData.map((item, index) => ({
    key: item.id || index,
    ...item,
  }));
};
```

### 3. 事件处理

```typescript
// 使用防抖处理频繁操作
import { debounce } from 'lodash-es';

const handleSearch = debounce((value: string) => {
  // 搜索逻辑
}, 300);
```

### 4. 类型安全

```typescript
// 定义严格的类型
interface UserData {
  key: number;
  name: string;
  age: number;
  status: 'active' | 'inactive';
}

const tableData = ref<UserData[]>([]);
```

### 5. 组件复用

```typescript
// 创建可复用的表格配置
export const createUserTableConfig = (options?: Partial<TableConfig>) => {
  return {
    basic: {
      title: '用户管理',
      showRowNumber: true,
      ...options?.basic,
    },
    columns: [
      { key: 'name', label: '姓名', visible: true },
      { key: 'age', label: '年龄', visible: true },
      ...options?.columns || [],
    ],
    ...options,
  };
};
```

## 🔍 调试技巧

### 添加新的列类型
1. 在 `useDataColumns.ts` 中添加新的渲染逻辑
2. 更新类型定义
3. 在配置表单中添加相应选项

### 添加新的操作
1. 在 `actions` 配置中定义新操作
2. 在 `useActionColumn.ts` 中实现渲染逻辑
3. 添加事件处理函数

### 自定义样式
通过 CSS 变量或深度选择器自定义表格样式：

```css
:deep(.table-row-hovered) {
  background-color: rgba(24, 160, 88, 0.05) !important;
}
```

### 1. 开发者工具

```javascript
// 在浏览器控制台中访问配置
window.tableConfig = tableConfig;

// 监听配置变化
watch(tableConfig, (newConfig) => {
  console.log('配置已更新:', newConfig);
}, { deep: true });

// 调试选中状态
console.log('当前选中:', checkedRowKeys.value);
```

### 2. 日志输出

```typescript
// 在关键位置添加日志
const handleRowClick = (row: any) => {
  console.log('行点击事件:', row);
  console.log('当前配置:', tableConfig.value);
};
```

### 3. Vue DevTools

- 使用 Vue DevTools 查看组件状态
- 检查 provide/inject 的数据流
- 监控响应式数据变化

### 4. 网络调试

```typescript
// 调试 API 请求
const fetchData = async () => {
  console.log('开始请求数据...');
  try {
    const response = await api.getData();
    console.log('数据请求成功:', response);
    return response;
  } catch (error) {
    console.error('数据请求失败:', error);
    throw error;
  }
};
```

## 📈 性能优化

### 1. 虚拟滚动

```typescript
// 大数据量时启用虚拟滚动
const tableConfig = ref({
  basic: {
    virtualScroll: true,
    itemSize: 42, // 行高
    buffer: 10,   // 缓冲区大小
  }
});
```

### 2. 懒加载

```typescript
// 图片懒加载
const renderImage = (row: any, column: ColumnConfig) => {
  return h('img', {
    src: row[column.key],
    loading: 'lazy',
    style: 'width: 50px; height: 50px;'
  });
};
```

### 3. 计算属性优化

```typescript
// 使用 computed 缓存计算结果
const filteredData = computed(() => {
  if (!searchValue.value) return tableData.value;
  return tableData.value.filter(item => 
    item.name.includes(searchValue.value)
  );
});
```

## 🗺️ 发展路线图

### 已完成 ✅
- [x] 基础表格功能
- [x] 拖拽排序
- [x] 批量操作
- [x] 内联编辑
- [x] 右键菜单
- [x] 配置面板
- [x] 主题切换
- [x] 响应式设计

### 开发中 🚧
- [ ] 虚拟滚动优化
- [ ] 列宽拖拽调整
- [ ] 更多过滤器类型
- [ ] 导出功能增强
- [ ] 移动端适配优化

### 计划中 📋
- [ ] 表格设计器
- [ ] 自定义主题编辑器
- [ ] 插件系统
- [ ] 国际化支持
- [ ] 无障碍访问优化
- [ ] 单元测试覆盖
- [ ] 性能监控面板

### 长期规划 🎯
- [ ] 可视化数据分析
- [ ] 实时协作编辑
- [ ] 版本历史管理
- [ ] 云端配置同步

## 🤝 贡献指南

### 开发环境

```bash
# 克隆项目
git clone <repository-url>

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 运行测试
pnpm test

# 构建项目
pnpm build
```

### 提交规范

```bash
# 功能开发
git commit -m "feat(table): 添加虚拟滚动功能"

# 问题修复
git commit -m "fix(table): 修复选择状态异常问题"

# 文档更新
git commit -m "docs(table): 更新 API 文档"

# 样式调整
git commit -m "style(table): 优化表格样式"
```

### 代码规范

- 使用 TypeScript 编写代码
- 遵循 Vue 3 Composition API 规范
- 使用 ESLint 和 Prettier 格式化代码
- 编写单元测试覆盖核心功能
- 添加 JSDoc 注释说明

## 📞 技术支持

- **文档**: [在线文档](https://docs.naiveadmin.com)
- **问题反馈**: [GitHub Issues](https://github.com/jekip/naive-ui-admin/issues)
- **讨论交流**: QQ群 741353560
- **邮箱支持**: support@naiveadmin.com

## 📄 许可证

MIT License - 详见 [LICENSE](../../../LICENSE) 文件

---

> 💡 **提示**: 这是一个持续迭代的组件，我们会根据用户反馈不断优化和增加新功能。欢迎提出建议和贡献代码！
