import { ref, Ref } from 'vue';
import type { DataTableRowKey } from 'naive-ui';
import { TableData } from '@/types/table'; // 导入共享类型

export function useTableEditing(tableData: Ref<TableData[]>) {
  // 编辑相关状态
  const editingRowKey = ref<DataTableRowKey | null>(null);
  const editedData = ref<TableData | null>(null);

  // 开始编辑
  const startEdit = (key: DataTableRowKey) => {
    editingRowKey.value = key;
    editedData.value = { ...tableData.value.find(item => item.key === key) } as TableData; // Deep copy
  };

  // 保存编辑
  const handleSaveEdit = (key: DataTableRowKey) => {
    const index = tableData.value.findIndex(item => item.key === key);
    if (index !== -1 && editedData.value) {
      tableData.value[index] = editedData.value;
      // Optionally, send updated data to backend here
      console.log('保存编辑:', tableData.value[index]);
    }
    editingRowKey.value = null;
    editedData.value = null;
  };

  // 取消编辑
  const handleCancelEdit = (key: DataTableRowKey) => {
    console.log('取消编辑:', key);
    editingRowKey.value = null;
    editedData.value = null;
  };

  return {
    editingRowKey,
    editedData,
    startEdit,
    handleSaveEdit,
    handleCancelEdit,
  };
}
