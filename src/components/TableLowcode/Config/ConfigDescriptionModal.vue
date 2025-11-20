<template>
  <n-modal 
    v-model:show="visible" 
    preset="dialog" 
    title="完整配置描述" 
    style="width: 800px;"
    :show-icon="false"
  >
    <template #header>
      <div class="modal-header">
        <span>完整配置描述</span>
        <n-space>
          <n-button size="small" @click="exportConfig">
            导出配置
          </n-button>
          <n-button size="small" @click="copyConfig">
            复制配置
          </n-button>
        </n-space>
      </div>
    </template>
    
    <div class="config-content">
      <div class="main-content">

      <!-- 基础信息 -->
      <div id="basic-info" class="config-section">
        <n-text class="section-title">基础信息</n-text>
        <n-table size="small" :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th style="width: 120px;">配置项</th>
              <th>当前值</th>
              <th style="width: 200px;">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>视图名称</td>
              <td>{{ config?.name || '默认视图' }}</td>
              <td>当前视图的显示名称</td>
            </tr>
            <tr>
              <td>视图键名</td>
              <td>{{ config?.key || 'default' }}</td>
              <td>视图的唯一标识符</td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <!-- 基础设置 -->
      <div v-if="config?.basic" id="basic-settings" class="config-section">
        <n-text class="section-title">基础设置</n-text>
        <n-table size="small" :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th style="width: 120px;">配置项</th>
              <th>当前值</th>
              <th style="width: 200px;">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>行高</td>
              <td>{{ getRowHeightLabel(config.basic.rowHeight) }}</td>
              <td>表格行的显示高度</td>
            </tr>
            <tr>
              <td>显示序号</td>
              <td>{{ config.basic.showIndex ? '是' : '否' }}</td>
              <td>是否显示行号列</td>
            </tr>
            <tr>
              <td>显示边框</td>
              <td>{{ config.basic.showVerticalLines ? '是' : '否' }}</td>
              <td>是否显示表格边框线</td>
            </tr>
            <tr>
              <td>斑马纹</td>
              <td>{{ config.basic.showAlternateRowColors ? '是' : '否' }}</td>
              <td>是否显示交替行颜色</td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <!-- 分页设置 -->
      <div v-if="config?.pagination" id="pagination-settings" class="config-section">
        <n-text class="section-title">分页设置</n-text>
        <n-table size="small" :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th style="width: 120px;">配置项</th>
              <th>当前值</th>
              <th style="width: 200px;">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>启用分页</td>
              <td>{{ config.pagination.enabled ? '是' : '否' }}</td>
              <td>是否启用数据分页</td>
            </tr>
            <tr>
              <td>每页条数</td>
              <td>{{ config.pagination.pageSize || 10 }}</td>
              <td>每页显示的数据条数</td>
            </tr>
            <tr>
              <td>页码选项</td>
              <td>{{ (config.pagination.pageSizes || []).join(', ') }}</td>
              <td>可选择的每页条数</td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <!-- 排序设置 -->
      <div v-if="config?.sort?.customFields?.length" id="sort-settings" class="config-section">
        <n-text class="section-title">排序设置</n-text>
        <n-table size="small" :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th style="width: 120px;">字段名</th>
              <th>排序方向</th>
              <th style="width: 200px;">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="field in config.sort.customFields" :key="field.key">
              <td>{{ field.label }}</td>
              <td>{{ field.defaultOrder === 'asc' ? '升序' : '降序' }}</td>
              <td>{{ field.sortType || 'text' }}类型排序</td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <!-- 筛选设置 -->
      <div v-if="config?.dataFilter?.groups?.length" id="filter-settings" class="config-section">
        <n-text class="section-title">数据筛选</n-text>
        <n-table size="small" :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th style="width: 120px;">条件组</th>
              <th>筛选条件</th>
              <th style="width: 100px;">逻辑关系</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(group, index) in config.dataFilter.groups" :key="index">
              <td>{{ group.name || `条件组${index + 1}` }}</td>
              <td>
                <div v-for="(condition, cIndex) in group.conditions" :key="cIndex" class="condition-item">
                  {{ condition.field }} {{ getOperatorText(condition.operator) }} {{ condition.value }}
                </div>
              </td>
              <td>{{ group.logic || 'AND' }}</td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <!-- 字段设置 -->
      <div v-if="config?.columns?.length" id="column-settings" class="config-section">
        <n-text class="section-title">字段配置</n-text>
        <n-table size="small" :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th style="width: 100px;">字段键名</th>
              <th style="width: 120px;">字段名</th>
              <th style="width: 80px;">宽度</th>
              <th style="width: 60px;">对齐</th>
              <th style="width: 60px;">固定</th>
              <th style="width: 60px;">排序</th>
              <th style="width: 60px;">显示</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="column in config.columns" :key="column.key">
              <td>{{ column.key }}</td>
              <td>{{ column.label }}</td>
              <td>{{ column.width || 'auto' }}</td>
              <td>{{ getAlignText(column.align) }}</td>
              <td>{{ getFixedText(column.fixed) }}</td>
              <td>{{ column.sortable ? '是' : '否' }}</td>
              <td>{{ column.visible ? '是' : '否' }}</td>
            </tr>
          </tbody>
        </n-table>
      </div>

      <!-- JSON 配置 -->
      <div id="json-config" class="config-section">
        <n-text class="section-title">JSON 配置</n-text>
        <n-card size="small" class="json-card">
          <n-code 
            :code="configJson" 
            language="json" 
            style="max-height: 400px; overflow-y: auto;"
          />
        </n-card>
      </div>
      </div>
      
      <!-- 悬浮导航菜单 -->
      <div class="floating-nav">
        <n-anchor :bound="10" :top="80">
          <n-anchor-link href="#basic-info" title="基础信息" />
          <n-anchor-link v-if="config?.basic" href="#basic-settings" title="基础设置" />
          <n-anchor-link v-if="config?.pagination" href="#pagination-settings" title="分页设置" />
          <n-anchor-link v-if="config?.sort?.customFields?.length" href="#sort-settings" title="排序设置" />
          <n-anchor-link v-if="config?.dataFilter?.groups?.length" href="#filter-settings" title="筛选设置" />
          <n-anchor-link v-if="config?.columns?.length" href="#column-settings" title="字段配置" />
          <n-anchor-link href="#json-config" title="JSON配置" />
        </n-anchor>
      </div>
    </div>
  </n-modal>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMessage } from 'naive-ui'

const props = defineProps<{
  show: boolean
  config?: any
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
}>()

const message = useMessage()

const visible = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

// JSON 配置
const configJson = computed(() => {
  return JSON.stringify(props.config || {}, null, 2)
})

// 获取行高标签
const getRowHeightLabel = (height?: string) => {
  const heightMap: Record<string, string> = {
    compact: '紧凑',
    medium: '中等',
    large: '宽松',
    'extra-large': '超宽松'
  }
  return heightMap[height || 'medium'] || '中等'
}

// 获取操作符文本
const getOperatorText = (operator: string) => {
  const operatorMap: Record<string, string> = {
    eq: '等于',
    ne: '不等于',
    contains: '包含',
    not_contains: '不包含',
    gt: '大于',
    lt: '小于',
    gte: '≥',
    lte: '≤',
    between: '在范围内',
    not_between: '不在范围内'
  }
  return operatorMap[operator] || operator
}

// 获取对齐文本
const getAlignText = (align?: string) => {
  const alignMap: Record<string, string> = {
    left: '左对齐',
    center: '居中',
    right: '右对齐'
  }
  return alignMap[align || 'left'] || '左对齐'
}

// 获取固定文本
const getFixedText = (fixed?: string | boolean) => {
  if (fixed === 'left') return '左固定'
  if (fixed === 'right') return '右固定'
  return '不固定'
}

// 复制配置
const copyConfig = () => {
  navigator.clipboard.writeText(configJson.value).then(() => {
    message.success('配置已复制到剪贴板')
  }).catch(() => {
    message.error('复制失败')
  })
}

// 导出配置
const exportConfig = () => {
  const blob = new Blob([configJson.value], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `table-config-${Date.now()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  message.success('配置文件已导出')
}
</script>

<style lang="scss" scoped>
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.config-content {
  max-height: 600px;
  overflow-y: auto;
  display: flex;
  gap: 20px;
}

.main-content {
  flex: 1;
  min-width: 0;
}

.floating-nav {
  position: sticky;
  top: 0px;
  z-index: 10;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px;
  width: 200px;
  height: fit-content;
}

.config-section {
  margin-bottom: 24px;
  scroll-margin-top: 20px;
  
  .section-title {
    font-size: 14px;
    font-weight: 600;
    margin-bottom: 12px;
    display: block;
    color: #333;
  }
}

.condition-item {
  font-size: 12px;
  margin-bottom: 4px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

.json-card {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  
  :deep(.n-code) {
    background: transparent !important;
    
    .hljs {
      background: transparent !important;
      padding: 16px !important;
      
      .hljs-comment {
        color: #28a745 !important;
        font-style: italic;
        font-weight: 500;
      }
      
      .hljs-string {
        color: #dc3545 !important;
      }
      
      .hljs-number {
        color: #007bff !important;
      }
      
      .hljs-literal {
        color: #6f42c1 !important;
      }
      
      .hljs-attr {
        color: #fd7e14 !important;
        font-weight: 500;
      }
    }
  }
}

:deep(.n-anchor) {
  .n-anchor-link {
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s ease;
    
    &:hover {
      background: #f0f8ff;
    }
    
    &.n-anchor-link--active {
      background: #e6f7ff;
      color: #1890ff;
      font-weight: 500;
    }
  }
}

:deep(.n-table) {
  th {
    background: #fafafa;
    font-weight: 500;
    font-size: 12px;
  }
  
  td {
    font-size: 12px;
  }
}
</style>
