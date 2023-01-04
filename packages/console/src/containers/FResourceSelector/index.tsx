import * as React from 'react';

import styles from './index.less';
import FInput from '@/components/FInput';
import FResourceList from '@/components/FResourceList';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageObjectDepSelectorModelState } from '@/models/connect';
import { DownOutlined } from '@ant-design/icons';
import {
  FetchResourcesAction,
  OnChangeRConditionsAction,
} from '@/models/storageObjectDepSelector';
import FDropdownMenu from '@/components/FDropdownMenu';
import FComponentsLib from '@freelog/components-lib';

interface FResourceSelectorProps {
  disabledIDsOrNames?: string[];
  showRemoveIDsOrNames?: string[];

  onSelect?({ id, name }: { id: string; name: string; }): void;

  onDelete?({ id, name }: { id: string; name: string; }): void;

  dispatch: Dispatch;
  storageObjectDepSelector: StorageObjectDepSelectorModelState;
}

const selectOptions: { text?: string, value: string }[] = [
  { text: '资源市场', value: '1' },
  { text: '我的资源', value: '2' },
  { text: '我的收藏', value: '3' },
];

function FResourceSelector({
                             disabledIDsOrNames, showRemoveIDsOrNames, onSelect, onDelete,
                             dispatch, storageObjectDepSelector,
                           }: FResourceSelectorProps) {
  React.useEffect(() => {
    // if (selector.rTotal === -1) {
    dispatch<FetchResourcesAction>({
      type: 'storageObjectDepSelector/fetchResources',
      payload: true,
    });
    // }
  }, []);

  return (<>
    <div className={styles.filter}>
      <FDropdownMenu
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
        <a>{(selectOptions.find((op) => op.value === storageObjectDepSelector.rSelect) as any).text}
          <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} /></a>
      </FDropdownMenu>
      <FInput
        theme='dark'
        debounce={300}
        value={storageObjectDepSelector.rInput}
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
    {/*{console.log(storageObjectDepSelector.resourceList, 'selector.resourceList@!@#$@!#$@#$!234234')}*/}
    <FResourceList
      showRemoveIDsOrNames={showRemoveIDsOrNames}
      disabledIDsOrNames={disabledIDsOrNames}
      resourceObjects={storageObjectDepSelector.resourceList.map((r) => ({
        id: r.resourceId,
        title: r.resourceName,
        resourceType: r.resourceType,
        status: r.status,
        time: r.updateDate,
        latestVersion: r.latestVersion,
      }))}
      loading={storageObjectDepSelector.rTotal === -1}
      stillMore={storageObjectDepSelector.resourceList.length < storageObjectDepSelector.rTotal}
      onSelect={(value) => {
        onSelect && onSelect({ id: value.id, name: value.title });
      }}
      onDelete={(value) => {
        onDelete && onDelete({ id: value.id, name: value.title });
      }}
      onLoadMord={() => {
        dispatch<FetchResourcesAction>({
          type: 'storageObjectDepSelector/fetchResources',
          payload: false,
        });
      }}
    />
  </>);
}

export default connect(({ storageObjectDepSelector }: ConnectState) => ({
  storageObjectDepSelector: storageObjectDepSelector,
}))(FResourceSelector);
