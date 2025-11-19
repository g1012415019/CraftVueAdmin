<template>
  <div class="filter-date-range">
    <n-text class="filter-label">{{ config?.label }}</n-text>
    <n-date-picker
      v-model:value="dateRangeValue"
      type="daterange"
      :placeholder="`请选择${config?.label}`"
      size="small"
      clearable
      style="min-width: 200px;"
      @update:value="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface FilterConfig {
  key: string
  label: string
}

interface Props {
  config?: FilterConfig
}

const props = defineProps<Props>()

const emit = defineEmits<{
  update: [key: string, value: [number, number] | null]
}>()

const dateRangeValue = ref<[number, number] | null>(null)

const handleUpdate = (value: [number, number] | null) => {
  if (props.config) {
    emit('update', props.config.key, value)
  }
}
</script>

<style lang="scss" scoped>
@use '../styles/utilities.scss' as *;

.filter-date-range {
  flex-direction: column;
  gap: 4px;
  
  .filter-label {
    font-size: 12px; color: #666; margin-bottom: 4px;
  }
  
  .date-range-picker {
    min-width: 200px;
  }
}
</style>
