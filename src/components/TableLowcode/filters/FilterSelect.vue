<template>
  <div class="filter-select">
    <n-text class="filter-label">{{ config?.label }}</n-text>
    <n-select
      v-model:value="selectValue"
      :options="selectOptions"
      :placeholder="`请选择${config?.label}`"
      :multiple="config?.allowMultiple"
      size="small"
      clearable
      style="min-width: 120px;"
      @update:value="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface FilterConfig {
  key: string
  label: string
  allowMultiple?: boolean
  defaultValue?: string
  options?: Array<{ label: string; value: any }>
}

interface Props {
  config?: FilterConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [key: string, value: any]
}>()

const selectValue = ref(props.config?.defaultValue || (props.config?.allowMultiple ? [] : null))

// 默认选项
const defaultOptions = [
  { label: '启用', value: 'enabled' },
  { label: '禁用', value: 'disabled' },
  { label: '待审核', value: 'pending' },
  { label: '已完成', value: 'completed' }
]

const selectOptions = computed(() => {
  return props.config?.options || defaultOptions
})

const handleUpdate = (value: any) => {
  if (props.config) {
    emit('update', props.config.key, value)
  }
}

// 监听默认值变化
watch(() => props.config?.defaultValue, (newValue) => {
  if (newValue !== undefined) {
    selectValue.value = newValue
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
@use '../styles/utilities.scss' as *;

.filter-select {
  flex-direction: column;
  gap: 4px;
  
  .filter-label {
    font-size: 12px; color: #666; margin-bottom: 4px;
  }
  
  .select-input {
    width: 160px;
  }
}
</style>