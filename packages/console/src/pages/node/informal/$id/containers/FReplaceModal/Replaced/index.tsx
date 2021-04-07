import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import FDropdownMenu from "@/components/FDropdownMenu";
import {FContentText} from '@/components/FText';
import {Tree} from 'antd';
import FAutoComplete from "@/components/FAutoComplete";
import {connect, Dispatch} from 'dva';
import {ConnectState, ReplaceInformExhibitState} from "@/models/connect";
import {ChangeAction, FetchDependencyTreeAction, TreeNode} from "@/models/replaceInformExhibitModal";
import {WholeMutable} from "@/models/shared";
import {FApiServer} from "@/services";

interface ReplacedProps {
  dispatch: Dispatch;
  replaceInformExhibit: ReplaceInformExhibitState;
}

function Replaced({dispatch, replaceInformExhibit}: ReplacedProps) {

  async function onChange(payload: Partial<ReplaceInformExhibitState>) {
    await dispatch<ChangeAction>({
      type: 'replaceInformExhibit/change',
      payload: payload,
    });
  }

  return (<>
    <div style={{height: 15}}/>
    <div className={styles.filter}>
      <FAutoComplete
        value={replaceInformExhibit.replacedKeywords}
        options={replaceInformExhibit.replacedDependencyTreeList.map<{ value: string; }>((dt) => {
          return {
            value: dt,
          };
        })}
        debounce={300}
        className={styles.filterInput}
        onDebounceChange={async (value) => {
          // console.log(value, 'value1232adsjpkl;l;sdf4');
          await onChange({replacedKeywords: value});
          await dispatch<FetchDependencyTreeAction>({
            type: 'replaceInformExhibit/fetchDependencyTree',
          });
        }}
      />
      {
        replaceInformExhibit.replacedSelectDependency?.versions &&
        replaceInformExhibit.replacedSelectDependency.versions.length > 0 &&
        (<FDropdownMenu
          options={replaceInformExhibit.replacedSelectDependency.versions.map((v) => ({value: v}))}
          onChange={(value) => {
            onChange({replacedVersion: value});
          }}
        >
          <FContentText
            type="additional2"
            text={replaceInformExhibit.replacedVersion || '选择版本'}
          />
        </FDropdownMenu>)
      }

    </div>
    <div style={{height: 15}}/>
    <div className={styles.treeArea}>
      <Tree
        checkable
        loadData={async (node: any) => {
          // console.log(node, 'n2390jlkjdsfdsf');
          if (node.pos.split('-').length !== 2) {
            return;
          }
          const params: Parameters<typeof FApiServer.InformalNode.dependencyTreeFilter>[0] = {
            testResourceId: node.id,
            dependentEntityId: replaceInformExhibit.replacedSelectDependency?.id || '',
          };
          const {data} = await FApiServer.InformalNode.dependencyTreeFilter(params);
          // console.log(data, 'dependencyTreeFilter!@#$@!#$@#$@#$');
          const result = updateTreeData({
            list: replaceInformExhibit.treeData as TreeNode[],
            key: node.key,
            children: organizeData(data, node.key),
          });

          // console.log(result, 'result2094uo1234u234');
          await dispatch<ChangeAction>({
            type: 'replaceInformExhibit/change',
            payload: {
              treeData: result,
            },
          });
        }}
        checkedKeys={replaceInformExhibit.checkedKeys as string[]}
        onCheck={(checkedKeys) => {
          // console.log(checkedKeys, 'checkedKeys!@#$@#$@#@#$@#$');
          dispatch<ChangeAction>({
            type: 'replaceInformExhibit/change',
            payload: {
              checkedKeys: checkedKeys as string[],
            }
          })
        }}
        treeData={replaceInformExhibit.treeData as WholeMutable<ReplaceInformExhibitState['treeData']>}
        // treeData={treeData}
      />
    </div>
  </>);
}

export default connect(({replaceInformExhibit}: ConnectState) => ({
  replaceInformExhibit,
}))(Replaced);

interface UpdateTreeDataParams {
  list: TreeNode[];
  key: React.Key;
  children: TreeNode[];
}

function updateTreeData({list, key, children}: UpdateTreeDataParams): TreeNode[] {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData({
          list: node.children,
          key,
          children,
        }),
      };
    }
    return node;
  });
}

interface OrganizeData {
  id: string;
  name: string;
  type: string;
  dependencies: OrganizeData[];
}

function organizeData(data: OrganizeData[], parentKey: string = ''): TreeNode[] {
  // console.log(data, 'data2WQR@#SDfolkj;lk');
  return data.map<TreeNode>((d) => {
    const key = parentKey + '-' + (d.type === 'resource' ? '$' : '#') + d.name;

    if (d.dependencies.length === 0) {
      return {
        title: d.name,
        key,
        id: d.id,
        isLeaf: true,
      };
    }

    return {
      title: d.name,
      key,
      id: d.id,
      isLeaf: false,
      children: organizeData(d.dependencies, key),
    };
  });
}
