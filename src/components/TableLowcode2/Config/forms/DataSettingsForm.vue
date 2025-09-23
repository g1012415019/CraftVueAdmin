<template>
  <n-form label-placement="left" label-width="auto">
    <n-form-item label="分页模式">
      <n-switch v-model:value="config.data.serverSidePagination">
        <template #checked>服务端分页</template>
        <template #unchecked>前端分页</template>
      </n-switch>
    </n-form-item>
    <n-form-item label="数据刷新间隔 (秒)">
      <n-input-number
        v-model:value="config.data.refreshInterval"
        clearable
        placeholder="0表示不刷新"
      />
    </n-form-item>
    <n-form-item label="导出功能配置">
      <p class="text-gray-400 text-xs">需要一个更复杂的UI来配置...</p>
    </n-form-item>
    <n-form-item label="导入模板配置">
      <p class="text-gray-400 text-xs">需要一个更复杂的UI来配置...</p>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
  import { inject, Ref } from 'vue';
  // Inject the shared config state
  const config = inject('tableConfig') as Ref<any>;
</script>
