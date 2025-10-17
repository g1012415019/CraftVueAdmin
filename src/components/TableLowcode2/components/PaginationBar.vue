<template>
  <n-popover
    v-if="config.pagination?.enabled"
    trigger="click"
    placement="bottom-end"
    :show-arrow="false"
  >
    <template #trigger>
      <div class="pagination-bar">
        <n-space align="center" justify="end">
          <n-text v-if="config.pagination?.showTotal" depth="3">
            共 {{ totalCount }} 条
          </n-text>
          
          <n-pagination
            :page="currentPage"
            :page-count="pageCount"
            :size="config.pagination?.size || 'small'"
            simple
            @update:page="$emit('page-change', $event)"
          />
        </n-space>
      </div>
    </template>

    <div class="pagination-menu">
      <div class="menu-item">
        <span>每页显示</span>
        <n-select
          :value="currentPageSize || config.value?.pagination?.defaultPageSize || 20"
          :options="pageSizeOptions"
          size="small"
          style="width: 100px"
          @update:value="$emit('page-size-change', $event)"
        />
      </div>
      
      <div class="menu-item">
        <span>跳转到</span>
        <n-space size="small">
          <n-input-number
            v-model:value="jumpPage"
            :min="1"
            :max="pageCount"
            size="small"
            style="width: 80px"
            @keyup.enter="handleJump"
          />
          <n-button size="small" @click="handleJump">确认</n-button>
        </n-space>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { inject, ref, computed } from 'vue'

interface Props {
  totalCount: number
  currentPage: number
  currentPageSize: number
  pageCount: number
}

defineProps<Props>()
const emit = defineEmits(['page-change', 'page-size-change'])

const config = inject('tableConfig')
const jumpPage = ref(1)

// 从配置中获取每页选项
const pageSizeOptions = computed(() => {
  const options = config.value?.pagination?.pageSizeOptions || ['10', '20', '50', '100']
  return options.map(item => ({
    label: item,
    value: parseInt(item)
  }))
})

const handleJump = () => {
  if (jumpPage.value >= 1 && jumpPage.value <= pageCount) {
    emit('page-change', jumpPage.value)
  }
}
</script>

<style scoped>
.pagination-bar {
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
}

.pagination-bar:hover {
  background-color: #f5f5f5;
}

.pagination-menu {
  padding: 8px;
  min-width: 200px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 8px;
}

.menu-item:last-child {
  margin-bottom: 0;
}
</style>
