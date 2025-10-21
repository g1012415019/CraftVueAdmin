<template>
  <div v-if="shouldShowFilters" class="filter-section">
    <div class="filter-container">
      <!-- 基础筛选 - 显示所有字段 -->
      <template v-for="field in filterBarFields" :key="field.key">
        <FilterInput 
          v-if="field.filterType === 'input'"
          :config="field"
          @update="handleFilterUpdate"
        />
        <FilterNumber 
          v-else-if="field.filterType === 'number'"
          :config="field"
          @update="handleFilterUpdate"
        />
        <FilterDate 
          v-else-if="field.filterType === 'date'"
          :config="field"
          @update="handleFilterUpdate"
        />
        <FilterDateRange 
          v-else-if="field.filterType === 'daterange'"
          :config="field"
          @update="handleFilterUpdate"
        />
        <FilterSelect 
          v-else-if="field.filterType === 'select'"
          :config="field"
          @update="handleFilterUpdate"
        />
        <FilterCheckbox 
          v-else-if="field.filterType === 'checkbox'"
          :config="field"
          @update="handleFilterUpdate"
        />
        <FilterRadio 
          v-else-if="field.filterType === 'radio'"
          :config="field"
          @update="handleFilterUpdate"
        />
        <FilterSwitch 
          v-else-if="field.filterType === 'switch'"
          :config="field"
          @update="handleFilterUpdate"
        />
      </template>
    </div>

    <!-- 操作区域 -->
    <div class="filter-actions">
      <!-- 高级筛选按钮 -->
      <n-button 
        v-if="advancedFilterFields && advancedFilterFields.length > 0"
        size="small" 
        @click="showAdvanced = true"
      >
        <template #icon>
          <n-icon>
            <svg viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
            </svg>
          </n-icon>
        </template>
        高级筛选
      </n-button>
      
      <n-button size="small" type="primary" @click="$emit('search')">
        搜索
      </n-button>
      <n-button size="small" @click="$emit('reset')">
        重置
      </n-button>
    </div>

    <!-- 高级筛选抽屉 -->
    <n-drawer 
      v-model:show="showAdvanced" 
      :width="360"
      placement="right"
    >
      <n-drawer-content>
        <template #header>
          <div class="drawer-header">
            <n-icon size="18" style="color: #1890ff;">
              <svg viewBox="0 0 24 24">
                <path fill="currentColor" d="M14,12V19.88C14.04,20.18 13.94,20.5 13.71,20.71C13.32,21.1 12.69,21.1 12.3,20.71L10.29,18.7C10.06,18.47 9.96,18.16 10,17.87V12H9.97L4.21,4.62C3.87,4.19 3.95,3.56 4.38,3.22C4.57,3.08 4.78,3 5,3V3H19V3C19.22,3 19.43,3.08 19.62,3.22C20.05,3.56 20.13,4.19 19.79,4.62L14.03,12H14Z"/>
              </svg>
            </n-icon>
            <span style="font-weight: 600; font-size: 16px;">高级筛选</span>
          </div>
        </template>

        <div class="advanced-content">
          <div class="filter-grid">
            <template v-for="field in advancedFilterFields" :key="field.key">
              <div class="filter-item">
                <FilterInput 
                  v-if="field.filterType === 'input'"
                  :config="field"
                  @update="handleFilterUpdate"
                />
                <FilterNumber 
                  v-else-if="field.filterType === 'number'"
                  :config="field"
                  @update="handleFilterUpdate"
                />
                <FilterDate 
                  v-else-if="field.filterType === 'date'"
                  :config="field"
                  @update="handleFilterUpdate"
                />
                <FilterDateRange 
                  v-else-if="field.filterType === 'daterange'"
                  :config="field"
                  @update="handleFilterUpdate"
                />
                <FilterSelect 
                  v-else-if="field.filterType === 'select'"
                  :config="field"
                  @update="handleFilterUpdate"
                />
                <FilterCheckbox 
                  v-else-if="field.filterType === 'checkbox'"
                  :config="field"
                  @update="handleFilterUpdate"
                />
                <FilterRadio 
                  v-else-if="field.filterType === 'radio'"
                  :config="field"
                  @update="handleFilterUpdate"
                />
                <FilterSwitch 
                  v-else-if="field.filterType === 'switch'"
                  :config="field"
                  @update="handleFilterUpdate"
                />
              </div>
            </template>
          </div>
        </div>
        
        <template #footer>
          <div class="drawer-footer">
            <n-button quaternary @click="$emit('advanced-reset')">
              <template #icon>
                <n-icon>
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M17.65,6.35C16.2,4.9 14.21,4 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C15.73,20 18.84,17.45 19.73,14H17.65C16.83,16.33 14.61,18 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6C13.66,6 15.14,6.69 16.22,7.78L13,11H20V4L17.65,6.35Z"/>
                  </svg>
                </n-icon>
              </template>
              重置
            </n-button>
            <n-button type="primary" @click="handleAdvancedSearch">
              <template #icon>
                <n-icon>
                  <svg viewBox="0 0 24 24">
                    <path fill="currentColor" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                  </svg>
                </n-icon>
              </template>
              应用筛选
            </n-button>
          </div>
        </template>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FilterInput from '../filters/FilterInput.vue'
import FilterNumber from '../filters/FilterNumber.vue'
import FilterDate from '../filters/FilterDate.vue'
import FilterDateRange from '../filters/FilterDateRange.vue'
import FilterSelect from '../filters/FilterSelect.vue'
import FilterCheckbox from '../filters/FilterCheckbox.vue'
import FilterRadio from '../filters/FilterRadio.vue'
import FilterSwitch from '../filters/FilterSwitch.vue'

interface Props {
  visible?: boolean
  filterBarFields: any[]
  advancedFilterFields?: any[]
  filterValues?: Record<string, any>
  advancedFilterCount?: number
  showAdvanced?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-filter': [key: string, value: any]
  search: []
  reset: []
  'show-advanced': []
  'update-advanced': [value: boolean]
  'advanced-search': []
  'advanced-reset': []
}>()

const showAdvanced = ref(false)

const shouldShowFilters = computed(() => {
  const hasBasicFilters = props.filterBarFields.length > 0
  const hasAdvancedFilters = props.advancedFilterFields && props.advancedFilterFields.length > 0
  
  console.log('FilterSection 筛选显示判断:')
  console.log('- 基础筛选字段:', props.filterBarFields)
  console.log('- 高级筛选字段:', props.advancedFilterFields)
  console.log('- 是否显示:', hasBasicFilters || hasAdvancedFilters)
  
  return hasBasicFilters || hasAdvancedFilters
})

const handleFilterUpdate = (key: string, value: any) => {
  emit('update-filter', key, value)
}

const handleAdvancedSearch = () => {
  emit('advanced-search')
  showAdvanced.value = false
}
</script>

<style scoped>
.filter-section {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: center;
  padding: 12px;
  background: #fafbfc;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
  margin-bottom: 12px;
}

.filter-container {
  display: contents;
}

.filter-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.drawer-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.advanced-content {
  padding: 0;
}

.filter-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.filter-item {
  width: 100%;
}

.filter-item :deep(.filter-input),
.filter-item :deep(.filter-select),
.filter-item :deep(.filter-number),
.filter-item :deep(.filter-date),
.filter-item :deep(.filter-date-range),
.filter-item :deep(.filter-checkbox),
.filter-item :deep(.filter-radio),
.filter-item :deep(.filter-switch) {
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 6px;
}

.filter-item :deep(.filter-label) {
  text-align: left;
  min-width: auto;
  width: 100%;
  font-weight: 500;
}

.drawer-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 16px 0 0 0;
  border-top: 1px solid #f0f0f0;
}
</style>
