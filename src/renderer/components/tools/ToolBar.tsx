import { Toolbar } from 'primereact/toolbar';
import React from 'react';
import { IDefaultProps } from 'renderer/types/AppInterfaces';
import BaudRateSelect from './BaudRateSelect';
import ButtonConnect from './ButtonConnect';
import PortSelect from './PortSelect';

const ToolBar: React.FC<IDefaultProps> = ({
  id,
  className,
}) => {

  const leftContents = (
    <React.Fragment>
      <ButtonConnect
        id="connectButton"
        className="mr-2"
      />
      <PortSelect id="ports" className="dropdown-small mr-2" />
      <BaudRateSelect id="baudRate" className="dropdown-small mr-2" />
    </React.Fragment>
  );

  return (
    <div id={id +":container"} className={className + ' toolbar'}>
      <Toolbar left={leftContents} />
    </div>
  );
};

export default ToolBar;
