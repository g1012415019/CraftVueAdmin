<template>
  <div class="advanced-data-table">
    <!-- 快速筛选栏 -->
    <div v-if="viewStore.quickFilters.length > 0" class="quick-filters">
      <NSpace>
        <NInput v-for="filter in viewStore.quickFilters" :key="filter.field" v-model:value="filter.value"
          :placeholder="filter.placeholder" size="small" clearable @input="handleQuickFilter">
          <template #prefix>
            <NIcon :component="SearchOutline" />
          </template>
        </NInput>
      </NSpace>
    </div>

    <!-- 数据表格 -->
    <NDataTable :columns="tableColumns" :data="filteredData" :loading="loading || false" :pagination="paginationConfig"
      :row-key="(row: any) => row.id" :single-line="false" :size="tableSize"
      :bordered="currentView?.displaySettings.alternateRowColors || false"
      :striped="currentView?.displaySettings.alternateRowColors || false" remote @update:page="handlePageChange"
      @update:page-size="handlePageSizeChange" @update:sorter="handleSorterChange" :row-props="getRowProps" />


    <!-- 汇总行 -->
    <div v-if="currentView?.displaySettings.showSummaryRow" class="summary-row">
      <NCard size="small">
        <NSpace>
          <span>总计: {{ total }} 条记录</span>
          <span v-if="selectedRows.length > 0">已选择: {{ selectedRows.length }} 条</span>
        </NSpace>
      </NCard>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { SearchOutline, ChevronDownOutline } from '@vicons/ionicons5'
import type { DataTableColumns, PaginationProps } from 'naive-ui'
import { useViewStore } from '@/stores/view'
import dayjs from 'dayjs'

interface Props {
  readonly data: readonly T[]
  readonly loading?: boolean
  readonly pagination?: {
    readonly page: number
    readonly pageSize: number
    readonly total: number
  }
}

interface Emits {
  pageChange: [page: number]
  pageSizeChange: [pageSize: number]
  rowClick: [row: T]
  selectionChange: [rows: T[]]
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

const viewStore = useViewStore()
const { t } = useI18n()

const selectedRows = ref<T[]>([])
const checkedRowKeys = ref<Array<string | number>>([])
const hoveredRowIndex = ref<number>(-1)
const sortState = ref<{ column: string; order: 'asc' | 'desc' | null }>({ column: '', order: null })
const currentView = computed(() => viewStore.currentView)

// 表格尺寸映射
const tableSize = computed(() => {
  const sizeMap: Record<string, any> = {
    'short': 'small',
    'medium': 'medium',
    'tall': 'large',
    'extra-tall': 'large'
  }
  return sizeMap[currentView.value?.displaySettings.rowHeight || 'medium']
})

// 表格样式类
// const tableClasses = computed(() => ({
//   'no-vertical-lines': !currentView.value?.displaySettings.showVerticalLines,
//   'spreadsheet-mode': currentView.value?.displaySettings.interactionMode === 'spreadsheet'
// }))

// 构建表格列
const tableColumns = computed<DataTableColumns<T>>(() => {
  const columns: DataTableColumns<T> = []

  // 多选列 - 使用普通列实现自定义交互
  columns.push({
    title: () => h('div', { class: 'selection-header' }, [
      h(resolveComponent('NCheckbox'), {
        checked: checkedRowKeys.value.length === props.data.length && props.data.length > 0,
        indeterminate: checkedRowKeys.value.length > 0 && checkedRowKeys.value.length < props.data.length,
        onUpdateChecked: handleSelectAll
      }),
      h(resolveComponent('NDropdown'), {
        trigger: 'click',
        options: [
          { label: '全选所有', key: 'select-all' },
          { label: '反选本页', key: 'invert-page' }
        ],
        onSelect: handleSelectionMenuSelect
      }, {
        default: () => h(resolveComponent('NButton'), {
          quaternary: true,
          size: 'tiny',
          class: 'selection-menu-btn'
        }, {
          icon: () => h(resolveComponent('NIcon'), { size: 12 }, {
            default: () => h(ChevronDownOutline)
          })
        })
      })
    ]),
    key: 'selection',
    width: 60,
    render: (row: any, rowIndex: number) => {
      const isChecked = checkedRowKeys.value.includes(row.id)

      return h('div', {
        class: 'selection-cell'
      }, [
        // 序号
        h('span', {
          class: ['row-number', {
            'row-number--hidden': isChecked || hoveredRowIndex.value === rowIndex
          }]
        }, rowIndex + 1),
        // 复选框
        h(resolveComponent('NCheckbox'), {
          class: ['row-checkbox', {
            'row-checkbox--visible': isChecked || hoveredRowIndex.value === rowIndex
          }],
          checked: isChecked,
          onUpdateChecked: (checked: boolean) => toggleRowSelection(row.id, checked)
        })
      ])
    }
  })

  // 数据列 - 如果没有视图配置，使用默认列
  const visibleColumns = viewStore.visibleColumns || [
    { key: 'name', title: '姓名', width: 120 },
    { key: 'email', title: '邮箱', width: 200 },
    { key: 'role', title: '角色', width: 100 },
    { key: 'status', title: '状态', width: 100 },
    { key: 'createdAt', title: '创建时间', width: 160 }
  ]

  visibleColumns.forEach((col: any) => {
    columns.push({
      title: () => h('div', { class: 'table-header-cell' }, [
        h('span', { class: 'column-title' }, [
          col.title,
          // 排序标识
          sortState.value.column === col.key && sortState.value.order ? h('span', {
            class: 'sort-indicator'
          }, sortState.value.order === 'asc' ? ' ↑' : ' ↓') : null
        ]),
        h(resolveComponent('NDropdown'), {
          trigger: 'click',
          options: [
            { label: '升序排列', key: 'asc' },
            { label: '降序排列', key: 'desc' },
            { type: 'divider' },
            { label: '筛选', key: 'filter' },
            { label: '隐藏列', key: 'hide' }
          ],
          onSelect: (key: string) => handleColumnMenuSelect(col.key, key)
        }, {
          default: () => h(resolveComponent('NButton'), {
            quaternary: true,
            size: 'tiny',
            class: 'column-menu-btn'
          }, {
            icon: () => h(resolveComponent('NIcon'), { size: 14 }, {
              default: () => h(ChevronDownOutline)
            })
          })
        })
      ]),
      key: col.key,
      width: col.width,
      sorter: false,
      render: (row: any) => {
        if (col.key === 'status') {
          return h('StatusTag', { status: row[col.key] })
        }
        if (col.key === 'createdAt' || col.key === 'updatedAt') {
          return dayjs(row[col.key]).format('YYYY-MM-DD HH:mm')
        }
        if (col.key === 'role') {
          return t(`role.${row[col.key]}`)
        }
        return row[col.key]
      }
    })
  })

  return columns
})

// 筛选后的数据
const filteredData = computed(() => {
  let result = [...props.data]

  // 应用快速筛选
  viewStore.quickFilters.forEach((filter: any) => {
    if (filter.value) {
      result = result.filter(item =>
        String(item[filter.field]).toLowerCase().includes(filter.value.toLowerCase())
      )
    }
  })

  return result
})

// 分页配置
const paginationConfig = computed<PaginationProps | false>(() => {
  if (!props.pagination) return false

  return {
    page: props.pagination.page,
    pageSize: props.pagination.pageSize,
    itemCount: props.pagination.total,
    showSizePicker: true,
    pageSizes: [10, 20, 50, 100],
    showQuickJumper: true
  }
})

const total = computed(() => props.pagination?.total || props.data.length)

const handlePageChange = (page: number) => {
  emit('pageChange', page)
}

const handlePageSizeChange = (pageSize: number) => {
  emit('pageSizeChange', pageSize)
}

const handleSorterChange = (sorter: any) => {
  // 处理排序变化
  console.log('排序变化:', sorter)
}

const handleCheckedRowKeysChange = (keys: Array<string | number>) => {
  checkedRowKeys.value = keys
  // 根据选中的keys找到对应的行数据
  const selected = props.data.filter((row: any) => keys.includes(row.id))
  selectedRows.value = selected
  emit('selectionChange', selected as T[])
}

const handleSelectAll = (checked: boolean) => {
  if (checked) {
    // 选中当前页所有记录
    const allKeys = props.data.map((row: any) => row.id)
    checkedRowKeys.value = allKeys
  } else {
    // 取消选中
    checkedRowKeys.value = []
  }
  handleCheckedRowKeysChange(checkedRowKeys.value)
}

const toggleRowSelection = (rowId: string | number, checked: boolean) => {
  if (checked) {
    if (!checkedRowKeys.value.includes(rowId)) {
      checkedRowKeys.value.push(rowId)
    }
  } else {
    const index = checkedRowKeys.value.indexOf(rowId)
    if (index > -1) {
      checkedRowKeys.value.splice(index, 1)
    }
  }
  handleCheckedRowKeysChange(checkedRowKeys.value)
}

const getRowProps = (_row: any, index: number) => {
  return {
    style: { cursor: 'pointer' },
    onMouseenter: () => {
      hoveredRowIndex.value = index
    },
    onMouseleave: () => {
      hoveredRowIndex.value = -1
    }
  }
}

const handleSelectionMenuSelect = (key: string) => {
  switch (key) {
    case 'select-all':
      // 全选所有记录
      const allKeys = props.data.map((row: any) => row.id)
      checkedRowKeys.value = allKeys
      handleCheckedRowKeysChange(checkedRowKeys.value)
      break
    case 'invert-page':
      // 反选本页记录
      const pageKeys = props.data.map((row: any) => row.id)
      const invertedKeys = pageKeys.filter(key => !checkedRowKeys.value.includes(key))
      const remainingKeys = checkedRowKeys.value.filter(key => !pageKeys.includes(key))
      checkedRowKeys.value = [...remainingKeys, ...invertedKeys]
      handleCheckedRowKeysChange(checkedRowKeys.value)
      break
  }
}

const handleColumnMenuSelect = (columnKey: string, menuKey: string) => {
  console.log('列菜单选择:', columnKey, menuKey)

  switch (menuKey) {
    case 'asc':
    case 'desc':
      // 更新排序状态
      sortState.value = { column: columnKey, order: menuKey }
      // 处理排序
      handleSorterChange({ columnKey, order: menuKey })
      break
    case 'filter':
      // 打开筛选面板
      console.log('打开筛选面板')
      break
    case 'hide':
      // 隐藏列
      console.log('隐藏列:', columnKey)
      break
  }
}

const handleQuickFilter = () => {
  // 快速筛选逻辑已在 computed 中处理
}

// 自动刷新
let refreshTimer: any = null

watchEffect(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
    refreshTimer = null
  }

  if (currentView.value?.displaySettings.autoRefresh && currentView.value.displaySettings.refreshInterval) {
    refreshTimer = setInterval(() => {
      // 触发数据刷新
      emit('pageChange', props.pagination?.page || 1)
    }, currentView.value.displaySettings.refreshInterval * 1000)
  }
})

onUnmounted(() => {
  if (refreshTimer) {
    clearInterval(refreshTimer)
  }
})
</script>

<style lang="scss" scoped>
.advanced-data-table {
  .quick-filters {
    padding: $space-md 0;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: $space-md;
  }

  .summary-row {
    margin-top: $space-md;
    padding: 12px 16px;
    background: var(--n-table-header-color);
    border: 1px solid var(--n-border-color);
    border-top: none;
    font-weight: 500;
  }
}

:deep(.selection-header) {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  
  .n-checkbox {
    --n-size: 12px;
  }
}

:deep(.selection-menu-btn) {
  position: absolute ;
  right: -12px;
  top: 50%;
  transform: translateY(-50%);
  padding: 2px 4px;
  min-width: auto;
  opacity: 1;
  z-index: 10;
}

:deep(.selection-menu-btn:hover) {
  background: var(--n-button-color-hover);
}

:deep(.table-header-cell) {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding-right: 24px;

  .column-title {
    flex: 1;
    text-align: left;
    display: flex;
    align-items: center;

    .sort-indicator {
      margin-left: 4px;
      color: var(--n-primary-color);
      font-weight: bold;
      font-size: 12px;
    }
  }

  .column-menu-btn {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    opacity: 0;
    transition: opacity 0.2s ease;
    padding: 2px 4px;
    min-width: auto;
    z-index: 10;

    &:hover {
      opacity: 1;
      background: var(--n-button-color-hover);
    }
  }
}

:deep(.n-data-table-th:hover) {
  .column-menu-btn {
    opacity: 0.7;
  }
}

:deep(.selection-cell) {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  
  .n-checkbox {
    --n-size: 12px;
  }

  .row-number {
    position: absolute;
    color: var(--n-text-color-2);
    font-size: 12px;
    transition: opacity 0.2s ease;

    &--hidden {
      opacity: 0;
    }
  }

  .row-checkbox {
    position: absolute;
    opacity: 0;
    transition: opacity 0.2s ease;

    &--visible {
      opacity: 1;
    }
  }
}

:deep(.n-data-table) {
  &.no-vertical-lines {
    .n-data-table-td {
      border-right: none;
    }
  }

  &.spreadsheet-mode {
    .n-data-table-tr {
      cursor: default;
    }

    .n-data-table-td {
      cursor: cell;
    }
  }
}
</style>
