<template>
  <n-form :model="groupConfig" label-placement="left" :label-width="80">
    <FormItem label="启用分组" type="switch" v-model:value="groupConfig.enabled" />

    <FormItem
      label="分组字段"
      type="select"
      v-model:value="groupConfig.groupBy"
      :options="fieldOptions"
      placeholder="选择分组字段"
      v-if="groupConfig.enabled"
    />

    <FormItem
      label="分组排序"
      type="radio-button-group"
      v-model:value="groupConfig.sortOrder"
      :options="sortOptions"
      v-if="groupConfig.enabled"
    />

    <FormItem
      label="显示统计"
      type="switch"
      v-model:value="groupConfig.showSummary"
      v-if="groupConfig.enabled"
    />
  </n-form>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { NForm } from 'naive-ui';
  import { useTableStore } from '../../../../store/modules/table';
  import FormItem from '../../FormItem.vue';

  const tableStore = useTableStore();

  const groupConfig = computed({
    get: () =>
      tableStore.getViewConfig.groupConfig || {
        enabled: false,
        groupBy: '',
        sortOrder: 'asc',
        showSummary: false,
      },
    set: (value) => tableStore.setViewConfig({ ...tableStore.getViewConfig, groupConfig: value }),
  });

  watch(
    groupConfig,
    (newConfig) => {
      tableStore.setViewConfig({ ...tableStore.getViewConfig, groupConfig: newConfig });
    },
    { deep: true }
  );

  const fieldOptions = computed(() =>
    tableStore.getColumnsConfig.map((col) => ({ label: col.title, value: col.field }))
  );

  const sortOptions = [
    { label: '升序', value: 'asc' },
    { label: '降序', value: 'desc' },
  ];
</script>
