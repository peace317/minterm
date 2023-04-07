import { ContextMenu } from 'primereact/contextmenu';
import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { DataPointType } from 'renderer/types/DataPointType';

interface IContextMenuOutputProps {
  selectedCells: Array<any>;
  onContextMenu: React.MouseEvent<HTMLDivElement, MouseEvent>;
  data: Array<DataPointType>;
}

const ContextMenuOutput: React.FC<IContextMenuOutputProps> = ({
  data,
  selectedCells,
  onContextMenu,
}) => {
  const cm = useRef<any>(null);
  const { t } = useTranslation();

  const items = [
    {
      label: t('COPY_AS_ASCII'),
      command: () => {
        if (selectedCells.length === 0) {
          navigator.clipboard.writeText(data.map((d) => d.value).join(''));
        } else {
          navigator.clipboard.writeText(
            getSelectedValues()
              .map((d) => d.value)
              .join('')
          );
        }
      },
    },
    {
      label: t('COPY_AS_BIN'),
      command: () => {
        if (selectedCells.length === 0) {
          navigator.clipboard.writeText(data.map((d) => d.valueAsBin).join(''));
        } else {
          navigator.clipboard.writeText(
            getSelectedValues()
              .map((d) => d.valueAsBin)
              .join('')
          );
        }
      },
    },
    {
      label: t('COPY_AS_DEC'),
      command: () => {
        if (selectedCells.length === 0) {
          navigator.clipboard.writeText(data.map((d) => d.valueAsDec).join(''));
        } else {
          navigator.clipboard.writeText(
            getSelectedValues()
              .map((d) => d.valueAsDec)
              .join('')
          );
        }
      },
    },
    {
      label: t('COPY_AS_HEX'),
      command: () => {
        if (selectedCells.length === 0) {
          navigator.clipboard.writeText(data.map((d) => d.valueAsHex).join(''));
        } else {
          navigator.clipboard.writeText(
            getSelectedValues()
              .map((d) => d.valueAsHex)
              .join('')
          );
        }
      },
    },
  ];

  useEffect(() => {
    if (cm.current !== null && onContextMenu !== undefined)
      cm.current.show(onContextMenu);
  }, [onContextMenu]);

  /**
   * Calculates the indices out of the selected cells and maps these indices on the
   * data array to retrieve an array of the original data points.
   * The selection may not be ordered and thus the data array may not be in order!
   *
   * @returns array of data points of the selected cells
   */
  const getSelectedValues = () => {
    var dataIndices = selectedCells.map((e) => {
      // mapping the 2d table to 1d indices
      return e.rowIndex * e.rowData.colLength + e.cellIndex;
    });
    return dataIndices.map((e) => data[e]);
  };

  return <ContextMenu model={items} ref={cm} autoZIndex></ContextMenu>;
};

export default ContextMenuOutput;
