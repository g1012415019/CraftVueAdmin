<template>
  <div class="sort-settings-form">
    <div class="section-header">
      <n-text class="section-title">排序字段</n-text>
      <n-text depth="3">设置表格的默认排序规则</n-text>
    </div>

    <!-- 已添加的排序字段 -->
    <div class="sort-fields">
      <div 
        v-for="(field, index) in localConfig.customFields" 
        :key="`${field.key}-${index}`"
        class="sort-item"
        draggable="true"
        @dragstart="handleDragStart(index)"
        @dragover.prevent
        @drop="handleDrop(index)"
      >
        <span class="drag-handle">⋮⋮</span>
        <span class="field-name">{{ field.label }}</span>
        
        <n-select
          v-model:value="field.defaultOrder"
          :options="sortOrderOptions"
          size="small"
          style="width: 120px;"
          @update:value="emitChange"
        />
        
        <n-button 
          size="small" 
          quaternary 
          @click="removeSortField(index)"
        >
          删除
        </n-button>
      </div>
      <!-- 添加新字段 -->
      <div v-if="availableFieldOptions.length > 0" class="add-item">
        <n-select
          v-model:value="selectedNewField"
          :options="availableFieldOptions"
          placeholder="添加排序字段..."
          clearable
          @update:value="addSortField"
        />
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="localConfig.customFields &&localConfig.customFields.length === 0" class="empty">
      <n-text depth="3">暂无排序字段</n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { SortConfig,SortableField } from '../../types'
import { ConfigManager } from '../../utils/configManager'


// Props & Emits
const props = defineProps<{
  initialConfig:SortableField,
  columns?: Array<{ label: string; key: string; type?: string }>
}>()


const emit = defineEmits<{
  'config-change': [config: SortConfig]
}>()


const localConfig = ref<SortConfig>({
  ...ConfigManager.getSortDefaults(),
  ...props.initialConfig
})

// 选中的新字段
const selectedNewField = ref<string>('')

// 拖拽状态
const dragIndex = ref<number>(-1)

// 排序方向选项
const sortOrderOptions = [
  { label: '升序 (A→Z)', value: 'asc' },
  { label: '降序 (Z→A)', value: 'desc' }
]

// 可用字段选项
const availableFieldOptions = computed(() => {
  if (!props.columns) return []
  
  const usedFieldKeys = localConfig.value.customFields?.map(f => f.key) || []
 
  
  return props.columns
    .filter(col => !usedFieldKeys.includes(col.key))
    .map(col => ({
      label: col.label,
      value: col.key
    }))
})

// 添加排序字段
const addSortField = (fieldKey: string | null) => {
  if (!fieldKey || !props.columns) return
  
  const column = props.columns.find(col => col.key === fieldKey)

  if (!column) return
  
  const newField: SortableField = {
    key: column.key,
    label: column.label,
    defaultOrder: 'asc',
    sortType: 'text' // 默认为文本类型
  }
  

  
  if (!localConfig.value.customFields) {
    localConfig.value.customFields = []
  }
  
  localConfig.value.customFields.push(newField)
  selectedNewField.value = ''
  emitChange()
}

// 删除排序字段
const removeSortField = (index: number) => {
  if (localConfig.value.customFields) {
    localConfig.value.customFields.splice(index, 1)
    emitChange()
  }
}

// 发送配置变更
const emitChange = () => {
  console.log(localConfig,'localConfig')
  emit('config-change', { ...localConfig.value })
}

// 拖拽处理
const handleDragStart = (index: number) => {
  dragIndex.value = index
}

const handleDrop = (dropIndex: number) => {
  if (dragIndex.value === -1 || dragIndex.value === dropIndex) return
  
  const fields = localConfig.value.customFields
  if (!fields) return
  
  const draggedItem = fields[dragIndex.value]
  fields.splice(dragIndex.value, 1)
  fields.splice(dropIndex, 0, draggedItem)
  
  dragIndex.value = -1
  emitChange()
}

// 监听变化
watch(localConfig, emitChange, { deep: true })
</script>

<style lang="scss" scoped>
.sort-settings-form {
  padding: 0px;
}

.section-header {
  margin-bottom: 16px;
  
  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
  }
}

.sort-fields {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sort-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border: 1px solid #e0e0e6;
  border-radius: 4px;
  cursor: move;
  
  &:hover {
    border-color: #18a058;
  }
  
  .drag-handle {
    color: #999;
    cursor: grab;
    user-select: none;
    
    &:active {
      cursor: grabbing;
    }
  }
  
  .field-name {
    flex: 1;
    font-weight: 500;
  }
}
  
  .field-name {
    flex: 1;
    font-weight: 500;
  }


.add-item {
  padding: 6px 8px;
  border: 1px dashed #d0d0d6;
  border-radius: 4px;
}

.empty {
  text-align: center;
  padding: 32px;
  color: #999;
}
</style>
