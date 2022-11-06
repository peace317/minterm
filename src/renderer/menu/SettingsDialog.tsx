import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import ThemeSelect from './ThemeSelect';
import { StoreKey } from 'renderer/types';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toast } from 'primereact/toast';

interface ISettingsDialogProps {
  id: string;
  className?: string;
  display: boolean;
  setDisplay: any;
}

const SettingsDialog: React.FC<ISettingsDialogProps> = ({
  id,
  className,
  display,
  setDisplay,
}) => {
  const { t } = useTranslation();
  const [isRestartNecessary, setIsRestartNecessary] = useState<boolean>(false);
  const toast = useRef<any>(null);
  const [selectedTheme, setSelectedTheme] = useState<any>(
    window.electron.store.get(StoreKey.THEME)
  );

  const onHide = () => {
    setDisplay(false);
  };

  const onCancel = () => {
    onHide();
    setSelectedTheme(window.electron.store.get(StoreKey.THEME));
    setIsRestartNecessary(false);
  };

  const onAccept = () => {
    if (isRestartNecessary) {
      confirmRestart();
    } else {
      onHide();
    }
  };

  useEffect(() => {
    if (isRestartNecessary) {
      toast.current.show({
        severity: 'warn',
        summary: t('WARNING'),
        detail: t('RESTART_NEEDED'),
        life: 3000,
      });
    }
  }, [isRestartNecessary]);

  const onThemeChange = (e: { value: any }) => {
    console.log(window.electron.store.get(StoreKey.THEME));
    setSelectedTheme(e.value);
    setIsRestartNecessary(true);
  };

  const accept = () => {
    window.electron.store.set(StoreKey.THEME, selectedTheme);
    window.electron.ipcRenderer.sendMessage('reload:app');
  };

  const confirmRestart = () => {
    confirmDialog({
      message: t('PROCEED_APPSTART'),
      header: t('CONFIRMATION'),
      icon: 'pi pi-exclamation-triangle',
      accept,
    });
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
    <div id={'dialogWrapper:' + id} className={className}>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Dialog
        id={'dialogWrapper:dialog:' + id}
        header={t('DISPLAY_SETTINGS')}
        visible={display}
        onHide={() => onHide()}
        breakpoints={{ '960px': '75vw' }}
        style={{ width: '50vw' }}
        footer={renderFooter()}
      >
        <ThemeSelect
          id="themeSelector"
          selectedTheme={selectedTheme}
          onThemeChange={onThemeChange}
        />
      </Dialog>
    </div>
  );
};

export default SettingsDialog;
