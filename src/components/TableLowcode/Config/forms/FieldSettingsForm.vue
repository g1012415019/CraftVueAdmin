<template>
  <div class="field-settings">
    <div class="section-header">
      <n-text class="section-title">字段管理</n-text>
      <n-text depth="3">配置表格列的显示、宽度、对齐等属性</n-text>
    </div>

    <!-- 批量操作 -->
    <div class="batch-actions">
      <n-space>
        <n-checkbox 
          :checked="isAllSelected"
          :indeterminate="isIndeterminate"
          @update:checked="handleSelectAll"
          size="small"
        >
          全选
        </n-checkbox>
        <n-select
          v-model:value="batchAction"
          size="small"
          style="width: 120px;"
          placeholder="批量操作"
          :options="batchActionOptions"
          @update:value="handleBatchAction"
          :disabled="selectedFieldsCount === 0"
        />
        <n-text depth="3" style="font-size: 12px;">
          已显示 {{ visibleFieldsCount }} / {{ fieldList.length }} 个字段
        </n-text>
      </n-space>
    </div>

    <!-- 搜索框 -->
    <div class="search-section">
      <n-input
        v-model:value="searchKeyword"
        placeholder="输入字段名称搜索"
        size="small"
        clearable
      >
        <template #prefix>
          <n-icon>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </n-icon>
        </template>
      </n-input>
    </div>

    <!-- 字段列表 -->
    <div class="field-list">
      <!-- 表头 -->
      <div class="field-header-row">
        <div class="header-left">
          <span style="width: 120px;">字段名 / 备注名</span>
        </div>
        <div class="header-controls">
          <span style="width: 70px;">宽度</span>
          <span style="width: 70px;">对齐</span>
          <span style="width: 40px;">固定</span>
          <span style="width: 40px;">排序</span>
          <span style="width: 40px;">显示</span>
        </div>
      </div>
      
      <div 
        v-for="(field, index) in filteredFields" 
        :key="field.key" 
        class="field-item"
        draggable="true"
        @dragstart="handleDragStart(index)"
        @dragover.prevent
        @drop="handleDrop(index)"
      >
        <div class="field-content">
          <div class="field-row">
            <div class="field-left">
              <n-checkbox 
                :checked="field.selected ?? false"
                @update:checked="(val) => field.selected = val"
                size="small"
                @click.stop
              />
              <span class="drag-handle">⋮⋮</span>
              <div class="field-name-area">
                <n-input
                  v-if="editingLabel === field.key"
                  v-model:value="field.label"
                  size="small"
                  placeholder="输入字段名"
                  @blur="editingLabel = null"
                  @keyup.enter="editingLabel = null"
                  @click.stop
                  autofocus
                />
                <n-text 
                  v-else
                  strong 
                  style="cursor: pointer; padding: 4px 0;"
                  @mouseenter="editingLabel = field.key"
                  @click.stop
                >
                  {{ field.label }}
                </n-text>
              </div>
            </div>
            <div class="field-controls">
              <div class="control-item">
                <n-input-number 
                  v-model:value="field.width" 
                  size="small" 
                  :min="50" 
                  :max="500" 
                  :step="10"
                  @click.stop
                />
              </div>
              <div class="control-item">
                <n-select 
                  v-model:value="field.align" 
                  size="small"
                  :options="alignOptions"
                  @click.stop
                />
              </div>
              <div class="control-item">
                <n-select 
                  :value="field.fixed || 'none'"
                  @update:value="(val) => field.fixed = val === 'none' ? false : val"
                  size="small"
                  :options="[
                    { label: '无', value: 'none' },
                    { label: '左', value: 'left' },
                    { label: '右', value: 'right' }
                  ]"
                  @click.stop
                />
              </div>
              <div class="control-item">
                <n-switch 
                  :value="field.sortable ?? false"
                  @update:value="(val) => field.sortable = val"
                  size="small"
                  @click.stop
                />
              </div>
              <div class="control-item">
                <n-switch 
                  :value="field.visible ?? true"
                  @update:value="(val) => field.visible = val"
                  size="small"
                  @click.stop
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="filteredFields.length === 0" class="empty-state">
      <n-empty description="未找到匹配的字段" size="small" />
    </div>

    <!-- 隐藏字段预览 -->
    <div v-if="hiddenFields.length > 0" class="hidden-preview">
      <n-text class="preview-title">隐藏字段预览</n-text>
      <div class="preview-content">
        以下字段将对用户隐藏：{{ hiddenFields.map(f => f.label).join('、') }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FieldSettingsConfig, TableColumn } from '../../types'
import { ConfigManager } from '../../utils/configManager'

const props = defineProps<{
  initialConfig?: Partial<FieldSettingsConfig>
  columns?: TableColumn[]
}>()

const emit = defineEmits<{
  'config-change': [config: FieldSettingsConfig]
}>()

// 本地配置状态
const localConfig = ref<FieldSettingsConfig>({
  ...ConfigManager.getFieldSettingsDefaults(),
  ...props.initialConfig
})

// 字段列表 - 基于 columns prop 和配置合并
const fieldList = ref<TableColumn[]>([])

// 初始化字段列表
const initFields = () => {
  if (props.columns?.length) {
    fieldList.value = props.columns.map(col => ({
      ...col,
      selected: false,
      visible: localConfig.value.visibility?.[col.key] ?? col.visible ?? true,
      sortable: col.sortable ?? false,
      fixed: col.fixed ?? false
    }))
  }
}

// 初始化
initFields()

// 搜索关键词
const searchKeyword = ref('')

// 编辑状态
const editingLabel = ref<string | null>(null)

// 批量操作
const batchAction = ref<string | null>(null)

// 批量操作选项
const batchActionOptions = [
  { label: '显示选中', value: 'show' },
  { label: '隐藏选中', value: 'hide' },
  { label: '固定选中', value: 'fix' },
  { label: '取消固定', value: 'unfix' },
  { label: '启用排序', value: 'sort' },
  { label: '禁用排序', value: 'unsort' }
]

// 对齐选项
const alignOptions = [
  { label: '左', value: 'left' },
  { label: '中', value: 'center' },
  { label: '右', value: 'right' }
]

// 初始化字段配置
if (!localConfig.value.fields?.length && props.columns?.length) {
  localConfig.value.fields = props.columns.map(col => ({
    ...col,
    selected: false,
    width: col.width || 120,
    align: col.align || 'left',
    fixed: col.fixed || false,
    sortable: col.sortable || false
  }))
}

// 过滤后的字段
const filteredFields = computed(() => {
  if (!searchKeyword.value || !fieldList.value.length) {
    return fieldList.value
  }
  return fieldList.value.filter(field => 
    field.label.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    field.key.toLowerCase().includes(searchKeyword.value.toLowerCase())
  )
})

// 选中字段数量
const selectedFieldsCount = computed(() => {
  return fieldList.value.filter(f => f.selected).length
})

// 可见字段数量
const visibleFieldsCount = computed(() => {
  return fieldList.value.filter(f => f.visible).length
})

// 隐藏字段
const hiddenFields = computed(() => {
  return fieldList.value.filter(f => !f.visible)
})

// 全选状态
const isAllSelected = computed(() => {
  return fieldList.value.length > 0 && fieldList.value.every(f => f.selected)
})

// 半选状态
const isIndeterminate = computed(() => {
  const selectedCount = selectedFieldsCount.value
  const totalCount = fieldList.value.length
  return selectedCount > 0 && selectedCount < totalCount
})

// 处理全选
const handleSelectAll = (checked: boolean) => {
  fieldList.value.forEach(field => {
    field.selected = checked
  })
}

// 处理批量操作
const handleBatchAction = (action: string) => {
  const selectedFields = fieldList.value.filter(f => f.selected)
  
  selectedFields.forEach(field => {
    switch (action) {
      case 'show':
        field.visible = true
        break
      case 'hide':
        field.visible = false
        break
      case 'fix':
        field.fixed = 'left'
        break
      case 'unfix':
        field.fixed = false
        break
      case 'sort':
        field.sortable = true
        break
      case 'unsort':
        field.sortable = false
        break
    }
  })
  
  batchAction.value = null
  updateConfig()
}

// 拖拽功能
let draggedIndex = -1

const handleDragStart = (index: number) => {
  draggedIndex = index
}

const handleDrop = (dropIndex: number) => {
  if (draggedIndex === -1 || draggedIndex === dropIndex) return
  
  const draggedItem = fieldList.value[draggedIndex]
  fieldList.value.splice(draggedIndex, 1)
  fieldList.value.splice(dropIndex, 0, draggedItem)
  
  draggedIndex = -1
  updateConfig()
}

// 更新配置
const updateConfig = () => {
  localConfig.value.fields = [...fieldList.value]
  localConfig.value.visibility = {}
  localConfig.value.order = []
  
  fieldList.value.forEach((field, index) => {
    localConfig.value.visibility![field.key] = field.visible ?? true
    localConfig.value.order!.push(field.key)
  })
  
  emitChange()
}

// 发送配置变更
const emitChange = () => {
  emit('config-change', { ...localConfig.value })
}

// 监听字段变化
watch(() => fieldList.value, updateConfig, { deep: true })
</script>

<style lang="scss" scoped>
.field-settings {
  padding: 16px;
}

.section-header {
  margin-bottom: 16px;
  
  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
  }
}

.batch-actions {
  margin-bottom: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
}

.search-section {
  margin-bottom: 12px;
}

.field-list {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  overflow: hidden;
}

.field-header-row {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  background: #f5f5f5;
  border-bottom: 1px solid #e8e8e8;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  
  .header-left {
    display: flex;
    align-items: center;
    flex: 1;
  }
  
  .header-controls {
    display: flex;
    gap: 12px;
  }
}

.field-item {
  border-bottom: 1px solid #f0f0f0;
  cursor: move;
  
  &:hover {
    background: #fafafa;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

.field-content {
  padding: 8px 12px;
}

.field-row {
  display: flex;
  align-items: center;
}

.field-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.drag-handle {
  color: #999;
  cursor: grab;
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
}

.field-name-area {
  width: 120px;
}

.field-controls {
  display: flex;
  gap: 12px;
}

.control-item {
  width: 70px;
  
  &:nth-child(3),
  &:nth-child(4),
  &:nth-child(5) {
    width: 40px;
  }
}

.empty-state {
  text-align: center;
  padding: 40px;
}

.hidden-preview {
  margin-top: 16px;
  padding: 12px;
  background: #fff7e6;
  border: 1px solid #ffd591;
  border-radius: 4px;
  
  .preview-title {
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .preview-content {
    font-size: 12px;
    color: #666;
  }
}
</style>
