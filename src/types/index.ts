export interface User {
  readonly id: number
  readonly name: string
  readonly email: string
  readonly role: UserRole
  readonly status: UserStatus
  readonly avatar?: string
  readonly createdAt: string
  readonly updatedAt: string
  readonly createdBy?: string
  readonly updatedBy?: string
}

export type UserRole = 'admin' | 'user' | 'guest'
export type UserStatus = 'active' | 'inactive' | 'pending'
export type Theme = 'light' | 'dark'
export type Locale = 'zh-CN' | 'en-US'

// 视图类型
export type ViewType = 'grid' | 'kanban' | 'calendar' | 'gallery' | 'detail' | 'hierarchy' | 'map' | 'gantt'

// 排序方向
export type SortDirection = 'asc' | 'desc'

// 筛选操作符
export type FilterOperator = 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'startsWith' | 'endsWith'

// 逻辑操作符
export type LogicalOperator = 'and' | 'or'

// 行高选项
export type RowHeight = 'short' | 'medium' | 'tall' | 'extra-tall'

// 交互模式
export type InteractionMode = 'classic' | 'spreadsheet'

export interface CreateUserDto {
  readonly name: string
  readonly email: string
  readonly role: UserRole
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  readonly id: number
}

// 视图配置
export interface ViewConfig {
  readonly id: string
  readonly name: string
  readonly type: ViewType
  readonly isDefault: boolean
  readonly columns: ColumnConfig[]
  readonly sorting: SortConfig[]
  readonly filters: FilterConfig[]
  readonly groupBy?: string
  readonly displaySettings: DisplaySettings
}

// 列配置
export interface ColumnConfig {
  readonly key: string
  readonly title: string
  readonly visible: boolean
  readonly width?: number
  readonly order: number
  readonly sortable: boolean
  readonly filterable: boolean
}

// 排序配置
export interface SortConfig {
  readonly field: string
  readonly direction: SortDirection
  readonly priority: number
}

// 筛选配置
export interface FilterConfig {
  readonly id: string
  readonly field: string
  readonly operator: FilterOperator
  readonly value: any
  readonly logicalOperator?: LogicalOperator
}

// 显示设置
export interface DisplaySettings {
  readonly showRowNumbers: boolean
  readonly showSummaryRow: boolean
  readonly showVerticalLines: boolean
  readonly alternateRowColors: boolean
  readonly wrapHeaders: boolean
  readonly rowHeight: RowHeight
  readonly interactionMode: InteractionMode
  readonly autoRefresh: boolean
  readonly refreshInterval?: number
}

// 快速筛选配置
export interface QuickFilter {
  readonly field: string
  readonly placeholder: string
  readonly value: string
}

export interface TableColumn<T = any> {
  readonly key: keyof T | string
  readonly title: string
  readonly width?: number
  readonly sortable?: boolean
  readonly filterable?: boolean
  readonly render?: (row: T) => VNode | string
}

export interface PaginationInfo {
  readonly page: number
  readonly pageSize: number
  readonly total: number
}

export interface ApiResponse<T = any> {
  readonly code: number
  readonly data: T
  readonly message: string
}

export interface ListResponse<T = any> {
  readonly items: readonly T[]
  readonly pagination: PaginationInfo
}
