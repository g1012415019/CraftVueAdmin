<template>
  <div class="column-config-form">
    <n-button @click="showColumnManagementModal = true" type="primary" style="margin-top: 20px"
      >管理列</n-button
    >

    <ColumnManagementModal
      v-model:show="showColumnManagementModal"
      @update:columns="updateColumnsFromModal"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { NButton } from 'naive-ui';
  import { useTableStore } from '../../../../store/modules/table';
  import { ColumnConfig } from '../../../types/ColumnConfig';
  import ColumnManagementModal from './ColumnManagementModal.vue';

  const tableStore = useTableStore();
  const columnsConfig = computed({
    get: () => tableStore.getColumnsConfig,
    set: (value) => tableStore.setColumnsConfig(value),
  });

  const showColumnManagementModal = ref(false);

  const addColumn = () => {
    const newColumn: ColumnConfig = {
      field: `newColumn${columnsConfig.value.length + 1}`,
      title: `新列 ${columnsConfig.value.length + 1}`,
      type: 'text',
      width: 'auto',
      align: 'left',
      sortable: false,
      filterable: false,
      resizable: false,
      fixed: 'none',
      ellipsis: false,
      hideInTable: false,
    };
    tableStore.setColumnsConfig([...columnsConfig.value, newColumn]);
    showColumnManagementModal.value = true; // Open modal after adding
  };

  const updateColumnsFromModal = (updatedColumns: ColumnConfig[]) => {
    tableStore.setColumnsConfig(updatedColumns);
  };
</script>

<style scoped>
  .column-list {
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 10px;
  }

  .column-item {
    display: flex;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #eee;
  }

  .column-item:last-child {
    border-bottom: none;
  }

  .column-header {
    display: flex;
    align-items: center;
    width: 100%;
  }
</style>

<style scoped>
  .column-header {
    display: flex;
    align-items: center;
    width: 100%;
  }
</style>
