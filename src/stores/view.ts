import { defineStore } from 'pinia'
import type { ViewConfig, ViewType, ColumnConfig, SortConfig, FilterConfig, DisplaySettings, QuickFilter } from '@/types'

interface ViewState {
  views: ViewConfig[]
  currentViewId: string
  quickFilters: QuickFilter[]
  configPanelVisible: boolean
}

export const useViewStore = defineStore('view', {
  state: (): ViewState => ({
    views: [
      {
        id: 'default-grid',
        name: '表格视图',
        type: 'grid',
        isDefault: true,
        columns: [
          { key: 'name', title: '姓名', visible: true, order: 1, sortable: true, filterable: true },
          { key: 'email', title: '邮箱', visible: true, order: 2, sortable: true, filterable: true },
          { key: 'role', title: '角色', visible: true, order: 3, sortable: true, filterable: true },
          { key: 'status', title: '状态', visible: true, order: 4, sortable: true, filterable: true },
          { key: 'createdAt', title: '创建时间', visible: true, order: 5, sortable: true, filterable: false },
          { key: 'id', title: 'ID', visible: false, order: 0, sortable: true, filterable: true },
          { key: 'createdBy', title: '创建人', visible: false, order: 6, sortable: true, filterable: true },
          { key: 'updatedBy', title: '更新人', visible: false, order: 7, sortable: true, filterable: true }
        ],
        sorting: [
          { field: 'createdAt', direction: 'desc', priority: 1 }
        ],
        filters: [],
        displaySettings: {
          showRowNumbers: true,
          showSummaryRow: false,
          showVerticalLines: true,
          alternateRowColors: true,
          wrapHeaders: false,
          rowHeight: 'medium',
          interactionMode: 'classic',
          autoRefresh: false
        }
      }
    ],
    currentViewId: 'default-grid',
    quickFilters: [],
    configPanelVisible: false
  }),

  getters: {
    currentView: (state) => state.views.find(v => v.id === state.currentViewId),
    visibleColumns: (state) => {
      const view = state.views.find(v => v.id === state.currentViewId)
      return view?.columns.filter(c => c.visible).sort((a, b) => a.order - b.order) || []
    }
  },

  actions: {
    setCurrentView(viewId: string) {
      this.currentViewId = viewId
    },

    createView(name: string, type: ViewType) {
      const newView: ViewConfig = {
        id: `view-${Date.now()}`,
        name,
        type,
        isDefault: false,
        columns: [...this.currentView!.columns],
        sorting: [...this.currentView!.sorting],
        filters: [...this.currentView!.filters],
        displaySettings: { ...this.currentView!.displaySettings }
      }
      this.views.push(newView)
      this.currentViewId = newView.id
    },

    updateViewName(viewId: string, name: string) {
      const view = this.views.find(v => v.id === viewId)
      if (view && !view.isDefault) {
        ;(view as any).name = name
      }
    },

    deleteView(viewId: string) {
      const index = this.views.findIndex(v => v.id === viewId)
      if (index !== -1 && !this.views[index].isDefault) {
        this.views.splice(index, 1)
        if (this.currentViewId === viewId) {
          this.currentViewId = this.views[0].id
        }
      }
    },

    updateColumnVisibility(columnKey: string, visible: boolean) {
      const view = this.currentView
      if (view) {
        const column = view.columns.find(c => c.key === columnKey)
        if (column) {
          ;(column as any).visible = visible
        }
      }
    },

    updateColumnOrder(columns: ColumnConfig[]) {
      const view = this.currentView
      if (view) {
        ;(view as any).columns = columns
      }
    },

    updateSorting(sorting: SortConfig[]) {
      const view = this.currentView
      if (view) {
        ;(view as any).sorting = sorting
      }
    },

    updateFilters(filters: FilterConfig[]) {
      const view = this.currentView
      if (view) {
        ;(view as any).filters = filters
      }
    },

    updateDisplaySettings(settings: Partial<DisplaySettings>) {
      const view = this.currentView
      if (view) {
        Object.assign(view.displaySettings as any, settings)
      }
    },

    addQuickFilter(field: string) {
      const exists = this.quickFilters.find(f => f.field === field)
      if (!exists) {
        this.quickFilters.push({
          field,
          placeholder: `搜索${field}`,
          value: ''
        })
      }
    },

    removeQuickFilter(field: string) {
      const index = this.quickFilters.findIndex(f => f.field === field)
      if (index !== -1) {
        this.quickFilters.splice(index, 1)
      }
    },

    updateQuickFilterValue(field: string, value: string) {
      const filter = this.quickFilters.find(f => f.field === field)
      if (filter) {
        ;(filter as any).value = value
      }
    },

    toggleConfigPanel() {
      this.configPanelVisible = !this.configPanelVisible
    }
  }
})
