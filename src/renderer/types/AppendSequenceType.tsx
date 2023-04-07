import { FormatService } from "renderer/services/FormatService";

enum AppendSequences {
  NONE = 'None',
  CR = 'CR',
  LF = 'LF',
  CRLF = 'CR+LF',
  NULL = 'Null',
}

export type AppendSequenceType = {
  label: AppendSequences,
  command: string,
};

export const appendCommands: AppendSequenceType[] = [
  {
    label: AppendSequences.NONE,
    command: '',
  },
  {
    label: AppendSequences.CR,
    command: '\r',
  },
  {
    label: AppendSequences.LF,
    command: '\n',
  },
  {
    label: AppendSequences.CRLF,
    command: '\r\n',
  },
  {
    label: AppendSequences.NULL,
    command: FormatService.decimalToAscii(0),
  }
];

