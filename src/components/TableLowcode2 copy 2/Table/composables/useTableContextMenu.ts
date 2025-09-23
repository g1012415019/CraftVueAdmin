import { ref, computed, nextTick, inject, Ref } from 'vue';
import type { DropdownOption } from 'naive-ui';
import { TableConfig, TableData } from '@/types/table'; // 导入共享类型

export function useTableContextMenu() {
  const config = inject('tableConfig') as Ref<TableConfig>;

  // Context menu related
  const showDropdown = ref(false);
  const dropdownX = ref(0);
  const dropdownY = ref(0);
  const rightClickedRow = ref<TableData | null>(null); // To store the row that was right-clicked

  const handleContextMenu = (e: MouseEvent, row: TableData) => {
    e.preventDefault();
    if (config.value.interaction.contextMenu) {
      showDropdown.value = false; // Hide previous dropdown if any
      nextTick(() => {
        rightClickedRow.value = row;
        showDropdown.value = true;
        dropdownX.value = e.clientX;
        dropdownY.value = e.clientY;
      });
    }
  };

  const onClickoutside = () => {
    showDropdown.value = false;
  };

  const contextMenuOptions = computed<DropdownOption[]>(() => {
    if (!config.value.actions.contextMenu || config.value.actions.contextMenu.length === 0) {
      return [];
    }
    return config.value.actions.contextMenu.map((action: any) => ({
      label: action.label,
      key: action.key,
      props: {
        onClick: () => {
          // Execute the action defined in the config
          if (action.onClick && rightClickedRow.value) {
            action.onClick(rightClickedRow.value);
          } else {
            console.log(`Context menu action "${action.label}" clicked for row:`, rightClickedRow.value);
          }
          showDropdown.value = false;
        },
      },
    }));
  });

  const handleMenuSelect = (key: string | number) => {
    // The action is already handled in the onClick prop of each option
    // This function can be used for additional global handling if needed
    console.log('Selected context menu item:', key);
    showDropdown.value = false;
  };

  return {
    showDropdown,
    dropdownX,
    dropdownY,
    rightClickedRow,
    handleContextMenu,
    onClickoutside,
    contextMenuOptions,
    handleMenuSelect,
  };
}
