import { Dropdown } from 'primereact/dropdown';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IDefaultProps, ISelectValue } from 'renderer/types/AppInterfaces';
import { useContext } from '../../context';

const PortSelect: React.FC<IDefaultProps> = ({ id, className }) => {
  const { selectedPort, setPort, portList } = useContext();
  const { t } = useTranslation();
  const [portOptions, setPorts] = useState<Array<ISelectValue>>([]);

  useEffect(() => {
    var selectablePorts: Array<ISelectValue> = [];
    if (portList !== undefined) {
      for (let i = 0; i < portList.length; i++) {
        if (portList[i].pnpId != undefined) {
          selectablePorts.push({
            name: portList[i].path,
            key: portList[i].path,
          });
        }
      }
      setPorts(selectablePorts);
    }
  }, [portList]);

  return (
    <div id={id + ':container'} className={className}>
      <Dropdown
        id={id + ':portSelect'}
        value={selectedPort}
        options={portOptions}
        onChange={(e) => setPort(e.target.value)}
        optionLabel="name"
        optionValue="key"
        placeholder={t('PORT')}
      />
    </div>
  );
};

export default PortSelect;
