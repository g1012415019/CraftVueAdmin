import { ref } from 'vue'
import { EditOutlined as EditIcon, DeleteOutlined as DeleteIcon } from '@vicons/antd'

export function useContextMenu(props: any, emit: any, startEdit: Function) {
  const showContextMenuFlag = ref(false)
  const contextMenuX = ref(0)
  const contextMenuY = ref(0)
  const contextMenuOptions = ref([])
  const currentContextView = ref(null)

  const getTabContextMenu = (view: any) => {
    return [
      { label: '重命名', key: 'rename', icon: EditIcon },
      { label: '编辑', key: 'edit', icon: EditIcon },
      { label: '删除', key: 'delete', icon: DeleteIcon, disabled: props.viewTabs.length <= 1 }
    ]
  }

  const handleTabContextMenu = (key: string, view: any) => {
    switch (key) {
      case 'rename':
        startEdit(view)
        break
      case 'edit':
        emit('edit-view', view)
        break
      case 'delete':
        emit('delete-view', view.key)
        break
    }
  }

  const handleContextMenuSelect = (key: string) => {
    if (currentContextView.value) {
      handleTabContextMenu(key, currentContextView.value)
    }
    showContextMenuFlag.value = false
  }

  return {
    showContextMenuFlag,
    contextMenuX,
    contextMenuY,
    contextMenuOptions,
    currentContextView,
    getTabContextMenu,
    handleContextMenuSelect
  }
}
