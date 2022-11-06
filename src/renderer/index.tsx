import React, { Suspense } from 'react';
import { render } from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Primeract Components
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Toolbar } from 'primereact/toolbar';

// Custom Components
import ButtonConnect from './ButtonConnect';
import ButtonClear from './ButtonClear';
import ContextProvider, { useContext } from './context';
import PortSelect from './PortSelect';
import BaudRateSelect from './BaudRateSelect';
import Menu from './menu/Menu';

import 'primereact/resources/primereact.min.css'; //core css
import 'primeicons/primeicons.css'; //icon
import 'primeflex/primeflex.scss';
import '../resources/styles/main.css';

// Localization messages
import messageText_en from '../resources/languages/MessageText_en.json';
import messageText_de from '../resources/languages/MessageText_de.json';
import OutputDataTable from './OutputDataTable';
import { StoreKey } from './types';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: messageText_en },
    de: { translation: messageText_de },
  },
  lng: 'de',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

const leftContents = (
  <React.Fragment>
    <ButtonConnect
      id="connectButton"
      className="mr-2 p-button-sm p-button-success"
    />
    <ButtonClear id="btn_clear" className="mr-2" />
    <PortSelect id="ports" className="mr-2" />
    <BaudRateSelect id="baudRate" />
  </React.Fragment>
);
const App = () => {
  const onLoad = () => {
    import(`../resources/styles/${window.electron.store.get(StoreKey.THEME)}.scss`)
  }
  onLoad();
  return (
    <React.StrictMode>
      <Suspense fallback="Loading...">
        <ContextProvider>
          <div className="h-screen overflow-hidden" >
            <div style={{ height: '35px' }}>
              <Menu id="menu" />
            </div>
            <div style={{ height: '90px' }}>
              <Toolbar left={leftContents} />
            </div>
            <div
              className="h-full"
              style={{ paddingBottom: 'calc(90px + 35px)' }}
            >
              <Splitter className="h-full w-full">
                <SplitterPanel className="col col-4" size={25} minSize={15}>
                  Panel 1
                </SplitterPanel>
                <SplitterPanel className="col" size={75} minSize={40}>
                  <Splitter layout="vertical">
                    <SplitterPanel size={65} minSize={25}>
                      <OutputDataTable id="outDataTable"></OutputDataTable>
                    </SplitterPanel>
                    <SplitterPanel size={35} minSize={15}></SplitterPanel>
                  </Splitter>
                </SplitterPanel>
              </Splitter>
            </div>
          </div>
        </ContextProvider>
      </Suspense>
    </React.StrictMode>
  );
};

render(<App />, document.getElementById('root'));
