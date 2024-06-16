import { Dropdown } from 'primereact/dropdown';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useContext } from '@/renderer/context';
import { SelectValue } from '@minterm/types';
import clsx from 'clsx';

const baudOptions: Array<SelectValue> = [
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

const BaudRateSelect: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const { selectedBaudRate, setBaudRate } = useContext();
  const { t } = useTranslation();

  return (
    <div className={clsx(className)} {...props}>
      <Dropdown
        id={"baudRateSelect"}
        style={{width: "150px"}}
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
