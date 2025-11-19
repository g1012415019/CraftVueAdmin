<template>
  <div class="basic-settings-form">
    <!-- 表单容器 - 每个BasicSettingsForm实例都有独立的配置状态 -->
    <n-form 
      :model="formState" 
      label-placement="left" 
      label-width="80px" 
      size="small"
    >
      
      <!-- 基础信息配置区域 -->
      <div class="config-section">
        <div class="section-header">
          <h4 class="section-title">基础信息</h4>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-icon size="16" class="help-icon">
                <QuestionCircleOutlined />
              </n-icon>
            </template>
            配置表格的基本信息和标识
          </n-tooltip>
        </div>
      </div>

      <!-- 外观样式配置区域 -->
      <div class="config-section">
        <div class="section-header">
          <h4 class="section-title">外观样式</h4>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-icon size="16" class="help-icon">
                <QuestionCircleOutlined />
              </n-icon>
            </template>
            配置表格的视觉样式和布局
          </n-tooltip>
        </div>
        
        <!-- 表格尺寸选择 -->
        <n-form-item label="表格尺寸" path="size">
          <n-radio-group v-model:value="formState.size">
            <n-radio value="small">小</n-radio>
            <n-radio value="medium">中</n-radio>
            <n-radio value="large">大</n-radio>
          </n-radio-group>
        </n-form-item>
        
        <!-- 行高密度选择 -->
        <n-form-item label="行高密度" path="density">
          <n-button-group size="small">
            <n-button 
              v-for="density in densityOptions"
              :key="density.value"
              :type="formState.density === density.value ? 'primary' : 'default'"
              @click="formState.density = density.value"
            >
              {{ density.label }}
            </n-button>
          </n-button-group>
        </n-form-item>
        
        <!-- 样式开关配置 -->
        <div class="style-switches">
          <n-form-item label="显示边框" path="bordered">
            <n-switch v-model:value="formState.bordered" />
          </n-form-item>
          
          <n-form-item label="斑马纹" path="striped">
            <n-switch v-model:value="formState.striped" />
          </n-form-item>
          
          <n-form-item label="悬停高亮" path="hoverable">
            <n-switch v-model:value="formState.hoverable" />
          </n-form-item>
        </div>
      </div>

      <!-- 功能配置区域 -->
      <div class="config-section">
        <div class="section-header">
          <h4 class="section-title">功能配置</h4>
        </div>
        
        <n-form-item label="加载状态" path="loading">
          <n-switch v-model:value="formState.loading" />
        </n-form-item>
        
        <n-form-item label="空状态提示" path="emptyText">
          <n-input 
            v-model:value="formState.emptyText" 
            placeholder="暂无数据"
          />
        </n-form-item>
      </div>
    </n-form>
  </div>
</template>

<script setup lang="ts">
/**
 * BasicSettingsForm - 基础设置表单组件
 * 
 * 功能说明：
 * - 每个组件实例都有独立的表单状态，互不干扰
 * - 使用组件内状态管理，避免全局状态污染
 * - 通过事件向父组件传递配置变更
 * - 支持初始配置的注入和默认值设置
 */

import { QuestionCircleOutlined } from '@vicons/antd'
import type { BasicSettingsConfig } from '../../types/config/basicSettings'
import { ConfigManager } from '../../utils/configManager'

// ==================== 类型定义 ====================

/**
 * 组件Props接口
 */
interface Props {
  initialConfig?: Partial<BasicSettingsConfig>  // 初始配置（可选）
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
  configChange: [config: BasicSettingsConfig]
}>()

// ==================== 组件内状态 ====================

/**
 * 密度选项配置
 */
const densityOptions = [
  { label: '紧凑', value: 'compact' as const },
  { label: '默认', value: 'default' as const },
  { label: '舒适', value: 'comfortable' as const }
]

/**
 * 表单状态 - 合并默认配置和传入的初始配置
 */
const formState = ref<BasicSettingsConfig>({
  // 使用 ConfigManager 提供的默认值
  ...ConfigManager.getBasicDefaults(),
  // 额外的默认配置
  density: 'default',
  loading: false,
  emptyText: '暂无数据',
  
  // 合并Props传入的初始配置
  ...props.initialConfig
})


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
  // 如果没有初始配置，使用默认值并立即发出
  if (!props.initialConfig || Object.keys(props.initialConfig).length === 0) {
    emitConfigChange()
  } else {
    // 有初始配置时也发出一次，确保配置同步
    emitConfigChange()
  }
})

/**
 * 统一监听表单状态变化 - 避免重复触发
 */
watch(
  () => formState,
  () => {
    emitConfigChange()
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
/**
 * BasicSettingsForm 组件样式
 * 
 * 设计原则：
 * - 使用scoped样式，确保样式不会影响其他组件实例
 * - 响应式设计，适配不同屏幕尺寸
 * - 清晰的视觉层次和间距
 */

.basic-settings-form {
  padding: 16px;
  
  // ==================== 配置区域样式 ====================
  .config-section {
    margin-bottom: 24px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    // 区域头部样式
    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 1px solid #f0f0f0;
      
      .section-title {
        margin: 0;
        font-size: 14px;
        font-weight: 600;
        color: #262626;
      }
      
      .help-icon {
        color: #8c8c8c;
        cursor: help;
        
        &:hover {
          color: #1890ff;
        }
      }
    }
  }
  
  // ==================== 表单项样式 ====================
  :deep(.n-form-item) {
    margin-bottom: 16px;
    
    .n-form-item-label {
      font-size: 13px;
      color: #595959;
    }
  }
  
  // ==================== 样式开关区域 ====================
  .style-switches {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 12px;
    }
  }
  
  // ==================== 按钮组样式 ====================
  :deep(.n-button-group) {
    .n-button {
      font-size: 12px;
      padding: 0 12px;
      
      &.n-button--primary-type {
        background-color: #1890ff;
        border-color: #1890ff;
      }
    }
  }
  
  // ==================== 输入框样式 ====================
  :deep(.n-input) {
    font-size: 13px;
  }
  
  :deep(.n-input--textarea) {
    .n-input__textarea {
      font-size: 13px;
      line-height: 1.4;
    }
  }
  
  // ==================== 单选按钮组样式 ====================
  :deep(.n-radio-group) {
    .n-radio {
      margin-right: 16px;
      
      .n-radio__label {
        font-size: 13px;
      }
    }
  }
  
  // ==================== 开关样式 ====================
  :deep(.n-switch) {
    &.n-switch--active {
      .n-switch__rail {
        background-color: #1890ff;
      }
    }
  }
}

// ==================== 响应式设计 ====================
@media (max-width: 768px) {
  .basic-settings-form {
    padding: 12px;
    
    .config-section {
      margin-bottom: 20px;
      
      .section-header {
        margin-bottom: 12px;
        
        .section-title {
          font-size: 13px;
        }
      }
    }
    
    :deep(.n-form-item) {
      margin-bottom: 12px;
    }
  }
}
</style>
