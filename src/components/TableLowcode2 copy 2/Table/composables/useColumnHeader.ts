
import { h, Ref } from 'vue';
import { NIcon, NSpace } from 'naive-ui';
import { ChevronDownOutline } from '@vicons/ionicons5';

export function useColumnHeader(onDropdownClick?: (columnKey: string, event: MouseEvent) => void) {
  // 渲染带下拉图标的列头
  function renderColumnHeader(columnKey: string, label: string, hoveredColumnKey: Ref<string | null>, alwaysShowDropdown: boolean = false) {
    const isHovered = hoveredColumnKey.value === columnKey;
    const showDropdown = alwaysShowDropdown || isHovered;
    
    return h('div', {
      style: { 
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      },
      onMouseenter: () => {
        console.log('鼠标进入列头:', columnKey);
        hoveredColumnKey.value = columnKey;
      },
      onMouseleave: () => {
        console.log('鼠标离开列头:', columnKey);
        hoveredColumnKey.value = null;
      }
    }, [
      h('span', {}, label),
      h(NIcon, {
        style: {
          opacity: showDropdown ? '1' : '0',
          transition: 'opacity 0.2s ease',
          cursor: 'pointer',
          visibility: 'visible',
          fontSize: '14px'
        },
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
          console.log('下拉图标点击:', columnKey);
          onDropdownClick?.(columnKey, e);
        }
      }, () => h(ChevronDownOutline))
    ]);
  }

  return { renderColumnHeader };
}
