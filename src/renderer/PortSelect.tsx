import React,{ useState, useRef, useEffect } from "react";
import { useContext } from './context';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';

const PortSelect: React.FC<{id: string, className?: string}> = ({id, className}) => {

  const { selectedPort, setPort } = useContext();
  const [portOptions, setPorts] = useState<Array<{ name: string, code: string}>>([]);
  const {current:ref} = useRef([]);
  const { t } = useTranslation();

const onPortChange = (e: { value: any}) => {
    setPort(e.value);
}

useEffect(() => {
    window.electron.ipcRenderer.on('asynchronous-message', function (value) {
      var ports = value as import("@serialport/bindings-cpp").PortInfo[];
      var selectablePorts: any[] = [];
      if (ports != undefined) {
        for (let i = 0; i < ports.length; i++) {
          if (ports[i].pnpId != undefined) {
            selectablePorts.push(
              {name: ports[i].path, code: ports[i].path}
            );
          }
        };
        setPorts(selectablePorts);
      }
    });
}, [ref]);

  return (
    <div className={className + " dropdown"}>
      <Dropdown id={id} value={selectedPort} options={portOptions}
        onChange={onPortChange} optionLabel="name"
        placeholder={t('SELECT_A_PORT')}/>
    </div>
  );
}

export default PortSelect;
