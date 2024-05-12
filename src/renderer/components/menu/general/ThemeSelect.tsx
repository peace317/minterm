import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import React from 'react';
import { IDefaultProps } from '@minterm/types';

interface IThemeSelectProps extends IDefaultProps {
  selectedTheme: string;
  onThemeChange: (event: DropdownChangeEvent) => void;
}

export const themes = [
  { name: 'Dark', code: 'dark'},
  { name: 'Light', code: 'light' },
  { name: 'System', code: 'system' }
];

const ThemeSelect: React.FC<IThemeSelectProps> = ({
  id,
  className,
  selectedTheme,
  onThemeChange,
}) => {

  return (
    <div id={`${id}:container`} className={`${className} dropdown`}>
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
