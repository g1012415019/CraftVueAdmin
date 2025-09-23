<template>
  <div class="filter-list-settings">
    <n-form label-placement="left" label-width="100px" size="small">
      
      <!-- 功能说明 -->
      <n-card title="筛选列表" size="small" class="mb-1">
        <n-alert type="info" :show-icon="false" style="margin-bottom: 16px;">
          将所选字段选项以列表的形式显示在表格顶部，帮助用户快速筛选和查看记录。支持多字段组合筛选，提升数据查找效率。
        </n-alert>
        
        <n-grid :cols="1" :y-gap="12">
          <n-gi>
            <n-form-item label="启用筛选列表">
              <n-switch v-model:value="enableFilterList" size="small" />
            </n-form-item>
          </n-gi>
          
          <n-gi v-if="enableFilterList">
            <n-form-item label="选择字段">
              <n-select
                v-model:value="selectedFields"
                multiple
                :options="fieldOptions"
                placeholder="选择要显示筛选的字段"
                size="small"
                style="width: 100%;"
                max-tag-count="responsive"
              />
            </n-form-item>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 已选择的筛选字段 -->
      <n-card v-if="enableFilterList && selectedFields.length > 0" title="筛选字段配置" size="small" class="mb-1">
        <!-- 名词解释面板 - 默认显示在顶部 -->
        <div v-if="showHelp" class="help-banner">
          <div class="help-banner-header">
            <div class="help-banner-title">
              <div class="help-color-block"></div>
              <span>名词解释</span>
            </div>
            <n-button size="tiny" text @click="showHelp = false" class="help-close-btn">
              <template #icon>
                <n-icon>
                  <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </n-icon>
              </template>
            </n-button>
          </div>
          <div class="help-banner-content">
            <div class="help-item"><strong>筛选类型：</strong>选择该字段的筛选控件类型</div>
            <div class="help-item"><strong>显示位置：</strong>筛选控件在页面中的显示位置</div>
            <div class="help-item"><strong>排序：</strong>筛选字段在界面中的显示顺序，数字越小越靠前</div>
            <div class="help-item"><strong>默认展开：</strong>页面加载时是否默认展开筛选选项</div>
            <div class="help-item"><strong>允许多选：</strong>是否允许同时选择多个筛选值</div>
            <div class="help-item"><strong>高级筛选：</strong>开启后显示高级筛选按钮，支持复杂查询</div>
            <div class="help-item"><strong>默认值：</strong>页面加载时的默认筛选值</div>
            <div class="help-item"><strong>占位符：</strong>输入框中显示的提示文字</div>
            <div class="help-item"><strong>必填项：</strong>是否为必须填写的筛选条件</div>
            <div class="help-item"><strong>实时筛选：</strong>输入时立即执行筛选</div>
          </div>
        </div>

        <!-- 帮助按钮 - 关闭后显示 -->
        <div v-else class="help-button-container">
          <n-button 
            size="small" 
            type="info" 
            text 
            @click="showHelp = true"
            class="help-button"
          >
            <template #icon>
              <n-icon>
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </n-icon>
            </template>
            名词解释
          </n-button>
        </div>

        <n-grid :cols="1" :y-gap="8">
          <n-gi v-for="field in selectedFieldsConfig" :key="field.key">
            <div class="filter-field-item">
              <div class="field-header">
                <n-text strong>{{ field.label }}</n-text>
                <n-button 
                  size="tiny" 
                  type="error" 
                  text 
                  @click="removeField(field.key)"
                >
                  移除
                </n-button>
              </div>
              
              <n-grid :cols="3" :x-gap="12" :y-gap="12" style="margin-top: 8px;">
                <n-gi>
                  <n-form-item label="筛选类型" label-width="60px">
                    <n-select
                      v-model:value="field.filterType"
                      :options="filterTypeOptions"
                      size="small"
                    />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="显示位置" label-width="60px">
                    <n-select
                      v-model:value="field.position"
                      :options="positionOptions"
                      size="small"
                    />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="排序" label-width="60px">
                    <n-input-number
                      v-model:value="field.sortOrder"
                      :min="1"
                      :max="100"
                      size="small"
                      style="width: 100%;"
                    />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="默认展开" label-width="60px">
                    <n-switch v-model:value="field.defaultExpanded" size="small" />
                  </n-form-item>
                </n-gi>
                <n-gi v-if="!['input', 'number', 'date', 'switch'].includes(field.filterType)">
                  <n-form-item label="允许多选" label-width="60px">
                    <n-switch v-model:value="field.allowMultiple" size="small" />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="高级筛选" label-width="60px">
                    <n-switch v-model:value="field.advancedFilter" size="small" />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="默认值" label-width="60px">
                    <n-input 
                      v-model:value="field.defaultValue" 
                      placeholder="设置默认筛选值"
                      size="small"
                    />
                  </n-form-item>
                </n-gi>
                <n-gi v-if="['input', 'number'].includes(field.filterType)">
                  <n-form-item label="占位符" label-width="60px">
                    <n-input 
                      v-model:value="field.placeholder" 
                      placeholder="请输入提示文字"
                      size="small"
                    />
                  </n-form-item>
                </n-gi>
                <n-gi>
                  <n-form-item label="必填项" label-width="60px">
                    <n-switch v-model:value="field.required" size="small" />
                  </n-form-item>
                </n-gi>
                <n-gi v-if="['input', 'number'].includes(field.filterType)">
                  <n-form-item label="实时筛选" label-width="60px">
                    <n-switch v-model:value="field.realTimeFilter" size="small" />
                  </n-form-item>
                </n-gi>
                <n-gi v-if="field.filterType === 'select'">
                  <n-form-item label="可搜索" label-width="60px">
                    <n-switch v-model:value="field.filterable" size="small" />
                  </n-form-item>
                </n-gi>
                <n-gi v-if="field.filterType === 'select'">
                  <n-form-item label="可清空" label-width="60px">
                    <n-switch v-model:value="field.clearable" size="small" />
                  </n-form-item>
                </n-gi>
              </n-grid>

              <!-- 自定义选项 -->
              <n-collapse-transition :show="field.filterType === 'custom'">
                <n-divider style="margin: 8px 0;" />
                <n-form-item label="自定义选项" label-width="80px">
                  <n-dynamic-input
                    v-model:value="field.customOptions"
                    :on-create="() => ({ label: '', value: '' })"
                    size="small"
                  >
                    <template #default="{ value }">
                      <div style="display: flex; gap: 8px; width: 100%;">
                        <n-input v-model:value="value.label" placeholder="显示名称" size="small" />
                        <n-input v-model:value="value.value" placeholder="值" size="small" />
                      </div>
                    </template>
                  </n-dynamic-input>
                </n-form-item>
              </n-collapse-transition>
            </div>
          </n-gi>
        </n-grid>
      </n-card>

      <!-- 预览效果 -->
      <n-card v-if="enableFilterList && selectedFields.length > 0" title="预览效果" size="small" class="mb-1">
        <n-alert type="success" :show-icon="false">
          筛选列表将显示在表格顶部，包含 {{ selectedFields.length }} 个筛选字段：
          {{ selectedFieldsConfig.map(f => f.label).join('、') }}
        </n-alert>
      </n-card>

    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';

// 启用筛选列表
const enableFilterList = ref(false);

// 显示帮助面板
const showHelp = ref(true);

// 选中的字段
const selectedFields = ref<string[]>([]);

// 可选字段选项
const fieldOptions = [
  { label: '状态', value: 'status' },
  { label: '类型', value: 'type' },
  { label: '部门', value: 'department' },
  { label: '创建人', value: 'creator' },
  { label: '优先级', value: 'priority' },
  { label: '标签', value: 'tags' },
  { label: '地区', value: 'region' },
  { label: '分类', value: 'category' },
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
  { label: '开关', value: 'switch' },
  { label: '自定义选项', value: 'custom' },
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
  filterable: boolean;
  clearable: boolean;
  customOptions: Array<{ label: string; value: string }>;
}>>([]);

// 监听选中字段变化
watch(selectedFields, (newFields) => {
  // 添加新字段配置
  newFields.forEach(fieldKey => {
    if (!selectedFieldsConfig.value.find(f => f.key === fieldKey)) {
      const fieldOption = fieldOptions.find(f => f.value === fieldKey);
      selectedFieldsConfig.value.push({
        key: fieldKey,
        label: fieldOption?.label || fieldKey,
        filterType: 'select',
        position: 'top',
        sortOrder: selectedFieldsConfig.value.length + 1,
        defaultExpanded: true,
        allowMultiple: false,
        advancedFilter: false,
        defaultValue: '',
        placeholder: '',
        required: false,
        realTimeFilter: false,
        filterable: true,
        clearable: true,
        customOptions: [],
      });
    }
  });

  // 移除不再选中的字段配置
  selectedFieldsConfig.value = selectedFieldsConfig.value.filter(f => 
    newFields.includes(f.key)
  );
}, { deep: true });

// 移除字段
const removeField = (fieldKey: string) => {
  selectedFields.value = selectedFields.value.filter(key => key !== fieldKey);
};
</script>

<style scoped>
.filter-list-settings {
  font-size: 13px;
  padding: 4px;
}

.mb-1 {
  margin-bottom: 12px;
}

.filter-field-item {
  padding: 12px;
  border: 1px solid #e0e0e6;
  border-radius: 6px;
  background: #fafafa;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.description {
  font-size: 11px;
  color: #999;
  display: block;
  line-height: 1.3;
  margin-top: 2px;
  margin-left: 72px;
}

.help-content {
  font-size: 12px;
  line-height: 1.5;
}

.help-item {
  margin-bottom: 8px;
  color: #666;
}

.help-item strong {
  color: #333;
}

.help-button-container {
  position: absolute;
  top: 12px;
  right: 16px;
  z-index: 10;
}

.help-button {
  font-size: 12px;
}

.help-banner {
  background: #f0f8ff;
  border: 1px solid #d4edda;
  border-radius: 6px;
  margin-bottom: 16px;
}

.help-banner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px 8px;
  border-bottom: 1px solid #e0e0e6;
}

.help-banner-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
  color: #333;
}

.help-color-block {
  width: 4px;
  height: 16px;
  background: linear-gradient(135deg, #1890ff 0%, #096dd9 100%);
  border-radius: 2px;
}

.help-close-btn {
  color: #666;
}

.help-close-btn:hover {
  color: #333;
}

.help-banner-content {
  padding: 12px 16px;
  font-size: 12px;
  line-height: 1.5;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 16px;
}

.help-banner-content .help-item {
  margin-bottom: 0;
  color: #666;
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
  padding: 0;
  min-height: 32px;
  height: auto;
  align-items: flex-start;
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
  display: flex;
  align-items: center;
  flex: 1;
}

:deep(.n-input), :deep(.n-select) {
  font-size: 13px;
  min-height: 28px;
}

:deep(.n-switch) {
  transform: scale(1);
}

:deep(.n-alert) {
  border-radius: 6px;
}

:deep(.n-divider) {
  margin: 8px 0 !important;
}
</style>
