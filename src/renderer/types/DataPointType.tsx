/**
 * Type for a data point of a value read from or written to the serialport.
 */
export type DataPointType = {
  timestamp?: Date;
  value?: string;
  valueAsDec?: string;
  valueAsHex?: string;
  valueAsBin?: string;
};
