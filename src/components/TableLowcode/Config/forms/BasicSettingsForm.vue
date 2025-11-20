<template>
  <div class="basic-settings">
    <div class="section-header">
      <n-text class="section-title">基础设置</n-text>
      <n-text depth="3">配置表格的基本显示和交互选项</n-text>
    </div>

    <div class="help-section">
      <div class="help-item">
        <strong>行高设置：</strong>调整表格行的显示高度，影响数据密度和阅读体验
      </div>
      <div class="help-item">
        <strong>显示选项：</strong>控制表格各种视觉元素的显示与隐藏
      </div>
    </div>

    <!-- 行高设置 -->
    <div class="setting-group">
      <div class="group-header">
        <n-text class="group-title">行高设置</n-text>
      </div>
      <div class="group-content">
        <n-radio-group v-model:value="formState.rowHeight" size="medium">
          <n-space>
            <n-radio value="compact">紧凑</n-radio>
            <n-radio value="medium">中等</n-radio>
            <n-radio value="large">宽松</n-radio>
            <n-radio value="extra-large">超宽松</n-radio>
          </n-space>
        </n-radio-group>
      </div>
    </div>

    <!-- 显示选项 -->
    <div class="setting-group">
      <div class="group-header">
        <n-text class="group-title">显示选项</n-text>
      </div>
      <div class="group-content">
        <div class="checkbox-grid">
          <n-checkbox v-model:checked="formState.showIndex">显示序号</n-checkbox>
          <n-checkbox v-model:checked="formState.showRecordShortcut">记录快捷方式</n-checkbox>
          <n-checkbox v-model:checked="formState.showSummaryRow">汇总行</n-checkbox>
          <n-checkbox v-model:checked="formState.showVerticalLines">垂直分隔线</n-checkbox>
          <n-checkbox v-model:checked="formState.showAlternateRowColors">行交替色</n-checkbox>
          <n-checkbox v-model:checked="formState.headerTextWrap">标题自动换行</n-checkbox>
        </div>
      </div>
    </div>

    <!-- 交互模式 -->
    <div class="setting-group">
      <div class="group-header">
        <n-text class="group-title">交互模式</n-text>
      </div>
      <div class="group-content">
        <n-radio-group v-model:value="formState.interactionMode" size="medium">
          <n-space>
            <n-radio value="classic">经典模式</n-radio>
            <n-radio value="spreadsheet">表格模式</n-radio>
          </n-space>
        </n-radio-group>
      </div>
    </div>

    <!-- 功能选项 -->
    <div class="setting-group">
      <div class="group-header">
        <n-text class="group-title">功能选项</n-text>
      </div>
      <div class="group-content">
        <n-space vertical>
          <n-checkbox v-model:checked="formState.allowInlineEdit">启用行内编辑</n-checkbox>
          <n-checkbox v-model:checked="formState.autoRefresh">自动刷新数据</n-checkbox>
          <div v-if="formState.autoRefresh" class="sub-option">
            <n-space align="center">
              <n-text depth="3">刷新间隔</n-text>
              <n-input-number 
                v-model:value="formState.autoRefreshInterval" 
                :min="10" 
                :max="3600" 
                :step="10"
                size="small"
                style="width: 100px;"
              />
              <n-text depth="3">秒</n-text>
            </n-space>
          </div>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { BasicSettingsConfig } from '../../types'
import { ConfigManager } from '../../utils/configManager'

// ==================== 组件定义 ====================

const props = defineProps<{
  initialConfig?: BasicSettingsConfig
}>()

const emit = defineEmits<{
  'config-change': [config: BasicSettingsConfig]
}>()

// ==================== 表单状态 ====================

const formState = ref<BasicSettingsConfig>({
  ...ConfigManager.getBasicDefaults(),
  ...props.initialConfig
})

// ==================== 监听配置变化 ====================

watch(
  formState,
  (newConfig) => {
    emit('config-change', { ...newConfig })
  },
  { deep: true }
)

</script>

<style lang="scss" scoped>
.basic-settings {
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
    margin-bottom: 4px;
  }
}

.setting-group {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fafbfc;
}

.group-header {
  margin-bottom: 12px;
  
  .group-title {
    font-size: 14px;
    font-weight: 500;
  }
}

.group-content {
  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px 16px;
  }
}

.sub-option {
  margin-top: 8px;
  margin-left: 24px;
  padding: 8px 12px;
  background: #f0f2f5;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
}

@media (max-width: 768px) {
  .checkbox-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>