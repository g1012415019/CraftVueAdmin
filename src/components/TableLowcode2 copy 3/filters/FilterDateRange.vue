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

<style scoped>
.filter-date-range {
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
