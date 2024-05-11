import { t } from 'i18next';
import { Button } from 'primereact/button';
import { ContextMenu } from 'primereact/contextmenu';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';
import {
  Tree,
  TreeDragDropEvent,
  TreeExpandedKeysType,
  TreeNodeTemplateOptions,
} from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import React, { useEffect, useRef, useState } from 'react';
import { VscAdd, VscCollapseAll, VscGroupByRefType } from 'react-icons/vsc';
import MacroDialog from './MacroDialog';
import MacroTreeItem from './MacroTreeItem';
import { ConnectionStatusType, ConversionType, IDefaultProps, IPCChannelType, ITreeNode, MacroDataType, StoreKey } from '@minterm/types';
import { MacroService, SerialPortService, TreeNodeService } from '@minterm/services';
import clsx from 'clsx';

/**
 * Component for a macro tree. A macro tree is a dynamic listing of
 * macros and macro groups, whereas marco groups can contain further macros.
 * Every macro is represented by a node and can be edited by a context menu.
 *
 * @param IDefaultProps
 */
const MacroTree: React.FC<IDefaultProps> = ({ id, className }) => {
  const [nodes, setNodes] = useState<Array<ITreeNode> | undefined>(
    window.electron.store.get(StoreKey.MACROS)
  );
  const [expandedKeys, setExpandedKeys] = useState<
    TreeExpandedKeysType | undefined
  >({});
  const [selectedContextNode, setSelectedContextNode] = useState<ITreeNode>();
  const [lastSelectedNode, setLastSelectedNode] = useState<ITreeNode>();
  const [macroDialog, setMacroDialog] = useState(false);
  const [showHeaderIcons, setShowHeaderIcons] = useState(false);
  const cmMacro = useRef<any>(null);
  const cmMacroGroup = useRef<any>(null);
  const getContextMenu = (isMacroGroup: boolean) => {
    const menuMacro: Array<MenuItem> = [];
    if (!isMacroGroup) {
      menuMacro.push(
        {
          label: t('SEND'),
          command: () => {
            if (selectedContextNode !== undefined)
              executeMacro(selectedContextNode);
          },
        },
        {
          label: t('EDIT'),
          command: () => {
            setLastSelectedNode(
              selectedContextNode !== undefined
                ? selectedContextNode
                : undefined
            );
            setMacroDialog(true);
          },
        }
      );
    } else {
      menuMacro.push({
        label: t('SEND_ALL'),
        command: () => {
          if (selectedContextNode !== undefined)
            executeMacroGroup(selectedContextNode);
        },
      });
    }
    menuMacro.push(
      {
        separator: true,
      },
      {
        label: t('RENAME'),
        command: () => {
          const node = TreeNodeService.searchNode(
            selectedContextNode?.key?.toString(),
            nodes
          );
          if (node !== undefined) {
            node.isEditName = true;
            node.draggable = false;
            setNodes(
              TreeNodeService.replaceNode(node?.key?.toString(), node, nodes)
            );
          }
        },
      },
      {
        label: t('DELETE'),
        command: () => {
          if (selectedContextNode !== undefined) {
            setNodes(
              TreeNodeService.deleteNode(
                selectedContextNode?.key?.toString(),
                nodes
              )
            );
          }
        },
      }
    );
    return menuMacro;
  };

  useEffect(() => {
    window.electron.store.set(
      StoreKey.MACROS,
      TreeNodeService.resetEditMode(nodes)
    );
  }, [nodes]);

  /**
   * Adds a new node with the given macro and places it to the end
   * of the node list.
   *
   * @param macro macro to add
   */
  const addMacro = (macro: MacroDataType) => {
    const newNode: ITreeNode = {
      key: crypto.randomUUID(),
      data: macro,
      label: macro.name,
      isMacroGroup: false,
      isEditName: false,
      draggable: true,
    };
    if (nodes == null) {
      setNodes([newNode]);
    } else {
      setNodes([...nodes, newNode]);
    }
  };

  /**
   * When a macro was changed, a new node will be created that
   * replaces the old macro.
   *
   * @param macro macro to be replaced
   */
  const onEditMacro = (macro: MacroDataType) => {
    const newNode: ITreeNode = {
      key: crypto.randomUUID(),
      data: macro,
      label: macro.name,
      isMacroGroup: false,
      isEditName: false,
      draggable: true,
    };
    setNodes(
      TreeNodeService.replaceNode(
        lastSelectedNode?.key?.toString(),
        newNode,
        nodes
      )
    );
  };

  /**
   * Creates a new macro group and adds this at the end of the node list.
   */
  const createNewMacroGroup = () => {
    const newNode: ITreeNode = {
      key: crypto.randomUUID(),
      label: '',
      leaf: false,
      isMacroGroup: true,
      isEditName: true,
      draggable: false,
    };
    if (nodes == null) {
      setNodes([newNode]);
    } else {
      setNodes([...nodes, newNode]);
    }
  };

  const removeNode = (node: any) => {
    setNodes(TreeNodeService.deleteNode(node.key, nodes));
  };

  const updateNode = (node: any) => {
    setNodes(TreeNodeService.replaceNode(node.key, node, nodes));
  };

  const collapseAll = () => {
    setExpandedKeys({});
  };

  const onDragDrop = (event: TreeDragDropEvent) => {
    const dropNode = event.dropNode as ITreeNode;
    // dropNode can be a drop anchor or a macro group
    if (dropNode === null || dropNode.isMacroGroup) {
      const nodes = event.value as Array<ITreeNode>;
      setNodes(nodes);
    }
  };

  const getContextNodeKey = (): string | undefined => {
    return selectedContextNode?.key?.toString();
  };

  const getSelectedNodeData = () => {
    return lastSelectedNode !== undefined ? lastSelectedNode.data : undefined;
  };

  /**
   * Builds the message of a macro in applying the variables
   * and the append sequence and sends this to the SerialPortService.
   *
   * @param node Node to execute.
   */
  const executeMacro = (node: ITreeNode) => {
    let message = MacroService.buildSequence(node.data);
    if (node.data?.appendSequence !== undefined) {
      message += node.data?.appendSequence.command;
    }
    SerialPortService.sendMessage(
      message,
      node.data?.sequenceFormat || ConversionType.ASCII
    );
  };

  /**
   * Executes all macros of a macro group in order.
   *
   * @see {@link executeMacro}
   * @param node macro group
   */
  const executeMacroGroup = (node: ITreeNode) => {
    const portStatus = window.electron.ipcRenderer.fetch(
      IPCChannelType.PORT_STATUS
    );
    if (portStatus !== ConnectionStatusType.CONNECTED) {
      window.electron.ipcRenderer.sendMessage(IPCChannelType.PORT_STATUS, true);
      return;
    }

    const nodesToSend = TreeNodeService.collectAsList(
      node?.key?.toString(),
      nodes
    );
    if (nodesToSend !== undefined) {
      for (let index = 0; index < nodesToSend.length; index++) {
        executeMacro(nodesToSend[index]);
      }
    }
  };

  const getHeader = () => {
    return (
      <div className="menubar macro-menubar">
        <Menubar id={id} start={macroLabel} end={macroHeader} />
      </div>
    );
  };

  const nodeTemplate = (node: TreeNode, options: TreeNodeTemplateOptions) => {
    const _node = node as ITreeNode;
    return (
      <MacroTreeItem
        id={`${node.key}`}
        node={_node}
        options={options}
        removeNode={removeNode}
        updateNode={updateNode}
        onExecute={executeMacro}
        onExecuteGroup={executeMacroGroup}
      />
    );
  };

  const macroHeader = (
    <div hidden={!showHeaderIcons}>
      <Button
        icon={<VscGroupByRefType className="pi" />}
        className="p-button-text"
        tooltip={t('NEW_MACRO_GROUP')}
        tooltipOptions={{ showDelay: 500 }}
        onClick={(e) => createNewMacroGroup()}
      />
      <Button
        icon={<VscAdd className="pi" />}
        className="p-button-text"
        tooltip={t('NEW_SEQUENCE')}
        tooltipOptions={{ showDelay: 500 }}
        onClick={(e) => setMacroDialog(true)}
      />
      <Button
        icon={<VscCollapseAll className="pi" />}
        className="p-button-text"
        tooltip={t('COLLAPSE_MACRO_GROUPS')}
        tooltipOptions={{ showDelay: 500 }}
        onClick={() => collapseAll()}
      />
    </div>
  );

  const macroLabel = (
    <div>
      <label>{t('MACROS')}</label>
    </div>
  );

  return (
    <div id={`${id}:container`} className={clsx(className, "h-full w-full")}>
      <ContextMenu
        model={getContextMenu(false)}
        ref={cmMacro}
        onHide={(e) => {
          if (e) setSelectedContextNode(undefined);
        }}
      />
      <ContextMenu
        model={getContextMenu(true)}
        ref={cmMacroGroup}
        onHide={(e) => {
          if (e) setSelectedContextNode(undefined);
        }}
      />
      <MacroDialog
        id="newMacro"
        display={macroDialog}
        setDisplay={setMacroDialog}
        onAddMacro={addMacro}
        editMacro={getSelectedNodeData()}
        setEditMacro={setLastSelectedNode}
        onEditMacro={onEditMacro}
      />
      <div
        className="macro-tree h-full overflow-y-auto"
        onMouseOver={(e) => setShowHeaderIcons(true)}
        onMouseLeave={(e) => setShowHeaderIcons(false)}
      >
        <Tree
          value={nodes}
          dragdropScope="demo"
          onDragDrop={onDragDrop}
          expandedKeys={expandedKeys}
          onToggle={(e) => setExpandedKeys(e.value)}
          contextMenuSelectionKey={getContextNodeKey()}
          onContextMenuSelectionChange={(event) => {
            setSelectedContextNode(
              TreeNodeService.searchNode(event.value?.toString(), nodes)
            );
          }}
          onContextMenu={(event) => {
            const node = event.node as ITreeNode;
            if (node.isMacroGroup) {
              cmMacro.current?.hide(selectedContextNode !== undefined);
              cmMacroGroup.current?.show(event.originalEvent);
            } else {
              cmMacroGroup.current?.hide(selectedContextNode !== undefined);
              cmMacro.current?.show(event.originalEvent);
            }
          }}
          header={getHeader}
          nodeTemplate={nodeTemplate}
          showHeader
        />
      </div>
    </div>
  );
};

export default MacroTree;
