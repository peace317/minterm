import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { IDefaultProps, ISelectValue } from 'renderer/types/AppInterfaces';
import { useContext } from 'renderer/context';

const baudOptions: Array<ISelectValue> = [
  { name: '110', key: '110' },
  { name: '300', key: '300' },
  { name: '1200', key: '1200' },
  { name: '2400', key: '2400' },
  { name: '4800', key: '4800' },
  { name: '9600', key: '9600' },
  { name: '14400', key: '14400' },
  { name: '19200', key: '19200' },
  { name: '38400', key: '38400' },
  { name: '57600', key: '57600' },
  { name: '115200', key: '115200' },
];

const BaudRateSelect: React.FC<IDefaultProps> = ({
  id,
  className,
}) => {

  const { selectedBaudRate, setBaudRate } = useContext();
  const { t } = useTranslation();

  return (
    <div id={id +":container"} className={className + ''}>
      <Dropdown
        id={id}
        value={selectedBaudRate}
        options={baudOptions}
        onChange={(e) => setBaudRate(e.target.value)}
        optionLabel="name"
        optionValue="key"
        placeholder={t('BAUD_RATE')}
      />
    </div>
  );
};

export default BaudRateSelect;
