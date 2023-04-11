import React from 'react';
import { Button } from 'primereact/button';
import { IDefaultProps } from 'renderer/types/AppInterfaces';
import { VscTrash } from 'react-icons/vsc';

interface IButtonClearProps extends IDefaultProps {
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
  toolTip,
  clearObject = () => {}
}) => {

  const onClear = () => {
    clearObject([]);
  };

  return (
    <div id={id +":container"} className={className}>
      <Button
        id={id}
        className='p-button-danger'
        tooltip={toolTip}
        tooltipOptions={{position: 'left', showDelay: 500}}
        icon={<VscTrash className="p-button-icon-left" />}
        onClick={onClear}
      />
    </div>
  );
};

export default ButtonClear;
