import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { useTranslation } from 'react-i18next';
import { StoreKey } from 'renderer/types';

interface IThemeSelectProps {
  id: string;
  className?: string;
  selectedTheme: string;
  onThemeChange: React.Dispatch<any>
}

const themes = [
  { name: 'Saga Blue', code: 'theme-saga-blue' },
  { name: 'Dark Purple', code: 'theme-bootstrap4-dark-purple' },
  { name: 'Light Purple', code: 'theme-bootstrap4-light-purple' },
  { name: 'Dark Indigo', code: 'theme-md-dark-indigo' },
];

const ThemeSelect: React.FC<IThemeSelectProps> = ({ id, className, selectedTheme, onThemeChange }) => {
  const { t } = useTranslation();

  return (
    <div className="dropdown">
      <Dropdown
        id={id}
        value={selectedTheme}
        optionValue="code"
        options={themes}
        onChange={onThemeChange}
        optionLabel="name"
      />
    </div>
  );
};

export default ThemeSelect;
