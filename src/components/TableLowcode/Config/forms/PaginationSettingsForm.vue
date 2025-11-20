<template>
  <div class="pagination-settings">
    <div class="section-header">
      <n-text class="section-title">分页设置</n-text>
      <n-text depth="3">配置表格的分页显示选项</n-text>
    </div>

    <div class="help-section">
      <div class="help-item">
        <strong>分页功能：</strong>控制表格数据的分页显示，提升大数据量的浏览体验
      </div>
      <div class="help-item">
        <strong>每页选项：</strong>设置用户可选择的每页显示条数
      </div>
    </div>

    <!-- 分页开关 -->
    <div class="setting-group">
      <div class="group-header">
        <n-text class="group-title">分页开关</n-text>
      </div>
      <div class="group-content">
        <n-switch v-model:value="formState.enabled" size="medium">
          <template #checked>启用</template>
          <template #unchecked>禁用</template>
        </n-switch>
      </div>
    </div>

    <!-- 分页配置 -->
    <div v-if="formState.enabled" class="setting-group">
      <div class="group-header">
        <n-text class="group-title">分页配置</n-text>
      </div>
      <div class="group-content">
        <n-space vertical>
          <div class="form-row">
            <n-text depth="3" style="width: 80px;">每页选项</n-text>
            <div style="flex: 1;">
              <n-dynamic-tags 
                v-model:value="pageSizeStrings" 
                :max="6"
                size="small"
                type="primary"
              />
              <n-text depth="3" style="font-size: 11px; margin-top: 4px; display: block;">
                输入数字后按回车添加选项，点击标签删除
              </n-text>
            </div>
          </div>
          
          <div class="form-row">
            <n-text depth="3" style="width: 80px;">默认每页</n-text>
            <n-select
              v-model:value="formState.pageSize"
              :options="defaultPageSizeOptions"
              size="small"
              style="width: 120px;"
              placeholder="选择默认每页数量"
            />
          </div>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, withDefaults, defineProps, defineEmits, computed } from 'vue'
import type { PaginationSettingsConfig } from '../../types/config/paginationSettings'
import { ConfigManager } from '../../utils/configManager'

// ==================== 类型定义 ====================

/**
 * 组件Props接口
 */
interface Props {
  initialConfig?: Partial<PaginationSettingsConfig>  // 初始配置（可选）
}

// ==================== 组件定义 ====================

/**
 * 定义组件Props，支持传入初始配置
 */
const props = withDefaults(defineProps<Props>(), {
  initialConfig: () => ({})
})

/**
 * 定义组件事件
 * - configChange: 配置变更事件，向父组件传递新的配置
 */
const emit = defineEmits<{
  'config-change': [config: PaginationSettingsConfig]
}>()

// ==================== 组件内状态 ====================

/**
 * 表单状态 - 合并默认配置和传入的初始配置
 */
const formState = ref<PaginationSettingsConfig>({
  // 使用 ConfigManager 提供的默认值
  ...ConfigManager.getPaginationDefaults(),
  
  // 合并Props传入的初始配置
  ...props.initialConfig
})

// ==================== 计算属性 ====================

/**
 * 每页选项的字符串数组 - 用于 n-dynamic-tags 组件
 */
const pageSizeStrings = computed({
  get: () => {
    const options = formState.value.pageSizes || []
    return options.map(size => size.toString())
  },
  set: (value: string[]) => {
    const numbers = value
      .map(str => parseInt(str))
      .filter(num => !isNaN(num) && num > 0)
      .sort((a, b) => a - b)
    formState.value.pageSizes = numbers
  }
})

/**
 * 默认每页数量选项 - 基于当前的每页选项生成
 */
const defaultPageSizeOptions = computed(() => {
  const options = formState.value.pageSizes || []
  return options.map(size => ({
    label: `${size} 条/页`,
    value: size
  }))
})

// ==================== 工具函数 ====================

/**
 * 发射配置变更事件
 */
const emitConfigChange = () => {
  const configCopy = { ...formState.value }
  emit('config-change', configCopy)
}

// ==================== 生命周期 ====================

onMounted(() => {
  // 确保默认每页值在选项中
  ensureDefaultPageSizeInOptions()
  emitConfigChange()
})

/**
 * 统一监听表单状态变化 - 避免重复触发
 */
watch(
  () => formState.value,
  () => {
    emitConfigChange()
  },
  { deep: true }
)

/**
 * 监听每页选项变化，确保默认值始终在选项中
 */
watch(
  () => formState.value.pageSizes,
  (newOptions) => {
    if (newOptions && newOptions.length > 0) {
      // 如果当前默认值不在选项中，设置为第一个选项
      if (!newOptions.includes(formState.value.pageSize as number)) {
        formState.value.pageSize = newOptions[0]
      }
    }
  },
  { immediate: true }
)

// ==================== 辅助函数 ====================

/**
 * 确保默认每页值在选项中
 */
const ensureDefaultPageSizeInOptions = () => {
  if (!formState.value.pageSizes || formState.value.pageSizes.length === 0) {
    formState.value.pageSizes = ConfigManager.getPaginationDefaults().pageSizes
  }
  
  if (!formState.value.pageSizes?.includes(formState.value.pageSize as number)) {
    formState.value.pageSize = formState.value.pageSizes?.[0]
  }
}
</script>

<style lang="scss" scoped>
.pagination-settings {
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
  .form-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>