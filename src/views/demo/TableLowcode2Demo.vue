<template>
  <div class="demo-page">
    <TableLowcode ref="tableRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue';
import TableLowcode from '@/components/TableLowcode/TableLowcode.vue';

const tableRef = ref();

const tableConfig = ref({
  // 必选项：数据
  data: [
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部', status: 'active' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com', department: '销售部', status: 'active' },
    { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', department: '市场部', status: 'inactive' },
    { id: 4, name: '赵六', age: 30, email: 'zhaoliu@example.com', department: '技术部', status: 'active' },
    { id: 5, name: '钱七', age: 26, email: 'qianqi@example.com', department: '销售部', status: 'inactive' }
  ],
  // 必选项：列配置
  columns: [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: '姓名', visible: true },
    { key: 'age', label: '年龄', visible: true },
    { key: 'email', label: '邮箱', visible: true },
    { key: 'department', label: '部门', visible: true },
    { key: 'status', label: '状态', visible: true }
  ],
  // 视图配置 - 每个视图有独立的完整配置
  views: [
    {
      key: 'all',
      label: '全部员工',
      filter: {},
      config: {
        basic: {
          title: '全部员工列表',
          description: '显示所有员工信息',
          bordered: true,
          striped: false
        },
        pagination: {
          enabled: true,
          defaultPageSize: 10
        },
        columns: [
          { key: 'id', label: 'ID', visible: true },
          { key: 'name', label: '姓名', visible: true },
          { key: 'age', label: '年龄', visible: true },
          { key: 'email', label: '邮箱', visible: true },
          { key: 'department', label: '部门', visible: true },
          { key: 'status', label: '状态', visible: true }
        ],
        filters: [
          { key: 'name', label: '姓名', filterType: 'input', show: true },
          { key: 'department', label: '部门', filterType: 'select', show: true, options: ['技术部', '销售部', '市场部'] },
          { key: 'status', label: '状态', filterType: 'select', show: true, options: ['active', 'inactive'] },
          { key: 'age', label: '年龄', filterType: 'number', show: true, advancedFilter: true }
        ]
      }
    },
    {
      key: 'tech',
      label: '技术部',
      filter: { department: '技术部' },
      config: {
        basic: {
          title: '技术部员工',
          description: '技术部门员工列表',
          bordered: true,
          striped: true
        },
        pagination: {
          enabled: true,
          defaultPageSize: 5
        },
        columns: [
          { key: 'id', label: 'ID', visible: true },
          { key: 'name', label: '姓名', visible: true },
          { key: 'age', label: '年龄', visible: true },
          { key: 'email', label: '邮箱', visible: true },
          { key: 'status', label: '状态', visible: true }
          // 注意：技术部视图不显示部门列
        ],
        filters: [
          { key: 'name', label: '姓名', filterType: 'input', show: true },
          { key: 'age', label: '年龄', filterType: 'number', show: true },
          { key: 'status', label: '状态', filterType: 'select', show: true, options: ['active', 'inactive'] },
          { key: 'email', label: '邮箱', filterType: 'input', show: true, advancedFilter: true }
          // 注意：技术部视图不显示部门筛选
        ]
      }
    },
    {
      key: 'active',
      label: '在职员工',
      filter: { status: 'active' },
      config: {
        basic: {
          title: '在职员工名单',
          description: '当前在职的员工列表',
          bordered: false,
          striped: false
        },
        pagination: {
          enabled: false
        },
        columns: [
          { key: 'name', label: '姓名', visible: true },
          { key: 'department', label: '部门', visible: true },
          { key: 'email', label: '邮箱', visible: true }
          // 注意：在职员工视图只显示关键信息
        ],
        filters: [
          { key: 'name', label: '姓名', filterType: 'input', show: true },
          { key: 'department', label: '部门', filterType: 'select', show: true, options: ['技术部', '销售部', '市场部'] },
          { key: 'age', label: '年龄', filterType: 'number', show: true, advancedFilter: true }
          // 注意：在职员工视图不显示状态筛选（因为都是active）
        ]
      }
    }
  ]
});

// 提供配置给子组件
provide('tableConfig', tableConfig);
</script>

<style scoped>
.demo-page {
  padding: 20px;
}
</style>
