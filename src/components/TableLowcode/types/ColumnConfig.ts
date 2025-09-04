export interface ColumnConfig {
  field: string;
  title: string;
  type?: 'text' | 'number' | 'date' | 'boolean' | 'image' | 'tag';
  width?: number | 'auto';
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
  fixed?: 'none' | 'left' | 'right';
  customRender?: string; // Placeholder for function name or component name
  ellipsis?: boolean;
  tooltip?: boolean;
  format?: string;
  enum?: Record<string, string>;
  hideInTable?: boolean;
}
