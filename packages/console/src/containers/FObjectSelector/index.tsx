import * as React from 'react';

import styles from './index.less';
import FDropdown from '@/components/FDropdown';
import FInput from '@/components/FInput';
import FResourceList from '@/components/FResourceList';
import {connect, Dispatch} from 'dva';
import {ConnectState, StorageHomePageModelState, StorageObjectDepSelectorModelState} from '@/models/connect';
import {DownOutlined} from '@ant-design/icons';
import {
  FetchObjectsAction,
  OnChangeOConditionsAction,
} from '@/models/storageObjectDepSelector';
import {AddObjectDepOAction} from '@/models/storageObjectEditor';

interface FObjectSelectorProps {
  disabledIDsOrNames?: string[];
  showRemoveIDsOrNames?: string[];

  onSelect?({id, name}: { id: string; name: string; }): void;

  onDelete?({id, name}: { id: string; name: string; }): void;

  dispatch: Dispatch;
  selector: StorageObjectDepSelectorModelState;
  storageHomePage: StorageHomePageModelState;
}

const defaultSelectOptions: { text?: string, value: string }[] = [
  {text: '全部Bucket', value: '_all'},
];

function FObjectSelector({
                           disabledIDsOrNames, showRemoveIDsOrNames, onSelect, onDelete,
                           dispatch, selector, storageHomePage
                         }: FObjectSelectorProps) {

  React.useEffect(() => {
    if (selector.oTotal === -1) {
      dispatch<FetchObjectsAction>({
        type: 'storageObjectDepSelector/fetchObjects',
      });
    }
  }, []);

  const selectOptions = [
    ...defaultSelectOptions,
    ...storageHomePage.bucketList.map((b) => ({
      value: b.bucketName,
      text: b.bucketName,
    })),
  ];

  return (<>
    <div className={styles.filter}>
      <FDropdown
        options={selectOptions}
        onChange={(value) => {
          console.log(value, 'valuevalue23rfsd');
          dispatch<OnChangeOConditionsAction>({
            type: 'storageObjectDepSelector/onChangeOConditions',
            payload: {
              oSelect: value,
            },
          });
        }}
      >
        <a>{(selectOptions.find((rs) => rs.value === selector.oSelect) as any).text} <DownOutlined
          style={{marginLeft: 8}}/></a>
      </FDropdown>
      <FInput
        theme="dark"
        debounce={300}
        value={selector.oInput}
        onDebounceChange={(value) => {
          dispatch<OnChangeOConditionsAction>({
            type: 'storageObjectDepSelector/onChangeOConditions',
            payload: {
              oInput: value,
            },
          });
        }}
      />
    </div>
    <FResourceList
      disabledIDsOrNames={disabledIDsOrNames}
      showRemoveIDsOrNames={showRemoveIDsOrNames}
      resourceObjects={selector.objectList.map((o) => ({
        id: o.objectId,
        resourceType: o.resourceType,
        status: 1,
        time: o.updateDate,
        title: `${o.bucketName}/${o.objectName}`,
      }))}
      loading={selector.oTotal === -1}
      stillMore={selector.oTotal > selector.oPageCurrent * selector.oPageSize}
      onSelect={(value) => {
        onSelect && onSelect({id: value.id, name: value.title});
      }}
      onDelete={(value) => {
        onDelete && onDelete({id: value.id, name: value.title});
      }}
      onLoadMord={() => {
        dispatch<OnChangeOConditionsAction>({
          type: 'storageObjectDepSelector/onChangeOConditions',
          payload: {
            oPageCurrent: selector.oPageCurrent + 1,
          },
        });
      }}
    />
  </>);
}

export default connect(({storageObjectDepSelector, storageHomePage}: ConnectState) => ({
  selector: storageObjectDepSelector,
  storageHomePage: storageHomePage,
}))(FObjectSelector);
