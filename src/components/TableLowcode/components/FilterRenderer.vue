<template>
  <div class="filter-renderer">
    <component 
      :is="filterComponent" 
      :config="config"
      :value="value"
      @update="handleUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FilterInput from '../filters/FilterInput.vue'
import FilterNumber from '../filters/FilterNumber.vue'
import FilterDate from '../filters/FilterDate.vue'
import FilterDateRange from '../filters/FilterDateRange.vue'
import FilterSelect from '../filters/FilterSelect.vue'
import FilterCheckbox from '../filters/FilterCheckbox.vue'
import FilterSwitch from '../filters/FilterSwitch.vue'

// ==================== 组件定义 ====================

/**
 * 组件 Props 定义
 */
const props = defineProps<{
  /** 筛选器配置 */
  config?: any
  /** 筛选器值 */
  value?: any
}>()

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 值更新事件 */
  'update': [key: string, value: any]
}>()

// ==================== 筛选器映射 ====================

const filterComponents = {
  input: FilterInput,
  number: FilterNumber,
  date: FilterDate,
  daterange: FilterDateRange,
  select: FilterSelect,
  checkbox: FilterCheckbox,
  switch: FilterSwitch
}

// ==================== 计算属性 ====================

/**
 * 当前筛选器组件
 */
const filterComponent = computed(() => {
  const type = props.config?.type || 'input'
  return filterComponents[type] || FilterInput
})

// ==================== 事件处理 ====================

/**
 * 处理值更新事件
 */
const handleUpdate = (value: any) => {
  const key = props.config?.key || ''
  emit('update', key, value)
}
</script>

<style scoped>
.filter-renderer {
  display: inline-block;
  min-width: 120px;
}
</style>
