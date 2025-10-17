<template>
  <div class="pagination-bar">
    <n-space align="center">
      <n-text depth="3" class="record-count">
        共 {{ totalCount }} 条
        <span v-if="filteredCount !== totalCount" class="filtered-count">
          (筛选后 {{ filteredCount }} 条)
        </span>
      </n-text>
      
      <n-button size="small" quaternary @click="$emit('refresh')" title="刷新">
        <template #icon>
          <n-icon><RefreshIcon /></n-icon>
        </template>
      </n-button>
      
      <n-pagination
        :page="currentPage"
        :page-size="currentPageSize"
        :page-count="pageCount"
        :item-count="filteredCount"
        size="small"
        simple
        @update:page="$emit('page-change', $event)"
        @update:page-size="$emit('page-size-change', $event)"
      />
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { h } from 'vue'

interface Props {
  totalCount: number
  filteredCount: number
  currentPage: number
  currentPageSize: number
  pageCount: number
}

defineProps<Props>()
defineEmits(['refresh', 'page-change', 'page-size-change'])

const RefreshIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z' })
])
</script>

<style scoped>
.pagination-bar {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.filtered-count {
  color: #1890ff;
  font-weight: 500;
}
</style>
