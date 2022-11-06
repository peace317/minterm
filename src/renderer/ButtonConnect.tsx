import React, { useState, useContext, useRef } from "react";
import { ToggleButton } from 'primereact/togglebutton';
import { useTranslation } from 'react-i18next';
import { Context } from './context';
import { ConnectionStatusType } from './types'
import { Toast } from 'primereact/toast';

const ButtonConnect: React.FC<{id: string, className?: string}> = ({id, className}) => {

    const [checked, setChecked] = useState(false);
    const { t } = useTranslation();
    const context = useContext(Context);
    const toast = useRef<any>(null);

    const onConnect = (e: { value: any}) => {
        setChecked(e.value);
        if (checked) {
            window.electron.ipcRenderer.sendMessage('disconnect:port');
        } else {
            window.electron.ipcRenderer.sendMessage('connect:port',
              context.selectedPort,
              context.selectedBaudRate
            );
            window.electron.ipcRenderer.once('port:status', (arg) => {
                switch (arg as ConnectionStatusType) {
                    case ConnectionStatusType.CONNECTED:
                        break;
                    case ConnectionStatusType.DISCONNECTED:
                        break;
                    case ConnectionStatusType.NO_BAUD_RATE_SELECTED:
                        toast.current.show({ severity: 'info', summary: t('INFO'),
                            detail: t('NO_BAUD_RATE_SELECTED'), life: 3000 });
                        setChecked(false);
                        break;
                    case ConnectionStatusType.NO_PORT_SELECTED:
                        toast.current.show({ severity: 'info', summary: t('INFO'),
                            detail: t('NO_PORT_SELECTED'), life: 3000 });
                        setChecked(false);
                        break;
                    default:
                        console.error('Ooops, unnkown enum type: ' + arg);
                }
            });
        }
    }

    return (
      <div>
        <Toast ref={toast} />
        <ToggleButton id={id} className={className}
            onLabel={t('DISCONNECT')} offLabel={t('CONNECT')}
            onIcon="pi pi-sort-alt-slash" offIcon="pi pi-check"
            checked={checked} onChange={onConnect}/>
      </div>
    );
}

export default ButtonConnect;
