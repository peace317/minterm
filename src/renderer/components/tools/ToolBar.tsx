import { Toolbar } from 'primereact/toolbar';
import React from 'react';
import BaudRateSelect from './BaudRateSelect';
import ButtonConnect from './ButtonConnect';
import PortSelect from './PortSelect';
import clsx from 'clsx';

const ToolBar: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ id, className, ...props }) => {
  const leftContents = (
    <>
      <ButtonConnect id="connectButton" className="mr-2" />
      <PortSelect id="ports" className="dropdown-small mr-2" />
      <BaudRateSelect id="baudRate" className="dropdown-small mr-2" />
    </>
  );

  return (
    <div id={`${id}:container`} className={clsx(className, 'toolbar')} {...props}>
      <Toolbar start={leftContents} />
    </div>
  );
};

export default ToolBar;
