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
  ChangeAction, OnReplacedEntityVersionChangeAction,
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

  // AHooks.useMount(() => {
  //   console.log('replaced**************');
  // });

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
          // options={replaceInformExhibit.replacedSelectDependency.versions.map((v) => ({value: v}))}
          options={replaceInformExhibit.replacedTargetVersions}
          onChange={(value) => {
            // onChange({replacedTargetVersion: value});
            dispatch<OnReplacedEntityVersionChangeAction>({
              type: 'replaceInformExhibit/onReplacedEntityVersionChange',
              payload: {
                value: value,
              },
            });
          }}
        >
          <div style={{cursor: 'pointer'}}>
            <FContentText
              type="additional2"
              text={replaceInformExhibit.replacedTargetSelectedVersion?.text}
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
            type: 'replaceInformExhibit/onReplacedTreeLoadData',
            payload: node,
          });
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
