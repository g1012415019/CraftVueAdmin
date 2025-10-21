import { ref, inject, computed, onMounted, onUnmounted } from 'vue'

export function useTableRowInteraction(
  tableData,
  startEdit,
  handleContextMenu,
  editingRowKey,
  onRowHover,
  onRowLeave
) {
  const config = inject('tableConfig')
  
  // 行悬停状态
  const hoveredRowKey = ref(null)
  // 选中的单元格
  const selectedCell = ref({ rowKey: null, columnKey: null })
  // 选中的行
  const selectedRowKey = ref(null)
  
  // 拖拽处理
  const draggedItem = ref(null)

  // 行属性配置
  const rowProps = computed(() => {
    return (row) => {
      const props = {
        style: getRowStyle(row),
        onMouseenter: (e) => handleRowMouseEnter(row, e),
        onMouseleave: () => handleRowMouseLeave(),
        tabindex: config.value.interaction?.mode === 'spreadsheet' ? 0 : -1,
      }

      // 根据交互模式配置点击事件
      if (config.value.interaction?.mode === 'classic') {
        props.onClick = (e) => handleRowClick(row, e)
      } else if (config.value.interaction?.mode === 'spreadsheet') {
        props.onKeydown = (e) => handleKeydown(e, row)
        props.onFocus = () => handleRowFocus(row)
      }

      // 右键菜单
      if (config.value.interaction?.enableContextMenu) {
        props.onContextmenu = (e) => handleContextMenu(e, row)
      }

      // 拖拽功能
      if (config.value.interaction?.allowDragSort) {
        props.draggable = true
        props.onDragstart = (e) => handleDragStart(e, row)
        props.onDragover = (e) => handleDragOver(e)
        props.onDrop = (e) => handleDrop(e, row)
      }

      return props
    }
  })

  // 行类名配置
  const rowClassName = computed(() => {
    return (row) => {
      const classes = []
      
      if (hoveredRowKey.value === row.key) {
        classes.push('hovered-row')
      }
      
      if (editingRowKey.value === row.key) {
        classes.push('editing-row')
      }

      if (selectedRowKey.value === row.key) {
        classes.push('selected-row')
      }

      // 根据行状态添加类名
      if (row.status) {
        classes.push(`row-status-${row.status}`)
      }

      return classes.join(' ')
    }
  })

  // 获取行样式
  const getRowStyle = (row) => {
    const style = {}
    
    // 行高配置
    const rowHeight = getRowHeight()
    style.height = `${rowHeight}px`
    
    return style
  }

  // 获取行高
  const getRowHeight = () => {
    if (config.value.basic?.customRowHeight) {
      return config.value.basic.customRowHeight
    }
    
    const densityMap = {
      compact: 28,
      medium: 36,
      high: 44,
      ultra: 52
    }
    
    return densityMap[config.value.basic?.rowDensity] || 36
  }

  // 行鼠标进入事件
  const handleRowMouseEnter = (row, e) => {
    hoveredRowKey.value = row.key
    onRowHover?.(row, e)
  }

  // 行鼠标离开事件
  const handleRowMouseLeave = () => {
    hoveredRowKey.value = null
    onRowLeave?.()
  }

  // 经典模式：行点击事件
  const handleRowClick = (row, e) => {
    // 阻止在编辑状态下的点击
    if (editingRowKey.value) return
    
    selectedRowKey.value = row.key
    
    // 打开记录详情
    openRecordDetail(row)
  }

  // 电子表格模式：行获得焦点
  const handleRowFocus = (row) => {
    selectedRowKey.value = row.key
  }

  // 电子表格模式：键盘事件
  const handleKeydown = (e, row) => {
    if (e.code === 'Space') {
      e.preventDefault()
      openRecordDetail(row)
    }
  }

  // 单元格点击事件（电子表格模式）
  const handleCellClick = (row, column, e) => {
    if (config.value.interaction?.mode !== 'spreadsheet') return
    
    e.stopPropagation()
    selectedCell.value = { rowKey: row.key, columnKey: column.key }
    selectedRowKey.value = row.key
  }

  // 单元格双击事件（行内编辑）
  const handleCellDoubleClick = (row, column, e) => {
    if (!config.value.editing?.inlineEditingEnabled) return
    if (!column.editable) return
    
    e.stopPropagation()
    startEdit(row.key)
  }

  // 打开记录详情
  const openRecordDetail = (row) => {
    console.log('打开记录详情:', row)
    // 这里可以触发详情弹窗或跳转到详情页
    config.value.events?.onRecordDetail?.(row)
  }

  // 拖拽开始
  const handleDragStart = (e, row) => {
    draggedItem.value = row
    
    const target = e.currentTarget
    
    // 创建拖拽图像
    const dragImage = target.cloneNode(true)
    dragImage.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      width: ${target.offsetWidth}px;
      opacity: 0.8;
      background: white;
      border: 2px solid #18a058;
      border-radius: 4px;
    `
    
    document.body.appendChild(dragImage)
    e.dataTransfer?.setDragImage(dragImage, 0, 0)
    
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage)
      }
    }, 0)
  }

  // 拖拽悬停
  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  // 拖拽放置
  const handleDrop = (e, targetRow) => {
    e.preventDefault()
    
    if (!draggedItem.value || draggedItem.value.key === targetRow.key) {
      return
    }
    
    const draggedIndex = tableData.value.findIndex(item => item.key === draggedItem.value.key)
    const targetIndex = tableData.value.findIndex(item => item.key === targetRow.key)
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // 重新排序数据
      const newData = [...tableData.value]
      const [draggedRow] = newData.splice(draggedIndex, 1)
      newData.splice(targetIndex, 0, draggedRow)
      
      // 更新数据
      tableData.value = newData
      
      // 触发排序事件
      config.value.events?.onRowReorder?.(draggedRow, targetRow, newData)
    }
    
    draggedItem.value = null
  }

  // 移动行
  const moveRowUp = (rowKey) => {
    const index = tableData.value.findIndex(row => row.key === rowKey)
    if (index > 0) {
      const newData = [...tableData.value]
      ;[newData[index - 1], newData[index]] = [newData[index], newData[index - 1]]
      tableData.value = newData
    }
  }

  const moveRowDown = (rowKey) => {
    const index = tableData.value.findIndex(row => row.key === rowKey)
    if (index < tableData.value.length - 1) {
      const newData = [...tableData.value]
      ;[newData[index], newData[index + 1]] = [newData[index + 1], newData[index]]
      tableData.value = newData
    }
  }

  return {
    rowProps,
    rowClassName,
    moveRowUp,
    moveRowDown,
    hoveredRowKey,
    selectedCell,
    selectedRowKey,
    handleRowMouseEnter,
    handleRowMouseLeave,
    handleRowClick,
    handleCellClick,
    handleCellDoubleClick,
    openRecordDetail,
  }
}
