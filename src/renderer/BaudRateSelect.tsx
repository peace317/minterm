import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useContext } from './context';
import { useTranslation } from 'react-i18next';

const BaudRateSelect: React.FC<{id: string, className?: string}> = ({id, className}) => {

    const baudOptions = [
      {name: '110', code: '110'},
      {name: '300', code: '300'},
      {name: '1200', code: '1200'},
      {name: '2400', code: '2400'},
      {name: '4800', code: '4800'},
      {name: '9600', code: '9600'},
      {name: '14400', code: '14400'},
      {name: '19200', code: '19200'},
      {name: '38400', code: '38400'},
      {name: '57600', code: '57600'},
      {name: '115200', code: '115200'},
    ];

    const { selectedBaudRate, setBaudRate } = useContext();
    const { t } = useTranslation();

    const onBaudRateChange = (e: { value: any}) => {
        setBaudRate(e.value);
    }

    return (
      <div className={className + ' dropdown'}>
        <Dropdown id={id} value={selectedBaudRate} options={baudOptions}
          onChange={onBaudRateChange} optionLabel="name" placeholder={t('SELECT_A_BAUD_RATE')}/>
      </div>
    );
}

export default BaudRateSelect;
