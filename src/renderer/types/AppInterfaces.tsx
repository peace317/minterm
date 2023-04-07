/**
 * Interface for default props of all components.
 */
export interface IDefaultProps {
  id: string;
  className?: string;
}

export interface IDialogProps extends IDefaultProps {
  display: boolean;
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Interface for a select-value that is to be used in dropdowns etc.
 */
export interface ISelectValue {
  name: string;
  key: any;
}
