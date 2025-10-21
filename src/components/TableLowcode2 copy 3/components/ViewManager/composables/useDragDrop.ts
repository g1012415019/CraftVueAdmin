import { ref } from 'vue'

export function useDragDrop(emit: any) {
  const draggedView = ref(null)

  const handleDragStart = (event: DragEvent, view: any) => {
    draggedView.value = view
    event.dataTransfer?.setData('text/plain', view.key)
  }

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: DragEvent, targetView: any) => {
    event.preventDefault()
    if (draggedView.value && draggedView.value.key !== targetView.key) {
      emit('views-reorder', draggedView.value, targetView)
    }
    draggedView.value = null
  }

  const handleDragEnd = () => {
    draggedView.value = null
  }

  return {
    draggedView,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd
  }
}
