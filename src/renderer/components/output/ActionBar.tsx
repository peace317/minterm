import { Button } from "primereact/button";
import { Checkbox, CheckboxChangeEvent } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { Tooltip } from "primereact/tooltip";
import React from "react";
import { useTranslation } from "react-i18next";
import { ConversionType, DataPointType } from "@minterm/types";
import ButtonClear from "../tools/ButtonClear";
import { typeToSelectList } from "@minterm/services";
import clsx from "clsx";

export interface ActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  data?: Array<DataPointType>;
  setData?: React.Dispatch<React.SetStateAction<unknown[]>>;
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
 * @param ActionBarProps
 */
const ActionBar: React.FC<ActionBarProps> = ({
  id,
  data = [],
  setData = () => {
    return;
  },
  dataCounterHidden = true,
  selectedConversions = [],
  setSelectedConversions = () => {
    return;
  },
  conversionsDisabled = true,
  conversionsHidden = true,
  dataCountLabel = "",
  clearButtonHidden = true,
  clearButtonToolTip = "",
  saveButtonHidden = true,
  onSave = () => {
    return;
  },
  ...props
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
    <div
      id={`${id}:container`}
      className={clsx("flex mb-2", props.className)}
      {...props}
    >
      <div id={`${id}:checkboxContainer`} className="flex align-items-center">
        {!conversionsHidden &&
          encodings.map((encoding) => {
            return (
              <div key={encoding.key} className="field-checkbox m-0 mr-2">
                <Checkbox
                  inputId={encoding.key as string}
                  name="category"
                  value={encoding}
                  onChange={onEncodingChange}
                  disabled={conversionsDisabled}
                  checked={selectedConversions.includes(
                    encoding.key as ConversionType
                  )}
                />
                <label htmlFor={encoding.key as string}>{encoding.name}</label>
              </div>
            );
          })}
        <Tooltip
          target=".noConversionTooltip"
          position="bottom"
          showDelay={500}
        >
          <div>{t("NO_CONVERSION_POSSIBLE")}</div>
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
          label={t("SAVE")}
          onClick={onSave}
        />
      </div>
      <div className="outputnumber-small w-full flex justify-content-end">
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
  );
};

export default ActionBar;
