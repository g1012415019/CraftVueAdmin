<template>
  <div class="table-lowcode2-layout">
    <!-- 1. 视图栏 -->
    <div class="view-bar">
      <div class="view-left">
        <n-dropdown :options="viewMenuOptions" @select="handleViewMenuSelect">
          <n-button size="small" quaternary>
            <template #icon>
              <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg></n-icon>
            </template>
          </n-button>
        </n-dropdown>
        
        <n-button size="small" @click="handleAddView">
          <template #icon>
            <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg></n-icon>
          </template>
        </n-button>
        
        <div class="view-tabs">
          <n-dropdown :options="viewTabOptions" @select="handleViewTabSelect">
            <div class="view-tab active">
              <span>全部视图</span>
              <n-icon class="tab-arrow">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
              </n-icon>
            </div>
          </n-dropdown>
        </div>
      </div>
      
      <div class="view-right">
        <n-pagination
          v-model:page="currentPage"
          v-model:page-size="currentPageSize"
          :page-count="pageCount"
          :item-count="totalCount"
          size="small"
          simple
        />
      </div>
    </div>

    <!-- 2. 筛选区域 -->
    <div v-show="filterVisible" class="filter-section">
      <div class="filter-bar">
        <div class="filter-left">
          <n-input 
            v-model:value="searchKeyword" 
            placeholder="搜索姓名" 
            clearable
            class="search-input"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></n-icon>
            </template>
          </n-input>
          
          <n-select 
            v-model:value="statusFilter" 
            placeholder="状态" 
            clearable 
            :options="statusOptions"
            class="filter-select"
          />
          
          <n-select 
            v-model:value="typeFilter" 
            placeholder="类型" 
            clearable 
            :options="typeOptions"
            class="filter-select"
          />
          
          <n-date-picker 
            v-model:value="dateRange" 
            type="daterange" 
            placeholder="创建时间"
            clearable 
            class="filter-date"
          />
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
          <n-form-item label="姓名">
            <n-input v-model:value="searchKeyword" placeholder="输入姓名关键字" clearable />
          </n-form-item>
          
          <n-form-item label="状态">
            <n-select v-model:value="statusFilter" placeholder="选择状态" clearable :options="statusOptions" />
          </n-form-item>
          
          <n-form-item label="类型">
            <n-select v-model:value="typeFilter" placeholder="选择类型" clearable :options="typeOptions" />
          </n-form-item>
          
          <n-form-item label="创建时间">
            <n-date-picker v-model:value="dateRange" type="daterange" clearable style="width: 100%" />
          </n-form-item>
          
          <n-form-item label="年龄">
            <n-input-group>
              <n-input-number v-model:value="ageMin" placeholder="最小" :min="0" style="width: 50%" />
              <n-input-number v-model:value="ageMax" placeholder="最大" :min="0" style="width: 50%" />
            </n-input-group>
          </n-form-item>
          
          <n-form-item label="部门">
            <n-select v-model:value="departmentFilter" multiple placeholder="选择部门" :options="departmentOptions" />
          </n-form-item>
          
          <n-form-item label="标签">
            <n-select v-model:value="tagFilter" multiple placeholder="选择标签" :options="tagOptions" />
          </n-form-item>
          
          <n-form-item label="评分">
            <n-slider v-model:value="scoreRange" range :min="0" :max="100" />
          </n-form-item>
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
            <n-button size="small" quaternary @click="handleRefresh">
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg></n-icon>
              </template>
              刷新
            </n-button>
            
            <n-button size="small" quaternary @click="toggleFilterVisible">
              <template #icon>
                <n-icon><svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></n-icon>
              </template>
              {{ filterVisible ? '隐藏' : '显示' }}搜索
            </n-button>
            
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
            <n-button size="small" @click="handleBatchEdit">编辑</n-button>
            <n-button size="small" @click="handleBatchCopy">复制</n-button>
            <n-button size="small" @click="handlePrint">打印</n-button>
            <n-button size="small" @click="handleBatchExport">导出</n-button>
            <n-button size="small" type="error" @click="handleBatchDelete">删除</n-button>
          </div>
        </div>
      </div>

      <!-- 表格本身 -->
      <div class="table-wrapper">
        <DataTable ref="dataTableRef" @update-checked-keys="updateCheckedRowKeys" />
      </div>
    </div>

    <!-- 4. 底栏 -->
    <div v-if="config.pagination?.enabled" class="footer-section">
      <n-space justify="center" align="center">
        <n-text depth="3">共 {{ totalCount }} 条记录</n-text>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, computed, provide, type Ref } from 'vue';
import DataTable from './Table/DataTable.vue';

// 定义 emits
const emit = defineEmits(['openConfig']);

// 注入配置
const config = inject('tableConfig') as Ref<any>;

// 筛选相关
const searchKeyword = ref('');
const statusFilter = ref(null);
const typeFilter = ref(null);
const dateRange = ref(null);

// 高级筛选（仅在抽屉中）
const showAdvancedFilter = ref(false);
const ageMin = ref(null);
const ageMax = ref(null);
const departmentFilter = ref([]);
const tagFilter = ref([]);
const scoreRange = ref([0, 100]);
const emailDomain = ref('');
const lastLoginRange = ref(null);

// 计算高级筛选项数量（不包括常用筛选）
const advancedFilterCount = computed(() => {
  let count = 0;
  if (ageMin.value || ageMax.value) count++;
  if (departmentFilter.value.length > 0) count++;
  if (tagFilter.value.length > 0) count++;
  if (scoreRange.value[0] !== 0 || scoreRange.value[1] !== 100) count++;
  if (emailDomain.value) count++;
  if (lastLoginRange.value) count++;
  return count;
});

// 视图相关
const viewMenuOptions = [
  { label: '新建视图', key: 'create' },
  { label: '管理视图', key: 'manage' },
  { label: '导入视图', key: 'import' },
  { label: '导出视图', key: 'export' }
];

const viewTabOptions = [
  { label: '全部视图', key: 'all' },
  { label: '我的视图', key: 'my' },
  { label: '共享视图', key: 'shared' },
  { label: '最近使用', key: 'recent' }
];

const handleViewMenuSelect = (key: string) => {
  console.log('视图菜单', key);
};

const handleViewTabSelect = (key: string) => {
  console.log('切换视图', key);
};

const handleAddView = () => {
  console.log('添加视图');
};
const currentView = ref('default');
const viewOptions = ref([
  { label: '默认视图', value: 'default' },
  { label: '我创建的', value: 'my-created' },
  { label: '最近使用', value: 'recent' }
]);

// 表格数据相关
const checkedRowKeys = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const currentPageSize = ref(config.value.pagination?.pageSize || 10);
const pageCount = computed(() => Math.ceil(totalCount.value / currentPageSize.value));
const filterVisible = ref(true);

// 选项配置
const statusOptions = [
  { label: '启用', value: 'active' },
  { label: '禁用', value: 'inactive' }
];

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
const handleCreate = () => {
  config.value.actions.create?.onClick?.();
};

const handleSearch = () => {
  console.log('搜索', { 
    searchKeyword: searchKeyword.value,
    statusFilter: statusFilter.value,
    typeFilter: typeFilter.value,
    dateRange: dateRange.value
  });
};

const handleReset = () => {
  searchKeyword.value = '';
  statusFilter.value = null;
  typeFilter.value = null;
  dateRange.value = null;
};

const handleAdvancedSearch = () => {
  console.log('应用筛选', {
    // 常用筛选
    searchKeyword: searchKeyword.value,
    statusFilter: statusFilter.value,
    typeFilter: typeFilter.value,
    dateRange: dateRange.value,
    // 高级筛选
    ageRange: [ageMin.value, ageMax.value],
    departments: departmentFilter.value,
    tags: tagFilter.value,
    scoreRange: scoreRange.value,
    emailDomain: emailDomain.value,
    lastLoginRange: lastLoginRange.value
  });
  showAdvancedFilter.value = false;
};

const handleAdvancedReset = () => {
  // 重置所有筛选项
  searchKeyword.value = '';
  statusFilter.value = null;
  typeFilter.value = null;
  dateRange.value = null;
  ageMin.value = null;
  ageMax.value = null;
  departmentFilter.value = [];
  tagFilter.value = [];
  scoreRange.value = [0, 100];
  emailDomain.value = '';
  lastLoginRange.value = null;
};

const handleSaveView = () => {
  console.log('保存当前视图');
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

const handleBatchAction = (action: any, selectedRows: any[]) => {
  action.onClick?.(selectedRows);
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
  padding: 12px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e0e0e6;
}

.view-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.view-tabs {
  margin-left: 16px;
}

.view-tab {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: 1px solid #e0e0e6;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.view-tab:hover {
  border-color: #18a058;
  background: #f0f9ff;
}

.view-tab.active {
  border-color: #18a058;
  background: #f0f9ff;
  color: #18a058;
}

.tab-arrow {
  font-size: 14px;
  transition: transform 0.2s ease;
}

.view-right {
  flex-shrink: 0;
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

/* 4. 底栏 */
.footer-section {
  padding: 12px 0;
  border-top: 1px solid #e0e0e6;
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
