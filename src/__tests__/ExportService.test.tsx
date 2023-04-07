import '@testing-library/jest-dom';
import { ExportService } from '../renderer/services/ExportService';
import { DataPointType } from 'renderer/types/DataPointType';
import { ConversionType } from '../renderer/types/ConversionType';
import { FormatService } from '../renderer/services/FormatService';

const defaultTime: Date = new Date('2000-01-01');

function addStringData(...elements: string[]): DataPointType[] {
  var data: DataPointType[] = [];
  elements.forEach((e) => {
    data.push({
      timestamp: defaultTime,
      value: e,
      valueAsBin: FormatService.asciiToBin(e),
      valueAsDec: FormatService.asciiToDecimal(e),
      valueAsHex: FormatService.asciiToHex(e),
    });
  });
  return data;
}

test('empty data', async () => {
  var encodings = [ConversionType.ASCII];
  var data: DataPointType[] = [];
  var delimiter = '';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('');
});
/* ------------------ Test RAW ------------------ */
/* ---------------------------------------------- */

/* ---------------- Test Strings ---------------- */
test('simple test string', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('test');
  var delimiter = '';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('test');
});

test('simple test char array', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('t', 'e', 's', 't');
  var delimiter = '';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('test');
});

test('simple test char array with line break', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('t', 'e', 's', 't', '\n', 't', 'e', 's', 't');
  var delimiter = '';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('test\ntest');
});

test('simple test char array with delimiter', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('t', 'e', 's', 't', '\n', 't', 'e', 's', 't');
  var delimiter = ';';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('t;e;s;t;\n;t;e;s;t');
});

test('simple test string with delimiter', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('test\ntest');
  var delimiter = ';';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('t;e;s;t;\n;t;e;s;t');
});

test('simple test char array with delimiter and date', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('t', 'e', 's', 't', '\n');
  var delimiter = ';';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = true;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    '2000-01-01T00:00:00.000Z:\n' +
      't\n' +
      '2000-01-01T00:00:00.000Z:\n' +
      'e\n' +
      '2000-01-01T00:00:00.000Z:\n' +
      's\n' +
      '2000-01-01T00:00:00.000Z:\n' +
      't\n' +
      '2000-01-01T00:00:00.000Z:\n' +
      '\n'
  );
});

test('simple test string with delimiter and date', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('test\ntest');
  var delimiter = ';';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = true;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('2000-01-01T00:00:00.000Z:\nt;e;s;t;\n;t;e;s;t');
});

/* ---------------- Test Decimal ---------------- */
test('test decimal conversion', async () => {
  var encodings = [ConversionType.DEC];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = '';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('116101115116049010');
  expect(res2).toEqual('116101115116049010');
});

test('test decimal conversion with delimiter and leading zeros', async () => {
  var encodings = [ConversionType.DEC];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('116,101,115,116,049,010');
  expect(res2).toEqual('116,101,115,116,049,010');
});

test('test decimal conversion with delimiter no leading zeros', async () => {
  var encodings = [ConversionType.DEC];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('116,101,115,116,49,10');
  expect(res2).toEqual('116,101,115,116,49,10');
});

/* ---------------- Test Hex ---------------- */
test('test hex conversion', async () => {
  var encodings = [ConversionType.HEX];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = '';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('74657374310A');
  expect(res2).toEqual('74657374310A');
});

test('test hex conversion with delimiter', async () => {
  var encodings = [ConversionType.HEX];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('74,65,73,74,31,0A');
  expect(res2).toEqual('74,65,73,74,31,0A');
});

test('test hex conversion with delimiter no leading zeros', async () => {
  var encodings = [ConversionType.HEX];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('74,65,73,74,31,A');
  expect(res2).toEqual('74,65,73,74,31,A');
});

/* ---------------- Test Binary ---------------- */
test('test binary conversion', async () => {
  var encodings = [ConversionType.BIN];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = '';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('011101000110010101110011011101000011000100001010');
  expect(res2).toEqual('011101000110010101110011011101000011000100001010');
});

test('test binary conversion with delimiter', async () => {
  var encodings = [ConversionType.BIN];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );
  data = addStringData('test1\n');

  var res2 = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('01110100,01100101,01110011,01110100,00110001,00001010');
  expect(res2).toEqual('01110100,01100101,01110011,01110100,00110001,00001010');
});

test('test binary conversion with delimiter no leading zeros', async () => {
  var encodings = [ConversionType.BIN];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );
  data = addStringData('test1\n');

  var res2 = ExportService.buildRawContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual('1110100,1100101,1110011,1110100,110001,1010');
  expect(res2).toEqual('1110100,1100101,1110011,1110100,110001,1010');
});

/* ---------------------------------------------- */
/* ------------------ Test JSON ----------------- */
/* ---------------------------------------------- */

/* ---------------- Test Strings ---------------- */
test('simple test string JSON', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('test');
  var delimiter = '';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(JSON.stringify([{ value: 'test' }], null, 2));
});

test('simple test char array with line break JSON', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('t', 'e', 's', 't', '\n');
  var delimiter = '';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(JSON.stringify([{ value: 't' },
  { value: 'e' },
  { value: 's' },
  { value: 't' },
  { value: '\n' }], null, 2));
});

test('simple test char array with delimiter JSON', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('t', 'e', 's', 't', '\n');
  var delimiter = ';';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify([{ value: 't' },
    { value: 'e' },
    { value: 's' },
    { value: 't' },
    { value: '\n' }], null, 2)
  );
});

test('simple test string with delimiter JSON', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('test\ntest');
  var delimiter = ';';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify([{ value: 't;e;s;t;\n;t;e;s;t' }], null, 2)
  );
});

test('simple test char array with delimiter and date JSON', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('t', 'e', 's', 't', '\n');
  var delimiter = ';';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = true;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [{ timestamp: '2000-01-01T00:00:00.000Z', value: 't' },
      { timestamp: '2000-01-01T00:00:00.000Z', value: 'e' },
      { timestamp: '2000-01-01T00:00:00.000Z', value: 's' },
      { timestamp: '2000-01-01T00:00:00.000Z', value: 't' },
      { timestamp: '2000-01-01T00:00:00.000Z', value: '\n' }],
      null,
      2
    )
  );
});

test('simple test string with delimiter and date JSON', async () => {
  var encodings = [ConversionType.ASCII];
  var data = addStringData('test\ntest');
  var delimiter = ';';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = true;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [{ timestamp: '2000-01-01T00:00:00.000Z', value: 't;e;s;t;\n;t;e;s;t' }],
      null,
      2
    )
  );
});

/* ---------------- Test Decimal ---------------- */
test('test decimal conversion JSON', async () => {
  var encodings = [ConversionType.DEC];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = '';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [
        { valueAsDec: '116' },
        { valueAsDec: '101' },
        { valueAsDec: '115' },
        { valueAsDec: '116' },
        { valueAsDec: '049' },
        { valueAsDec: '010' },
      ],
      null,
      2
    )
  );
  expect(res2).toEqual(
    JSON.stringify([{ valueAsDec: '116101115116049010' }], null, 2)
  );
});

test('test decimal conversion with delimiter and leading zeros JSON', async () => {
  var encodings = [ConversionType.DEC];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [
        { valueAsDec: '116' },
        { valueAsDec: '101' },
        { valueAsDec: '115' },
        { valueAsDec: '116' },
        { valueAsDec: '049' },
        { valueAsDec: '010' },
      ],
      null,
      2
    )
  );
  expect(res2).toEqual(
    JSON.stringify([{ valueAsDec: '116,101,115,116,049,010' }], null, 2)
  );
});

test('test decimal conversion with delimiter no leading zeros JSON', async () => {
  var encodings = [ConversionType.DEC];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [
        { valueAsDec: '116' },
        { valueAsDec: '101' },
        { valueAsDec: '115' },
        { valueAsDec: '116' },
        { valueAsDec: '49' },
        { valueAsDec: '10' },
      ],
      null,
      2
    )
  );
  expect(res2).toEqual(
    JSON.stringify([{ valueAsDec: '116,101,115,116,49,10' }], null, 2)
  );
});

/* ---------------- Test Hex ---------------- */
test('test hex conversion JSON', async () => {
  var encodings = [ConversionType.HEX];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = '';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [
        { valueAsHex: '74' },
        { valueAsHex: '65' },
        { valueAsHex: '73' },
        { valueAsHex: '74' },
        { valueAsHex: '31' },
        { valueAsHex: '0A' },
      ],
      null,
      2
    )
  );
  expect(res2).toEqual(
    JSON.stringify([{ valueAsHex: '74657374310A' }], null, 2)
  );
});

test('test hex conversion with delimiter JSON', async () => {
  var encodings = [ConversionType.HEX];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [
        { valueAsHex: '74' },
        { valueAsHex: '65' },
        { valueAsHex: '73' },
        { valueAsHex: '74' },
        { valueAsHex: '31' },
        { valueAsHex: '0A' },
      ],
      null,
      2
    )
  );
  expect(res2).toEqual(
    JSON.stringify([{ valueAsHex: '74,65,73,74,31,0A' }], null, 2)
  );
});

test('test hex conversion with delimiter no leading zeros JSON', async () => {
  var encodings = [ConversionType.HEX];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [
        { valueAsHex: '74' },
        { valueAsHex: '65' },
        { valueAsHex: '73' },
        { valueAsHex: '74' },
        { valueAsHex: '31' },
        { valueAsHex: 'A' },
      ],
      null,
      2
    )
  );
  expect(res2).toEqual(
    JSON.stringify([{ valueAsHex: '74,65,73,74,31,A' }], null, 2)
  );
});

/* ---------------- Test Binary ---------------- */
test('test binary conversion JSON', async () => {
  var encodings = [ConversionType.BIN];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = '';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  data = addStringData('test1\n');

  var res2 = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [
        { valueAsBin: '01110100' },
        { valueAsBin: '01100101' },
        { valueAsBin: '01110011' },
        { valueAsBin: '01110100' },
        { valueAsBin: '00110001' },
        { valueAsBin: '00001010' },
      ],
      null,
      2
    )
  );
  expect(res2).toEqual(
    JSON.stringify(
      [{ valueAsBin: '011101000110010101110011011101000011000100001010' }],
      null,
      2
    )
  );
});

test('test binary conversion with delimiter JSON', async () => {
  var encodings = [ConversionType.BIN];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = true;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );
  data = addStringData('test1\n');

  var res2 = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [
        { valueAsBin: '01110100' },
        { valueAsBin: '01100101' },
        { valueAsBin: '01110011' },
        { valueAsBin: '01110100' },
        { valueAsBin: '00110001' },
        { valueAsBin: '00001010' },
      ],
      null,
      2
    )
  );
  expect(res2).toEqual(
    JSON.stringify(
      [{ valueAsBin: '01110100,01100101,01110011,01110100,00110001,00001010' }],
      null,
      2
    )
  );
});

test('test binary conversion with delimiter no leading zeros JSON', async () => {
  var encodings = [ConversionType.BIN];
  var data = addStringData('t', 'e', 's', 't', '1', '\n');
  var delimiter = ',';
  var leadingZeros: boolean = false;
  var includeTimeStamp: boolean = false;

  var res = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );
  data = addStringData('test1\n');

  var res2 = ExportService.buildJSONContent(
    encodings,
    data,
    delimiter,
    leadingZeros,
    includeTimeStamp
  );

  expect(res).toEqual(
    JSON.stringify(
      [
        { valueAsBin: '1110100' },
        { valueAsBin: '1100101' },
        { valueAsBin: '1110011' },
        { valueAsBin: '1110100' },
        { valueAsBin: '110001' },
        { valueAsBin: '1010' },
      ],
      null,
      2
    )
  );
  expect(res2).toEqual(
    JSON.stringify(
      [{ valueAsBin: '1110100,1100101,1110011,1110100,110001,1010' }],
      null,
      2
    )
  );
});
