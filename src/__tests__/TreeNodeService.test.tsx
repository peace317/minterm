import '@testing-library/jest-dom';
import { TreeNodeService } from '../renderer/services/TreeNodeService';
import { ITreeNode } from '../renderer/types/TreeNodeType';

function createMacroGroup(key: string): ITreeNode {
  return {
    key: key,
    label: '',
    leaf: false,
    isMacroGroup: true,
    isEditName: true,
    draggable: true,
  };
}

function createMacro(key: string): ITreeNode {
  return {
    key: key,
    label: '',
    leaf: false,
    isMacroGroup: false,
    isEditName: true,
    draggable: true,
  };
}

test('test search empty list', async () => {
  expect(TreeNodeService.searchNode('1', [])).toEqual(undefined);
});

test('test search with one element', async () => {
  const node = createMacroGroup('1');
  expect(TreeNodeService.searchNode('1', [node])).toEqual(node);
});

test('test search with two elements with leading macro group', async () => {
  const nodes = [createMacroGroup('1'), createMacroGroup('2')];
  expect(TreeNodeService.searchNode('2', nodes)).toEqual(nodes[1]);
});

test('test search children of macro group', async () => {
  const node = createMacroGroup('1');
  const exp = createMacro('1-2');
  node.children = [createMacro('1-1'), exp];
  expect(TreeNodeService.searchNode('1-2', [node])).toEqual(exp);
});

test('test search children of macro group in list', async () => {
  const node = createMacroGroup('3');
  const exp = createMacro('3-2');
  node.children = [createMacro('3-1'), exp];
  const nodes = [createMacroGroup('1'), createMacro('2'), node];
  expect(TreeNodeService.searchNode('3-2', nodes)).toEqual(exp);
});

test('test search unknown element', async () => {
  const node = createMacroGroup('3');
  node.children = [createMacro('3-1'), createMacro('3-2')];
  const nodes = [createMacroGroup('1'), createMacro('2'), node];
  expect(TreeNodeService.searchNode('3-3', nodes)).toEqual(undefined);
});

test('test search nested element', async () => {
  const nestedNode = createMacroGroup('1-2');
  const exp = createMacro('1-2-2');
  nestedNode.children = [createMacro('1-2-1'), exp];
  const node = createMacroGroup('1');
  node.children = [createMacro('1-1'), nestedNode];
  const nodes = [createMacroGroup('1'), nestedNode];
  expect(TreeNodeService.searchNode('1-2-2', nodes)).toEqual(exp);
});

/* ------ Test deleteNode Method --------- */
test('test delete with empty nodes', async () => {
  expect(TreeNodeService.deleteNode('1', [])).toEqual(undefined);
});

test('test delete with one element', async () => {
  const node = createMacroGroup('1');
  expect(TreeNodeService.deleteNode('1', [node])).toEqual([]);
});

test('test delete with two elements and leading macro group', async () => {
  const nodes = [createMacroGroup('1'), createMacroGroup('2')];

  const nodesCpy = JSON.parse(JSON.stringify(nodes));
  expect(TreeNodeService.deleteNode('2', nodes)).toEqual([nodes[0]]);
  expect(nodes).toEqual(nodesCpy);
});

test('test delete children of macro group', async () => {
  const node = createMacroGroup('1');
  node.children = [createMacro('1-1'), createMacro('1-2')];
  const nodes = [node];

  const exp = createMacroGroup('1');
  exp.children = [createMacro('1-1')];
  const nodesCpy = JSON.parse(JSON.stringify(nodes));
  expect(TreeNodeService.deleteNode('1-2', nodes)).toEqual([exp]);
  expect(nodes).toEqual(nodesCpy);
});

test('test delete children of macro group in list', async () => {
  const node = createMacroGroup('3');
  node.children = [createMacro('3-1'), createMacro('3-2')];
  const nodes = [createMacroGroup('1'), createMacro('2'), node];

  const expNode = createMacroGroup('3');
  expNode.children = [createMacro('3-1')];
  const expNodes = [createMacroGroup('1'), createMacro('2'), expNode];
  expect(TreeNodeService.deleteNode('3-2', nodes)).toEqual(expNodes);
});

test('test delete macro group in list with children', async () => {
  const node = createMacroGroup('3');
  node.children = [createMacro('3-1'), createMacro('3-2')];
  const nodes = [createMacroGroup('1'), createMacro('2'), node];

  const expNodes = [createMacroGroup('1'), createMacro('2')];
  expect(TreeNodeService.deleteNode('3', nodes)).toEqual(expNodes);
});

test('test delete unknown element', async () => {
  const node = createMacroGroup('3');
  node.children = [createMacro('3-1'), createMacro('3-2')];
  const nodes = [createMacroGroup('1'), createMacro('2'), node];
  expect(TreeNodeService.deleteNode('3-3', nodes)).toEqual(undefined);
});

test('test delete nested element', async () => {
  const nestedNode = createMacroGroup('2-2');
  nestedNode.children = [createMacro('2-2-1'), createMacro('2-2-2')];
  const node = createMacroGroup('2');
  node.children = [createMacro('2-1'), nestedNode];
  const nodes = [createMacroGroup('1'), node];

  const expNestedNode = createMacroGroup('2-2');
  expNestedNode.children = [createMacro('2-2-1')];
  const expNode = createMacroGroup('2');
  expNode.children = [createMacro('2-1'), expNestedNode];
  const expNodes = [createMacroGroup('1'), expNode];
  expect(TreeNodeService.deleteNode('2-2-2', nodes)).toEqual(expNodes);
});

/* ------ Test replaceNode Method --------- */
test('test replace with empty list', async () => {
  expect(TreeNodeService.replaceNode('1', createMacro('1'), [])).toEqual(
    undefined
  );
});

test('test replace with one element', async () => {
  const newNode = createMacroGroup('2');
  expect(
    TreeNodeService.replaceNode('1', newNode, [createMacroGroup('1')])
  ).toEqual([newNode]);
});

test('test replace with two elements and leading macro group', async () => {
  const nodes = [createMacroGroup('1'), createMacroGroup('2')];

  const expNodes = [createMacroGroup('1'), createMacroGroup('3')];
  const nodesCpy = JSON.parse(JSON.stringify(nodes));
  expect(
    TreeNodeService.replaceNode('2', createMacroGroup('3'), nodes)
  ).toEqual(expNodes);
  // also tests, that the parameter object has not changed
  expect(nodes).toEqual(nodesCpy);
});

test('test replace macro group with macro', async () => {
  const nodes = [createMacroGroup('1'), createMacroGroup('2')];

  const expNodes = [createMacroGroup('1'), createMacro('3')];
  const nodesCpy = JSON.parse(JSON.stringify(nodes));
  expect(TreeNodeService.replaceNode('2', createMacro('3'), nodes)).toEqual(
    expNodes
  );
  expect(nodes).toEqual(nodesCpy);
});

test('test replace children of macro group', async () => {
  const node = createMacroGroup('1');
  node.children = [createMacro('1-1'), createMacro('1-2')];
  const nodes = [node];

  const exp = createMacroGroup('1');
  exp.children = [createMacro('1-1'), createMacro('1-4')];
  const nodesCpy = JSON.parse(JSON.stringify(nodes));
  expect(TreeNodeService.replaceNode('1-2', createMacro('1-4'), nodes)).toEqual(
    [exp]
  );
  expect(nodes).toEqual(nodesCpy);
});

test('test replace first child of macro group', async () => {
  const node = createMacroGroup('1');
  node.children = [createMacro('1-1'), createMacro('1-2')];
  const nodes = [node];

  const exp = createMacroGroup('1');
  exp.children = [createMacro('1-4'), createMacro('1-2')];
  expect(TreeNodeService.replaceNode('1-1', createMacro('1-4'), nodes)).toEqual(
    [exp]
  );
});

test('test replace children of macro group in list', async () => {
  const node = createMacroGroup('3');
  node.children = [createMacro('3-1'), createMacro('3-2')];
  const nodes = [createMacroGroup('1'), createMacro('2'), node];

  const expNode = createMacroGroup('3');
  expNode.children = [createMacro('3-1'), createMacro('4-2')];
  const expNodes = [createMacroGroup('1'), createMacro('2'), expNode];
  expect(TreeNodeService.replaceNode('3-2', createMacro('4-2'), nodes)).toEqual(
    expNodes
  );
});

test('test replace macro group in list with children', async () => {
  const node = createMacroGroup('3');
  node.children = [createMacro('3-1'), createMacro('3-2')];
  const nodes = [createMacroGroup('1'), createMacro('2'), node];

  const expNodes = [createMacroGroup('1'), createMacro('2'), createMacro('4')];
  expect(TreeNodeService.replaceNode('3', createMacro('4'), nodes)).toEqual(
    expNodes
  );
});

test('test replace unknown element', async () => {
  const node = createMacroGroup('3');
  node.children = [createMacro('3-1'), createMacro('3-2')];
  const nodes = [createMacroGroup('1'), createMacro('2'), node];
  expect(TreeNodeService.replaceNode('3-3', createMacro('2'), nodes)).toEqual(
    undefined
  );
});

test('test replace nested element', async () => {
  const nestedNode = createMacroGroup('2-2');
  nestedNode.children = [createMacro('2-2-1'), createMacro('2-2-2')];
  const node = createMacroGroup('2');
  node.children = [createMacro('2-1'), nestedNode];
  const nodes = [createMacroGroup('1'), node];

  const expNestedNode = createMacroGroup('2-2');
  expNestedNode.children = [createMacro('2-2-1'), createMacro('2-5-2')];
  const expNode = createMacroGroup('2');
  expNode.children = [createMacro('2-1'), expNestedNode];
  const expNodes = [createMacroGroup('1'), expNode];
  expect(
    TreeNodeService.replaceNode('2-2-2', createMacro('2-5-2'), nodes)
  ).toEqual(expNodes);
});

/* ------ Test collectAsList Method --------- */
test('test collect with empty list', async () => {
  expect(TreeNodeService.collectAsList('1', [])).toEqual(undefined);
});

test('test collect with one element', async () => {
  const node = createMacro('1');
  expect(TreeNodeService.collectAsList('1', [node])).toEqual([node]);
});

test('test collect with leading macro group', async () => {
  const nodes = [createMacroGroup('1'), createMacro('2')];

  expect(TreeNodeService.collectAsList('2', nodes)).toEqual([createMacro('2')]);
});

test('test collect children of macro group', async () => {
  const node = createMacroGroup('2');
  const children = [createMacro('2-1'), createMacro('2-2')];
  node.children = children;
  const nodes = [createMacro('1-1'), node];

  expect(TreeNodeService.collectAsList('2', nodes)).toEqual(children);
});

test('test collect unknown element', async () => {
  const node = createMacroGroup('3');
  node.children = [createMacro('3-1'), createMacro('3-2')];
  const nodes = [createMacroGroup('1'), createMacro('2'), node];
  expect(TreeNodeService.collectAsList('3-3', nodes)).toEqual(undefined);
});

test('test collect with no children', async () => {
  const nodes = [
    createMacroGroup('1'),
    createMacro('2'),
    createMacroGroup('3'),
  ];
  expect(TreeNodeService.collectAsList('3', nodes)).toEqual([]);
});

test('test collect group with nested elements', async () => {
  const nestedNode = createMacroGroup('2-2');
  nestedNode.children = [createMacro('2-2-1'), createMacro('2-2-2')];
  const node = createMacroGroup('2');
  node.children = [createMacro('2-1'), createMacro('2-2'), nestedNode];
  const nodes = [createMacroGroup('1'), node];

  const expNodes = [
    createMacro('2-1'),
    createMacro('2-2'),
    createMacro('2-2-1'),
    createMacro('2-2-2'),
  ];
  expect(TreeNodeService.collectAsList('2', nodes)).toEqual(expNodes);
});
