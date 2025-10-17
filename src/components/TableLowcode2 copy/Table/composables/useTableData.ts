import { inject, ref, computed, watch, onMounted } from 'vue';
import type { PaginationProps, DataTableRowKey } from 'naive-ui';
import { TableConfig, TableData } from '@/types/table'; // 导入共享类型

export function useTableData() {
  // 注入共享的配置状态
  const config = inject('tableConfig') as Ref<TableConfig>;

  // 模拟数据
  const mockData = ref<TableData[]>([
    { key: 1, name: '张三', age: 28, address: '北京市朝阳区', email: 'zhangsan@example.com', status: 'active', createTime: '2023-01-01' },
    { key: 2, name: '李四', age: 32, address: '上海市浦东新区', email: 'lisi@example.com', status: 'inactive', createTime: '2023-02-15' },
    { key: 3, name: '王五', age: 24, address: '广州市天河区', email: 'wangwu@example.com', status: 'active', createTime: '2023-03-20' },
    { key: 4, name: '赵六', age: 35, address: '深圳市南山区', email: 'zhaoliu@example.com', status: 'active', createTime: '2023-04-10' },
    { key: 5, name: '钱七', age: 29, address: '杭州市西湖区', email: 'qianqi@example.com', status: 'inactive', createTime: '2023-05-05' },
    { key: 6, name: '孙八', age: 40, address: '成都市武侯区', email: 'sunba@example.com', status: 'active', createTime: '2023-06-18' },
    { key: 7, name: '周九', age: 22, address: '武汉市洪山区', email: 'zhoujiu@example.com', status: 'active', createTime: '2023-07-22' },
    { key: 8, name: '吴十', age: 30, address: '南京市玄武区', email: 'wushi@example.com', status: 'inactive', createTime: '2023-08-01' },
    { key: 9, name: '郑十一', age: 26, address: '重庆市渝北区', email: 'zhengshiyi@example.com', status: 'active', createTime: '2023-09-11' },
    { key: 10, name: '冯十二', age: 33, address: '苏州市工业园区', email: 'fengshier@example.com', status: 'active', createTime: '2023-10-25' },
  ]);

  // 当前分页状态
  const currentPage = ref(1);
  const currentPagesize = ref(
    config.value.pagination.pageSizeOptions.split(',')[0]
      ? parseInt(config.value.pagination.pageSizeOptions.split(',')[0])
      : 10
  );

  // 过滤和排序状态
  const currentFilters = ref<Record<string, any>>({});
  const currentSorter = ref<{ columnKey: string | null; order: 'ascend' | 'descend' | false }>({
    columnKey: config.value.sortFilter.defaultSort.key || null,
    order: config.value.sortFilter.defaultSort.order || false
  });

  // 数据加载状态
  const loading = ref(false);

  // 表格数据
  const tableData = ref<TableData[]>([]);

  // 总数据量（用于后端分页）
  const totalCount = ref(0);

  // 选中的行
  const checkedRowKeys = ref<DataTableRowKey[]>([]);

  // 模拟API请求
  const fetchData = async () => {
    loading.value = true;

    try {
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      if (config.value.sortFilter.filterMode === 'backend' || config.value.sortFilter.sortMode === 'backend') {
        // 后端处理过滤和排序
        // 这里应该是实际的API调用
        console.log('向后端发送请求，参数:', {
          page: currentPage.value,
          pageSize: currentPagesize.value,
          filters: currentFilters.value,
          sorter: currentSorter.value
        });

        // 模拟后端响应
        let result = [...mockData.value];

        // 模拟后端过滤
        if (config.value.sortFilter.filterMode === 'backend') {
          result = result.filter(row => {
            for (const key in currentFilters.value) {
              const filterValue = currentFilters.value[key];
              if (filterValue !== undefined && filterValue !== null && filterValue !== '') {
                const rowValue = String(row[key as keyof TableData]).toLowerCase();
                if (!rowValue.includes(String(filterValue).toLowerCase())) {
                  return false;
                }
              }
            }
            return true;
          });
        }

        // 模拟后端排序
        if (config.value.sortFilter.sortMode === 'backend' && currentSorter.value.order && currentSorter.value.columnKey) {
          const { columnKey, order } = currentSorter.value;
          result.sort((a, b) => {
            const aValue = a[columnKey as keyof TableData];
            const bValue = b[columnKey as keyof TableData];
            if (aValue < bValue) return order === 'ascend' ? -1 : 1;
            if (aValue > bValue) return order === 'ascend' ? 1 : -1;
            return 0;
          });
        }

        totalCount.value = result.length;

        // 模拟后端分页
        if (config.value.pagination.serverSidePagination) {
          const start = (currentPage.value - 1) * currentPagesize.value;
          const end = start + currentPagesize.value;
          tableData.value = result.slice(start, end);
        } else {
          tableData.value = result;
        }
      } else {
        // 前端处理过滤和排序 (这里可以添加前端过滤和排序逻辑，如果需要的话)
        tableData.value = [...mockData.value]; // 暂时直接使用mockData
        totalCount.value = mockData.value.length;
      }


      // Initialize checkedRowKeys based on defaultSelectedRowKeys
      if (config.value.selection.enabled && config.value.selection.defaultSelectedRowKeys) {
        checkedRowKeys.value = tableData.value
          .filter(config.value.selection.defaultSelectedRowKeys)
          .map(row => row.key);
      }

    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 监听配置变化，重新获取数据
  let refreshIntervalId: number | null = null;
  watch(() => config.value.data.refreshInterval, (newVal) => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      refreshIntervalId = null;
    }

    if (newVal > 0) {
      refreshIntervalId = setInterval(fetchData, newVal * 1000) as unknown as number;
    }
  }, { immediate: true });

  // 处理批量操作
  const handleBatchAction = (action: any) => {
    if (action.showConfirmation) {
      window.$dialog.warning({
        title: '确认',
        content: action.confirmationText || '确定要执行此操作吗？',
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: () => {
          if (action.onClick) {
            action.onClick(checkedRowKeys.value);
          } else {
            console.log(`Batch action "${action.label}" confirmed for keys:`, checkedRowKeys.value);
          }
        },
      });
    } else {
      if (action.onClick) {
        action.onClick(checkedRowKeys.value);
      } else {
        console.log(`Batch action "${action.label}" clicked for keys:`, checkedRowKeys.value);
      }
    }
  };

  // 分页配置
  const paginationConfig = computed((): PaginationProps => ({
    page: currentPage.value,
    pageSize: currentPagesize.value,
    pageCount: Math.ceil(totalCount.value / currentPagesize.value),
    itemCount: totalCount.value,
    showSizePicker: true,
    pageSizes: config.value.pagination.pageSizeOptions.split(',').map(s => parseInt(s.trim()) as number),
    showQuickJumper: config.value.pagination.showQuickJumper,
    showTotal: config.value.pagination.showTotal,
    // @ts-ignore
    simple: config.value.pagination.simple,
    // @ts-ignore
    position: config.value.pagination.position,
    onUpdatePage: (page: number) => {
      currentPage.value = page;
      fetchData();
    },
    onUpdatePageSize: (pageSize: number) => {
      currentPagesize.value = pageSize;
      currentPage.value = 1;
      fetchData();
    },
  }));

  // 监听排序和过滤变化
  const handleSorterChange = (sorter: any) => {
    currentSorter.value = sorter;
    currentPage.value = 1; // 排序后回到第一页
    fetchData();
  };

  const handleFiltersChange = (filters: Record<string, any>) => {
    currentFilters.value = filters;
    currentPage.value = 1; // 过滤后回到第一页
    fetchData();
  };

  // 初始数据加载
  onMounted(() => {
    fetchData();
  });

  return {
    tableData,
    loading,
    paginationConfig,
    checkedRowKeys,
    fetchData,
    handleBatchAction,
    handleSorterChange,
    handleFiltersChange,
    currentPage,
    currentPagesize,
    currentFilters,
    currentSorter,
    totalCount,
  };
}
