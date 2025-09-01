<template>
  <NDrawer
    v-model:show="viewStore.configPanelVisible"
    :width="380"
    placement="right"
    class="config-drawer"
  >
    <div class="config-container">
      <!-- 头部 -->
      <div class="config-header">
        <div class="header-content">
          <div class="header-icon">
            <NIcon size="18"><SettingsOutline /></NIcon>
          </div>
          <div class="header-text">
            <h3>表格配置</h3>
            <span>{{ visibleColumns.length }}/{{ availableColumns.length }} 列显示</span>
          </div>
        </div>
        <NButton quaternary circle size="small" @click="viewStore.configPanelVisible = false">
          <template #icon><NIcon><CloseOutline /></NIcon></template>
        </NButton>
      </div>

      <!-- 快速操作 -->
      <div class="quick-actions">
        <div class="action-group">
          <NButton size="tiny" ghost @click="selectAllColumns">
            <template #icon><NIcon size="14"><CheckmarkOutline /></NIcon></template>
            全选
          </NButton>
          <NButton size="tiny" ghost @click="deselectAllColumns">
            <template #icon><NIcon size="14"><CloseOutline /></NIcon></template>
            清空
          </NButton>
          <NButton size="tiny" ghost @click="resetConfig">
            <template #icon><NIcon size="14"><RefreshOutline /></NIcon></template>
            重置
          </NButton>
        </div>
      </div>

      <!-- 搜索 -->
      <div class="search-section">
        <NInput
          v-model:value="columnSearchText"
          size="small"
          placeholder="搜索列..."
          clearable
        >
          <template #prefix>
            <NIcon size="14"><SearchOutline /></NIcon>
          </template>
        </NInput>
      </div>

      <!-- 列列表 -->
      <div class="columns-section">
        <div class="section-title">
          <span>显示列</span>
          <NTag size="small" type="info">{{ visibleColumns.length }}</NTag>
        </div>
        
        <div class="columns-list">
          <TransitionGroup name="column" tag="div">
            <div
              v-for="column in filteredColumns"
              :key="column.key"
              class="column-item"
              :class="{ active: isColumnVisible(column.key) }"
            >
              <div class="column-content">
                <NCheckbox
                  :checked="isColumnVisible(column.key)"
                  @update:checked="(checked) => toggleColumn(column.key, checked)"
                  size="small"
                />
                <div class="column-info">
                  <span class="column-name">{{ column.title }}</span>
                  <div class="column-meta">
                    <NTag size="tiny" :type="getColumnTagType(column.type)">
                      {{ getColumnTypeLabel(column.type) }}
                    </NTag>
                    <span class="column-key">{{ column.key }}</span>
                  </div>
                </div>
              </div>
              
              <div class="column-actions" v-if="isColumnVisible(column.key)">
                <NButton
                  size="tiny"
                  quaternary
                  circle
                  @click="moveColumnUp(column.key)"
                  :disabled="!canMoveUp(column.key)"
                >
                  <template #icon><NIcon size="12"><ChevronUpOutline /></NIcon></template>
                </NButton>
                <NButton
                  size="tiny"
                  quaternary
                  circle
                  @click="moveColumnDown(column.key)"
                  :disabled="!canMoveDown(column.key)"
                >
                  <template #icon><NIcon size="12"><ChevronDownOutline /></NIcon></template>
                </NButton>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>

      <!-- 显示设置 -->
      <div class="display-section">
        <div class="section-title">
          <span>显示设置</span>
        </div>
        
        <div class="display-options">
          <div class="option-row">
            <span class="option-label">表格大小</span>
            <NRadioGroup v-model:value="displayConfig.size" size="small">
              <NRadioButton value="small">紧凑</NRadioButton>
              <NRadioButton value="medium">标准</NRadioButton>
              <NRadioButton value="large">宽松</NRadioButton>
            </NRadioGroup>
          </div>
          
          <div class="option-row">
            <span class="option-label">每页条数</span>
            <NInputNumber
              v-model:value="displayConfig.pageSize"
              size="small"
              :min="10"
              :max="100"
              :step="10"
              style="width: 80px"
            />
          </div>
          
          <div class="toggle-options">
            <div class="toggle-item">
              <NSwitch v-model:value="displayConfig.showBorder" size="small" />
              <span>显示边框</span>
            </div>
            <div class="toggle-item">
              <NSwitch v-model:value="displayConfig.showStriped" size="small" />
              <span>斑马纹</span>
            </div>
            <div class="toggle-item">
              <NSwitch v-model:value="displayConfig.showHover" size="small" />
              <span>悬停高亮</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部操作 -->
      <div class="config-footer">
        <NButton block type="primary" size="small" @click="applyConfig">
          应用配置
        </NButton>
      </div>
    </div>
  </NDrawer>
</template>

<script setup lang="ts">
import {
  SettingsOutline,
  CloseOutline,
  CheckmarkOutline,
  RefreshOutline,
  SearchOutline,
  ChevronUpOutline,
  ChevronDownOutline
} from '@vicons/ionicons5'
import { useViewStore } from '@/stores/view'

const viewStore = useViewStore()

// 搜索
const columnSearchText = ref('')

// 列配置
const availableColumns = ref([
  { key: 'id', title: 'ID', type: 'number' },
  { key: 'name', title: '姓名', type: 'text' },
  { key: 'email', title: '邮箱', type: 'email' },
  { key: 'role', title: '角色', type: 'select' },
  { key: 'status', title: '状态', type: 'status' },
  { key: 'createdAt', title: '创建时间', type: 'date' },
  { key: 'updatedAt', title: '更新时间', type: 'date' },
  { key: 'avatar', title: '头像', type: 'image' }
])

const visibleColumns = ref(['name', 'email', 'role', 'status', 'createdAt'])

// 显示配置
const displayConfig = reactive({
  size: 'medium' as 'small' | 'medium' | 'large',
  showBorder: true,
  showStriped: true,
  showHover: true,
  pageSize: 20
})

// 计算属性
const filteredColumns = computed(() => {
  if (!columnSearchText.value) return availableColumns.value
  return availableColumns.value.filter(col =>
    col.title.toLowerCase().includes(columnSearchText.value.toLowerCase()) ||
    col.key.toLowerCase().includes(columnSearchText.value.toLowerCase())
  )
})

// 方法
const isColumnVisible = (key: string) => visibleColumns.value.includes(key)

const toggleColumn = (key: string, checked: boolean) => {
  if (checked) {
    if (!visibleColumns.value.includes(key)) {
      visibleColumns.value.push(key)
    }
  } else {
    const index = visibleColumns.value.indexOf(key)
    if (index > -1) {
      visibleColumns.value.splice(index, 1)
    }
  }
}

const selectAllColumns = () => {
  visibleColumns.value = availableColumns.value.map(col => col.key)
}

const deselectAllColumns = () => {
  visibleColumns.value = []
}

const moveColumnUp = (key: string) => {
  const index = visibleColumns.value.indexOf(key)
  if (index > 0) {
    const temp = visibleColumns.value[index]
    visibleColumns.value[index] = visibleColumns.value[index - 1]
    visibleColumns.value[index - 1] = temp
  }
}

const moveColumnDown = (key: string) => {
  const index = visibleColumns.value.indexOf(key)
  if (index < visibleColumns.value.length - 1) {
    const temp = visibleColumns.value[index]
    visibleColumns.value[index] = visibleColumns.value[index + 1]
    visibleColumns.value[index + 1] = temp
  }
}

const canMoveUp = (key: string) => {
  const index = visibleColumns.value.indexOf(key)
  return index > 0
}

const canMoveDown = (key: string) => {
  const index = visibleColumns.value.indexOf(key)
  return index < visibleColumns.value.length - 1 && index !== -1
}

const getColumnTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    number: '数字',
    text: '文本',
    email: '邮箱',
    select: '选择',
    status: '状态',
    date: '日期',
    image: '图片'
  }
  return labels[type] || type
}

const getColumnTagType = (type: string): 'default' | 'info' | 'success' | 'warning' | 'error' | 'primary' => {
  const types: Record<string, 'default' | 'info' | 'success' | 'warning' | 'error' | 'primary'> = {
    number: 'info',
    text: 'default',
    email: 'success',
    select: 'warning',
    status: 'error',
    date: 'info',
    image: 'success'
  }
  return types[type] || 'default'
}

const resetConfig = () => {
  visibleColumns.value = ['name', 'email', 'role', 'status', 'createdAt']
  displayConfig.size = 'medium'
  displayConfig.showBorder = true
  displayConfig.showStriped = true
  displayConfig.showHover = true
  displayConfig.pageSize = 20
  columnSearchText.value = ''
}

const applyConfig = () => {
  // 应用配置到表格
  console.log('应用配置:', {
    visibleColumns: visibleColumns.value,
    displayConfig: displayConfig
  })
  
  // 关闭面板
  viewStore.configPanelVisible = false
  
  // 这里可以触发表格重新渲染
  // emit('config-changed', { visibleColumns: visibleColumns.value, displayConfig })
}
</script>

<style lang="scss" scoped>
.config-drawer {
  :deep(.n-drawer-body) {
    padding: 0;
  }
}

.config-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--n-body-color);
}

.config-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--n-divider-color);
  background: var(--n-card-color);
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .header-icon {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--n-primary-color-suppl);
      border-radius: 6px;
      color: var(--n-primary-color);
    }
    
    .header-text {
      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--n-text-color);
        line-height: 1.2;
      }
      
      span {
        font-size: 12px;
        color: var(--n-text-color-2);
      }
    }
  }
}

.quick-actions {
  padding: 12px 24px;
  border-bottom: 1px solid var(--n-divider-color);
  background: var(--n-card-color);
  
  .action-group {
    display: flex;
    gap: 8px;
  }
}

.search-section {
  padding: 16px 24px 12px;
  background: var(--n-card-color);
}

.columns-section,
.display-section {
  flex: 1;
  padding: 0 24px 16px;
  
  .section-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--n-text-color);
  }
}

.columns-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 400px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--n-scrollbar-color);
    border-radius: 2px;
  }
}

.column-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  
  &:hover {
    background: var(--n-hover-color);
  }
  
  &.active {
    background: var(--n-primary-color-suppl);
    border-left: 3px solid var(--n-primary-color);
  }
  
  .column-content {
    display: flex;
    align-items: center;
    gap: 10px;
    flex: 1;
    min-width: 0;
    
    .column-info {
      flex: 1;
      min-width: 0;
      
      .column-name {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: var(--n-text-color);
        line-height: 1.3;
        margin-bottom: 2px;
      }
      
      .column-meta {
        display: flex;
        align-items: center;
        gap: 6px;
        
        .column-key {
          font-size: 11px;
          color: var(--n-text-color-3);
          font-family: var(--n-font-family-mono);
        }
      }
    }
  }
  
  .column-actions {
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  
  &:hover .column-actions,
  &.active .column-actions {
    opacity: 1;
  }
}

.display-options {
  .option-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
    
    .option-label {
      font-size: 13px;
      color: var(--n-text-color);
    }
  }
  
  .toggle-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .toggle-item {
      display: flex;
      align-items: center;
      gap: 10px;
      
      span {
        font-size: 13px;
        color: var(--n-text-color);
      }
    }
  }
}

.config-footer {
  padding: 16px 24px 20px;
  border-top: 1px solid var(--n-divider-color);
  background: var(--n-card-color);
  margin-top: auto;
}

// 动画
.column-enter-active,
.column-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.column-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.column-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

.column-move {
  transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
