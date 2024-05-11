import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { Splitter, SplitterPanel } from 'primereact/splitter';
import { Button } from 'primereact/button';
import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.scss';
import MenuBar from './components/menu/MenuBar';
import '../../assets/styles/App.scss';
import messageTextEn from '../../assets/textTemplates/MessageText_en.json';
import messageTextDe from '../../assets/textTemplates/MessageText_de.json';
import TransmitDataTable from './components/output/TransmitDataTable';
import { ContextProvider } from './context';
import ToastMessage from './components/ToastMessage';
import ToolBar from './components/tools/ToolBar';
import MacroTree from './components/macros/MacroTree';
import OutputTabView from './components/output/OutputTabView';
import React from 'react';
import { PrimeReactProvider } from 'primereact/api';
import clsx from 'clsx';

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: messageTextEn },
    de: { translation: messageTextDe },
  },
  lng: 'de',
  fallbackLng: ['en', 'de'],
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
});

function AppBase() {
  return (
    <React.StrictMode>
      <PrimeReactProvider>
        <ContextProvider>
          <ToastMessage />
          <div className={clsx("h-screen overflow-hidden theme-sample")}>
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
                    <SplitterPanel>
                      <OutputTabView id="tabView" />
                    </SplitterPanel>
                    <SplitterPanel>
                      <TransmitDataTable id="input" />
                    </SplitterPanel>
                  </Splitter>
                </SplitterPanel>
              </Splitter>
            </div>
          </div>
        </ContextProvider>
      </PrimeReactProvider>
    </React.StrictMode>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppBase />} />
      </Routes>
    </Router>
  );
}
