import {render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ipcRenderer, IpcRendererEvent } from 'electron';
import OutputDataTable from '../renderer/OutputDataTable';
import ContextProvider, { Context, ContextType } from '../renderer/context';
import React, { useState } from 'react';
import Enzyme, { mount, shallow } from 'enzyme';
/*
const { ResizeObserver } = window;
Enzyme.configure({ adapter: new Adapter() });

beforeEach(() => {
  //@ts-ignore
  delete window.ResizeObserver;
  window.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  }));
});

afterEach(() => {
  window.ResizeObserver = ResizeObserver;
  jest.restoreAllMocks();
});

test('loads and displays DataTable', async () => {

  const TestComponent = () => renderTableWithContext(createContext([], () => {}), 0);
  shallow(<TestComponent />)
});

test('renders DataTable with an initialized context', async () => {

  const TestComponent = () => renderTableWithContext(createContext(["1", "2", "3", "4", "5"],() => {}), 0);
  const wrapper = mount(<TestComponent />)
  expect(wrapper.find('DataTable').prop('value')).toEqual(
    [{"0": "1"},
     {"0": "2"},
     {"0": "3"},
     {"0": "4"},
     {"0": "5"}]
  );
});

test('building columns on width (two cols)', async () => {

  const TestComponent = () => renderTableWithContext(createContext(["1", "2", "3", "4"],() => {}), 201);
  const wrapper = mount(<TestComponent />)
  expect(wrapper.find('DataTable').prop('value')).toEqual(
    [{ '0': '1', '1': '2' },
     { '0': '3', '1': '4' }]
  );
});

test('building columns on width (two cols with leftover value)', async () => {

  const TestComponent = () => renderTableWithContext(createContext(["1", "2", "3", "4", "5"],() => {}), 201);
  const wrapper = mount(<TestComponent />)
  expect(wrapper.find('DataTable').prop('value')).toEqual(
    [{ '0': '1', '1': '2' },
     { '0': '3', '1': '4' },
     { '0': '5' }]
  );
});

test('building columns on width (five cols)', async () => {

  const TestComponent = () => renderTableWithContext(createContext(["1", "2", "3", "4", "5"],() => {}), 501);
  const wrapper = mount(<TestComponent />)
  expect(wrapper.find('DataTable').prop('value')).toEqual(
    [{ '0': '1', '1': '2', '2': '3', '3': '4', '4': '5' }]
  );
});


test('adding values to Context', async () => {

  var data: Array<string> = [];
  const setData = (value: Array<string>) => {data = value;};
  const TestComponent = () => renderTableWithContext(createContext(data,() => {}), 0);
  const wrapper = mount(<TestComponent />)
  //console.log(wrapper.find('VirtualScroller').html());
  expect(wrapper.find('DataTable').prop('value')).toEqual(
    []
  );
  setData(["1", "2"]);
  wrapper.update();
  expect(wrapper.find('DataTable').prop('value')).toEqual(
    [{"0": "1"},
     {"0": "2"}]
  );
  setData(["1", "2", "3", "4"]);
  expect(wrapper.find('DataTable').prop('value')).toEqual(
    [{"0": "1"},
     {"0": "2"},
     {"0": "3"},
     {"0": "4"}]
  );
});

function createContext(data: Array<string>, setData: React.Dispatch<React.SetStateAction<string[]>>) {

  return {
    selectedPort: undefined,
    setPort: function (value: React.SetStateAction<{ name: string; code: string; } | undefined>): void {
      throw new Error('Function not implemented.');
    },
    selectedBaudRate: undefined,
    setBaudRate: function (value: React.SetStateAction<{ name: string; code: string; } | undefined>): void {
      throw new Error('Function not implemented.');
    },
    data: data,
    setData: setData
  };
}
function renderTableWithContext(context: ContextType, width: number) {

  const setPort = jest.fn();
  const setBaudRate = jest.fn();
  const setData = jest.fn();
  const selectedPort = context.selectedPort;
  const selectedBaudRate = context.selectedPort;
  const data = context.data;

  return (
    <Context.Provider value={{ selectedPort, setPort, selectedBaudRate, setBaudRate, data, setData}}>
      <OutputDataTable id="table" className='mr-2' initialWidth={width}/>
    </Context.Provider>
  );
}*/
