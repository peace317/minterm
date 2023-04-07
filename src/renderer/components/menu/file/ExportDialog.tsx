import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Checkbox } from 'primereact/checkbox';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';
import { useContext } from 'renderer/context';
import { ExportService } from 'renderer/services/ExportService';
import { FormatService } from 'renderer/services/FormatService';
import { IDialogProps } from 'renderer/types/AppInterfaces';
import { ConversionType } from 'renderer/types/ConversionType';
import { ExportFormats } from 'renderer/types/ExportFormats';

const encodings = FormatService.typeToSelectList(ConversionType);
const exportFormats = FormatService.typeToSelectList(ExportFormats);

const ExportDialog: React.FC<IDialogProps> = ({
  id,
  className,
  display,
  setDisplay,
}) => {
  const { receivedData: data } = useContext();
  const [exportWithTimestamp, setExportWithTimestamp] =
    useState<boolean>(false);
  const [selectedEncodings, setEncodings] = useState<Array<ConversionType>>([
    ConversionType.ASCII,
  ]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedFormat, setFormat] = useState<ExportFormats>(
    ExportFormats.RAW
  );
  const [delimiter, setDelimiter] = useState<string>('');
  const { t } = useTranslation();

  const onHide = () => {
    setDisplay(false);
  };

  const onCancel = () => {
    onHide();
  };

  const onAccept = () => {
    console.log(ExportService.buildRawContent([ConversionType.ASCII], data, ";", false, false));
    var content = '';
    var file;
    let a = document.createElement('a');
    switch (selectedFormat) {
      case ExportFormats.JSON:
        content = ExportService.buildJSONContent(selectedEncodings, data, delimiter, false, exportWithTimestamp);
        file = new Blob([content], { type: 'text/plain' });
        a.download =
          'output_' + new Date().toISOString().split('.')[0] + '.json';
        break;
      case ExportFormats.RAW:
        content = ExportService.buildRawContent(selectedEncodings, data, delimiter, false, exportWithTimestamp);
        file = new Blob([content], { type: 'text/plain' });
        a.download =
          'output_' + new Date().toISOString().split('.')[0] + '.log';
        break;
      default:
        console.error('Undefined export format: ' + selectedFormat);
        return;
    }
    a.href = URL.createObjectURL(file);
    a.click();
  };

  const onEncodingChange = (e: { value: any }) => {
    if (e.value.length > 0) setEncodings(e.value);
    setSelectAll(e.value.length === encodings.length);
  };

  const onEncodingAll = (e: any) => {
    if (e.checked) {
      setEncodings([ConversionType.ASCII]);
      setSelectAll(false);
    } else {
      setEncodings(Object.values(ConversionType));
      setSelectAll(true);
    }
  };

  const renderFooter = () => {
    return (
      <div>
        <Button
          label={t('CLOSE')}
          icon="pi pi-times"
          onClick={() => onCancel()}
          className="p-button-text"
        />
        <Button label={t('SAVE')} onClick={() => onAccept()} autoFocus />
      </div>
    );
  };

  return (
    <div id={id +":container"} className={className}>
      <ConfirmDialog />
      <Dialog
        id={id}
        header={t('EXPORT_OPTIONS')}
        visible={display}
        onHide={() => onHide()}
        style={{ width: '35rem' }}
        footer={renderFooter()}
      >
        <div className="card">
          <div className="grid" >
            <div className="col-6 multiselect">
              <h4 className={'label-h4 '}>{t('ENCODING')}</h4>
              <MultiSelect
                value={selectedEncodings}
                options={encodings}
                onChange={onEncodingChange}
                onSelectAll={onEncodingAll}
                selectAll={selectAll}
                optionLabel="name"
                optionValue="key"
                display="chip"
                className=""
                min={1}
              />
            </div>
            <div className="col-6 dropdown">
              <h4 className="label-h4">{t('STORAGE_FORMAT')}</h4>
              <Dropdown
                value={selectedFormat}
                options={exportFormats}
                onChange={(e) => setFormat(e.target.value)}
                optionLabel="name"
                optionValue="key"
                className=""
              />
            </div>
          </div>
          <div className="card inputtext">
            <h4 className="label-h4">{t('DELIMITER')}</h4>
            <InputText
              id="delimiter"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
            />
          </div>
          <div className="card mt-3">
            <h4 className="label-h4">{t('INCLUDE_TIMESTAMP')}</h4>
            <Checkbox
              inputId="timestamp"
              checked={exportWithTimestamp}
              onChange={(e) => setExportWithTimestamp(e.checked)}
            />
            <label htmlFor="timestamp" className="ml-2">
              {t('ENABLE')}
            </label>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default ExportDialog;
