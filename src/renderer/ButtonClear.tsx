import React, { useContext } from "react";
import { Button } from 'primereact/button';
import { useTranslation } from 'react-i18next';
import { Context } from './context';

const ButtonClear: React.FC<{id: string, className?: string}> = ({id, className}) => {

    const { t } = useTranslation();
    const context = useContext(Context);

    const onClear = () => {
      context.setData([]);
    }

    return (
      <div>
        <Button id={id} className={className + " p-button-sm"}
            label={t('CLEAR')} icon="pi pi-trash"
            onClick={onClear}/>
      </div>
    );
}

export default ButtonClear;
