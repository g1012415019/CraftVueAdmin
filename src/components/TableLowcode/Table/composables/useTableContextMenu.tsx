import { ref } from 'vue'

export function useTableContextMenu() {
  const showContextMenu = ref(false)
  const contextMenuX = ref(0)
  const contextMenuY = ref(0)
  const currentRow = ref(null)

  const handleContextMenu = (e, row) => {
    e.preventDefault()
    currentRow.value = row
    contextMenuX.value = e.clientX
    contextMenuY.value = e.clientY
    showContextMenu.value = true
  }

  const hideContextMenu = () => {
    showContextMenu.value = false
    currentRow.value = null
  }

  return {
    showContextMenu,
    contextMenuX,
    contextMenuY,
    currentRow,
    handleContextMenu,
    hideContextMenu
  }
}
