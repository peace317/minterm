import i18n from 'i18next';
import { Button } from 'primereact/button';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IDialogProps, IPCChannelType, StoreKey } from '@minterm/types';
import LanguageSelect from './LanguageSelect';
import ThemeSelect from './ThemeSelect';
import { PrimeReactContext } from 'primereact/api';
import clsx from 'clsx';
import { DropdownChangeEvent } from 'primereact/dropdown';

const GeneralSettingsDialog: React.FC<IDialogProps> = ({
  id,
  className,
  display,
  setDisplay,
}) => {
  const { t } = useTranslation();
  const [isRestartNecessary, setIsRestartNecessary] = useState<boolean>(false);
  const toast = useRef<any>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<any>(i18n.language);
  const [selectedTheme, setSelectedTheme] = useState<any>(
    window.electron.store.get(StoreKey.THEME)
  );
  const { changeTheme } = useContext(PrimeReactContext);

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

  const onThemeChange = (e: DropdownChangeEvent) => {
    setSelectedTheme(e.value);
  };

  const onLanguageChange = (e: DropdownChangeEvent) => {
    setSelectedLanguage(e.value);
    i18n.changeLanguage(e.value);
  };

  const onHide = () => {
    setDisplay(false);
  };

  const onCancel = () => {
    onHide();
    setSelectedTheme(window.electron.store.get(StoreKey.THEME));
    i18n.changeLanguage(window.electron.store.get(StoreKey.LANGUAGE));
    setSelectedLanguage(window.electron.store.get(StoreKey.LANGUAGE));
    setIsRestartNecessary(false);
  };

  const onAccept = () => {
    if (isRestartNecessary) {
      confirmRestart();
    } else {
      window.electron.store.set(StoreKey.LANGUAGE, selectedLanguage);
      window.electron.store.set(StoreKey.THEME, selectedTheme);
      window.electron.ipcRenderer.sendMessage(IPCChannelType.CHANGE_THEME, selectedTheme);
      onHide();
    }
  };

  const accept = () => {
    window.electron.store.set(StoreKey.THEME, selectedTheme);
    window.electron.store.set(StoreKey.LANGUAGE, selectedLanguage);
    // window.electron.ipcRenderer.sendMessage('reload:app');
    window.location.reload();
  };

  const confirmRestart = () => {
    confirmDialog({
      message: t('PROCEED_APPSTART'),
      header: t('CONFIRMATION'),
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: t('YES'),
      rejectLabel: t('NO'),
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
        />
      </div>
    );
  };

  /*
          
  */

  return (
    <div id={`${id}:container`} className={clsx(className)}>
      <Toast ref={toast} />
      <ConfirmDialog />
      <Dialog
        id={`dialogWrapper:dialog:${id}`}
        header={t('GENERAL')}
        visible={display}
        onHide={() => onHide()}
        style={{ width: '40rem' }}
        footer={renderFooter()}
      >
        <div className="grid">
          <div className="col-6 dropdown">
            <h4>{t('LANGUAGE')}</h4>
            <LanguageSelect
              id="languageSelector"
              selectedLanguage={selectedLanguage}
              onLanguageChange={onLanguageChange}
            />
          </div>
        </div>
        <div className="grid">
          <div className="col-6 dropdown">
            <h4>{t('THEME')}</h4>
            <ThemeSelect
              id="themeSelector"
              selectedTheme={selectedTheme}
              onThemeChange={onThemeChange}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default GeneralSettingsDialog;
