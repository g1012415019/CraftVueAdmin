<template>
  <div class="user-management">
    <!-- 顶部工具栏 -->
    <div class="top-toolbar">
      <div class="left-section">
        <NButton quaternary size="small">
          <template #icon>
            <NIcon :component="MenuOutline" />
          </template>
        </NButton>
        <NButton quaternary size="small">
          <template #icon>
            <NIcon :component="AddOutline" />
          </template>
        </NButton>
        <span class="title">站/桩/端口详情</span>
      </div>
      
      <div class="right-section">
        <NButton quaternary size="small">
          <template #icon>
            <NIcon :component="SearchOutline" />
          </template>
        </NButton>
        <NButton quaternary size="small">
          <template #icon>
            <NIcon :component="FilterOutline" />
          </template>
        </NButton>
        <NButton quaternary size="small">草稿箱</NButton>
        <NButton type="primary" size="small">+ 记录</NButton>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="tabs-section">
      <div class="tabs-left">
        <NTabs v-model:value="activeTab" type="line" size="small">
          <NTab name="all" tab="全部" />
          <NTab name="detail" tab="详情" />
          <NTab name="table1" tab="表格1" />
          <NTab name="table2" tab="表格2" />
          <NTab name="table3" tab="表格3" />
        </NTabs>
      </div>
      <div class="tabs-right">
        <NButton quaternary size="small">
          <template #icon>
            <NIcon :component="RefreshOutline" />
          </template>
        </NButton>
        <span class="record-count">共3行，1/1页</span>
      </div>
    </div>

    <!-- 搜索栏 -->
    <div class="search-section">
      <div class="search-group">
        <span class="search-label">站点名称</span>
        <NInput size="small" placeholder="搜索" clearable>
          <template #suffix>
            <NIcon :component="SearchOutline" />
          </template>
        </NInput>
      </div>
      
      <div class="search-group">
        <span class="search-label">站点编号</span>
        <NInput size="small" placeholder="搜索" clearable>
          <template #suffix>
            <NIcon :component="SearchOutline" />
          </template>
        </NInput>
      </div>
      
      <div class="search-group">
        <span class="search-label">设备品牌型号</span>
        <NInput size="small" placeholder="搜索" clearable>
          <template #suffix>
            <NIcon :component="SearchOutline" />
          </template>
        </NInput>
      </div>
    </div>

    <!-- 数据表格 -->
    <div class="table-section">
      <NDataTable
        :columns="columns"
        :data="tableData"
        :pagination="false"
        size="small"
        :row-key="(row: any) => row.id"
        class="compact-table"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MenuOutline, AddOutline, SearchOutline, RefreshOutline } from '@vicons/ionicons5'

// 添加FilterOutline图标的替代
const FilterOutline = MenuOutline

const activeTab = ref('table3')

const columns = [
  {
    type: 'selection',
    width: 40
  },
  {
    title: '站点编号',
    key: 'siteNumber',
    width: 80,
    sorter: true
  },
  {
    title: '站点名称',
    key: 'siteName',
    width: 120,
    sorter: true
  },
  {
    title: '所属区县',
    key: 'district',
    width: 100
  },
  {
    title: '站点性质',
    key: 'siteType',
    width: 80
  },
  {
    title: '桩数量',
    key: 'pileCount',
    width: 80
  },
  {
    title: '端口数量',
    key: 'portCount',
    width: 80
  },
  {
    title: '设备',
    key: 'device',
    width: 100
  }
]

const tableData = ref([
  {
    id: 1,
    siteNumber: 2,
    siteName: 'xxx小2',
    district: '锡山区',
    siteType: '民用',
    pileCount: 2,
    portCount: 201,
    device: '雅迪'
  },
  {
    id: 2,
    siteNumber: 1,
    siteName: 'xxx小区',
    district: '新吴区',
    siteType: '民用',
    pileCount: 2,
    portCount: 200,
    device: '雅迪'
  },
  {
    id: 3,
    siteNumber: 3,
    siteName: 'xxx小区3',
    district: '惠山区',
    siteType: '民用',
    pileCount: 25,
    portCount: 500,
    device: '雅迪'
  }
])
</script>

<style lang="scss" scoped>
.user-management {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  
  .top-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 16px;
    background: white;
    border-bottom: 1px solid #e0e0e0;
    
    .left-section {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .title {
        font-size: 14px;
        color: #333;
        margin-left: 8px;
      }
    }
    
    .right-section {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
  
  .tabs-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    background: white;
    border-bottom: 1px solid #e0e0e0;
    
    .tabs-left {
      flex: 1;
    }
    
    .tabs-right {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .record-count {
        font-size: 12px;
        color: #666;
      }
    }
  }
  
  .search-section {
    display: flex;
    gap: 24px;
    padding: 12px 16px;
    background: white;
    border-bottom: 1px solid #e0e0e0;
    
    .search-group {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .search-label {
        font-size: 12px;
        color: #666;
        white-space: nowrap;
      }
    }
  }
  
  .table-section {
    flex: 1;
    padding: 0 16px 16px;
    background: white;
    
    :deep(.compact-table) {
      .n-data-table-th {
        padding: 6px 8px;
        font-size: 12px;
        background: #fafafa;
      }
      
      .n-data-table-td {
        padding: 6px 8px;
        font-size: 12px;
      }
      
      .n-data-table-tr:nth-child(odd) {
        background: #fafafa;
      }
    }
  }
}
</style>
