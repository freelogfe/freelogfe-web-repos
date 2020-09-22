import * as React from 'react';
import styles from './index.less';
import {Dropdown, Tabs} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageObjectDepSelectorModelState} from "@/models/connect";
import Resources from './Resources';
import Objects from './Objects';

interface SelectDepsProps {
  dispatch: Dispatch;
  selector: StorageObjectDepSelectorModelState;
}

function SelectDeps({selector, dispatch}: SelectDepsProps) {

  return (<div>
    <Tabs>
      <Tabs.TabPane tab="资源" key="1">
        <Resources/>
      </Tabs.TabPane>
      <Tabs.TabPane tab="对象" key="2">
        <Objects/>
      </Tabs.TabPane>
    </Tabs>
  </div>);
}


export default connect(({storageObjectDepSelector}: ConnectState) => ({
  selector: storageObjectDepSelector,
}))(SelectDeps);
