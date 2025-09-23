<template>
  <div class="flex justify-between mb-4">
    <div>
      <!-- Left side of the toolbar -->
    </div>
    <div>
      <n-button class="mr-2" @click="$emit('refresh')">Refresh</n-button>
      <n-dropdown :options="exportOptions" @select="handleExportSelect">
        <n-button>Export</n-button>
      </n-dropdown>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { NButton, NDropdown } from 'naive-ui';

  defineEmits(['refresh', 'export']);

  const exportOptions = [{ label: 'Export as CSV', key: 'csv' }];

  function handleExportSelect(key: string) {
    emit('export', key);
  }
</script>
