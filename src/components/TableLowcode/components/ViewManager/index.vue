<template>
  <div class="view-manager">
    <!-- 视图操作按钮区域：包含添加视图等操作 -->
    <ViewActions
      :view-count="viewCount"
      :max-views="maxViews"
      @add-view="handleAddView"
    />
    <!-- 视图标签区域：显示所有视图标签，支持切换和右键菜单 -->
    <ViewTabs
      :view-tabs="viewTabs"
      :current-view="currentView"
      @view-change="handleViewChange"
      @context-menu="handleContextMenu"
    />
    <!-- 右键上下文菜单：提供编辑、删除、复制等操作 -->
    <ViewContextMenu
      :show="showContextMenu"
      :x="contextMenuX"
      :y="contextMenuY"
      :can-add-view="canAddView"
      :can-delete="canDelete"
      @select="handleContextMenuSelect"
      @close="handleCloseContextMenu"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import ViewTabs from './ViewTabs.vue'
import ViewActions from './ViewActions.vue'
import ViewContextMenu from './ViewContextMenu.vue'
import type { ViewConfig } from '../../types'

// ==================== 组件定义 ====================

/**
 * 组件 Props 定义
 */
const props = defineProps<{
  /** 视图配置对象，key 为视图标识，value 为视图配置 */
  views?: ViewConfig[]
  /** 当前激活的视图键名 */
  currentViewKey?: string
  /** 最大允许的视图数量，默认为 8 */
  maxViews?: number
}>()

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 添加新视图事件 */
  'add-view': []
  /** 视图切换事件，传递新的视图键名 */
  'view-change': [viewKey: string]
  /** 编辑视图事件，传递要编辑的视图键名 */
  'edit-view': [viewKey: string]
  /** 重命名视图事件，传递视图键名和新名称 */
  'rename-view': [viewKey: string, newName: string]
  /** 复制视图事件，传递要复制的视图键名 */
  'duplicate-view': [viewKey: string]
  /** 分享视图事件，传递要分享的视图键名 */
  'share-view': [viewKey: string]
  /** 导出视图事件，传递要导出的视图键名 */
  'export-view': [viewKey: string]
  /** 删除视图事件，传递要删除的视图键名 */
  'delete-view': [viewKey: string]
}>()

// ==================== 内部状态 ====================

/** 控制右键菜单显示/隐藏 */
const showContextMenu = ref(false)
/** 右键菜单X坐标位置 */
const contextMenuX = ref(0)
/** 右键菜单Y坐标位置 */
const contextMenuY = ref(0)
/** 当前右键点击的视图对象 */
const currentContextView = ref<any>(null)

// ==================== 计算属性 ====================

/**
 * 视图标签列表
 * 将 views 对象转换为标签数组格式，便于渲染
 */
const viewTabs = computed(() => {
  return props.views
})

/**
 * 当前激活的视图键名
 * 如果未指定则使用第一个视图
 */
const currentView = computed(() => 
  props.currentViewKey || Object.keys(props.views || {})[0] || ''
)

/**
 * 当前视图总数量
 */
const viewCount = computed(() => 
  Object.keys(props.views || {}).length
)

/**
 * 最大视图数量限制
 */
const maxViewsCount = computed(() => 
  props.maxViews || 8
)

/**
 * 是否可以添加新视图
 * 当前视图数量小于最大限制时可以添加
 */
const canAddView = computed(() => 
  viewCount.value < maxViewsCount.value
)

/**
 * 是否可以删除视图
 * 至少保留一个视图，所以视图数量大于1时才可删除
 */
const canDelete = computed(() => 
  viewCount.value > 1
)

// ==================== 事件处理 ====================

/**
 * 处理添加视图事件
 * 向父组件发射添加视图事件
 */
const handleAddView = () => {
  emit('add-view')
}

/**
 * 处理视图切换事件
 * @param viewKey 要切换到的视图键名
 */
const handleViewChange = (viewKey: string) => {
  emit('view-change', viewKey)
}

/**
 * 处理右键菜单显示事件
 * @param event 鼠标右键事件对象
 * @param view 被右键点击的视图对象
 */
const handleContextMenu = (event: MouseEvent, view: any) => {
  // 记录鼠标位置，用于定位菜单
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  // 记录当前操作的视图
  currentContextView.value = view
  // 显示菜单
  showContextMenu.value = true
}

/**
 * 处理关闭右键菜单事件
 * 重置菜单状态和当前视图引用
 */
const handleCloseContextMenu = () => {
  showContextMenu.value = false
  currentContextView.value = null
}

/**
 * 处理右键菜单选择事件
 * @param action 用户选择的操作类型
 */
const handleContextMenuSelect = (action: string) => {
  const view = currentContextView.value
  if (!view) return

  // 根据用户选择的操作类型执行相应逻辑
  switch (action) {
    case 'edit':
      // 编辑视图：通知父组件打开视图配置面板
      emit('edit-view', view.key)
      break
    case 'rename':
      // 重命名视图：弹出输入框让用户输入新名称
      const newName = prompt('请输入新的视图名称:', view.label)
      if (newName && newName.trim()) {
        emit('rename-view', view.key, newName.trim())
      }
      break
    case 'duplicate':
      // 复制视图：创建当前视图的副本
      emit('duplicate-view', view.key)
      break
    case 'share':
      // 分享视图：生成分享链接或配置
      emit('share-view', view.key)
      break
    case 'export':
      // 导出视图：将视图配置导出为文件
      emit('export-view', view.key)
      break
    case 'delete':
      // 删除视图：从配置中移除该视图
      emit('delete-view', view.key)
      break
  }
  
  // 操作完成后隐藏右键菜单
  handleCloseContextMenu()
}
</script>

<style scoped>
.view-manager {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 响应式设计：移动端垂直布局 */
@media (max-width: 768px) {
  .view-manager {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
}
</style>
