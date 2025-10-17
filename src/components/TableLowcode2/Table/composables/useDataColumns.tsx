import { computed, ref, inject } from 'vue'
import {
  NInput, NSelect, NSpace, NInputNumber, NDatePicker, NButton, NIcon
} from 'naive-ui'
import { ChevronDownOutline } from '@vicons/ionicons5'
import { sorterFunctions } from '../utils/sorterFunctions'
import { useColumnHeader } from './useColumnHeader.tsx'

export function useDataColumns(
  editingRowKey,
  editedData,
  hoveredColumnKey,
  onDropdownClick,
  selectedCell
) {
  const config = inject('tableConfig')
  const { renderColumnHeader } = useColumnHeader(onDropdownClick)

  console.log('useDataColumns called, selectedCell:', selectedCell?.value)

  const dataColumns = computed(() => {
    console.log('dataColumns computed, config.columns:', config.value.columns?.length)
    const cols = []

    config.value.columns.forEach((col) => {
      if (!col.visible) return

      console.log('Processing column:', col.key, col.label)

      const column = {
        title: () => renderColumnHeader(col.key, col.label, hoveredColumnKey, false),
        key: col.key,
        width: col.width || undefined,
        align: col.align,
        fixed: col.fixed || undefined,
        resizable: true,
        render: (row) => {
          if (config.value.editing?.inlineEditingEnabled && 
              config.value.editing.mode === 'row' && 
              editingRowKey.value === row.key && 
              col.editable) {
            const value = editedData.value ? editedData.value[col.key] : row[col.key]
            
            switch (col.dataType) {
              case 'number':
                return (
                  <NInputNumber
                    value={value}
                    onUpdateValue={(val) => {
                      if (editedData.value) editedData.value[col.key] = val
                    }}
                    size="small"
                  />
                )
              case 'select':
                return (
                  <NSelect
                    value={value}
                    options={col.selectOptions}
                    onUpdateValue={(val) => {
                      if (editedData.value) editedData.value[col.key] = val
                    }}
                    size="small"
                  />
                )
              case 'date':
                return (
                  <NDatePicker
                    value={value}
                    onUpdateValue={(val) => {
                      if (editedData.value) editedData.value[col.key] = val
                    }}
                    size="small"
                    type="date"
                  />
                )
              default:
                return (
                  <NInput
                    value={value}
                    onUpdateValue={(val) => {
                      if (editedData.value) editedData.value[col.key] = val
                    }}
                    size="small"
                  />
                )
            }
          }

          // 非编辑状态的渲染 - 添加单元格交互
          const cellValue = row[col.key]
          
          // 格式化显示值
          let displayValue = cellValue
          switch (col.dataType) {
            case 'date':
              displayValue = cellValue ? new Date(cellValue).toLocaleDateString() : ''
              break
            case 'number':
              displayValue = typeof cellValue === 'number' ? cellValue.toLocaleString() : cellValue
              break
            case 'select':
              const option = col.selectOptions?.find(opt => opt.value === cellValue)
              displayValue = option ? option.label : cellValue
              break
            case 'boolean':
              displayValue = cellValue ? '是' : '否'
              break
            default:
              displayValue = cellValue || ''
          }

          // 如果有自定义渲染函数，使用自定义渲染
          if (col.render && typeof col.render === 'function') {
            return col.render(cellValue, row)
          }

          // 返回可交互的单元格
          return displayValue
        }
      }

      // 添加排序功能
      if (col.sortable) {
        if (config.value.sortFilter?.sortMode === 'frontend') {
          column.sorter = (a, b) => {
            const sorterFn = sorterFunctions[col.dataType] || sorterFunctions.string
            return sorterFn(a[col.key], b[col.key])
          }
        } else {
          column.sorter = true
        }
      }

      // 添加筛选功能
      if (col.filterable) {
        if (config.value.sortFilter?.filterMode === 'frontend') {
          if (col.dataType === 'select' && col.selectOptions) {
            column.filter = (value, row) => {
              if (!value) return true
              return row[col.key] === value
            }
            column.filterOptions = col.selectOptions.map(opt => ({
              label: opt.label,
              value: opt.value
            }))
          } else {
            column.filter = (value, row) => {
              if (!value) return true
              const cellValue = String(row[col.key]).toLowerCase()
              return cellValue.includes(String(value).toLowerCase())
            }
            column.filterOptionValue = null
          }
        } else {
          column.filter = true
        }
      }

      cols.push(column)
    })

    return cols
  })

  return {
    dataColumns
  }
}
