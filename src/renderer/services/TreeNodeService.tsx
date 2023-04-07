import { ITreeNode } from 'renderer/types/TreeNodeType';

export class TreeNodeService {
  /**
   * Searches recursively for a node with the key from the given
   * node tree. The result node can be a subtree itself.
   *
   * @param key key of the node
   * @param nodes node tree
   * @returns node or undefined, if not found
   */
  static searchNode = (
    key: string | undefined,
    nodes: Array<ITreeNode> | undefined
  ): ITreeNode | undefined => {
    if (nodes === undefined || key == undefined) {
      return undefined;
    }
    for (let index = 0; index < nodes.length; index++) {
      var elem = nodes[index];
      if (elem.isMacroGroup && elem.key !== key) {
        let children = elem.children as Array<ITreeNode>;
        var node = this.searchNode(key, children);
        if (node !== undefined) {
          return node;
        }
      }
      if (elem.key === key) {
        return elem;
      }
    }
    return undefined;
  };

  /**
   * Deletes the node with the key and therefore also all the subnodes.
   * The given node tree is not beeing affected.
   *
   * @param key node with the key
   * @param nodes node tree
   * @returns node tree without the node
   */
  static deleteNode = (
    key: string | undefined,
    nodes: Array<ITreeNode> | undefined
  ): Array<ITreeNode> | undefined => {
    if (nodes === undefined || key == undefined) {
      return undefined;
    }
    let _nodes = JSON.parse(JSON.stringify(nodes));
    for (let index = 0; index < _nodes.length; index++) {
      let elem = _nodes[index];
      if (elem.isMacroGroup && elem.key !== key) {
        let children = elem.children as Array<ITreeNode>;
        let leftNodes = this.deleteNode(key, children);
        if (leftNodes !== undefined) {
          elem.children = leftNodes;
          return _nodes;
        }
      }
      if (elem.key === key) {
        _nodes.splice(index, 1);
        return _nodes;
      }
    }
    return undefined;
  };

  /**
   * Replaces a certain node in the node tree. All subnodes of the specific node
   * may also be removed, if not present in the replacement. The given node tree is not
   * beeing affected.
   *
   * @param key key of the node to replace
   * @param newNode replacement node
   * @param nodes node tree
   * @returns node tree with replaced node
   */
  static replaceNode = (
    key: string | undefined,
    newNode: ITreeNode,
    nodes: Array<ITreeNode> | undefined
  ): Array<ITreeNode> | undefined => {
    if (nodes === undefined || key == undefined) {
      return undefined;
    }
    let _nodes: Array<ITreeNode> = JSON.parse(JSON.stringify(nodes));
    for (let index = 0; index < _nodes.length; index++) {
      let elem = _nodes[index];
      if (elem.isMacroGroup && elem.key !== key) {
        let children = elem.children as Array<ITreeNode>;
        let leftNodes = this.replaceNode(key, newNode, children);
        if (leftNodes !== undefined) {
          elem.children = leftNodes;
          return _nodes;
        }
      }
      if (elem.key === key) {
        _nodes[index] = newNode;
        return _nodes;
      }
    }
    return undefined;
  };

  /**
   * Collects recursively all nodes starting from specific node
   * and builds a list of nodes.
   *
   * @param key key of the node to start from
   * @param nodes node tree
   * @returns list of nodes
   */
  static collectAsList = (
    key: string | undefined,
    nodes: Array<ITreeNode> | undefined
  ): Array<ITreeNode> | undefined => {
    let node = this.searchNode(key, nodes);
    if (node === undefined || key == undefined) {
      return undefined;
    }
    let res: Array<ITreeNode> = [];
    if (!node.isMacroGroup) {
      return [node];
    }
    if (node.children !== undefined) {
      for (let index = 0; index < node.children.length; index++) {
        let elem = node.children[index] as ITreeNode;
        if (elem.isMacroGroup) {
          let nodes = this.collectAsList(elem.key?.toString(), [elem]);
          if (nodes !== undefined) {
            res = res.concat(nodes);
          }
        } else {
          res.push(elem);
        }
      }
    }
    return res;
  };

  /**
   * Resets the edit mode of all nodes. The given node tree is not
   * beeing affected.
   *
   * @param nodes node tree
   * @returns nodes without edit mode
   */
  static resetEditMode = (
    nodes: Array<ITreeNode> | undefined
  ): Array<ITreeNode> | undefined => {
    if (nodes === undefined) {
      return undefined;
    }
    let _nodes: Array<ITreeNode> = JSON.parse(JSON.stringify(nodes));
    for (let index = 0; index < _nodes.length; index++) {
      let elem = _nodes[index];
      if (elem.isMacroGroup) {
        let children = elem.children as Array<ITreeNode>;
        let leftNodes = this.resetEditMode(children);
        if (leftNodes !== undefined) {
          elem.children = leftNodes;
        }
      }
      elem.isEditName = false;
    }
    return _nodes;
  };
}
