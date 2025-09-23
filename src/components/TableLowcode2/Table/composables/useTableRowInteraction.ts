import { ref, inject } from 'vue';
import type { DataTableRowKey } from 'naive-ui';
import { TableConfig, TableData } from '@/types/table';

export function useTableRowInteraction(
  tableData: Ref<TableData[]>,
  startEdit: (key: DataTableRowKey) => void,
  handleContextMenu: (e: MouseEvent, row: TableData) => void,
  editingRowKey: Ref<DataTableRowKey | null>,
  onRowHover?: (row: TableData, event: MouseEvent) => void,
  onRowLeave?: () => void
) {
  const config = inject('tableConfig') as Ref<TableConfig>;
  
  // 行悬停状态
  const hoveredRowKey = ref<DataTableRowKey | null>(null);

  // 拖拽处理
  const draggedItem = ref<TableData | null>(null);

  const handleDragStart = (e: DragEvent, row: TableData) => {
    draggedItem.value = row;
    
    const target = e.currentTarget as HTMLElement;
    
    // 创建拖拽图像，避免表格抖动
    const dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.style.cssText = `
      position: absolute;
      top: -1000px;
      left: -1000px;
      width: ${target.offsetWidth}px;
      opacity: 0.8;
      background: white;
      border: 2px solid #18a058;
      border-radius: 4px;
    `;
    
    // 添加箭头到拖拽图像
    const arrowIndicator = document.createElement('div');
    arrowIndicator.innerHTML = '↕';
    arrowIndicator.style.cssText = `
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      font-size: 16px;
      color: #18a058;
      z-index: 10;
    `;
    dragImage.appendChild(arrowIndicator);
    
    document.body.appendChild(dragImage);
    
    if (e.dataTransfer) {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', JSON.stringify(row.key));
      e.dataTransfer.setDragImage(dragImage, e.offsetX, e.offsetY);
    }
    
    // 原行只改变透明度，不添加元素
    target.style.opacity = '0.5';
    
    // 延迟移除临时元素
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);
  };

  const handleDragEnter = (e: DragEvent, row: TableData) => {
    if (!config.value.interaction.dragSort || !draggedItem.value) return;
    
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    
    // 移除所有现有的指示器
    document.querySelectorAll('.drag-indicator').forEach(el => el.remove());
    
    // 添加边框指示器
    target.style.borderTop = '3px solid #18a058';
    target.style.borderBottom = '3px solid #18a058';
    target.classList.add('drag-target');
  };

  const handleDragLeave = (e: DragEvent, row: TableData) => {
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    
    // 清除样式
    target.style.borderTop = '';
    target.style.borderBottom = '';
    target.classList.remove('drag-target');
  };

  const handleDragOver = (e: DragEvent, row: TableData) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDrop = (e: DragEvent, targetRow: TableData) => {
    e.preventDefault();
    
    // 清理所有拖拽样式
    document.querySelectorAll('.drag-target').forEach(el => {
      (el as HTMLElement).style.borderTop = '';
      (el as HTMLElement).style.borderBottom = '';
      el.classList.remove('drag-target');
    });
    
    // 恢复拖拽行的透明度
    document.querySelectorAll('tr[draggable="true"]').forEach(el => {
      (el as HTMLElement).style.opacity = '';
    });

    if (draggedItem.value && draggedItem.value.key !== targetRow.key) {
      const draggedIndex = tableData.value.findIndex(item => item.key === draggedItem.value!.key);
      const targetIndex = tableData.value.findIndex(item => item.key === targetRow.key);

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const [removed] = tableData.value.splice(draggedIndex, 1);
        tableData.value.splice(targetIndex, 0, removed);
        console.log('表格数据重新排序:', tableData.value);
      }
    }
    draggedItem.value = null;
  };

  // 向上移动行
  const moveRowUp = (rowKeyToMove: DataTableRowKey) => {
    const index = tableData.value.findIndex(item => item.key === rowKeyToMove);
    if (index > 0) {
      const [row] = tableData.value.splice(index, 1);
      tableData.value.splice(index - 1, 0, row);
      console.log('行向上移动:', rowKeyToMove);
    }
  };

  // 向下移动行
  const moveRowDown = (rowKeyToMove: DataTableRowKey) => {
    const index = tableData.value.findIndex(item => item.key === rowKeyToMove);
    if (index !== -1 && index < tableData.value.length - 1) {
      const [row] = tableData.value.splice(index, 1);
      tableData.value.splice(index + 1, 0, row);
      console.log('行向下移动:', rowKeyToMove);
    }
  };

  // 行属性
  const rowProps = (row: TableData) => {
    return {
      style: { 
        cursor: config.value.interaction.rowClick || 
                config.value.interaction.rowDblClick || 
                config.value.interaction.contextMenu || 
                (config.value.editing.inlineEditingEnabled && config.value.editing.trigger === 'dblclick') || 
                config.value.interaction.dragSort ? 'pointer' : 'default' 
      },
      onMouseenter: (e: MouseEvent) => {
        console.log('行鼠标进入事件触发:', row);
        hoveredRowKey.value = row.key;
        onRowHover?.(row, e);
      },
      onMouseleave: () => {
        console.log('行鼠标离开事件触发');
        hoveredRowKey.value = null;
        onRowLeave?.();
      },
      onClick: () => {
        if (config.value.interaction.rowClick) {
          console.log('行点击:', row);
        }
      },
      onDblclick: () => {
        if (config.value.interaction.rowDblClick) {
          console.log('行双击:', row);
        }
        // 双击进入编辑模式
        if (config.value.editing.inlineEditingEnabled && 
            config.value.editing.trigger === 'dblclick' && 
            config.value.editing.mode === 'row') {
          startEdit(row.key);
        }
      },
      onContextmenu: (e: MouseEvent) => handleContextMenu(e, row),
      draggable: config.value.interaction.dragSort,
      onDragstart: (e: DragEvent) => handleDragStart(e, row),
      onDragenter: (e: DragEvent) => handleDragEnter(e, row),
      onDragleave: (e: DragEvent) => handleDragLeave(e, row),
      onDragover: (e: DragEvent) => handleDragOver(e, row),
      onDrop: (e: DragEvent) => handleDrop(e, row),
      onMouseenter: () => {
        hoveredRowKey.value = row.key;
      },
      onMouseleave: () => {
        hoveredRowKey.value = null;
      },
    };
  };

  // 行类名
  const rowClassName = (row: TableData) => {
    const classes = [];
    if (hoveredRowKey.value === row.key) {
      classes.push('table-row-hovered');
    }
    if (editingRowKey.value === row.key) {
      classes.push('table-row-editing');
    }
    return classes.join(' ');
  };

  return {
    rowProps,
    rowClassName,
    draggedItem,
    moveRowUp,
    moveRowDown,
    hoveredRowKey,
  };
}
