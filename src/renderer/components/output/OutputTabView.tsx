import React, { useRef, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import OutputDataTable from './OutputDataTable';
import OutputLineChart from './OutputLineChart';
import OutputTextArea from './OutputTextArea';
import { useTranslation } from 'react-i18next';
import { IDefaultProps } from 'renderer/types/AppInterfaces';
import ContextMenuOutput from './ContextMenuOutput';
import { useContext } from 'renderer/context';
import { IPCChannelType } from 'renderer/types/IPCChannelType';

const OutputTabView: React.FC<IDefaultProps> = ({ id, className }) => {
  const { t } = useTranslation();
  const [contextEvent, setContextEvent] = useState<any>();
  const { receivedData, setReceivedData } = useContext();
  const [selectedCellsInTable, setSelectedCellsInTable] = useState<Array<any>>(
    []
  );

  const isContextEnabled = () => {
    var env = window.electron?.ipcRenderer.fetch(
      IPCChannelType.GET_ENV,
      'REACT_APP_ALLOW_CONTEXT_MENU'
    );
    return env !== 'false';
  };

  return (
    <div id={id +":container"} className={className + ' tabview h-full'}>
      { isContextEnabled() &&
      <ContextMenuOutput
        data={useContext().receivedData}
        selectedCells={selectedCellsInTable}
        onContextMenu={contextEvent}
      />
      }
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
            className='pb-5'
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
