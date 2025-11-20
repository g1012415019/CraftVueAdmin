# TableLowcode 类型定义

## 目录结构

```
types/
├── README.md                    # 类型定义说明文档
├── index.ts                     # 统一导出入口
├── external.ts                  # 外部接口定义
├── components/                  # 组件相关类型
│   ├── actionBar.ts            # 操作栏配置
│   ├── filterSection.ts        # 筛选区域配置
│   ├── pagination.ts           # 分页组件配置
│   ├── tableSection.ts         # 表格区域配置
│   └── viewManager.ts          # 视图管理配置
├── config/                     # 配置表单类型
│   ├── forms.ts               # 基础表单配置
│   ├── basicSettings.ts       # 基础设置
│   ├── configPanel.ts         # 配置面板
│   ├── dataFilter.ts          # 数据过滤
│   ├── fieldSettings.ts       # 字段设置
│   ├── filterListSettings.ts  # 筛选列表设置
│   ├── paginationSettings.ts  # 分页设置
│   └── sortSettings.ts        # 排序设置
├── filters/                    # 筛选器类型
│   ├── index.ts               # 筛选器统一导出
│   └── filter.ts              # 基础筛选器
└── table/                      # 表格相关类型
    ├── column.ts              # 表格列定义
    ├── components.ts          # 表格组件
    └── dataTable.ts           # 数据表格
```

## 使用方式

### 导入基础类型
```typescript
import type { TableColumn, BasicConfig } from './types'
```

### 导入配置类型
```typescript
import type { 
  BasicSettingsConfig, 
  DataFilterConfig,
  SortConfig 
} from './types'
```

### 导入筛选器类型
```typescript
import type { 
  FilterConfig,
  FilterInputConfig,
  FilterSelectConfig 
} from './types'
```

## 类型分类

### 基础类型
- `TableColumn`: 表格列定义
- `DataTableSortConfig`: 表格排序配置
- `ColumnHeaderDropdownConfig`: 列头下拉配置

### 组件类型
- `ActionBarConfig`: 操作栏配置
- `PaginationConfig`: 分页组件配置
- `FilterListConfig`: 筛选列表配置
- `BasicConfig`: 基础表格配置
- `ViewConfig`: 视图配置

### 配置类型
- `BasicSettingsConfig`: 基础设置配置
- `PaginationSettingsConfig`: 分页设置配置
- `FieldSettingsConfig`: 字段设置配置
- `DataFilterConfig`: 数据过滤配置
- `SortConfig`: 排序配置

### 筛选器类型
- `FilterConfig`: 基础筛选器配置
- `FilterInputConfig`: 输入框筛选器
- `FilterSelectConfig`: 下拉选择筛选器
- `FilterDateConfig`: 日期筛选器

### 外部接口
- `ExternalConfig`: 外部配置接口
- `FeatureConfig`: 功能配置接口

## 命名规范

1. **配置类型**: 以 `Config` 结尾
2. **设置类型**: 以 `SettingsConfig` 结尾
3. **组件属性**: 以 `Props` 结尾
4. **筛选器**: 以 `Filter` 开头
5. **表格相关**: 以 `Table` 开头

## 维护原则

1. **单一职责**: 每个文件只定义相关的类型
2. **清晰导出**: 通过 index.ts 统一导出
3. **文档完整**: 重要类型添加注释说明
4. **向后兼容**: 修改类型时保持向后兼容
