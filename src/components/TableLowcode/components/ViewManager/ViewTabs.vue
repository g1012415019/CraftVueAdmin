<template>
  <div class="view-tabs">
    <div 
      v-for="view in safeViewTabs" 
      :key="view.key"
      :class="['view-tab', { 
        active: isActive(view.key),
        'has-alert': view.alert 
      }]"
      @click="handleViewChange(view.key)"
      @contextmenu.prevent="handleContextMenu($event, view)"
      :title="view.description"
    >
      {{ view.label }}
      
      <n-badge 
        v-if="view.count > 0" 
        :value="view.count" 
        :type="view.badgeType || 'default'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// ==================== 组件定义 ====================

/**
 * 组件 Props 定义
 */
const props = defineProps<{
  /** 视图标签列表 */
  viewTabs?: any[]
  /** 当前激活的视图键名 */
  currentView?: string
}>()

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 视图切换事件 */
  'view-change': [viewKey: string]
  /** 右键菜单事件 */
  'context-menu': [event: MouseEvent, view: any]
}>()

// ==================== 计算属性 ====================

/**
 * 安全的视图标签列表
 * 过滤掉无效的视图对象
 */
const safeViewTabs = computed(() => {
  const tabs = props.viewTabs
  if (!Array.isArray(tabs)) {
    return []
  }
  return tabs.filter(view => view && view.key)
})

/**
 * 判断视图是否为当前激活状态
 * @param viewKey 视图键名
 */
const isActive = (viewKey: string) => {
  return props.currentView === viewKey
}

// ==================== 事件处理 ====================

/**
 * 处理视图切换事件
 * @param viewKey 要切换到的视图键名
 */
const handleViewChange = (viewKey: string) => {
  emit('view-change', viewKey)
}

/**
 * 处理右键菜单事件
 * @param event 鼠标右键事件
 * @param view 视图对象
 */
const handleContextMenu = (event: MouseEvent, view: any) => {
  emit('context-menu', event, view)
}
</script>

<style scoped>
.view-tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
}

.view-tabs::-webkit-scrollbar {
  display: none;
}

.view-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.3s ease;
}

.view-tab:hover {
  border-color: #1890ff;
  color: #1890ff;
}

.view-tab.active {
  background: #1890ff;
  border-color: #1890ff;
  color: white;
}

.view-tab.has-alert {
  position: relative;
}

.view-tab.has-alert::after {
  content: '';
  position: absolute;
  top: -2px;
  right: -2px;
  width: 6px;
  height: 6px;
  background: #ff4d4f;
  border-radius: 50%;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .view-tab {
    padding: 6px 8px;
    font-size: 12px;
  }
}
</style>
