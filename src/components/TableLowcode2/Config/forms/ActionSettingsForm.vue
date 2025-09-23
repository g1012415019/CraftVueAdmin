<template>
  <n-tabs type="line" animated>
    <n-tab-pane name="top" tab="顶部操作">
      <ActionListEditor v-model:actions="config.actions.top" />
    </n-tab-pane>
    <n-tab-pane name="inline" tab="行内操作">
      <ActionListEditor v-model:actions="config.actions.inline" />
    </n-tab-pane>
    <n-tab-pane name="batch" tab="批量操作">
      <ActionListEditor v-model:actions="config.actions.batch" />
    </n-tab-pane>
  </n-tabs>
</template>

<script setup lang="ts">
  // 注入共享的配置状态
  const config = inject('tableConfig') as Ref<any>;

  // To keep this component clean, we create a reusable editor component.
  // This also avoids code duplication.
  const ActionListEditor = defineAsyncComponent(() => import('./ActionListEditor.vue'));
</script>
