import React, { useState, useRef, useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { useTranslation } from 'react-i18next';
import { IDefaultProps } from 'renderer/types/AppInterfaces';
import { IPCChannelType } from 'renderer/types/IPCChannelType';
import { ConnectionStatusType } from 'renderer/types/ConnectionStatusType';

const ToastMessage: React.FC<IDefaultProps> = ({ id, className }) => {
  const toast = useRef<Toast>(null);
  const { t } = useTranslation();
  const [connectionStatus, setConnectionStatus] = useState<
    ConnectionStatusType | undefined
  >();

  useEffect(() => {
    window.electron.ipcRenderer.on(IPCChannelType.PORT_STATUS, (arg) => {
      setConnectionStatus(arg as ConnectionStatusType);
    });
    return () => {
      window.electron.ipcRenderer.removeAllListener(IPCChannelType.PORT_STATUS);
    };
  }, []);

  useEffect(() => {
    switch (connectionStatus) {
      case ConnectionStatusType.CONNECTED:
        toast.current?.show({
          severity: 'info',
          summary: t('INFO'),
          detail: t('OPEN_CONNECTION'),
          life: 2500,
        });
        break;
      case ConnectionStatusType.DISCONNECTED:
        toast.current?.show({
          severity: 'info',
          summary: t('INFO'),
          detail: t('NO_OPEN_CONNECTION'),
          life: 2500,
        });
        break;
      case ConnectionStatusType.NO_BAUD_RATE_SELECTED:
        toast.current?.show({
          severity: 'info',
          summary: t('INFO'),
          detail: t('NO_BAUD_RATE_SELECTED'),
          life: 2500,
        });
        break;
      case ConnectionStatusType.NO_PORT_SELECTED:
        toast.current?.show({
          severity: 'info',
          summary: t('INFO'),
          detail: t('NO_PORT_SELECTED'),
          life: 2500,
        });
        break;
      case ConnectionStatusType.PORT_ALREADY_OPEN:
        toast.current?.show({
          severity: 'warn',
          summary: t('WARNING'),
          detail: t('PORT_ALREADY_OPEN'),
          life: 2500,
        });
        break;
      case ConnectionStatusType.PORT_NOT_WRITABLE:
        toast.current?.show({
          severity: 'warn',
          summary: t('WARNING'),
          detail: t('PORT_NOT_WRITABLE'),
          life: 2500,
        });
        break;
      default:
        if (connectionStatus !== undefined) {
          console.error('Unknown status type ' + connectionStatus);
        }
    }
    setConnectionStatus(undefined);
  }, [connectionStatus]);

  return (
    <div id={id +":container"} className={className}>
      <Toast id={id} ref={toast} />
    </div>
  );
};

export default ToastMessage;
