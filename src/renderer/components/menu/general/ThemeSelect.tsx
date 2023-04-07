import React from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { IDefaultProps } from 'renderer/types/AppInterfaces';

interface IThemeSelectProps extends IDefaultProps {
  selectedTheme: string;
  onThemeChange: React.Dispatch<any>;
}

export const themes = [
  { name: 'Saga Blue', code: 'theme-saga-blue', theme: 'light' },
  { name: 'Dark Purple', code: 'theme-bootstrap4-dark-purple', theme: 'dark' },
  {
    name: 'Light Purple',
    code: 'theme-bootstrap4-light-purple',
    theme: 'light',
  },
  { name: 'Dark Indigo', code: 'theme-md-dark-indigo', theme: 'dark' },
];

const ThemeSelect: React.FC<IThemeSelectProps> = ({
  id,
  className,
  selectedTheme,
  onThemeChange,
}) => {
  const { t } = useTranslation();

  return (
    <div id={id +":container"} className={className + ' dropdown'}>
      <Dropdown
        id={id}
        value={selectedTheme}
        options={themes}
        onChange={onThemeChange}
        optionLabel="name"
        optionValue="code"
      />
    </div>
  );
};

export default ThemeSelect;
