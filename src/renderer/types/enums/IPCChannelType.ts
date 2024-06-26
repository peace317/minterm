export enum IPCChannelType {
  PARSER_SUPPORT_CONVERSION = 'supportConversion',
  RECEIVE_DATA = 'receiveData',
  RECEIVE_PORT_LIST = 'receivePortList',
  SEND_DATA = 'sendData',
  PORT_STATUS = 'portStatus',
  PORT_CONNECT = 'portConnect',
  PORT_DISCONNECT = 'portDisconnect',
  STORE_SET = 'storeSet',
  STORE_GET = 'storeGet',
  APP_RELOAD = 'appReload',
  APP_CLOSE = 'appClose',
  APP_MINIMIZE = 'appMinimize',
  APP_MAXIMIZE = 'appMaximize',
  APP_RESTORE = 'appRestore',
  APP_UNMAXIMIZE = 'appUnmaximize',
  LOG = 'LOG',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
  ERROR = 'ERROR',
  WARN = 'WARN',
  LOG_FILE = 'LOG_FILE',
  OPEN_FILE = 'OPEN_FILE',
  IS_DEVELOPMENT = 'IS_DEVELOPMENT',
  APP_VERSIONS = 'APP_VERSIONS',
  GET_ENV = 'GET_ENV',
  CHANGE_THEME = 'CHANGE_THEME',
}