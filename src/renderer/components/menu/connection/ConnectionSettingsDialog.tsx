import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { InputSwitch } from 'primereact/inputswitch';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import BaudRateSelect from '@/renderer/components/tools/BaudRateSelect';
import PortSelect from '@/renderer/components/tools/PortSelect';
import { IDialogProps, SelectValue, StoreKey } from '@minterm/types';

const ConnectionSettingsDialog: React.FC<IDialogProps> = ({
  id,
  className,
  display,
  setDisplay,
}) => {
  const dataBitsOptions: Array<SelectValue> = [
    { name: '5', key: 5 },
    { name: '6', key: 6 },
    { name: '7', key: 7 },
    { name: '8', key: 8 },
  ];

  const stopBitsOptions: Array<SelectValue> = [
    { name: '1', key: 1 },
    { name: '1.5', key: 1.5 },
    { name: '2', key: 2 },
  ];

  const parityOptions: Array<SelectValue> = [
    { name: 'None', key: 'None' },
    { name: 'Odd', key: 'Odd' },
    { name: 'Even', key: 'Even' },
    { name: 'Mark', key: 'Mark' },
    { name: 'Space', key: 'Space' },
  ];

  const [dataBits, setDataBits] = useState<number>(
    window.electron.store.get(StoreKey.SERIALPORT_DATA_BITS)
  );
  const [stopBits, setStopBits] = useState<number>(
    window.electron.store.get(StoreKey.SERIALPORT_STOP_BITS)
  );
  const [lock, setLock] = useState<boolean>(
    window.electron.store.get(StoreKey.SERIALPORT_LOCK)
  );
  const [parity, setParity] = useState<string>(
    window.electron.store.get(StoreKey.SERIALPORT_PARITY)
  );
  const [rtscts, setRtscts] = useState<boolean>(
    window.electron.store.get(StoreKey.SERIALPORT_RTSCTS)
  );
  const [xon, setXon] = useState<boolean>(
    window.electron.store.get(StoreKey.SERIALPORT_XON)
  );
  const [xoff, setXoff] = useState<boolean>(
    window.electron.store.get(StoreKey.SERIALPORT_XOFF)
  );
  const [xany, setXany] = useState<boolean>(
    window.electron.store.get(StoreKey.SERIALPORT_XANY)
  );
  const [hupcl, setHupcl] = useState<boolean>(
    window.electron.store.get(StoreKey.SERIALPORT_HUPCL)
  );
  const { t } = useTranslation();

  const onHide = () => {
    setDisplay(false);
  };

  const onCancel = () => {
    setDataBits(window.electron.store.get(StoreKey.SERIALPORT_DATA_BITS));
    setStopBits(window.electron.store.get(StoreKey.SERIALPORT_STOP_BITS));
    setLock(window.electron.store.get(StoreKey.SERIALPORT_LOCK));
    setParity(window.electron.store.get(StoreKey.SERIALPORT_PARITY));
    setRtscts(window.electron.store.get(StoreKey.SERIALPORT_RTSCTS));
    setXon(window.electron.store.get(StoreKey.SERIALPORT_XON));
    setXoff(window.electron.store.get(StoreKey.SERIALPORT_XOFF));
    setXany(window.electron.store.get(StoreKey.SERIALPORT_XANY));
    setHupcl(window.electron.store.get(StoreKey.SERIALPORT_HUPCL));
    onHide();
  };

  const onAccept = () => {
    window.electron.store.set(StoreKey.SERIALPORT_DATA_BITS, dataBits);
    window.electron.store.set(StoreKey.SERIALPORT_STOP_BITS, stopBits);
    window.electron.store.set(StoreKey.SERIALPORT_LOCK, lock);
    window.electron.store.set(StoreKey.SERIALPORT_PARITY, parity);
    window.electron.store.set(StoreKey.SERIALPORT_RTSCTS, rtscts);
    window.electron.store.set(StoreKey.SERIALPORT_XON, xon);
    window.electron.store.set(StoreKey.SERIALPORT_XOFF, xoff);
    window.electron.store.set(StoreKey.SERIALPORT_XANY, xany);
    window.electron.store.set(StoreKey.SERIALPORT_HUPCL, hupcl);
    onHide();
  };

  const renderFooter = () => {
    return (
      <div id={id}>
        <Button
          label={t('CANCEL')}
          icon="pi pi-times"
          onClick={() => onCancel()}
          className="p-button-text"
        />
        <Button
          label={t('ACCEPT')}
          icon="pi pi-check"
          onClick={() => onAccept()}
          autoFocus
        />
      </div>
    );
  };

  return (
    <div id={`${id}:container`} className={`${className} card`}>
      <ConfirmDialog />
      <Dialog
        id={`dialogWrapper:dialog:${id}`}
        header={t('CONNECTION_OPTIONS')}
        visible={display}
        onHide={() => onHide()}
        style={{ width: '40rem' }}
        resizable
        footer={renderFooter()}
      >
        <div>
          <p>{t('CONNECTION_OPTION_EXPLANATION')}</p>
          <div className="grid">
            <div className="col-6 dropdown">
              <h4 className="">{t('PORT')}</h4>
              <PortSelect id="portSelect" />
            </div>
            <div className="col-6 dropdown">
              <h4 className="">{t('BAUD_RATE')}</h4>
              <BaudRateSelect id="baudRateSelect" />
            </div>
          </div>
          <div className="grid">
            <div className="col-6 dropdown">
              <h4 className="">{t('DATA_BITS')}</h4>
              <Dropdown
                id="dataBits"
                value={dataBits}
                options={dataBitsOptions}
                onChange={(e) => setDataBits(e.target.value)}
                optionLabel="name"
                optionValue="key"
                placeholder={t('SELECT_A_BAUD_RATE')}
              />
            </div>
          </div>
          <div className="grid">
            <div className="col-6 dropdown">
              <h4 className="">{t('STOP_BITS')}</h4>
              <Dropdown
                id="stopBits"
                value={stopBits}
                options={stopBitsOptions}
                onChange={(e) => setStopBits(e.target.value)}
                optionLabel="name"
                optionValue="key"
                placeholder={t('SELECT_A_BAUD_RATE')}
              />
            </div>
          </div>
          <div className="grid">
            <div className="col-6 dropdown">
              <h4 className="">{t('PARITY')}</h4>
              <Dropdown
                id="parity"
                value={parity}
                options={parityOptions}
                onChange={(e) => setParity(e.target.value)}
                optionLabel="name"
                optionValue="key"
                placeholder={t('SELECT_A_BAUD_RATE')}
              />
            </div>
          </div>
          <div className="mt-2">
            <h4 className="label-h4">{t('LOCK')}</h4>
            <p>{t('LOCK_TOOLTIP')}</p>
            <InputSwitch checked={lock} onChange={(e) => setLock(e.value || false)} />
          </div>
          <h4 className="label-h4">rtscts</h4>
          <p>{t('FLOW_CTRL_TOOLTIP')}</p>
          <InputSwitch checked={rtscts} onChange={(e) => setRtscts(e.value || false)} />
          <div>
            <h4 className="label-h4">xon</h4>
            <p>{t('FLOW_CTRL_TOOLTIP')}</p>
            <InputSwitch checked={xon} onChange={(e) => setXon(e.value || false)} />
          </div>
          <div>
            <h4 className="label-h4">xoff</h4>
            <p>{t('FLOW_CTRL_TOOLTIP')}</p>
            <InputSwitch checked={xoff} onChange={(e) => setXoff(e.value || false)} />
          </div>
          <div>
            <h4 className="label-h4">xany</h4>
            <p>{t('FLOW_CTRL_TOOLTIP')}</p>
            <InputSwitch checked={xany} onChange={(e) => setXany(e.value || false)} />
          </div>
          <div>
            <h4 className="label-h4">hupcl</h4>
            <p>{t('HUPCL_TOOLTIP')}</p>
            <InputSwitch checked={hupcl} onChange={(e) => setHupcl(e.value || false)} />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ConnectionSettingsDialog;
