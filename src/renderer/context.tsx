import React, { useEffect } from 'react';

export type ContextType = {
    selectedPort: {name: string, code: string} | undefined;
    setPort: React.Dispatch<React.SetStateAction<{name: string, code: string} | undefined>>;
    selectedBaudRate: {name: string, code: string} | undefined;
    setBaudRate: React.Dispatch<React.SetStateAction<{name: string, code: string} | undefined>>;
    data: Array<string>;
    setData: React.Dispatch<React.SetStateAction<string[]>>;
};

export const Context = React.createContext<ContextType>({} as ContextType);

const ContextProvider: React.FC = ({ children }) => {
  const [selectedPort, setPort] = React.useState<{name: string, code: string} | undefined>();
  const [selectedBaudRate, setBaudRate] = React.useState<{name: string, code: string} | undefined>();
  const [data, setData] = React.useState<Array<string>>([]);

  useEffect(() => {
    window.electron.ipcRenderer.on('port:connection:data', function (value) {
      var val = value as string;
      // data can not be set via setData([...data, val]), because the effect-hook
      // will not be called then
      data.push(val);
      setData([...data]);
    });
  }, []);

  return (
    <Context.Provider value={{ selectedPort, setPort, selectedBaudRate, setBaudRate, data, setData, }}>
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;

export const useContext = () => React.useContext(Context);
