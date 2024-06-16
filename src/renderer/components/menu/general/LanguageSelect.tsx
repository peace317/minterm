import i18n from 'i18next';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { IDefaultProps, SelectValue } from '@minterm/types';

interface ILanguageSelectProps extends IDefaultProps {
  selectedLanguage: string;
  onLanguageChange: (event: DropdownChangeEvent) => void;
}

const LanguageSelect: React.FC<ILanguageSelectProps> = ({
  id,
  className,
  selectedLanguage,
  onLanguageChange,
}) => {
  const { t } = useTranslation();
  const languages: Array<SelectValue> = i18n.languages.map((e) => ({
    name: t(e.toUpperCase()),
    key: e,
  }));

  return (
    <div id={`${id}:container`} className={`${className} dropdown`}>
      <Dropdown
        id={id}
        value={selectedLanguage}
        optionLabel="name"
        optionValue="key"
        options={languages}
        onChange={onLanguageChange}
      />
    </div>
  );
};

export default LanguageSelect;
