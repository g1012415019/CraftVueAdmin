import { ref } from 'vue'

export function useFloatingActionBar() {
  const showFloatingBar = ref(false)
  const floatingBarX = ref(0)
  const floatingBarY = ref(0)
  const currentHoveredRow = ref(null)

  const handleRowHover = (row, event) => {
    currentHoveredRow.value = row
    floatingBarX.value = event.clientX
    floatingBarY.value = event.clientY
    showFloatingBar.value = true
  }

  const handleRowLeave = () => {
    showFloatingBar.value = false
    currentHoveredRow.value = null
  }

  const handleFloatingAction = (action) => {
    if (currentHoveredRow.value && action.onClick) {
      action.onClick(currentHoveredRow.value)
    }
    showFloatingBar.value = false
  }

  return {
    showFloatingBar,
    floatingBarX,
    floatingBarY,
    currentHoveredRow,
    handleRowHover,
    handleRowLeave,
    handleFloatingAction
  }
}
