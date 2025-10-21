import { ref } from 'vue'

export function useViewEdit(emit: any) {
  const editingViews = ref(new Map())

  const startEdit = (view: any) => {
    editingViews.value.set(view.key, {
      editing: true,
      editName: view.label
    })
  }

  const finishEdit = (view: any) => {
    const editState = editingViews.value.get(view.key)
    if (editState?.editName && editState.editName.trim()) {
      emit('rename-view', { ...view, label: editState.editName.trim() })
    }
    editingViews.value.delete(view.key)
  }

  return {
    editingViews,
    startEdit,
    finishEdit
  }
}
