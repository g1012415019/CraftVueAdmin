<template>
  <div class="filter-radio">
    <n-text class="filter-label">{{ config?.label }}</n-text>
    <n-radio-group v-model:value="radioValue" @update:value="handleUpdate">
      <n-radio 
        v-for="option in radioOptions" 
        :key="option.value" 
        :value="option.value"
        size="small"
      >
        {{ option.label }}
      </n-radio>
    </n-radio-group>
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
  update: [key: string, value: any]
}>()

const radioValue = ref(null)

const defaultOptions = [
  { label: '全部', value: 'all' },
  { label: '是', value: 'yes' },
  { label: '否', value: 'no' }
]

const radioOptions = computed(() => {
  return props.config?.options || defaultOptions
})

const handleUpdate = (value: any) => {
  if (props.config) {
    emit('update', props.config.key, value)
  }
}
</script>

<style lang="scss" scoped>
@import "../styles/utilities.scss";

.filter-radio {
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
