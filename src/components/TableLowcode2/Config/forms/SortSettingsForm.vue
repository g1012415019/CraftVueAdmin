<template>
  <div class="sort-settings">
    <n-form label-placement="left" label-width="70px" size="small">
      
      <!-- 排序管理 -->
      <div class="config-section">
        <div class="section-header">
          <div class="section-title">排序管理</div>
          <div class="help-toggle">
            <n-switch v-model:value="showHelp" size="small" />
            <span>显示帮助</span>
          </div>
        </div>
        <div class="config-grid">
          <n-form-item label="启用排序" class="full-width">
            <n-switch v-model:value="enableSort" size="small" />
          </n-form-item>
          
          <n-form-item label="排序模式" class="full-width" v-if="enableSort">
            <n-radio-group v-model:value="sortMode" size="small">
              <n-space>
                <n-radio value="single">单字段</n-radio>
                <n-radio value="multiple">多字段</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          
          <n-form-item label="默认排序" class="full-width">
            <n-space>
              <n-select
                v-model:value="defaultSortField"
                :options="defaultSortFieldOptions"
                size="small"
                style="width: 120px;"
                placeholder="选择字段"
              />
              <n-select
                v-model:value="defaultSortOrder"
                :options="getSortOrderOptions(defaultSortField)"
                size="small"
                style="width: 100px;"
                placeholder="排序方向"
              />
            </n-space>
          </n-form-item>
        </div>
        
        <div v-if="showHelp" class="help-section">
          <div class="help-item">
            <strong>启用排序：</strong>是否允许用户对表格进行排序
          </div>
          <div class="help-item">
            <strong>排序模式：</strong>单字段只能按一个字段排序，多字段可按多个字段排序
          </div>
          <div class="help-item">
            <strong>默认排序：</strong>表格初始加载时的排序规则
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
              :options="[
                { label: '启用排序', value: 'enable' },
                { label: '禁用排序', value: 'disable' },
                { label: '设为升序', value: 'asc' },
                { label: '设为降序', value: 'desc' }
              ]"
              @update:value="handleBatchAction"
              :disabled="selectedFieldsCount === 0"
            />
            <n-text depth="3" style="font-size: 12px;">
              已启用 {{ enabledSortCount }} / {{ filteredFields.length }} 个字段
            </n-text>
          </n-space>
        </div>
        
        <!-- 字段列表 -->
        <div class="field-list" style="margin-top: 8px;">
          <!-- 表头 -->
          <div class="field-header-row">
            <div class="header-left">
              <span style="width: 24px;"></span>
              <span style="width: 20px;"></span>
              <span style="width: 120px;">字段名</span>
            </div>
            <div class="header-controls">
              <span style="width: 80px;">排序类型</span>
              <span style="width: 100px;">默认方向</span>
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
                    <n-text strong style="display: block; font-size: 13px; cursor: pointer; padding: 4px 0;">
                      {{ field.label }}
                    </n-text>
                  </div>
                </div>
                <div class="field-controls">
                  <div class="control-item" style="width: 80px;">
                    <n-select 
                      v-model:value="field.sortType" 
                      size="small"
                      :options="sortTypeOptions"
                      @click.stop
                    />
                  </div>
                  <div class="control-item" style="width: 100px;">
                    <n-select 
                      v-model:value="field.defaultOrder" 
                      size="small"
                      :options="getFieldSortOptions(field.sortType)"
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
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div v-if="filteredFields.length === 0" class="empty-state">
          <n-empty description="未找到匹配的字段" size="small" />
        </div>
      </div>

      <!-- 排序预览 -->
      <div v-if="defaultSortField || enabledSortCount > 0" class="config-section">
        <div class="section-title">排序预览</div>
        <n-alert type="success" :show-icon="false">
          <div style="font-size: 12px;">
            {{ getFullSortPreview() }}
          </div>
        </n-alert>
      </div>

    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, inject, watch } from 'vue';

const config = inject('tableConfig') as Ref<any>;

// 搜索关键词
const searchKeyword = ref('');

// 帮助显示控制
const showHelp = ref(false);

// 批量操作
const batchAction = ref<string | null>(null);

// 排序设置
const enableSort = ref(true);
const sortMode = ref('single');
const defaultSortField = ref('createTime');
const defaultSortOrder = ref('desc');

// 初始化字段配置
const initSortConfig = () => {
  if (!config.value.columns) {
    config.value.columns = [];
  }
  
  // 确保每个字段都有排序相关属性
  config.value.columns.forEach(field => {
    if (field.sortType === undefined) field.sortType = 'text';
    if (field.defaultOrder === undefined) field.defaultOrder = 'asc';
    if (field.selected === undefined) field.selected = false;
  });
};

// 初始化配置
initSortConfig();

// 字段数据
const fieldList = ref(config.value.columns);

// 监听字段配置变化，同步到全局配置
watch(fieldList, (newFields) => {
  config.value.columns = newFields;
}, { deep: true });

// 过滤后的字段
const filteredFields = computed(() => {
  if (!searchKeyword.value) return fieldList.value;
  
  const keyword = searchKeyword.value.toLowerCase();
  return fieldList.value.filter(field => 
    (field.label && field.label.toLowerCase().includes(keyword)) ||
    (field.key && field.key.toLowerCase().includes(keyword))
  );
});

// 选中字段数量
const selectedFieldsCount = computed(() => {
  return filteredFields.value.filter(field => field.selected).length;
});

// 启用排序的字段数量
const enabledSortCount = computed(() => {
  return filteredFields.value.filter(field => field.sortable).length;
});

// 全选状态
const isAllSelected = computed(() => {
  return filteredFields.value.length > 0 && filteredFields.value.every(field => field.selected);
});

// 半选状态
const isIndeterminate = computed(() => {
  const selectedCount = filteredFields.value.filter(field => field.selected).length;
  return selectedCount > 0 && selectedCount < filteredFields.value.length;
});

// 处理全选
const handleSelectAll = (checked: boolean) => {
  filteredFields.value.forEach(field => {
    field.selected = checked;
  });
};

// 处理批量操作
const handleBatchAction = (action: string) => {
  const selectedFields = filteredFields.value.filter(field => field.selected);
  
  switch (action) {
    case 'enable':
      selectedFields.forEach(field => field.sortable = true);
      window.$message?.success(`已启用 ${selectedFields.length} 个字段的排序`);
      break;
    case 'disable':
      selectedFields.forEach(field => field.sortable = false);
      window.$message?.success(`已禁用 ${selectedFields.length} 个字段的排序`);
      break;
    case 'asc':
      selectedFields.forEach(field => field.defaultOrder = 'asc');
      window.$message?.success(`已设置 ${selectedFields.length} 个字段为升序`);
      break;
    case 'desc':
      selectedFields.forEach(field => field.defaultOrder = 'desc');
      window.$message?.success(`已设置 ${selectedFields.length} 个字段为降序`);
      break;
  }
  
  // 重置选择
  batchAction.value = null;
};

// 拖拽功能
let draggedIndex = -1;

const handleDragStart = (index: number) => {
  draggedIndex = index;
};

const handleDrop = (dropIndex: number) => {
  if (draggedIndex === -1 || draggedIndex === dropIndex) return;
  
  // 获取实际的字段对象
  const draggedField = filteredFields.value[draggedIndex];
  const dropField = filteredFields.value[dropIndex];
  
  // 在原始数据中找到对应的索引
  const originalDragIndex = fieldList.value.findIndex(f => f.key === draggedField.key);
  const originalDropIndex = fieldList.value.findIndex(f => f.key === dropField.key);
  
  // 在原始数据中进行排序
  const draggedItem = fieldList.value[originalDragIndex];
  fieldList.value.splice(originalDragIndex, 1);
  fieldList.value.splice(originalDropIndex, 0, draggedItem);
  
  draggedIndex = -1;
};

const defaultSortFieldOptions = [
  { label: '创建时间', value: 'createTime', type: 'date' },
  { label: '更新时间', value: 'updateTime', type: 'date' },
  { label: '姓名', value: 'name', type: 'text' },
  { label: '年龄', value: 'age', type: 'number' },
];

const sortTypeOptions = [
  { label: '文本', value: 'text' },
  { label: '数字', value: 'number' },
  { label: '日期', value: 'date' },
];

const getSortOrderOptions = (fieldValue: string) => {
  const field = defaultSortFieldOptions.find(f => f.value === fieldValue);
  const type = field?.type || 'text';
  return getFieldSortOptions(type);
};

const getFieldSortOptions = (sortType: string) => {
  switch (sortType) {
    case 'date':
      return [
        { label: '最新在前', value: 'desc' },
        { label: '最旧在前', value: 'asc' },
      ];
    case 'number':
      return [
        { label: '大到小(9-0)', value: 'desc' },
        { label: '小到大(0-9)', value: 'asc' },
      ];
    case 'text':
      return [
        { label: '字母顺序(A-Z)', value: 'asc' },
        { label: '字母倒序(Z-A)', value: 'desc' },
      ];
    default:
      return [
        { label: '升序', value: 'asc' },
        { label: '降序', value: 'desc' },
      ];
  }
};

const getFullSortPreview = () => {
  const parts = [];
  
  if (defaultSortField.value) {
    const defaultField = defaultSortFieldOptions.find(f => f.value === defaultSortField.value);
    const orderText = defaultSortOrder.value === 'desc' ? '降序' : '升序';
    parts.push(`默认: ${defaultField?.label}(${orderText})`);
  }
  
  if (enabledSortCount.value > 0) {
    const enabledFields = fieldList.value
      .filter(f => f.sortable)
      .map(f => `${f.label}(${f.defaultOrder === 'desc' ? '降序' : '升序'})`)
      .join(', ');
    parts.push(`可排序: ${enabledFields}`);
  }
  
  return parts.join(' | ') || '无排序规则';
};
</script>

<style scoped>
.sort-settings {
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
</style>
