import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { InputSwitch } from 'primereact/inputswitch';
import { RadioButton } from 'primereact/radiobutton';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  IDialogProps,
  ConnectionStatusType,
  EncodingType,
  IPCChannelType,
  ParserType,
  StoreKey,
} from '@minterm/types';
import ByteLengthSettings from './ByteLengthSettings';
import DelimiterSettings from './DelimiterSettings';
import ReadyParserSettings from './ReadyParserSettings';
import RegexSettings from './RegexSettings';
import { DropdownChangeEvent } from 'primereact/dropdown';

const ParserSettingsDialog: React.FC<IDialogProps> = ({
  id,
  className,
  display,
  setDisplay,
}) => {
  const [byteLength, setByteLength] = useState<number>(
    window.electron.store.get(StoreKey.PARSER_BYTE_LENGTH)
  );
  const [delimiter, setDelimiter] = useState<string>(
    window.electron.store.get(StoreKey.PARSER_DELIMITER)
  );
  const [includeDelimiter, setIncludeDelimiter] = useState<boolean>(
    window.electron.store.get(StoreKey.PARSER_INCLUDE_DELIMITER)
  );
  const [regex, setRegex] = useState<string>(
    window.electron.store.get(StoreKey.PARSER_REGEX)
  );
  const [selectedParser, setSelectedParser] = useState(
    window.electron.store.get(StoreKey.SELECTED_PARSER)
  );
  const [bufferEncoding, setBufferEncoding] = useState<EncodingType>(
    window.electron.store.get(StoreKey.PARSER_REGEX_ENCODING)
  );
  const [readyDelimiter, setReadyDelimiter] = useState<string>(
    window.electron.store.get(StoreKey.READY_PARSER_DELIMITER)
  );
  const [forceByteDelimiter, setForceByteDelimiter] = useState<boolean>(
    window.electron.store.get(StoreKey.FORCE_BYTE_DELIMITER)
  );
  const { t } = useTranslation();

  const onHide = () => {
    setDisplay(false);
  };

  const onBufferEncodingChange = (e: DropdownChangeEvent) => {
    setBufferEncoding(e.value);
  };

  const onCancel = () => {
    setByteLength(window.electron.store.get(StoreKey.PARSER_BYTE_LENGTH));
    setDelimiter(window.electron.store.get(StoreKey.PARSER_DELIMITER));
    setIncludeDelimiter(
      window.electron.store.get(StoreKey.PARSER_INCLUDE_DELIMITER)
    );
    setRegex(window.electron.store.get(StoreKey.PARSER_REGEX));
    setBufferEncoding(
      window.electron.store.get(StoreKey.PARSER_REGEX_ENCODING)
    );
    setSelectedParser(window.electron.store.get(StoreKey.SELECTED_PARSER));
    setReadyDelimiter(
      window.electron.store.get(StoreKey.READY_PARSER_DELIMITER)
    );
    setForceByteDelimiter(
      window.electron.store.get(StoreKey.FORCE_BYTE_DELIMITER)
    );
    onHide();
  };

  const onAccept = () => {
    window.electron.store.set(StoreKey.PARSER_BYTE_LENGTH, byteLength);
    window.electron.store.set(StoreKey.PARSER_DELIMITER, delimiter);
    window.electron.store.set(
      StoreKey.PARSER_INCLUDE_DELIMITER,
      includeDelimiter
    );
    window.electron.store.set(StoreKey.PARSER_REGEX, regex);
    window.electron.store.set(StoreKey.PARSER_REGEX_ENCODING, bufferEncoding);
    window.electron.store.set(StoreKey.SELECTED_PARSER, selectedParser);
    window.electron.store.set(StoreKey.READY_PARSER_DELIMITER, readyDelimiter);
    window.electron.store.set(
      StoreKey.FORCE_BYTE_DELIMITER,
      forceByteDelimiter
    );
    if (
      window.electron.ipcRenderer.fetch(IPCChannelType.PORT_STATUS) ===
      ConnectionStatusType.CONNECTED
    ) {
      window.electron.ipcRenderer.sendMessage(IPCChannelType.PORT_STATUS, true);
    }
    window.electron.ipcRenderer.sendMessage(
      IPCChannelType.PARSER_SUPPORT_CONVERSION
    );
    onHide();
  };

  const renderFooter = () => {
    return (
      <div id={id}>
        <Button
          label={t('CANCEL')}
          icon="pi pi-times"
          onClick={() => onCancel()}
          className="p-button-text"
        />
        <Button
          label={t('ACCEPT')}
          icon="pi pi-check"
          onClick={() => onAccept()}
          autoFocus
        />
      </div>
    );
  };

  return (
    <div id={`${id}:container`} className={className}>
      <ConfirmDialog />
      <Dialog
        id={`dialogWrapper:dialog:${id}`}
        header={t('PARSER_OPTIONS')}
        visible={display}
        onHide={() => onHide()}
        style={{ width: '40rem' }}
        resizable
        footer={renderFooter()}
      >
        <p>
          <i className="pi pi-check-circle mr-2" />
          {t('PARSER_EXPLANATION')}
        </p>
        <div className="card">
          <h4 className="label-h4">{t('FORCE_BYTE_DELIMITER')}</h4>
          <p className="mt-0">{t('FORCE_BYTE_DELIMITER_EXPLANATION')}</p>
          <InputSwitch
            checked={forceByteDelimiter}
            onChange={(e) => setForceByteDelimiter(e.value || false)}
          />
        </div>
        <Divider />
        <div className="card">
          <div className="field-radiobutton mb-0">
            <h2 className="mr-3">{t('BYTE_LENGTH_PARSER')}</h2>
            <RadioButton
              inputId={ParserType.BYTE_LENGTH_PARSER}
              name="parser"
              className="mt-1"
              value={ParserType.BYTE_LENGTH_PARSER}
              onChange={(e) => setSelectedParser(e.value)}
              checked={selectedParser === ParserType.BYTE_LENGTH_PARSER}
            />
            <label
              htmlFor={ParserType.BYTE_LENGTH_PARSER}
              hidden={selectedParser !== ParserType.BYTE_LENGTH_PARSER}
            >
              ({t('ACTIVATED')})
            </label>
          </div>
          <p className="mt-0">{t('BYTE_PARSER_EXPLANATION')}</p>
          <ByteLengthSettings
            id="as"
            length={byteLength}
            setLength={setByteLength}
          />
        </div>
        <Divider />
        <div className="card">
          <div className="field-radiobutton mb-0">
            <h2 className="mr-3">{t('DELIMITER_PARSER')}</h2>
            <RadioButton
              inputId={ParserType.DELIMITER_PARSER}
              name="parser"
              className="mt-1"
              value={ParserType.DELIMITER_PARSER}
              onChange={(e) => setSelectedParser(e.value)}
              checked={selectedParser === ParserType.DELIMITER_PARSER}
            />
            <label
              htmlFor={ParserType.DELIMITER_PARSER}
              hidden={selectedParser !== ParserType.DELIMITER_PARSER}
            >
              ({t('ACTIVATED')})
            </label>
          </div>
          <p className="mt-0">{t('DELIMITER_PARSER_EXPLANATION')}</p>
          <DelimiterSettings
            id="as"
            delimiter={delimiter}
            setDelimiter={setDelimiter}
            includeDelimiter={includeDelimiter}
            setIncludeDelimiter={setIncludeDelimiter}
          />
        </div>
        <Divider />
        <div className="card">
          <div className="field-radiobutton mb-0">
            <h2 className="mr-3">{t('REGEX_PARSER')}</h2>
            <RadioButton
              inputId={ParserType.REGEX_PARSER}
              name="parser"
              className="mt-1"
              value={ParserType.REGEX_PARSER}
              onChange={(e) => setSelectedParser(e.value)}
              checked={selectedParser === ParserType.REGEX_PARSER}
            />
            <label
              htmlFor={ParserType.REGEX_PARSER}
              hidden={selectedParser !== ParserType.REGEX_PARSER}
            >
              ({t('ACTIVATED')})
            </label>
          </div>
          <p className="mt-0">{t('REGEX_PARSER_EXPLANATION')}</p>
          <RegexSettings
            id="regexSettings"
            regex={regex}
            setRegex={setRegex}
            bufferEncoding={bufferEncoding}
            onBufferEncodingChange={onBufferEncodingChange}
          />
        </div>
        <Divider />
        <div className="card">
          <div className="field-radiobutton mb-0">
            <h2 className="mr-3">{t('READY_PARSER')}</h2>
            <RadioButton
              inputId={ParserType.READY_PARSER}
              name="parser"
              className="mt-1"
              value={ParserType.READY_PARSER}
              onChange={(e) => setSelectedParser(e.value)}
              checked={selectedParser === ParserType.READY_PARSER}
            />
            <label
              htmlFor={ParserType.READY_PARSER}
              hidden={selectedParser !== ParserType.READY_PARSER}
            >
              ({t('ACTIVATED')})
            </label>
          </div>
          <p className="mt-0">{t('READY_PARSER_EXPLANATION')}</p>
          <ReadyParserSettings
            id="readySettings"
            delimiter={readyDelimiter}
            setDelimiter={setReadyDelimiter}
          />
        </div>
      </Dialog>
    </div>
  );
};

export default ParserSettingsDialog;
