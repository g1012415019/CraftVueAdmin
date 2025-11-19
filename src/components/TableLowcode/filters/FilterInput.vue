<template>
  <div class="filter-input">
    <n-text class="filter-label">{{ config?.label }}</n-text>
    <n-input
      v-model:value="inputValue"
      :placeholder="config?.placeholder || `请输入${config?.label}`"
      size="small"
      clearable
      @update:value="handleUpdate"
      @keyup.enter="handleUpdate"
    >
      <template #suffix>
        <div class="input-suffix">
          <!-- 精准匹配 -->
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button 
                size="tiny" 
                text 
                :type="exactMatch ? 'primary' : 'default'"
                @click="exactMatch = !exactMatch"
              >
                <n-icon size="14">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                  </svg>
                </n-icon>
              </n-button>
            </template>
            精准匹配
          </n-tooltip>
          
          <!-- 区分大小写 -->
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button 
                size="tiny" 
                text 
                :type="caseSensitive ? 'primary' : 'default'"
                @click="caseSensitive = !caseSensitive"
              >
                <n-icon size="14">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M20.06,18C20,17.83 19.91,17.54 19.86,17.11C19.19,17.81 18.38,18.16 17.45,18.16C16.62,18.16 16.08,17.9 15.82,17.37C15.56,16.84 15.43,16.12 15.43,15.2V10.32H17.05V15.11C17.05,15.64 17.11,16 17.22,16.25C17.33,16.5 17.53,16.62 17.82,16.62C18.1,16.62 18.33,16.5 18.53,16.25C18.73,16 18.83,15.64 18.83,15.17V10.32H20.45V18H20.06M8.5,6C9.87,6 11,7.13 11,8.5C11,9.87 9.87,11 8.5,11C7.13,11 6,9.87 6,8.5C6,7.13 7.13,6 8.5,6M8.5,7.5C7.95,7.5 7.5,7.95 7.5,8.5C7.5,9.05 7.95,9.5 8.5,9.5C9.05,9.5 9.5,9.05 9.5,8.5C9.5,7.95 9.05,7.5 8.5,7.5M12.5,10.26L14.12,10.26L10.5,18L8.88,18L12.5,10.26Z"/>
                  </svg>
                </n-icon>
              </n-button>
            </template>
            区分大小写
          </n-tooltip>
          
          <!-- 多关键词按钮 -->
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button 
                size="tiny" 
                text 
                type="primary"
                @click="showMultiKeywords = true"
              >
                <n-icon size="14">
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                  </svg>
                </n-icon>
              </n-button>
            </template>
            添加多个搜索关键词
          </n-tooltip>
        </div>
      </template>
    </n-input>
    
    <!-- 多关键词弹窗 -->
    <n-modal 
      v-model:show="showMultiKeywords" 
      preset="card" 
      title="添加多个搜索关键词" 
      style="width: 400px;"
    >
      <n-input
        v-model:value="multiKeywordsText"
        type="textarea"
        placeholder="多个关键词请用换行符分隔"
        :rows="6"
        style="margin-bottom: 12px;"
      />
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="showMultiKeywords = false">取消</n-button>
          <n-button type="primary" @click="handleMultiKeywords">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface FilterConfig {
  key: string
  label: string
  placeholder?: string
  defaultValue?: string
}

interface Props {
  config?: FilterConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [key: string, value: any]
}>()

const inputValue = ref(props.config?.defaultValue || '')
const exactMatch = ref(false)
const caseSensitive = ref(false)
const showMultiKeywords = ref(false)
const multiKeywordsText = ref('')

const handleUpdate = () => {
  if (props.config) {
    const searchValue = {
      text: inputValue.value,
      exactMatch: exactMatch.value,
      caseSensitive: caseSensitive.value
    }
    emit('update', props.config.key, searchValue)
  }
}

const handleMultiKeywords = () => {
  if (multiKeywordsText.value.trim()) {
    const keywords = multiKeywordsText.value.split('\n').filter(k => k.trim())
    if (keywords.length > 0) {
      inputValue.value = keywords.join(' | ')
      handleUpdate()
    }
  }
  showMultiKeywords.value = false
  multiKeywordsText.value = ''
}

// 监听默认值变化
watch(() => props.config?.defaultValue, (newValue) => {
  if (newValue !== undefined) {
    inputValue.value = newValue
  }
}, { immediate: true })

// 监听选项变化时触发更新
watch([exactMatch, caseSensitive], () => {
  if (inputValue.value) {
    handleUpdate()
  }
})
</script>

<style lang="scss" scoped>
@use '../styles/utilities.scss' as *;

.filter-input {
  flex-direction: column;
  gap: 4px;
  
  .filter-label {
    font-size: 12px; color: #666; margin-bottom: 4px;
  }
  
  .input-container {
    position: relative;
    
    .main-input {
      width: 160px;
    }
    
    .advanced-btn {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      transition: all 0.3s ease;
      
      &:hover {
        color: $color-primary;
      }
    }
  }
  
  .advanced-panel {
    margin-top: $spacing-sm;
    padding: $spacing-md;
    background: white;
    border: 1px solid $color-border;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .condition-row {
      display: flex;
      gap: 8px;
      margin-bottom: 8px;
      
      .operator-select {
        width: 120px;
      }
      
      .value-input {
        flex: 1;
      }
      
      .remove-btn {
        transition: all 0.3s ease;
        
        &:hover {
          color: $color-error;
        }
      }
    }
    
    .add-condition {
      width: 100%;
      border-style: dashed;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: $color-primary;
        color: $color-primary;
      }
    }
  }
  
  .keywords-modal {
    .keywords-input {
      margin-bottom: 12px;
    }
    
    .keywords-preview {
      padding: $spacing-sm;
      background: #f5f5f5;
      border-radius: 4px;
      font-size: 12px;
      color: $color-text-secondary;
      
      .keyword-tag {
        display: inline-block;
        padding: 2px 6px;
        margin: 2px;
        background: $color-primary;
        color: white;
        border-radius: 3px;
        font-size: 11px;
      }
    }
  }
}
</style>