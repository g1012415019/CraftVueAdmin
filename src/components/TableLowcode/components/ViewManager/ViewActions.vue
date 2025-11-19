<template>
  <div class="view-actions">
    <!-- 添加视图按钮 -->
    <n-tooltip trigger="hover" placement="bottom">
      <template #trigger>
        <n-button 
          size="tiny" 
          quaternary 
          @click="handleAddView" 
          :disabled="!canAddView"
        >
          <template #icon>
            <n-icon size="14"><PlusIcon /></n-icon>
          </template>
        </n-button>
      </template>
      {{ tooltipText }}
    </n-tooltip>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { PlusOutlined as PlusIcon } from '@vicons/antd'

// ==================== 组件定义 ====================

const props = defineProps<{
  viewCount?: number
  maxViews?: number
}>()

const emit = defineEmits<{
  'add-view': []
}>()

// ==================== 计算属性 ====================

const maxViewCount = computed(() => 
  props.maxViews || 8
)

const currentViewCount = computed(() => 
  props.viewCount || 0
)

const canAddView = computed(() => 
  currentViewCount.value < maxViewCount.value
)

const tooltipText = computed(() => 
  canAddView.value 
    ? '添加视图' 
    : `视图数量已达上限 (${currentViewCount.value}/${maxViewCount.value})`
)

// ==================== 事件处理 ====================

const handleAddView = () => {
  if (canAddView.value) {
    emit('add-view')
  }
}
</script>

<style scoped>
.view-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
