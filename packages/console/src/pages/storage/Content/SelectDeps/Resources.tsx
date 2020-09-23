import * as React from 'react';

import styles from './index.less';
import FDropdown from "@/components/FDropdown";
import FInput from "@/components/FInput";
import FResourceList from "@/components/FResourceList";
import {Tabs} from "antd";
import {connect, Dispatch} from "dva";
import {ConnectState, StorageObjectDepSelectorModelState} from "@/models/connect";
import {DownOutlined} from '@ant-design/icons';
import {
  FetchObjectsAction,
  FetchResourcesAction,
  OnChangeOConditionsAction,
  OnChangeRConditionsAction
} from "@/models/storageObjectDepSelector";
import {AddObjectDepRAction} from "@/models/storageObjectEditor";

interface ResourcesProps {
  dispatch: Dispatch;
  selector: StorageObjectDepSelectorModelState;
}

const selectOptions: { text?: string, value: string }[] = [
  {text: '资源市场', value: '1'},
  {text: '我的资源', value: '2'},
  {text: '我的收藏', value: '3'},
];

function Resources({dispatch, selector}: ResourcesProps) {
  React.useEffect(() => {
    if (selector.rTotal === -1) {
      dispatch<FetchResourcesAction>({
        type: 'storageObjectDepSelector/fetchResources',
      });
    }
  }, []);

  return (<>
    <div className={styles.filter}>
      <FDropdown
        options={selectOptions}
        onChange={(value) => {
          dispatch<OnChangeRConditionsAction>({
            type: 'storageObjectDepSelector/onChangeRConditions',
            payload: {
              rSelect: value as ('1' | '2' | '3'),
            },
          });
        }}
      >
        <a>{(selectOptions.find((op) => op.value === selector.rSelect) as any).text} <DownOutlined
          style={{marginLeft: 8}}/></a>
      </FDropdown>
      <FInput
        theme="dark"
        debounce={300}
        value={selector.rInput}
        onDebounceChange={(value) => {
          dispatch<OnChangeRConditionsAction>({
            type: 'storageObjectDepSelector/onChangeRConditions',
            payload: {
              rInput: value,
            },
          });
        }}
      />
    </div>
    <FResourceList
      resourceObjects={selector.resourceList.map((r) => ({
        id: r.resourceId,
        title: r.resourceName,
        resourceType: r.resourceType,
        status: r.status,
        time: r.updateDate,
      }))}
      loading={selector.rTotal === -1}
      stillMore={selector.rTotal > selector.rPageCurrent * selector.rPageSize}
      onSelect={(value) => {
        dispatch<AddObjectDepRAction>({
          type: 'storageObjectEditor/addObjectDepR',
          payload: value.id,
        });
      }}
      onLoadMord={() => {
        dispatch<OnChangeRConditionsAction>({
          type: 'storageObjectDepSelector/onChangeRConditions',
          payload: {
            rPageCurrent: selector.rPageCurrent + 1,
          },
        });
      }}
    />
  </>);
}

export default connect(({storageObjectDepSelector}: ConnectState) => ({
  selector: storageObjectDepSelector,
}))(Resources);
