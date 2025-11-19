<template>
  <div class="basic-settings-form">
    <n-space direction="vertical" size="large">
      
      <!-- 行高设置 -->
      <div class="setting-section">
        <div class="section-header">
          <n-text class="section-title">行高设置</n-text>
          <n-text class="section-subtitle" depth="3">调整表格行的显示高度</n-text>
        </div>
        <n-radio-group v-model:value="formState.rowHeight" size="medium" class="radio-group-full">
          <n-space :wrap="false" justify="space-between">
            <n-radio value="compact" class="radio-option">
              <div class="radio-label">
                <div class="label-main">紧凑</div>
                <div class="label-desc">显示更多内容</div>
              </div>
            </n-radio>
            <n-radio value="medium" class="radio-option">
              <div class="radio-label">
                <div class="label-main">中等</div>
                <div class="label-desc">默认推荐</div>
              </div>
            </n-radio>
            <n-radio value="large" class="radio-option">
              <div class="radio-label">
                <div class="label-main">宽松</div>
                <div class="label-desc">阅读舒适</div>
              </div>
            </n-radio>
            <n-radio value="extra-large" class="radio-option">
              <div class="radio-label">
                <div class="label-main">超宽松</div>
                <div class="label-desc">触屏优化</div>
              </div>
            </n-radio>
          </n-space>
        </n-radio-group>
      </div>

      <n-divider class="custom-divider" />

      <!-- 显示选项 -->
      <div class="setting-section">
        <div class="section-header">
          <n-text class="section-title">显示选项</n-text>
          <n-text class="section-subtitle" depth="3">自定义表格视觉样式</n-text>
        </div>
        <div class="checkbox-grid">
          <n-checkbox v-model:checked="formState.showIndex" class="checkbox-option">
            <div class="checkbox-label">
              <div class="label-main">显示序号</div>
              <div class="label-desc">左侧显示行号</div>
            </div>
          </n-checkbox>
          <n-checkbox v-model:checked="formState.showRecordShortcut" class="checkbox-option">
            <div class="checkbox-label">
              <div class="label-main">记录快捷方式</div>
              <div class="label-desc">快速操作入口</div>
            </div>
          </n-checkbox>
          <n-checkbox v-model:checked="formState.showSummaryRow" class="checkbox-option">
            <div class="checkbox-label">
              <div class="label-main">汇总行</div>
              <div class="label-desc">底部统计信息</div>
            </div>
          </n-checkbox>
          <n-checkbox v-model:checked="formState.showVerticalLines" class="checkbox-option">
            <div class="checkbox-label">
              <div class="label-main">垂直分隔线</div>
              <div class="label-desc">列间分割线</div>
            </div>
          </n-checkbox>
          <n-checkbox v-model:checked="formState.showAlternateRowColors" class="checkbox-option">
            <div class="checkbox-label">
              <div class="label-main">行交替色</div>
              <div class="label-desc">斑马纹样式</div>
            </div>
          </n-checkbox>
          <n-checkbox v-model:checked="formState.headerTextWrap" class="checkbox-option">
            <div class="checkbox-label">
              <div class="label-main">标题自动换行</div>
              <div class="label-desc">长标题处理</div>
            </div>
          </n-checkbox>
        </div>
      </div>

      <!-- 交互模式 -->
      <div class="setting-section">
        <div class="section-header">
          <n-text class="section-title">交互模式</n-text>
          <n-text class="section-subtitle" depth="3">选择表格操作方式</n-text>
        </div>
        <n-radio-group v-model:value="formState.interactionMode" size="medium" class="radio-group-full">
          <n-space :wrap="false" justify="space-between">
            <n-radio value="classic" class="radio-option">
              <div class="radio-label">
                <div class="label-main">经典模式</div>
                <div class="label-desc">传统操作</div>
              </div>
            </n-radio>
            <n-radio value="spreadsheet" class="radio-option">
              <div class="radio-label">
                <div class="label-main">表格模式</div>
                <div class="label-desc">类Excel操作</div>
              </div>
            </n-radio>
          </n-space>
        </n-radio-group>
      </div>

      <n-divider class="custom-divider" />

      <!-- 功能选项 -->
      <div class="setting-section">
        <div class="section-header">
          <n-text class="section-title">功能选项</n-text>
          <n-text class="section-subtitle" depth="3">高级功能设置</n-text>
        </div>
        <n-space direction="vertical" size="medium">
          <n-checkbox v-model:checked="formState.allowInlineEdit" class="checkbox-option">
            <div class="checkbox-label">
              <div class="label-main">启用行内编辑</div>
              <div class="label-desc">直接双击单元格编辑</div>
            </div>
          </n-checkbox>
          
          <div class="nested-option">
            <n-checkbox v-model:checked="formState.autoRefresh" class="checkbox-option">
              <div class="checkbox-label">
                <div class="label-main">自动刷新数据</div>
                <div class="label-desc">定时更新表格内容</div>
              </div>
            </n-checkbox>
            <div v-if="formState.autoRefresh" class="sub-option">
              <div class="interval-control">
                <n-text depth="3" class="interval-label">刷新间隔</n-text>
                <n-input-number 
                  v-model:value="formState.autoRefreshInterval" 
                  :min="10" 
                  :max="3600" 
                  :step="10"
                  size="small"
                  class="interval-input"
                />
                <n-text depth="3" class="unit">秒</n-text>
              </div>
            </div>
          </div>
        </n-space>
      </div>

    </n-space>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { BasicSettingsConfig } from '../../types'
import { ConfigManager } from '../../utils/configManager'

// ==================== 组件定义 ====================

const props = defineProps<{
  config?: BasicSettingsConfig
}>()

const emit = defineEmits<{
  'config-change': [config: BasicSettingsConfig]
}>()

// ==================== 表单状态 ====================

const formState = ref<BasicSettingsConfig>({
  ...ConfigManager.getBasicDefaults(),
  ...props.config
})

// ==================== 监听配置变化 ====================

watch(
  formState,
  (newConfig) => {
    emit('config-change', { ...newConfig })
  },
  { deep: true }
)

watch(
  () => props.config,
  (newConfig) => {
    if (newConfig) {
      Object.assign(formState.value, newConfig)
    }
  },
  { deep: true }
)
</script>

<style scoped>
.basic-settings-form {
  padding: 24px;
  background: #fff;
}

.setting-section {
  padding: 0 4px;
}

.section-header {
  margin-bottom: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}

.section-subtitle {
  font-size: 12px;
}

.custom-divider {
  margin: 24px 0;
}

/* 单选框组样式 */
.radio-group-full {
  width: 100%;
}

.radio-option {
  flex: 1;
  margin-right: 8px;
}

.radio-option:last-child {
  margin-right: 0;
}

:deep(.n-radio__label) {
  display: block;
  width: 100%;
}

.radio-label,
.checkbox-label {
  padding: 4px 0;
}

.label-main {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 2px;
}

.label-desc {
  font-size: 12px;
  color: #8a8f8b;
  line-height: 1.3;
}

/* 复选框网格布局 */
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px 24px;
}

.checkbox-option {
  width: 100%;
}

/* 嵌套选项样式 */
.nested-option {
  padding-left: 8px;
  border-left: 2px solid #f0f0f0;
}

.sub-option {
  margin: 12px 0 8px 24px;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 6px;
  border: 1px solid #e9ecef;
}

.interval-control {
  display: flex;
  align-items: center;
  gap: 12px;
}

.interval-label {
  font-size: 13px;
  min-width: 60px;
}

.interval-input {
  width: 100px;
}

.unit {
  font-size: 13px;
  min-width: 24px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .basic-settings-form {
    padding: 16px;
  }
  
  .checkbox-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .radio-group-full :deep(.n-space) {
    flex-direction: column;
    gap: 8px;
  }
  
  .radio-option {
    margin-right: 0;
  }
  
  .sub-option {
    margin-left: 16px;
  }
}

/* 交互效果 */
.radio-option:hover :deep(.n-radio__dot),
.checkbox-option:hover :deep(.n-checkbox-box) {
  border-color: #18a058;
}

:deep(.n-radio--checked .n-radio__dot) {
  border-color: #18a058;
  background-color: #18a058;
}

:deep(.n-checkbox--checked .n-checkbox-box) {
  border-color: #18a058;
  background-color: #18a058;
}
</style>