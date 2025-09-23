<template>
  <div class="table-toolbar">
    <n-space>
      <n-button
        v-for="action in batchActions"
        :key="action.key"
        :type="action.type || 'default'"
        @click="handleBatchAction(action)"
      >
        {{ action.label }}
      </n-button>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
  import { defineProps, defineEmits } from 'vue';
  import type { DataTableRowKey } from 'naive-ui';

  interface BatchAction {
    label: string;
    key: string;
    type: string;
    showConfirmation: boolean;
    confirmationText?: string;
    onClick?: (selectedRows: DataTableRowKey[]) => void;
  }

  const props = defineProps<{
    batchActions: BatchAction[];
    handleBatchAction: (action: BatchAction) => void;
  }>();
</script>

<style scoped>
  .table-toolbar {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end; /* Align to right for now */
  }
</style>
