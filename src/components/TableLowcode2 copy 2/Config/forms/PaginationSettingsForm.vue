<template>
  <n-form label-placement="left" label-width="auto">
    <n-form-item label="分页器位置">
      <n-radio-group v-model:value="config.pagination.position" name="pagination-position">
        <n-radio-button
          v-for="option in paginationPositionOptions"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </n-radio-button>
      </n-radio-group>
    </n-form-item>
    <n-form-item label="每页条数选项">
      <n-input v-model:value="config.pagination.pageSizeOptions" placeholder="例如: 10, 20, 50" />
    </n-form-item>
    <n-form-item label="分页功能开关" label-placement="top">
      <n-space justify="space-between" wrap>
        <n-switch v-model:value="config.pagination.simple">
          <template #checked>简洁模式</template>
          <template #unchecked>完整模式</template>
        </n-switch>
        <n-switch v-model:value="config.pagination.showTotal">
          <template #checked>显示总数</template>
          <template #unchecked>隐藏总数</template>
        </n-switch>
        <n-switch v-model:value="config.pagination.showQuickJumper">
          <template #checked>快速跳转</template>
          <template #unchecked>无快速跳转</template>
        </n-switch>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
  import { inject, Ref } from 'vue';
  // 注入共享的配置状态
  const config = inject('tableConfig') as Ref<any>;

  const paginationPositionOptions = [
    { label: '顶部', value: 'top' },
    { label: '底部', value: 'bottom' },
    { label: '上下', value: 'both' },
    { label: '隐藏', value: 'hidden' },
  ];
</script>
