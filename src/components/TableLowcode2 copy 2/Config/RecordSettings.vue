<template>
  <div class="record-settings px-6 py-4">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">每页显示条数</label>
        <n-input-number v-model:value="pageSize" :min="10" :max="100" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">显示序号</label>
        <n-switch v-model:value="showIndex" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">显示选择框</label>
        <n-switch v-model:value="showSelection" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  const pageSize = ref(20);
  const showIndex = ref(true);
  const showSelection = ref(true);
</script>
