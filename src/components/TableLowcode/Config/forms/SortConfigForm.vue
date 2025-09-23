<template>
  <n-form :model="sortConfig" label-placement="left" :label-width="80">
    <FormItem label="默认排序" type="switch" v-model:value="sortConfig.enabled" />

    <FormItem
      label="排序字段"
      type="select"
      v-model:value="sortConfig.field"
      :options="fieldOptions"
      placeholder="选择排序字段"
      v-if="sortConfig.enabled"
    />

    <FormItem
      label="排序方向"
      type="radio-button-group"
      v-model:value="sortConfig.order"
      :options="orderOptions"
      v-if="sortConfig.enabled"
    />

    <FormItem label="多列排序" type="switch" v-model:value="sortConfig.multiple" />
  </n-form>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { NForm } from 'naive-ui';
  import { useTableStore } from '../../../../store/modules/table';
  import FormItem from '../../FormItem.vue';

  const tableStore = useTableStore();

  const sortConfig = computed({
    get: () =>
      tableStore.getViewConfig.sortConfig || {
        enabled: false,
        field: '',
        order: 'asc',
        multiple: false,
      },
    set: (value) => tableStore.setViewConfig({ ...tableStore.getViewConfig, sortConfig: value }),
  });

  watch(
    sortConfig,
    (newConfig) => {
      tableStore.setViewConfig({ ...tableStore.getViewConfig, sortConfig: newConfig });
    },
    { deep: true }
  );

  const fieldOptions = computed(() =>
    tableStore.getColumnsConfig.map((col) => ({ label: col.title, value: col.field }))
  );

  const orderOptions = [
    { label: '升序', value: 'asc' },
    { label: '降序', value: 'desc' },
  ];
</script>
