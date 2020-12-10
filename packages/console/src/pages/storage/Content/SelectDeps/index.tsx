import * as React from 'react';
import styles from './index.less';
import {Dropdown, Tabs} from 'antd';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageObjectDepSelectorModelState, StorageObjectEditorModelState} from '@/models/connect';
import FResourceSelector from '@/containers/FResourceSelector';
import FObjectSelector from '@/containers/FObjectSelector';
import {AddObjectDepOAction, AddObjectDepRAction,
  // DeleteObjectDepAction
} from '@/models/storageObjectEditor';

interface SelectDepsProps {
  dispatch: Dispatch;
  selector: StorageObjectDepSelectorModelState;
  storageObjectEditor: StorageObjectEditorModelState;
}

function SelectDeps({selector, storageObjectEditor, dispatch}: SelectDepsProps) {

  return (<div>
    <Tabs>
      <Tabs.TabPane tab="资源" key="1">
        <FResourceSelector
          showRemoveIDsOrNames={storageObjectEditor.depRs.map((r) => r.name)}
          // disabledIDsOrNames={[storageObjectEditor.bucketName + '/' + storageObjectEditor.objectName]}
          onSelect={(value) => {
            // console.log(value, 'idid23ds9082;klq34jr;');
            dispatch<AddObjectDepRAction>({
              type: 'storageObjectEditor/addObjectDepR',
              payload: value.id,
            });
          }}
          onDelete={(value) => {
            // console.log(value, 'ddEDAFDSS');
            // dispatch<DeleteObjectDepAction>({
            //   type: 'storageObjectEditor/deleteObjectDep',
            //   payload: {
            //     resourceName: value.name,
            //   }
            // });
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab="对象" key="2">
        <FObjectSelector
          disabledIDsOrNames={[storageObjectEditor.bucketName + '/' + storageObjectEditor.objectName]}
          showRemoveIDsOrNames={storageObjectEditor.depOs.map((o) => o.name)}
          onSelect={(value) => {
            // console.log(value, 'idid23ds');
            dispatch<AddObjectDepOAction>({
              type: 'storageObjectEditor/addObjectDepO',
              payload: value.id,
            });
          }}
          onDelete={(value) => {
            // console.log(value, 'ddEDAFD243r5SS');
            // dispatch<DeleteObjectDepAction>({
            //   type: 'storageObjectEditor/deleteObjectDep',
            //   payload: {
            //     objectName: value.name,
            //   },
            // });
          }}
        />
      </Tabs.TabPane>
    </Tabs>
  </div>);
}


export default connect(({storageObjectDepSelector, storageObjectEditor}: ConnectState) => ({
  selector: storageObjectDepSelector,
  storageObjectEditor: storageObjectEditor,
}))(SelectDeps);
