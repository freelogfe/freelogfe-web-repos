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
import {dependencyTreeFilter, DependencyTreeFilterParamsType} from "@/services/informalNodes";

interface ReplacedProps {
  dispatch: Dispatch;
  replaceInformExhibit: ReplaceInformExhibitState;
}

function Replaced({dispatch, replaceInformExhibit}: ReplacedProps) {
  const treeData = [
    {
      title: '0-0',
      key: '0-0',
      children: [
        {
          title: '0-0-0',
          key: '0-0-0',
          children: [
            {title: '0-0-0-0', key: '0-0-0-0'},
            {title: '0-0-0-1', key: '0-0-0-1'},
            {title: '0-0-0-2', key: '0-0-0-2'},
          ],
        },
        {
          title: '0-0-1',
          key: '0-0-1',
          children: [
            {title: '0-0-1-0', key: '0-0-1-0'},
            {title: '0-0-1-1', key: '0-0-1-1'},
            {title: '0-0-1-2', key: '0-0-1-2'},
          ],
        },
        {
          title: '0-0-2',
          key: '0-0-2',
        },
      ],
    },
    {
      title: '0-1',
      key: '0-1',
      children: [
        {title: '0-1-0-0', key: '0-1-0-0'},
        {title: '0-1-0-1', key: '0-1-0-1'},
        {title: '0-1-0-2', key: '0-1-0-2'},
      ],
    },
    {
      title: '0-2',
      key: '0-2',
    },
  ];

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
          console.log(node, 'n2390jlkjdsfdsf');
          // if (!replaceInformExhibit.replacedSelectDependency) {
          //   return false;
          // }
          const params: DependencyTreeFilterParamsType = {
            testResourceId: node.key,
            dependentEntityId: replaceInformExhibit.replacedSelectDependency?.id || '',
          };
          const {data} = await dependencyTreeFilter(params);
          console.log(data, 'dependencyTreeFilter!@#$@!#$@#$@#$');
          const result = updateTreeData(
            replaceInformExhibit.treeData as TreeNode[],
            node.key,
            data.map((d: any) => {
              return {
                key: d.id,
                title: d.name,
                // children: ddependencies
              };
            }),
          );
          console.log(result, 'result2094uo1234u234');
          await dispatch<ChangeAction>({
            type: 'replaceInformExhibit/change',
            payload: {
              treeData: result,
            }
          });
        }}
        // onExpand={onExpand}
        // expandedKeys={expandedKeys}
        // autoExpandParent={autoExpandParent}
        // onCheck={onCheck}
        // checkedKeys={checkedKeys}
        // onSelect={onSelect}
        // selectedKeys={selectedKeys}
        treeData={replaceInformExhibit.treeData as WholeMutable<ReplaceInformExhibitState['treeData']>}
        // treeData={treeData}
      />
    </div>
  </>);
}

export default connect(({replaceInformExhibit}: ConnectState) => ({
  replaceInformExhibit
}))(Replaced);

// interface DataNode {
//   title: string;
//   key: string;
//   isLeaf?: boolean;
//   children?: DataNode[];
// }

function updateTreeData(list: TreeNode[], key: React.Key, children: TreeNode[]): TreeNode[] {
  return list.map(node => {
    if (node.key === key) {
      return {
        ...node,
        children,
      };
    } else if (node.children) {
      return {
        ...node,
        children: updateTreeData(node.children, key, children),
      };
    }
    return node;
  });
}
