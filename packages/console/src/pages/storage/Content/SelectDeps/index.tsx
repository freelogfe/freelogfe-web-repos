import * as React from 'react';
import styles from './index.less';
import { Tabs } from 'antd';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageObjectEditorModelState } from '@/models/connect';
import FResourceSelector from '@/containers/FResourceSelector';
import FObjectSelector from '@/containers/FObjectSelector';
import {
  AddObjectDepOAction, AddObjectDepRAction, DeleteObjectDepOAction, DeleteObjectDepRAction,
} from '@/models/storageObjectEditor';

interface SelectDepsProps {
  dispatch: Dispatch;
  storageObjectEditor: StorageObjectEditorModelState;
}

function SelectDeps({ storageObjectEditor, dispatch }: SelectDepsProps) {

  React.useEffect(() => {
    // console.log('cra@#!$!@#$');
    return () => {
      // console.log('des#@#R#$@#$');
      // dispatch<ChangeAction>({
      //   type: 'storageObjectDepSelector/change',
      //   payload: {
      //     ...storageObjectDepSelectorInitData,
      //   },
      // })
    };
  }, []);

  return (<div>
    <Tabs>
      <Tabs.TabPane tab='资源' key='1'>
        <FResourceSelector
          showRemoveIDsOrNames={storageObjectEditor.depRs.map((r) => r.name)}
          onSelect={(value: { id: string }) => {
            dispatch<AddObjectDepRAction>({
              type: 'storageObjectEditor/addObjectDepR',
              payload: value.id,
            });
          }}
          onDelete={(value: { name: string }) => {
            // console.log(value, 'ddEDAFDSS');
            dispatch<DeleteObjectDepRAction>({
              type: 'storageObjectEditor/deleteObjectDepR',
              payload: value.name,
            });
          }}
        />
      </Tabs.TabPane>
      <Tabs.TabPane tab='对象' key='2'>
        <FObjectSelector
          disabledIDsOrNames={[storageObjectEditor.bucketName + '/' + storageObjectEditor.objectName]}
          showRemoveIDsOrNames={storageObjectEditor.depOs.map((o) => o.name)}
          onSelect={(value: { id: string }) => {
            // console.log(value, 'idid23ds');
            dispatch<AddObjectDepOAction>({
              type: 'storageObjectEditor/addObjectDepO',
              payload: value.id,
            });
          }}
          onDelete={(value: { name: string }) => {
            // console.log(value, 'ddEDAFD243r5SS');
            dispatch<DeleteObjectDepOAction>({
              type: 'storageObjectEditor/deleteObjectDepO',
              payload: value.name,
            });
          }}
        />
      </Tabs.TabPane>
    </Tabs>
  </div>);
}


export default connect(({ storageObjectEditor }: ConnectState) => ({
  storageObjectEditor: storageObjectEditor,
}))(SelectDeps);
