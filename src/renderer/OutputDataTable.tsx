import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useResizeDetector } from 'react-resize-detector';
import { Checkbox } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { useContext } from './context';

interface IDataTableProps {
  id: string;
  className?: string;
  initialWidth?: number;
}

const encodings = [
  { name: 'Ascii', key: 'A' },
  { name: 'Dec', key: 'D' },
  { name: 'Bin', key: 'B' },
  { name: 'Hex', key: 'H' },
];

const OutputDataTable: React.FC<IDataTableProps> = ({
  id,
  className,
  initialWidth,
}) => {
  const WIDTH_PER_COLUMN = 100;
  const [initWidth, setInitWidth] = useState<number>(initialWidth || 0);
  const { data, setData } = useContext();
  const [tableData, setTableData] = useState<any>([]);
  const [sticky, setSticky] = useState<boolean>(true);
  const dataTableRef = useRef<DataTable>(null);
  const [reaceiveCount, setReceiveCount] = useState(0);
  const [selectedEncodings, setEncodings] = useState<any>(
    encodings.slice(0, 1)
  );
  const [columns, setColumns] = useState<any>([
    <Column key="0" field="0" header="0" />,
  ]);
  const { width, ref } = useResizeDetector({
    onResize: () => {
      buildColumns();
    },
  });
  const virtualScroller = dataTableRef.current?.getVirtualScroller();

  useLayoutEffect(() => {
    if (width === undefined) {
      setInitWidth(ref.current.offsetWidth);
    }
    const body = ref.current.getElementsByClassName('p-datatable-tbody')[0];
    //body.style.top = '0px';
    //body.style.trandform = 'translate3d(0px, 0px, 0px);';
  }, []);

  useEffect(() => {
    buildTableData();
  }, [columns]);

  useEffect(() => {
    buildColumns();
  }, [ref]);

  useEffect(() => {
    buildTableData();
  }, [data, setData]);

  const buildColumns = () => {
    let leftWidth: number = width || initWidth;
    const cols: any[] = [];
    let index = 0;
    while (leftWidth > WIDTH_PER_COLUMN) {
      cols.push(
        <Column
          key={index.toString()}
          field={index.toString()}
          header={index.toString()}
        />
      );
      index++;
      leftWidth -= WIDTH_PER_COLUMN;
    }
    if (columns.length !== cols.length) {
      setColumns(cols);
    }
  };

  const buildTableData = () => {
    if (columns.length === 0) return;

    const tableData = [];
    let rowObj = {};
    var colIndex = 0;
    for (let index = 0; index < data.length; index++) {
      colIndex = index % columns.length;
      if (colIndex === 0) {
        rowObj = {};
      }
      rowObj = {
        ...rowObj,
        [colIndex]: data[index],
      };
      if (colIndex === columns.length - 1) {
        tableData.push(rowObj);
      }
    }
    // add elements of an uncompleted row
    if (colIndex !== columns.length - 1) {
      tableData.push(rowObj);
    }
    setReceiveCount(data.length);
    setTableData(tableData);
    if (sticky) {
      virtualScroller?.scrollToIndex(virtualScroller?.getRenderedRange().last);
    }
  };

  const onEncodingChange = (e: { value: any; checked: boolean }) => {
    let _selectedEncodings = [...selectedEncodings];

    if (e.checked) {
      _selectedEncodings.push(e.value);
    } else {
      if (_selectedEncodings.length === 1) return;
      for (let i = 0; i < _selectedEncodings.length; i++) {
        if (_selectedEncodings[i].key === e.value.key) {
          _selectedEncodings.splice(i, 1);
          break;
        }
      }
    }
    setEncodings(_selectedEncodings);
  };

  const scroller = () => {
    if (
      virtualScroller?.getRenderedRange().viewport.last === tableData.length
    ) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  return (
    <div
      id="tableWrapper"
      ref={ref}
      className="h-full"
      style={{ paddingBottom: '50px' }}
    >
      <div className="p-checkbox h-2rem w-full">
        {encodings.map((encoding) => {
          return (
            <div key={encoding.key} className="field-checkbox mr-2 mt-2">
              <Checkbox
                inputId={encoding.key}
                name="category"
                value={encoding}
                onChange={onEncodingChange}
                checked={selectedEncodings.some(
                  (item: any) => item.key === encoding.key
                )}
              />
              <label htmlFor={encoding.key}>{encoding.name}</label>
            </div>
          );
        })}
        <div className="outputnumber absolute right-0" style={{marginTop: '-3px'}}>
          <label htmlFor="reaceivedcount">Rx</label>
          <InputNumber style={{height: '30px'}}
            inputId="reaceivedcount"
            readOnly={true} size={10}
            value={reaceiveCount}
          />
        </div>
      </div>
      <div className="h-full">
        <DataTable
          id={id}
          value={tableData}
          responsiveLayout="scroll"
          scrollable
          scrollHeight="flex"
          ref={dataTableRef}
          className={className}
          virtualScrollerOptions={{
            itemSize: 46,
            onScroll: scroller,
            showSpacer: false,
          }}
        >
          {columns}
        </DataTable>
      </div>
    </div>
  );
};

export default OutputDataTable;
