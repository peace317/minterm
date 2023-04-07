import React from 'react';
import { render } from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { StoreKey } from './types/StoreKeyType';
import ContextProvider from './context';
import MenuBar from './components/menu/MenuBar';
import MacroTree from './components/macros/MacroTree';
import OutputTabView from './components/output/OutputTabView';
import TransmitDataTable from './components/output/TransmitDataTable';

// Necessary primereact styles
import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icon
import 'primeflex/primeflex.scss';
import '../resources/styles/main.css';
//import themesagablue from '../resources/styles/theme-saga-blue.module.scss'

// Localization messages
import messageText_en from '../resources/languages/MessageText_en.json';
import messageText_de from '../resources/languages/MessageText_de.json';
import ToastMessage from './components/ToastMessage';
import { Logger } from './services/Logger';
import ToolBar from './components/tools/ToolBar';
import { IPCChannelType } from './types/IPCChannelType';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: messageText_en },
    de: { translation: messageText_de },
  },
  lng: window.electron.store.get(StoreKey.LANGUAGE),
  fallbackLng: ['en', 'de'],
  interpolation: {
    escapeValue: false,
  },
});

const App = () => {

  const onLoad = () => {
    import(
      `../resources/styles/${window.electron.store.get(StoreKey.THEME)}.scss`
    );
    if (!window.electron?.ipcRenderer.fetch(IPCChannelType.IS_DEVELOPMENT)) {
      Object.assign(console, Logger);
    }
  };

  onLoad();

  return (
    <React.StrictMode>
      <ContextProvider>
        <ToastMessage id="toastMessage" />
        <div className="h-screen overflow-hidden">
          <MenuBar id="menu" />
          <ToolBar id="toolbar" />
          <div className="h-full main-body">
            <Splitter className="h-full w-full" gutterSize={4}>
              <SplitterPanel
                className="col col-4"
                style={{ padding: '0' }}
                size={25}
                minSize={15}
              >
                <MacroTree id="macroMenu"></MacroTree>
              </SplitterPanel>
              <SplitterPanel className="col" size={75} minSize={40}>
                <Splitter layout="vertical" gutterSize={4}>
                  <SplitterPanel size={65} minSize={25}>
                    <OutputTabView id="tabView" />
                  </SplitterPanel>
                  <SplitterPanel size={35} minSize={15}>
                    <TransmitDataTable id="input" />
                  </SplitterPanel>
                </Splitter>
              </SplitterPanel>
            </Splitter>
          </div>
        </div>
      </ContextProvider>
    </React.StrictMode>
  );
};

render(<App />, document.getElementById('root'));
