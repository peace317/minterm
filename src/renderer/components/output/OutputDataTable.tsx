/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContext } from '@/renderer/context';
import { IDefaultProps, IPCChannelType } from '@minterm/types';
import OutputDataTableCore from './OutputDataTableCore';

interface IOutputDataTableProps extends IDefaultProps {
  selectedCells: Array<any>;
  setSelectedCells: React.Dispatch<React.SetStateAction<any[]>>;
}

const OutputDataTable: React.FC<IOutputDataTableProps> = ({
  id,
  className,
  selectedCells,
  setSelectedCells,
}) => {
  const { t } = useTranslation();
  const { receivedData, setReceivedData } = useContext();
  const [supportConversion, setSupportConversion] = useState<boolean>(true);

  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCChannelType.PARSER_SUPPORT_CONVERSION,
      (arg: any) => {
        const supports = arg as boolean;
        setSupportConversion(supports);
      }
    );
    window.electron.ipcRenderer.sendMessage(
      IPCChannelType.PARSER_SUPPORT_CONVERSION
    );
    return () => {
      window.electron.ipcRenderer.removeAllListener(
        IPCChannelType.PARSER_SUPPORT_CONVERSION
      );
    };
  }, []);

  return (
    <div id={`${id}:container`} className={`${className} h-full`}>
      <OutputDataTableCore
        id={`${id}:outputTable`}
        data={receivedData}
        setData={setReceivedData}
        clearButtonToolTip={t('CLEAR_RECEIVED')}
        conversionsDisabled={!supportConversion}
        dataCountLabel="Rx"
        selectedCells={selectedCells}
        setSelectedCells={setSelectedCells}
      />
    </div>
  );
};

export default OutputDataTable;
