<template>
  <div class="filter-switch">
    <n-text class="filter-label">{{ config?.label }}</n-text>
    <n-switch
      v-model:value="switchValue"
      size="small"
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
  update: [key: string, value: boolean]
}>()

const switchValue = ref(false)

const handleUpdate = (value: boolean) => {
  if (props.config) {
    emit('update', props.config.key, value)
  }
}

// 监听默认值变化
watch(() => props.config?.defaultValue, (newValue) => {
  if (newValue !== undefined) {
    switchValue.value = newValue === 'true' || newValue === true
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>


.filter-switch {
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
