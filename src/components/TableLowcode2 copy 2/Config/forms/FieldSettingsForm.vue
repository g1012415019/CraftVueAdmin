<template>
  <div class="field-settings">
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
              :options="[
                { label: '显示选中', value: 'show' },
                { label: '隐藏选中', value: 'hide' },
                { label: '固定选中', value: 'fix' },
                { label: '取消固定', value: 'unfix' },
                { label: '启用排序', value: 'sort' },
                { label: '禁用排序', value: 'unsort' }
              ]"
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
                      v-model:value="field.aliasName"
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
                      {{ field.aliasName || field.label }}
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
                      :options="[
                        { label: '左', value: 'left' },
                        { label: '中', value: 'center' },
                        { label: '右', value: 'right' }
                      ]"
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
                      v-model:value="field.visible" 
                      size="small"
                      @update:value="updateFieldVisibility(field.key, $event)"
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

      <!-- 隐藏字段预览 -->
      <div v-if="hiddenFields.length > 0" class="config-section">
        <div class="section-title">隐藏字段预览</div>
        <n-alert type="warning" :show-icon="false">
          <div style="font-size: 12px;">
            以下字段将对用户隐藏：{{ hiddenFields.map(f => f.label).join('、') }}
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

// 编辑状态
const editingLabel = ref<string | null>(null);

// 批量操作
const batchAction = ref<string | null>(null);

// 初始化字段配置
const initFieldConfig = () => {
  if (!config.value.columns) {
    config.value.columns = [
      { key: 'id', label: 'ID', aliasName: '', width: 80, align: 'left', fixed: false, sortable: true, visible: false, selected: false },
      { key: 'name', label: '姓名', aliasName: '', width: 120, align: 'left', fixed: false, sortable: true, visible: true, selected: false },
      { key: 'age', label: '年龄', aliasName: '', width: 80, align: 'center', fixed: false, sortable: true, visible: true, selected: false },
      { key: 'email', label: '邮箱', aliasName: '', width: 200, align: 'left', fixed: false, sortable: false, visible: true, selected: false },
      { key: 'phone', label: '电话', aliasName: '', width: 140, align: 'left', fixed: false, sortable: false, visible: true, selected: false },
      { key: 'department', label: '部门', aliasName: '', width: 120, align: 'left', fixed: false, sortable: true, visible: true, selected: false },
      { key: 'status', label: '状态', aliasName: '', width: 100, align: 'center', fixed: false, sortable: true, visible: true, selected: false },
      { key: 'createTime', label: '创建时间', aliasName: '', width: 160, align: 'center', fixed: false, sortable: true, visible: false, selected: false },
      { key: 'updateTime', label: '更新时间', aliasName: '', width: 160, align: 'center', fixed: false, sortable: true, visible: false, selected: false },
      { key: 'avatar', label: '头像', aliasName: '', width: 80, align: 'center', fixed: false, sortable: false, visible: true, selected: false },
      { key: 'address', label: '地址', aliasName: '', width: 200, align: 'left', fixed: false, sortable: false, visible: true, selected: false },
      { key: 'remark', label: '备注', aliasName: '', width: 200, align: 'left', fixed: false, sortable: false, visible: false, selected: false },
    ];
  }
};

// 初始化配置
initFieldConfig();

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
    (field.key && field.key.toLowerCase().includes(keyword)) ||
    (field.aliasName && field.aliasName.toLowerCase().includes(keyword))
  );
});

// 可见字段数量
const visibleFieldsCount = computed(() => {
  return filteredFields.value.filter(field => field.visible).length;
});

// 选中字段数量
const selectedFieldsCount = computed(() => {
  return filteredFields.value.filter(field => field.selected).length;
});

// 隐藏的字段
const hiddenFields = computed(() => {
  return fieldList.value.filter(field => !field.visible);
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

// 更新字段可见性
const updateFieldVisibility = (fieldKey: string, visible: boolean) => {
  const field = fieldList.value.find(f => f.key === fieldKey);
  if (field) {
    field.visible = visible;
  }
};

// 全部显示
const showAllFields = () => {
  const selectedFields = filteredFields.value.filter(field => field.selected);
  if (selectedFields.length === 0) {
    window.$message?.warning('请先选择要操作的字段');
    return;
  }
  selectedFields.forEach(field => {
    field.visible = true;
  });
  window.$message?.success(`已显示 ${selectedFields.length} 个字段`);
};

// 全部隐藏
const hideAllFields = () => {
  const selectedFields = filteredFields.value.filter(field => field.selected);
  if (selectedFields.length === 0) {
    window.$message?.warning('请先选择要操作的字段');
    return;
  }
  selectedFields.forEach(field => {
    field.visible = false;
  });
  window.$message?.success(`已隐藏 ${selectedFields.length} 个字段`);
};

// 处理批量操作
const handleBatchAction = (action: string) => {
  const selectedFields = filteredFields.value.filter(field => field.selected);
  
  switch (action) {
    case 'show':
      selectedFields.forEach(field => field.visible = true);
      window.$message?.success(`已显示 ${selectedFields.length} 个字段`);
      break;
    case 'hide':
      selectedFields.forEach(field => field.visible = false);
      window.$message?.success(`已隐藏 ${selectedFields.length} 个字段`);
      break;
    case 'fix':
      selectedFields.forEach(field => field.fixed = true);
      window.$message?.success(`已固定 ${selectedFields.length} 个字段`);
      break;
    case 'unfix':
      selectedFields.forEach(field => field.fixed = false);
      window.$message?.success(`已取消固定 ${selectedFields.length} 个字段`);
      break;
    case 'sort':
      selectedFields.forEach(field => field.sortable = true);
      window.$message?.success(`已启用 ${selectedFields.length} 个字段的排序`);
      break;
    case 'unsort':
      selectedFields.forEach(field => field.sortable = false);
      window.$message?.success(`已禁用 ${selectedFields.length} 个字段的排序`);
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

// 批量设置宽度
const batchSetWidth = () => {
  const width = window.prompt('请输入宽度值 (50-500):', '120');
  if (!width || isNaN(Number(width))) return;
  
  const widthNum = Number(width);
  if (widthNum < 50 || widthNum > 500) {
    window.$message?.warning('宽度值应在 50-500 之间');
    return;
  }
  
  const selectedFields = filteredFields.value.filter(field => field.selected);
  selectedFields.forEach(field => {
    field.width = widthNum;
  });
  window.$message?.success(`已设置 ${selectedFields.length} 个字段的宽度`);
};

// 批量设置对齐
const batchSetAlign = () => {
  const align = window.prompt('请输入对齐方式 (left/center/right):', 'left');
  if (!align || !['left', 'center', 'right'].includes(align)) {
    window.$message?.warning('请输入正确的对齐方式: left, center, right');
    return;
  }
  
  const selectedFields = filteredFields.value.filter(field => field.selected);
  selectedFields.forEach(field => {
    field.align = align;
  });
  window.$message?.success(`已设置 ${selectedFields.length} 个字段的对齐方式`);
};

// 批量设置固定
const batchSetFixed = (fixed: boolean) => {
  const selectedFields = filteredFields.value.filter(field => field.selected);
  selectedFields.forEach(field => {
    field.fixed = fixed;
  });
  window.$message?.success(`已${fixed ? '固定' : '取消固定'} ${selectedFields.length} 个字段`);
};

// 批量设置排序
const batchSetSortable = (sortable: boolean) => {
  const selectedFields = filteredFields.value.filter(field => field.selected);
  selectedFields.forEach(field => {
    field.sortable = sortable;
  });
  window.$message?.success(`已${sortable ? '启用' : '禁用'} ${selectedFields.length} 个字段的排序`);
};
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
