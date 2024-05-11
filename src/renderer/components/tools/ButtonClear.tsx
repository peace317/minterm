import React from 'react';
import { Button } from 'primereact/button';
import { VscTrash } from 'react-icons/vsc';
import { IDefaultProps } from '@/renderer/types/AppInterfaces';

interface IButtonClearProps extends React.HTMLAttributes<HTMLDivElement> {
  toolTip?: string;
  clearObject?: React.Dispatch<React.SetStateAction<any[]>>;
}

/**
 * Component for a Button that clears the received data buffer.
 *
 * @param IDefaultProps
 */
const ButtonClear: React.FC<IButtonClearProps> = ({
  id,
  className,
  toolTip = '',
  clearObject = () => {},
  ...props
}) => {

  const onClear = () => {
    clearObject([]);
  };

  return (
    <div id={`${id}:container`} className={className} {...props}>
      <Button
        id={id}
        severity="danger"
        tooltip={toolTip}
        tooltipOptions={{ position: 'left', showDelay: 500 }}
        icon={<VscTrash className="p-button-icon-left" />}
        onClick={onClear}
      />
    </div>
  );
};

export default ButtonClear;
