import type { DataTableRowKey } from 'naive-ui';

export interface TableConfig {
  basic: {
    showRowNumber: boolean;
    rowNumberStart: number;
    rowNumberWidth: number;
    rowNumberAlign: 'left' | 'center' | 'right';
    loading: boolean;
    scrollX: number;
    maxHeight: number;
    height: number;
    bordered: boolean;
    striped: boolean;
    fontSize: number;
    rowHeight: number;
  };
  selection: {
    enabled: boolean;
    mode: 'multiple' | 'single';
    columnPosition: 'left' | 'right';
    keepOnPageChange: boolean;
    defaultSelectedRowKeys: (row: TableData) => boolean;
  };
  sortFilter: {
    filterMode: 'frontend' | 'backend';
    sortMode: 'frontend' | 'backend';
    defaultSort: {
      key: string;
      order: 'ascend' | 'descend' | false;
    };
  };
  columns: Array<{
    key: string;
    label: string;
    visible: boolean;
    width?: number;
    align?: 'left' | 'center' | 'right';
    fixed?: 'left' | 'right';
    sortable: boolean;
    filterable: boolean;
    filterType?: 'text' | 'enum' | 'boolean' | 'numberRange' | 'dateRange';
    filterOptions?: string;
    customSorter?: string;
    editable?: boolean;
    dataType?: 'text' | 'number' | 'select';
    selectOptions?: Array<{ label: string; value: string | number }>;
  }>;
  actions: {
    inline: Array<{
      label: string;
      type: string;
      showConfirmation: boolean;
      confirmationText?: string;
      onClick?: (row: TableData) => void;
    }>;
    contextMenu: Array<{
      label: string;
      key: string;
      onClick?: (row: TableData) => void;
    }>;
    batch: Array<{
      label: string;
      key: string;
      type: string;
      showConfirmation: boolean;
      confirmationText?: string;
      onClick?: (selectedRows: DataTableRowKey[]) => void;
    }>;
    batchPosition: 'top' | 'bottom';
  };
  interaction: {
    rowClick: boolean;
    rowDblClick: boolean;
    contextMenu: boolean;
    dragSort: boolean;
  };
  editing: {
    inlineEditingEnabled: boolean;
    mode: 'row' | 'cell';
    trigger: 'dblclick' | 'button';
    buttonsPosition: 'inline' | 'bottom';
  };
  data: {
    refreshInterval: number;
  };
  pagination: {
    pageSizeOptions: string;
    showQuickJumper: boolean;
    showTotal: boolean;
    simple: boolean;
    position: 'top' | 'bottom' | 'both';
    serverSidePagination: boolean;
  };
}

export interface TableData {
  key: number;
  name: string;
  age: number;
  address: string;
  email: string;
  status: string;
  createTime: string;
  [key: string]: any;
}
