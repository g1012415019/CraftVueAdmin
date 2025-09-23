<template>
  <n-form :model="quickFilterConfig" label-placement="left" :label-width="80">
    <FormItem label="启用快速筛选" type="switch" v-model:value="quickFilterConfig.enabled" />

    <FormItem
      label="筛选位置"
      type="radio-button-group"
      v-model:value="quickFilterConfig.position"
      :options="positionOptions"
      v-if="quickFilterConfig.enabled"
    />

    <FormItem
      label="筛选字段"
      type="select"
      v-model:value="quickFilterConfig.field"
      :options="fieldOptions"
      placeholder="选择筛选字段"
      v-if="quickFilterConfig.enabled"
    />

    <FormItem
      label="筛选类型"
      type="radio-button-group"
      v-model:value="quickFilterConfig.type"
      :options="typeOptions"
      v-if="quickFilterConfig.enabled"
    />

    <FormItem
      label="显示清除按钮"
      type="switch"
      v-model:value="quickFilterConfig.showClear"
      v-if="quickFilterConfig.enabled"
    />
  </n-form>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { NForm } from 'naive-ui';
  import { useTableStore } from '../../../../store/modules/table';
  import FormItem from '../../FormItem.vue';

  const tableStore = useTableStore();

  const quickFilterConfig = computed({
    get: () =>
      tableStore.getViewConfig.quickFilterConfig || {
        enabled: false,
        position: 'top',
        field: '',
        type: 'select',
        showClear: true,
      },
    set: (value) =>
      tableStore.setViewConfig({ ...tableStore.getViewConfig, quickFilterConfig: value }),
  });

  watch(
    quickFilterConfig,
    (newConfig) => {
      tableStore.setViewConfig({ ...tableStore.getViewConfig, quickFilterConfig: newConfig });
    },
    { deep: true }
  );

  const positionOptions = [
    { label: '顶部', value: 'top' },
    { label: '左侧', value: 'left' },
    { label: '右侧', value: 'right' },
  ];

  const typeOptions = [
    { label: '下拉选择', value: 'select' },
    { label: '按钮组', value: 'buttons' },
    { label: '标签', value: 'tags' },
  ];

  const fieldOptions = computed(() =>
    tableStore.getColumnsConfig.map((col) => ({ label: col.title, value: col.field }))
  );
</script>
