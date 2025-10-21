import { ref } from 'vue'

export function useColumnDropdown() {
  const showDropdown = ref(false)
  const dropdownX = ref(0)
  const dropdownY = ref(0)
  const currentColumnKey = ref(null)

  const handleDropdownClick = (columnKey, event) => {
    currentColumnKey.value = columnKey
    dropdownX.value = event.clientX
    dropdownY.value = event.clientY
    showDropdown.value = true
  }

  const handleSort = (order) => {
    console.log('Sort:', currentColumnKey.value, order)
    showDropdown.value = false
  }

  const handleFilter = () => {
    console.log('Filter:', currentColumnKey.value)
    showDropdown.value = false
  }

  const handleHide = () => {
    console.log('Hide column:', currentColumnKey.value)
    showDropdown.value = false
  }

  const getCurrentColumnConfig = () => {
    return {}
  }

  return {
    showDropdown,
    dropdownX,
    dropdownY,
    currentColumnKey,
    handleDropdownClick,
    handleSort,
    handleFilter,
    handleHide,
    getCurrentColumnConfig
  }
}
