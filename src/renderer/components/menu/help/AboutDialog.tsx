import React, { useEffect } from 'react';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { IDefaultProps, IDialogProps } from 'renderer/types/AppInterfaces';
import { useContext } from 'renderer/context';
import { Dialog } from 'primereact/dialog';
import { IPCChannelType } from 'renderer/types/IPCChannelType';

/**
 * Shows information about current versions and contribution.
 *
 * @param IDialogProps
 */
const AboutDialog: React.FC<IDialogProps> = ({
  id,
  className,
  display,
  setDisplay,
}) => {
  const { t } = useTranslation();

  const renderFooter = () => {
    return (
      <div>
        <Button
          label={t('CLOSE')}
          icon="pi pi-times"
          onClick={() => setDisplay(false)}
          className="p-button-text"
        />
      </div>
    );
  };

  const getVersions = () => {
    var versions = window.electron.ipcRenderer.fetch(IPCChannelType.APP_VERSIONS);
    var res = "";
    for (const versionType of ['chrome', 'electron', 'node', 'v8']) {
      res += versionType + ": " + versions[versionType] + "\n";
    }
    return res;
  }

  return (
    <div id={id +":container"} className={className}>
      <Dialog
        id={id}
        header={t('ABOUT')}
        visible={display}
        onHide={() => setDisplay(false)}
        style={{ width: '35rem'}}
        resizable={false}
        footer={renderFooter()}
      >
        <p style={{whiteSpace: "pre-line"}}>
          {getVersions()}
        </p>
      </Dialog>
    </div>
  );
};

export default AboutDialog;
