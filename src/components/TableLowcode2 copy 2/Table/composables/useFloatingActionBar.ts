import { ref, inject } from 'vue';
import { TableConfig, TableData } from '@/types/table';

export function useFloatingActionBar() {
  const config = inject('tableConfig') as Ref<TableConfig>;
  
  const showFloatingBar = ref(false);
  const floatingBarX = ref(0);
  const floatingBarY = ref(0);
  const currentHoveredRow = ref<TableData | null>(null);
  
  const handleRowHover = (row: TableData, event: MouseEvent) => {
    console.log('行悬停:', row, event);
    if (!config.value.actions.inline || config.value.actions.inline.length === 0) {
      console.log('没有内联操作');
      return;
    }
    
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const tableContainer = document.querySelector('.table-lowcode-container');
    const containerRect = tableContainer?.getBoundingClientRect();
    
    if (containerRect) {
      floatingBarX.value = rect.right - containerRect.left - 200; // 右对齐，留200px宽度
      floatingBarY.value = rect.top - containerRect.top - 40; // 在行上方40px
    }
    
    currentHoveredRow.value = row;
    showFloatingBar.value = true;
    console.log('显示悬浮操作栏:', showFloatingBar.value);
  };
  
  const handleRowLeave = () => {
    // 延迟隐藏，允许鼠标移到操作栏上
    setTimeout(() => {
      showFloatingBar.value = false;
      currentHoveredRow.value = null;
    }, 100);
  };
  
  const handleFloatingAction = (action: any, row: any) => {
    if (action.onClick) {
      action.onClick(row);
    }
    showFloatingBar.value = false;
  };
  
  return {
    showFloatingBar,
    floatingBarX,
    floatingBarY,
    currentHoveredRow,
    handleRowHover,
    handleRowLeave,
    handleFloatingAction,
  };
}
