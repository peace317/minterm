import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { TreeNodeTemplateOptions } from 'primereact/tree';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VscDebugStart, VscEdit, VscRunAll } from 'react-icons/vsc';
import { ConversionType, IDefaultProps, ITreeNode, MacroVariableType } from '@minterm/types';
import MacroVariableList from './MacroVariableList';

interface IMacroTreeItemProps extends IDefaultProps {
  node: ITreeNode;
  options?: TreeNodeTemplateOptions;
  removeNode?(node: ITreeNode): void;
  updateNode?(node: ITreeNode): void;
  onExecute?(node: ITreeNode): void;
  onExecuteGroup?(node: ITreeNode): void;
}

/**
 * Component/template for a macro tree item. These tree items have
 * additional buttons for executing a macro or a macro group, if the
 * tree item contains child's. Tree items that are leafs can contain
 * variables that can be adjusted in an overlay panel.
 *
 * @param IMacroTreeItemProps
 */
const MacroTreeItem: React.FC<IMacroTreeItemProps> = ({
  id,
  className,
  node,
  options,
  removeNode = () => {},
  updateNode = () => {},
  onExecute = () => {},
  onExecuteGroup = () => {},
}) => {
  const { t } = useTranslation();
  const [mouseOver, setMouseOver] = useState(false);
  const [clickInTextField, setClickInTextField] = useState(false);
  const [clickForCommit, setClickForCommit] = useState(false);
  const [newName, setNewName] = useState(node.label);
  const [isEditName, setIsEditName] = useState(node.isEditName);
  const [displayVariableDialog, setDisplayVariableDialog] =
    useState<boolean>(false);

  useEffect(() => {
    setIsEditName(node.isEditName);
  }, [{ node }]);

  useEffect(() => {
    if (isEditName) {
      document
        .getElementById(`:${id}:treeitem`)
        ?.addEventListener('mousedown', onMouseInTextField, false);
      window.addEventListener('mousedown', onMouseDownWindow, false);
    }
  }, [isEditName]);

  useEffect(() => {
    if (clickForCommit && !clickInTextField) {
      if (node.label?.length === 0 && newName?.length === 0) {
        removeNode(node);
      } else {
        renameNode();
      }
      removeListener();
      setClickForCommit(false);
    }
    if (clickForCommit) setClickForCommit(false);

    if (clickInTextField) setClickInTextField(false);
  }, [clickForCommit]);

  const onKeyPressed = (e: any) => {
    if (e.key === 'Enter') {
      renameNode();
      removeListener();
    }
  };

  const renameNode = () => {
    if (newName?.length !== 0) {
      node.label = newName;
    }
    if (!node.isMacroGroup) {
      node.draggable = true;
      if (node.data !== undefined && newName !== undefined)
        node.data.name = newName;
    }
    node.isEditName = false;
    setNewName(node.label);
    setIsEditName(false);
    updateNode(node);
  };

  const onMouseDownWindow = useCallback((e: any) => {
    setClickForCommit(true);
  }, []);

  const onMouseInTextField = useCallback((e: any) => {
    setClickInTextField(true);
  }, []);

  const removeListener = () => {
    document
      .getElementById(`:${id}:treeitem`)
      ?.removeEventListener('mousedown', onMouseInTextField, false);
    window.removeEventListener('mousedown', onMouseDownWindow, false);
  };

  const onVariableChange = (variable: MacroVariableType) => {
    let current: MacroVariableType | undefined = node.data?.variables?.filter(
      (e) => e.name === variable.name
    )[0];
    if (current === undefined)
      console.error(`Variable with name ${variable.name} not found.`);
    current = variable;
    updateNode(node);
  };

  const getErrorMessage = () => {
    if (newName?.length === 0 && node.label?.length !== 0) {
      document.getElementById('renameInput')?.classList.add('p-invalid');
      return (
        newName?.length === 0 &&
        node.label?.length !== 0 && (
          <small className="p-error">{t('MACRO_NAME_NOT_PROVIDED')}</small>
        )
      );
    }
    document.getElementById('renameInput')?.classList.remove('p-invalid');
  };

  const executeButton = () => {
    if (isEditName) {
      return;
    }
    if (node.isMacroGroup) {
      return (
        <div>
          <Button
            id="buttonExecuteAll"
            visible={mouseOver}
            icon={<VscRunAll className="pi" />}
            className="p-button-text"
            tooltip={t('SEND_ALL')}
            tooltipOptions={{ showDelay: 500 }}
            onClick={(e) => onExecuteGroup(node)}
          />
        </div>
      );
    }
    return (
      <div>
        <Button
          id="buttonExecute"
          visible={mouseOver}
          icon={<VscDebugStart className="pi" />}
          className="p-button-text"
          tooltip={t('SEND')}
          tooltipOptions={{ showDelay: 500 }}
          onClick={(e) => onExecute(node)}
        />
      </div>
    );
  };

  const changeVariablePopupButton = () => {
    if (isEditName || node.isMacroGroup) {
      return;
    }

    return (
      <div>
        <Button
          id="buttonShowVarOverlay"
          visible={mouseOver && node.data?.variables?.length !== 0}
          icon={<VscEdit className="pi" />}
          className="p-button-text"
          tooltip={t('CHANGE_VARIABLES')}
          tooltipOptions={{ showDelay: 500 }}
          onClick={(e) => setDisplayVariableDialog(true)}
        />
      </div>
    );
  };

  const labelName = () => {
    if (isEditName) {
      return (
        <div>
          <div>
            <InputText
              id="renameInput"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={32}
              style={{ zIndex: 4 }}
              onKeyDown={onKeyPressed}
            />
          </div>
          {getErrorMessage()}
        </div>
      );
    }
    return <span id="macroName">{node.label}</span>;
  };

  return (
    <div id="container" className={`${className} w-full`}>
      <div
        className=" macro-tree-item w-full"
        onMouseOver={(e) => setMouseOver(true)}
        onMouseLeave={(e) => setMouseOver(false)}
      >
        <div id={`:${id}:treeitem`} className="inline-flex">
          {labelName()}
          {executeButton()}
          {changeVariablePopupButton()}
        </div>
      </div>
      <Dialog
        id="changeVariablesDialog"
        header={`${t('CHANGE_VARIABLES')}: ${node.data?.name}`}
        visible={displayVariableDialog}
        onHide={() => setDisplayVariableDialog(false)}
        modal={false}
        style={{ width: '40rem' }}
        resizable
      >
        {node.data?.variables !== undefined && (
          <MacroVariableList
            id={`:${id}:variableList`}
            variables={node.data?.variables}
            typeChangeable={node.data?.sequenceFormat === ConversionType.ASCII}
            deletable={false}
            onVariableChange={onVariableChange}
          />
        )}
      </Dialog>
    </div>
  );
};

export default MacroTreeItem;
