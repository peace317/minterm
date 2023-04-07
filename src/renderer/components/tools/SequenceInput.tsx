import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { KeyFilterType } from 'primereact/keyfilter';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FormatService } from 'renderer/services/FormatService';
import { IDefaultProps } from 'renderer/types/AppInterfaces';
import { ConversionType } from 'renderer/types/ConversionType';

const encodings = FormatService.typeToSelectList(ConversionType);
interface ISequenceInputProps extends IDefaultProps {
  sequence: string;
  onSequenceChange: (value: string) => void;
  encoding: ConversionType;
  onEncodingChange: (encoding: ConversionType) => void;
}
/**
 * Component for an input field for a sequence.
 *
 * @param IDefaultProps
 */
const SequenceInput: React.FC<ISequenceInputProps> = ({
  id,
  className,
  sequence,
  onSequenceChange,
  encoding,
  onEncodingChange
}) => {
  const { t } = useTranslation();
  //const [sequence, setSequence] = useState<string>('');
  const [keyFilter, setKeyFilter] = useState<KeyFilterType>();
  const [blockChangeEncoding, setBlockChangeEncoding] = useState<boolean>(
    sequence.length > 0
  );
  /*const [selectedEncoding, setEncoding] = useState<ConversionType>(
    ConversionType.ASCII
  );*/

  const sequenceChange = (e: any) => {
    var str: string = e.target.value;
    setBlockChangeEncoding(str.length > 0);
    onSequenceChange(e.target.value);
  };

  const encodingChange = (e: any) => {
    var selectedEncoding = e.target.value as ConversionType;
    onEncodingChange(selectedEncoding);
    switch (selectedEncoding) {
      case ConversionType.ASCII:
        setKeyFilter(undefined);
        break;
      case ConversionType.BIN:
        setKeyFilter(/[0-1]+/);
        break;
      case ConversionType.DEC:
        setKeyFilter('num');
        break;
      case ConversionType.HEX:
        setKeyFilter('hex');
        break;
    }
  };

  return (
    <div id={id +":container"} className={className}>
      <div className="p-mention w-full">
        <div className="mr-3 mt-2">
          <label>{t('TYPE')}</label>
        </div>
        <div className="mr-2">
          <Dropdown
            id={id}
            value={encoding}
            disabled={blockChangeEncoding}
            options={encodings}
            onChange={encodingChange}
            optionLabel="name"
            optionValue="key"
            className=""
          />
        </div>
        <InputText
          placeholder={t('INPUT')}
          value={sequence}
          className="w-full"
          onChange={sequenceChange}
          keyfilter={keyFilter}
        />
      </div>
    </div>
  );
};

export default SequenceInput;
