import ToastMessage from "@/renderer//components/ToastMessage";
import OutputTabView from "@/renderer//components/output/OutputTabView";
import TransmitDataTable from "@/renderer//components/output/TransmitDataTable";
import MacroTree from "@/renderer/components/macros/MacroTree";
import MenuBar from "@/renderer/components/menu/MenuBar";
import clsx from "clsx";
import i18n from "i18next";
import "primeflex/primeflex.scss";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/saga-blue/theme.css";
import { Splitter, SplitterPanel } from "primereact/splitter";
import React from "react";
import { initReactI18next } from "react-i18next";
import { Route, MemoryRouter as Router, Routes } from "react-router-dom";
import ToolBar from "./components/tools/ToolBar";
import { ContextProvider } from "./context";
import "./resources/styles/app.scss";
import messageTextDe from "./resources/textTemplates/MessageText_de.json";
import messageTextEn from "./resources/textTemplates/MessageText_en.json";

declare module "i18next" {
  interface CustomTypeOptions {
    returnNull: false;
  }
}

declare global {
  interface Crypto {
    randomUUID: () => `${string}-${string}-${string}-${string}-${string}`;
  }
}

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: messageTextEn },
    de: { translation: messageTextDe },
  },
  lng: "de",
  fallbackLng: ["en", "de"],
  returnNull: false,
  interpolation: {
    escapeValue: false,
  },
});

function AppBase() {
  return (
    <React.StrictMode>
      <ContextProvider>
        <ToastMessage />
        <div className={clsx("h-screen overflow-hidden theme-sample")}>
          <MenuBar id="menu" />
          <ToolBar id="toolbar" />
          <div className="h-full main-body">
            <Splitter className="h-full w-full" gutterSize={4}>
              <SplitterPanel
                className="col col-4"
                style={{ padding: "0" }}
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
