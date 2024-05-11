import '@testing-library/jest-dom';
import OutputDataTableCore, {
  buildCell,
} from '../renderer/components/output/OutputDataTableCore';
import { ConversionType, DataPointType } from '@minterm/types';
import {render, screen} from '@testing-library/react'

const { ResizeObserver } = window;

jest.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

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
  const TestComponent = () => renderTableWithContext(formatData([]), 0);
  render(<TestComponent />);
});

test('renders DataTable no elements', async () => {
  const TestComponent = () => renderTableWithContext([], 0);
  render(<TestComponent />);
  expect(screen.getByRole('table').getAttribute('value')).toStrictEqual([]);
});

test('renders DataTable with one elements', async () => {
  const TestComponent = () => renderTableWithContext(formatData(['1']), 0);
  render(<TestComponent />);
  expect(screen.getByRole('table').getAttribute('value')).toStrictEqual([
    {
      '0': buildCell(formatData(['1'])[0], [ConversionType.ASCII]),
      id: 0,
      colLength: 1,
    },
  ]);
});

test('renders DataTable with multiple elements in one column', async () => {
  const data = formatData(['1', '2', '3', '4']);
  const TestComponent = () => renderTableWithContext(data, 0);
  render(<TestComponent />);
  expect(screen.getByRole('table').getAttribute('value')).toStrictEqual([
    {
      '0': buildCell(data[0], [ConversionType.ASCII]),
      id: 0,
      colLength: 1,
    },
    {
      '0': buildCell(data[1], [ConversionType.ASCII]),
      id: 1,
      colLength: 1,
    },
    {
      '0': buildCell(data[2], [ConversionType.ASCII]),
      id: 2,
      colLength: 1,
    },
    {
      '0': buildCell(data[3], [ConversionType.ASCII]),
      id: 3,
      colLength: 1,
    },
  ]);
});

test('building columns on width (two cols)', async () => {
  const data = formatData(['1', '2', '3', '4']);
  const TestComponent = () => renderTableWithContext(data, 201);
  render(<TestComponent />);
  expect(screen.getByRole('table').getAttribute('value')).toEqual([
    {
      '0': buildCell(data[0], [ConversionType.ASCII]),
      '1': buildCell(data[1], [ConversionType.ASCII]),
      id: 0,
      colLength: 2,
    },
    {
      '0': buildCell(data[2], [ConversionType.ASCII]),
      '1': buildCell(data[3], [ConversionType.ASCII]),
      id: 1,
      colLength: 2,
    },
  ]);
});

test('building columns on width (two cols with leftover value)', async () => {
  const data = formatData(['1', '2', '3', '4', '5']);
  const TestComponent = () => renderTableWithContext(data, 201);
  render(<TestComponent />);
  expect(screen.getByRole('table').getAttribute('value')).toEqual([
    {
      '0': buildCell(data[0], [ConversionType.ASCII]),
      '1': buildCell(data[1], [ConversionType.ASCII]),
      id: 0,
      colLength: 2,
    },
    {
      '0': buildCell(data[2], [ConversionType.ASCII]),
      '1': buildCell(data[3], [ConversionType.ASCII]),
      id: 1,
      colLength: 2,
    },
    {
      '0': buildCell(data[4], [ConversionType.ASCII]),
      id: 2,
      colLength: 2,
    },
  ]);
});

test('building columns on width (five cols)', async () => {
  const data = formatData(['1', '2', '3', '4', '5']);
  const TestComponent = () => renderTableWithContext(data, 501);
  render(<TestComponent />);
  expect(screen.getByRole('table').getAttribute('value')).toEqual([
    {
      '0': buildCell(data[0], [ConversionType.ASCII]),
      '1': buildCell(data[1], [ConversionType.ASCII]),
      '2': buildCell(data[2], [ConversionType.ASCII]),
      '3': buildCell(data[3], [ConversionType.ASCII]),
      '4': buildCell(data[4], [ConversionType.ASCII]),
      id: 0,
      colLength: 5,
    },
  ]);
});

function formatData(data: Array<string>): Array<DataPointType> {
  var res: Array<DataPointType> = [];
  for (let index = 0; index < data.length; index++) {
    res.push({
      value: data[index],
    });
  }
  return res;
}

/* In case of the need of a funtional context during testing */
/*
function createContext(
  data: Array<DataPointType>,
  setData: React.Dispatch<React.SetStateAction<DataPointType[]>>
): ContextType {
  return {
    selectedPort: undefined,
    setPort: function (
      value: React.SetStateAction<{ name: string; code: string } | undefined>
    ): void {
      throw new Error('Function not implemented.');
    },
    selectedBaudRate: undefined,
    setBaudRate: function (
      value: React.SetStateAction<{ name: string; code: string } | undefined>
    ): void {
      throw new Error('Function not implemented.');
    },
    data: data,
    setData: setData,
    selectedTheme: undefined,
    setTheme: function (
      value: React.SetStateAction<
        { name: string; code: string; theme: string } | undefined
      >
    ): void {
      throw new Error('Function not implemented.');
    },
  };
}*/
function renderTableWithContext(data: Array<DataPointType>, width: number) {
  return (
    <OutputDataTableCore
      id="table"
      className="mr-2"
      width={width}
      data={data}
    />
  );
}