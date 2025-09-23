<template>
  <n-form :model="filterConfig" label-placement="left" :label-width="80">
    <FormItem label="启用过滤" type="switch" v-model:value="filterConfig.enabled" />

    <FormItem
      label="过滤模式"
      type="radio-button-group"
      v-model:value="filterConfig.mode"
      :options="modeOptions"
      v-if="filterConfig.enabled"
    />

    <FormItem
      label="显示搜索框"
      type="switch"
      v-model:value="filterConfig.showSearch"
      v-if="filterConfig.enabled"
    />

    <FormItem
      label="搜索字段"
      type="select"
      v-model:value="filterConfig.searchFields"
      :options="fieldOptions"
      placeholder="选择搜索字段"
      v-if="filterConfig.enabled && filterConfig.showSearch"
    />

    <FormItem
      label="实时搜索"
      type="switch"
      v-model:value="filterConfig.realtime"
      v-if="filterConfig.enabled"
    />
  </n-form>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { NForm } from 'naive-ui';
  import { useTableStore } from '../../../../store/modules/table';
  import FormItem from '../../FormItem.vue';

  const tableStore = useTableStore();

  const filterConfig = computed({
    get: () =>
      tableStore.getViewConfig.filterConfig || {
        enabled: false,
        mode: 'local',
        showSearch: true,
        searchFields: [],
        realtime: true,
      },
    set: (value) => tableStore.setViewConfig({ ...tableStore.getViewConfig, filterConfig: value }),
  });

  watch(
    filterConfig,
    (newConfig) => {
      tableStore.setViewConfig({ ...tableStore.getViewConfig, filterConfig: newConfig });
    },
    { deep: true }
  );

  const modeOptions = [
    { label: '本地过滤', value: 'local' },
    { label: '服务端过滤', value: 'remote' },
  ];

  const fieldOptions = computed(() =>
    tableStore.getColumnsConfig.map((col) => ({ label: col.title, value: col.field }))
  );
</script>
