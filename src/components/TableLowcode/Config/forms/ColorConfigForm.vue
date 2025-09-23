<template>
  <n-form :model="colorConfig" label-placement="left" :label-width="80">
    <FormItem
      label="主题色"
      type="input"
      v-model:value="colorConfig.primaryColor"
      placeholder="#1890ff"
    />

    <FormItem
      label="表头背景"
      type="input"
      v-model:value="colorConfig.headerBg"
      placeholder="#fafafa"
    />

    <FormItem
      label="奇数行背景"
      type="input"
      v-model:value="colorConfig.oddRowBg"
      placeholder="#ffffff"
    />

    <FormItem
      label="偶数行背景"
      type="input"
      v-model:value="colorConfig.evenRowBg"
      placeholder="#f9f9f9"
    />

    <FormItem
      label="悬停背景"
      type="input"
      v-model:value="colorConfig.hoverBg"
      placeholder="#e6f7ff"
    />

    <FormItem
      label="边框颜色"
      type="input"
      v-model:value="colorConfig.borderColor"
      placeholder="#f0f0f0"
    />
  </n-form>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue';
  import { NForm } from 'naive-ui';
  import { useTableStore } from '../../../../store/modules/table';
  import FormItem from '../../FormItem.vue';

  const tableStore = useTableStore();

  const colorConfig = computed({
    get: () =>
      tableStore.getViewConfig.colorConfig || {
        primaryColor: '#1890ff',
        headerBg: '#fafafa',
        oddRowBg: '#ffffff',
        evenRowBg: '#f9f9f9',
        hoverBg: '#e6f7ff',
        borderColor: '#f0f0f0',
      },
    set: (value) => tableStore.setViewConfig({ ...tableStore.getViewConfig, colorConfig: value }),
  });

  watch(
    colorConfig,
    (newConfig) => {
      tableStore.setViewConfig({ ...tableStore.getViewConfig, colorConfig: newConfig });
    },
    { deep: true }
  );
</script>
