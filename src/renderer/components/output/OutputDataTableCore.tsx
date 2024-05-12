/* eslint-disable @typescript-eslint/no-explicit-any */
import { Column } from 'primereact/column';
import { DataTable, DataTableSelectionMultipleChangeEvent } from 'primereact/datatable';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useResizeDetector } from 'react-resize-detector';
import { ConversionType, DataPointType } from '@minterm/types';
import ActionBar, { IActionBarProps } from './ActionBar';

interface IOutputDataTableCoreProps extends IActionBarProps {
  data: Array<DataPointType>;
  setData?: React.Dispatch<React.SetStateAction<any[]>>;
  width?: number;
  selectedCells?: Array<any>;
  setSelectedCells?: React.Dispatch<React.SetStateAction<any[]>>;
}

/**
 * Builds the content for a cell with the selected conversion.
 *
 * @param data  data
 */
export const buildCell = (
  data: DataPointType,
  selectedEncodings: Array<ConversionType>
) => {
  return (
    <div>
      {selectedEncodings.includes(ConversionType.ASCII) && (
        <>
          {JSON.stringify(data.value)
            .substring(1)
            .substring(0, JSON.stringify(data.value).length - 2)}
          <br />
        </>
      )}
      {selectedEncodings.includes(ConversionType.DEC) && (
        <>
          {data.valueAsDec}
          <br />
        </>
      )}
      {selectedEncodings.includes(ConversionType.BIN) && (
        <>
          {data.valueAsBin}
          <br />
        </>
      )}
      {selectedEncodings.includes(ConversionType.HEX) && (
        <>
          {data.valueAsHex}
          <br />
        </>
      )}
    </div>
  );
};

const OutputDataTableCore: React.FC<IOutputDataTableCoreProps> = ({
  id,
  className,
  data,
  setData = () => {return;},
  width: initialWidth,
  conversionsDisabled = false,
  conversionsHidden = false,
  dataCountLabel = '',
  clearButtonToolTip = '',
  selectedCells = [],
  setSelectedCells = () => {return;},
}) => {
  const WIDTH_PER_COLUMN = 100;
  const [colHeight, setColHeight] = useState<number>(0);
  const [tableData, setTableData] = useState<any>([]);
  const [sticky, setSticky] = useState<boolean>(true);
  const dataTableRef = useRef<DataTable<any>>(null);
  const [selectedConversions, setConversions] = useState<Array<ConversionType>>(
    [ConversionType.ASCII]
  );
  const [columns, setColumns] = useState<any>([
    <Column key="0" field="0" header="0" />,
  ]);
  const { width, ref } = useResizeDetector({
    onResize: () => {
      // buildColumns();
    },
  });
  const virtualScroller = dataTableRef.current?.getVirtualScroller();

  useLayoutEffect(() => {
    if (width === undefined) {
      // setInitWidth(ref.current.offsetWidth);
    }
    // const body = ref.current.getElementsByClassName('p-datatable-tbody')[0];
    // body.style.top = '50px';
  }, []);

  useEffect(() => {
    // buildTableData();
    setColHeight(37 + (selectedConversions.length - 1) * 21);
  }, [columns, selectedConversions]);

  useEffect(() => {
    // buildColumns();
  }, [ref]);

  useEffect(() => {
    // buildTableData();
  }, [data]);

  useEffect(() => {
    if (!conversionsDisabled) {
      setConversions([ConversionType.ASCII]);
    }
  }, [conversionsDisabled]);

  const buildColumns = () => {
    let leftWidth: number = initialWidth || ref.current.offsetWidth;
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

    const tData = [];
    let rowObj = {};
    let colIndex = 0;
    for (let index = 0; index < data.length; index++) {
      colIndex = index % columns.length;
      if (colIndex === 0) {
        rowObj = {};
      }
      // The row object is made of an row id, that is needed for cell selection
      // and the value. The name of the value is the corresponding index of the column.
      rowObj = {
        ...rowObj,
        id: tData.length,
        colLength: columns.length,
        [colIndex]: buildCell(data[index], selectedConversions),
      };
      if (colIndex === columns.length - 1) {
        tData.push(rowObj);
      }
    }
    // add elements of an uncompleted row
    if (colIndex !== columns.length - 1) {
      tData.push(rowObj);
    }
    setTableData(tData);
    if (sticky) {
      virtualScroller?.scrollToIndex(virtualScroller?.getRenderedRange().last);
    }
  };

  /**
   * Listener on the virtual scroller. If the scroller hits the bottom
   * of the view range sticky mode is activated for auto scrolling.
   *
   * Sticky mode is deactivated when scrolling up again.
   */
  const scroller = () => {
    if (
      virtualScroller != undefined &&
      virtualScroller.getRenderedRange().viewport.last >= tableData.length
    ) {
      setSticky(true);
    } else {
      setSticky(false);
    }
  };

  /**
   * Handles a cell selection event. Empty cells with an undefined value can not
   * be selected. If the same selection of cells are reselected again, the selection
   * will be removed.
   *
   * @param e selection
   */
  const onSelectionChange = (e: DataTableSelectionMultipleChangeEvent<Array<any>>) => {
    const selectedSameCells =
      selectedCells.length === e.value.length &&
      selectedCells.every(
        (value: any, index: any) =>
          value.cellIndex === e.value[index].cellIndex &&
          value.rowIndex === e.value[index].rowIndex
      );

    e.value = e.value.filter(
      (a: any) => a.value !== null && a.value !== undefined
    );
    if (!selectedSameCells) {
      setSelectedCells(e.value);
    } else {
      setSelectedCells([]);
    }
  };

  return (
    <div
      id={`${id}:container`}
      ref={ref}
      className={`${className} h-full`}
      style={{ paddingBottom: '50px' }}
    >
      <ActionBar
        id={`${id}:outputActionBar`}
        data={data}
        setData={setData}
        dataCountLabel={dataCountLabel}
        dataCounterHidden={false}
        clearButtonHidden={false}
        clearButtonToolTip={clearButtonToolTip}
        conversionsDisabled={conversionsDisabled}
        conversionsHidden={conversionsHidden}
        selectedConversions={selectedConversions}
        setSelectedConversions={setConversions}
      />
      <div className="h-full datatable">
        <DataTable
          id={id}
          value={tableData}
          responsiveLayout="scroll"
          scrollable
          stripedRows
          selectionMode="multiple"
          cellSelection
          dragSelection
          selection={selectedCells}
          onSelectionChange={onSelectionChange}
          dataKey="id"
          scrollHeight="flex"
          ref={dataTableRef}
          className={className}
          virtualScrollerOptions={{
            itemSize: colHeight,
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

export default OutputDataTableCore;
