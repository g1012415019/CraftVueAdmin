<template>
  <div class="table-lowcode-demo-page">
    <h1>低代码表格演示</h1>
    <n-grid x-gap="12" :cols="2">
      <n-gi>
        <n-card title="表格预览" style="margin-bottom: 16px;">
          <Toolbar />
          <DataTable :data="sampleData" />
        </n-card>
      </n-gi>
      <n-gi>
        <n-card title="配置面板">
          <ConfigPanel />
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import { NGrid, NGi, NCard } from 'naive-ui';
import DataTable from '../../components/TableLowcode/Table/DataTable.vue';
import ConfigPanel from '../../components/TableLowcode/Config/ConfigPanel.vue';
import Toolbar from '../../components/TableLowcode/Toolbar.vue';
import { useTableStore } from '../../store/modules/table';
import { onMounted } from 'vue';

const tableStore = useTableStore();

// Sample data for demonstration
const sampleData = [
  { id: 1, name: '站点A', region: '华东', type: '基站', power: 90, ports: 8, model: '华为B1', operator: '中国移动', lastReport: '2023-01-01' },
  { id: 2, name: '站点B', region: '华南', type: '宏站', power: 85, ports: 12, model: '中兴Z2', operator: '中国联通', lastReport: '2023-01-02' },
  { id: 3, name: '站点C', region: '华北', type: '微站', power: 92, ports: 4, model: '爱立信E3', operator: '中国电信', lastReport: '2023-01-03' },
];

onMounted(() => {
  // Set initial column configuration for demonstration
  tableStore.setColumnsConfig([
    { field: 'id', title: 'ID', type: 'number', width: 80, sortable: true },
    { field: 'name', title: '站点名称', type: 'text', width: 150, filterable: true },
    { field: 'region', title: '所属区域', type: 'text', width: 120 },
    { field: 'type', title: '站点类型', type: 'text', width: 120 },
    { field: 'power', title: '电量', type: 'number', width: 100 },
    { field: 'ports', title: '端口数量', type: 'number', width: 120 },
    { field: 'model', title: '设备品牌型号', type: 'text', width: 180 },
    { field: 'operator', title: '运营单位', type: 'text', width: 150 },
    { field: 'lastReport', title: '最后上报时间', type: 'date', width: 180, sortable: true },
  ]);

  // Set initial action column configuration
  tableStore.setActionColumnConfig({
    width: 200,
    fixed: 'right',
    actions: [
      { label: '查看', key: 'view', type: 'link' },
      { label: '编辑', key: 'edit', type: 'button' },
      { label: '删除', key: 'delete', type: 'button', confirm: { title: '确认删除', content: '确定要删除此项吗？' } },
    ],
  });
});
</script>

<style scoped>
.table-lowcode-demo-page {
  padding: 20px;
}
</style>
