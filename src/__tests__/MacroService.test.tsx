import '@testing-library/jest-dom';
import { MacroService } from '@minterm/services';
import { ConversionType, MacroDataType, MacroVariableType } from '@minterm/types';


function getDecVars(nums: number[]): MacroVariableType[] {
  var res = [];
  for (let index = 0; index < nums.length; index++) {
    res.push({
      name: index,
      type: ConversionType.DEC,
      value: nums[index].toString(),
    });
  }
  return res;
}

test('empty sequence with no var', async () => {
  const macroVar: MacroVariableType = {
    name: 0,
    type: ConversionType.DEC,
    value: '0',
  };
  const macro: MacroDataType = {
    name: '',
    sequence: '',
    sequenceFormat: ConversionType.ASCII,
  };

  expect(MacroService.createNewVariable('', ConversionType.DEC)).toEqual(
    macroVar
  );
  expect(MacroService.addVariableToSequence('', macroVar)).toEqual('#{0}');
  expect(MacroService.removeVariableFromSequence('', macroVar)).toEqual('');
  expect(MacroService.getVarsAsList('')).toEqual([]);
  expect(MacroService.buildSequence(macro)).toEqual('');
});

test('sequence with no var', async () => {
  const macroVar: MacroVariableType = {
    name: 0,
    type: ConversionType.DEC,
    value: '0',
  };
  const sequence = '1234asdf';
  const macro: MacroDataType = {
    name: '',
    sequence: sequence,
    sequenceFormat: ConversionType.ASCII,
  };

  expect(MacroService.createNewVariable(sequence, ConversionType.DEC)).toEqual(
    macroVar
  );
  expect(MacroService.addVariableToSequence(sequence, macroVar)).toEqual(
    sequence + '#{0}'
  );
  expect(MacroService.removeVariableFromSequence(sequence, macroVar)).toEqual(
    sequence
  );
  expect(MacroService.getVarsAsList(sequence)).toEqual([]);
  expect(MacroService.buildSequence(macro)).toEqual(sequence);
});

test('sequence with two vars consecutive', async () => {
  const macroVar: MacroVariableType = {
    name: 2,
    type: ConversionType.DEC,
    value: '0',
  };
  const sequence = '1234#{0}#{1}asdf';
  const macro: MacroDataType = {
    name: '',
    sequence: sequence,
    sequenceFormat: ConversionType.ASCII,
    variables: getDecVars([56, 78]),
  };

  expect(MacroService.createNewVariable(sequence, ConversionType.DEC)).toEqual(
    macroVar
  );
  expect(MacroService.addVariableToSequence(sequence, macroVar)).toEqual(
    sequence + '#{2}'
  );
  expect(MacroService.removeVariableFromSequence(sequence, macroVar)).toEqual(
    sequence
  );
  expect(
    MacroService.removeVariableFromSequence(sequence, {
      name: 1,
      type: ConversionType.DEC,
      value: '0',
    })
  ).toEqual('1234#{0}asdf');
  expect(MacroService.getVarsWithoutDuplicates(sequence)).toEqual([0, 1]);
  expect(MacroService.getVarsAsList(sequence)).toEqual([0, 1]);
  expect(MacroService.buildSequence(macro)).toEqual('12345678asdf');
});

test('sequence with incomplete/invalid vars', async () => {
  const macroVar: MacroVariableType = {
    name: 0,
    type: ConversionType.DEC,
    value: '0',
  };
  const sequence = '1#{234#{0a}{0}#{1asd}f';
  const macro: MacroDataType = {
    name: '',
    sequence: sequence,
    sequenceFormat: ConversionType.ASCII,
    variables: getDecVars([56, 78]),
  };

  expect(MacroService.createNewVariable(sequence, ConversionType.DEC)).toEqual(
    macroVar
  );
  expect(MacroService.addVariableToSequence(sequence, macroVar)).toEqual(
    sequence + '#{0}'
  );
  expect(MacroService.removeVariableFromSequence(sequence, macroVar)).toEqual(
    sequence
  );
  expect(MacroService.getVarsWithoutDuplicates(sequence)).toEqual([]);
  expect(MacroService.getVarsAsList(sequence)).toEqual([]);
  expect(MacroService.buildSequence(macro)).toEqual('1#{234#{0a}{0}#{1asd}f');
});

test('sequence with duplicate var', async () => {
  const macroVar: MacroVariableType = {
    name: 1,
    type: ConversionType.DEC,
    value: '0',
  };
  const sequence = '12#{0}34#{0}asdf';
  const macro: MacroDataType = {
    name: '',
    sequence: sequence,
    sequenceFormat: ConversionType.ASCII,
    variables: getDecVars([99]),
  };

  expect(MacroService.createNewVariable(sequence, ConversionType.DEC)).toEqual(
    macroVar
  );
  expect(MacroService.addVariableToSequence(sequence, macroVar)).toEqual(
    sequence + '#{1}'
  );
  expect(MacroService.removeVariableFromSequence(sequence, macroVar)).toEqual(
    sequence
  );
  expect(
    MacroService.removeVariableFromSequence(sequence, {
      name: 0,
      type: ConversionType.DEC,
      value: '0',
    })
  ).toEqual('1234asdf');
  expect(MacroService.getVarsWithoutDuplicates(sequence)).toEqual([0]);
  expect(MacroService.getVarsAsList(sequence)).toEqual([0, 0]);
  expect(MacroService.buildSequence(macro)).toEqual('12993499asdf');
});

test('sequence with vars not in order', async () => {
  const macroVar: MacroVariableType = {
    name: 2,
    type: ConversionType.DEC,
    value: '0',
  };
  const sequence = '12#{1}56#{0}asdf';
  const macro: MacroDataType = {
    name: '',
    sequence: sequence,
    sequenceFormat: ConversionType.ASCII,
    variables: getDecVars([78, 34]),
  };

  expect(MacroService.createNewVariable(sequence, ConversionType.DEC)).toEqual(
    macroVar
  );
  expect(MacroService.addVariableToSequence(sequence, macroVar)).toEqual(
    sequence + '#{2}'
  );
  expect(MacroService.removeVariableFromSequence(sequence, macroVar)).toEqual(
    sequence
  );
  expect(
    MacroService.removeVariableFromSequence(sequence, {
      name: 1,
      type: ConversionType.DEC,
      value: '0',
    })
  ).toEqual('1256#{0}asdf');
  expect(MacroService.getVarsWithoutDuplicates(sequence)).toEqual([0, 1]);
  expect(MacroService.getVarsAsList(sequence)).toEqual([0, 1]);
  expect(MacroService.buildSequence(macro)).toEqual('12345678asdf');
});

test('sequence with duplicate vars not in order', async () => {
  const macroVar: MacroVariableType = {
    name: 2,
    type: ConversionType.DEC,
    value: '0',
  };
  const sequence = '12#{0}2#{1}3#{1}4#{0}asdf';
  const macro: MacroDataType = {
    name: '',
    sequence: sequence,
    sequenceFormat: ConversionType.ASCII,
    variables: getDecVars([11, 99]),
  };

  expect(MacroService.createNewVariable(sequence, ConversionType.DEC)).toEqual(
    macroVar
  );
  expect(MacroService.addVariableToSequence(sequence, macroVar)).toEqual(
    sequence + '#{2}'
  );
  expect(MacroService.removeVariableFromSequence(sequence, macroVar)).toEqual(
    sequence
  );
  expect(
    MacroService.removeVariableFromSequence(sequence, {
      name: 1,
      type: ConversionType.DEC,
      value: '0',
    })
  ).toEqual('12#{0}234#{0}asdf');
  expect(MacroService.getVarsWithoutDuplicates(sequence)).toEqual([0, 1]);
  expect(MacroService.getVarsAsList(sequence)).toEqual([0, 0, 1, 1]);
  expect(MacroService.buildSequence(macro)).toEqual('1211299399411asdf');
});

test('sequence with scattered vars', async () => {
  const macroVar: MacroVariableType = {
    name: 1,
    type: ConversionType.DEC,
    value: '0',
  };
  const sequence = '12#{0}56#{3}as#{5}df';
  const macro: MacroDataType = {
    name: '',
    sequence: sequence,
    sequenceFormat: ConversionType.ASCII,
    variables: [
      { name: 0, type: ConversionType.DEC, value: '34' },
      { name: 3, type: ConversionType.DEC, value: '78' },
      { name: 5, type: ConversionType.DEC, value: '11' },
    ],
  };

  expect(MacroService.createNewVariable(sequence, ConversionType.DEC)).toEqual(
    macroVar
  );
  expect(MacroService.addVariableToSequence(sequence, macroVar)).toEqual(
    sequence + '#{1}'
  );
  expect(MacroService.removeVariableFromSequence(sequence, macroVar)).toEqual(
    sequence
  );
  expect(
    MacroService.removeVariableFromSequence(sequence, {
      name: 5,
      type: ConversionType.DEC,
      value: '0',
    })
  ).toEqual('12#{0}56#{3}asdf');
  expect(MacroService.getVarsWithoutDuplicates(sequence)).toEqual([0, 3, 5]);
  expect(MacroService.getVarsAsList(sequence)).toEqual([0, 3, 5]);
  expect(MacroService.buildSequence(macro)).toEqual('12345678as11df');
});

test('remove unknown var', async () => {
  const sequence = '12#{0}56#{1}as#{2}df';

  expect(
    MacroService.removeVariableFromSequence(sequence, {
      name: 5,
      type: ConversionType.DEC,
      value: '0',
    })
  ).toEqual('12#{0}56#{1}as#{2}df');
});

test('rebalance with unchanged sequence', async () => {
  const sequence = '12#{0}56#{1}asdf';
  const variables = [
    { name: 0, type: ConversionType.DEC, value: '11' },
    { name: 1, type: ConversionType.DEC, value: '22' },
  ];

  expect(
    MacroService.rebalanceVars(sequence, ConversionType.DEC, variables)
  ).toEqual(variables);
});

test('rebalance macro vars with empty list', async () => {
  const sequence = '12#{0}56#{1}asdf';
  const expected = [
    { name: 0, type: ConversionType.DEC, value: '0' },
    { name: 1, type: ConversionType.DEC, value: '0' },
  ];

  expect(MacroService.rebalanceVars(sequence, ConversionType.DEC, [])).toEqual(
    expected
  );
});

test('rebalance macro vars with empty list and start at two', async () => {
  const sequence = '12#{2}56#{3}asdf';
  const expected = [
    { name: 2, type: ConversionType.DEC, value: '0' },
    { name: 3, type: ConversionType.DEC, value: '0' },
  ];

  expect(MacroService.rebalanceVars(sequence, ConversionType.DEC, [])).toEqual(
    expected
  );
});

test('rebalance macro vars with undefined list and unordered', async () => {
  const sequence = '12#{0}56#{3}as#{1}df';
  const expected = [
    { name: 0, type: ConversionType.DEC, value: '0' },
    { name: 1, type: ConversionType.DEC, value: '0' },
    { name: 3, type: ConversionType.DEC, value: '0' },
  ];

  expect(MacroService.rebalanceVars(sequence, ConversionType.DEC, [])).toEqual(
    expected
  );
});

test('rebalance macro vars with missing var and containing value', async () => {
  const sequence = '12#{0}56#{2}as#{3}df';
  const testVars = [
    { name: 0, type: ConversionType.DEC, value: '10' },
    { name: 2, type: ConversionType.DEC, value: '20' },
  ];
  const expected = [
    { name: 0, type: ConversionType.DEC, value: '10' },
    { name: 2, type: ConversionType.DEC, value: '20' },
    { name: 3, type: ConversionType.DEC, value: '0' },
  ];

  expect(
    MacroService.rebalanceVars(sequence, ConversionType.DEC, testVars)
  ).toEqual(expected);
});

test('rebalance macro vars with deleted vars from sequence', async () => {
  const sequence = '1256asdf';
  const testVars = [
    { name: 0, type: ConversionType.DEC, value: '0' },
    { name: 2, type: ConversionType.DEC, value: '0' },
    { name: 3, type: ConversionType.DEC, value: '0' },
  ];

  expect(
    MacroService.rebalanceVars(sequence, ConversionType.DEC, testVars)
  ).toEqual([]);
});