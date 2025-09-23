<template>
  <n-form :model="dataSourceConfig" label-placement="left" :label-width="80">
    <FormItem
      label="API地址"
      type="input"
      v-model:value="dataSourceConfig.api"
      placeholder="请输入API接口地址"
    />

    <FormItem
      label="请求方法"
      type="radio-button-group"
      v-model:value="dataSourceConfig.method"
      name="method"
      :options="methodOptions"
    />

    <n-form-item label="请求参数">
      <FormItem
        type="textarea"
        v-model:value="paramsJson"
        placeholder="请输入JSON格式的请求参数"
        @blur="parseParams"
      />
    </n-form-item>

    <FormItem
      label="数据键名"
      type="input"
      v-model:value="dataSourceConfig.dataKey"
      placeholder="请输入列表数据键名 (e.g., data.list)"
    />

    <FormItem
      label="总数键名"
      type="input"
      v-model:value="dataSourceConfig.totalKey"
      placeholder="请输入总条数键名 (e.g., data.total)"
    />

    <FormItem
      label="请求前钩子"
      type="input"
      v-model:value="dataSourceConfig.beforeRequest"
      placeholder="请输入请求前处理函数名"
    />
    <FormItem
      label="响应后钩子"
      type="input"
      v-model:value="dataSourceConfig.afterResponse"
      placeholder="请输入响应后处理函数名"
    />
  </n-form>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { NForm, NFormItem } from 'naive-ui'; // Keep NFormItem for "请求参数"
  import { useTableStore } from '../../../../store/modules/table';
  import FormItem from '../../FormItem.vue'; // Import FormItem

  const tableStore = useTableStore();
  const dataSourceConfig = computed(() => tableStore.getDataSourceConfig);

  const paramsJson = ref(JSON.stringify(dataSourceConfig.value.params, null, 2));

  const parseParams = () => {
    try {
      dataSourceConfig.value.params = JSON.parse(paramsJson.value);
    } catch (e) {
      console.error('Invalid JSON for params:', e);
      // Optionally, show an error message to the user
    }
  };

  watch(
    dataSourceConfig,
    (newConfig) => {
      paramsJson.value = JSON.stringify(newConfig.params, null, 2);
    },
    { deep: true }
  );

  const methodOptions = [
    { label: 'GET', value: 'GET' },
    { label: 'POST', value: 'POST' },
  ];

  // Note: Direct mutation of computed ref is not allowed. Use actions.
  // For simplicity, I'm directly binding to the computed ref for now.
  // In a real app, you'd dispatch actions like tableStore.setDataSourceConfig({ params: value })
</script>
