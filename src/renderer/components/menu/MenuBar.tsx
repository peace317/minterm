import { Menubar } from 'primereact/menubar';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  VscChromeClose,
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore,
  VscQuestion,
} from 'react-icons/vsc';
import { IDefaultProps, IPCChannelType } from '@minterm/types';
import ParserSettingsDialog from './connection/ParserSettingsDialog';
import GeneralSettingsDialog from './general/GeneralSettingsDialog';
import ConnectionSettingsDialog from './connection/ConnectionSettingsDialog';
import ExportDialog from './file/ExportDialog';
import AboutDialog from './help/AboutDialog';
import LoggingDialog from './help/LoggingDialog';

const MenuBar: React.FC<IDefaultProps> = ({ id, className }) => {
  const { t } = useTranslation();
  const [displaySettings, setDisplaySettings] = useState(false);
  const [connectionSettings, setConnectionSettings] = useState(false);
  const [parserSettings, setParserSettings] = useState(false);
  const [exportOptions, setExportOptions] = useState(false);
  const [loggingDialog, setLoggingDialog] = useState(false);
  const [aboutDialog, setAboutDialog] = useState(false);
  const start = <i className="pi" />;
  const end = (
    <div className="window-controls">
      <div
        id="min-button"
        className="control-button no-drag"
        onClick={() =>
          window.electron.ipcRenderer.sendMessage(IPCChannelType.APP_MINIMIZE)
        }
      >
        <VscChromeMinimize className="icon" size={16} />
      </div>
      <div
        id="max-button"
        className="control-button no-drag"
        onClick={() => {
          window.electron.ipcRenderer.sendMessage(IPCChannelType.APP_MAXIMIZE);
        }}
      >
        <VscChromeMaximize className="icon" size={16} />
      </div>
      <div
        id="restore-button"
        className="control-button no-drag hidden"
        onClick={() => {
          window.electron.ipcRenderer.sendMessage(IPCChannelType.APP_RESTORE);
        }}
      >
        <VscChromeRestore className="icon" size={16} />
      </div>
      <div
        id="close-button"
        className="close-button control-button no-drag"
        onClick={() => window.close()}
      >
        <VscChromeClose className="icon" size={16} />
      </div>
    </div>
  );

  document.onreadystatechange = (event) => {
    window.electron.ipcRenderer.on(IPCChannelType.APP_MAXIMIZE, () => {
      document.getElementById('max-button')?.classList.add('hidden');
      document.getElementById('restore-button')?.classList.remove('hidden');
    });
    window.electron.ipcRenderer.on(IPCChannelType.APP_UNMAXIMIZE, () => {
      document.getElementById('restore-button')?.classList.add('hidden');
      document.getElementById('max-button')?.classList.remove('hidden');
    });
  };

  const menubarItems = [
    {
      label: 'Minterm',
      className: 'menubar-root',
    },
    {
      label: t('FILE'),
      items: [
        {
          label: t('EXPORT'),
          icon: 'pi pi-fw pi-external-link',
          command: () => {
            setExportOptions(true);
          },
        },
        {
          separator: true,
        },
        {
          label: t('QUIT'),
          icon: 'pi pi-fw pi-power-off',
          command: () => {
            window.electron.ipcRenderer.sendMessage(IPCChannelType.APP_CLOSE);
          },
        },
      ],
    },
    {
      label: t('CONNECTION'),
      items: [
        {
          label: t('CONNECTION_OPTIONS'),
          className: 'menu-item-no-icon',
          command: () => {
            setConnectionSettings(true);
          },
        },
        {
          separator: true,
        },
        {
          label: t('PARSER_OPTIONS'),
          className: 'menu-item-no-icon',
          command: () => {
            setParserSettings(true);
          },
        },
      ],
    },
    /* {
      label: t('MACROS'),
      items: [
        {
          label: 'Manage Macros',
          icon: 'pi pi-fw pi-user-plus',
        },
      ],
    }, */
    {
      label: t('SETTINGS'),
      items: [
        {
          label: t('GENERAL'),
          icon: 'pi pi-fw pi-cog',
          command: () => {
            setDisplaySettings(true);
          },
        },
      ],
    },
    {
      label: t('HELP'),
      items: [
        {
          label: `${t('HELP')}...`,
          icon: <VscQuestion className="pi pi-fw mr-2" size={18} />,
          className: '',
          command: () => {
            window.open(
              'https://github.com/peace317/minterm',
              '_blank',
              'noopener,noreferrer'
            );
          },
        },
        {
          label: t('RELOAD_APP'),
          className: 'menu-item-no-icon',
          command: () => {
            window.electron.ipcRenderer.sendMessage(IPCChannelType.APP_RELOAD);
          },
        },
        {
          label: t('SHOW_LOGS'),
          className: 'menu-item-no-icon',
          command: () => {
            setLoggingDialog(true);
          },
        },
        {
          separator: true,
        },
        {
          label: t('ABOUT'),
          className: 'menu-item-no-icon',
          command: () => {
            setAboutDialog(true);
          },
        },
      ],
    },
  ];

  return (
    <div id={`${id}:container`} className={`${className} menubar menubar-drag`}>
      <Menubar id={id} model={menubarItems} start={start} end={end} />
      <GeneralSettingsDialog
        id="settingsDialog"
        display={displaySettings}
        setDisplay={setDisplaySettings}
      />
      <ParserSettingsDialog
        id="parserSettings"
        display={parserSettings}
        setDisplay={setParserSettings}
      />
      <ConnectionSettingsDialog
        id="connectionSettingsDialog"
        display={connectionSettings}
        setDisplay={setConnectionSettings}
      />
      <ExportDialog
        id="exportDialog"
        display={exportOptions}
        setDisplay={setExportOptions}
      />
      <LoggingDialog
        id="loggingDialog"
        display={loggingDialog}
        setDisplay={setLoggingDialog}
      />
      <AboutDialog
        id="aboutDialog"
        display={aboutDialog}
        setDisplay={setAboutDialog}
      />
    </div>
  );
};

export default MenuBar;
