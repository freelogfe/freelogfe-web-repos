import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import FDropdownMenu from "@/components/FDropdownMenu";
import {FContentText} from '@/components/FText';
import {Tree} from 'antd';
import FAutoComplete from "@/components/FAutoComplete";
import {connect, Dispatch} from 'dva';
import {ConnectState, ReplaceInformExhibitState} from "@/models/connect";
import {
  ChangeAction,
  OnReplacedKeywordChangeAction,
  // FetchDependencyTreeAction,
  OnReplacedMountAction, OnReplacedTreeLoadDataAction,
  TreeNode
} from "@/models/replaceInformExhibitModal";
import {WholeMutable} from "@/models/shared";
import {FServiceAPI} from '@freelog/tools-lib';
import * as AHooks from 'ahooks';

interface ReplacedProps {
  dispatch: Dispatch;
  replaceInformExhibit: ReplaceInformExhibitState;
}

function Replaced({dispatch, replaceInformExhibit}: ReplacedProps) {

  // onReplacedMount
  AHooks.useMount(async () => {
    dispatch<OnReplacedMountAction>({
      type: 'replaceInformExhibit/onReplacedMount',
    });
    // console.log(result, '$$$$$$$4444rrrrrrr');
  });

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
        onDebounceChange={(value) => {
          // console.log(value, 'value1232adsjpkl;l;sdf4');
          // await onChange({replacedKeywords: value});
          // await dispatch<FetchDependencyTreeAction>({
          //   type: 'replaceInformExhibit/fetchDependencyTree',
          // });
          dispatch<OnReplacedKeywordChangeAction>({
            type: 'replaceInformExhibit/onReplacedKeywordChange',
            payload: {
              value: value,
            },
          });
        }}
      />
      {
        replaceInformExhibit.replacedSelectDependency?.versions &&
        replaceInformExhibit.replacedSelectDependency.versions.length > 0 &&
        (<FDropdownMenu
          options={replaceInformExhibit.replacedSelectDependency.versions.map((v) => ({value: v}))}
          onChange={(value) => {
            onChange({replacedTargetVersion: value});
          }}
        >
          <FContentText
            type="additional2"
            text={replaceInformExhibit.replacedTargetVersion || '选择版本'}
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

          dispatch<OnReplacedTreeLoadDataAction>({
            type: 'replaceInformExhibit/onReplacedTreeLoadData',
            payload: node,
          });

          // if (node.pos.split(':').length !== 2) {
          //   return;
          // }
          // const params: Parameters<typeof FServiceAPI.InformalNode.dependencyTreeFilter>[0] = {
          //   testResourceId: node.id,
          //   dependentEntityId: replaceInformExhibit.replacedSelectDependency?.id || '',
          // };
          // const {data} = await FServiceAPI.InformalNode.dependencyTreeFilter(params);
          // // console.log(data, 'dependencyTreeFilter!@#$@!#$@#$@#$');
          // const result = updateTreeData({
          //   list: replaceInformExhibit.replacedTreeData as TreeNode[],
          //   key: node.key,
          //   children: organizeData(data, node.key),
          // });
          //
          // // console.log(result, 'result2094uo1234u234');
          // await dispatch<ChangeAction>({
          //   type: 'replaceInformExhibit/change',
          //   payload: {
          //     replacedTreeData: result,
          //   },
          // });
        }}
        checkedKeys={replaceInformExhibit.replacedCheckedKeys}
        onCheck={(checkedKeys) => {
          // console.log(checkedKeys, 'checkedKeys!@#$@#$@#@#$@#$');
          dispatch<ChangeAction>({
            type: 'replaceInformExhibit/change',
            payload: {
              replacedCheckedKeys: checkedKeys as string[],
            },
          });
        }}
        treeData={replaceInformExhibit.replacedTreeData}
        // treeData={treeData}
      />
    </div>
  </>);
}

export default connect(({replaceInformExhibit}: ConnectState) => ({
  replaceInformExhibit,
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
