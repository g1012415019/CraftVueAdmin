export interface ViewConfig {
  rowHeight?: 'default' | 'compact' | 'comfortable';
  displaySettings?: {
    showBorder?: boolean;
    showStripe?: boolean;
    fixedHeader?: boolean;
  }; // Example properties, can be expanded
  interactionMode?: 'click' | 'hover';
  autoRefresh?: boolean;
  autoRefreshInterval?: number;
}
