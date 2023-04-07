/**
 * Keys for accessing the electron store.
 */
export enum StoreKey {
  THEME = 'theme',
  LANGUAGE = 'language',
  SELECTED_BAUD_RATE = 'selectedBaudRate',
  STORE_SELECTED_BAUD_RATE = 'storeSelectedBaudRates',
  SERIALPORT_DATA_BITS = 'serialportDataBits',
  SERIALPORT_STOP_BITS = 'serialportStopBits',
  SERIALPORT_PARITY = 'serialportParity',
  SERIALPORT_LOCK = 'serialportLock',
  SERIALPORT_RTSCTS = 'serialportRtscts',
  SERIALPORT_XON = 'serialportXon',
  SERIALPORT_XOFF = 'serialportXoff',
  SERIALPORT_XANY = 'serialportXany',
  SERIALPORT_HUPCL = 'serialportHupcl',
  SELECTED_PARSER = 'selectedParser',
  PARSER_BYTE_LENGTH = 'parserByteLength',
  PARSER_DELIMITER = 'parserDelimiter',
  PARSER_INCLUDE_DELIMITER = 'parserIncludeDelimiter',
  PARSER_REGEX = 'parserRegex',
  PARSER_REGEX_ENCODING = 'parserEncoding',
  MACROS = "macros",
  READY_PARSER_DELIMITER = "readyParserDelimiter",
  FORCE_BYTE_DELIMITER = "forceByteDelimiter"
}
