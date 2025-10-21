import { EditOutlined as EditIcon, CopyOutlined as CopyIcon, DeleteOutlined as DeleteIcon, ShareAltOutlined as ShareIcon, ExportOutlined as ExportIcon } from '@vicons/antd'

export function useViewManager(emit: any) {
  const getMoreOptions = (view: any) => {
    return [
      { label: '编辑', key: 'edit', icon: EditIcon },
      { label: '复制', key: 'duplicate', icon: CopyIcon },
      { label: '分享', key: 'share', icon: ShareIcon },
      { label: '导出', key: 'export', icon: ExportIcon },
      { label: '删除', key: 'delete', icon: DeleteIcon }
    ]
  }

  const handleMoreAction = (key: string, view: any) => {
    switch (key) {
      case 'edit':
        emit('edit-view', view)
        break
      case 'duplicate':
        emit('duplicate-view', view)
        break
      case 'share':
        emit('share-view', view)
        break
      case 'export':
        emit('export-view', view)
        break
      case 'delete':
        emit('delete-view', view.key)
        break
    }
  }

  return {
    getMoreOptions,
    handleMoreAction
  }
}
