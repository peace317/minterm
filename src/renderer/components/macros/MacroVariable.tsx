//import { Tooltip } from 'chart.js';
import { Button } from 'primereact/button';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { KeyFilterType } from 'primereact/keyfilter';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscTrash } from 'react-icons/vsc';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { Tooltip } from 'primereact/tooltip';
import { ConversionType, IDefaultProps, MacroVariableType } from '@minterm/types';
import { decimalToBinary, decimalToHex, typeToSelectList } from '@minterm/services';
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";

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
  onVariableChange = () => {return;},
  onVariableDelete = () => {return;},
}) => {
  const { t } = useTranslation();
  const [textValue, setTextValue] = useState<string>(variable.value);
  const [encoding, setEncoding] = useState<ConversionType>(variable.type);
  const [sliderValue, setSliderValue] = useState<number>(0);
  const [keyFilter, setKeyFilter] = useState<KeyFilterType>();
  const [minBoundary, setMinBoundary] = useState<number>();
  const [min, setMin] = useState<number | undefined>(variable.minValue);
  const [max, setMax] = useState<number | undefined>(variable.maxValue);

  useEffect(() => {
    determineSliderValue(variable.value);
    determineKeyFilter();
  }, []);

  useEffect(() => {
    variable.value = textValue;
    variable.type = encoding;
    variable.minValue = min;
    variable.maxValue = max;
    onVariableChange(variable);
  }, [textValue, encoding, min, max]);

  const getEncodings = () => {
    const selectList = typeToSelectList(ConversionType);
    return selectList.filter((e) => e.name !== ConversionType.ASCII);
  };

  const determineSliderValue = (value: string) => {
    switch (encoding) {
      case ConversionType.DEC:
        setSliderValue(Number(value));
        break;
      case ConversionType.BIN:
        setSliderValue(parseInt(value, 2));
        break;
      case ConversionType.HEX:
        setSliderValue(parseInt(value, 16));
        break;
      default:
        console.error(`Unhandled encoding type ${encoding}`);
    }
  };

  const determineTextValue = (value: string, pEncoding?: ConversionType): string => {
    const _encoding = pEncoding || encoding;
    switch (_encoding) {
      case ConversionType.DEC:
       return value;
      case ConversionType.BIN:
        return decimalToBinary(Number(value));
      case ConversionType.HEX:
        return decimalToHex(Number(value));
      default:
        console.error(`Unhandled encoding type ${_encoding}`);
    }
    return '';
  };

  const determineKeyFilter = (pEncoding?: ConversionType) => {
    const _encoding = pEncoding || encoding;
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
        console.error(`Unhandled encoding type ${_encoding}`);
    }
  };

  const onValueChange = (value: string) => {
    if (value === null) return;
    determineSliderValue(value);
    setTextValue(value.toString());
  };

  const onSliderValueChange = (e: SliderChangeEvent) => {
    const _textValue = determineTextValue(e.value.toString());
    setTextValue(_textValue);
    determineSliderValue(_textValue);
  };

  const onEncodingChange = (e: DropdownChangeEvent) => {
    setEncoding(e.target.value);
    determineKeyFilter(e.target.value);
    setTextValue(determineTextValue(sliderValue?.toString() || '0', e.target.value));
  };

  const onMinChange = (value: number | null) => {
    if (value === null) {
      setMin(undefined);
    } else {
      setMin(value);
    }
  };

  const onMaxChange = (value: number | null) => {
    if (value === null) {
      setMax(undefined);
    } else {
      setMax(value);
    }
  };

  return (
    <div id={`${id}:container`} className={className}>
      <h4 className="label-h4">Variable {variable.name}:</h4>
      <div id={`${id}:wrapper`} className="flex w-full">
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
          <Tooltip target={`[id='${id}:inputTooltipIcon']`} showDelay={500}>
            <div>
              {t('DECIMAL')}: {sliderValue} <br />
              {t('BINARY')}:{' '}
              {decimalToBinary(Number(sliderValue))} <br />
              {t('HEX')}: {decimalToHex(Number(sliderValue))}{' '}
              <br />
            </div>
          </Tooltip>
          <IconField iconPosition="right">
            <InputIcon  id={`${id}:inputTooltipIcon`} className="pi pi-info-circle inputValueField"></InputIcon>
            <InputText
              id={`${id}:inputtext`}
              value={textValue}
              keyfilter={keyFilter}
              onChange={(e) => onValueChange(e.target.value)}
            />
          </IconField>
          <Slider
            id={`${id}:slider`}
            value={sliderValue}
            min={min || 0}
            max={max || 100}
            onChange={(e) => onSliderValueChange(e)}
          />
        </div>
        <div className="w-full">
          <span className="p-float-label">
            <InputNumber
              id={`${id}:inputMin`}
              inputId={`${id}:inputMin`}
              value={min}
              min={minBoundary}
              onChange={(e) => onMinChange(e.value)}
              className="inputnumber-small mr-2"
            />
            <label htmlFor={`${id}:inputMin`}>Min</label>
          </span>
        </div>
        <div className="w-full">
          <span className="p-float-label">
            <InputNumber
              id={`${id}:inputMax`}
              inputId={`${id}:inputMax`}
              value={max}
              max={Number.MAX_SAFE_INTEGER}
              onChange={(e) => onMaxChange(e.value)}
              className="inputnumber-small mr-2"
            />
            <label htmlFor={`${id}:inputMax`}>Max</label>
          </span>
        </div>
        <div>
          <Button
            className="p-button-danger"
            visible={deletable}
            icon={<VscTrash className="p-button-icon-left" />}
            onClick={onVariableDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default MacroVariable;
