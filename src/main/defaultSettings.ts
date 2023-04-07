const defaults = {
  theme: "theme-saga-blue",
  language: "de",
  storeSelectedBaudRates: true,
  serialportDataBits: 8,
  serialportStopBits: 1,
  serialportParity: "None",
  serialportLock: true,
  serialportRtscts: false,
  serialportXon: false,
  serialportXoff: false,
  serialportXany: false,
  serialportHupcl: true,
  selectedParser: "byteLengthParser",
  parserByteLength: 1,
  parserDelimiter: "\\n",
  parserIncludeDelimiter: false,
  parserRegex: "[\\n\\r]+",
  parserEncoding: "utf8",
  readyParserDelimiter: '',
  forceByteDelimiter: false
};

export default defaults;

