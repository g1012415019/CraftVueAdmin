<template>
  <div class="filter-list-settings">
    <div class="section-header">
      <n-text class="section-title">筛选列表</n-text>
      <n-text depth="3">配置表格顶部的筛选字段</n-text>
    </div>

    <!-- 功能说明 -->
    <div class="help-section">
      <div class="help-item">
        <strong>筛选列表：</strong>将所选字段选项以列表的形式显示在表格顶部，帮助用户快速筛选和查看记录
      </div>
    </div>

    <!-- 字段选择 -->
    <div class="field-selection">
      <div class="selection-label">选择字段</div>
      <n-select
        v-model:value="selectedFields"
        multiple
        :options="fieldOptions"
        placeholder="选择要显示筛选的字段"
        size="small"
        max-tag-count="responsive"
        filterable
        :show-checkmark="false"
      />
    </div>

    <!-- 已选择的筛选字段 -->
    <div v-if="selectedFields.length > 0" class="filter-config">
      <div class="config-header">
        <n-text class="config-title">筛选字段配置</n-text>
        <n-button 
          size="small" 
          text 
          @click="showHelp = !showHelp"
          :type="showHelp ? 'primary' : 'default'"
        >
          {{ showHelp ? '隐藏说明' : '操作说明' }}
        </n-button>
      </div>

      <!-- 操作说明 -->
      <div v-if="showHelp" class="help-panel">
        <div class="help-content">
          <div class="help-title">📋 操作说明</div>
          <div class="help-list">
            <div>• <strong>点击字段名</strong>：可重命名字段显示名称</div>
            <div>• <strong>拖拽排序</strong>：按住拖拽图标可调整字段顺序</div>
            <div>• <strong>批量操作</strong>：勾选字段后可批量设置类型和位置</div>
            <div>• <strong>编辑配置</strong>：点击编辑按钮可详细配置字段属性</div>
          </div>
          
          <div class="help-title">🏷️ 标签说明</div>
          <div class="help-list">
            <div>• <n-tag size="small" type="default">文本</n-tag> 筛选器类型（文本框、下拉选择等）</div>
            <div>• <n-tag size="small" type="info">基础</n-tag> 显示在表格上方的筛选栏中</div>
            <div>• <n-tag size="small" type="warning">高级</n-tag> 显示在高级筛选抽屉中</div>
          </div>
        </div>
      </div>

      <!-- 批量操作 -->
      <div class="batch-actions">
        <n-space size="small" align="center">
          <n-checkbox 
            :checked="selectedKeys.length === localConfig.filters?.length && (localConfig.filters?.length || 0) > 0"
            :indeterminate="selectedKeys.length > 0 && selectedKeys.length < (localConfig.filters?.length || 0)"
            @update:checked="handleSelectAll"
          >
            全选
          </n-checkbox>
          <n-divider vertical />
          <template v-if="selectedKeys.length > 0">
            <n-text depth="3" style="font-size: 12px;">
              已选择 {{ selectedKeys.length }} 项
            </n-text>
            <n-button size="small" @click="batchSetPosition('basic')">
              设为基础筛选
            </n-button>
            <n-button size="small" @click="batchSetPosition('advanced')">
              设为高级筛选
            </n-button>
            <n-select
              v-model:value="batchFilterType"
              size="small"
              style="width: 100px;"
              :options="filterTypeOptions"
              placeholder="批量类型"
              @update:value="batchSetFilterType"
            />
            <n-button size="small" type="error" @click="batchDelete">
              删除
            </n-button>
          </template>
        </n-space>
      </div>
      
      <!-- 字段列表 -->
      <div class="filter-list">
        <div 
          v-for="(field, index) in localConfig.filters" 
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
                <span class="drag-handle">⋮⋮</span>
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
                  @mouseenter="editingLabel = field.key"
                  @click.stop
                >
                  {{ field.label }}
                </n-text>
                <n-tag size="small" type="default">
                  {{ getFilterTypeLabel(field.type) }}
                </n-tag>
                <n-tag 
                  size="small" 
                  :type="field.position === 'basic' ? 'info' : field.position === 'advanced' ? 'warning' : 'success'"
                >
                  {{ getPositionLabel(field.position) }}
                </n-tag>
              </div>
              <div class="field-actions">
                <n-button 
                  size="small" 
                  text 
                  @click.stop="toggleEdit(field.key)"
                  :type="editingField === field.key ? 'primary' : 'default'"
                >
                  {{ editingField === field.key ? '收起' : '编辑' }}
                </n-button>
                <n-button 
                  size="small" 
                  type="error" 
                  text 
                  @click.stop="removeField(field.key)"
                >
                  删除
                </n-button>
              </div>
            </div>
            
            <!-- 编辑面板 -->
            <n-collapse-transition :show="editingField === field.key">
              <div class="field-edit-panel" @click.stop>
                <div class="edit-grid">
                <div class="edit-item">
                  <span class="edit-label">筛选类型</span>
                  <n-select
                    v-model:value="field.type"
                    :options="filterTypeOptions"
                    size="small"
                  />
                </div>
                <div class="edit-item">
                  <span class="edit-label">显示位置</span>
                  <n-select
                    v-model:value="field.position"
                    :options="positionOptions"
                    size="small"
                  />
                </div>
                <div v-if="!['input', 'number', 'date', 'switch'].includes(field.type)" class="edit-item">
                  <span class="edit-label">允许多选</span>
                  <n-switch v-model:value="field.allowMultiple" size="small" />
                </div>
                <div class="edit-item">
                  <span class="edit-label">必填</span>
                  <n-switch v-model:value="field.required" size="small" />
                </div>
                <div class="edit-item">
                  <span class="edit-label">默认值</span>
                  <!-- 文本/数字输入 -->
                  <n-input 
                    v-if="['input', 'number'].includes(field.type)"
                    v-model:value="field.defaultValue" 
                    :type="field.type === 'number' ? 'number' : 'text'"
                    placeholder="设置默认筛选值"
                    size="small"
                  />
                  <!-- 日期选择 -->
                  <n-date-picker
                    v-else-if="field.type === 'date'"
                    v-model:value="field.defaultValue"
                    type="date"
                    size="small"
                    placeholder="选择默认日期"
                  />
                  <!-- 日期范围 -->
                  <n-date-picker
                    v-else-if="field.type === 'daterange'"
                    v-model:value="field.defaultValue"
                    type="daterange"
                    size="small"
                    placeholder="选择默认日期范围"
                  />
                  <!-- 开关 -->
                  <n-switch
                    v-else-if="field.type === 'switch'"
                    v-model:value="field.defaultValue"
                    size="small"
                  />
                  <!-- 下拉选择/复选框/单选 -->
                  <n-select
                    v-else-if="['select', 'checkbox', 'radio'].includes(field.type)"
                    v-model:value="field.defaultValue"
                    :options="field.options || []"
                    :multiple="field.type === 'checkbox' || field.allowMultiple"
                    placeholder="选择默认值"
                    size="small"
                    clearable
                  />
                </div>
                <div class="edit-item">
                  <span class="edit-label">实时筛选</span>
                  <n-switch v-model:value="field.realTimeFilter" size="small" />
                </div>
                <div v-if="['input', 'number'].includes(field.type)" class="edit-item full-width">
                  <span class="edit-label">占位符</span>
                  <n-input 
                    v-model:value="field.placeholder" 
                    placeholder="请输入提示文字"
                    size="small"
                  />
                </div>
              </div>
              </div>
            </n-collapse-transition>
          </div>
        </div>
      </div>
    </div>

    <!-- 预览效果 -->
    <div v-if="selectedFields.length > 0" class="preview-section">
      <n-text class="preview-title">预览效果</n-text>
      <div class="preview-content">
        <div class="preview-info">
          <strong>当前配置：</strong>包含 {{ selectedFields.length }} 个筛选字段：
          {{ localConfig.filters?.map(f => f.label).join('、') }}
        </div>
        <div class="preview-tip">
          💡 提示：基础筛选显示在表格上方，高级筛选可通过"高级筛选"按钮打开抽屉操作
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { FilterListConfig, TableColumn } from '../../types'
import { FilterFieldConfig } from '../../types/components/filterSection'
import { ConfigManager } from '../../utils/configManager'

const props = defineProps<{
  initialConfig?: Partial<FilterListConfig>
  columns?: TableColumn[]
}>()

const emit = defineEmits<{
  'config-change': [config: FilterListConfig]
}>()

// 本地配置状态
const localConfig = ref<FilterListConfig>({
  ...ConfigManager.getFilterListDefaults(),
  ...props.initialConfig
})

// 显示帮助面板
const showHelp = ref(false)

// 选中的字段 - 从初始配置中提取
const selectedFields = ref<string[]>(
  localConfig.value.filters?.map(f => f.key) || []
)

// 可选字段选项
const fieldOptions = computed(() => {
  return props.columns?.map(col => ({
    label: col.label,
    value: col.key
  })) || []
})

// 筛选类型选项
const filterTypeOptions = [
  { label: '文本框', value: 'input' },
  { label: '数字输入', value: 'number' },
  { label: '日期选择', value: 'date' },
  { label: '日期范围', value: 'daterange' },
  { label: '下拉选择', value: 'select' },
  { label: '复选框', value: 'checkbox' },
  { label: '单选按钮', value: 'radio' },
  { label: '开关', value: 'switch' }
]

// 位置选项
const positionOptions = [
  { label: '基础筛选', value: 'basic' },
  { label: '高级筛选', value: 'advanced' },
  { label: '双重显示', value: 'both' }
]

// 编辑状态
const editingField = ref<string | null>(null)
const editingLabel = ref<string | null>(null)

// 批量选择
const selectedKeys = ref<string[]>([])
const batchFilterType = ref<string | null>(null)

// 监听选中字段变化
watch(selectedFields, (newFields) => {
  if (!localConfig.value.filters) {
    localConfig.value.filters = []
  }

  // 添加新字段配置
  newFields.forEach(fieldKey => {
    if (!localConfig.value.filters!.find(f => f.key === fieldKey)) {
      const fieldOption = props.columns?.find(c => c.key === fieldKey)
      const newFilter: FilterFieldConfig = {
        key: fieldKey,
        label: fieldOption?.label || fieldKey,
        type: 'input',
        position: 'basic',
        allowMultiple: false,
        defaultValue: '',
        placeholder: '',
        required: false,
        realTimeFilter: false
      }
      localConfig.value.filters!.push(newFilter)
    }
  })

  // 移除不再选中的字段配置
  localConfig.value.filters = localConfig.value.filters!.filter(f => 
    newFields.includes(f.key)
  )
  
  emitChange()
}, { deep: true })


// 移除字段
const removeField = (fieldKey: string) => {
  selectedFields.value = selectedFields.value.filter(key => key !== fieldKey)
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
    selectedKeys.value = localConfig.value.filters?.map(f => f.key) || []
  } else {
    selectedKeys.value = []
  }
}

// 批量设置位置
const batchSetPosition = (position: 'basic' | 'advanced' | 'both') => {
  if (!localConfig.value.filters) return
  
  localConfig.value.filters.forEach(field => {
    if (selectedKeys.value.includes(field.key)) {
      field.position = position
    }
  })
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

// 获取位置标签
const getPositionLabel = (position: string) => {
  const positionMap: Record<string, string> = {
    basic: '基础',
    advanced: '高级',
    both: '双重'
  }
  return positionMap[position] || position
}

// 批量设置筛选类型
const batchSetFilterType = (filterType: string) => {
  if (filterType && localConfig.value.filters) {
    localConfig.value.filters.forEach(field => {
      if (selectedKeys.value.includes(field.key)) {
        field.type = filterType as any
      }
    })
    batchFilterType.value = null
  }
}

// 切换编辑状态
const toggleEdit = (fieldKey: string) => {
  if (editingField.value === fieldKey) {
    editingField.value = null
  } else {
    editingField.value = fieldKey
  }
}

// 拖拽功能
let draggedIndex = -1

const handleDragStart = (index: number) => {
  draggedIndex = index
}

const handleDrop = (dropIndex: number) => {
  if (draggedIndex === -1 || draggedIndex === dropIndex || !localConfig.value.filters) return
  
  const draggedItem = localConfig.value.filters[draggedIndex]
  localConfig.value.filters.splice(draggedIndex, 1)
  localConfig.value.filters.splice(dropIndex, 0, draggedItem)
  
  draggedIndex = -1
}

// 发送配置变更
const emitChange = () => {
  emit('config-change', { ...localConfig.value })
}

// 监听配置变化
watch(() => localConfig.value, emitChange, { deep: true })

</script>

<style lang="scss" scoped>
.filter-list-settings {
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

.help-section {
  margin-bottom: 16px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #18a058;
  
  .help-item {
    font-size: 12px;
    color: #666;
  }
}

.field-selection {
  margin-bottom: 16px;
  
  .selection-label {
    font-size: 12px;
    color: #666;
    margin-bottom: 8px;
  }
}

.filter-config {
  margin-bottom: 16px;
  
  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    
    .config-title {
      font-weight: 500;
    }
  }
}

.help-panel {
  margin-bottom: 16px;
  padding: 12px;
  background: #f0f8ff;
  border-radius: 4px;
  border: 1px solid #91d5ff;
  
  .help-content {
    font-size: 13px;
    line-height: 1.6;
  }
  
  .help-title {
    font-weight: 600;
    margin-bottom: 8px;
  }
  
  .help-list {
    margin-bottom: 12px;
    
    div {
      margin-bottom: 6px;
    }
  }
}

.batch-actions {
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
  margin-bottom: 12px;
}

.filter-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-field-item {
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: #fafbfc;
  padding: 12px;
  cursor: move;
  transition: all 0.2s;
  
  &:hover {
    border-color: #18a058;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
}

.field-content {
  width: 100%;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 24px;
}

.field-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.drag-handle {
  color: #999;
  cursor: grab;
  user-select: none;
  
  &:active {
    cursor: grabbing;
  }
}

.field-actions {
  display: flex;
  gap: 8px;
}

.field-edit-panel {
  padding-top: 12px;
  border-top: 1px solid #e8e8e8;
  margin-top: 12px;
}

.edit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.edit-item {
  display: flex;
  align-items: center;
  gap: 8px;
  
  &.full-width {
    grid-column: 1 / -1;
  }
}

.edit-label {
  font-size: 12px;
  color: #666;
  width: 60px;
  flex-shrink: 0;
}

.preview-section {
  padding: 12px;
  background: #f6ffed;
  border-radius: 4px;
  border: 1px solid #b7eb8f;
  
  .preview-title {
    font-weight: 500;
    margin-bottom: 8px;
  }
  
  .preview-content {
    font-size: 13px;
    line-height: 1.6;
  }
  
  .preview-info {
    margin-bottom: 8px;
  }
  
  .preview-tip {
    font-size: 12px;
    color: #666;
  }
}
</style>
