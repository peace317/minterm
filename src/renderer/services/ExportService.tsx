import { ConversionType } from '../types/ConversionType';
import { DataPointType } from '../types/DataPointType';

export class ExportService {

  /**
   * Creates an JSON Object from the data and the settings to use for
   * storing the data.
   *
   * @param encodings Which encoding of the data to be included
   * @param data the data
   * @param delimiter delimiter between chunks of data, these can occur depending on the parser
   * @param leadingZeros whether encodings like binary should contain leading zeros
   * @param includeTimeStamp whether to include a timeStamp
   * @returns JSON Object
   */
  static buildJSONContent = (
    encodings: ConversionType[],
    data: DataPointType[],
    delimiter: string,
    leadingZeros: boolean,
    includeTimeStamp: boolean
  ) => {
    const res = [];

    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      var point: DataPointType = {};
      if (includeTimeStamp) {
        point.timestamp = element.timestamp;
      }

      if (encodings.find((e: any) => e === ConversionType.ASCII)) {
        point.value = ExportService.convertValue(
          element.value,
          '',
          delimiter,
          '',
          '',
          false
        );
      }
      if (encodings.find((e: any) => e === ConversionType.BIN)) {
        point.valueAsBin = ExportService.convertValue(
          element.valueAsBin,
          '',
          delimiter,
          ',',
          '00000000',
          leadingZeros
        );
      }
      if (encodings.find((e: any) => e === ConversionType.DEC)) {
        point.valueAsDec = ExportService.convertValue(
          element.valueAsDec,
          '',
          delimiter,
          ',',
          '000',
          leadingZeros
        );
      }
      if (encodings.find((e: any) => e === ConversionType.HEX)) {
        point.valueAsHex = ExportService.convertValue(
          element.valueAsHex,
          '',
          delimiter,
          ',',
          '00',
          leadingZeros
        ).toUpperCase();
      }
      res.push(point);
    }
    return JSON.stringify(res, null, 2);
  };

  static buildRawContent = (
    encodings: ConversionType[],
    data: DataPointType[],
    delimiter: string,
    leadingZeros: boolean,
    includeTimeStamp: boolean
  ) => {
    var res = '';
    var delimiterTimestamp = '';
    var _delimiter = '';
    data.forEach((d) => {
      if (includeTimeStamp) {
        res += delimiterTimestamp + d.timestamp?.toISOString() + ':\n';
        _delimiter = '';
      }

      if (encodings.find((e: any) => e === ConversionType.ASCII)) {
        res += ExportService.convertValue(
          d.value,
          _delimiter,
          delimiter,
          '',
          '',
          false
        );
      }
      if (encodings.find((e: any) => e === ConversionType.BIN)) {
        res += ExportService.convertValue(
          d.valueAsBin,
          _delimiter,
          delimiter,
          ',',
          '00000000',
          leadingZeros
        );
      }
      if (encodings.find((e: any) => e === ConversionType.DEC)) {
        res += ExportService.convertValue(
          d.valueAsDec,
          _delimiter,
          delimiter,
          ',',
          '000',
          leadingZeros
        );
      }
      if (encodings.find((e: any) => e === ConversionType.HEX)) {
        res += ExportService.convertValue(
          d.valueAsHex,
          _delimiter,
          delimiter,
          ',',
          '00',
          leadingZeros
        ).toUpperCase();
      }
      _delimiter = delimiter;
      delimiterTimestamp = '\n';
    });
    return res;
  };

  /**
   * Converts the given data to an according schema. For single values, the delimiter
   * will be applied as given to the front of the value. If leading zeroes should
   * be added, it is necessary to give the leading zeroes in a full byte
   * (e.g. '00' for hex, '000' for decimal etc.).
   *
   * For multi character data, all values will be split up with the split char.
   * These values are then to be separated with a given delimiter.
   *
   * @param data data to be transformed
   * @param delimiter delimiter in front of single values
   * @param delimiterForMultiChar delimiter for multi character values
   * @param splitChar char to split the data
   * @param leadingZeros leading zeroes to fill up
   * @param includeLeadingZeros whether to include leading zeros or not
   * @returns transformed string
   */
  private static convertValue = (
    data: string | undefined,
    delimiter: string,
    delimiterForMultiChar: string,
    splitChar: string,
    leadingZeros: string,
    includeLeadingZeros: boolean
  ) => {
    if (data === undefined) throw new Error('Value for export undefined!');
    var res = '';
    var dataValues = data.split(splitChar);
    var _delimiterForMultiChar = '';
    if (!includeLeadingZeros) leadingZeros = '';
    dataValues.forEach((v) => {
      if (dataValues.length > 1) {
        res += _delimiterForMultiChar + leadingZeros.substring(v.length) + v;
        _delimiterForMultiChar = delimiterForMultiChar;
      } else {
        res += delimiter + leadingZeros.substring(v.length) + v;
      }
    });
    return res;
  };
}
