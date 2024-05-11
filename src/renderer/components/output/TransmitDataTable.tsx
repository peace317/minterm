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
  const [contextEvent, setContextEvent] = useState<any>();
  const [selectedCells, setSelectedCells] = useState<Array<any>>([]);

  const isContextEnabled = () => {
    const env = window.electron?.ipcRenderer.fetch(
      IPCChannelType.GET_ENV,
      'REACT_APP_ALLOW_CONTEXT_MENU'
    );
    return env !== 'false';
  };

  return (
    <div id={`${id}:container`} className={clsx(className, 'w-full h-full')}>
      {isContextEnabled() && (
        <ContextMenuOutput
          data={transmittedData}
          selectedCells={selectedCells}
          onContextMenu={contextEvent}
        />
      )}
      <SequenceInput id="sequenceInput" className="w-full mt-2 pr-3" />
      <div
        className="h-full"
        style={{ padding: '0.5rem 1rem 3rem' }}
        onContextMenu={setContextEvent}
      >
        <OutputDataTableCore
          id="outputTable"
          data={transmittedData}
          setData={setTransmittedData}
          clearButtonToolTip={t('CLEAR_TRANSMITTED')}
          className="pb-3"
          dataCountLabel="Tx"
          selectedCells={selectedCells}
          setSelectedCells={setSelectedCells}
        />
      </div>
    </div>
  );
};

export default TransmitDataTable;
