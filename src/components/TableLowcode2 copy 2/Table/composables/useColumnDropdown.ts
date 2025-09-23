import { ref, inject } from 'vue';
import { TableConfig } from '@/types/table';

export function useColumnDropdown() {
  const config = inject('tableConfig') as Ref<TableConfig>;
  
  const showDropdown = ref(false);
  const dropdownX = ref(0);
  const dropdownY = ref(0);
  const currentColumnKey = ref('');
  
  const handleDropdownClick = (columnKey: string, event: MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    dropdownX.value = rect.left;
    dropdownY.value = rect.bottom + 4;
    currentColumnKey.value = columnKey;
    showDropdown.value = true;
  };
  
  const handleSort = (columnKey: string, order: 'ascend' | 'descend' | null) => {
    // 更新配置中的默认排序
    config.value.sortFilter.defaultSort = { key: columnKey, order };
    window.$message?.info(`${columnKey} 列${order === 'ascend' ? '升序' : '降序'}排序`);
  };
  
  const handleFilter = (columnKey: string) => {
    window.$message?.info(`${columnKey} 列筛选`);
  };
  
  const handleHide = (columnKey: string) => {
    const column = config.value.columns.find(col => col.key === columnKey);
    if (column) {
      column.visible = false;
      window.$message?.info(`已隐藏 ${column.label} 列`);
    }
  };
  
  const getCurrentColumnConfig = () => {
    return config.value.columns.find(col => col.key === currentColumnKey.value);
  };
  
  return {
    showDropdown,
    dropdownX,
    dropdownY,
    currentColumnKey,
    handleDropdownClick,
    handleSort,
    handleFilter,
    handleHide,
    getCurrentColumnConfig,
  };
}
