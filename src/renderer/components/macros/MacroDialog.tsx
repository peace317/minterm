import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TfiPlus } from 'react-icons/tfi';
import { MacroService } from 'renderer/services/MacroService';
import { IDefaultProps } from 'renderer/types/AppInterfaces';
import { AppendSequenceType } from 'renderer/types/AppendSequenceType';
import { ConversionType } from 'renderer/types/ConversionType';
import { MacroDataType } from 'renderer/types/MacroDataType';
import { MacroVariableType } from 'renderer/types/MacroVariableType';
import { ITreeNode } from 'renderer/types/TreeNodeType';
import SequenceInput from '../SequenceInput';
import MacroVariableList from './MacroVariableList';

interface IMacroDialogProps extends IDefaultProps {
  display: boolean;
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  onAddMacro: (macro: MacroDataType) => void;
  onEditMacro: (macro: MacroDataType) => void;
  editMacro?: MacroDataType;
  setEditMacro?: React.Dispatch<React.SetStateAction<ITreeNode | undefined>>;
}

/**
 * Component for a dialog that displays settings for a macro. This can either be
 * a new macro or an already created macro for editing.
 *
 * @param IMacroDialogProps
 */
const MacroDialog: React.FC<IMacroDialogProps> = ({
  id,
  className,
  display,
  setDisplay,
  onAddMacro,
  onEditMacro,
  editMacro,
  setEditMacro = () => {},
}) => {
  const { t } = useTranslation();
  const [sequenceName, setSequenceName] = useState<string>(t('NEW_SEQUENCE'));
  const [description, setDescription] = useState<string>();
  const [sequence, setSequence] = useState<string>('');
  const [variables, setVariables] = useState<Array<MacroVariableType>>([]);
  const [selectedEncoding, setEncoding] = useState<ConversionType>(
    ConversionType.ASCII
  );
  const [appendSequence, setAppendSequence] = useState<
    AppendSequenceType | undefined
  >();

  useEffect(() => {
    if (editMacro !== undefined && editMacro !== null) {
      setSequenceName(editMacro.name);
      setDescription(editMacro.description);
      setSequence(editMacro.sequence);
      setAppendSequence(editMacro.appendSequence);
      setEncoding(editMacro.sequenceFormat);
      setVariables(JSON.parse(JSON.stringify(editMacro.variables)));
    }
  }, [display]);

  const onHide = () => {
    setDisplay(false);
    reset();
  };

  const onAccept = () => {
    var macro: MacroDataType = {
      name: sequenceName,
      description: description,
      sequence: sequence,
      sequenceFormat: selectedEncoding,
      appendSequence: appendSequence,
      variables: variables,
    };
    if (editMacro !== undefined && editMacro !== null) {
      onEditMacro(macro);
    } else {
      onAddMacro(macro);
    }
    onHide();
  };

  /**
   * Resets the state of the macro.
   */
  const reset = () => {
    setSequenceName(t('NEW_SEQUENCE'));
    setDescription('');
    setSequence('');
    setEncoding(ConversionType.ASCII);
    setEditMacro(undefined);
    setVariables([]);
    setAppendSequence(undefined);
  };

  /**
   * If a new variable shall be added, a service will be called. If the amount
   * of variables reached a limit, the variable will not be added. The new variable
   * is then included at the end of the sequence.
   */
  const addVariable = () => {
    var newVar = MacroService.createNewVariable(sequence, getEncoding());
    if (newVar == undefined) return;
    var newSequence = MacroService.addVariableToSequence(sequence, newVar);
    setSequence(newSequence);
    setVariables([...variables, newVar]);
  };

  /**
   * Called on a change of the sequence. If variables were deleted or added,
   * a rebalancing will take place.
   *
   * @param value new sequence
   */
  const onSequenceChange = (value: string) => {
    setVariables(MacroService.rebalanceVars(value, getEncoding(), variables));
    setSequence(value);
  };

  /**
   * Called on a change in the macro variable list to exchange the
   * corresponging value in this list.
   *
   * @param variable changed varaible
   */
  const onVariableChange = (variable: MacroVariableType) => {
    var current: MacroVariableType | undefined = variables.filter(
      (e) => e.name === variable.name
    )[0];
    if (current === undefined)
      console.error('Variable `' + variable.name + '` not found.');
    current = variable;
  };

  /**
   * Determines the conversion type of macro variables depending of the
   * selected encoding of the sequence.
   *
   * @returns conversion type
   */
  const getEncoding = (): ConversionType => {
    switch (selectedEncoding) {
      case ConversionType.ASCII:
      case ConversionType.DEC:
        return ConversionType.DEC;
      case ConversionType.BIN:
        return ConversionType.BIN;
      case ConversionType.HEX:
        return ConversionType.HEX;
      default:
        console.error(
          'Unhandled conversion type for variable encoding ' + selectedEncoding
        );
        return ConversionType.DEC;
    }
  };

  const onVariableDelete = (variable: MacroVariableType) => {
    setVariables(variables.filter((e) => e.name !== variable.name));
    setSequence(MacroService.removeVariableFromSequence(sequence, variable));
  };

  const renderFooter = () => {
    return (
      <div className="mt-2">
        <Button
          label={t('CLOSE')}
          icon="pi pi-times"
          onClick={() => onHide()}
          className="p-button-text"
        />
        <Button label={t('SAVE')} onClick={() => onAccept()} autoFocus />
      </div>
    );
  };

  const getHeaderName = () => {
    if (editMacro !== undefined && editMacro !== null) return t('EDIT_MACRO');
    return t('NEW_MACRO');
  };

  return (
    <div id={id + ':container'} className={className}>
      <Dialog
        id={id}
        header={getHeaderName}
        visible={display}
        onHide={() => onHide()}
        footer={renderFooter()}
        style={{ width: '40rem' }}
        resizable={true}
      >
        <div className="card">
          <div className="field">
            <h4 className="label-h4">{t('SEQUENCE_NAME')}</h4>
            <InputText
              id="name"
              className="w-full"
              maxLength={32}
              value={sequenceName}
              onChange={(e) => setSequenceName(e.target.value)}
            />
          </div>
          <div className="field">
            <h4 className="label-h4">{t('DESCRIPTION')}</h4>
            <InputTextarea
              id="description"
              value={description}
              className="h-full w-full"
              style={{ resize: 'none' }}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="field">
            <h4 className="label-h4">{t('SEQUENCE')}</h4>
            <div className="p-mention w-full">
              <SequenceInput
                id="sequenceInput"
                className="w-full"
                sequence={sequence}
                onSequenceChange={onSequenceChange}
                encoding={selectedEncoding}
                onEncodingChange={setEncoding}
                appendCommand={appendSequence}
                onAppendCommandChange={setAppendSequence}
                sendButtonHidden={true}
              />
              <Button
                tooltip={t('ADD_VARIABLE')}
                tooltipOptions={{ showDelay: 500 }}
                onClick={addVariable}
                icon={<TfiPlus className="pi" />}
              />
            </div>
          </div>
          <div>
            <MacroVariableList
              id={':' + id + ':variableList'}
              variables={variables}
              typeChangeable={selectedEncoding === ConversionType.ASCII}
              onVariableChange={onVariableChange}
              onVariableDelete={onVariableDelete}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default MacroDialog;
