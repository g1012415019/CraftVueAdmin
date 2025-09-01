export interface DataRecord {
  id: string | number
  [key: string]: any
}

export interface ColumnConfig {
  key: string
  title: string
  width?: number
  visible: boolean
  sortable?: boolean
  filterable?: boolean
  type?: 'text' | 'number' | 'date' | 'select' | 'boolean'
  options?: string[]
}

export interface ViewConfig {
  id: string
  name: string
  type: 'table' | 'kanban' | 'calendar' | 'gallery' | 'detail' | 'hierarchy' | 'map' | 'gantt'
  columns: ColumnConfig[]
  filters: FilterRule[]
  sorts: SortRule[]
  groupBy?: string
  settings: ViewSettings
}

export interface FilterRule {
  field: string
  operator: 'eq' | 'ne' | 'gt' | 'lt' | 'contains' | 'startsWith' | 'endsWith'
  value: any
  logic?: 'and' | 'or'
}

export interface SortRule {
  field: string
  direction: 'asc' | 'desc'
}

export interface ViewSettings {
  showRowNumber: boolean
  showSummary: boolean
  showVerticalLines: boolean
  alternateRowColor: boolean
  titleWrap: boolean
  rowHeight: 'short' | 'medium' | 'tall' | 'extra-tall'
  interactionMode: 'classic' | 'spreadsheet'
  autoRefresh: boolean
  refreshInterval: number
  inlineEdit: boolean
}

export interface QuickFilter {
  field: string
  value: string
}
