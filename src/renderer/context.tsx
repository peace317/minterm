import React, { useEffect, useRef } from 'react';
import { themes } from './components/menu/general/ThemeSelect';
import { DataPointType } from './types/DataPointType';
import { IPCChannelType } from './types/IPCChannelType';
import { StoreKey } from './types/StoreKeyType';
import { PortInfo } from '@serialport/bindings-cpp';

export type ContextType = {
  selectedPort: { name: string; code: string } | undefined;
  setPort: React.Dispatch<
    React.SetStateAction<{ name: string; code: string } | undefined>
  >;
  selectedBaudRate: { name: string; code: string } | undefined;
  setBaudRate: React.Dispatch<
    React.SetStateAction<{ name: string; code: string } | undefined>
  >;
  receivedData: Array<DataPointType>;
  setReceivedData: React.Dispatch<React.SetStateAction<DataPointType[]>>;
  transmittedData: Array<DataPointType>;
  setTransmittedData: React.Dispatch<React.SetStateAction<DataPointType[]>>;
  selectedTheme: { name: string; code: string; theme: string } | undefined;
  setTheme: React.Dispatch<
    React.SetStateAction<
      { name: string; code: string; theme: string } | undefined
    >
  >;
  portList: Array<PortInfo>;
};

export const Context = React.createContext<ContextType>({} as ContextType);

/**
 * App-Context for providing global excess variables that can not be hold in local
 * components or the electron-store as this is also functioning as an global state,
 * likewise for settings.
 *
 * @param children underlying this context
 * @returns ContextType parameters
 */
const ContextProvider: React.FC = ({ children }) => {
  const [selectedPort, setPort] = React.useState<
    { name: string; code: string } | undefined
  >();
  const [selectedBaudRate, setBaudRate] = React.useState<
    { name: string; code: string } | undefined
  >();
  const [selectedTheme, setTheme] = React.useState<
    { name: string; code: string; theme: string } | undefined
  >();
  const [receivedData, setReceivedData] = React.useState<Array<DataPointType>>(
    []
  );
  const [newReceivedData, setNewReceivedData] = React.useState<DataPointType>();
  const [transmittedData, setTransmittedData] = React.useState<
    Array<DataPointType>
  >([]);
  const [newTransmittedData, setNewTransmittedData] =
    React.useState<Array<DataPointType>>();
  const [portList, setPortList] = React.useState<Array<PortInfo>>([]);

  /**
   * The IPC-Renderer listener should be added once to the context. This can be done
   * by adding them in an empty-dep useEffect() hook. If values inside of those listeners
   * are changed in any other component, the new state will not be transferred, as they are
   * holding there own state. In order to change the state, an useEffect() with dep on the
   * state can be create, as then a new listener will be created.
   * Unfortunately I was not able to find a way to remove the old listener and so
   * creating weird endless loops. This as well happens, when adding the ipc listener
   * without any useEffect().
   *
   * To find a way around, one must find a way to create a listener, that does only need
   * to be created once. Not to be confused with once-listener, as they should send a message
   * only once. Therefor for listening, the new value is added to a state with the single purpose
   * to call an useEffect() hook with a dependency on this state. There the new value
   * can be applied with logic.
   */
  useEffect(() => {
    window.electron.ipcRenderer.on(
      IPCChannelType.RECEIVE_DATA,
      function (value) {
        var msg = value as DataPointType;
        setNewReceivedData(msg);
      }
    );
    window.electron.ipcRenderer.on(IPCChannelType.SEND_DATA, (value) => {
      var msg = value as DataPointType[];
      setNewTransmittedData(msg);
    });
    window.electron.ipcRenderer.on(
      IPCChannelType.RECEIVE_PORT_LIST,
      (value) => {
        let ports = value as import('@serialport/bindings-cpp').PortInfo[];
        setPortList([...ports]);
      }
    );
    var theme: any = themes.filter(
      (theme) => theme.code === window.electron.store.get(StoreKey.THEME)
    );
    setTheme(theme[0]);
  }, []);

  useEffect(() => {
    if (newReceivedData === undefined) return;
    // data can not be set via setData([...data, val]), because the effect-hook
    // off data will not be called then
    receivedData.push(newReceivedData);
    setReceivedData([...receivedData]);
  }, [newReceivedData]);

  useEffect(() => {
    if (newTransmittedData === undefined) return;
    transmittedData.push(...newTransmittedData);
    setTransmittedData([...transmittedData]);
  }, [newTransmittedData]);

  return (
    <Context.Provider
      value={{
        selectedPort,
        setPort,
        selectedBaudRate,
        setBaudRate,
        receivedData,
        setReceivedData,
        transmittedData,
        setTransmittedData,
        selectedTheme,
        setTheme,
        portList,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;

export const useContext = () => React.useContext(Context);
