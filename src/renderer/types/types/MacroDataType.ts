import { AppendSequenceType } from '../enums/AppendSequenceType';
import { ConversionType } from '../enums/ConversionType';
import { MacroVariableType } from './MacroVariableType';

/**
 * Type for a macro object.
 */
export type MacroDataType = {
  name: string;
  sequence: string;
  appendSequence?: AppendSequenceType;
  sequenceFormat: ConversionType;
  variables?: Array<MacroVariableType>;
  description?: string;
};
