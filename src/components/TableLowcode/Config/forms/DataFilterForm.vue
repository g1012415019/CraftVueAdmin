<template>
  <div class="data-filter-settings">
    <n-form label-placement="left" label-width="70px" size="small">
      
      <!-- 数据过滤 -->
      <div class="config-section">
        <div class="section-title">数据过滤</div>

        <div class="help-section">
          <div class="help-item">
            <strong>数据过滤：</strong>添加筛选条件，在视图中显示符合筛选条件的记录，支持多条件组合
          </div>
          <div class="help-item">
            <strong>条件关系：</strong>AND表示所有条件都满足，OR表示满足任一条件即可
          </div>
        </div>
      </div>

      <!-- 过滤条件 -->
      <div class="config-section">
        <div class="section-title">过滤条件</div>
        
        <!-- 批量操作 -->
        <div class="batch-actions" style="margin-bottom: 12px;">
          <n-space>
            <n-select
              v-model:value="selectedFields"
              :options="fieldOptions"
              placeholder="选择字段"
              multiple
              size="small"
              style="width: 180px;"
            />
            <n-button 
              @click="addGroup" 
              size="small"
              type="primary"
            >
              添加条件组
            </n-button>
          </n-space>
        </div>
        
        <!-- 条件组列表 -->
        <div class="filter-groups">
          <template v-for="(group, groupIndex) in formState.groups" :key="groupIndex">
            <div class="condition-group">
              <div class="group-header">
                <n-input
                  v-model:value="group.name"
                  placeholder="条件组名称"
                  size="small"
                  style="width: 120px;"
                />
                <n-button 
                  @click="removeGroup(groupIndex)"
                  type="error"
                  size="small"
                  :disabled="formState.groups.length === 1"
                >
                  删除组
                </n-button>
              </div>
              
              <div class="group-conditions">
                <div 
                  v-for="(condition, condIndex) in group.conditions" 
                  :key="condIndex"
                  class="condition-row"
                >
                  <n-select
                    v-model:value="condition.field"
                    :options="fieldOptions"
                    placeholder="字段"
                    size="small"
                    style="width: 120px;"
                  />
                  <n-select
                    v-model:value="condition.operator"
                    :options="operatorOptions"
                    placeholder="操作"
                    size="small"
                    style="width: 100px;"
                    @update:value="onOperatorChange(condition)"
                  />
                  <n-input
                    v-model:value="condition.value"
                    placeholder="值"
                    size="small"
                    style="width: 120px;"
                  />
                  <n-button 
                    @click="removeCondition(groupIndex, condIndex)"
                    type="error"
                    size="small"
                  >
                    删除
                  </n-button>
                </div>
                
                <n-button 
                  @click="addCondition(groupIndex)" 
                  dashed 
                  size="small"
                  style="width: 100%; margin-top: 8px;"
                >
                  + 添加条件
                </n-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, withDefaults, defineProps, defineEmits } from 'vue'
import type { DataFilterConfig } from '../../types/config/dataFilter'
import type { TableColumn } from '../../types/table/column'
import { ConfigManager } from '../../utils/configManager'

// ==================== 类型定义 ====================

interface Props {
  initialConfig?: Partial<DataFilterConfig>
  columns?: TableColumn[]
}

// ==================== 组件定义 ====================

const props = withDefaults(defineProps<Props>(), {
  initialConfig: () => ({}),
  columns: () => []
})

const emit = defineEmits<{
  configChange: [config: DataFilterConfig]
}>()

// ==================== 组件内状态 ====================

const formState = ref<DataFilterConfig>({
  // 使用 ConfigManager 提供的默认值
  ...ConfigManager.getDataFilterDefaults(),
  // 额外的默认配置
  groups: [{
    name: '条件组 1',
    logic: 'AND',
    conditions: []
  }],
  groupLogic: 'AND',
  
  // 合并Props传入的初始配置
  ...props.initialConfig
})

const selectedFields = ref<string[]>([])

// ==================== 计算属性 ====================

const fieldOptions = computed(() => {
  return props.columns.map(col => ({
    label: col.title || col.key,
    value: col.key
  }))
})

// ==================== 常量定义 ====================

const operatorOptions = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '包含', value: 'contains' },
  { label: '不包含', value: 'not_contains' },
  { label: '大于', value: 'gt' },
  { label: '小于', value: 'lt' },
  { label: '≥', value: 'gte' },
  { label: '≤', value: 'lte' },
]

// ==================== 工具函数 ====================

const emitConfigChange = () => {
  const configCopy = { ...formState.value }
  emit('configChange', configCopy)
}

const onOperatorChange = (condition: any) => {
  condition.value = ''
}

const addGroup = () => {
  const newIndex = formState.value.groups?.length || 0
  formState.value.groups?.push({
    name: `条件组 ${newIndex + 1}`,
    logic: 'AND',
    conditions: []
  })
}

const removeGroup = (groupIndex: number) => {
  formState.value.groups?.splice(groupIndex, 1)
}

const addCondition = (groupIndex: number) => {
  formState.value.groups?.[groupIndex]?.conditions?.push({
    field: '',
    operator: 'eq',
    value: ''
  })
}

const removeCondition = (groupIndex: number, conditionIndex: number) => {
  formState.value.groups?.[groupIndex]?.conditions?.splice(conditionIndex, 1)
}

// ==================== 生命周期 ====================

onMounted(() => {
  emitConfigChange()
})

watch(
  () => formState.value,
  () => {
    emitConfigChange()
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
@use '../../styles/utilities.scss' as *;

.data-filter-settings {
  font-size: 14px;
  padding: $spacing-md;
}

.config-section {
  margin-bottom: $spacing-lg;
}

.section-title {
  font-weight: 600;
  margin-bottom: $spacing-sm;
}

.help-section {
  margin-bottom: $spacing-md;
  
  .help-item {
    font-size: 12px;
    color: $color-text-secondary;
    margin-bottom: 4px;
  }
}

.condition-group {
  border: 1px solid $color-border;
  border-radius: 4px;
  padding: $spacing-md;
  margin-bottom: $spacing-md;
  
  .group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
  }
  
  .condition-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }
}
</style>
