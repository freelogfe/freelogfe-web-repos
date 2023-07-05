import * as React from 'react';

import styles from './index.less';
import FResourceList, { FResourceListProps } from '@/components/FResourceList';
import { connect } from 'dva';
// import { Dispatch } from 'redux';
import {
  ConnectState,
  // StorageHomePageModelState,
  // StorageObjectDepSelectorModelState
} from '@/models/connect';
// import {
//   ChangeAction,
//   // FetchObjectsAction,
//   // OnChangeOConditionsAction,
// } from '@/models/storageObjectDepSelector';
import FDropdownMenu from '@/components/FDropdownMenu';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';
// import moment from 'moment';

interface FObjectSelectorProps {
  disabledIDsOrNames?: string[];
  showRemoveIDsOrNames?: string[];
  // visibleResourceType?: string;
  // isLoadingTypeless?: 0 | 1;

  onSelect?({ id, name }: { id: string; name: string; }): void;

  onDelete?({ id, name }: { id: string; name: string; }): void;

  // dispatch: Dispatch;
  // selector: StorageObjectDepSelectorModelState;
  // storageHomePage: StorageHomePageModelState;
}

// const defaultSelectOptions: { text?: string, value: string }[] = [
//   { text: '全部Bucket', value: '_all' },
// ];

interface FObjectSelectorStates {
  // searchInput: string;

  selectOptions: { text: string, value: string }[];

  objectList: {
    objectId: string;
    bucketName: string;
    objectName: string;
    resourceType: string[];
    updateDate: string;
  }[];
  // oPageSize: number;
  oTotal: number;
  oSelect: '_all' | string;
  oInput: string;
}

const initStates: FObjectSelectorStates = {
  // searchInput: '',
  selectOptions: [{ text: '全部Bucket', value: '_all' }],
  objectList: [],
  // oPageSize: number;
  oTotal: -1,
  oSelect: '_all',
  oInput: '',
};

function FObjectSelector({
                           disabledIDsOrNames,
                           showRemoveIDsOrNames,
                           // visibleResourceType = '',
                           // isLoadingTypeless = 1,
                           onSelect,
                           onDelete,
                           // dispatch,
                           // selector,
                           // storageHomePage,
                         }: FObjectSelectorProps) {

  const [$state, $setState] = AHooks.useSetState<FObjectSelectorStates>(initStates);

  // console.log(visibleResourceType, 'visibleResourceType90weiofjsdlkfjdlkfjlk');
  // React.useEffect(() => {
  //   init();
  // }, []);

  AHooks.useMount(async () => {
    // init();

    fetchObjects(true);

    const params: Parameters<typeof FServiceAPI.Storage.bucketList>[0] = {
      // bucketType: 0,
      bucketType: 1,
    };
    const { data }: {
      data: any[];
    } = await FServiceAPI.Storage.bucketList(params);

    $setState({
      selectOptions: [
        ...$state.selectOptions,
        ...data.map((b) => {
          return {
            value: b.bucketName,
            text: b.bucketName,
          };
        }),
      ],
    });
    // const bucketList: NonNullable<StorageHomePageModelState['bucketList']> = data
    //   .map((i) => ({
    //     bucketName: i.bucketName,
    //     bucketType: i.bucketType,
    //     createDate: moment(i.createDate).format('YYYY.MM.DD HH:mm'),
    //     totalFileQuantity: i.totalFileQuantity,
    //   }));
    // yield put<ChangeAction>({
    //   type: 'change',
    //   payload: {
    //     bucketList: bucketList,
    //   },
    // });
  });

  AHooks.useUnmount(() => {

  });

  AHooks.useDebounceEffect(() => {
    // console.log($state.searchInput, 'sdioefjsldkjflk *****');
    // dispatch<OnChangeOConditionsAction>({
    //   type: 'storageObjectDepSelector/onChangeOConditions',
    //   payload: {
    //     oInput: $state.oInput,
    //   },
    // });
    fetchObjects(true);
  }, [$state.oInput, $state.oSelect], {
    wait: 300,
  });

  // async function init() {
  //   // await dispatch<ChangeAction>({
  //   //   type: 'storageObjectDepSelector/change',
  //   //   payload: {
  //   //     visibleOResourceType: visibleResourceType,
  //   //   },
  //   // });
  //   await dispatch<FetchObjectsAction>({
  //     type: 'storageObjectDepSelector/fetchObjects',
  //     payload: true,
  //   });
  // }

  async function fetchObjects(restart: boolean) {
    let objectListData: FObjectSelectorStates['objectList'] = [];

    if (!restart) {
      objectListData = $state.objectList;
    }

    const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
      bucketName: $state.oSelect,
      // resourceType: $state.visibleOResourceType || undefined,
      isLoadingTypeless: 1,
      keywords: $state.oInput,
      skip: objectListData.length,
      // limit: selector.oPageSize,
      limit: FUtil.Predefined.pageSize,
    };
    const { data } = await FServiceAPI.Storage.objectList(params);
    // console.log(data, 'datadata322');
    // yield put<ChangeAction>({
    //   type: 'change',
    //   payload: {
    //     oTotal: data.totalItem,
    //     objectList: [
    //       ...objectListData,
    //       ...data.dataList.map((o: any) => ({
    //         objectId: o.objectId,
    //         bucketName: o.bucketName,
    //         objectName: o.objectName,
    //         resourceType: o.resourceType,
    //         updateDate: FUtil.Format.formatDateTime(o.updateDate, true),
    //       })),
    //     ],
    //   },
    // });
    $setState({
      oTotal: data.totalItem,
      objectList: [
        ...objectListData,
        ...data.dataList.map((o: any) => ({
          objectId: o.objectId,
          bucketName: o.bucketName,
          objectName: o.objectName,
          resourceType: o.resourceType,
          updateDate: FUtil.Format.formatDateTime(o.updateDate, true),
        })),
      ],
    });
  }

  // const selectOptions = [
  //   ...defaultSelectOptions,
  //   ...(storageHomePage.bucketList || []).map((b) => ({
  //     value: b.bucketName,
  //     text: b.bucketName,
  //   })),
  // ];

  return (<>
    <div className={styles.filter}>
      <FDropdownMenu
        options={$state.selectOptions}
        onChange={(value) => {
          // console.log(value, 'valuevalue23rfsd');
          // dispatch<OnChangeOConditionsAction>({
          //   type: 'storageObjectDepSelector/onChangeOConditions',
          //   payload: {
          //     oSelect: value,
          //   },
          // });
          $setState({
            oSelect: value,
          });
        }}
      >
        <a>{($state.selectOptions.find((rs) => rs.value === $state.oSelect))?.text || ''}
          <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} /></a>
      </FDropdownMenu>
      <FComponentsLib.FInput.FSearch
        // theme='dark'
        // debounce={300}
        value={$state.oInput}
        onChange={(e) => {
          // dispatch<OnChangeOConditionsAction>({
          //   type: 'storageObjectDepSelector/onChangeOConditions',
          //   payload: {
          //     oInput: e.target.value,
          //   },
          // });
          $setState({
            oInput: e.target.value,
          });
        }}
      />
    </div>
    <FResourceList
      disabledIDsOrNames={disabledIDsOrNames}
      showRemoveIDsOrNames={showRemoveIDsOrNames}
      resourceObjects={$state.objectList.map<FResourceListProps['resourceObjects'][number]>((o) => ({
        id: o.objectId,
        resourceType: o.resourceType,
        status: 1,
        time: o.updateDate,
        title: `${o.bucketName}/${o.objectName}`,
        latestVersion: '0.0.0',
      }))}
      loading={$state.oTotal === -1}
      stillMore={$state.oTotal > $state.objectList.length}
      onSelect={(value) => {
        onSelect && onSelect({ id: value.id, name: value.title });
      }}
      onDelete={(value) => {
        onDelete && onDelete({ id: value.id, name: value.title });
      }}
      onLoadMord={() => {
        // dispatch<FetchObjectsAction>({
        //   type: 'storageObjectDepSelector/fetchObjects',
        //   payload: false,
        // });
        fetchObjects(false);
      }}
    />
  </>);
}

export default connect(({ storageObjectDepSelector, storageHomePage }: ConnectState) => ({
  selector: storageObjectDepSelector,
  storageHomePage: storageHomePage,
}))(FObjectSelector);
