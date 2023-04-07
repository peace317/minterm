import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { useEffect, useState } from 'react';
import { useContext } from 'renderer/context';
import { FormatService } from 'renderer/services/FormatService';
import { IDefaultProps, ISelectValue } from 'renderer/types/AppInterfaces';
import { ConversionType } from 'renderer/types/ConversionType';
import { IPCChannelType } from 'renderer/types/IPCChannelType';
import OutputDataTableCore from './OutputDataTableCore';
import { useTranslation } from 'react-i18next';

const encodings: Array<ISelectValue> =
  FormatService.typeToSelectList(ConversionType);

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
        var supports = arg as boolean;
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
    <div id={id + ':container'} className={className + ' h-full'}>
      <OutputDataTableCore
        id={id + ':outputTable'}
        data={receivedData}
        setData={setReceivedData}
        clearButtonToolTip={t('CLEAR_RECEIVED')}
        conversionsDisabled={!supportConversion}
        dataCountLabel={'Rx'}
        selectedCells={selectedCells}
        setSelectedCells={setSelectedCells}
      />
    </div>
  );
};

export default OutputDataTable;
