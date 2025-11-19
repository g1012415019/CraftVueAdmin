<template>
  <div v-if="hasFilters" class="filter-section">
    <!-- 基础筛选 -->
    <div class="filter-container">
      <FilterRenderer 
        v-for="field in basicFilters" 
        :key="field.key"
        :config="field"
        :value="filterValues[field.key]"
        @update="updateFilter"
      />
      
      <!-- 操作按钮 -->
      <div class="filter-actions">
        <n-button type="primary" size="small" @click="handleSearch" :loading="isSearching">
          搜索
        </n-button>
        <n-button size="small" @click="handleReset">重置</n-button>
        <n-button 
          v-if="hasAdvancedFilters"
          size="small" 
          @click="toggleAdvanced"
          :type="showAdvanced ? 'primary' : 'default'"
        >
          高级筛选
          <n-badge v-if="advancedFilterCount > 0" :value="advancedFilterCount" />
        </n-button>
      </div>
    </div>

    <!-- 高级筛选面板 -->
    <div v-if="showAdvanced" class="advanced-filter-panel">
      <n-divider>高级筛选</n-divider>
      <div class="advanced-filter-container">
        <FilterRenderer 
          v-for="field in advancedFilters" 
          :key="field.key"
          :config="field"
          :value="filterValues[field.key]"
          @update="updateFilter"
        />
      </div>
      <div class="advanced-filter-actions">
        <n-button type="primary" size="small" @click="handleAdvancedSearch" :loading="isSearching">
          应用筛选
        </n-button>
        <n-button size="small" @click="handleAdvancedReset">清空筛选</n-button>
        <n-button size="small" @click="saveAsPreset">保存预设</n-button>
      </div>
    </div>

    <!-- 筛选预设 -->
    <div v-if="filterPresets.length > 0" class="filter-presets">
      <n-divider>筛选预设</n-divider>
      <n-space size="small">
        <n-tag 
          v-for="preset in filterPresets" 
          :key="preset.id"
          :type="preset.active ? 'primary' : 'default'"
          closable
          @click="applyPreset(preset)"
          @close="removePreset(preset)"
        >
          {{ preset.name }}
        </n-tag>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import FilterRenderer from './FilterRenderer.vue'
import type { FilterListConfig } from '../types'
import { msg } from '../utils/message'

// ==================== 组件定义 ====================


const props = defineProps<{
   config?: FilterListConfig
}>()

const emit = defineEmits<{
  search: [filters: Record<string, any>]
  reset: []
}>()

// ==================== 筛选管理状态 ====================

const filterValues = ref<Record<string, any>>({})
const filterPresets = ref<any[]>([])
const isSearching = ref(false)
const showAdvanced = ref(false)

// ==================== 基础操作 ====================

const updateFilter = (key: string, value: any) => {
  filterValues.value[key] = value
}

const resetFilters = (fields?: string[]) => {
  if (fields) {
    fields.forEach(key => {
      filterValues.value[key] = null
    })
  } else {
    Object.keys(filterValues.value).forEach(key => {
      filterValues.value[key] = null
    })
  }
}

const getActiveFilters = () => {
  return Object.entries(filterValues.value)
    .filter(([_, value]) => value !== null && value !== undefined && value !== '')
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {} as Record<string, any>)
}

// ==================== 搜索操作 ====================

const handleSearch = () => {
  isSearching.value = true
  
  setTimeout(() => {
    isSearching.value = false
    msg.success('搜索完成')
    emit('search', filterValues.value)
  }, 500)
}

const handleReset = () => {
  resetFilters()
  msg.success('已重置筛选条件')
  emit('reset')
}

const handleAdvancedSearch = () => {
  handleSearch()
  showAdvanced.value = false
}

const handleAdvancedReset = () => {
  const advancedFieldKeys = advancedFilters.value.map(f => f.key)
  resetFilters(advancedFieldKeys)
  msg.success('已清空高级筛选')
}

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

// ==================== 预设管理 ====================

const saveAsPreset = () => {
  const activeFilters = getActiveFilters()
  
  if (Object.keys(activeFilters).length === 0) {
    msg.warning('请先设置筛选条件')
    return
  }

  const presetName = `筛选预设 ${filterPresets.value.length + 1}`
  const preset = {
    id: Date.now(),
    name: presetName,
    filters: { ...activeFilters },
    active: false,
    createTime: new Date().toISOString()
  }
  
  filterPresets.value.push(preset)
  msg.success(`已保存筛选预设：${presetName}`)
}

const applyPreset = (preset: any) => {
  resetFilters()
  Object.assign(filterValues.value, preset.filters)
  
  filterPresets.value.forEach(p => p.active = false)
  preset.active = true
  
  msg.success(`已应用筛选预设：${preset.name}`)
  handleSearch()
}

const removePreset = (preset: any) => {
  const index = filterPresets.value.findIndex(p => p.id === preset.id)
  if (index > -1) {
    filterPresets.value.splice(index, 1)
    msg.success(`已删除筛选预设：${preset.name}`)
  }
}

// ==================== 计算属性 ====================

const hasFilters = computed(() => 
  props.config?.filters && props.config.filters.length > 0
)

const basicFilters = computed(() => 
  props.config?.filters?.filter(f => f.position === 'basic' || f.position === 'both') || []
)

const advancedFilters = computed(() => 
  props.config?.filters?.filter(f => f.position === 'advanced' || f.position === 'both') || []
)

const hasAdvancedFilters = computed(() => advancedFilters.value.length > 0)

const advancedFilterCount = computed(() => {
  return advancedFilters.value.reduce((count, field) => {
    const value = filterValues.value[field.key]
    if (value !== null && value !== undefined && value !== '') {
      return count + 1
    }
    return count
  }, 0)
})
</script>

<style scoped>
.filter-section {
  padding: 16px;
  background: #fafafa;
  border-bottom: 1px solid #e8e8e8;
}

.filter-container {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: flex-end;
}

.filter-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-left: auto;
}

.advanced-filter-panel {
  margin-top: 16px;
  padding: 16px;
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
}

.advanced-filter-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.advanced-filter-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.filter-presets {
  margin-top: 12px;
}

@media (max-width: 768px) {
  .filter-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-actions {
    margin-left: 0;
    justify-content: center;
  }
  
  .advanced-filter-container {
    grid-template-columns: 1fr;
  }
}
</style>
