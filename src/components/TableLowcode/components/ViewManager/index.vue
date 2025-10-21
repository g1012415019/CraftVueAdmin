<template>
  <div class="view-manager">
    <!-- 菜单图标 - 显示全部视图列表 -->
    <n-popover trigger="click" placement="bottom-start" :show-arrow="false">
      <template #trigger>
        <n-button size="tiny" quaternary title="全部视图">
          <template #icon>
            <n-icon size="14"><MenuIcon /></n-icon>
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
            @dragend="handleDragEnd"
            @click="$emit('view-change', view.key)"
          >
            <div class="drag-handle">⋮⋮</div>
            <span 
              v-if="!editingViews.get(view.key)?.editing" 
              class="view-label" 
              @dblclick="startEdit(view)"
            >
              {{ view.label }}
            </span>
            <n-input 
              v-else
              v-model:value="editingViews.get(view.key).editName"
              size="small"
              style="width: 120px;"
              @blur="finishEdit(view)"
              :ref="el => el && nextTick(() => { el.focus(); el.select() })"
            />
            
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
    <n-tooltip trigger="hover" placement="bottom">
      <template #trigger>
        <n-button size="tiny" quaternary @click="$emit('add-view')" title="添加视图">
          <template #icon>
            <n-icon size="14"><PlusIcon /></n-icon>
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
        @contextmenu.prevent="(e) => {
          contextMenuX = e.clientX
          contextMenuY = e.clientY
          currentContextView = view
          contextMenuOptions = getTabContextMenu(view)
          showContextMenuFlag = true
        }"
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

    <!-- 右键菜单 -->
    <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="contextMenuX"
      :y="contextMenuY"
      :options="contextMenuOptions"
      :show="showContextMenuFlag"
      @select="handleContextMenuSelect"
      @clickoutside="showContextMenuFlag = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { useViewManager } from './composables/useViewManager.ts'
import { useViewEdit } from './composables/useViewEdit.ts'
import { useDragDrop } from './composables/useDragDrop.ts'
import { useContextMenu } from './composables/useContextMenu.ts'
import { 
  MenuOutlined as MenuIcon,
  PlusOutlined as PlusIcon,
  MoreOutlined as MoreIcon,
  EditOutlined as EditIcon,
  CopyOutlined as CopyIcon,
  DeleteOutlined as DeleteIcon,
  StarOutlined as StarIcon,
  ImportOutlined as ImportIcon,
  ExportOutlined as ExportIcon,
  ShareAltOutlined as ShareIcon
} from '@vicons/antd'

interface Props {
  viewTabs: any[]
  currentView: string
}

const props = defineProps<Props>()
const emit = defineEmits(['view-change', 'menu-select', 'add-view', 'views-reorder', 'edit-view', 'duplicate-view', 'delete-view', 'set-default', 'share-view', 'export-view', 'rename-view'])

// 使用组合式函数
const { getMoreOptions, handleMoreAction } = useViewManager(emit)
const { editingViews, startEdit, finishEdit } = useViewEdit(emit)
const { draggedView, handleDragStart, handleDragOver, handleDrop, handleDragEnd } = useDragDrop(emit)
const { 
  showContextMenuFlag, 
  contextMenuX, 
  contextMenuY, 
  contextMenuOptions, 
  currentContextView,
  handleContextMenuSelect,
  getTabContextMenu 
} = useContextMenu(props, emit, startEdit)
</script>


<style scoped>
.view-manager {
  display: flex;
  align-items: center;
  gap: 6px;
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
