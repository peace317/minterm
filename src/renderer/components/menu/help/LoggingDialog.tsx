import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutputTextArea from '@/renderer/components/output/OutputTextArea';
import { IPCChannelType, IDialogProps } from '@minterm/types';

/**
 * Dialog for showing logs.
 *
 * @param IDialogProps
 */
const LoggingDialog: React.FC<IDialogProps> = ({
  id,
  className,
  display,
  setDisplay,
}) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<string>();

  useEffect(() => {
    const logFiles = window.electron.ipcRenderer.fetch(IPCChannelType.LOG_FILE);
    const logs = logFiles[0]?.lines.join('\n');
    setLogs(logs);
  }, [display]);

  const onHide = () => {
    setDisplay(false);
    // eventually free memory
    setLogs('');
  };

  const onOpenFileSystem = () => {
    const logFiles = window.electron.ipcRenderer.fetch(IPCChannelType.LOG_FILE);
    const logFilePath = logFiles[0].path;
    // The Regex filters the filename, which will then be removed (for cross system)
    const filePath = logFilePath.replace(
      logFilePath.replace(/^.*[\\/]/, ''),
      ''
    );
    console.log(filePath);
    window.electron.ipcRenderer.sendMessage(IPCChannelType.OPEN_FILE, filePath);
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label={t('CLOSE')}
          icon="pi pi-times"
          onClick={onHide}
          className="p-button-text"
        />
      </div>
    );
  };

  return (
    <div id={`${id}:container`} className={className}>
      <Dialog
        id={id}
        header={t('LOGS')}
        visible={display}
        onHide={() => onHide()}
        style={{ width: '40rem', height: '40rem' }}
        resizable
        footer={renderFooter()}
        modal={false}
      >
        <div className="h-full">
          <div className="button-small mr-5 absolute right-0">
            <Button
              id="BtnOpenFileSystem"
              label="..."
              onClick={onOpenFileSystem}
            />
          </div>
          <div className="h-full pt-5">
            <OutputTextArea
              id="loggingConsole"
              className="scrollDown-logs scrollTop-logs"
              data={logs}
              actionBarHidden
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default LoggingDialog;
