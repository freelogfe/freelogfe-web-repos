import * as React from 'react';

import styles from './index.less';
// import FInput from '@/components/FInput';
import FResourceList, { FResourceListProps } from '@/components/FResourceList';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageHomePageModelState, StorageObjectDepSelectorModelState } from '@/models/connect';
import {
  ChangeAction,
  FetchObjectsAction,
  OnChangeOConditionsAction,
} from '@/models/storageObjectDepSelector';
import FDropdownMenu from '@/components/FDropdownMenu';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';

interface FObjectSelectorProps {
  disabledIDsOrNames?: string[];
  showRemoveIDsOrNames?: string[];
  visibleResourceType?: string;
  isLoadingTypeless?: 0 | 1;

  onSelect?({ id, name }: { id: string; name: string; }): void;

  onDelete?({ id, name }: { id: string; name: string; }): void;

  dispatch: Dispatch;
  selector: StorageObjectDepSelectorModelState;
  storageHomePage: StorageHomePageModelState;
}

const defaultSelectOptions: { text?: string, value: string }[] = [
  { text: '全部Bucket', value: '_all' },
];

interface FObjectSelectorStates {
  searchInput: string;
}

const initStates: FObjectSelectorStates = {
  searchInput: '',
};

function FObjectSelector({
                           disabledIDsOrNames,
                           showRemoveIDsOrNames,
                           visibleResourceType = '',
                           isLoadingTypeless = 1,
                           onSelect,
                           onDelete,
                           dispatch,
                           selector,
                           storageHomePage,
                         }: FObjectSelectorProps) {

  const [$state, $setState] = AHooks.useSetState<FObjectSelectorStates>(initStates);

  // console.log(visibleResourceType, 'visibleResourceType90weiofjsdlkfjdlkfjlk');
  // React.useEffect(() => {
  //   init();
  // }, []);

  AHooks.useMount(() => {
    init();
  });

  AHooks.useUnmount(() => {

  });

  AHooks.useDebounceEffect(() => {
    // console.log($state.searchInput, 'sdioefjsldkjflk *****');
    dispatch<OnChangeOConditionsAction>({
      type: 'storageObjectDepSelector/onChangeOConditions',
      payload: {
        oInput: $state.searchInput,
      },
    });
  }, [$state.searchInput], {
    wait: 300,
  });

  async function init() {
    await dispatch<ChangeAction>({
      type: 'storageObjectDepSelector/change',
      payload: {
        visibleOResourceType: visibleResourceType,
      },
    });
    await dispatch<FetchObjectsAction>({
      type: 'storageObjectDepSelector/fetchObjects',
      payload: true,
    });
  }

  const selectOptions = [
    ...defaultSelectOptions,
    ...(storageHomePage.bucketList || []).map((b) => ({
      value: b.bucketName,
      text: b.bucketName,
    })),
  ];

  return (<>
    <div className={styles.filter}>
      <FDropdownMenu
        options={selectOptions}
        onChange={(value) => {
          // console.log(value, 'valuevalue23rfsd');
          dispatch<OnChangeOConditionsAction>({
            type: 'storageObjectDepSelector/onChangeOConditions',
            payload: {
              oSelect: value,
            },
          });
        }}
      >
        <a>{(selectOptions.find((rs) => rs.value === selector.oSelect) as any).text}
          <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} /></a>
      </FDropdownMenu>
      <FComponentsLib.FInput.FSearch
        // theme='dark'
        // debounce={300}
        value={$state.searchInput}
        onChange={(e) => {
          // dispatch<OnChangeOConditionsAction>({
          //   type: 'storageObjectDepSelector/onChangeOConditions',
          //   payload: {
          //     oInput: e.target.value,
          //   },
          // });
          $setState({
            searchInput: e.target.value,
          });
        }}
      />
    </div>
    <FResourceList
      disabledIDsOrNames={disabledIDsOrNames}
      showRemoveIDsOrNames={showRemoveIDsOrNames}
      resourceObjects={selector.objectList.map<FResourceListProps['resourceObjects'][number]>((o) => ({
        id: o.objectId,
        resourceType: o.resourceType,
        status: 1,
        time: o.updateDate,
        title: `${o.bucketName}/${o.objectName}`,
        latestVersion: '0.0.0',
      }))}
      loading={selector.oTotal === -1}
      stillMore={selector.oTotal > selector.objectList.length}
      onSelect={(value) => {
        onSelect && onSelect({ id: value.id, name: value.title });
      }}
      onDelete={(value) => {
        onDelete && onDelete({ id: value.id, name: value.title });
      }}
      onLoadMord={() => {
        dispatch<FetchObjectsAction>({
          type: 'storageObjectDepSelector/fetchObjects',
          payload: false,
        });
      }}
    />
  </>);
}

export default connect(({ storageObjectDepSelector, storageHomePage }: ConnectState) => ({
  selector: storageObjectDepSelector,
  storageHomePage: storageHomePage,
}))(FObjectSelector);
