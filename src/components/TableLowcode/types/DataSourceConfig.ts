export interface DataSourceConfig {
  api?: string;
  method?: 'GET' | 'POST';
  params?: Record<string, any>;
  dataKey?: string;
  totalKey?: string;
  beforeRequest?: string; // Placeholder for function name
  afterResponse?: string; // Placeholder for function name
}
