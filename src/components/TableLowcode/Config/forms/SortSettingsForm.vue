<template>
  <div class="sort-settings">
    <n-space direction="vertical" size="large">
      
      <!-- 自定义排序 -->
      <div class="sort-section">
        <div class="section-header">
          <n-text class="section-title">自定义排序</n-text>
          <n-button size="tiny" type="primary" @click="addCustomSort">
            <template #icon>
              <n-icon><PlusIcon /></n-icon>
            </template>
            添加
          </n-button>
        </div>
        
        <div v-if="formState.customFields && formState.customFields.length > 0" class="sort-list">
          <draggable 
            v-model="formState.customFields" 
            item-key="key"
            handle=".drag-handle"
            @change="handleDragChange"
          >
            <template #item="{ element, index }">
              <div class="sort-item">
                <div class="drag-handle">
                  <n-icon><DragIcon /></n-icon>
                </div>
                
                <n-select
                  v-model:value="element.key"
                  :options="availableFieldOptions"
                  size="small"
                  style="width: 120px"
                  placeholder="选择字段"
                  @update:value="updateFieldKey(index, $event)"
                />
                
                <n-select
                  v-model:value="element.defaultOrder"
                  :options="orderOptions"
                  size="small"
                  style="width: 80px"
                  placeholder="方向"
                />
                
                <n-button size="tiny" type="error" @click="removeCustomSort(index)">
                  <template #icon>
                    <n-icon><DeleteIcon /></n-icon>
                  </template>
                </n-button>
              </div>
            </template>
          </draggable>
        </div>
        
        <div v-else class="empty-state">
          <n-text depth="3">暂无自定义排序，点击"添加"按钮创建</n-text>
        </div>
      </div>

      <n-divider />

      <!-- 默认排序 -->
      <div class="sort-section">
        <div class="section-header">
          <n-text class="section-title">默认排序</n-text>
          <n-text depth="3" style="font-size: 12px;">无自定义排序时生效</n-text>
        </div>
        
        <n-space>
          <n-select
            v-model:value="formState.defaultField"
            :options="availableFieldOptions"
            size="small"
            style="width: 120px"
            placeholder="选择字段"
            clearable
          />
          <n-select
            v-model:value="formState.defaultDirection"
            :options="orderOptions"
            size="small"
            style="width: 80px"
            placeholder="方向"
          />
        </n-space>
      </div>

      <n-divider />

      <!-- 排序选项 -->
      <div class="sort-section">
        <n-checkbox v-model:checked="formState.multiSort">
          支持多列排序
        </n-checkbox>
      </div>

    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { PlusOutlined as PlusIcon, DeleteOutlined as DeleteIcon, DragOutlined as DragIcon } from '@vicons/antd'
import draggable from 'vuedraggable'
import type { SortConfig, SortableField } from '../../types'
import { ConfigManager } from '../../utils/configManager'

// ==================== 组件定义 ====================

const props = defineProps<{
  config?: SortConfig
  availableFields?: Array<{ label: string; value: string; type?: string }>
}>()

const emit = defineEmits<{
  'config-change': [config: SortConfig]
}>()

// ==================== 表单状态 ====================

const formState = ref<SortConfig>({
  ...ConfigManager.getSortDefaults(),
  ...props.config
})

// ==================== 计算属性 ====================

const availableFieldOptions = computed(() => 
  props.availableFields?.map(field => ({
    label: field.label,
    value: field.value
  })) || []
)

const orderOptions = [
  { label: '升序', value: 'asc' },
  { label: '降序', value: 'desc' }
]

// ==================== 自定义排序操作 ====================

const addCustomSort = () => {
  if (!formState.value.customFields) {
    formState.value.customFields = []
  }
  
  const newField: SortableField = {
    key: '',
    label: '',
    defaultOrder: 'asc',
    sortType: 'text'
  }
  
  formState.value.customFields.push(newField)
}

const removeCustomSort = (index: number) => {
  if (formState.value.customFields) {
    formState.value.customFields.splice(index, 1)
  }
}

const updateFieldKey = (index: number, fieldKey: string) => {
  if (formState.value.customFields && formState.value.customFields[index]) {
    const field = props.availableFields?.find(f => f.value === fieldKey)
    if (field) {
      formState.value.customFields[index].key = fieldKey
      formState.value.customFields[index].label = field.label
      formState.value.customFields[index].sortType = field.type as any || 'text'
    }
  }
}

const handleDragChange = () => {
  // 拖拽完成后触发配置更新
  emitConfigChange()
}

// ==================== 配置更新 ====================

const emitConfigChange = () => {
  emit('config-change', { ...formState.value })
}

// ==================== 监听配置变化 ====================

watch(
  formState,
  () => {
    emitConfigChange()
  },
  { deep: true }
)

watch(
  () => props.config,
  (newConfig) => {
    if (newConfig) {
      Object.assign(formState.value, newConfig)
    }
  },
  { deep: true }
)
</script>

<style scoped>
.sort-settings {
  padding: 20px;
}

.sort-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.sort-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sort-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fafafa;
}

.drag-handle {
  cursor: move;
  color: #999;
  display: flex;
  align-items: center;
}

.drag-handle:hover {
  color: #666;
}

.empty-state {
  padding: 20px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background: #fafafa;
}

.sortable-ghost {
  opacity: 0.5;
}

.sortable-chosen {
  background: #e6f7ff;
}

@media (max-width: 768px) {
  .sort-settings {
    padding: 16px;
  }
  
  .sort-item {
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>
