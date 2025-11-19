<template>
  <n-popover
    v-if="isEnabled"
    trigger="click"
    placement="bottom-end"
    :show-arrow="false"
  >
    <template #trigger>
      <div class="pagination-bar">
        <n-space align="center" justify="end">
          <n-text v-if="showTotal" depth="3">
            共 {{ totalCount }} 条
          </n-text>
          
          <n-pagination
            :page="currentPage"
            :page-count="pageCount"
            :size="paginationSize"
            simple
            @update:page="handlePageChange"
          />
        </n-space>
      </div>
    </template>

    <div class="pagination-menu">
      <div class="menu-item">
        <span>每页显示</span>
        <n-select
          :value="currentPageSize"
          :options="pageSizeOptions"
          size="small"
          style="width: 100px"
          @update:value="handlePageSizeChange"
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

      <n-divider style="margin: 8px 0;" />

      <div class="menu-item">
        <span>分页设置</span>
        <n-space size="small">
          <n-switch 
            :value="showTotal" 
            @update:value="handleToggleShowTotal"
            size="small"
          />
          <span style="font-size: 11px;">显示总数</span>
        </n-space>
      </div>

      <div class="menu-item">
        <span>分页位置</span>
        <n-select
          :value="position"
          :options="positionOptions"
          size="small"
          style="width: 100px"
          @update:value="handlePositionChange"
        />
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { PaginationConfig } from '../types'
import { msg } from '../utils/message'

// ==================== 组件定义 ====================

const props = defineProps<{
  config?: PaginationConfig
  totalCount?: number
}>()

const emit = defineEmits<{
  'update:config': [config: PaginationConfig]
  'page-change': [page: number]
  'page-size-change': [size: number]
}>()

// ==================== 内部状态 ====================

const jumpPage = ref(1)

// ==================== 计算属性 ====================

const isEnabled = computed(() => 
  props.config?.enabled !== false
)

const currentPage = computed(() => 
  props.config?.currentPage || 1
)

const currentPageSize = computed(() => 
  props.config?.currentPageSize || props.config?.defaultPageSize || 20
)

const pageCount = computed(() => 
  Math.ceil((props.totalCount || 0) / currentPageSize.value) || 1
)

const paginationSize = computed(() => 
  props.config?.size || 'small'
)

const showTotal = computed(() => 
  props.config?.showTotal !== false
)

const position = computed(() => 
  props.config?.position || 'bottom'
)

const pageSizeOptions = computed(() => {
  const options = props.config?.pageSizes || [10, 20, 50, 100]
  return options.map(size => ({
    label: `${size} 条/页`,
    value: size
  }))
})

const positionOptions = computed(() => [
  { label: '底部', value: 'bottom' },
  { label: '顶部', value: 'top' },
  { label: '两端', value: 'both' }
])

// ==================== 事件处理 ====================

const updateConfig = (updates: Partial<PaginationConfig>) => {
  const newConfig = { ...props.config, ...updates }
  emit('update:config', newConfig)
}

const handlePageChange = (page: number) => {
  updateConfig({ currentPage: page })
  emit('page-change', page)
}

const handlePageSizeChange = (size: number) => {
  const newPageCount = Math.ceil((props.totalCount || 0) / size)
  const newPage = currentPage.value > newPageCount ? newPageCount : currentPage.value
  
  updateConfig({ 
    currentPageSize: size,
    currentPage: newPage
  })
  emit('page-size-change', size)
  msg.success(`已设置每页显示 ${size} 条`)
}

const handleJump = () => {
  if (jumpPage.value >= 1 && jumpPage.value <= pageCount.value) {
    handlePageChange(jumpPage.value)
    msg.success(`已跳转到第 ${jumpPage.value} 页`)
  } else {
    msg.warning(`页码应在 1-${pageCount.value} 之间`)
  }
}

const handleToggleShowTotal = (show: boolean) => {
  updateConfig({ showTotal: show })
}

const handlePositionChange = (newPosition: string) => {
  updateConfig({ position: newPosition as any })
  msg.success(`已设置分页位置为${newPosition === 'top' ? '顶部' : newPosition === 'bottom' ? '底部' : '两端'}`)
}
</script>

<style scoped>
.pagination-bar {
  padding: 16px;
  background: white;
  border-top: 1px solid #e8e8e8;
}

.pagination-menu {
  min-width: 200px;
  padding: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  font-size: 12px;
}

.menu-item span {
  color: #666;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .pagination-bar {
    padding: 12px;
  }
  
  .menu-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
