<template>
  <div class="data-filter-settings">
    <div class="section-header">
      <n-text class="section-title">数据过滤</n-text>
      <n-text depth="3">设置表格的数据过滤条件</n-text>
    </div>

    <div class="help-section">
      <div class="help-item">
        <strong>数据过滤：</strong>添加筛选条件，在视图中显示符合筛选条件的记录，支持多条件组合
      </div>
      <div class="help-item">
        <strong>条件关系：</strong>AND表示所有条件都满足，OR表示满足任一条件即可
      </div>
    </div>

    <!-- 批量操作 -->
    <div class="batch-actions">
      <n-space vertical>
        <n-space>
          <n-select
            v-model:value="selectedFields"
            :options="fieldOptions"
            placeholder="选择字段"
            multiple
            size="small"
            style="width: 180px;"
            max-tag-count="responsive"
          />
          <n-select
            v-model:value="targetGroupIndex"
            :options="groupOptions"
            placeholder="选择组"
            size="small"
            style="width: 120px;"
          />
          <n-button 
            @click="batchAddCondition" 
            size="small"
            type="primary"
            :disabled="selectedFields.length === 0"
          >
            批量添加
          </n-button>
          <n-button 
            @click="clearAllConditions" 
            size="small"
            type="error"
            :disabled="getTotalConditionsCount() === 0"
          >
            清空全部
          </n-button>
        </n-space>
        <div class="condition-summary" :class="{ 'has-errors': hasLogicErrors() }">
          <n-text style="font-size: 12px; font-weight: 500;" :class="hasLogicErrors() ? 'error-text' : 'normal-text'">
            {{ getConditionSummary() }}
          </n-text>
          <div v-if="hasLogicErrors()" class="error-hints">
            <n-text style="font-size: 11px; color: #ff4d4f;">
              ⚠️ {{ getErrorHints().join('；') }}
            </n-text>
          </div>
        </div>
      </n-space>
    </div>

    <!-- 条件组列表 -->
    <div class="filter-groups">
      <template v-for="(group, groupIndex) in localConfig.groups" :key="groupIndex">
        <div class="condition-group">
          <div class="group-header">
            <n-input
              v-model:value="group.name"
              placeholder="条件组名称"
              size="small"
              style="width: 120px;"
              @blur="updateGroupName(groupIndex)"
            />
            <n-button 
              @click="removeGroup(groupIndex)"
              type="error"
              size="small"
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
              <div class="condition-prefix">
                <span v-if="condIndex === 0" class="condition-when-prefix">当</span>
                <span 
                  v-else
                  class="condition-logic-prefix"
                  @click="toggleConditionLogic(groupIndex, condIndex)"
                  :title="`点击切换为${(condition.logic || 'AND') === 'AND' ? '或' : '且'}`"
                >
                  {{ (condition.logic || 'AND') === 'AND' ? '且' : '或' }}
                </span>
              </div>
              
              <div class="condition-inputs">
                <n-select
                  v-model:value="condition.field"
                  :options="fieldOptions"
                  placeholder="字段"
                  size="small"
                  style="width: 140px;"
                />
                <n-select
                  v-model:value="condition.operator"
                  :options="operatorOptions"
                  placeholder="操作"
                  size="small"
                  style="width: 120px;"
                  @update:value="onOperatorChange(condition)"
                />
                
                <!-- 普通输入 -->
                <n-input
                  v-if="!isRangeOperator(condition.operator)"
                  v-model:value="condition.value"
                  placeholder="值"
                  size="small"
                  style="width: 140px;"
                />
                
                <!-- 范围输入 -->
                <div v-else class="range-inputs">
                  <n-input-number
                    v-model:value="condition.minValue"
                    placeholder="最小值"
                    size="small"
                    style="width: 90px;"
                  />
                  <span style="margin: 0 4px;">-</span>
                  <n-input-number
                    v-model:value="condition.maxValue"
                    placeholder="最大值"
                    size="small"
                    style="width: 90px;"
                  />
                </div>
              </div>
              
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
        
        <!-- 组间关系连接符 -->
        <div 
          v-if="groupIndex < (localConfig.groups?.length || 0) - 1" 
          class="group-connector"
        >
          <div class="connector-line"></div>
          <span 
            class="connector-symbol"
            @click="toggleGroupLogic(groupIndex)"
            :title="`点击切换为${(group.groupLogic || 'AND') === 'AND' ? '或' : '且'}`"
          >
            {{ (group.groupLogic || 'AND') === 'AND' ? '且' : '或' }}
          </span>
          <div class="connector-line"></div>
        </div>
      </template>
      
      <n-button 
        @click="addGroup" 
        dashed 
        size="small"
        style="width: 100%; margin-top: 12px;"
      >
        + 添加条件组
      </n-button>
    </div>
    
    <!-- 空状态 -->
    <div v-if="!localConfig.groups?.length" class="empty">
      <n-text depth="3">暂无过滤条件</n-text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { DataFilterConfig, FilterCondition, FilterGroup, TableColumn } from '../../types'

const props = withDefaults(defineProps<{
  initialConfig?: Partial<DataFilterConfig>
  columns?: TableColumn[]
}>(), {
  initialConfig: () => ({}),
  columns: () => []
})

const emit = defineEmits<{
  'config-change': [config: DataFilterConfig]
}>()

// 本地配置状态
const localConfig = ref<DataFilterConfig>({
  enabled: true,
  groups: [{
    name: '条件组 1',
    logic: 'AND',
    groupLogic: 'AND',
    conditions: []
  }],
  ...props.initialConfig
})

const selectedFields = ref<string[]>([])
const targetGroupIndex = ref<number>(-1)

// 字段选项
const fieldOptions = computed(() => {
  return props.columns?.map(col => ({
    label: col.label,
    value: col.key
  })) || []
})

// 组选项
const groupOptions = computed(() => {
  const options = localConfig.value.groups?.map((group, index) => ({
    label: group.name || `组 ${index + 1}`,
    value: index
  })) || []
  
  options.push({ label: '+ 新增组', value: -1 })
  return options
})

// 操作符选项
const operatorOptions = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '包含', value: 'contains' },
  { label: '不包含', value: 'not_contains' },
  { label: '大于', value: 'gt' },
  { label: '小于', value: 'lt' },
  { label: '≥', value: 'gte' },
  { label: '≤', value: 'lte' },
  { label: '在范围内', value: 'between' },
  { label: '不在范围内', value: 'not_between' }
]

// 判断是否为范围操作符
const isRangeOperator = (operator: string) => {
  return ['between', 'not_between'].includes(operator)
}

// 操作符变化时重置值
const onOperatorChange = (condition: FilterCondition) => {
  if (isRangeOperator(condition.operator)) {
    condition.minValue = undefined
    condition.maxValue = undefined
    condition.value = ''
  } else {
    condition.value = ''
    condition.minValue = undefined
    condition.maxValue = undefined
  }
}

// 添加条件组
const addGroup = () => {
  const newIndex = (localConfig.value.groups?.length || 0) + 1
  const newGroup: FilterGroup = {
    name: `条件组 ${newIndex}`,
    logic: 'AND',
    groupLogic: 'AND',
    conditions: []
  }
  
  if (!localConfig.value.groups) {
    localConfig.value.groups = []
  }
  localConfig.value.groups.push(newGroup)
  emitChange()
}

// 删除条件组
const removeGroup = (groupIndex: number) => {
  localConfig.value.groups?.splice(groupIndex, 1)
  emitChange()
}

// 更新组名
const updateGroupName = (groupIndex: number) => {
  const group = localConfig.value.groups?.[groupIndex]
  if (group && (!group.name || group.name.trim() === '')) {
    group.name = `条件组 ${groupIndex + 1}`
  }
  emitChange()
}

// 添加条件
const addCondition = (groupIndex: number) => {
  const newCondition: FilterCondition = {
    field: '',
    operator: 'eq',
    value: '',
    logic: 'AND'
  }
  
  const group = localConfig.value.groups?.[groupIndex]
  if (group) {
    if (!group.conditions) {
      group.conditions = []
    }
    group.conditions.push(newCondition)
    emitChange()
  }
}

// 删除条件
const removeCondition = (groupIndex: number, condIndex: number) => {
  localConfig.value.groups?.[groupIndex]?.conditions?.splice(condIndex, 1)
  emitChange()
}

// 批量添加条件
const batchAddCondition = () => {
  if (selectedFields.value.length === 0) return
  
  let groupIndex = targetGroupIndex.value
  
  if (groupIndex === -1) {
    addGroup()
    groupIndex = (localConfig.value.groups?.length || 1) - 1
  }
  
  selectedFields.value.forEach(fieldKey => {
    const newCondition: FilterCondition = {
      field: fieldKey,
      operator: 'eq',
      value: '',
      logic: 'AND'
    }
    
    const group = localConfig.value.groups?.[groupIndex]
    if (group) {
      if (!group.conditions) {
        group.conditions = []
      }
      group.conditions.push(newCondition)
    }
  })
  
  selectedFields.value = []
  emitChange()
}

// 清空所有条件
const clearAllConditions = () => {
  localConfig.value.groups = []
  emitChange()
}

// 获取总条件数
const getTotalConditionsCount = () => {
  return localConfig.value.groups?.reduce((total, group) => {
    return total + (group.conditions?.length || 0)
  }, 0) || 0
}

// 切换组间关系
const toggleGroupLogic = (groupIndex: number) => {
  const group = localConfig.value.groups?.[groupIndex]
  if (group) {
    group.groupLogic = (group.groupLogic || 'AND') === 'AND' ? 'OR' : 'AND'
    emitChange()
  }
}

// 切换条件间关系
const toggleConditionLogic = (groupIndex: number, condIndex: number) => {
  const condition = localConfig.value.groups?.[groupIndex]?.conditions?.[condIndex]
  if (condition) {
    condition.logic = (condition.logic || 'AND') === 'AND' ? 'OR' : 'AND'
    emitChange()
  }
}

// 获取条件摘要
const getConditionSummary = () => {
  const groups = localConfig.value.groups || []
  if (groups.length === 0 || groups.every(g => (g.conditions?.length || 0) === 0)) {
    return '暂无过滤条件'
  }
  
  const groupTexts = groups.map((group, groupIndex) => {
    if (!group.conditions?.length) return ''
    
    const conditionTexts = group.conditions.map((cond, index) => {
      const field = cond.field || '字段'
      const operator = getOperatorText(cond.operator)
      const value = getValueText(cond)
      
      if (index === 0) {
        return `${field}${operator}${value}`
      } else {
        const prefix = cond.logic === 'OR' ? '或' : '且'
        return `${prefix}${field}${operator}${value}`
      }
    })
    
    return conditionTexts.join('')
  }).filter(text => text)
  
  if (groupTexts.length === 0) return '暂无过滤条件'
  if (groupTexts.length === 1) return `当${groupTexts[0]}`
  
  let result = `当${groupTexts[0]}`
  for (let i = 1; i < groupTexts.length; i++) {
    const prevGroup = groups[i - 1]
    const groupLogic = (prevGroup.groupLogic || 'AND') === 'AND' ? '且' : '或'
    result += `${groupLogic}${groupTexts[i]}`
  }
  
  return result
}

// 获取操作符文本
const getOperatorText = (operator: string) => {
  const operatorMap: Record<string, string> = {
    'eq': '等于',
    'ne': '不等于', 
    'contains': '包含',
    'not_contains': '不包含',
    'gt': '大于',
    'lt': '小于',
    'gte': '≥',
    'lte': '≤',
    'between': '在范围',
    'not_between': '不在范围'
  }
  return operatorMap[operator] || operator
}

// 获取值文本
const getValueText = (condition: FilterCondition) => {
  if (isRangeOperator(condition.operator)) {
    const min = condition.minValue ?? '最小值'
    const max = condition.maxValue ?? '最大值'
    return `${min}-${max}`
  }
  return condition.value || '值'
}

// 检查是否有逻辑错误
const hasLogicErrors = () => {
  return getErrorHints().length > 0
}

// 获取错误提示
const getErrorHints = () => {
  const errors: string[] = []
  const groups = localConfig.value.groups || []
  
  const hasIncompleteConditions = groups.some(group => 
    group.conditions?.some(cond => 
      (cond.field && !cond.operator) || (!cond.field && cond.operator)
    )
  )
  
  if (hasIncompleteConditions) {
    errors.push('存在未完成的条件配置')
  }
  
  return errors
}

// 发送配置变更
const emitChange = () => {
  emit('config-change', { ...localConfig.value })
}
</script>

<style lang="scss" scoped>
.data-filter-settings {
  padding: 16px;
}

.section-header {
  margin-bottom: 16px;
  
  .section-title {
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 4px;
  }
}

.help-section {
  margin-bottom: 16px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #18a058;
  
  .help-item {
    font-size: 12px;
    color: #666;
    margin-bottom: 4px;
  }
}

.batch-actions {
  padding: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  margin-bottom: 16px;
}

.condition-summary {
  padding: 8px 12px;
  background: #f0f8ff;
  border: 1px solid #91d5ff;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
  
  &.has-errors {
    background: #fff2f0;
    border-color: #ffccc7;
    border-left-color: #ff4d4f;
  }
}

.error-hints {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #ffccc7;
}

.condition-group {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  margin-bottom: 12px;
  background: #fafbfc;
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.condition-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.condition-prefix {
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.condition-logic-prefix {
  padding: 2px 4px;
  background: #f0f2f5;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  
  &:hover {
    background: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
  }
}

.condition-when-prefix {
  padding: 2px 4px;
  background: #f6ffed;
  border: 1px solid #b7eb8f;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  color: #52c41a;
}

.condition-inputs {
  display: flex;
  gap: 8px;
  flex: 1;
  align-items: center;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.group-connector {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;
  gap: 8px;
}

.connector-line {
  flex: 1;
  height: 1px;
  background: #d9d9d9;
}

.connector-symbol {
  padding: 4px 8px;
  background: #f0f2f5;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  font-size: 14px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  min-width: 24px;
  text-align: center;
  
  &:hover {
    background: #e6f7ff;
    border-color: #1890ff;
    color: #1890ff;
  }
}

.normal-text {
  color: #333;
}

.error-text {
  color: #ff4d4f;
}
</style>
