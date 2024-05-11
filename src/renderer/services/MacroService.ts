import { MacroVariableType, MacroDataType, ConversionType } from '@minterm/types';

/**
 * Regex that will be applied on string sequences to find and replace
 * variables. Variables can only match id's from 0-9, any other sequence
 * within the parentheses are ignored.
 */
export const regexVariable = /#{[0-9]}/g;

/**
 * Service class for macro related tasks.
 */
export class MacroService {
  /**
   * Creates a new variable for the given sequence. Variables are created
   * with ascending id's, even if the sequence contains unordered variables,
   * the new variable becomes the next available id.
   *
   * @param sequence sequence
   * @returns new variable
   */
  static createNewVariable = (
    sequence: string,
    type: ConversionType
  ): MacroVariableType | undefined => {
    const vars = this.getVarsWithoutDuplicates(sequence);
    if (vars.length === 0) {
      return { name: 0, type, value: '0' };
    }
    for (let index = 0; index < vars.length; index++) {
      if (vars[index] !== index) {
        return { name: index, type, value: '0' };
      }
    }
    if (vars[vars.length - 1] < 9) {
      return {
        name: vars[vars.length - 1] + 1,
        type,
        value: '0',
      };
    }
    return undefined;
  };

  /**
   * Adds a new placeholder for a variable to the end of the given
   * sequence. A variable is referenced as '#{variable name}', whereas
   * the variable name is a number.
   *
   * @param sequence sequence
   * @param variable variable to add
   * @returns sequence with the variable
   */
  static addVariableToSequence = (
    sequence: string,
    variable: MacroVariableType
  ): string => {
    let newSequence = sequence;
    newSequence = newSequence.concat(`#{${variable.name}}`);
    return newSequence;
  };

  /**
   * Removes all occurrences of the given variable in the sequence.
   *
   * @param sequence sequence
   * @param variable variable to be remove
   * @returns sequence without variable placeholder
   */
  static removeVariableFromSequence = (
    sequence: string,
    variable: MacroVariableType
  ): string => {
    let newSequence = sequence;
    const vars = this.getVarsAsList(sequence);
    if (vars.length !== 0) {
      newSequence = newSequence.replaceAll(`#{${variable.name}}`, '');
    }
    return newSequence;
  };

  /**
   * Rebalances the list of variables based on the sequence. If a variable
   * doesn't occurs in the sequence anymore, it will be removed. Unknown variables
   * will be added to list.
   *
   * @param sequence sequence
   * @param variables variable list
   * @returns list with variables only in the sequence
   */
  static rebalanceVars = (
    sequence: string,
    type: ConversionType,
    variables: MacroVariableType[]
  ): MacroVariableType[] => {
    const vars = this.getVarsWithoutDuplicates(sequence);
    const balancedMacroVars: MacroVariableType[] = [];
    if (vars.length > 0) {
      for (let index = 0; index < vars.length; index++) {
        const macroInUse = variables.find((e) => e.name === vars[index]);
        if (macroInUse !== undefined) {
          balancedMacroVars.push(macroInUse);
        } else {
          balancedMacroVars.push({
            name: vars[index],
            type,
            value: '0',
          });
        }
      }
    }
    return balancedMacroVars;
  };

  /**
   * Builds a sequence by replacing the variable placeholders with there actual
   * value.
   *
   * @param macro macro
   * @returns sequence with actual variable values
   */
  static buildSequence = (macro: MacroDataType | undefined): string => {
    if (macro === undefined) return '';
    let res = macro.sequence;
    if (macro.variables !== undefined) {
      for (let index = 0; index < macro.variables.length; index++) {
        const variable = macro.variables[index];
        res = res.replaceAll(`#{${variable.name}}`, variable.value.toString());
      }
    }
    return res;
  };

  /**
   * Builds a list with all variables in the sequence sorted without
   * duplicates.
   *
   * @param sequence sequence
   * @returns list without duplicates
   */
  static getVarsWithoutDuplicates = (sequence: string): number[] => {
    return Array.from(new Set(this.getVarsAsList(sequence)));
  };

  /**
   * Builds a list with all variables in the sequence sorted.
   *
   * @param sequence sequence
   * @returns list of variables
   */
  static getVarsAsList = (sequence: string): number[] => {
    const vars = sequence.match(regexVariable);
    const res = [];
    if (vars !== null) {
      for (let index = 0; index < vars.length; index++) {
        const variable = vars[index].replace('#{', '').replace('}', '');
        res.push(parseInt(variable, 10));
      }
    }
    return res.sort();
  };
}
