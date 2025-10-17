<template>
  <div class="sort-settings">
    <n-form label-placement="left" label-width="100px" size="small">
      
      <!-- 默认排序 -->
      <n-card title="默认排序" size="small" class="mb-1">
        <n-alert type="info" :show-icon="false" style="margin-bottom: 12px; font-size: 12px;">
          当未设置自定义排序时，将使用此默认规则
        </n-alert>
        
        <n-grid :cols="2" :x-gap="12" :y-gap="8">
          <n-gi>
            <n-form-item label="排序字段" label-width="60px">
              <n-select
                v-model:value="defaultSortField"
                :options="defaultSortFieldOptions"
                size="small"
              />
            </n-form-item>
          </n-gi>
          <n-gi>
            <n-form-item label="排序方向" label-width="60px">
              <n-select
                v-model:value="defaultSortOrder"
                :options="getSortOrderOptions(defaultSortField)"
                size="small"
              />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 排序开关 -->
      <n-card title="排序设置" size="small" class="mb-1">
        <n-grid :cols="1" :y-gap="12">
          <n-gi>
            <n-form-item label="启用排序">
              <n-switch v-model:value="enableSort" size="small" />
            </n-form-item>
          </n-gi>
          
          <n-gi v-if="enableSort">
            <n-form-item label="排序模式">
              <n-radio-group v-model:value="sortMode" size="small">
                <n-radio-button value="single">单字段</n-radio-button>
                <n-radio-button value="multiple">多字段</n-radio-button>
              </n-radio-group>
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 可排序字段 -->
      <n-card v-if="enableSort" title="可排序字段" size="small" class="mb-1">
        <!-- 帮助按钮 -->
        <div v-if="!showHelp" class="help-button-container">
          <n-button size="small" type="info" text @click="showHelp = true">
            <template #icon>
              <n-icon>
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </n-icon>
            </template>
            说明
          </n-button>
        </div>

        <!-- 帮助面板 -->
        <div v-if="showHelp" class="help-banner">
          <div class="help-header">
            <span>字段配置说明</span>
            <n-button size="tiny" text @click="showHelp = false">×</n-button>
          </div>
          <div class="help-content">
            <div><strong>排序类型：</strong>数据类型决定排序规则</div>
            <div><strong>默认方向：</strong>该字段的初始排序方向</div>
            <div><strong>用户可排序：</strong>是否允许点击列头排序</div>
          </div>
        </div>

        <n-form-item label="选择字段">
          <n-select
            v-model:value="selectedSortFields"
            multiple
            :options="fieldOptions"
            placeholder="选择可排序的字段"
            size="small"
            max-tag-count="responsive"
          />
        </n-form-item>

        <!-- 字段配置 -->
        <div v-if="selectedSortFields.length > 0" style="margin-top: 16px;">
          <div v-for="field in sortFieldsConfig" :key="field.key" class="field-config">
            <div class="field-title">
              <span>{{ field.label }}</span>
              <n-button size="tiny" text type="error" @click="removeSortField(field.key)">移除</n-button>
            </div>
            
            <n-grid :cols="3" :x-gap="8" :y-gap="8">
              <n-gi>
                <n-form-item label="类型" label-width="30px">
                  <n-select v-model:value="field.sortType" :options="sortTypeOptions" size="small" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="方向" label-width="30px">
                  <n-select v-model:value="field.defaultOrder" :options="getFieldSortOptions(field.sortType)" size="small" />
                </n-form-item>
              </n-gi>
              <n-gi>
                <n-form-item label="用户可排序" label-width="60px">
                  <n-switch v-model:value="field.userSortable" size="small" />
                </n-form-item>
              </n-gi>
            </n-grid>
          </div>
        </div>
      </n-card>

      <!-- 排序预览 -->
      <n-card v-if="defaultSortField || (enableSort && selectedSortFields.length > 0)" title="排序预览" size="small">
        <n-text depth="2" style="font-size: 12px;">
          {{ getFullSortPreview() }}
        </n-text>
      </n-card>

    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const enableSort = ref(true);
const sortMode = ref('single');
const defaultSortField = ref('createTime');
const defaultSortOrder = ref('desc');
const showHelp = ref(false);
const selectedSortFields = ref<string[]>([]);

const defaultSortFieldOptions = [
  { label: '创建时间', value: 'createTime', type: 'date' },
  { label: '更新时间', value: 'updateTime', type: 'date' },
  { label: '姓名', value: 'name', type: 'text' },
  { label: '年龄', value: 'age', type: 'number' },
];

const fieldOptions = [
  { label: '姓名', value: 'name' },
  { label: '年龄', value: 'age' },
  { label: '状态', value: 'status' },
  { label: '部门', value: 'department' },
  { label: '分数', value: 'score' },
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

const sortFieldsConfig = ref<Array<{
  key: string;
  label: string;
  sortType: string;
  defaultOrder: string;
  userSortable: boolean;
}>>([]);

watch(selectedSortFields, (newFields) => {
  newFields.forEach(fieldKey => {
    if (!sortFieldsConfig.value.find(f => f.key === fieldKey)) {
      const fieldOption = fieldOptions.find(f => f.value === fieldKey);
      sortFieldsConfig.value.push({
        key: fieldKey,
        label: fieldOption?.label || fieldKey,
        sortType: 'text',
        defaultOrder: 'asc',
        userSortable: true,
      });
    }
  });

  sortFieldsConfig.value = sortFieldsConfig.value.filter(f => 
    newFields.includes(f.key)
  );
});

const removeSortField = (fieldKey: string) => {
  selectedSortFields.value = selectedSortFields.value.filter(key => key !== fieldKey);
};

const getFullSortPreview = () => {
  const parts = [];
  
  if (defaultSortField.value) {
    const defaultField = defaultSortFieldOptions.find(f => f.value === defaultSortField.value);
    const orderText = defaultSortOrder.value === 'desc' ? '降序' : '升序';
    parts.push(`默认: ${defaultField?.label}(${orderText})`);
  }
  
  if (selectedSortFields.value.length > 0) {
    const userFields = sortFieldsConfig.value
      .map(f => `${f.label}(${f.defaultOrder === 'desc' ? '降序' : '升序'})`)
      .join(', ');
    parts.push(`用户可排序: ${userFields}`);
  }
  
  return parts.join(' | ') || '无排序规则';
};
</script>

<style scoped>
.sort-settings {
  font-size: 13px;
  padding: 4px;
}

.mb-1 {
  margin-bottom: 12px;
}

.field-config {
  padding: 12px;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  background: #fafafa;
  margin-bottom: 8px;
}

.field-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  font-weight: 500;
}

.help-banner {
  background: #f0f8ff;
  border: 1px solid #d4edda;
  border-radius: 6px;
  margin-bottom: 12px;
}

.help-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e6;
  font-weight: 500;
  font-size: 13px;
}

.help-content {
  padding: 8px 12px;
  font-size: 12px;
  line-height: 1.4;
}

.help-content div {
  margin-bottom: 4px;
  color: #666;
}

.help-button-container {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 10;
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
  min-height: 28px;
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
</style>
