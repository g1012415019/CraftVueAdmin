import { ref, computed, type Ref } from 'vue'

export function useTableActions(config: Ref<any>) {
  const checkedRowKeys = ref([])

  const batchActions = computed(() => config?.value?.actions?.batch || [])

  const handleBatchAction = (action: any) => {
    if (action.showConfirmation) {
      window.$dialog?.warning({
        title: '确认操作',
        content: `确定要${action.label}选中的 ${checkedRowKeys.value.length} 条记录吗？`,
        positiveText: '确定',
        onPositiveClick: () => action.onClick?.([])
      })
    } else {
      action.onClick?.([])
    }
  }

  const handleCreate = () => config?.value?.actions?.create?.onClick?.()
  const handlePrint = () => console.log('打印表格')
  const handleFullscreen = () => console.log('全屏显示')
  const updateCheckedRowKeys = (keys: any[]) => checkedRowKeys.value = keys

  return {
    checkedRowKeys,
    batchActions,
    handleBatchAction,
    handleCreate,
    handlePrint,
    handleFullscreen,
    updateCheckedRowKeys
  }
}
