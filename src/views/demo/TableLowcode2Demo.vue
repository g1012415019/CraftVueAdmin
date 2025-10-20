<template>
  <div class="table-lowcode2-demo">
    <TableLowcode2Component 
      ref="tableRef"
      @open-config="showConfigPanel = true" 
      @view-name-change="currentViewName = $event"
    />
    
    <ConfigPanel 
      :show="showConfigPanel" 
      :current-view-name="currentViewName"
      @update:show="showConfigPanel = $event"
      @config-change="handleConfigChange"
      @update-view-name="handleUpdateViewName"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue';
import TableLowcode2Component from '@/components/TableLowcode2/TableLowcode2.vue';
import ConfigPanel from '@/components/TableLowcode2/Config/ConfigPanel.vue';
import { mapToTableConfig } from '@/components/TableLowcode2/utils/configMapper';
import { useTableConfigStore } from '@/store/modules/tableConfig';

const showConfigPanel = ref(false);
const tableStore = useTableConfigStore();
const currentViewName = ref('默认视图'); // 直接使用响应式变量
const tableRef = ref(); // 添加 ref 引用

// 简化配置 - 只需要核心参数
const simpleConfig = {
  title: '员工管理表格',
  fields: [
    { key: 'id', label: 'ID', type: 'number', width: 80, sortable: true },
    { key: 'name', label: '姓名', type: 'text', width: 120, sortable: true },
    { key: 'age', label: '年龄', type: 'number', width: 80, sortable: true },
    { key: 'email', label: '邮箱', type: 'text', width: 200, sortable: false },
    { key: 'phone', label: '电话', type: 'text', width: 140, sortable: false },
    { key: 'department', label: '部门', type: 'text', width: 120, sortable: true },
    { key: 'status', label: '状态', type: 'select', width: 100, sortable: true },
    { key: 'avatar', label: '头像', type: 'image', width: 80, sortable: false },
    { key: 'address', label: '地址', type: 'text', width: 200, sortable: false },
    { key: 'createTime', label: '创建时间', type: 'date', width: 160, sortable: true },
  ],
  features: {
    pagination: true,
    search: true,
    export: true,
    selection: true,
    editing: true,
  },
  theme: 'light'
};

// 自动映射为完整的表格配置
const tableConfig = ref(mapToTableConfig(simpleConfig));

// 添加示例数据
tableConfig.value.data = [
  {
    id: 1,
    name: '张三',
    age: 28,
    email: 'zhangsan@example.com',
    phone: '13800138001',
    department: '技术部',
    status: 'active',
    avatar: 'https://via.placeholder.com/40',
    address: '北京市朝阳区',
    createTime: '2023-01-15'
  },
  {
    id: 2,
    name: '李四',
    age: 32,
    email: 'lisi@example.com',
    phone: '13800138002',
    department: '销售部',
    status: 'active',
    avatar: 'https://via.placeholder.com/40',
    address: '上海市浦东新区',
    createTime: '2023-02-20'
  }
];

// 处理配置变化 - 实时生效
const handleConfigChange = (newConfig: any) => {
  // 配置已经通过响应式系统自动更新
  // 这里可以添加额外的处理逻辑，比如保存到本地存储
  console.log('配置已更新:', newConfig);
};

// 处理视图名称更新
const handleUpdateViewName = (newName: string) => {
  currentViewName.value = newName;
  // 调用子组件的方法更新视图名称
  tableRef.value?.updateCurrentViewName?.(newName);
};

// 提供配置给子组件
provide('tableConfig', tableConfig);
</script>

<style scoped>
.table-lowcode2-demo {
  padding: 20px;
}
</style>
