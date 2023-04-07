import { AppendSequenceType } from "./AppendSequenceType";
import { ConversionType } from "./ConversionType";

/**
 * Type for a macro variable. A macro variable is a placeholder
 * with a certain value in a macro sequence.
 */
export type MacroVariableType = {
  name: string | number,
  type: ConversionType,
  value: string;
  minValue?: number;
  maxValue?: number;
};
