<template>
  <div class="view-bar">
    <div class="view-left">
      <!-- 菜单图标 - 显示全部视图列表 -->
      <n-popover trigger="click" placement="bottom-start" :show-arrow="false">
        <template #trigger>
          <n-button size="small" quaternary title="全部视图">
            <template #icon>
              <n-icon><MenuIcon /></n-icon>
            </template>
          </n-button>
        </template>
        
        <div class="views-dropdown">
          <div class="dropdown-header">
            <span>全部视图</span>
            <n-text depth="3" style="font-size: 12px;">拖拽排序</n-text>
          </div>
          
          <div class="views-list">
            <div 
              v-for="view in viewTabs" 
              :key="view.key"
              :class="['dropdown-view-item', { active: currentView === view.key }]"
              draggable="true"
              @dragstart="handleDragStart($event, view)"
              @dragover="handleDragOver"
              @drop="handleDrop($event, view)"
              @click="$emit('view-change', view.key)"
            >
              <div class="drag-handle">⋮⋮</div>
              <n-icon class="view-icon">
                <component :is="getViewIcon(view)" />
              </n-icon>
              <span class="view-label">{{ view.label }}</span>
              <span v-if="view.count" class="view-count">({{ view.count }})</span>
            </div>
          </div>
          
          <n-divider style="margin: 8px 0;" />
          
          <div class="dropdown-actions">
            <div class="dropdown-action-item" @click="$emit('menu-select', 'manage')">
              <n-icon><SettingIcon /></n-icon>
              <span>管理视图</span>
            </div>
            <div class="dropdown-action-item" @click="$emit('menu-select', 'import')">
              <n-icon><ImportIcon /></n-icon>
              <span>导入视图</span>
            </div>
            <div class="dropdown-action-item" @click="$emit('menu-select', 'export')">
              <n-icon><ExportIcon /></n-icon>
              <span>导出视图</span>
            </div>
          </div>
        </div>
      </n-popover>

      <!-- 添加视图图标 -->
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button size="small" quaternary @click="$emit('add-view')" title="添加视图">
            <template #icon>
              <n-icon><PlusIcon /></n-icon>
            </template>
          </n-button>
        </template>
        添加视图
      </n-tooltip>

      <div class="view-tabs">
        <div 
          v-for="view in viewTabs" 
          :key="view.key"
          :class="['view-tab', { 
            active: currentView === view.key,
            'has-alert': view.alert 
          }]"
          @click="$emit('view-change', view.key)"
          :title="view.description"
        >
          <n-icon class="view-icon">
            <component :is="getViewIcon(view)" />
          </n-icon>
          {{ view.label }}
          <n-badge 
            v-if="view.count !== null && view.count !== undefined" 
            :value="view.count" 
            :type="view.badgeType || 'default'"
          />
        </div>
      </div>

      <n-text depth="3" class="shortcut-hint">Ctrl+1~4 快速切换</n-text>
    </div>
    
    <div class="view-right">
      <n-space align="center">
        <n-text depth="3" class="record-count">
          共 {{ totalCount }} 条
          <span v-if="filteredCount !== totalCount" class="filtered-count">
            (筛选后 {{ filteredCount }} 条)
          </span>
        </n-text>
        <n-button size="small" quaternary @click="$emit('refresh')" title="刷新">
          <template #icon>
            <n-icon><RefreshIcon /></n-icon>
          </template>
        </n-button>
        <n-pagination
          :page="currentPage"
          :page-size="currentPageSize"
          :page-count="pageCount"
          :item-count="filteredCount"
          size="small"
          simple
          @update:page="$emit('page-change', $event)"
          @update:page-size="$emit('page-size-change', $event)"
        />
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, h, ref } from 'vue'

interface Props {
  viewTabs: any[]
  currentView: string
  totalCount: number
  filteredCount: number
  currentPage: number
  currentPageSize: number
  pageCount: number
}

const props = defineProps<Props>()
defineEmits(['view-change', 'menu-select', 'refresh', 'page-change', 'page-size-change', 'add-view', 'views-reorder'])

const draggedView = ref(null)

// 处理视图选择 - 移除不需要的方法

// 拖拽处理
const handleDragStart = (event: DragEvent, view: any) => {
  draggedView.value = view
  event.dataTransfer?.setData('text/plain', view.key)
}

const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const handleDrop = (event: DragEvent, targetView: any) => {
  event.preventDefault()
  if (draggedView.value && draggedView.value.key !== targetView.key) {
    emit('views-reorder', draggedView.value, targetView)
  }
  draggedView.value = null
}

// 根据视图类型返回对应图标
const getViewIcon = (view: any) => {
  const iconMap = {
    'all': TableIcon,
    'today': CalendarIcon,
    'pending': ClockIcon,
    'my': UserIcon,
    'active': CheckIcon,
    'inactive': CloseIcon,
    'custom': StarIcon
  }
  return iconMap[view.key] || TableIcon
}

// 图标组件
const MenuIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' })
])

const PlusIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' })
])

const TableIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M3 3h18v18H3V3zm2 2v4h4V5H5zm6 0v4h4V5h-4zm6 0v4h4V5h-4zM5 11v4h4v-4H5zm6 0v4h4v-4h-4zm6 0v4h4v-4h-4zM5 17v2h4v-2H5zm6 0v2h4v-2h-4zm6 0v2h4v-2h-4z' })
])

const CalendarIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' })
])

const ClockIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z' })
])

const UserIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' })
])

const CheckIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' })
])

const CloseIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z' })
])

const StarIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' })
])

const RefreshIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z' })
])

const SettingIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z' })
])

const ImportIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z' })
])

const ExportIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-5.5-2L9 14.5l1.41-1.41L12 14.67V10h2v4.67l1.59-1.58L17 14.5 13.5 18z' })
])
</script>

<style scoped>
.view-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #fafafa;
  border-radius: 6px;
}

.view-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-tabs {
  display: flex;
  gap: 4px;
}

.view-tab {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s;
  user-select: none;
}

.view-tab:hover {
  background: #f0f0f0;
  color: #333;
}

.view-tab.active {
  background: #1890ff;
  color: white;
}

.view-tab.has-alert {
  animation: pulse 2s infinite;
}

.view-tab[draggable="true"] {
  cursor: move;
}

.view-tab[draggable="true"]:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.views-dropdown {
  min-width: 200px;
  padding: 8px 0;
}

.dropdown-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  font-weight: 500;
  color: #333;
}

.views-list {
  max-height: 300px;
  overflow-y: auto;
}

.dropdown-view-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.dropdown-view-item:hover {
  background-color: #f5f5f5;
}

.dropdown-view-item.active {
  background-color: #e6f7ff;
  color: #1890ff;
}

.dropdown-view-item[draggable="true"] {
  cursor: move;
}

.drag-handle {
  color: #ccc;
  font-size: 12px;
  cursor: grab;
}

.drag-handle:active {
  cursor: grabbing;
}

.view-label {
  flex: 1;
}

.view-count {
  color: #999;
  font-size: 12px;
}

.dropdown-actions {
  padding: 4px 0;
}

.dropdown-action-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  color: #666;
}

.dropdown-action-item:hover {
  background-color: #f5f5f5;
}

.view-icon {
  font-size: 16px;
}

.shortcut-hint {
  font-size: 11px;
}

.filtered-count {
  color: #1890ff;
  font-weight: 500;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4); }
  70% { box-shadow: 0 0 0 4px rgba(24, 144, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0); }
}
</style>
