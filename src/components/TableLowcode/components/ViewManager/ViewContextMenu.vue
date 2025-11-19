<template>
  <n-dropdown
    placement="bottom-start"
    trigger="manual"
    :x="x"
    :y="y"
    :options="menuOptions"
    :show="show"
    @select="handleSelect"
    @clickoutside="handleClose"
  />
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { 
  EditOutlined as EditIcon,
  CopyOutlined as CopyIcon,
  DeleteOutlined as DeleteIcon,
  ShareAltOutlined as ShareIcon,
  ExportOutlined as ExportIcon
} from '@vicons/antd'

// ==================== 组件定义 ====================

/**
 * 组件 Props 定义
 */
const props = defineProps<{
  /** 是否显示菜单 */
  show: boolean
  /** 菜单X坐标位置 */
  x: number
  /** 菜单Y坐标位置 */
  y: number
  /** 是否可以添加视图 */
  canAddView: boolean
  /** 是否可以删除视图 */
  canDelete: boolean
}>()

/**
 * 组件事件定义
 */
const emit = defineEmits<{
  /** 菜单选择事件 */
  'select': [key: string]
  /** 菜单关闭事件 */
  'close': []
}>()

// ==================== 计算属性 ====================

/**
 * 菜单选项配置
 * 根据权限动态生成菜单项
 */
const menuOptions = computed(() => [
  { 
    label: '编辑', 
    key: 'edit', 
    icon: () => h(EditIcon) 
  },
  { 
    label: '重命名', 
    key: 'rename', 
    icon: () => h(EditIcon) 
  },
  { 
    label: '复制', 
    key: 'duplicate', 
    icon: () => h(CopyIcon),
    disabled: !props.canAddView
  },
  { 
    label: '分享', 
    key: 'share', 
    icon: () => h(ShareIcon) 
  },
  { 
    label: '导出', 
    key: 'export', 
    icon: () => h(ExportIcon) 
  },
  { type: 'divider' },
  { 
    label: '删除', 
    key: 'delete', 
    icon: () => h(DeleteIcon),
    disabled: !props.canDelete
  }
])

// ==================== 事件处理 ====================

/**
 * 处理菜单选择事件
 * @param key 选择的菜单项键名
 */
const handleSelect = (key: string) => {
  emit('select', key)
}

/**
 * 处理菜单关闭事件
 */
const handleClose = () => {
  emit('close')
}
</script>
