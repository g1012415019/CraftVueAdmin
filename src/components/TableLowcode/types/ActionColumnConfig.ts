export interface ActionButton {
  label: string;
  key: string;
  type?: 'button' | 'link';
  icon?: string;
  permission?: string;
  onClick?: string; // Placeholder for function name
  disabled?: boolean;
  hidden?: boolean;
  confirm?: {
    title?: string;
    content?: string;
    okText?: string;
    cancelText?: string;
  };
}

export interface ActionColumnConfig {
  actions: ActionButton[];
  width?: number;
  fixed?: 'none' | 'left' | 'right';
}
