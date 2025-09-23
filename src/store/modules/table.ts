import { defineStore } from 'pinia';
import { ViewConfig } from '../../components/TableLowcode/types/ViewConfig';
import { ColumnConfig } from '../../components/TableLowcode/types/ColumnConfig';
import { DataSourceConfig } from '../../components/TableLowcode/types/DataSourceConfig';
import { TableGeneralSettings } from '../../components/TableLowcode/types/TableGeneralSettings';
import { ActionColumnConfig } from '../../components/TableLowcode/types/ActionColumnConfig';

interface TableState {
  viewConfig: ViewConfig;
  columnsConfig: ColumnConfig[];
  dataSourceConfig: DataSourceConfig;
  tableGeneralSettings: TableGeneralSettings;
  actionColumnConfig: ActionColumnConfig;
}

export const useTableStore = defineStore({
  id: 'table',
  state: (): TableState => ({
    viewConfig: {
      rowHeight: 'default',
      displaySettings: {
        showBorder: true,
        showStripe: false,
        fixedHeader: true,
      },
      interactionMode: 'click',
      autoRefresh: false,
      autoRefreshInterval: 60,
    },
    columnsConfig: [],
    dataSourceConfig: {},
    tableGeneralSettings: {
      pagination: true,
      pageSize: 10,
      showIndexColumn: false,
      loading: false,
      emptyText: '暂无数据',
      rowSelection: false,
      rowKey: 'id',
      scrollX: 0,
      scrollY: 0,
    },
    actionColumnConfig: {
      actions: [],
      width: 150,
      fixed: 'right',
    },
  }),
  getters: {
    getViewConfig: (state) => state.viewConfig,
    getColumnsConfig: (state) => state.columnsConfig,
    getDataSourceConfig: (state) => state.dataSourceConfig,
    getTableGeneralSettings: (state) => state.tableGeneralSettings,
    getActionColumnConfig: (state) => state.actionColumnConfig,
  },
  actions: {
    setViewConfig(config: ViewConfig) {
      this.viewConfig = { ...this.viewConfig, ...config };
    },
    setColumnsConfig(config: ColumnConfig[]) {
      this.columnsConfig = config;
    },
    setDataSourceConfig(config: DataSourceConfig) {
      this.dataSourceConfig = { ...this.dataSourceConfig, ...config };
    },
    setTableGeneralSettings(config: TableGeneralSettings) {
      this.tableGeneralSettings = { ...this.tableGeneralSettings, ...config };
    },
    setActionColumnConfig(config: ActionColumnConfig) {
      this.actionColumnConfig = { ...this.actionColumnConfig, ...config };
    },
  },
});
