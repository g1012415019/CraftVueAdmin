import { computed, inject } from 'vue'
import { NCheckbox, NIcon, NButton, NSpace } from 'naive-ui'
import { ChevronDownOutline, CreateOutline, TrashOutline } from '@vicons/ionicons5'
import { useColumnHeader } from './useColumnHeader.tsx'

export function useSelectionColumn(
  currentPage,
  currentPagesize,
  checkedRowKeys,
  handleUpdateCheckedRowKeys,
  hoveredColumnKey,
  tableData,
  hoveredRowKey,
  onDropdownClick
) {
  const config = inject('tableConfig')
  const { renderColumnHeader } = useColumnHeader(onDropdownClick)

  // 计算全选状态
  const isAllChecked = computed(() => {
    if (tableData.value.length === 0) return false
    return tableData.value.every(row => checkedRowKeys.value.includes(row.key))
  })

  const isIndeterminate = computed(() => {
    const checkedCount = tableData.value.filter(row => checkedRowKeys.value.includes(row.key)).length
    return checkedCount > 0 && checkedCount < tableData.value.length
  })

  // 处理全选/取消全选
  const handleSelectAll = (checked) => {
    if (checked) {
      const allKeys = tableData.value.map(row => row.key)
      handleUpdateCheckedRowKeys(allKeys)
    } else {
      handleUpdateCheckedRowKeys([])
    }
  }

  const selectionColumn = computed(() => {
    const isSelectionEnabled = config.value.selection?.enabled
    const showRowNumber = config.value.basic?.showRowNumber
    const showRecordShortcut = config.value.interaction?.showRecordShortcut

    // 如果既不显示序号也不启用选择也不显示快捷方式，则不显示此列
    if (!isSelectionEnabled && !showRowNumber && !showRecordShortcut) {
      return null
    }

    const col = {
      title: () => {
        if (isSelectionEnabled && config.value.selection?.mode === 'multiple') {
          return (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              position: 'relative'
            }}>
              <NCheckbox
                checked={isAllChecked.value}
                indeterminate={isIndeterminate.value}
                onUpdateChecked={handleSelectAll}
              />
              <NIcon
                style={{
                  opacity: '1',
                  cursor: 'pointer',
                  position: 'absolute',
                  right: '4px',
                  fontSize: '14px'
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  onDropdownClick?.('row-index-selection', e)
                }}
              >
                <ChevronDownOutline />
              </NIcon>
            </div>
          )
        }
        return renderColumnHeader('row-index-selection', '#', hoveredColumnKey, true)
      },
      key: 'row-index-selection',
      width: showRecordShortcut ? 120 : (config.value.basic?.rowNumberWidth || 60),
      align: config.value.basic?.rowNumberAlign || 'center',
      fixed: config.value.selection?.columnPosition || 'left',
      render: (row, index) => {
        const isRowHovered = hoveredRowKey.value === row.key
        const rowNumber = (currentPage.value - 1) * currentPagesize.value + index + (config.value.basic?.rowNumberStart || 1)
        
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            gap: '4px'
          }}>
            {/* 记录快捷方式 - 优先显示 */}
            {showRecordShortcut && (
              <NSpace size="small">
                <NButton
                  size="tiny"
                  type="primary"
                  ghost
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('编辑记录:', row)
                    config.value.events?.onEdit?.(row)
                  }}
                >
                  <NIcon><CreateOutline /></NIcon>
                </NButton>
                <NButton
                  size="tiny"
                  type="error"
                  ghost
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('删除记录:', row)
                    config.value.events?.onDelete?.(row)
                  }}
                >
                  <NIcon><TrashOutline /></NIcon>
                </NButton>
              </NSpace>
            )}
            
            {/* 复选框显示逻辑 - 恢复原来的逻辑 */}
            {isSelectionEnabled && (!showRowNumber || isRowHovered || checkedRowKeys.value.includes(row.key)) && (
              <NCheckbox
                class="table-selection-checkbox"
                checked={checkedRowKeys.value.includes(row.key)}
                onUpdateChecked={(val) => {
                  const newCheckedKeys = val
                    ? [...checkedRowKeys.value, row.key]
                    : checkedRowKeys.value.filter((key) => key !== row.key)
                  handleUpdateCheckedRowKeys(newCheckedKeys)
                }}
              />
            )}
            
            {/* 行号显示逻辑 - 恢复原来的逻辑 */}
            {showRowNumber && (!isSelectionEnabled || (!isRowHovered && !checkedRowKeys.value.includes(row.key))) && (
              <span 
                class="table-row-number"
                style={{
                  fontSize: '12px',
                  color: '#999',
                  userSelect: 'none'
                }}
              >
                {rowNumber}
              </span>
            )}
          </div>
        )
      }
    }

    return col
  })

  return {
    selectionColumn
  }
}
