import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IDefaultProps } from 'renderer/types/AppInterfaces';
import { Slider, SliderChangeParams } from 'primereact/slider';
import { MacroVariableType } from 'renderer/types/MacroVariableType';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { VscTrash } from 'react-icons/vsc';
import { InputNumber } from 'primereact/inputnumber';
import { FormatService } from 'renderer/services/FormatService';
import { Dropdown, DropdownChangeParams } from 'primereact/dropdown';
import { ConversionType } from 'renderer/types/ConversionType';
import { KeyFilterType } from 'primereact/keyfilter';
import { Tooltip } from 'primereact/tooltip';

interface IMacroVariableProps extends IDefaultProps {
  variable: MacroVariableType;
  deletable?: boolean;
  typeChangeable?: boolean;
  onVariableChange?(variable: MacroVariableType): void;
  onVariableDelete?(): void;
}

/**
 * Component for a macro variable. A variable is a single adjustable value
 * inside of a macro.
 *
 * @param IMacroVariableProps
 */
const MacroVariable: React.FC<IMacroVariableProps> = ({
  id,
  className,
  variable,
  deletable = true,
  typeChangeable = true,
  onVariableChange = () => {},
  onVariableDelete = () => {},
}) => {
  const { t } = useTranslation();
  const [textValue, setTextValue] = useState<string>(variable.value);
  const [valueChange, setValueChange] = useState<boolean>(false);
  const [encoding, setEncoding] = useState<ConversionType>(variable.type);
  const [sliderValue, setSliderValue] = useState<number>();
  const [keyFilter, setKeyFilter] = useState<KeyFilterType>();
  const [minBoundary, setMinBoundary] = useState<number>();
  const [min, setMin] = useState<number | undefined>(variable.minValue);
  const [max, setMax] = useState<number | undefined>(variable.maxValue);

  useEffect(() => {
    determineSliderValue();
    determineKeyFilter();
  }, []);

  useEffect(() => {
    variable.value = textValue;
    variable.type = encoding;
    variable.minValue = min;
    variable.maxValue = max;
    onVariableChange(variable);
    setValueChange(false);
  }, [valueChange, encoding, min, max]);

  const getEncodings = () => {
    var selectList = FormatService.typeToSelectList(ConversionType);
    return selectList.filter((e) => e.name !== ConversionType.ASCII);
  };

  const determineSliderValue = () => {
    switch (encoding) {
      case ConversionType.DEC:
        setSliderValue(Number(textValue));
        break;
      case ConversionType.BIN:
        setSliderValue(parseInt(textValue, 2));
        break;
      case ConversionType.HEX:
        setSliderValue(parseInt(textValue, 16));
        break;
      default:
        console.error('Unhandled encoding type ' + encoding);
    }
  };

  const determineTextValue = (value: string, pEncoding?: ConversionType) => {
    var _encoding = pEncoding || encoding;
    switch (_encoding) {
      case ConversionType.DEC:
        setTextValue(value);
        break;
      case ConversionType.BIN:
        setTextValue(FormatService.decimalToBinary(Number(value)));
        break;
      case ConversionType.HEX:
        setTextValue(FormatService.decimalToHex(Number(value)));
        break;
      default:
        console.error('Unhandled encoding type ' + _encoding);
    }
  };

  const determineKeyFilter = (pEncoding?: ConversionType) => {
    var _encoding = pEncoding || encoding;
    switch (_encoding) {
      case ConversionType.BIN:
        setKeyFilter(/[0-1]+/);
        setMinBoundary(0);
        break;
      case ConversionType.DEC:
        setKeyFilter('num');
        setMinBoundary(Number.MIN_SAFE_INTEGER);
        break;
      case ConversionType.HEX:
        setKeyFilter('hex');
        setMinBoundary(0);
        break;
      default:
        console.error('Unhandled encoding type ' + _encoding);
    }
  };

  const onValueChange = (value: string) => {
    if (value === null) return;
    determineSliderValue();
    setTextValue(value.toString());
    setValueChange(true);
  };

  const onSliderValueChange = (e: SliderChangeParams) => {
    determineTextValue(e.value.toString());
    determineSliderValue();
  };

  const onEncodingChange = (e: DropdownChangeParams) => {
    setEncoding(e.target.value);
    determineKeyFilter(e.target.value);
    determineTextValue(sliderValue?.toString() || '0', e.target.value);
    setValueChange(true);
  };

  const onMinChange = (value: number | null) => {
    console.log(value);
    if (value === null) {
      setMin(undefined);
      return;
    } else {
      setMin(value);
    }
  };

  const onMaxChange = (value: number | null) => {
    if (value === null) {
      setMax(undefined);
      return;
    } else {
      setMax(value);
    }
  };

  return (
    <div id={id + ':container'} className={className}>
      <h4 className="label-h4">Variable {variable.name}:</h4>
      <div id={':' + id + ':wrapper'} className="p-mention w-full">
        <div className="mr-2">
          <Dropdown
            id={id}
            value={encoding}
            disabled={!typeChangeable}
            options={getEncodings()}
            onChange={onEncodingChange}
            optionLabel="name"
            optionValue="key"
          />
        </div>
        <div className="mr-2 slider">
          <Tooltip target=".inputValueField" showDelay={500}>
            <div>
              {t('DECIMAL')}: {sliderValue} <br />
              {t('BINARY')}:{' '}
              {FormatService.decimalToBinary(Number(sliderValue))} <br />
              {t('HEX')}: {FormatService.decimalToHex(Number(sliderValue))}{' '}
              <br />
            </div>
          </Tooltip>
          <span className="p-input-icon-right">
            <i className="pi pi-info-circle inputValueField" />
            <InputText
              id={id + ':inputtext'}
              value={textValue}
              keyfilter={keyFilter}
              onChange={(e) => onValueChange(e.target.value)}
            />
          </span>
          <Slider
            id={id + ':slider'}
            value={sliderValue}
            min={min}
            max={max}
            onChange={(e) => onSliderValueChange(e)}
            onSlideEnd={(e) => onValueChange(textValue)}
          />
        </div>
        <div className="w-full">
          <span className="p-float-label">
            <InputNumber
              id={id + ':inputMin'}
              inputId={id + ':inputMin'}
              value={min}
              min={minBoundary}
              onChange={(e) => onMinChange(e.value)}
              className="inputnumber-small mr-2"
            />
            <label htmlFor={id + ':inputMin'}>Min</label>
          </span>
        </div>
        <div className="w-full">
          <span className="p-float-label">
            <InputNumber
              id={id + ':inputMax'}
              inputId={id + ':inputMax'}
              value={max}
              max={Number.MAX_SAFE_INTEGER}
              onChange={(e) => onMaxChange(e.value)}
              className="inputnumber-small mr-2"
            />
            <label htmlFor={id + ':inputMax'}>Max</label>
          </span>
        </div>
        <div>
          <Button
            className="p-button-danger"
            visible={deletable}
            icon={<VscTrash className="p-button-icon-left" />}
            onClick={(e) => onVariableDelete()}
          />
        </div>
      </div>
    </div>
  );
};

export default MacroVariable;
