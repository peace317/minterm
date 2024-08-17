import { useContext } from '@/renderer/context';
import { IDefaultProps, IPCChannelType } from '@minterm/types';
import clsx from 'clsx';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SequenceInput from '../tools/SequenceInput';
import ContextMenuOutput from './ContextMenuOutput';
import OutputDataTableCore from './OutputDataTableCore';

const TransmitDataTable: React.FC<IDefaultProps> = ({ id, className }) => {
  const { t } = useTranslation();
  const { transmittedData, setTransmittedData } = useContext();
  const [contextEvent, setContextEvent] = useState<React.MouseEvent<HTMLDivElement, MouseEvent>>();
  const [selectedCells, setSelectedCells] = useState<Array<any>>([]);

  const isContextEnabled = () => {
    return process.env.REACT_APP_ALLOW_CONTEXT_MENU !== 'false';
  };

  return (
    <div id={`${id}:container`} className={clsx(className, 'flex-column w-full pt-2')} style={{padding: "1.25rem"}}>
      {isContextEnabled() && (
        <ContextMenuOutput
          data={transmittedData}
          selectedCells={selectedCells}
          onContextMenu={contextEvent}
        />
      )}
      <SequenceInput id={`${id}:sequenceInput`} className='mb-2' />
      <div
        className="h-full"
        onContextMenu={setContextEvent}
      >
        <OutputDataTableCore
          id={`${id}:outputDataTableCore`}
          data={transmittedData}
          setData={setTransmittedData}
          clearButtonToolTip={t('CLEAR_TRANSMITTED')}
          dataCountLabel="Tx"
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}
        />
      </div>
    </div>
  );
};

export default TransmitDataTable;
