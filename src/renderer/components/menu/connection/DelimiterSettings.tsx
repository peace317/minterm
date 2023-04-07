import { InputText } from 'primereact/inputtext';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { InputSwitch } from 'primereact/inputswitch';
import { IDefaultProps } from 'renderer/types/AppInterfaces';

interface IDelimiterSettingsProps extends IDefaultProps {
  delimiter: string;
  setDelimiter: Dispatch<SetStateAction<string>>;
  includeDelimiter: boolean;
  setIncludeDelimiter: Dispatch<SetStateAction<boolean>>;
}

const DelimiterSettings: React.FC<IDelimiterSettingsProps> = ({
  id,
  className,
  delimiter,
  setDelimiter,
  includeDelimiter,
  setIncludeDelimiter,
}) => {
  const { t } = useTranslation();

  return (
    <div id={id +":container"} className={className}>
      <div className="field">
        <h4 className="label-h4">{t('DELIMITER')}</h4>
        <InputText
          id="delimiter"
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
        />
      </div>
      <div className="card">
        <h4 className="label-h4">{t('INCLUDE_DELIMITER')}</h4>
        <InputSwitch
          checked={includeDelimiter}
          onChange={(e) => setIncludeDelimiter(e.value)}
        />
      </div>
    </div>
  );
};

export default DelimiterSettings;
