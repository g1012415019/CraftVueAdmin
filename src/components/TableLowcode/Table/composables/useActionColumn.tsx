import { computed, inject } from 'vue'
import { NButton, NSpace, NIcon } from 'naive-ui'
import { ChevronDownOutline } from '@vicons/ionicons5'
import { useColumnHeader } from './useColumnHeader.tsx'

export function useActionColumn(
  editingRowKey,
  handleSaveEdit,
  handleCancelEdit,
  hoveredColumnKey,
  onDropdownClick
) {
  const config = inject('tableConfig')
  const { renderColumnHeader } = useColumnHeader(onDropdownClick)

  const actionColumn = computed(() => {
    if (!config.value.actions?.showActionColumn) {
      return null
    }

    const col = {
      title: () => renderColumnHeader('actions', '操作', hoveredColumnKey, false),
      key: 'actions',
      width: config.value.actions?.actionColumnWidth || 120,
      align: 'center',
      fixed: config.value.actions?.actionColumnPosition || 'right',
      render: (row) => {
        // 如果正在编辑此行，显示保存/取消按钮
        if (editingRowKey.value === row.key) {
          return (
            <NSpace size="small">
              <NButton
                size="small"
                type="primary"
                onClick={() => handleSaveEdit(row.key)}
              >
                保存
              </NButton>
              <NButton
                size="small"
                onClick={() => handleCancelEdit(row.key)}
              >
                取消
              </NButton>
            </NSpace>
          )
        }

        // 普通状态下的操作按钮
        const actions = config.value.actions?.inline || []
        
        return (
          <NSpace size="small">
            {actions.map((action, index) => (
              <NButton
                key={index}
                size="small"
                type={action.type || 'default'}
                onClick={() => action.onClick?.(row)}
                disabled={action.disabled?.(row)}
                style={{ display: action.visible?.(row) !== false ? 'inline-flex' : 'none' }}
              >
                {action.icon && (
                  <NIcon>
                    {action.icon}
                  </NIcon>
                )}
                {action.label}
              </NButton>
            ))}
          </NSpace>
        )
      }
    }

    return col
  })

  return {
    actionColumn
  }
}
