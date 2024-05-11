import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { KeyFilterType } from 'primereact/keyfilter';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppendSequenceType, ConversionType, IDefaultProps, appendCommands } from '@minterm/types';
import { SerialPortService, typeToSelectList } from '@minterm/services';

const encodings = typeToSelectList(ConversionType);
interface ISequenceInputProps extends React.HTMLAttributes<HTMLDivElement> {
  sequence?: string;
  onSequenceChange?(value: string): void;
  encoding?: ConversionType;
  onEncodingChange?: React.Dispatch<React.SetStateAction<ConversionType>>;
  appendCommand?: AppendSequenceType;
  onAppendCommandChange?: React.Dispatch<
    React.SetStateAction<AppendSequenceType | undefined>
  >;
  sendButtonHidden?: boolean;
}
/**
 * Component for an input field for a sequence.
 *
 * @param ISequenceInputProps
 */
const SequenceInput: React.FC<ISequenceInputProps> = ({
  id,
  className,
  sequence,
  onSequenceChange = () => {},
  encoding,
  onEncodingChange = () => {},
  appendCommand,
  onAppendCommandChange = () => {},
  sendButtonHidden = false,
  ...props
}) => {
  const { t } = useTranslation();
  const [keyFilter, setKeyFilter] = useState<KeyFilterType>();
  const [userInput, setUserInput] = useState<string>(sequence || '');
  const [blockChangeEncoding, setBlockChangeEncoding] = useState<boolean>(
    userInput.length > 0
  );
  const [selectedEncoding, setEncoding] = useState<ConversionType>(
    encoding || ConversionType.ASCII
  );

  const [appendingSequence, setAppendingSequence] = useState<
    string | undefined
  >(appendCommand?.label);

  useEffect(() => {
    if (sequence !== undefined) {
      setBlockChangeEncoding(sequence.length > 0);
      setUserInput(sequence);
    }
  }, [sequence]);

  useEffect(() => {
    setBlockChangeEncoding(userInput.length > 0);
    onSequenceChange(userInput);
  }, [userInput]);

  const encodingChange = (e: any) => {
    const _selectedEncoding = e.target.value as ConversionType;
    setEncoding(_selectedEncoding);
    onEncodingChange(_selectedEncoding);
    switch (_selectedEncoding) {
      case ConversionType.ASCII:
        setKeyFilter(undefined);
        break;
      case ConversionType.BIN:
        setKeyFilter(/[0-1]+/);
        break;
      case ConversionType.DEC:
        setKeyFilter('pint');
        break;
      case ConversionType.HEX:
        setKeyFilter('hex');
        break;
    }
  };

  const appendSequenceChange = (e: any) => {
    setAppendingSequence(e.target.value);
    const command = appendCommands.find((i) => i.label === e.target.value);
    if (command !== undefined) onAppendCommandChange(command);
  };

  const onSend = () => {
    let message = userInput;
    if (appendingSequence !== undefined) {
      message += appendCommands.find(
        (e) => e.label === appendingSequence
      )?.command;
    }
    SerialPortService.sendMessage(message, selectedEncoding);
  };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter' && !sendButtonHidden) {
      onSend();
    }
  };

  return (
    <div id={`${id}:container`} className={className} {...props}>
      <div className="flex w-full">
        <div className="mr-2 mt-2">
          <label>{t('TYPE')}</label>
        </div>
        <div className="mr-2">
          <Dropdown
            id={id}
            value={selectedEncoding}
            disabled={blockChangeEncoding}
            options={encodings}
            onChange={encodingChange}
            optionLabel="name"
            optionValue="key"
            className=""
          />
        </div>
        <div className="mr-2 w-full p-inputgroup flex-1">
          <InputText
            placeholder={t('INPUT')}
            className="w-full"
            value={userInput}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
            keyfilter={keyFilter}
          />
          <Button icon="pi pi-times" disabled={userInput.length === 0} className="p-button-secondary" onClick={() => setUserInput('')} />
        </div>
        <div className="mr-2">
          <Dropdown
            id={id}
            placeholder={t('SEND_WITH')}
            value={appendingSequence}
            options={appendCommands}
            onChange={appendSequenceChange}
            optionLabel="label"
            optionValue="label"
          />
        </div>
        <div hidden={sendButtonHidden}>
          <Button label={t('SEND')} onClick={(e) => onSend()} />
        </div>
      </div>
    </div>
  );
};

export default SequenceInput;
