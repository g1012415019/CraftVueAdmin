<template>
  <div class="filter-number">
    <n-text class="filter-label">{{ config?.label }}</n-text>
    <n-input-number
      v-model:value="numberValue"
      :placeholder="config?.placeholder || `请输入${config?.label}`"
      size="small"
      clearable
      class="number-input"
      @update:value="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface FilterConfig {
  key: string
  label: string
  placeholder?: string
}

interface Props {
  config: FilterConfig
  modelValue?: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number | null]
  'update': [key: string, value: number | null]
}>()

const numberValue = ref<number | null>(props.modelValue || null)

const handleUpdate = (value: number | null) => {
  numberValue.value = value
  emit('update:modelValue', value)
  emit('update', props.config.key, value)
}

watch(() => props.modelValue, (newValue) => {
  numberValue.value = newValue || null
})
</script>

<style lang="scss" scoped>
@use '../styles/utilities.scss' as *;

.filter-number {
  display: flex;
  flex-direction: column;
  
  .filter-label {
    font-size: 12px; color: #666; margin-bottom: 4px;
  }
  
  .number-input {
    width: 160px;
  }
}
</style>