import * as React from 'react';
import styles from './index.less';
import {Dropdown, Tabs} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageObjectDepSelectorModelState} from '@/models/connect';
import FResourceSelector from '@/containers/FResourceSelector';
import FObjectSelector from '@/containers/FObjectSelector';
import {AddObjectDepOAction, AddObjectDepRAction} from '@/models/storageObjectEditor';

interface SelectDepsProps {
  dispatch: Dispatch;
  selector: StorageObjectDepSelectorModelState;
}

function SelectDeps({selector, dispatch}: SelectDepsProps) {

  return (<div>
    <Tabs>
      <Tabs.TabPane tab="资源" key="1">
        <FResourceSelector
          onSelect={(value) => {
            // console.log(value, 'idid23ds9082;klq34jr;');
            dispatch<AddObjectDepRAction>({
              type: 'storageObjectEditor/addObjectDepR',
              payload: value.id,
            });
          }}
          onDelete={(value) => {
            console.log(value, 'ddEDAFDSS');
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="对象" key="2">
        <FObjectSelector
          onSelect={(value) => {
            // console.log(value, 'idid23ds');
            dispatch<AddObjectDepOAction>({
              type: 'storageObjectEditor/addObjectDepO',
              payload: value.id,
            });
          }}
          onDelete={(value) => {
            console.log(value, 'ddEDAFD243r5SS');
          }}
        />
      </Tabs.TabPane>
    </Tabs>
  </div>);
}


export default connect(({storageObjectDepSelector}: ConnectState) => ({
  selector: storageObjectDepSelector,
}))(SelectDeps);
