import { Button } from 'primereact/button';
import { Checkbox, CheckboxChangeEvent } from 'primereact/checkbox';
import { InputNumber } from 'primereact/inputnumber';
import { Tooltip } from 'primereact/tooltip';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConversionType, DataPointType, IDefaultProps } from '@minterm/types';
import ButtonClear from '../tools/ButtonClear';
import { typeToSelectList } from '@minterm/services';

export interface IActionBarProps extends IDefaultProps {
  data?: Array<DataPointType>;
  setData?: React.Dispatch<React.SetStateAction<any[]>>;
  dataCounterHidden?: boolean;
  dataCountLabel?: string;
  selectedConversions?: ConversionType[];
  setSelectedConversions?: React.Dispatch<
    React.SetStateAction<ConversionType[]>
  >;
  conversionsDisabled?: boolean;
  conversionsHidden?: boolean;
  clearButtonHidden?: boolean;
  clearButtonToolTip?: string;
  saveButtonHidden?: boolean;
  onSave?: () => void;
}

/**
 * Component for displaying action items that can be used by
 * outputting components. Therefore certain settings/actions will be displayed
 * equally when reusing this component.
 *
 * @param IActionBarProps
 */
const ActionBar: React.FC<IActionBarProps> = ({
  id,
  className,
  data = [],
  setData = () => {return;},
  dataCounterHidden = true,
  selectedConversions = [],
  setSelectedConversions = () => {return;},
  conversionsDisabled = true,
  conversionsHidden = true,
  dataCountLabel = '',
  clearButtonHidden = true,
  clearButtonToolTip = '',
  saveButtonHidden = true,
  onSave = () => {return;},
}) => {
  const { t } = useTranslation();

  const encodings = typeToSelectList(ConversionType);

  const onEncodingChange = (e: CheckboxChangeEvent) => {
    const _selectedEncodings = [...selectedConversions];
    if (e.checked) {
      _selectedEncodings.push(e.value.key);
    } else {
      if (_selectedEncodings.length === 1) return;
      for (let i = 0; i < _selectedEncodings.length; i++) {
        if (_selectedEncodings[i] === e.value.key) {
          _selectedEncodings.splice(i, 1);
          break;
        }
      }
    }
    setSelectedConversions(_selectedEncodings);
  };

  return (
    <div id={`${id}:container`} className={className}>
      <div className="p-checkbox h-2rem w-full" style={{ cursor: 'unset' }}>
        <div className="p-checkbox h-2rem">
          {!conversionsHidden &&
            encodings.map((encoding) => {
              return (
                <div key={encoding.key} className="field-checkbox mr-2 mt-2">
                  <Checkbox
                    inputId={encoding.key}
                    name="category"
                    value={encoding}
                    onChange={onEncodingChange}
                    disabled={conversionsDisabled}
                    checked={selectedConversions.includes(encoding.key)}
                  />
                  <label htmlFor={encoding.key}>{encoding.name}</label>
                </div>
              );
            })}
          <Tooltip
            target=".noConversionTooltip"
            position="bottom"
            showDelay={500}
          >
            <div>{t('NO_CONVERSION_POSSIBLE')}</div>
          </Tooltip>
          <span
            className="pl-1"
            hidden={!conversionsDisabled || conversionsHidden}
          >
            <i className="pi pi-info-circle noConversionTooltip" />
          </span>
        </div>
        <div className="action-button h-2rem" hidden={saveButtonHidden}>
          <Button
            type="button"
            icon="pi pi-image"
            label={t('SAVE')}
            onClick={onSave}
          />
        </div>
        <div className="outputnumber-small absolute right-0">
          <div hidden={dataCounterHidden}>
            <label htmlFor="receiveCount">{dataCountLabel}</label>
            <InputNumber
              id={`${id}:inputNumber`}
              inputId="receiveCount"
              readOnly
              size={10}
              value={data.length}
            />
          </div>
          <div hidden={clearButtonHidden}>
            <ButtonClear
              id="btnClear"
              className="ml-2 button-icon-only"
              clearObject={setData}
              toolTip={clearButtonToolTip}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionBar;
