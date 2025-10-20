<template>
  <div class="filter-date">
    <n-text class="filter-label">{{ config?.label }}</n-text>
    <n-date-picker
      v-model:value="dateValue"
      type="date"
      :placeholder="`请选择${config?.label}`"
      size="small"
      clearable
      style="min-width: 140px;"
      @update:value="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface FilterConfig {
  key: string
  label: string
  defaultValue?: string
}

interface Props {
  config?: FilterConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [key: string, value: number | null]
}>()

const dateValue = ref<number | null>(null)

const handleUpdate = (value: number | null) => {
  if (props.config) {
    emit('update', props.config.key, value)
  }
}

// 监听默认值变化
watch(() => props.config?.defaultValue, (newValue) => {
  if (newValue) {
    dateValue.value = new Date(newValue).getTime()
  }
}, { immediate: true })
</script>

<style scoped>
.filter-date {
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
