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
    { id: 1, name: '张三', age: 28, email: 'zhangsan@example.com', department: '技术部' },
    { id: 2, name: '李四', age: 32, email: 'lisi@example.com', department: '销售部' },
    { id: 3, name: '王五', age: 25, email: 'wangwu@example.com', department: '市场部' }
  ],
  // 必选项：列配置
  columns: [
    { key: 'id', label: 'ID', visible: true },
    { key: 'name', label: '姓名', visible: true },
    { key: 'age', label: '年龄', visible: true },
    { key: 'email', label: '邮箱', visible: true },
    { key: 'department', label: '部门', visible: true }
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
