<template>
  <div class="view-manager">
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
            <span 
              v-if="!view.editing" 
              class="view-label" 
              @dblclick="startEdit(view)"
            >
              {{ view.label }}
            </span>
            <n-input 
              v-else
              v-model:value="view.editName"
              size="small"
              style="width: 120px;"
              @blur="finishEdit(view)"
              @keyup.enter="finishEdit(view)"
              @keyup.esc="cancelEdit(view)"
              ref="editInput"
            />
            <n-tag v-if="view.isDefault" size="small" type="primary">默认</n-tag>
            
            <!-- 视图操作按钮 -->
            <div class="view-actions" @click.stop>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button size="tiny" quaternary @click="$emit('set-default', view)">
                    <template #icon><n-icon><StarIcon /></n-icon></template>
                  </n-button>
                </template>
                设为默认
              </n-tooltip>
              
              <!-- 更多操作下拉菜单 -->
              <n-dropdown trigger="hover" :options="getMoreOptions(view)" @select="(key) => handleMoreAction(key, view)">
                <n-button size="tiny" quaternary>
                  <template #icon><n-icon><MoreIcon /></n-icon></template>
                </n-button>
              </n-dropdown>
            </div>
          </div>
        </div>
        
        <n-divider style="margin: 8px 0;" />
        
        <div class="dropdown-actions">
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

    <!-- 视图标签 -->
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
        {{ view.label }}
        <n-tag v-if="view.isDefault" size="small" type="primary">默认</n-tag>
        <n-badge 
          v-if="view.count !== null && view.count !== undefined" 
          :value="view.count" 
          :type="view.badgeType || 'default'"
        />
      </div>
    </div>

    <n-text depth="3" class="shortcut-hint">Ctrl+1~4 快速切换</n-text>
  </div>
</template>

<script setup lang="ts">
import { h, ref, getCurrentInstance, nextTick } from 'vue'

interface Props {
  viewTabs: any[]
  currentView: string
}

defineProps<Props>()
const emit = defineEmits(['view-change', 'menu-select', 'add-view', 'views-reorder', 'edit-view', 'duplicate-view', 'delete-view', 'set-default', 'share-view', 'export-view', 'rename-view'])

const draggedView = ref(null)

// 获取更多操作选项
const getMoreOptions = (view: any) => {
  const options = [
    { label: '编辑', key: 'edit', icon: () => h(EditIcon) },
    { label: '复制', key: 'duplicate', icon: () => h(CopyIcon) },
    { label: '分享', key: 'share', icon: () => h(ShareIcon) },
    { label: '导出', key: 'export', icon: () => h(ExportIcon) }
  ]
  
  if (view.key !== 'all') {
    options.push({ label: '删除', key: 'delete', icon: () => h(DeleteIcon) })
  }
  
  return options
}

// 处理更多操作
const handleMoreAction = (key: string, view: any) => {
  switch (key) {
    case 'edit':
      emit('edit-view', view)
      break
    case 'duplicate':
      emit('duplicate-view', view)
      break
    case 'share':
      emit('share-view', view)
      break
    case 'export':
      emit('export-view', view)
      break
    case 'delete':
      emit('delete-view', view.key)
      break
  }
}

// 编辑视图名称
const startEdit = (view: any) => {
  view.editing = true
  view.editName = view.label
  // 下一帧聚焦输入框
  nextTick(() => {
    const input = document.querySelector('.n-input__input-el')
    input?.focus()
    input?.select()
  })
}

const finishEdit = (view: any) => {
  if (view.editName && view.editName.trim()) {
    view.label = view.editName.trim()
    const emit = getCurrentInstance()?.emit
    emit?.('rename-view', view)
  }
  view.editing = false
  delete view.editName
}

const cancelEdit = (view: any) => {
  view.editing = false
  delete view.editName
}

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

const MoreIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' })
])

const EditIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z' })
])

const CopyIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z' })
])

const DeleteIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z' })
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

const ImportIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z' })
])

const ShareIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92S19.61 16.08 18 16.08z' })
])



const ExportIcon = () => h('svg', { viewBox: '0 0 24 24' }, [
  h('path', { fill: 'currentColor', d: 'M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zm-5.5-2L9 14.5l1.41-1.41L12 14.67V10h2v4.67l1.59-1.58L17 14.5 13.5 18z' })
])
</script>

<style scoped>
.view-manager {
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

.view-icon {
  font-size: 16px;
}

.shortcut-hint {
  font-size: 11px;
}

.views-dropdown {
  min-width: 220px;
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

.view-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.dropdown-view-item:hover .view-actions {
  opacity: 1;
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

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4); }
  70% { box-shadow: 0 0 0 4px rgba(24, 144, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0); }
}
</style>
