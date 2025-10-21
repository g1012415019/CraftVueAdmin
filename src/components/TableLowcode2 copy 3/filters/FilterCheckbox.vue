<template>
  <div class="filter-checkbox">
    <n-text class="filter-label">{{ config?.label }}</n-text>
    <n-checkbox-group v-model:value="checkboxValue" @update:value="handleUpdate">
      <n-checkbox 
        v-for="option in checkboxOptions" 
        :key="option.value" 
        :value="option.value"
        size="small"
      >
        {{ option.label }}
      </n-checkbox>
    </n-checkbox-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface FilterConfig {
  key: string
  label: string
  options?: Array<{ label: string; value: any }>
}

interface Props {
  config?: FilterConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [key: string, value: any[]]
}>()

const checkboxValue = ref<any[]>([])

const defaultOptions = [
  { label: '选项1', value: 'option1' },
  { label: '选项2', value: 'option2' },
  { label: '选项3', value: 'option3' }
]

const checkboxOptions = computed(() => {
  return props.config?.options || defaultOptions
})

const handleUpdate = (value: any[]) => {
  if (props.config) {
    emit('update', props.config.key, value)
  }
}
</script>

<style scoped>
.filter-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 300px;
}

.filter-label {
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  min-width: 60px;
  text-align: right;
}
</style>
