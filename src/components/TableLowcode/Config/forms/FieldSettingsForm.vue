<template>
  <div class="field-settings-form">
    <n-form label-placement="left" label-width="70px" size="small">
      
      <!-- 字段管理 -->
      <div class="config-section">
        <div class="section-header">
          <div class="section-title">字段管理</div>
          <div class="help-toggle">
            <n-switch v-model:value="showHelp" size="small" />
            <span>显示帮助</span>
          </div>
        </div>
        
        <!-- 批量操作 -->
        <div class="batch-actions" style="margin-top: 12px;">
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
              已显示 {{ visibleFieldsCount }} / {{ filteredFields.length }} 个字段
            </n-text>
          </n-space>
        </div>
        
        <div v-if="showHelp" class="help-section">
          <div class="help-item">
            <strong>批量操作：</strong>先用复选框选择字段，再点击按钮批量显示或隐藏
          </div>
          <div class="help-item">
            <strong>搜索字段：</strong>快速查找需要设置的字段
          </div>
        </div>
        
        <!-- 搜索框 -->
        <n-input
          v-model:value="searchKeyword"
          placeholder="输入字段名称搜索"
          size="small"
          clearable
          style="margin-top: 12px;"
        >
          <template #prefix>
            <n-icon>
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            </n-icon>
          </template>
        </n-input>
        
        <!-- 字段列表 -->
        <div class="field-list" style="margin-top: 8px;">
          <div v-if="filteredFields.length > 0">
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
                <span style="width: 40px;">状态</span>
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
                      v-model:checked="field.selected" 
                      size="small"
                      @click.stop
                    />
                    <n-icon size="14" class="drag-handle">
                      <svg viewBox="0 0 24 24">
                        <path fill="currentColor" d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z"/>
                      </svg>
                    </n-icon>
                    <div class="field-name-area" style="width: 120px;">
                      <n-input
                        v-if="editingLabel === field.key"
                        v-model:value="field.title"
                        size="small"
                        placeholder="输入备注名"
                        @blur="editingLabel = null"
                        @keyup.enter="editingLabel = null"
                        @click.stop
                        autofocus
                      />
                      <n-text 
                        v-else
                        strong 
                        style="display: block; font-size: 13px; cursor: pointer; padding: 4px 0;"
                        @dblclick.stop="editingLabel = field.key"
                      >
                        {{ field.title || field.key }}
                      </n-text>
                    </div>
                  </div>
                  <div class="field-controls">
                    <div class="control-item" style="width: 70px;">
                      <n-input-number 
                        v-model:value="field.width" 
                        size="small" 
                        :min="50" 
                        :max="500" 
                        :step="10"
                        @click.stop
                      />
                    </div>
                    <div class="control-item" style="width: 70px;">
                      <n-select 
                        v-model:value="field.align" 
                        size="small"
                        :options="alignOptions"
                        @click.stop
                      />
                    </div>
                    <div class="control-item" style="width: 40px;">
                      <n-switch 
                        v-model:value="field.fixed" 
                        size="small" 
                        @click.stop
                      />
                    </div>
                    <div class="control-item" style="width: 40px;">
                      <n-switch 
                        v-model:value="field.sortable" 
                        size="small"
                        @click.stop
                      />
                    </div>
                    <div class="control-item" style="width: 40px;">
                      <n-switch 
                        :value="formState.visibility?.[field.key] !== false"
                        size="small"
                        @update:value="toggleFieldVisibility(field.key)"
                        @click.stop
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 无列列表样式 -->
          <div v-else-if="formState.fields && formState.fields.length === 0" class="empty-fields">
            <n-empty 
              description="暂无字段配置"
              size="small"
            >
              <template #icon>
                <n-icon size="48" color="#d9d9d9">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z"/>
                  </svg>
                </n-icon>
              </template>
              <template #extra>
                <n-text depth="3" style="font-size: 12px;">
                  请先配置表格列信息
                </n-text>
              </template>
            </n-empty>
          </div>
          
          <!-- 搜索无结果 -->
          <div v-else class="empty-state">
            <n-empty description="未找到匹配的字段" size="small" />
          </div>
        </div>
        
        <!-- 隐藏字段预览 -->
        <div v-if="hiddenFields.length > 0" class="config-section">
          <div class="section-title">隐藏字段预览</div>
          <n-alert type="warning" :show-icon="false">
            <div style="font-size: 12px;">
              以下字段将对用户隐藏：{{ hiddenFields.map(f => f.title || f.key).join('、') }}
            </div>
          </n-alert>
        </div>
      </div>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, withDefaults, defineProps, defineEmits } from 'vue'
import type { FieldSettingsConfig } from '../../types/config/fieldSettings'
import type { TableColumn } from '../../types/table/column'
import { debounce } from '../../utils/debounce'
import { ConfigManager } from '../../utils/configManager'

// ==================== 类型定义 ====================

interface Props {
  initialConfig?: Partial<FieldSettingsConfig>
  columns?: TableColumn[]
}

// ==================== 组件定义 ====================

const props = withDefaults(defineProps<Props>(), {
  initialConfig: () => ({}),
  columns: () => []
})

const emit = defineEmits<{
  configChange: [config: FieldSettingsConfig]
}>()

// ==================== 组件内状态 ====================

const formState = ref<FieldSettingsConfig>({
  // 使用 ConfigManager 提供的默认值
  ...ConfigManager.getFieldSettingsDefaults(),
  // 初始化字段配置
  fields: props.columns.map(col => ({ ...col, selected: false })) || [],
  
  // 合并Props传入的初始配置
  ...props.initialConfig
})

// 其他状态
const showHelp = ref(false)
const searchKeyword = ref('')
const editingLabel = ref<string | null>(null)
const batchAction = ref<string | null>(null)
const dragStartIndex = ref<number>(-1)

// ==================== 计算属性 ====================

const filteredFields = computed(() => {
  if (!searchKeyword.value) return formState.value.fields || []
  
  return formState.value.fields?.filter(field => 
    (field.title || field.key).toLowerCase().includes(searchKeyword.value.toLowerCase())
  ) || []
})

const selectedFieldsCount = computed(() => {
  return formState.value.fields?.filter(field => field.selected).length || 0
})

const visibleFieldsCount = computed(() => {
  return formState.value.fields?.filter(field => 
    formState.value.visibility?.[field.key] !== false
  ).length || 0
})

const isAllSelected = computed(() => {
  return filteredFields.value.length > 0 && 
         filteredFields.value.every(field => field.selected)
})

const isIndeterminate = computed(() => {
  const selectedCount = filteredFields.value.filter(field => field.selected).length
  return selectedCount > 0 && selectedCount < filteredFields.value.length
})

const hiddenFields = computed(() => {
  return formState.value.fields?.filter(field => 
    formState.value.visibility?.[field.key] === false
  ) || []
})

// ==================== 常量定义 ====================

const alignOptions = [
  { label: '左', value: 'left' },
  { label: '中', value: 'center' },
  { label: '右', value: 'right' }
]

const batchActionOptions = [
  { label: '显示选中', value: 'show' },
  { label: '隐藏选中', value: 'hide' },
  { label: '启用排序', value: 'sort' },
  { label: '禁用排序', value: 'unsort' }
]

// ==================== 工具函数 ====================

const emitConfigChange = debounce(() => {
  const configCopy = { ...formState.value }
  emit('configChange', configCopy)
}, 300)

const toggleFieldVisibility = (fieldKey: string) => {
  if (!formState.value.visibility) {
    formState.value.visibility = {}
  }
  formState.value.visibility[fieldKey] = !formState.value.visibility[fieldKey]
}

const handleSelectAll = (checked: boolean) => {
  filteredFields.value.forEach(field => {
    field.selected = checked
  })
}

const handleBatchAction = (action: string) => {
  const selectedFields = formState.value.fields?.filter(field => field.selected) || []
  
  selectedFields.forEach(field => {
    switch (action) {
      case 'show':
        if (!formState.value.visibility) formState.value.visibility = {}
        formState.value.visibility[field.key] = true
        break
      case 'hide':
        if (!formState.value.visibility) formState.value.visibility = {}
        formState.value.visibility[field.key] = false
        break
      case 'sort':
        field.sortable = true
        break
      case 'unsort':
        field.sortable = false
        break
    }
    field.selected = false
  })
  
  batchAction.value = null
}

const handleDragStart = (index: number) => {
  dragStartIndex.value = index
}

const handleDrop = (dropIndex: number) => {
  if (dragStartIndex.value === -1 || dragStartIndex.value === dropIndex) return
  
  const fields = [...(formState.value.fields || [])]
  const draggedField = fields[dragStartIndex.value]
  fields.splice(dragStartIndex.value, 1)
  fields.splice(dropIndex, 0, draggedField)
  
  formState.value.fields = fields
  dragStartIndex.value = -1
}

// ==================== 生命周期 ====================

onMounted(() => {
  emitConfigChange()
})

watch(
  () => formState.value,
  () => {
    emitConfigChange()
  },
  { deep: true }
)
</script>

<style scoped>
.field-settings {
  font-size: 13px;
  padding: 12px;
}

.config-section {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header .section-title {
  margin-bottom: 0;
  flex: 1;
}

.help-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #666;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  align-items: center;
}

.config-grid .n-form-item {
  margin-bottom: 0;
}

.full-width {
  grid-column: 1 / -1;
}

.help-section {
  margin-top: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #18a058;
}

.help-item {
  font-size: 12px;
  line-height: 1.4;
  margin-bottom: 4px;
  color: #666;
}

.help-item:last-child {
  margin-bottom: 0;
}

.help-item strong {
  color: #333;
}

.batch-actions {
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 12px;
}

.field-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: #f5f5f5;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
  margin-bottom: 4px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.field-item {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fafbfc;
  padding: 8px;
  cursor: move;
  transition: all 0.2s;
}

.field-item:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.field-content {
  width: 100%;
}

.field-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.field-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.drag-handle {
  color: #999;
  cursor: move;
}

.field-controls {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  justify-content: flex-end;
}

.control-item {
  display: flex;
  align-items: center;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

:deep(.n-form-item) {
  margin: 0;
  padding: 0;
  min-height: 32px;
  height: 32px;
  align-items: center;
  display: flex;
}

:deep(.n-form-item-label) {
  font-size: 13px;
  min-width: 100px !important;
  width: 100px;
  white-space: nowrap;
  line-height: 1.4;
  padding: 0 12px 0 0;
  margin: 0;
  height: 32px;
  display: flex;
  align-items: center;
  color: #333;
}

:deep(.n-form-item-blank) {
  min-height: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  flex: 1;
}

:deep(.n-input), :deep(.n-select) {
  font-size: 13px;
  min-height: 28px;
  height: 28px;
}

:deep(.field-list::-webkit-scrollbar) {
  width: 4px;
}

:deep(.field-list::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.field-list::-webkit-scrollbar-thumb) {
  background: #d9d9d9;
  border-radius: 2px;
}
</style>