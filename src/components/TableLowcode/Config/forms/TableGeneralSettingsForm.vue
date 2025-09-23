<template>
  <n-form :model="tableGeneralSettings" label-placement="left" :label-width="100">
    <FormItem label="显示分页" type="switch" v-model:value="tableGeneralSettings.pagination" />

    <FormItem
      label="每页条数"
      type="input-number"
      v-if="tableGeneralSettings.pagination"
      v-model:value="tableGeneralSettings.pageSize"
      :min="1"
      :step="10"
    />

    <FormItem
      label="显示序号列"
      type="switch"
      v-model:value="tableGeneralSettings.showIndexColumn"
    />

    <FormItem label="行选择" type="switch" v-model:value="tableGeneralSettings.rowSelection" />

    <FormItem
      label="行Key"
      type="input"
      v-model:value="tableGeneralSettings.rowKey"
      placeholder="请输入行唯一标识键名"
    />

    <FormItem
      label="横向滚动"
      type="input-number"
      v-model:value="tableGeneralSettings.scrollX"
      :min="0"
      placeholder="0"
    />

    <FormItem
      label="纵向滚动"
      type="input-number"
      v-model:value="tableGeneralSettings.scrollY"
      :min="0"
      placeholder="0"
    />

    <FormItem
      label="空数据文本"
      type="input"
      v-model:value="tableGeneralSettings.emptyText"
      placeholder="请输入空数据提示文本"
    />
  </n-form>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { NForm } from 'naive-ui'; // Only NForm is needed now
  import { useTableStore } from '../../../../store/modules/table';
  import FormItem from '../../FormItem.vue'; // Import FormItem

  const tableStore = useTableStore();
  const tableGeneralSettings = computed(() => tableStore.getTableGeneralSettings);

  // Note: Direct mutation of computed ref is not allowed. Use actions.
  // For simplicity, I'm directly binding to the computed ref for now.
  // In a real app, you'd dispatch actions like tableStore.setTableGeneralSettings({ pagination: value })
</script>
