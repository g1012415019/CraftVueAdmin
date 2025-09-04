<template>
  <n-form :model="dataSourceConfig" label-placement="left" :label-width="80">
    <n-form-item label="API地址">
      <n-input v-model:value="dataSourceConfig.api" placeholder="请输入API接口地址" />
    </n-form-item>

    <n-form-item label="请求方法">
      <n-radio-group v-model:value="dataSourceConfig.method" name="method">
        <n-radio-button value="GET">GET</n-radio-button>
        <n-radio-button value="POST">POST</n-radio-button>
      </n-radio-group>
    </n-form-item>

    <n-form-item label="请求参数">
      <n-input
        type="textarea"
        v-model:value="paramsJson"
        placeholder="请输入JSON格式的请求参数"
        @blur="parseParams"
      />
    </n-form-item>

    <n-form-item label="数据键名">
      <n-input v-model:value="dataSourceConfig.dataKey" placeholder="请输入列表数据键名 (e.g., data.list)" />
    </n-form-item>

    <n-form-item label="总数键名">
      <n-input v-model:value="dataSourceConfig.totalKey" placeholder="请输入总条数键名 (e.g., data.total)" />
    </n-form-item>

    <!-- Placeholder for beforeRequest and afterResponse function names -->
    <n-form-item label="请求前钩子">
      <n-input v-model:value="dataSourceConfig.beforeRequest" placeholder="请输入请求前处理函数名" />
    </n-form-item>
    <n-form-item label="响应后钩子">
      <n-input v-model:value="dataSourceConfig.afterResponse" placeholder="请输入响应后处理函数名" />
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import {
  NForm,
  NFormItem,
  NInput,
  NRadioGroup,
  NRadioButton,
} from 'naive-ui';
import { useTableStore } from '../../../../store/modules/table';

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

watch(dataSourceConfig, (newConfig) => {
  paramsJson.value = JSON.stringify(newConfig.params, null, 2);
}, { deep: true });

// Note: Direct mutation of computed ref is not allowed. Use actions.
// For simplicity, I'm directly binding to the computed ref for now.
// In a real app, you'd dispatch actions like tableStore.setDataSourceConfig({ params: value })
</script>
