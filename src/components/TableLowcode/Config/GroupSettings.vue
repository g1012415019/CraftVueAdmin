<template>
  <div class="group-settings px-6 py-4">
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">分组字段</label>
        <n-select v-model:value="groupField" :options="fieldOptions" placeholder="选择分组字段" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">分组方式</label>
        <n-radio-group v-model:value="groupType">
          <n-radio value="auto">自动分组</n-radio>
          <n-radio value="manual">手动分组</n-radio>
        </n-radio-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { NSelect, NRadioGroup, NRadio } from 'naive-ui';

  const groupField = ref(null);
  const groupType = ref('auto');
  const fieldOptions = [
    { label: '状态', value: 'status' },
    { label: '创建人', value: 'creator' },
    { label: '部门', value: 'department' },
  ];
</script>
