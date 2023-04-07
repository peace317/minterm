import TreeNode from "primereact/treenode";
import { MacroDataType } from "./MacroDataType";

export interface ITreeNode extends TreeNode {
  key: string | number;
  isMacroGroup: boolean,
  isEditName: boolean,
  data?: MacroDataType
}
