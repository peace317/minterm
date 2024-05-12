import { ToggleButton, ToggleButtonChangeEvent } from 'primereact/togglebutton';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Context } from '@/renderer/context';
import { ConnectionStatusType, IPCChannelType } from '@minterm/types';

/**
 * Component for a taggable button that opens a connection to a serialport. If
 * the connection can't be opened, an info message occurs.
 *
 * @param HTMLAttributes
 */
const ButtonConnect: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ id, className, ...props }) => {
  const [checked, setChecked] = useState(false);
  const context = useContext(Context);
  const { t } = useTranslation();

  const onConnect = (e: ToggleButtonChangeEvent) => {
    setChecked(e.value);
    if (checked) {
      window.electron.ipcRenderer.sendMessage(IPCChannelType.PORT_DISCONNECT);
    } else {
      window.electron.ipcRenderer.sendMessage(
        IPCChannelType.PORT_CONNECT,
        context.selectedPort,
        context.selectedBaudRate
      );
      window.electron.ipcRenderer.once(IPCChannelType.PORT_STATUS, (arg) => {
        switch (arg as ConnectionStatusType) {
          // fall through, no connection
          case ConnectionStatusType.NO_BAUD_RATE_SELECTED:
          case ConnectionStatusType.NO_PORT_SELECTED:
          case ConnectionStatusType.PORT_ALREADY_OPEN:
            setChecked(false);
            break;
          default:
        }
      });
    }
  };

  return (
    <div id={`${id}:container`} className={className} {...props}>
      <ToggleButton
        id={id}
        className="p-button-sm"
        style={{backgroundColor: '#689f38'}}
        onLabel={t('DISCONNECT')}
        offLabel={t('CONNECT')}
        onIcon="pi pi-sort-alt-slash"
        offIcon="pi pi-check"
        checked={checked}
        onChange={onConnect}
      />
    </div>
  );
};

export default ButtonConnect;
