<template>
  <div class="field-settings">
    <n-form label-placement="left" label-width="100px" size="small">
      
      <!-- 字段管理 -->
      <n-card title="字段管理" size="small" class="mb-1">
        <n-alert type="info" :show-icon="false" style="margin-bottom: 16px; font-size: 12px;">
          设置此视图下的表单中需要对用户隐藏的字段
        </n-alert>
        
        <n-grid :cols="1" :y-gap="12">
          <n-gi>
            <n-form-item label="搜索字段">
              <n-input
                v-model:value="searchKeyword"
                placeholder="输入字段名称搜索"
                size="small"
                clearable
              >
                <template #prefix>
                  <n-icon>
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
          </n-gi>
          
          <n-gi>
            <div class="batch-actions">
              <n-space>
                <n-button size="small" @click="showAllFields">全显示</n-button>
                <n-button size="small" @click="hideAllFields">全隐藏</n-button>
                <n-text depth="3" style="font-size: 12px;">
                  已显示 {{ visibleFieldsCount }} / {{ filteredFields.length }} 个字段
                </n-text>
              </n-space>
            </div>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 字段列表 -->
      <n-card title="字段列表" size="small" class="mb-1">
        <div class="field-list">
          <div 
            v-for="field in filteredFields" 
            :key="field.key" 
            class="field-item"
          >
            <n-switch 
              v-model:value="field.visible" 
              size="small"
              @update:value="updateFieldVisibility(field.key, $event)"
            />
            <span class="field-name">{{ field.label }}</span>
          </div>
        </div>
        
        <div v-if="filteredFields.length === 0" class="empty-state">
          <n-empty description="未找到匹配的字段" size="small" />
        </div>
      </n-card>

      <!-- 隐藏字段预览 -->
      <n-card v-if="hiddenFields.length > 0" title="隐藏字段预览" size="small">
        <n-alert type="warning" :show-icon="false">
          <div style="font-size: 12px;">
            以下字段将对用户隐藏：{{ hiddenFields.map(f => f.label).join('、') }}
          </div>
        </n-alert>
      </n-card>

    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// 搜索关键词
const searchKeyword = ref('');

// 字段数据
const fieldList = ref([
  { key: 'id', label: 'ID', type: '数字', visible: false, description: '记录唯一标识符' },
  { key: 'name', label: '姓名', type: '文本', visible: true, description: '用户姓名' },
  { key: 'age', label: '年龄', type: '数字', visible: true, description: '用户年龄' },
  { key: 'email', label: '邮箱', type: '文本', visible: true, description: '用户邮箱地址' },
  { key: 'phone', label: '电话', type: '文本', visible: true, description: '联系电话' },
  { key: 'department', label: '部门', type: '选择', visible: true, description: '所属部门' },
  { key: 'status', label: '状态', type: '选择', visible: true, description: '用户状态' },
  { key: 'createTime', label: '创建时间', type: '日期', visible: false, description: '记录创建时间' },
  { key: 'updateTime', label: '更新时间', type: '日期', visible: false, description: '最后更新时间' },
  { key: 'avatar', label: '头像', type: '图片', visible: true, description: '用户头像' },
  { key: 'address', label: '地址', type: '文本', visible: true, description: '联系地址' },
  { key: 'remark', label: '备注', type: '文本', visible: false, description: '备注信息' },
]);

// 过滤后的字段
const filteredFields = computed(() => {
  if (!searchKeyword.value) return fieldList.value;
  
  const keyword = searchKeyword.value.toLowerCase();
  return fieldList.value.filter(field => 
    field.label.toLowerCase().includes(keyword) ||
    field.key.toLowerCase().includes(keyword) ||
    field.type.toLowerCase().includes(keyword)
  );
});

// 可见字段数量
const visibleFieldsCount = computed(() => {
  return filteredFields.value.filter(field => field.visible).length;
});

// 隐藏的字段
const hiddenFields = computed(() => {
  return fieldList.value.filter(field => !field.visible);
});

// 获取字段类型颜色
const getFieldTypeColor = (type: string) => {
  const colorMap = {
    '文本': 'default',
    '数字': 'info',
    '日期': 'success',
    '选择': 'warning',
    '图片': 'error',
  };
  return colorMap[type] || 'default';
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
  filteredFields.value.forEach(field => {
    field.visible = true;
  });
  window.$message?.success('已显示所有字段');
};

// 全部隐藏
const hideAllFields = () => {
  filteredFields.value.forEach(field => {
    field.visible = false;
  });
  window.$message?.success('已隐藏所有字段');
};
</script>

<style scoped>
.field-settings {
  font-size: 13px;
  padding: 4px;
}

.mb-1 {
  margin-bottom: 12px;
}

.batch-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-list {
  max-height: 400px;
  overflow-y: auto;
}

.field-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid #f0f0f0;
}

.field-item:last-child {
  border-bottom: none;
}

.field-item:hover {
  background: #f8f9fa;
}

.field-name {
  font-size: 13px;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
}

:deep(.n-card) {
  border-radius: 6px;
  border: 1px solid #e0e0e6;
}

:deep(.n-card-header) {
  padding: 12px 16px 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  background: #fafafa;
  border-bottom: 1px solid #e0e0e6;
}

:deep(.n-card__content) {
  padding: 16px;
  background: white;
}

:deep(.n-form-item) {
  margin: 0;
  min-height: 32px;
  align-items: center;
}

:deep(.n-form-item-label) {
  font-size: 13px;
  color: #333;
  white-space: nowrap;
}

:deep(.n-input), :deep(.n-select) {
  font-size: 13px;
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
