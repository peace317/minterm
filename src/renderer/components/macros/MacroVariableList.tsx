import { IDefaultProps, MacroVariableType } from '@minterm/types';
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
  onVariableDelete = () => {},
}) => {
  return (
    <div id={`${id}:container`} className={className}>
      {variables.map((variable) => {
        return (
          <div key={variable.name}>
            <MacroVariable
              id={`:${id}:${variable.name}`}
              variable={variable}
              deletable={deletable}
              typeChangeable={typeChangeable}
              onVariableChange={onVariableChange}
              onVariableDelete={() => onVariableDelete(variable)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default MacroVariableList;
