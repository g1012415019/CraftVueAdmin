<template>
  <div class="demo-page">
    <TableLowcode :tableConfig="tableConfig" ref="tableRef" />
  </div>
</template>
<script setup lang="ts">
import { ref, provide } from 'vue';
import TableLowcode from '@/components/TableLowcode/TableLowcode.vue';
import type { ExternalConfig } from '@/components/TableLowcode/types';

const tableRef = ref();

const tableConfig: ExternalConfig = {
  /** 表格数据 - 所有视图共享的数据源 */
  data: [
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部', status: 'active' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com', department: '销售部', status: 'active' },
    { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', department: '市场部', status: 'inactive' },
    { id: 4, name: '赵六', age: 30, email: 'zhaoliu@example.com', department: '技术部', status: 'active' },
    { id: 5, name: '钱七', age: 26, email: 'qianqi@example.com', department: '销售部', status: 'inactive' }
  ],
  /** 列配置 - 定义所有可用的列 */
  columns: [
    { key: 'id', label: 'ID', visible: true, width: 80, align: 'center', sortable: true },
    { key: 'name', label: '姓名', visible: true, width: 120, sortable: true, filterable: true, filterType: 'input' },
    { key: 'age', label: '年龄', visible: true, width: 100, align: 'center', sortable: true, filterable: true, filterType: 'number' },
    { key: 'email', label: '邮箱', visible: true, width: 200, ellipsis: true, filterable: true, filterType: 'input' },
    { key: 'department', label: '部门', visible: true, width: 120, sortable: true, filterable: true, filterType: 'select', filterOptions: ['技术部', '销售部', '市场部'] },
    { key: 'status', label: '状态', visible: true, width: 100, align: 'center', sortable: true, filterable: true, filterType: 'select', filterOptions: ['active', 'inactive'] }
  ],

  /** 视图配置列表 - 继承默认配置并覆盖特定项 */
  views: [
    {
      /** 视图1：全部员工 - 使用默认配置 */
      key: 'all',
      label: '全部员工',
      description: '显示所有员工信息',
      /** 只覆盖标题 */
      basic: {
        size: "large",
        density: 'comfortable',
      },
      "sort": {
        "customFields": [
          {
            "key": "id",
            "label": "ID",
            "defaultOrder": "asc",
            "sortType": "text"
          }
        ]
      },
      filterList: {
        "filters": [
          {
            "key": "age",
            "label": "age",
            "type": "input",
            "position": "basic",
            "options": []
          }
        ]
      },

      /** 列配置 - 定义所有可用的列 */
      columns: [
        { key: 'id', label: 'ID', visible: true, width: 80, align: 'center', sortable: true },
        { key: 'name', label: '姓名', visible: true, width: 120, sortable: true, filterable: true, filterType: 'input' },
        { key: 'age', label: '年龄', visible: true, width: 100, align: 'center', sortable: true, filterable: true, filterType: 'number' },
        { key: 'email', label: '邮箱', visible: true, width: 200, ellipsis: true, filterable: true, filterType: 'input' },
        { key: 'department', label: '部门', visible: true, width: 120, sortable: true, filterable: true, filterType: 'select', filterOptions: ['技术部', '销售部', '市场部'] },
        { key: 'status', label: '状态', visible: true, width: 100, align: 'center', sortable: true, filterable: true, filterType: 'select', filterOptions: ['active', 'inactive'] }
      ],
    }
  ]
};
</script>
