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
        
        <!-- 固定顶部区域 -->
        <div class="fixed-top-area">
          <!-- 批量操作 -->
          <div class="batch-actions" style="margin-bottom: 12px;">
            <n-space vertical>
              <n-space>
                <n-select
                  v-model:value="selectedFields"
                  :options="fieldOptions"
                  placeholder="选择字段"
                  multiple
                  size="small"
                  style="width: 180px; min-width: 180px;"
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
        </div>
        
        <!-- 滚动区域 -->
        <div class="scrollable-area">
          <div class="filter-groups">
          <template v-for="(group, groupIndex) in config.dataFilter.groups" :key="groupIndex">
            <!-- 条件组 -->
            <div class="condition-group">
            <div class="group-header">
              <n-input
                v-model:value="group.name"
                placeholder="条件组名称"
                size="tiny"
                style="width: 120px;"
                @blur="updateGroupName(groupIndex)"
              />
              <div class="group-actions">
                <n-button 
                  @click="removeGroup(groupIndex)"
                  type="error"
                  size="tiny"
                  circle
                  :disabled="config.dataFilter.groups.length === 1"
                >
                  ×
                </n-button>
              </div>
            </div>
            
            <div class="group-conditions">
              <div 
                v-for="(condition, condIndex) in group.conditions" 
                :key="condIndex"
                class="condition-row"
              >
                <!-- 左侧连接符 -->
                <div class="condition-prefix">
                  <span 
                    v-if="condIndex === 0"
                    class="condition-when-prefix"
                  >
                    当
                  </span>
                  <span 
                    v-else-if="group.conditions.length > 1"
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
                    v-if="!isRangeOperator(condition.operator) && !isSelectOperator(condition.operator)"
                    v-model:value="condition.value"
                    placeholder="值"
                    size="small"
                    style="width: 140px;"
                  />
                  
                  <!-- 范围输入 -->
                  <div v-else-if="isRangeOperator(condition.operator)" class="range-inputs">
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
                  
                  <!-- 下拉选择 -->
                  <n-select
                    v-else-if="isSelectOperator(condition.operator)"
                    v-model:value="condition.value"
                    :options="getFieldOptions(condition.field)"
                    placeholder="请选择"
                    size="small"
                    style="width: 140px;"
                    clearable
                  />
                </div>
                <n-button 
                  @click="removeCondition(groupIndex, condIndex)"
                  type="error"
                  size="tiny"
                  circle
                  style="margin-left: 8px;"
                >
                  ×
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
            v-if="groupIndex < config.dataFilter.groups.length - 1" 
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
        </div>
      </div>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { inject, computed, ref, type Ref } from 'vue';

const config = inject('tableConfig') as Ref<any>;
const selectedFields = ref<string[]>([]);
const targetGroupIndex = ref<number>(-1); // 默认选择新增组

// 初始化数据过滤配置
if (!config.value.dataFilter) {
  config.value.dataFilter = {
    groups: [{
      name: '条件组 1',
      logic: 'AND',
      conditions: []
    }],
    groupLogic: 'AND'
  };
}

const fieldOptions = computed(() => {
  return config.value.columns?.map((col: any) => ({
    label: col.title || col.key,
    value: col.key
  })) || [];
});

const groupOptions = computed(() => {
  const options = config.value.dataFilter.groups.map((group: any, index: number) => ({
    label: group.name || `组 ${index + 1}`,
    value: index
  }));
  
  // 添加新增组选项
  options.push({
    label: '+ 新增组',
    value: -1
  });
  
  return options;
});

const operatorOptions = [
  { label: '等于', value: 'eq' },
  { label: '不等于', value: 'ne' },
  { label: '包含', value: 'contains' },
  { label: '不包含', value: 'not_contains' },
  { label: '是', value: 'is' },
  { label: '不是', value: 'is_not' },
  { label: '大于', value: 'gt' },
  { label: '小于', value: 'lt' },
  { label: '≥', value: 'gte' },
  { label: '≤', value: 'lte' },
  { label: '在范围内', value: 'between' },
  { label: '不在范围内', value: 'not_between' },
];

// 判断是否为范围操作符
const isRangeOperator = (operator: string) => {
  return ['between', 'not_between'].includes(operator);
};

// 判断是否为选择操作符
const isSelectOperator = (operator: string) => {
  return ['is', 'is_not'].includes(operator);
};

// 获取字段的选项值
const getFieldOptions = (fieldKey: string) => {
  const field = config.value.columns?.find((col: any) => col.key === fieldKey);
  
  // 如果字段有预定义选项，返回选项
  if (field?.options) {
    return field.options.map((opt: any) => ({
      label: opt.label || opt.value,
      value: opt.value
    }));
  }
  
  // 默认返回一些通用选项
  return [
    { label: '请选择', value: '' },
    { label: '是', value: 'true' },
    { label: '否', value: 'false' }
  ];
};

// 操作符变化时重置值
const onOperatorChange = (condition: any) => {
  if (isRangeOperator(condition.operator)) {
    condition.minValue = null;
    condition.maxValue = null;
    condition.value = '';
  } else {
    condition.value = '';
    condition.minValue = null;
    condition.maxValue = null;
  }
};

const addGroup = () => {
  const newIndex = config.value.dataFilter.groups.length + 1;
  config.value.dataFilter.groups.push({
    name: `条件组 ${newIndex}`,
    logic: 'AND',
    groupLogic: 'AND', // 该组与下一组的关系
    conditions: []
  });
};

const removeGroup = (groupIndex: number) => {
  config.value.dataFilter.groups.splice(groupIndex, 1);
};

const updateGroupName = (groupIndex: number) => {
  const group = config.value.dataFilter.groups[groupIndex];
  if (!group.name || group.name.trim() === '') {
    group.name = `条件组 ${groupIndex + 1}`;
  }
};

const addCondition = (groupIndex: number) => {
  config.value.dataFilter.groups[groupIndex].conditions.push({
    field: '',
    operator: 'eq',
    value: '',
    logic: 'AND' // 默认为且
  });
};

const removeCondition = (groupIndex: number, condIndex: number) => {
  config.value.dataFilter.groups[groupIndex].conditions.splice(condIndex, 1);
};

// 批量添加条件
const batchAddCondition = () => {
  if (selectedFields.value.length === 0) {
    window.$message?.warning('请先选择字段');
    return;
  }
  
  let groupIndex = targetGroupIndex.value;
  
  // 如果选择新增组
  if (groupIndex === -1) {
    // 创建新组
    const newIndex = config.value.dataFilter.groups.length + 1;
    config.value.dataFilter.groups.push({
      name: `条件组 ${newIndex}`,
      logic: 'AND',
      groupLogic: 'AND',
      conditions: []
    });
    groupIndex = config.value.dataFilter.groups.length - 1;
  }
  
  // 为选中的字段添加条件到指定组
  selectedFields.value.forEach(fieldKey => {
    config.value.dataFilter.groups[groupIndex].conditions.push({
      field: fieldKey,
      operator: 'eq',
      value: '',
      logic: 'AND'
    });
  });
  
  const groupLabel = targetGroupIndex.value === -1 ? '新组' : `组 ${groupIndex + 1}`;
  window.$message?.success(`已向${groupLabel}添加 ${selectedFields.value.length} 个条件`);
  selectedFields.value = []; // 清空选择
  
  // 如果是新增组，更新选择为新组
  if (targetGroupIndex.value === -1) {
    targetGroupIndex.value = groupIndex;
  }
};

// 清空所有条件
const clearAllConditions = () => {
  config.value.dataFilter.groups = [{
    logic: 'AND',
    conditions: []
  }];
  window.$message?.success('已清空所有条件');
};

// 获取总条件数
const getTotalConditionsCount = () => {
  return config.value.dataFilter.groups.reduce((total: number, group: any) => {
    return total + group.conditions.length;
  }, 0);
};

// 切换组间关系
const toggleGroupLogic = (groupIndex: number) => {
  const group = config.value.dataFilter.groups[groupIndex];
  if (!group.groupLogic) {
    group.groupLogic = 'AND';
  }
  group.groupLogic = group.groupLogic === 'AND' ? 'OR' : 'AND';
};

// 切换条件间关系
const toggleConditionLogic = (groupIndex: number, condIndex: number) => {
  const condition = config.value.dataFilter.groups[groupIndex].conditions[condIndex];
  if (!condition.logic) {
    condition.logic = 'AND';
  }
  condition.logic = condition.logic === 'AND' ? 'OR' : 'AND';
};

// 获取条件摘要翻译
const getConditionSummary = () => {
  const groups = config.value.dataFilter.groups;
  if (groups.length === 0 || groups.every((g: any) => g.conditions.length === 0)) {
    return '暂无过滤条件';
  }
  
  const groupTexts = groups.map((group: any, groupIndex: number) => {
    if (group.conditions.length === 0) return '';
    
    const conditionTexts = group.conditions.map((cond: any, index: number) => {
      const field = cond.field || '字段';
      const operator = getOperatorText(cond.operator);
      const value = getValueText(cond);
      
      if (index === 0) {
        return `${field}${operator}${value}`;
      } else {
        const prefix = cond.logic === 'OR' ? '或' : '且';
        return `${prefix}${field}${operator}${value}`;
      }
    });
    
    let groupText = conditionTexts.join('');
    
    // 如果组内有多个条件，需要加括号（除了第一组）
    if (group.conditions.length > 1 && groupIndex > 0) {
      groupText = `（${groupText}）`;
    }
    
    return groupText;
  }).filter(text => text);
  
  if (groupTexts.length === 0) return '暂无过滤条件';
  if (groupTexts.length === 1) return `当${groupTexts[0]}`;
  
  // 多组时，使用每个组的独立逻辑
  let result = `当${groupTexts[0]}`;
  
  for (let i = 1; i < groupTexts.length; i++) {
    const prevGroup = groups[i - 1];
    const groupLogic = (prevGroup.groupLogic || 'AND') === 'AND' ? '且' : '或';
    result += `${groupLogic}${groupTexts[i]}`;
  }
  
  return result;
};

// 获取操作符文本
const getOperatorText = (operator: string) => {
  const operatorMap: Record<string, string> = {
    'eq': '等于',
    'ne': '不等于', 
    'contains': '包含',
    'not_contains': '不包含',
    'is': '是',
    'is_not': '不是',
    'gt': '大于',
    'lt': '小于',
    'gte': '≥',
    'lte': '≤',
    'between': '在范围',
    'not_between': '不在范围'
  };
  return operatorMap[operator] || operator;
};

// 获取值文本
const getValueText = (condition: any) => {
  if (isRangeOperator(condition.operator)) {
    const min = condition.minValue || '最小值';
    const max = condition.maxValue || '最大值';
    return `${min}-${max}`;
  }
  return condition.value || '值';
};

// 检查是否有逻辑错误
const hasLogicErrors = () => {
  return getErrorHints().length > 0;
};

// 获取错误提示
const getErrorHints = () => {
  const errors: string[] = [];
  const groups = config.value.dataFilter.groups;
  
  // 过滤出完整配置的条件（有字段和操作符的才检查）
  const completeGroups = groups.map((group: any) => ({
    ...group,
    conditions: group.conditions.filter((cond: any) => cond.field && cond.operator)
  })).filter((group: any) => group.conditions.length > 0);
  
  if (completeGroups.length === 0) return errors;
  
  // 检查每个组内的字段重复和冲突
  completeGroups.forEach((group: any, groupIndex: number) => {
    const fieldCounts: Record<string, number> = {};
    const fieldOperators: Record<string, string[]> = {};
    const fieldValues: Record<string, any[]> = {};
    
    group.conditions.forEach((cond: any) => {
      fieldCounts[cond.field] = (fieldCounts[cond.field] || 0) + 1;
      if (!fieldOperators[cond.field]) {
        fieldOperators[cond.field] = [];
        fieldValues[cond.field] = [];
      }
      fieldOperators[cond.field].push(cond.operator);
      fieldValues[cond.field].push(cond);
    });
    
    // 检查同一字段的冲突条件
    Object.keys(fieldCounts).forEach(field => {
      if (fieldCounts[field] > 1) {
        const operators = fieldOperators[field];
        const conditions = fieldValues[field];
        
        // 检查互斥的等于条件（只在AND逻辑下才是错误）
        const eqConditions = conditions.filter(c => c.operator === 'eq' && c.value !== undefined && c.value !== '');
        if (eqConditions.length > 1) {
          const values = eqConditions.map(c => c.value);
          if (new Set(values).size > 1) {
            // 检查这些等于条件之间是否都是AND关系
            const hasAndBetweenEq = eqConditions.some((cond, index) => {
              if (index === 0) return false;
              return (cond.logic || 'AND') === 'AND';
            });
            
            if (hasAndBetweenEq) {
              errors.push(`${field}字段不能同时等于多个不同值（AND关系）`);
            }
          }
        }
        
        // 检查包含与不包含冲突
        const containsCond = conditions.find(c => c.operator === 'contains' && c.value);
        const notContainsCond = conditions.find(c => c.operator === 'not_contains' && c.value);
        if (containsCond && notContainsCond && containsCond.value === notContainsCond.value) {
          errors.push(`${field}字段不能同时包含和不包含相同值`);
        }
        
        // 检查范围逻辑冲突
        const gtConditions = conditions.filter(c => ['gt', 'gte'].includes(c.operator) && c.value !== undefined && c.value !== '');
        const ltConditions = conditions.filter(c => ['lt', 'lte'].includes(c.operator) && c.value !== undefined && c.value !== '');
        
        if (gtConditions.length > 0 && ltConditions.length > 0) {
          const maxGt = Math.max(...gtConditions.map(c => parseFloat(c.value) || 0));
          const minLt = Math.min(...ltConditions.map(c => parseFloat(c.value) || Infinity));
          if (maxGt >= minLt) {
            errors.push(`${field}字段范围条件冲突（下限≥上限）`);
          }
        }
        
        // 检查等于与范围冲突
        const eqValues = eqConditions.map(c => parseFloat(c.value)).filter(v => !isNaN(v));
        if (eqValues.length > 0 && (gtConditions.length > 0 || ltConditions.length > 0)) {
          errors.push(`${field}字段的等于条件与范围条件可能冲突`);
        }
        
        // 检查是与不是冲突
        const isCond = conditions.find(c => c.operator === 'is' && c.value !== undefined && c.value !== '');
        const isNotCond = conditions.find(c => c.operator === 'is_not' && c.value !== undefined && c.value !== '');
        if (isCond && isNotCond && isCond.value === isNotCond.value) {
          errors.push(`${field}字段不能同时是和不是相同值`);
        }
      }
    });
  });
  
  // 检查未完成的条件配置
  const hasIncompleteConditions = groups.some((group: any) => 
    group.conditions.some((cond: any) => 
      (cond.field && !cond.operator) || (!cond.field && cond.operator)
    )
  );
  
  if (hasIncompleteConditions) {
    errors.push('存在未完成的条件配置');
  }
  
  // 只检查完整条件的空值问题
  const hasEmptyValues = completeGroups.some((group: any) => 
    group.conditions.some((cond: any) => {
      // 这些操作符不需要值
      const noValueOperators = ['is_null', 'is_not_null', 'is_empty', 'is_not_empty'];
      if (noValueOperators.includes(cond.operator)) return false;
      
      // 范围操作符检查
      if (isRangeOperator(cond.operator)) {
        return (cond.minValue === undefined || cond.minValue === '') && 
               (cond.maxValue === undefined || cond.maxValue === '');
      }
      
      // 选择操作符检查
      if (isSelectOperator(cond.operator)) {
        return cond.value === undefined || cond.value === '';
      }
      
      // 普通操作符检查（0、false等都是有效值）
      return cond.value === undefined || cond.value === '';
    })
  );
  
  if (hasEmptyValues) {
    errors.push('存在未填写值的条件');
  }
  
  // 检查范围条件的值
  const hasInvalidRanges = completeGroups.some((group: any) => 
    group.conditions.some((cond: any) => {
      if (isRangeOperator(cond.operator)) {
        const min = parseFloat(cond.minValue);
        const max = parseFloat(cond.maxValue);
        return !isNaN(min) && !isNaN(max) && min >= max;
      }
      return false;
    })
  );
  
  if (hasInvalidRanges) {
    errors.push('范围条件的最小值不能大于等于最大值');
  }
  
  // 检查重复的条件组
  if (completeGroups.length > 1) {
    const groupSignatures = completeGroups.map((group: any) => 
      JSON.stringify(group.conditions.map((c: any) => ({
        field: c.field,
        operator: c.operator,
        value: c.value,
        minValue: c.minValue,
        maxValue: c.maxValue
      })).sort())
    );
    
    const duplicateGroups = groupSignatures.some((sig, index) => 
      groupSignatures.indexOf(sig) !== index
    );
    
    if (duplicateGroups) {
      errors.push('存在重复的条件组');
    }
  }
  
  return errors;
};
</script>

<style scoped>
.data-filter-settings {
  font-size: 13px;
  padding: 12px;
}

.config-section {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  padding-bottom: 4px;
  border-bottom: 1px solid #f0f0f0;
}

.section-header .section-title {
  margin-bottom: 0;
  flex: 1;
}

.help-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #666;
}

.config-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 12px;
  align-items: center;
}

.config-grid .n-form-item {
  margin-bottom: 0;
}

.help-section {
  margin-top: 8px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 4px;
  border-left: 3px solid #18a058;
}

.help-item {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.filter-groups {
  margin-top: 8px;
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

.group-label {
  font-size: 12px;
  font-weight: 500;
  color: #374151;
}

.group-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-conditions {
  margin-top: 8px;
}

.condition-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
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

.batch-actions {
  padding: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
}

.fixed-top-area {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 12px;
}

.scrollable-area {
  max-height: 400px;
  overflow-y: auto;
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

.connector-logic {
  padding: 4px 12px;
  background: #f0f2f5;
  border: 1px solid #d9d9d9;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.connector-logic.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
}

.connector-logic.clickable:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
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
  transition: all 0.2s ease;
  min-width: 24px;
  text-align: center;
}

.connector-symbol:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
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
  transition: all 0.2s ease;
}

.condition-logic-prefix:hover {
  background: #e6f7ff;
  border-color: #1890ff;
  color: #1890ff;
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

.condition-summary {
  padding: 8px 12px;
  background: #f0f8ff;
  border: 1px solid #91d5ff;
  border-radius: 6px;
  margin-top: 8px;
  border-left: 3px solid #1890ff;
}

.condition-summary.has-errors {
  background: #fff2f0;
  border-color: #ffccc7;
  border-left-color: #ff4d4f;
}

.normal-text {
  color: #333;
}

.error-text {
  color: #ff4d4f;
}

.error-hints {
  margin-top: 4px;
  padding-top: 4px;
  border-top: 1px solid #ffccc7;
}
</style>