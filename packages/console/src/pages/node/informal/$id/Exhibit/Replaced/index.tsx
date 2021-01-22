import * as React from 'react';
import styles from './index.less';
import FInput from "@/components/FInput";
import FDropdownMenu from "@/components/FDropdownMenu";
import {FContentText} from '@/components/FText';
import {Tree} from 'antd';

interface ReplacedProps {

}

function Replaced({}: ReplacedProps) {
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

  return (<>
    <div style={{height: 15}}/>
    <div className={styles.filter}>
      <FInput
        theme="dark"
        wrapClassName={styles.filterInput}
      />
      <FDropdownMenu options={[{value: '1.1.1'}]}>
        <FContentText type="additional2" text={'选择版本'}/>
      </FDropdownMenu>
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

export default Replaced;
