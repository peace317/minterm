import { InputNumber } from 'primereact/inputnumber';
import { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { IDefaultProps } from '@minterm/types';

interface IByteLengthSettingsProps extends IDefaultProps {
  length: number;
  setLength: Dispatch<SetStateAction<number>>;
}

const ByteLengthSettings: React.FC<IByteLengthSettingsProps> = ({
  id,
  className,
  length,
  setLength,
}) => {
  const { t } = useTranslation();

  return (
    <div id={`${id}:container`} className={`${className} field`}>
      <h4 className="label-h4 ">{t('BYTE_LENGTH')}</h4>
      <InputNumber
        id={id}
        inputId="integeronly"
        value={length}
        onValueChange={(e: any) => setLength(e.value)}
      />
    </div>
  );
};

export default ByteLengthSettings;
