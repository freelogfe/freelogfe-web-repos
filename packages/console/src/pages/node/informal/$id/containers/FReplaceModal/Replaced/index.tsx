import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import FDropdownMenu from "@/components/FDropdownMenu";
import {FContentText} from '@/components/FText';
import {Tree} from 'antd';
import FAutoComplete from "@/components/FAutoComplete";
import {connect, Dispatch} from 'dva';
import {ConnectState, ReplaceInformExhibitState} from "@/models/connect";
import {ChangeAction, FetchDependencyTreeAction} from "@/models/replaceInformExhibitModal";

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
        // onExpand={onExpand}
        // expandedKeys={expandedKeys}
        // autoExpandParent={autoExpandParent}
        // onCheck={onCheck}
        // checkedKeys={checkedKeys}
        // onSelect={onSelect}
        // selectedKeys={selectedKeys}
        treeData={treeData}
      />
    </div>
  </>);
}

export default connect(({replaceInformExhibit}: ConnectState) => ({
  replaceInformExhibit
}))(Replaced);
