import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useContext } from '@/renderer/context';
import { IDefaultProps, IPCChannelType } from '@minterm/types';
import ContextMenuOutput from './ContextMenuOutput';
import OutputDataTable from './OutputDataTable';
import OutputTextArea from './OutputTextArea';
import clsx from 'clsx';
import OutputLineChart from './OutputLineChart';

const OutputTabView: React.FC<IDefaultProps> = ({ id, className }) => {
  const { t } = useTranslation();
  const [contextEvent, setContextEvent] = useState<React.MouseEvent<HTMLDivElement, MouseEvent>>();
  const { receivedData, setReceivedData } = useContext();
  const [selectedCellsInTable, setSelectedCellsInTable] = useState<Array<any>>(
    []
  );

  const isContextEnabled = () => {
    const env = window.electron?.ipcRenderer.fetch(
      IPCChannelType.GET_ENV,
      'REACT_APP_ALLOW_CONTEXT_MENU'
    );
    return env !== 'false';
  };

  return (
    <div id={`${id}:container`} className={clsx(className, "tabview w-full h-full")}>
      {isContextEnabled() && (
        <ContextMenuOutput
          data={useContext().receivedData}
          selectedCells={selectedCellsInTable}
          onContextMenu={contextEvent}
        />
      )}
      <TabView
        id={id}
        className="tabview-header-icon h-full"
        onContextMenu={(e) => setContextEvent(e)}
      >
        <TabPanel
          header={t('TABLE_VIEW')}
          leftIcon="pi pi-fw pi-list layout-menuitem-icon"
          className="h-full"
        >
          <OutputDataTable
            id="outDataTable"
            selectedCells={selectedCellsInTable}
            setSelectedCells={setSelectedCellsInTable}
          />
        </TabPanel>
        <TabPanel
          header={t('MONITOR')}
          leftIcon="pi pi-fw pi-stop"
          className="h-full"
        >
          <OutputTextArea
            id="lineChart"
            className="pb-5"
            data={receivedData.map((i) => i.value).join('')}
            setData={setReceivedData}
          />
        </TabPanel>
        <TabPanel
          header={t('PLOTTER')}
          leftIcon="pi pi-fw pi-chart-line"
          className="h-full"
        >
          <OutputLineChart id="lineChart" />
        </TabPanel>
      </TabView>
    </div>
  );
};

export default OutputTabView;
