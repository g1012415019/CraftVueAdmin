<template>
  <div class="pagination-settings">
    <n-form label-placement="left" label-width="100px" size="small">
      
      <!-- 分页配置 -->
      <div class="config-section">
        <div class="section-header">
          <div class="section-title">分页配置</div>
          <div class="help-toggle">
            <n-switch v-model:value="showHelp" size="small" />
            <span>显示帮助</span>
          </div>
        </div>
        <div class="config-grid">
          <n-form-item label="启用">
            <n-switch v-model:value="formState.enabled" size="small" />
          </n-form-item>
          
          <template v-if="formState.enabled">
            <n-form-item label="总数">
              <n-switch v-model:value="formState.showTotal" size="small" />
            </n-form-item>
            
            <n-form-item label="每页选项">
              <div class="page-size-options">
                <n-dynamic-tags 
                  v-model:value="pageSizeStrings" 
                  :max="6"
                  size="small"
                  type="primary"
                />
                <div class="page-size-help">
                  <n-text depth="3" style="font-size: 11px;">
                    输入数字后按回车添加选项，点击标签删除
                  </n-text>
                </div>
              </div>
            </n-form-item>
            
            <n-form-item label="默认每页">
              <n-select
                v-model:value="formState.defaultPageSize"
                :options="defaultPageSizeOptions"
                size="small"
                style="width: 120px;"
                placeholder="选择默认每页数量"
              />
            </n-form-item>
          </template>
        </div>
        
        <div v-if="showHelp" class="help-section">
          <div class="help-item">
            <strong>启用：</strong>关闭后将隐藏整个分页器
          </div>
          <div class="help-item">
            <strong>总数：</strong>控制"共 X 条"文字的显示
          </div>
          <div class="help-item">
            <strong>每页选项：</strong>设置每页显示个数的选择器选项
          </div>
          <div class="help-item">
            <strong>默认每页：</strong>设置默认每页显示的条数
          </div>
        </div>
      </div>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, withDefaults, defineProps, defineEmits } from 'vue'
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
  configChange: [config: PaginationSettingsConfig]
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

/**
 * 帮助信息显示状态
 */
const showHelp = ref(false)

// ==================== 计算属性 ====================

/**
 * 每页选项的字符串数组 - 用于 n-dynamic-tags 组件
 */
const pageSizeStrings = computed({
  get: () => {
    const options = formState.value.pageSizeOptions || []
    return options.map(size => size.toString())
  },
  set: (value: string[]) => {
    const numbers = value
      .map(str => parseInt(str))
      .filter(num => !isNaN(num) && num > 0)
      .sort((a, b) => a - b)
    formState.value.pageSizeOptions = numbers
  }
})

/**
 * 默认每页数量选项 - 基于当前的每页选项生成
 */
const defaultPageSizeOptions = computed(() => {
  const options = formState.value.pageSizeOptions || []
  return options.map(size => ({
    label: `${size} 条/页`,
    value: size
  }))
})

// ==================== 常量定义 ====================


// ==================== 工具函数 ====================

/**
 * 发射配置变更事件
 */
const emitConfigChange = () => {
  const configCopy = { ...formState.value }
  emit('configChange', configCopy)
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
  () => formState.value.pageSizeOptions,
  (newOptions) => {
    if (newOptions && newOptions.length > 0) {
      // 如果当前默认值不在选项中，设置为第一个选项
      if (!newOptions.includes(formState.value.defaultPageSize as number)) {
        formState.value.defaultPageSize = newOptions[0]
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
  if (!formState.value.pageSizeOptions || formState.value.pageSizeOptions.length === 0) {
    formState.value.pageSizeOptions = [10, 20, 50, 100]
  }
  
  if (!formState.value.pageSizeOptions.includes(formState.value.defaultPageSize as number)) {
    formState.value.defaultPageSize = formState.value.pageSizeOptions[0]
  }
}
</script>

<style scoped>
.pagination-settings {
  padding: 16px;
}

.config-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.help-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px 24px;
  align-items: start;
}

.page-size-options {
  grid-template-columns: 1fr;
  gap: 8px;
  .page-size-help {
    margin-top: 4px;
  }
}

.config-grid :deep(.n-form-item) {
  margin-bottom: 0;
}

.config-grid :deep(.n-form-item-feedback-wrapper) {
  min-height: 0;
}

.help-section {
  margin-top: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
}

.help-item {
  margin-bottom: 8px;
  font-size: 12px;
  line-height: 1.5;
  color: #666;
}

.help-item:last-child {
  margin-bottom: 0;
}

.help-item strong {
  color: #333;
}
</style>