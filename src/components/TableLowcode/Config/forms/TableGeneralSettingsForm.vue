<template>
  <n-form :model="tableGeneralSettings" label-placement="left" :label-width="100">
    <n-form-item label="显示分页">
      <n-switch v-model:value="tableGeneralSettings.pagination" />
    </n-form-item>

    <n-form-item label="每页条数" v-if="tableGeneralSettings.pagination">
      <n-input-number v-model:value="tableGeneralSettings.pageSize" :min="1" :step="10" />
    </n-form-item>

    <n-form-item label="显示序号列">
      <n-switch v-model:value="tableGeneralSettings.showIndexColumn" />
    </n-form-item>

    <n-form-item label="行选择">
      <n-switch v-model:value="tableGeneralSettings.rowSelection" />
    </n-form-item>

    <n-form-item label="行Key">
      <n-input v-model:value="tableGeneralSettings.rowKey" placeholder="请输入行唯一标识键名" />
    </n-form-item>

    <n-form-item label="横向滚动">
      <n-input-number v-model:value="tableGeneralSettings.scrollX" :min="0" placeholder="0" />
    </n-form-item>

    <n-form-item label="纵向滚动">
      <n-input-number v-model:value="tableGeneralSettings.scrollY" :min="0" placeholder="0" />
    </n-form-item>

    <n-form-item label="空数据文本">
      <n-input v-model:value="tableGeneralSettings.emptyText" placeholder="请输入空数据提示文本" />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import {
  NForm,
  NFormItem,
  NSwitch,
  NInputNumber,
  NInput,
} from 'naive-ui';
import { useTableStore } from '../../../../store/modules/table';

const tableStore = useTableStore();
const tableGeneralSettings = computed(() => tableStore.getTableGeneralSettings);

// Note: Direct mutation of computed ref is not allowed. Use actions.
// For simplicity, I'm directly binding to the computed ref for now.
// In a real app, you'd dispatch actions like tableStore.setTableGeneralSettings({ pagination: value })
</script>
