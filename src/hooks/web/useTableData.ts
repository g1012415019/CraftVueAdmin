import { ref, onMounted, watch } from 'vue';
import { DataService } from '../../components/TableLowcode/DataService';
import { useTableStore } from '../../store/modules/table';

export function useTableData() {
  const tableStore = useTableStore();
  const dataService = new DataService();

  const tableData = ref<any[]>([]);
  const loading = ref(false);
  const total = ref(0);

  const fetchData = async () => {
    loading.value = true;
    try {
      const { api, method, params, dataKey, totalKey } = tableStore.getDataSourceConfig;

      if (api) {
        const result = await dataService.fetchData({
          api,
          method,
          params,
          dataKey,
          totalKey,
        }, params || {});

        // Safely access data and total using provided keys or defaults
        const resolvedData = dataKey ? result[dataKey.split('.')[0]][dataKey.split('.')[1]] : result.list;
        const resolvedTotal = totalKey ? result[totalKey.split('.')[0]][totalKey.split('.')[1]] : result.total;

        tableData.value = resolvedData || [];
        total.value = resolvedTotal || 0;
      } else {
        // Handle static data or other modes if implemented
        tableData.value = [];
        total.value = 0;
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      tableData.value = [];
      total.value = 0;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    fetchData();
  });

  watch(
    () => tableStore.getDataSourceConfig,
    () => {
      fetchData();
    },
    { deep: true }
  );

  return {
    tableData,
    loading,
    total,
    fetchData,
  };
}
