<template>
  <n-form :model="localViewConfig" label-placement="left" :label-width="80">
    <FormItem
      label="行高"
      type="radio-button-group"
      name="rowHeight"
      v-model:value="localViewConfig.rowHeight"
      :options="rowHeightOptions"
    />

    <FormItem
      label="显示设置"
      type="checkbox-group"
      v-model:value="localViewConfig.displaySettings"
      :options="displaySettingsOptions"
      :cols="3"
    />

    <FormItem
      label="交互方式"
      type="radio-button-group"
      name="interactionMode"
      v-model:value="localViewConfig.interactionMode"
      :options="interactionModeOptions"
    />

    <FormItem label="自动刷新" type="switch" v-model:value="localViewConfig.autoRefresh" />

    <FormItem
      label="刷新间隔"
      type="input-number"
      v-if="localViewConfig.autoRefresh"
      v-model:value="localViewConfig.autoRefreshInterval"
      :min="1"
      :max="3600"
      suffix="秒"
    />
  </n-form>
</template>

<script lang="ts" setup>
  import { computed, watch } from 'vue';
  import { NForm } from 'naive-ui';
  import { useTableStore } from '../../../../store/modules/table';
  import FormItem from '../../FormItem.vue';

  const tableStore = useTableStore();

  const localViewConfig = computed({
    get: () => tableStore.getViewConfig,
    set: (value) => tableStore.setViewConfig(value),
  });

  // Watch for changes and update store
  watch(
    localViewConfig,
    (newConfig) => {
      tableStore.setViewConfig(newConfig);
    },
    { deep: true }
  );

  const rowHeightOptions = [
    { label: '默认', value: 'default' },
    { label: '紧凑', value: 'compact' },
    { label: '舒适', value: 'comfortable' },
  ];

  const displaySettingsOptions = [
    { label: '显示边框', value: 'showBorder' },
    { label: '斑马纹', value: 'showStripe' },
    { label: '固定表头', value: 'fixedHeader' },
  ];

  const interactionModeOptions = [
    { label: '点击', value: 'click' },
    { label: '悬停', value: 'hover' },
  ];
</script>
