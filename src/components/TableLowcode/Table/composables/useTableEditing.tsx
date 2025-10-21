import { ref } from 'vue'

export function useTableEditing(tableData) {
  const editingRowKey = ref(null)
  const editedData = ref(null)

  const startEdit = (key) => {
    editingRowKey.value = key
    const row = tableData.value.find(item => item.key === key)
    if (row) {
      editedData.value = { ...row }
    }
  }

  const handleSaveEdit = (key) => {
    if (editedData.value) {
      const index = tableData.value.findIndex(item => item.key === key)
      if (index !== -1) {
        tableData.value[index] = { ...editedData.value }
      }
    }
    editingRowKey.value = null
    editedData.value = null
  }

  const handleCancelEdit = (key) => {
    editingRowKey.value = null
    editedData.value = null
  }

  return {
    editingRowKey,
    editedData,
    startEdit,
    handleSaveEdit,
    handleCancelEdit,
  }
}
