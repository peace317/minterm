import { IPCChannelType } from '@minterm/types';
import { LogFunctions } from 'electron-log';

/** Signature of a logging function */
export interface LogFn {
  (message?: any, ...optionalParams: any[]): void;
}

/** Log levels */
export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export type LogMessage = {
  classSource?: string;
  message?: any;
  optionalParams?: any;
};

const NO_OP: LogFn = (message?: any, ...optionalParams: any[]) => {};

/** Logger which outputs to the browser console */
export class ConsoleLogger implements LogFunctions {
  getLogger = (name: string): LogFunctions => {
    return new ConsoleLogger(name);
  };

  buildMessageTemplate = (
    name?: string,
    message?: any,
    ...optionalParams: any[]
  ): LogMessage => {
    const msg: LogMessage = {};
    msg.classSource = name;
    msg.message = message;
    msg.optionalParams = optionalParams;
    return msg;
  };

  readonly log: LogFn;

  readonly debug: LogFn;

  readonly info: LogFn;

  readonly warn: LogFn;

  readonly error: LogFn;

  readonly verbose: LogFn;

  readonly silly: LogFn;

  readonly consoleError: LogFn;

  readonly consoleWarn: LogFn;

  readonly consoleLog: LogFn;

  constructor(name: string, options?: { level?: LogLevel }) {
    const { level } = options || {};

    this.error = (message?: any, ...optionalParams: any[]) => {
      window.electron.logger.error(
        this.buildMessageTemplate(name, message, ...optionalParams)
      );
      this.consoleError(message, ...optionalParams);
    };
    this.warn = (message?: any, ...optionalParams: any[]) => {
      window.electron.logger.warn(
        this.buildMessageTemplate(name, message, ...optionalParams)
      );
      this.consoleWarn(message, ...optionalParams);
    };
    this.debug = (message?: any, ...optionalParams: any[]) => {
      window.electron.logger.debug(
        this.buildMessageTemplate(name, message, ...optionalParams)
      );
      this.consoleLog(message, ...optionalParams);
    };
    this.log = (message?: any, ...optionalParams: any[]) => {
      window.electron.logger.log(
        this.buildMessageTemplate(name, message, ...optionalParams)
      );
      this.consoleLog(message, ...optionalParams);
    };
    this.info = (message?: any, ...optionalParams: any[]) => {
      window.electron.logger.info(
        this.buildMessageTemplate(name, message, ...optionalParams)
      );
      this.consoleLog(message, ...optionalParams);
    };
    // no need for additional levels, so verbose and silly will be printed as info
    this.verbose = (message?: any, ...optionalParams: any[]) => {
      window.electron.logger.info(
        this.buildMessageTemplate(name, message, ...optionalParams)
      );
      this.consoleLog(message, ...optionalParams);
    };
    this.silly = (message?: any, ...optionalParams: any[]) => {
      window.electron.logger.info(
        this.buildMessageTemplate(name, message, ...optionalParams)
      );
      this.consoleLog(message, ...optionalParams);
    };
   /* if (!window.electron?.ipcRenderer.fetch(IPCChannelType?.IS_DEVELOPMENT)) {
      this.consoleError = console.error.bind(console);
      this.consoleWarn = console.warn.bind(console);
      this.consoleLog = console.log;
    } else {
    }
    */
    this.consoleError = NO_OP;
    this.consoleWarn = NO_OP;
    this.consoleLog = NO_OP;
    switch (level) {
      case 'error':
        this.warn = NO_OP;
        this.info = NO_OP;
        this.debug = NO_OP;
        this.log = NO_OP;
        this.verbose = NO_OP;
        this.silly = NO_OP;
        break;
      case 'warn':
        this.info = NO_OP;
        this.debug = NO_OP;
        this.log = NO_OP;
        this.verbose = NO_OP;
        this.silly = NO_OP;
        break;
      case 'info':
        this.debug = NO_OP;
        this.log = NO_OP;
        this.verbose = NO_OP;
        this.silly = NO_OP;
        break;
    }
    // https://meticulous.ai/blog/getting-started-with-react-logging/
  }
}

export const Logger = new ConsoleLogger('');
