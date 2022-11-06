import React, { useEffect, useRef, useState } from 'react';
import { Menubar } from 'primereact/menubar';
import SettingsDialog from './SettingsDialog';
import { useTranslation } from 'react-i18next';

const Menu: React.FC<{ id: string; className?: string }> = ({
  id,
  className,
}) => {

  const { t } = useTranslation();
  const [displaySettings, setDisplaySettings] = useState(false);
  const start = <i className="pi pi-apple"></i>;
  const end = (
    <React.Fragment>
      <i className="pi pi-video" />
      <i className="pi pi-wifi" />
      <i className="pi pi-volume-up" />
      <span>Fri 13:07</span>
      <i className="pi pi-search" />
      <i className="pi pi-bars" />
    </React.Fragment>
  );
  const menubarItems = [
    {
      label: 'Minterm',
      className: 'menubar-root',
    },
    {
      label: t('FILE'),
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-plus',
          items: [
            {
              label: 'Bookmark',
              icon: 'pi pi-fw pi-bookmark',
            },
            {
              label: 'Video',
              icon: 'pi pi-fw pi-video',
            },
          ],
        },
        {
          label: 'Delete',
          icon: 'pi pi-fw pi-trash',
        },
        {
          separator: true,
        },
        {
          label: 'Export',
          icon: 'pi pi-fw pi-external-link',
        },
      ],
    },
    {
      label: 'Edit',
      items: [
        {
          label: 'Left',
          icon: 'pi pi-fw pi-align-left',
        },
        {
          label: 'Right',
          icon: 'pi pi-fw pi-align-right',
        },
        {
          label: 'Center',
          icon: 'pi pi-fw pi-align-center',
        },
        {
          label: 'Justify',
          icon: 'pi pi-fw pi-align-justify',
        },
      ],
    },
    {
      label: t('SETTINGS'),
      items: [
        {
          label: 'New',
          icon: 'pi pi-fw pi-user-plus',
        },
        {
          label: t('DISPLAY'),
          icon: 'pi pi-fw pi-cog',
          command: () => {
            setDisplaySettings(true);
          }
        },
      ],
    },
    {
      label: t('QUIT'),
      command: () => {
        window.electron.ipcRenderer.sendMessage('kill:app');
      },
    },
  ];

  return (
    <div className={className + ' menubar'}>
      <SettingsDialog id={'settingsDialog'} display={displaySettings} setDisplay={setDisplaySettings}/>
      <Menubar id={id} model={menubarItems} start={start} end={end} />
    </div>
  );
};

export default Menu;
