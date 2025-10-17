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
                v-model:value="selectedFields"
                multiple
                :options="fieldOptions"
                placeholder="选择要显示筛选的字段"
                size="small"
                style="width: 100%;"
                max-tag-count="responsive"
                filterable
                :show-checkmark="false"
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
      <n-card v-if="selectedFields.length > 0" size="small" class="mb-1">
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
              
              <div style="font-weight: 600; margin-bottom: 8px;">🏷️ 标签说明</div>
              <div style="margin-bottom: 6px;">• <n-tag size="small" type="default">文本</n-tag> 筛选器类型（文本框、下拉选择等）</div>
              <div style="margin-bottom: 6px;">• <n-tag size="small" type="info">基础</n-tag> 显示在表格上方的筛选栏中</div>
              <div style="margin-bottom: 12px;">• <n-tag size="small" type="warning">高级</n-tag> 显示在高级筛选抽屉中，可与基础共存</div>
              
              <div style="font-weight: 600; margin-bottom: 8px;">⚡ 筛选类型</div>
              <div style="margin-bottom: 4px;">• <strong>文本框</strong>：支持精准匹配、大小写敏感、多关键词搜索</div>
              <div style="margin-bottom: 4px;">• <strong>数字输入</strong>：数值范围筛选</div>
              <div style="margin-bottom: 4px;">• <strong>日期选择</strong>：单个日期或日期范围筛选</div>
              <div style="margin-bottom: 4px;">• <strong>下拉选择</strong>：预设选项，支持单选或多选</div>
              <div>• <strong>复选/单选/开关</strong>：快速状态筛选</div>
            </div>
          </n-alert>
        </n-collapse-transition>
        <!-- 批量操作 -->
        <div class="batch-actions">
          <n-space size="small" align="center">
            <n-checkbox 
              :checked="selectedKeys.length === selectedFieldsConfig.length && selectedFieldsConfig.length > 0"
              :indeterminate="selectedKeys.length > 0 && selectedKeys.length < selectedFieldsConfig.length"
              @update:checked="handleSelectAll"
            >
              全选
            </n-checkbox>
            <n-divider vertical />
            <template v-if="selectedKeys.length > 0">
              <n-text depth="3" style="font-size: 12px;">
                已选择 {{ selectedKeys.length }} 项
              </n-text>
              <n-button size="tiny" @click="batchSetAdvanced(true)">
                设为高级筛选
              </n-button>
              <n-button size="tiny" @click="batchSetAdvanced(false)">
                设为基础筛选
              </n-button>
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
            v-for="(field, index) in selectedFieldsConfig" 
            :key="field.key"
            class="filter-field-item"
            draggable="true"
            @dragstart="handleDragStart(index)"
            @dragover.prevent
            @drop="handleDrop(index)"
          >
            <div 
              class="field-content"
              @click="toggleEdit(field.key)"
            >
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
                    {{ getFilterTypeLabel(field.filterType) }}
                  </n-tag>
                  <n-tag 
                    size="small" 
                    type="info"
                    style="margin-left: 4px;"
                  >
                    基础
                  </n-tag>
                  <n-tag 
                    v-if="field.advancedFilter" 
                    size="small" 
                    type="warning"
                    style="margin-left: 4px;"
                  >
                    高级
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
              <div v-if="editingField === field.key" class="field-edit-panel">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px 8px;">
                  <div>
                    <div style="display: flex; align-items: center; height: 24px; margin-bottom: 2px;">
                      <span style="font-size: 12px; color: #666; width: 60px;">筛选类型</span>
                      <n-select
                        v-model:value="field.filterType"
                        :options="filterTypeOptions"
                        size="small"
                        style="flex: 1;"
                      />
                    </div>
                  </div>
                  <div v-if="!['input', 'number', 'date', 'switch'].includes(field.filterType)">
                    <div style="display: flex; align-items: center; height: 24px; margin-bottom: 2px;">
                      <span style="font-size: 12px; color: #666; width: 60px;">允许多选</span>
                      <n-switch v-model:value="field.allowMultiple" size="small" />
                    </div>
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; height: 24px; margin-bottom: 2px;">
                      <span style="font-size: 12px; color: #666; width: 60px;">默认值</span>
                      <n-input 
                        v-model:value="field.defaultValue" 
                        placeholder="设置默认筛选值"
                        size="small"
                        style="flex: 1;"
                      />
                    </div>
                  </div>
                  <div>
                    <div style="display: flex; align-items: center; height: 24px; margin-bottom: 2px;">
                      <span style="font-size: 12px; color: #666; width: 60px;">高级筛选</span>
                      <n-switch v-model:value="field.advancedFilter" size="small" />
                    </div>
                  </div>
                  <div v-if="['input', 'number'].includes(field.filterType)" style="grid-column: 1 / -1;">
                    <div style="display: flex; align-items: center; height: 24px; margin-bottom: 2px;">
                      <span style="font-size: 12px; color: #666; width: 60px;">占位符</span>
                      <n-input 
                        v-model:value="field.placeholder" 
                        placeholder="请输入提示文字"
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

      <!-- 预览效果 -->
      <n-card v-if="selectedFields.length > 0" title="预览效果" size="small" class="mb-1">
        
        <n-alert v-if="showPreviewTip" type="success" :show-icon="false" closable @close="showPreviewTip = false">
          <div style="line-height: 1.6;">
            <div style="margin-bottom: 12px;">
              <strong>当前配置：</strong>包含 {{ selectedFields.length }} 个筛选字段：
              {{ selectedFieldsConfig.map(f => f.label).join('、') }}
            </div>
            <div style="font-size: 12px; color: #666;">
              💡 提示：基础筛选显示在表格上方，高级筛选可通过"高级筛选"按钮打开抽屉操作
            </div>
          </div>
        </n-alert>
      </n-card>

    </n-form>
  </div>
</template>

<script setup lang="tsx">
import { ref, computed, watch, inject } from 'vue';

// 注入配置
const config = inject('tableConfig') as any

// 显示帮助面板
const showHelp = ref(false);

// 显示各种提示
const showInfoTip = ref(true);
const showHelpTip = ref(true);
const showPreviewTip = ref(true);

// 选中的字段
const selectedFields = ref<string[]>([]);

// 可选字段选项
const fieldOptions = [
  { label: '姓名', value: 'name' },
  { label: '状态', value: 'status' },
  { label: '类型', value: 'type' },
  { label: '部门', value: 'department' },
  { label: '创建人', value: 'creator' },
  { label: '优先级', value: 'priority' },
  { label: '标签', value: 'tags' },
  { label: '地区', value: 'region' },
  { label: '分类', value: 'category' },
  { label: '年龄', value: 'age' },
  { label: '性别', value: 'gender' },
  { label: '职位', value: 'position' },
  { label: '薪资', value: 'salary' },
  { label: '入职时间', value: 'joinDate' },
  { label: '工作经验', value: 'experience' },
  { label: '技能', value: 'skills' },
  { label: '学历', value: 'education' },
  { label: '联系电话', value: 'phone' },
  { label: '邮箱', value: 'email' },
  { label: '地址', value: 'address' }
];

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
];

// 显示位置选项
const positionOptions = [
  { label: '表格顶部', value: 'top' },
  { label: '左侧边栏', value: 'left' },
  { label: '右侧边栏', value: 'right' },
];

// 选中字段的配置
const selectedFieldsConfig = ref<Array<{
  key: string;
  label: string;
  filterType: string;
  position: string;
  sortOrder: number;
  defaultExpanded: boolean;
  allowMultiple: boolean;
  advancedFilter: boolean;
  defaultValue: string;
  placeholder: string;
  required: boolean;
  realTimeFilter: boolean;
}>>([]);

// 监听 config 变化，初始化配置
watch(() => config?.value, (newConfig) => {
  if (newConfig?.filters) {
    selectedFieldsConfig.value = newConfig.filters.selectedFieldsConfig || []
    selectedFields.value = selectedFieldsConfig.value.map(f => f.key)
  }
}, { immediate: true })

// 监听选中字段变化
watch(selectedFields, (newFields) => {
  // 添加新字段配置
  newFields.forEach(fieldKey => {
    if (!selectedFieldsConfig.value.find(f => f.key === fieldKey)) {
      const fieldOption = fieldOptions.find(f => f.value === fieldKey);
      selectedFieldsConfig.value.push({
        key: fieldKey,
        label: fieldOption?.label || fieldKey,
        filterType: 'input', // 默认为文本框
        position: 'top',
        sortOrder: selectedFieldsConfig.value.length + 1,
        defaultExpanded: true,
        allowMultiple: false,
        advancedFilter: false,
        defaultValue: '',
        placeholder: '',
        required: false,
        realTimeFilter: false
      });
    }
  });

  // 移除不再选中的字段配置
  selectedFieldsConfig.value = selectedFieldsConfig.value.filter(f => 
    newFields.includes(f.key)
  );
}, { deep: true })

// 监听配置变化，更新到全局配置
watch([selectedFieldsConfig], () => {
  if (config?.value) {
    if (!config.value.filters) {
      config.value.filters = {}
    }
    config.value.filters.enableFilterList = selectedFields.value.length > 0
    config.value.filters.selectedFieldsConfig = selectedFieldsConfig.value
  }
}, { deep: true, immediate: true })

// 移除字段
const removeField = (fieldKey: string) => {
  selectedFields.value = selectedFields.value.filter(key => key !== fieldKey);
};

// 编辑状态
const editingField = ref<string | null>(null)
const editingLabel = ref<string | null>(null)

// 批量选择
const selectedKeys = ref<string[]>([])

// 批量操作
const batchFilterType = ref<string | null>(null)

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
    selectedKeys.value = selectedFieldsConfig.value.map(f => f.key)
  } else {
    selectedKeys.value = []
  }
}

// 批量设置高级筛选
const batchSetAdvanced = (isAdvanced: boolean) => {
  selectedFieldsConfig.value.forEach(field => {
    if (selectedKeys.value.includes(field.key)) {
      field.advancedFilter = isAdvanced
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

// 批量设置筛选类型
const batchSetFilterType = (filterType: string) => {
  if (filterType) {
    selectedFieldsConfig.value.forEach(field => {
      if (selectedKeys.value.includes(field.key)) {
        field.filterType = filterType
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
  if (draggedIndex === -1 || draggedIndex === dropIndex) return
  
  const draggedItem = selectedFieldsConfig.value[draggedIndex]
  selectedFieldsConfig.value.splice(draggedIndex, 1)
  selectedFieldsConfig.value.splice(dropIndex, 0, draggedItem)
  
  draggedIndex = -1
}
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

.field-item:hover .field-actions {
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

.description {
  font-size: 11px;
  color: #999;
  display: block;
  margin-top: 4px;
}
</style>
