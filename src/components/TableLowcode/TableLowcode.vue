<template>
  <!-- TableLowcode 主容器 - 低代码表格组件 -->
  <div class="table-lowcode-layout">
    <!-- 顶部栏：视图管理器和分页控制 -->
    <div class="top-bar">
      <!-- 视图管理器：内部处理所有视图逻辑 -->
      <ViewManager :views="internalConfig.views" :current-view-key="currentViewKey" ref="viewManagerRef"
        @add-view="handleAddView" @view-change="handleViewChange" @edit-view="handleEditView"
        @rename-view="handleRenameView" @duplicate-view="handleDuplicateView" @share-view="handleShareView"
        @export-view="handleExportView" @delete-view="handleDeleteView" />

      <!-- 分页栏：内部处理所有分页逻辑 -->
      <PaginationBar :config="currentViewConfig?.pagination" ref="paginationBarRef" />
    </div>

    <!-- 筛选区域：内部处理所有筛选逻辑  -->
    <FilterSection :config="currentViewConfig?.filterList" ref="filterSectionRef" />

    <!-- 表格主体：内部处理所有表格逻辑 -->
    <TableSection 
      ref="tableSectionRef"
      :data="internalConfig.data"
      :columns="currentViewConfig?.columns"
      :config="currentViewConfig"
      :show-footer="currentViewConfig?.basic?.showFooter"
      :loading="isTableLoading"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      @row-double-click="handleRowDoubleClick"
      @cell-click="handleCellClick"
      @sort-change="handleSortChange"
      @refresh="handleRefreshData"
      @open-config="handleOpenTableConfig"
      @export="handleExportData"
    />

    <div @click="showConfigPanel = true"> 11</div>
    <n-button @click="showInternalConfig = true" type="info" size="small" style="margin-left: 8px;">
      查看完整配置
    </n-button>

    <!-- 配置面板：表格配置编辑器 -->
    <ConfigPanel v-if="showConfigPanel" :current-view-name="currentViewName" :table-id="currentViewKey"
      :view-key="currentViewKey" :view-config="currentViewConfig" @update:show="showConfigPanel = $event"
      @config-updated="handleConfigUpdated" />

    <!-- 完整配置显示弹窗 -->
    <n-modal v-model:show="showInternalConfig" preset="card" title="完整 InternalConfig 配置"
      style="width: 80%; max-width: 1000px;">
      <div style="max-height: 600px; overflow-y: auto;">
        <n-code :code="formattedInternalConfig" language="json" show-line-numbers word-wrap />
      </div>
      <template #footer>
        <n-space justify="end">
          <n-button @click="copyInternalConfig" type="primary" size="small">
            复制配置
          </n-button>
          <n-button @click="showInternalConfig = false" size="small">
            关闭
          </n-button>
        </n-space>
      </template>
    </n-modal>

  </div>
</template>

<script setup lang="ts">
// Vue 核心功能导入
import { ref, computed } from 'vue'
import ConfigPanel from './Config/ConfigPanel.vue'
// 工具库导入
import { cloneDeep } from 'lodash-es'
import { ConfigManager } from './utils/configManager'

// 子组件导入
import FilterSection from './components/FilterSection.vue'
import PaginationBar from './components/PaginationBar.vue'
import ViewManager from './components/ViewManager/index.vue'
import TableSection from './components/TableSection.vue'

// 类型定义导入
import type { ExternalConfig } from './types'


const props = defineProps<{
  tableConfig: ExternalConfig
}>();

/**
 * 内部维护的可修改配置状态
 * 使用深拷贝确保不影响原始配置
 */
const internalConfig = ref<ExternalConfig>(
  ConfigManager.initializeAllViews(cloneDeep(props.tableConfig))
)

/** 当前视图键名 */
const currentViewKey = ref<string>(
  internalConfig.value.views?.[0]?.key || ''
)



// ==================== 配置面板状态 ====================

/**
 * 配置面板显示状态
 * 控制ConfigPanel组件的显示/隐藏
 */
const showConfigPanel = ref<boolean>(false)

/** 当前视图名称 */
const currentViewName = computed(() =>
  internalConfig.value?.views?.find(v => v.key === currentViewKey.value)?.label || '默认视图'
)

/** 当前视图配置 */
const currentViewConfig = computed(() =>
  internalConfig.value?.views?.find(v => v.key === currentViewKey.value)
)

/** 显示完整配置弹窗 */
const showInternalConfig = ref(false)

/** 表格加载状态 */
const isTableLoading = ref(false)

/** 格式化的完整配置 */
const formattedInternalConfig = computed(() => {
  return JSON.stringify(internalConfig.value, null, 2)
})

/** 复制完整配置到剪贴板 */
const copyInternalConfig = async () => {
  try {
    await navigator.clipboard.writeText(formattedInternalConfig.value)
    console.log('配置已复制到剪贴板')
  } catch (err) {
    console.error('复制失败:', err)
  }
}

/** 处理配置更新事件 */
const handleConfigUpdated = (updatedViewConfig) => {
  if (!currentViewConfig.value){
    return
  }
  console.log('currentViewConfig',currentViewConfig)
  // 获取当前配置的快照，避免响应式更新影响对比
  const currentConfigSnapshot = JSON.parse(JSON.stringify(currentViewConfig.value))

  // 深度对比配置是否有变化
  const isConfigChanged = JSON.stringify(currentConfigSnapshot) !== JSON.stringify(updatedViewConfig)

  if (isConfigChanged) {
    console.log('配置已更新', {
      viewKey: currentViewKey.value,
      before: currentConfigSnapshot,
      after: updatedViewConfig,
      changes: getConfigDiff(currentConfigSnapshot, updatedViewConfig)
    })

    // 更新 internalConfig 中对应视图的完整配置
    const viewIndex = internalConfig.value.views?.findIndex(v => v.key === currentViewKey.value)
    if (viewIndex !== -1 && internalConfig.value.views) {
      internalConfig.value.views[viewIndex] = updatedViewConfig
    }
  }
}

/** 获取配置差异 */
const getConfigDiff = (oldConfig: any, newConfig: any) => {
  const diff: any = {}

  if (!oldConfig || !newConfig) return diff

  // 简单的差异检测
  Object.keys(newConfig).forEach(key => {
    if (JSON.stringify(oldConfig[key]) !== JSON.stringify(newConfig[key])) {
      diff[key] = {
        old: oldConfig[key],
        new: newConfig[key]
      }
    }
  })

  return diff
}

// ==================== ViewManager 事件处理 ====================

/**
 * 处理添加视图事件
 */
const handleAddView = () => {
  // 生成新视图的唯一标识
  const newViewKey = `view_${Date.now()}`

  console.log("currentViewConfig",currentViewConfig,"currentViewConfig2")

  // 使用 ConfigManager 创建默认视图配置
  const newViewConfig = cloneDeep(internalConfig.value._initialConfig)

  console.log("internalConfig",newViewConfig,"internalConfig")

  newViewConfig.key=newViewKey;
  newViewConfig.label=newViewKey;
  // 添加到配置中
  if (!internalConfig.value.views) {
    internalConfig.value.views = []
  }
  internalConfig.value.views.push(newViewConfig)

  // 切换到新视图
  currentViewKey.value = newViewKey

  // 打开配置面板
  showConfigPanel.value = true
}

/**
 * 处理视图切换事件
 */
const handleViewChange = (viewKey: string) => {
  currentViewKey.value = viewKey
}

/**
 * 处理编辑视图事件
 */
const handleEditView = (viewKey: string) => {
  currentViewKey.value = viewKey
  showConfigPanel.value = true
}

/**
 * 处理重命名视图事件
 */
const handleRenameView = (viewKey: string, newName: string) => {
  const view = internalConfig.value.views?.find(v => v.key === viewKey)
  if (view) {
    view.label = newName
  }
}

/**
 * 处理复制视图事件
 */
const handleDuplicateView = (viewKey: string) => {
  const sourceView = internalConfig.value.views?.find(v => v.key === viewKey)
  if (!sourceView) return

  const newViewKey = `view_${Date.now()}`
  const newViewConfig = {
    ...cloneDeep(sourceView),
    key: newViewKey,
    name: `${sourceView.label}_副本`
  }

  if (!internalConfig.value.views) {
    internalConfig.value.views = []
  }
  internalConfig.value.views.push(newViewConfig)

  currentViewKey.value = newViewKey
}

/**
 * 处理分享视图事件
 */
const handleShareView = (viewKey: string) => {
  // TODO: 实现分享功能
  console.log('分享视图:', viewKey)
}

/**
 * 处理导出视图事件
 */
const handleExportView = (viewKey: string) => {
  // TODO: 实现导出功能
  console.log('导出视图:', viewKey)
}

/**
 * 处理删除视图事件
 */
const handleDeleteView = (viewKey: string) => {
  if (!internalConfig.value.views) return

  // 找到要删除的视图索引
  const viewIndex = internalConfig.value.views.findIndex(v => v.key === viewKey)
  if (viewIndex === -1) return

  // 删除视图
  internalConfig.value.views.splice(viewIndex, 1)

  // 如果删除的是当前视图，切换到第一个可用视图
  if (currentViewKey.value === viewKey) {
    currentViewKey.value = internalConfig.value.views[0]?.key || ''
  }
}

// ==================== TableSection 事件处理 ====================

/**
 * 处理表格选择变更事件
 */
const handleSelectionChange = (keys: any[], rows: any[]) => {
  console.log('选择变更:', keys, rows)
}

/**
 * 处理行点击事件
 */
const handleRowClick = (row: any, index: number) => {
  console.log('行点击:', row, index)
}

/**
 * 处理行双击事件
 */
const handleRowDoubleClick = (row: any, index: number) => {
  console.log('行双击:', row, index)
}

/**
 * 处理单元格点击事件
 */
const handleCellClick = (row: any, column: any, cellValue: any) => {
  console.log('单元格点击:', row, column, cellValue)
}

/**
 * 处理排序变更事件
 */
const handleSortChange = (field: string, order: 'asc' | 'desc' | null) => {
  console.log('排序变更:', field, order)
  
  // 更新当前视图的排序配置
  const view = internalConfig.value.views?.find(v => v.key === currentViewKey.value)
  if (view) {
    if (!view.sort) {
      view.sort = {}
    }
    view.sort.field = field
    view.sort.order = order || undefined
  }
}

/**
 * 处理刷新数据事件
 */
const handleRefreshData = () => {
  isTableLoading.value = true
  
  setTimeout(() => {
    isTableLoading.value = false
    console.log('数据已刷新')
  }, 1000)
}

/**
 * 处理打开表格配置事件
 */
const handleOpenTableConfig = () => {
  showConfigPanel.value = true
}

/**
 * 处理导出数据事件
 */
const handleExportData = (format: string, data: any[]) => {
  console.log('导出数据:', format, data)
}


</script>


<style lang="scss" scoped>
/**
 * TableLowcode 组件样式
 * 使用 SCSS 语法，支持嵌套和变量
 */

// ==================== 样式变量 ====================
$border-color: #f0f0f0; // 边框颜色
$background-color: #fafafa; // 背景颜色
$white-color: white; // 白色
$padding-base: 12px 16px; // 基础内边距

// ==================== 主布局 ====================
.table-lowcode-layout {
  // 使用 Flexbox 垂直布局
  display: flex;
  flex-direction: column;

  // 占满父容器高度
  height: 100%;

  // 白色背景
  background: $white-color;

  // 确保内容不会溢出
  overflow: hidden;

  // ==================== 顶部栏样式 ====================
  .top-bar {
    // 使用 Flexbox 水平布局
    display: flex;
    justify-content: space-between; // 两端对齐
    align-items: center; // 垂直居中

    // 内边距
    padding: $padding-base;

    // 底部边框
    border-bottom: 1px solid $border-color;

    // 浅灰背景
    background: $background-color;

    // 确保不会被压缩
    flex-shrink: 0;

    // 响应式设计：小屏幕时调整布局
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      padding: 8px 12px;
    }
  }
}

// ==================== 组件间距调整 ====================
:deep(.filter-section) {
  // FilterSection 组件的间距调整
  border-bottom: 1px solid $border-color;

  // 当筛选区域可见时的样式
  &.visible {
    padding: 12px 16px;
    background: #f9f9f9;
  }
}

:deep(.table-section) {
  // TableSection 组件占据剩余空间
  flex: 1;
  overflow: hidden;

  // 表格容器样式
  .table-container {
    height: 100%;
    overflow: auto;
  }
}

// ==================== 配置面板样式 ====================
:deep(.config-panel) {
  // 配置面板的 z-index 确保在最上层
  z-index: 1000;

  // 抽屉样式调整
  .n-drawer-content {
    padding: 0;
  }

  // 配置面板头部
  .config-header {
    padding: 16px 20px;
    border-bottom: 1px solid $border-color;
    background: $white-color;
  }

  // 配置面板内容
  .config-content {
    padding: 20px;
    height: calc(100% - 60px);
    overflow-y: auto;
  }
}

// ==================== 加载状态样式 ====================
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

// ==================== 空状态样式 ====================
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.5;
  }

  .empty-text {
    font-size: 14px;
    line-height: 1.5;
  }
}

// ==================== 动画效果 ====================
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ==================== 响应式设计 ====================
@media (max-width: 1200px) {
  .table-lowcode-layout {
    .top-bar {
      padding: 8px 12px;
    }
  }
}

@media (max-width: 768px) {
  .table-lowcode-layout {
    .top-bar {
      flex-direction: column;
      gap: 8px;
    }
  }
}

@media (max-width: 480px) {
  .table-lowcode-layout {
    .top-bar {
      padding: 6px 8px;
    }
  }
}
</style>
