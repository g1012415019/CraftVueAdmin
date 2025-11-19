<template>
  <div class="filter-list-settings">
    <n-form label-placement="left" label-width="100px" size="small">
      
      <!-- 功能说明 -->
      <n-card title="筛选列表" size="small" class="mb-1">
        <n-alert v-if="showInfoTip" type="info" :show-icon="false" style="margin-bottom: 16px;" closable @close="showInfoTip = false">
          将所选字段选项以列表的形式显示在表格顶部，帮助用户快速筛选和查看记录。支持多字段组合筛选，提升数据查找效率。
        </n-alert>
        
        <div style="display: flex; flex-direction: column; gap: 6px; width: 100%;">
          <div style="display: flex; align-items: flex-start; min-height: 32px; width: 100%;">
            <span style="font-size: 12px; color: #666; width: 80px; flex-shrink: 0; padding-top: 6px;">选择字段</span>
            <div style="flex: 1; width: 0;">
              <n-select
                :value="selectedFieldKeys"
                multiple
                :options="fieldOptions"
                placeholder="选择要显示筛选的字段"
                size="small"
                style="width: 100%;"
                max-tag-count="responsive"
                filterable
                :show-checkmark="false"
                @update:value="updateSelectedFields"
              >
                <template #empty>
                  <div style="padding: 12px; text-align: center;">
                    <n-text depth="3">暂无可选字段</n-text>
                  </div>
                </template>
              </n-select>
            </div>
          </div>
        </div>
      </n-card>

      <!-- 已选择的筛选字段 -->
      <n-card v-if="formState.filters && formState.filters.length > 0" size="small" class="mb-1">
        <template #header>
          <div style="display: flex; align-items: center; justify-content: between; width: 100%;">
            <span>筛选字段配置</span>
            <div style="display: flex; align-items: center; gap: 8px; margin-left: auto;">
              <n-button 
                size="tiny" 
                text 
                @click="showHelp = !showHelp"
                :type="showHelp ? 'primary' : 'default'"
              >
                <template #icon>
                  <n-icon>
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M11,18H13V16H11V18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,6A4,4 0 0,0 8,12H10A2,2 0 0,1 12,10A2,2 0 0,1 14,12C14,13 13,13.5 12,15H10C10,12.5 11,12 12,11A4,4 0 0,0 12,6Z"/>
                    </svg>
                  </n-icon>
                </template>
                {{ showHelp ? '隐藏说明' : '操作说明' }}
              </n-button>
            </div>
          </div>
        </template>

        <!-- 操作说明 -->
        <n-collapse-transition :show="showHelp">
          <n-alert v-if="showHelpTip" type="info" style="margin-bottom: 12px;" :show-icon="false" closable @close="showHelpTip = false">
            <div style="font-size: 13px; line-height: 1.6;">
              <div style="font-weight: 600; margin-bottom: 8px;">📋 操作说明</div>
              <div style="margin-bottom: 6px;">• <strong>点击字段名</strong>：可重命名字段显示名称</div>
              <div style="margin-bottom: 6px;">• <strong>拖拽排序</strong>：按住拖拽图标可调整字段顺序</div>
              <div style="margin-bottom: 6px;">• <strong>批量操作</strong>：勾选字段后可批量设置类型和位置</div>
              <div style="margin-bottom: 12px;">• <strong>编辑配置</strong>：点击编辑按钮可详细配置字段属性</div>
            </div>
          </n-alert>
        </n-collapse-transition>
        
        <!-- 批量操作 -->
        <div class="batch-actions">
          <n-space size="small" align="center">
            <n-checkbox 
              :checked="selectedKeys.length === formState.filters.length && formState.filters.length > 0"
              :indeterminate="selectedKeys.length > 0 && selectedKeys.length < formState.filters.length"
              @update:checked="handleSelectAll"
            >
              全选
            </n-checkbox>
            <n-divider vertical />
            <template v-if="selectedKeys.length > 0">
              <n-text depth="3" style="font-size: 12px;">
                已选择 {{ selectedKeys.length }} 项
              </n-text>
              <n-select
                v-model:value="batchFilterType"
                size="tiny"
                style="width: 100px;"
                :options="filterTypeOptions"
                placeholder="批量类型"
                @update:value="batchSetFilterType"
              />
              <n-button size="tiny" type="error" @click="batchDelete">
                <template #icon>
                  <n-icon>
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                    </svg>
                  </n-icon>
                </template>
                删除
              </n-button>
            </template>
          </n-space>
        </div>
        
        <div class="filter-list">
          <div 
            v-for="(field, index) in formState.filters" 
            :key="field.key"
            class="filter-field-item"
            draggable="true"
            @dragstart="handleDragStart(index)"
            @dragover.prevent
            @drop="handleDrop(index)"
          >
            <div class="field-content">
              <div class="field-header">
                <div class="field-left">
                  <n-checkbox 
                    :checked="selectedKeys.includes(field.key)"
                    @update:checked="(checked) => handleSelectField(field.key, checked)"
                    @click.stop
                  />
                  <n-icon size="14" class="drag-handle">
                    <svg viewBox="0 0 24 24">
                      <path fill="currentColor" d="M9 3h2v2H9V3zm4 0h2v2h-2V3zM9 7h2v2H9V7zm4 0h2v2h-2V7zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z"/>
                    </svg>
                  </n-icon>
                  <n-input
                    v-if="editingLabel === field.key"
                    v-model:value="field.label"
                    size="small"
                    style="width: 120px;"
                    @blur="editingLabel = null"
                    @keyup.enter="editingLabel = null"
                    @click.stop
                    autofocus
                  />
                  <n-text 
                    v-else
                    strong 
                    style="cursor: pointer;"
                    @click.stop="editingLabel = field.key"
                  >
                    {{ field.label }}
                  </n-text>
                  <n-tag 
                    size="small" 
                    type="default"
                    style="margin-left: 6px;"
                  >
                    {{ getFilterTypeLabel(field.type) }}
                  </n-tag>
                </div>
                <div class="field-actions">
                  <n-button 
                    size="tiny" 
                    text 
                    @click.stop="toggleEdit(field.key)"
                    :type="editingField === field.key ? 'primary' : 'default'"
                  >
                    <template #icon>
                      <n-icon>
                        <svg v-if="editingField === field.key" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
                        </svg>
                        <svg v-else viewBox="0 0 24 24">
                          <path fill="currentColor" d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"/>
                        </svg>
                      </n-icon>
                    </template>
                    {{ editingField === field.key ? '收起' : '编辑' }}
                  </n-button>
                  <n-button 
                    size="tiny" 
                    type="error" 
                    text 
                    @click.stop="removeField(field.key)"
                  >
                    <template #icon>
                      <n-icon>
                        <svg viewBox="0 0 24 24">
                          <path fill="currentColor" d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"/>
                        </svg>
                      </n-icon>
                    </template>
                    删除
                  </n-button>
                </div>
              </div>
              
              <!-- 编辑面板 -->
              <div v-if="editingField === field.key" class="field-edit-panel" @click.stop>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 8px;">
                  <div>
                    <div style="display: flex; align-items: center; height: 24px; margin-bottom: 2px;">
                      <span style="font-size: 12px; color: #666; width: 60px;">筛选类型</span>
                      <n-select
                        v-model:value="field.type"
                        :options="filterTypeOptions"
                        size="small"
                        style="flex: 1;"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-card>

    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, withDefaults, defineProps, defineEmits } from 'vue'
import type { FilterListConfig } from '../../types/components/filterSection'
import type { TableColumn } from '../../types/table/column'
import { debounce } from '../../utils/debounce'
import { ConfigManager } from '../../utils/configManager'

// ==================== 类型定义 ====================

interface Props {
  initialConfig?: Partial<FilterListConfig>
  columns?: TableColumn[]
}

// ==================== 组件定义 ====================

const props = withDefaults(defineProps<Props>(), {
  initialConfig: () => ({}),
  columns: () => []
})

const emit = defineEmits<{
  configChange: [config: FilterListConfig]
}>()

// ==================== 组件内状态 ====================

const formState = ref<FilterListConfig>({
  // 使用 ConfigManager 提供的默认值
  ...ConfigManager.getFilterListDefaults(),
  
  // 合并Props传入的初始配置
  ...props.initialConfig
})

// 显示各种提示
const showInfoTip = ref(true)
const showHelpTip = ref(true)
const showHelp = ref(false)

// 编辑状态
const editingField = ref<string | null>(null)
const editingLabel = ref<string | null>(null)

// 批量选择
const selectedKeys = ref<string[]>([])
const batchFilterType = ref<string | null>(null)

// ==================== 计算属性 ====================

const fieldOptions = computed(() => {
  return props.columns.map(col => ({
    label: col.title || col.key,
    value: col.key
  }))
})

const selectedFieldKeys = computed(() => {
  return formState.value.filters?.map(f => f.key) || []
})

// ==================== 常量定义 ====================

const filterTypeOptions = [
  { label: '文本框', value: 'input' },
  { label: '下拉选择', value: 'select' },
  { label: '日期选择', value: 'date' },
  { label: '日期范围', value: 'daterange' },
  { label: '数字输入', value: 'number' }
]

// ==================== 工具函数 ====================

const emitConfigChange = debounce(() => {
  const configCopy = { ...formState.value }
  emit('configChange', configCopy)
}, 300)

const updateSelectedFields = (fieldKeys: string[]) => {
  const newFilters = fieldKeys.map(fieldKey => {
    const existingFilter = formState.value.filters?.find(f => f.key === fieldKey)
    const field = props.columns.find(col => col.key === fieldKey)
    
    return existingFilter || {
      field: fieldKey,
      label: field?.title || fieldKey,
      type: 'input' as const,
      position: "basic" ,
      options: []
    }
  })
  
  formState.value.filters = newFilters
}

const removeField = (fieldKey: string) => {
  if (!formState.value.filters) return
  
  const index = formState.value.filters.findIndex(f => f.key === fieldKey)
  if (index >= 0) {
    formState.value.filters.splice(index, 1)
  }
}

// 处理单个字段选择
const handleSelectField = (key: string, checked: boolean) => {
  if (checked) {
    if (!selectedKeys.value.includes(key)) {
      selectedKeys.value.push(key)
    }
  } else {
    const index = selectedKeys.value.indexOf(key)
    if (index > -1) {
      selectedKeys.value.splice(index, 1)
    }
  }
}

// 处理全选
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    selectedKeys.value = formState.value.filters?.map(f => f.key) || []
  } else {
    selectedKeys.value = []
  }
}

// 批量删除
const batchDelete = () => {
  selectedKeys.value.forEach(key => {
    removeField(key)
  })
  selectedKeys.value = []
}

// 获取筛选类型标签
const getFilterTypeLabel = (filterType: string) => {
  const typeMap: Record<string, string> = {
    input: '文本',
    number: '数字',
    date: '日期',
    daterange: '日期范围',
    select: '下拉',
    checkbox: '复选',
    radio: '单选',
    switch: '开关'
  }
  return typeMap[filterType] || filterType
}

// 批量设置筛选类型
const batchSetFilterType = (filterType: string) => {
  if (filterType && formState.value.filters) {
    formState.value.filters.forEach(field => {
      if (selectedKeys.value.includes(field.key)) {
        field.type = filterType as any
      }
    })
    batchFilterType.value = null
  }
}

// 切换编辑状态
const toggleEdit = (fieldKey: string) => {
  editingField.value = editingField.value === fieldKey ? null : fieldKey
}

// 拖拽功能
let draggedIndex = -1

const handleDragStart = (index: number) => {
  draggedIndex = index
}

const handleDrop = (dropIndex: number) => {
  if (draggedIndex === -1 || draggedIndex === dropIndex || !formState.value.filters) return
  
  const draggedItem = formState.value.filters[draggedIndex]
  formState.value.filters.splice(draggedIndex, 1)
  formState.value.filters.splice(dropIndex, 0, draggedItem)
  
  draggedIndex = -1
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
.mb-1 {
  margin-bottom: 12px;
}

.batch-actions {
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 12px;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.filter-field-item {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fafbfc;
  padding: 6px 8px;
  cursor: move;
  transition: all 0.2s;
}

.filter-field-item:hover {
  border-color: #d0d0d0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.field-content {
  width: 100%;
  cursor: pointer;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 20px;
}

.field-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.drag-handle {
  color: #999;
  cursor: move;
}

.field-actions {
  display: flex;
  gap: 4px;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.filter-field-item:hover .field-actions {
  opacity: 1;
}

.field-actions .n-button {
  min-width: 60px;
}

.field-edit-panel {
  padding-top: 6px;
  border-top: 1px solid #e8e8e8;
  margin-top: 6px;
}
</style>
