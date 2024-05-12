import { ISelectValue } from '@minterm/types';

/**
 * Converts an ASCII string to a binary string. The binaries will be
 * separated by a ',' (comma) and will not contain any leading
 * zeroes.
 *
 * abc123\n -> 1100001,1100010,1100011,110001,110010,110011,1010
 *
 * @param ascii string
 * @returns string containing the binary values
 */
export const asciiToBin = (ascii: string) =>
  ascii
    .split('')
    .map((i: string) => i.charCodeAt(0).toString(2))
    .toString();

/**
 * Converts an ASCII string to a decimal string. The decimals will be
 * separated by a ',' (comma) and will not contain any leading
 * zeroes.
 *
 * abc123\n -> 97,98,99,49,50,51,10
 *
 * @param ascii string
 * @returns string containing the decimal values
 */
export const asciiToDecimal = (ascii: string) =>
  ascii
    .split('')
    .map((i: string) => i.charCodeAt(0).toString(10))
    .toString();

/**
 * Converts an ASCII string to a hex string. The hex values will be
 * separated by a ',' (comma) and will not contain any leading
 * zeroes. Characters will be in upper case.
 *
 * abc123\n -> 61,62,63,31,32,33,A
 *
 * @param ascii string
 * @returns string containing the decimal values
 */
export const asciiToHex = (ascii: string) =>
  ascii
    .split('')
    .map((i: string) => i.charCodeAt(0).toString(16))
    .toString()
    .toUpperCase();

/**
 * Converts any decimal number back to an ASCII string. Long decimals
 * may result result in invalid utf-8 characaters
 *
 * 65 -> A
 * 65256 -> þè
 *
 * @param num decimal number
 * @returns ASCII string
 */
export const decimalToAscii = (num: number) => {
  const byteArray: number[] = binToBinArray(decimalToBinary(num));
  return binArrayToAscii(byteArray);
};

/**
 * Converts a decimal number into a binary string. Negative decimals will
 * be converted via the 2's complement. The amount of bits in the conversion
 * depends on the user setting.
 *
 * -1 -> 1111 1111 (in 8-bit)
 * 12 -> 1100
 *
 * @param num decimal
 * @returns
 */
export const decimalToBinary = (num: number) => {
  const mask = 0xff;
  if (num < 0) {
    num = ((1 << 8) + num) & mask;
  }
  return (num >>> 0).toString(2);
};

export const decimalToHex = (num: number) => {
  return num.toString(16).toUpperCase();
};

/**
 * Converts a hex string back to a ASCII string. Long hex values
 * may result result in invalid utf-8 characaters.
 *
 * 65 -> e
 * AB123 -> ±#
 *
 * @param hex hex string
 * @returns ASCII string
 */
export const hexToAscii = (hex: string) => {
  const byteArray: number[] = binToBinArray(parseInt(hex, 16).toString(2));
  return binArrayToAscii(byteArray);
};

/**
 * Converts a binary string to a binary number array. This can be used for
 * induividual calculations for each binary, like another conversion. The string
 * does only contain bits and is beeing grouped by 8 with positiv lookahead, thus
 * the string should contain a full binary representation.
 * Leading zeroes will be cut off.
 *
 * 11001100 -> [11001100]
 * 101010001111 -> [1010, 10001111]
 * 101000001111 -> [1010, 1111]
 *
 * @param bin binary string
 * @returns array of binaries
 */
export const binToBinArray = (bin: string): number[] => {
  return bin.match(/(\d+?)(?=(\d{8})+(?!\d)|$)/g)?.map(Number) || [];
};

/**
 * Converts a binary array into an ASCII string.
 *
 * [1100001, 1100010] -> ab
 *
 * @param binaries binary array
 * @returns ASCII string
 */
export const binArrayToAscii = (binaries: number[]): string => {
  return binaries
    .flatMap((b) => String.fromCharCode(parseInt(b.toString(), 2)))
    .join('');
};

/**
 * Converts an enum type to an object list for select boxes. The name and
 * the key of the select value will be the value of the enum type.
 *
 * @param type
 * @returns list
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const typeToSelectList = (type: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return Object.keys(type).map((e: any) => {
    const select: ISelectValue = {
      name: type[e as keyof typeof type],
      key: type[e as keyof typeof type],
    };
    return select;
  });
};

export const formatDate = (value: Date) => {
  return value.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};
