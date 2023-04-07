import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { IDefaultProps } from 'renderer/types/AppInterfaces';

interface IReadyParserSettingsProps extends IDefaultProps {
  delimiter: string;
  setDelimiter: Dispatch<SetStateAction<string>>;
}

const ReadyParserSettings: React.FC<IReadyParserSettingsProps> = ({
  id,
  className,
  delimiter,
  setDelimiter,
}) => {
  const { t } = useTranslation();

  return (
    <div id={id +":container"} className={className + ' field'}>
      <h4 className="label-h4 ">{t('READY_DELIMITER')}</h4>
      <InputText
        id="delimiter"
        name="delimiter"
        value={delimiter}
        onChange={(e) => setDelimiter(e.target.value)}
      />
    </div>
  );
};

export default ReadyParserSettings;
