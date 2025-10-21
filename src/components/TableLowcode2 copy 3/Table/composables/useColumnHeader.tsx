import { inject } from 'vue'
import { NIcon } from 'naive-ui'
import { ChevronDownOutline } from '@vicons/ionicons5'

export function useColumnHeader(onDropdownClick) {
  const config = inject('tableConfig')

  const renderColumnHeader = (columnKey, title, hoveredColumnKey, isSpecialColumn = false) => {
    const showDropdown = config.value.columns?.some(col => col.key === columnKey && (col.sortable || col.filterable)) || isSpecialColumn
    
    return (
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          position: 'relative'
        }}
        onMouseenter={() => hoveredColumnKey.value = columnKey}
        onMouseleave={() => hoveredColumnKey.value = null}
      >
        <span style={{ flex: 1 }}>{title}</span>
        {showDropdown && hoveredColumnKey.value === columnKey && (
          <NIcon
            style={{
              cursor: 'pointer',
              fontSize: '14px',
              opacity: '0.7'
            }}
            onClick={(e) => {
              e.stopPropagation()
              onDropdownClick?.(columnKey, e)
            }}
          >
            <ChevronDownOutline />
          </NIcon>
        )}
      </div>
    )
  }

  return {
    renderColumnHeader
  }
}
