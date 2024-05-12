import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IDefaultProps, EncodingType } from '@minterm/types';
import { typeToSelectList } from '@minterm/services';

interface IRegexSettingsProps extends IDefaultProps {
  regex: string;
  setRegex: Dispatch<SetStateAction<string>>;
  bufferEncoding?: EncodingType;
  onBufferEncodingChange?: React.Dispatch<DropdownChangeEvent>;
}

const encodingTypes = typeToSelectList(EncodingType);

const RegexSettings: React.FC<IRegexSettingsProps> = ({
  id,
  className,
  regex,
  setRegex,
  bufferEncoding,
  onBufferEncodingChange,
}) => {
  const [testInput, setTestInput] = useState<string>('');
  const { t } = useTranslation();

  const isRegexValid = () => {
    try {
      new RegExp(regex);
      return true;
    } catch (e) {
      return false;
    }
  };

  const getFormErrorMessage = () => {
    return (
      !isRegexValid() && (
        <small className="p-error">{t('INVALID_EXPRESSION')}</small>
      )
    );
  };

  const getExecutedRegex = () => {
    return (
      isRegexValid() &&
      testInput.length !== 0 && (
        <small className="mr-2 p-info">
          {new RegExp(regex).exec(testInput)}
        </small>
      )
    );
  };

  return (
    <div id={`${id}:container`} className={`${className} card`}>
      <div className="grid">
        <div className="col-6">
          <h4 className="label-h4 ">{t('REGEX')}</h4>
          <InputText
            id="regex"
            name="regex"
            value={regex}
            onChange={(e) => setRegex(e.target.value)}
            className={`${classNames({ 'p-invalid': !isRegexValid() })}`}
          />
          <div className="field">{getFormErrorMessage()}</div>
        </div>
        <div className="col-6">
          <h4 className="label-h4">{t('TEST_INPUT')}</h4>
          <InputText
            id="testInput"
            name="testInput"
            value={testInput}
            onChange={(e) => setTestInput(e.target.value)}
          />
          <div className="field">{getExecutedRegex()}</div>
        </div>
      </div>
      {bufferEncoding !== undefined && (
        <div className="grid">
          <div className="col-6 dropdown">
            <h4 className="label-h4">{t('ENCODING')}</h4>
            <Dropdown
              id={id}
              value={bufferEncoding}
              options={encodingTypes}
              onChange={onBufferEncodingChange}
              optionLabel="name"
              optionValue="key"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RegexSettings;
