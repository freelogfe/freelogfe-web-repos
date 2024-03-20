import * as React from 'react';
import styles from './index.less';
import FDropdownMenu from "@/components/FDropdownMenu";
import {Tree} from 'antd';
import FAutoComplete from "@/components/FAutoComplete";
import {connect} from 'dva';
import {ConnectState, InformalNodeManagerPageModelState} from "@/models/connect";
import {
  ChangeAction, OnReplacedEntityVersionChangeAction,
  OnReplacedKeywordChangeAction,
  OnReplacedMountAction, OnReplacedTreeLoadDataAction, OnReplacedUnmountAction,
} from "@/models/informalNodeManagerPage";
import * as AHooks from 'ahooks';
import FComponentsLib from '@freelog/components-lib';
import { Dispatch } from 'redux';

interface ReplacedProps {
  dispatch: Dispatch;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
}

function Replaced({dispatch, informalNodeManagerPage}: ReplacedProps) {

  AHooks.useMount(async () => {
    dispatch<OnReplacedMountAction>({
      type: 'informalNodeManagerPage/onReplacedMount',
    });
  });

  AHooks.useUnmount(() => {
    dispatch<OnReplacedUnmountAction>({
      type: 'informalNodeManagerPage/onReplacedUnmount',
    });
  });

  return (<>
    <div style={{height: 15}}/>
    <div className={styles.filter}>
      <FAutoComplete
        value={informalNodeManagerPage.replaceModal_Replaced_Keywords}
        options={informalNodeManagerPage.replaceModal_Replaced_DependencyTreeList.map<{ value: string; label: string; }>((dt) => {
          return {
            value: dt,
            label: dt,
          };
        })}
        debounce={300}
        className={styles.filterInput}
        onDebounceChange={(value) => {
          dispatch<OnReplacedKeywordChangeAction>({
            type: 'informalNodeManagerPage/onReplacedKeywordChange',
            payload: {
              value: value,
            },
          });
        }}
      />
      {
        informalNodeManagerPage.replaceModal_Replaced_SelectDependency?.versions &&
        informalNodeManagerPage.replaceModal_Replaced_SelectDependency.versions.length > 0 &&
        (<FDropdownMenu
          // options={replaceInformExhibit.replacedSelectDependency.versions.map((v) => ({value: v}))}
          options={informalNodeManagerPage.replaceModal_Replaced_TargetVersions}
          onChange={(value) => {
            // onChange({replacedTargetVersion: value});
            dispatch<OnReplacedEntityVersionChangeAction>({
              type: 'informalNodeManagerPage/onReplacedEntityVersionChange',
              payload: {
                value: value,
              },
            });
          }}
        >
          <div style={{cursor: 'pointer'}}>
            <FComponentsLib.FContentText
              type="additional2"
              text={informalNodeManagerPage.replaceModal_Replaced_TargetSelectedVersion?.text}
            />
          </div>
        </FDropdownMenu>)
      }

    </div>
    <div style={{height: 15}}/>
    <div className={styles.treeArea}>
      <Tree
        checkable
        loadData={async (node: any) => {
          dispatch<OnReplacedTreeLoadDataAction>({
            type: 'informalNodeManagerPage/onReplacedTreeLoadData',
            payload: node,
          });
        }}
        checkedKeys={informalNodeManagerPage.replaceModal_Replaced_CheckedKeys}
        onCheck={(checkedKeys) => {
          // console.log(checkedKeys, 'checkedKeys!@#$@#$@#@#$@#$');
          dispatch<ChangeAction>({
            type: 'informalNodeManagerPage/change',
            payload: {
              replaceModal_Replaced_CheckedKeys: checkedKeys as string[],
            },
          });
        }}
        treeData={informalNodeManagerPage.replaceModal_Replaced_TreeData}
        // treeData={treeData}
      />
    </div>
  </>);
}

export default connect(({informalNodeManagerPage}: ConnectState) => ({
  informalNodeManagerPage,
}))(Replaced);

// interface UpdateTreeDataParams {
//   list: TreeNode[];
//   key: React.Key;
//   children: TreeNode[];
// }
//
// function updateTreeData({list, key, children}: UpdateTreeDataParams): TreeNode[] {
//   return list.map(node => {
//     if (node.key === key) {
//       return {
//         ...node,
//         children,
//       };
//     } else if (node.children) {
//       return {
//         ...node,
//         children: updateTreeData({
//           list: node.children,
//           key,
//           children,
//         }),
//       };
//     }
//     return node;
//   });
// }
//
// interface OrganizeData {
//   id: string;
//   name: string;
//   type: string;
//   dependencies: OrganizeData[];
// }
//
// function organizeData(data: OrganizeData[], parentKey: string = ''): TreeNode[] {
//   // console.log(data, 'data2WQR@#SDfolkj;lk');
//   return data.map<TreeNode>((d) => {
//     const key = parentKey + ':' + (d.type === 'resource' ? '$' : '#') + d.name;
//
//     if (d.dependencies.length === 0) {
//       return {
//         title: d.name,
//         key,
//         id: d.id,
//         isLeaf: true,
//       };
//     }
//
//     return {
//       title: d.name,
//       key,
//       id: d.id,
//       isLeaf: false,
//       children: organizeData(d.dependencies, key),
//     };
//   });
// }
