import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import OutputTextArea from 'renderer/components/output/OutputTextArea';
import { IDialogProps } from 'renderer/types/AppInterfaces';
import { IPCChannelType } from 'renderer/types/IPCChannelType';

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
  const [logs, setLogs] = useState<any>();

  useEffect(() => {
    var logFiles = window.electron.ipcRenderer.fetch(IPCChannelType.LOG_FILE);
    var logs = logFiles[0].lines.join('\n');
    setLogs(logs);
  }, [display]);

  const onHide = () => {
    setDisplay(false);
    // eventually free memory
    setLogs('');
  };

  const onOpenFileSystem = () => {
    var logFiles = window.electron.ipcRenderer.fetch(IPCChannelType.LOG_FILE);
    var logFilePath = logFiles[0].path;
    // The Regex filters the filename, which will then be removed (for cross system)
    var filePath = logFilePath.replace(
      logFilePath.replace(/^.*[\\\/]/, ''),
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
    <div id={id +":container"} className={className}>
      <Dialog
        id={id}
        header={t('LOGS')}
        visible={display}
        onHide={() => onHide()}
        style={{ width: '40rem', height: '40rem' }}
        resizable={true}
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
              actionBarHidden={true}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default LoggingDialog;
