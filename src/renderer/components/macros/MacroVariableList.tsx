import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IDefaultProps } from 'renderer/types/AppInterfaces';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Slider, SliderChangeParams } from 'primereact/slider';
import { MacroVariableType } from 'renderer/types/MacroVariableType';
import { InputText } from 'primereact/inputtext';
import MacroVariable from './MacroVariable';

interface IMacroVariableProps extends IDefaultProps {
  variables: MacroVariableType[];
  deletable?: boolean;
  typeChangeable?: boolean;
  onVariableChange?(variable: MacroVariableType): void;
  onVariableDelete?(variable: MacroVariableType): void;
}

/**
 * Component for displaying a list of macro variables.
 *
 * @param IMacroVariableProps
 */
const MacroVariableList: React.FC<IMacroVariableProps> = ({
  id,
  className,
  variables,
  deletable = true,
  typeChangeable,
  onVariableChange = () => {},
  onVariableDelete = () => {}
}) => {
  const { t } = useTranslation();

  return (
    <div id={id +":container"} className={className}>
      {variables.map((variable) => {
        return (
          <div key={variable.name}>
            <MacroVariable
              id={':' + id + ':' + variable.name}
              variable={variable}
              deletable={deletable}
              typeChangeable={typeChangeable}
              onVariableChange={onVariableChange}
              onVariableDelete={() => onVariableDelete(variable)}
            ></MacroVariable>
          </div>
        );
      })}
    </div>
  );
};

export default MacroVariableList;
