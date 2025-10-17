<template>
  <div class="table-lowcode2-layout">
    <!-- 1. 视图栏 -->
    <div class="view-bar">
      <div class="view-left">
        <n-dropdown :options="viewMenuOptions" @select="handleViewMenuSelect" trigger="hover">
          <n-button size="small" quaternary title="视图管理">
            <template #icon>
              <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></n-icon>
            </template>
          </n-button>
        </n-dropdown>

        <div class="view-tabs">
          <div 
            v-for="view in viewTabs" 
            :key="view.key"
            :class="['view-tab', { 
              active: currentView === view.key,
              'has-alert': view.alert 
            }]"
            @click="handleViewChange(view.key)"
            :title="view.description"
          >
            <span v-if="view.icon" class="view-emoji">{{ view.icon }}</span>
            <n-icon v-else-if="view.iconComponent" class="view-icon">
              <component :is="view.iconComponent" />
            </n-icon>
            {{ view.label }}
            <n-badge 
              v-if="view.count !== null && view.count !== undefined" 
              :value="view.count" 
              :type="view.badgeType || 'default'"
              :dot="view.count === 0"
            />
            <n-icon v-if="view.alert" class="alert-icon">
              <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.58L19 8l-9 9z"/></svg>
            </n-icon>
          </div>
        </div>

        <!-- 快捷键提示 -->
        <n-text depth="3" class="shortcut-hint">
          Ctrl+1~4 快速切换
        </n-text>
      </div>
      
      <div class="view-right">
        <n-space align="center">
          <n-text depth="3" class="record-count">
            共 {{ totalCount }} 条
            <span v-if="filteredCount !== totalCount" class="filtered-count">
              (筛选后 {{ filteredCount }} 条)
            </span>
          </n-text>
          <n-button size="small" quaternary @click="handleRefreshView" title="刷新当前视图">
            <template #icon>
              <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></n-icon>
            </template>
          </n-button>
          <n-pagination
            v-model:page="currentPage"
            v-model:page-size="currentPageSize"
            :page-count="pageCount"
            :item-count="filteredCount"
            size="small"
            simple
          />
        </n-space>
      </div>
    </div>

    <!-- 自定义视图保存对话框 -->
    <n-modal v-model:show="showSaveViewModal">
      <n-card style="width: 400px" title="保存视图" :bordered="false" size="huge">
        <n-form>
          <n-form-item label="视图名称">
            <n-input v-model:value="newViewName" placeholder="输入视图名称" />
          </n-form-item>
          <n-form-item label="描述">
            <n-input v-model:value="newViewDescription" type="textarea" placeholder="描述这个视图的用途" />
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="setAsDefault">设为默认视图</n-checkbox>
          </n-form-item>
          <n-form-item>
            <n-checkbox v-model:checked="shareWithTeam">分享给团队</n-checkbox>
          </n-form-item>
        </n-form>
        <template #footer>
          <n-space justify="end">
            <n-button @click="showSaveViewModal = false">取消</n-button>
            <n-button type="primary" @click="handleSaveView">保存</n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>

    <!-- 2. 筛选区域 -->
    <div v-show="filterVisible" class="filter-section">
      <div class="filter-bar">
        <div class="filter-left">
          <!-- 动态生成筛选栏字段 -->
          <template v-for="field in filterBarFields" :key="field.key">
            <!-- 文本搜索 -->
            <n-input 
              v-if="field.type === 'text'"
              v-model:value="filterValues[field.key]" 
              :placeholder="field.placeholder || field.label" 
              clearable
              class="search-input"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></n-icon>
              </template>
            </n-input>
            
            <!-- 下拉选择 -->
            <n-select 
              v-else-if="field.type === 'select'"
              v-model:value="filterValues[field.key]" 
              :placeholder="field.label" 
              clearable 
              :options="field.options"
              class="filter-select"
            />
            
            <!-- 日期范围 -->
            <n-date-picker 
              v-else-if="field.type === 'dateRange'"
              v-model:value="filterValues[field.key]" 
              type="daterange" 
              :placeholder="field.label"
              clearable 
              class="filter-date"
            />
          </template>
        </div>
        
        <div class="filter-right">
          <n-button type="primary" @click="handleSearch">查询</n-button>
          <n-button @click="handleReset">重置</n-button>
          <n-button @click="showAdvancedFilter = true" quaternary>
            <template #icon>
              <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M14 12v7.88c.04.3-.06.62-.29.83a.996.996 0 0 1-1.41 0l-2.01-2.01a.989.989 0 0 1-.29-.83V12h-.03L4.21 4.62a1 1 0 0 1 .17-1.4c.19-.14.4-.22.62-.22h14c.22 0 .43.08.62.22a1 1 0 0 1 .17 1.4L14.03 12H14Z"/></svg></n-icon>
            </template>
            更多筛选
            <n-badge v-if="advancedFilterCount > 0" :value="advancedFilterCount" />
          </n-button>
        </div>
      </div>
    </div>

    <!-- 高级筛选抽屉 -->
    <n-drawer v-model:show="showAdvancedFilter" :width="380" placement="right">
      <n-drawer-content title="筛选条件" closable>
        <n-form label-placement="top" size="medium">
          <!-- 动态生成高级筛选字段 -->
          <template v-for="field in advancedFilterFields" :key="field.key">
            <!-- 文本输入 -->
            <n-form-item v-if="field.type === 'text'" :label="field.label">
              <n-input v-model:value="filterValues[field.key]" :placeholder="field.placeholder" clearable />
            </n-form-item>
            
            <!-- 数值范围 -->
            <n-form-item v-else-if="field.type === 'numberRange'" :label="field.label">
              <n-input-group>
                <n-input-number v-model:value="filterValues[field.key + 'Min']" placeholder="最小" :min="0" style="width: 50%" />
                <n-input-number v-model:value="filterValues[field.key + 'Max']" placeholder="最大" :min="0" style="width: 50%" />
              </n-input-group>
            </n-form-item>
            
            <!-- 下拉选择 -->
            <n-form-item v-else-if="field.type === 'select'" :label="field.label">
              <n-select v-model:value="filterValues[field.key]" :placeholder="'选择' + field.label" clearable :options="field.options" />
            </n-form-item>
            
            <!-- 多选 -->
            <n-form-item v-else-if="field.type === 'multiSelect'" :label="field.label">
              <n-select v-model:value="filterValues[field.key]" multiple :placeholder="'选择' + field.label" :options="field.options" />
            </n-form-item>
            
            <!-- 日期范围 -->
            <n-form-item v-else-if="field.type === 'dateRange'" :label="field.label">
              <n-date-picker v-model:value="filterValues[field.key]" type="daterange" clearable style="width: 100%" />
            </n-form-item>
            
            <!-- 滑块范围 -->
            <n-form-item v-else-if="field.type === 'slider'" :label="field.label">
              <n-slider v-model:value="filterValues[field.key]" range :min="field.min || 0" :max="field.max || 100" />
            </n-form-item>
          </template>
        </n-form>
        
        <template #footer>
          <n-space>
            <n-button @click="handleAdvancedReset">重置</n-button>
            <n-button type="primary" @click="handleAdvancedSearch">应用</n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>

    <!-- 3. 数据表格区 -->
    <div class="table-section">
      <!-- 表格操作栏 -->
      <div class="table-action-bar">
        <div class="action-left">
          <n-space>
            <n-button type="primary" @click="handleCreate">
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></n-icon>
              </template>
              新增
            </n-button>
            <n-button type="error" :disabled="checkedRowKeys.length === 0" @click="handleBatchDelete">
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></n-icon>
              </template>
              删除 {{ checkedRowKeys.length > 0 ? `(${checkedRowKeys.length})` : '' }}
            </n-button>
          </n-space>
        </div>
        
        <div class="action-right">
          <n-space>
            <n-button size="small" quaternary @click="handlePrint">
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg></n-icon>
              </template>
              打印
            </n-button>
            
            <n-button size="small" quaternary @click="$emit('openConfig')">
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 15.5A3.5 3.5 0 0 1 8.5 12A3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5a3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97c0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.39-1.06-.73-1.69-.98l-.37-2.65A.506.506 0 0 0 14 2h-4c-.25 0-.46.18-.5.42l-.37 2.65c-.63.25-1.17.59-1.69.98l-2.49-1c-.22-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1c0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.06.74 1.69.99l.37 2.65c.04.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.37-2.65c.63-.26 1.17-.59 1.69-.99l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.66Z"/></svg></n-icon>
              </template>
              设置
            </n-button>
          </n-space>
        </div>
      </div>

      <!-- 批量操作浮层 -->
      <div v-if="checkedRowKeys.length > 0" class="batch-action-overlay">
        <div class="batch-action-content">
          <div class="batch-info">
            <n-text depth="2">已选择本页 {{ checkedRowKeys.length }} 条记录</n-text>
          </div>
          <div class="batch-actions">
            <!-- 动态生成批量操作按钮 -->
            <template v-for="action in batchActions" :key="action.key">
              <n-button 
                size="small" 
                :type="action.type || 'default'"
                @click="handleBatchAction(action)"
              >
                {{ action.label }}
              </n-button>
            </template>
          </div>
        </div>
      </div>

      <!-- 表格本身 -->
      <div class="table-wrapper">
        <DataTable ref="dataTableRef" @update-checked-keys="updateCheckedRowKeys" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, provide, onMounted, onUnmounted, type Ref } from 'vue'
import DataTable from './Table/DataTable.vue'

const emit = defineEmits(['openConfig'])
const config = inject('tableConfig') as Ref<any>

// 核心状态
const currentView = ref('all')
const filterValues = ref({})
const showAdvancedFilter = ref(false)
const checkedRowKeys = ref([])
const totalCount = ref(1250)
const filteredCount = ref(1250)


// 视图保存
const showSaveViewModal = ref(false)
const newViewName = ref('')
const newViewDescription = ref('')
const setAsDefault = ref(false)
const shareWithTeam = ref(false)

// 选项配置
const statusOptions = ref([
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' }
])

// 配置驱动的计算属性
const viewTabs = computed(() => {
  return config?.value?.views?.presetViews || [
    { key: 'all', label: '全部数据', count: 1250, description: '显示所有数据记录' },
    { key: 'today', label: '今日新增', count: 23, badgeType: 'info', description: '今天新创建的数据' },
    { key: 'pending', label: '待处理', count: 15, badgeType: 'warning', description: '需要处理的数据', alert: true }
  ]
})

const filterFields = computed(() => {
  return config?.value?.filters?.fields || [
    { key: 'name', type: 'text', position: 'filterBar', label: '搜索姓名', placeholder: '输入姓名关键字' },
    { key: 'status', type: 'select', position: 'filterBar', label: '状态', options: statusOptions.value }
  ]
})

const filterBarFields = computed(() => filterFields.value.filter(field => field.position === 'filterBar'))
const advancedFilterFields = computed(() => filterFields.value.filter(field => field.position === 'advanced'))
const batchActions = computed(() => config?.value?.actions?.batch || [])


const advancedFilterCount = computed(() => {
  let count = 0
  advancedFilterFields.value.forEach(field => {
    const value = filterValues.value[field.key]
    if (field.type === 'numberRange') {
      if (filterValues.value[field.key + 'Min'] || filterValues.value[field.key + 'Max']) count++
    } else if (field.type === 'multiSelect' && value?.length > 0) {
      count++
    } else if (value) {
      count++
    }
  })
  return count
})

const viewMenuOptions = [
  { label: '保存当前视图', key: 'save' },
  { label: '新建视图', key: 'create' },
  { type: 'divider' },
  { label: '管理视图', key: 'manage' },
  { label: '设为默认', key: 'setDefault' },
  { label: '重命名视图', key: 'rename' },
  { label: '删除视图', key: 'delete' },
  { type: 'divider' },
  { label: '导入视图', key: 'import' },
  { label: '导出视图', key: 'export' }
];

const handleViewChange = (viewKey: string) => {
  currentView.value = viewKey;
  console.log('切换视图:', viewKey);
  
  // 根据视图配置应用筛选条件
  const viewData = viewTabs.value.find(v => v.key === viewKey);
  if (viewData) {
    filteredCount.value = viewData.count;
    totalCount.value = viewTabs.value.find(v => v.key === 'all')?.count || 0;
    
    // 应用视图的筛选条件
    if (viewData.filter) {
      applyViewFilter(viewData.filter);
    }
    
    // 调用配置的视图切换事件
    if (config?.value?.onViewChange) {
      config.value.onViewChange(viewKey, viewData);
    }
  }
  
  // 触发数据重新加载
  handleRefreshView();
};

// 应用视图筛选条件
const applyViewFilter = (filter: any) => {
  // 根据筛选条件设置对应的筛选值
  if (filter.status) {
    statusFilter.value = filter.status;
  }
  if (filter.createDate === 'today') {
    const today = new Date();
    dateRange.value = [today.getTime(), today.getTime()];
  }
  if (filter.assignee === 'currentUser') {
    // 设置当前用户相关的筛选
    console.log('应用我负责的筛选条件');
  }
  
  console.log('应用视图筛选条件:', filter);
};

const handleViewMenuSelect = (key: string) => {
  if (key === 'save' || key === 'create') {
    showSaveViewModal.value = true
  } else {
    console.log('视图操作:', key)
  }
}

const handleAddView = () => {
  showSaveViewModal.value = true
  newViewName.value = ''
  newViewDescription.value = ''
};

const handleSaveCurrentView = () => {
  showSaveViewModal.value = true;
  newViewName.value = '';
  newViewDescription.value = '';
  setAsDefault.value = false;
  shareWithTeam.value = false;
};

const handleSaveView = () => {
  if (!newViewName.value.trim()) {
    window.$message?.warning('请输入视图名称');
    return;
  }
  
  // 保存视图逻辑
  const newView = {
    key: `custom_${Date.now()}`,
    label: newViewName.value,
    count: filteredCount.value,
    description: newViewDescription.value,
    custom: true
  };
  
  viewTabs.value.push(newView);
  
  if (setAsDefault.value) {
    console.log('设为默认视图');
  }
  
  if (shareWithTeam.value) {
    console.log('分享给团队');
  }
  
  showSaveViewModal.value = false;
  window.$message?.success('视图保存成功');
};

const handleRefreshView = () => {
  console.log('刷新当前视图:', currentView.value);
  // 模拟刷新数据
  const currentViewData = viewTabs.value.find(v => v.key === currentView.value);
  if (currentViewData && Math.random() > 0.5) {
    // 模拟数据变化
    currentViewData.count += Math.floor(Math.random() * 3) - 1;
    currentViewData.alert = currentViewData.count > 10;
  }
};

// 表格数据相关
const currentPage = ref(1);
const currentPageSize = ref(config?.value?.pagination?.pageSize || 10);
const pageCount = computed(() => Math.ceil(totalCount.value / currentPageSize.value));
const filterVisible = ref(true);

const typeOptions = [
  { label: '类型A', value: 'typeA' },
  { label: '类型B', value: 'typeB' }
];

const tagOptions = [
  { label: 'VIP', value: 'vip' },
  { label: '新用户', value: 'new' },
  { label: '活跃用户', value: 'active' }
];

const departmentOptions = [
  { label: '技术部', value: 'tech' },
  { label: '销售部', value: 'sales' },
  { label: '市场部', value: 'marketing' }
];

const columnOptions = [];
const densityOptions = [];

// 事件处理
const updateFilter = (key: string, value: any) => {
  filterValues.value[key] = value
}

const handleFullscreen = () => {
  console.log('全屏显示')
}

const handleCreate = () => {
  config?.value?.actions?.create?.onClick?.()
}

const handleSearch = () => {
  console.log('搜索', filterValues.value);
  // 这里可以调用配置的搜索处理函数
  if (config?.value?.onSearch) {
    config.value.onSearch(filterValues.value);
  }
};

const handleReset = () => {
  // 重置所有筛选值
  Object.keys(filterValues.value).forEach(key => {
    if (key.endsWith('Min') || key.endsWith('Max')) {
      filterValues.value[key] = null;
    } else if (Array.isArray(filterValues.value[key])) {
      filterValues.value[key] = [];
    } else {
      filterValues.value[key] = null;
    }
  });
  
  // 重置滑块类型的默认值
  advancedFilterFields.value.forEach(field => {
    if (field.type === 'slider') {
      filterValues.value[field.key] = [field.min || 0, field.max || 100];
    }
  });
};

const handleAdvancedSearch = () => {
  console.log('应用筛选', filterValues.value);
  showAdvancedFilter.value = false;
  
  // 调用配置的高级搜索处理函数
  if (config?.value?.onAdvancedSearch) {
    config.value.onAdvancedSearch(filterValues.value);
  } else {
    handleSearch();
  }
};

const handleAdvancedReset = () => {
  handleReset();
};

const handleManageViews = () => {
  console.log('管理视图');
};

const handleRefresh = () => {
  console.log('刷新数据');
};

const toggleFilterVisible = () => {
  filterVisible.value = !filterVisible.value;
};

const handlePrint = () => {
  console.log('打印表格');
};

const handleBatchEdit = () => {
  console.log('批量编辑', checkedRowKeys.value);
};

const handleBatchCopy = () => {
  console.log('批量复制', checkedRowKeys.value);
};

const handleBatchExport = () => {
  console.log('批量导出', checkedRowKeys.value);
};

const handleBatchDelete = () => {
  console.log('批量删除', checkedRowKeys.value);
};

const handleColumnSelect = (key: string) => {
  // 移除了列设置功能
};

const handleDensitySelect = (key: string) => {
  // 移除了密度设置功能
};

const getSelectedRows = () => {
  // 这里需要从 DataTable 组件获取选中的行数据
  return [];
};

// 提供给子组件的数据
provide('checkedRowKeys', checkedRowKeys);
provide('totalCount', totalCount);

// 监听子组件的选中状态变化
const updateCheckedRowKeys = (keys: any[]) => {
  checkedRowKeys.value = keys;
};

// 键盘快捷键支持
const handleKeydown = (event: KeyboardEvent) => {
  if (event.ctrlKey || event.metaKey) {
    const num = parseInt(event.key);
    if (num >= 1 && num <= 4) {
      event.preventDefault();
      const targetView = viewTabs.value[num - 1];
      if (targetView) {
        handleViewChange(targetView.key);
      }
    }
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
  // 初始化数据
  filteredCount.value = totalCount.value;
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.table-lowcode2-layout {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 16px;
  background: white;
  min-height: 100vh;
}

/* 1. 视图栏 */
.view-bar {
  padding: 8px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e6;
  background: #fafafa;
  border-radius: 6px 6px 0 0;
  margin-bottom: 1px;
}

.view-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  padding-left: 12px;
}

.view-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-tab {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  color: #666;
  transition: all 0.2s ease;
  white-space: nowrap;
  position: relative;
}

.view-tab:hover {
  background: #f0f0f0;
  color: #333;
}

.view-tab.active {
  background: #1890ff;
  color: white;
}

.view-tab.active:hover {
  background: #40a9ff;
}

.view-tab.has-alert {
  animation: pulse 2s infinite;
}

.view-icon {
  font-size: 14px;
}

.view-emoji {
  font-size: 14px;
  margin-right: 2px;
}

.alert-icon {
  font-size: 12px;
  color: #ff4d4f;
}

.view-tab.active .alert-icon {
  color: #fff;
}

.shortcut-hint {
  font-size: 11px;
  margin-left: 8px;
}

.filtered-count {
  color: #1890ff;
  font-weight: 500;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 4px rgba(24, 144, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(24, 144, 255, 0);
  }
}

.view-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  padding-right: 12px;
}

.record-count {
  font-size: 12px;
  white-space: nowrap;
}

/* 2. 筛选区域 */
.filter-section {
  padding: 16px 0;
  border-bottom: 1px solid #e0e0e6;
}

.filter-card {
  border: none !important;
  background: transparent !important;
}

.filter-content {
  padding: 0;
}

.search-input {
  width: 240px;
}

.filter-select {
  width: 120px;
}

.filter-date {
  width: 200px;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.filter-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

/* 3. 数据表格区 */
.table-section {
  padding: 16px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.table-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e6;
}

.action-left {
  display: flex;
  align-items: center;
}

.action-right {
  display: flex;
  align-items: center;
}

.batch-action-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  border: 1px solid #e0e0e6;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  animation: slideDown 0.2s ease-out;
}

.batch-action-content {
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.batch-action-content .batch-info {
  display: flex;
  align-items: center;
}

.batch-action-content .batch-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-wrapper {
  flex: 1;
  overflow: hidden;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .table-lowcode2-layout {
    padding: 8px;
    gap: 8px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
  
  .filter-content :deep(.n-grid) {
    grid-template-columns: 1fr !important;
  }
}
</style>
