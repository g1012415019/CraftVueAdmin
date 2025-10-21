<template>
  <div class="table-section">
    <!-- 表格容器 -->
    <div class="table-wrapper">
      <DataTable 
        ref="dataTableRef" 
        @update-checked-keys="$emit('update-checked-keys', $event)" 
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from '../Table/DataTable.vue'

interface Props {
  checkedRowKeys: any[]
}

defineProps<Props>()
defineEmits(['update-checked-keys'])
</script>

<style scoped>
.table-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-wrapper {
  flex: 1;
  overflow: auto;
}
</style>
