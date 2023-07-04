import * as React from 'react';

import styles from './index.less';
// import FInput from '@/components/FInput';
import FResourceList from '@/components/FResourceList';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { ConnectState, StorageObjectDepSelectorModelState } from '@/models/connect';
// import { DownOutlined } from '@ant-design/icons';
// import {
//   ChangeAction,
//   FetchResourcesAction,
//   OnChangeRConditionsAction,
// } from '@/models/storageObjectDepSelector';
import FDropdownMenu from '@/components/FDropdownMenu';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';

interface FResourceSelectorProps {
  disabledIDsOrNames?: string[];
  showRemoveIDsOrNames?: string[];

  onSelect?({ id, name }: { id: string; name: string; }): void;

  onDelete?({ id, name }: { id: string; name: string; }): void;

  // dispatch: Dispatch;
  // storageObjectDepSelector: StorageObjectDepSelectorModelState;
}

interface FResourceSelectorStates {
  resourceList: {
    resourceId: string;
    resourceName: string;
    resourceType: string[];
    updateDate: string;
    status: 0 | 1;
    latestVersion: string;
  }[];
  rPageSize: number;
  rTotal: number;
  rSelect: '1' | '2' | '3';
  rInput: string;

  // visibleOResourceType: string;
  // objectList: {
  //   objectId: string;
  //   bucketName: string;
  //   objectName: string;
  //   resourceType: string[];
  //   updateDate: string;
  // }[];
  // oPageSize: number;
  // oTotal: number;
  // oSelect: '_all' | string;
  // oInput: string;
}

const initState: FResourceSelectorStates = {
  resourceList: [],
  rTotal: -1,
  rPageSize: 20,
  rSelect: '1',
  rInput: '',
  // visibleOResourceType: '',
  // objectList: [],
  // oTotal: -1,
  // oPageSize: 20,
  // oSelect: '_all',
  // oInput: '',
};

const selectOptions: { text?: string, value: string }[] = [
  { text: '资源市场', value: '1' },
  { text: '我的资源', value: '2' },
  { text: '我的收藏', value: '3' },
];

function FResourceSelector({
                             disabledIDsOrNames, showRemoveIDsOrNames, onSelect, onDelete,
                             // dispatch, storageObjectDepSelector,
                           }: FResourceSelectorProps) {

  const [$state, $setState] = AHooks.useSetState<FResourceSelectorStates>(initState);

  // React.useEffect(() => {
  // if (selector.rTotal === -1) {
  // dispatch<FetchResourcesAction>({
  //   type: 'storageObjectDepSelector/fetchResources',
  //   payload: true,
  // });
  // }
  // }, []);

  AHooks.useMount(() => {
    fetchResources(true);
  });

  AHooks.useDebounceEffect(() => {
    fetchResources(true);
  }, [$state.rInput, $state.rSelect], {
    wait: 300,
  });

  async function fetchResources(restart: boolean = false) {
    let resourceList: FResourceSelectorStates['resourceList'] = [];
    if (!restart) {
      resourceList = $state.resourceList;
    }
    // let dataSource: any;
    let totalItem: number = -1;
    if ($state.rSelect === '3') {
      const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
        skip: resourceList.length,
        // limit: storageObjectDepSelector.rPageSize,
        limit: FUtil.Predefined.pageSize,
        keywords: $state.rInput,
      };
      const { data } = await FServiceAPI.Collection.collectionResources(params);
      // console.log(data, '##########5210823423');
      // dataSource = data;
      totalItem = data.totalItem;
      resourceList = [
        ...resourceList,
        ...(data.dataList as any[]).map<StorageObjectDepSelectorModelState['resourceList'][number]>((r: any) => ({
          resourceId: r.resourceId,
          resourceName: r.resourceName,
          resourceType: r.resourceType,
          updateDate: FUtil.Format.formatDateTime(r.resourceUpdateDate, true),
          status: r.resourceStatus,
          latestVersion: r.latestVersion,
        })),
      ];
    } else {
      const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        // startResourceId: resourceList[0]?.resourceId,
        skip: resourceList.length,
        // limit: storageObjectDepSelector.rPageSize,
        limit: FUtil.Predefined.pageSize,
        keywords: $state.rInput,
        status: $state.rSelect === '2' ? undefined : 1,
        isSelf: $state.rSelect === '2' ? 1 : undefined,
      };
      const { data } = await FServiceAPI.Resource.list(params);
      // dataSource = data;
      // console.log(data, '@@@@@@@@@@@@123412341234');
      totalItem = data.totalItem;
      resourceList = [
        ...resourceList,
        ...(data.dataList as any[]).map<StorageObjectDepSelectorModelState['resourceList'][number]>((r: any) => ({
          resourceId: r.resourceId,
          resourceName: r.resourceName,
          resourceType: r.resourceType,
          updateDate: FUtil.Format.formatDateTime(r.updateDate, true),
          status: r.status,
          latestVersion: r.latestVersion,
        })),
      ];
    }

    $setState({
      rTotal: totalItem,
      resourceList: resourceList,
    });
  }

  // async function fetchObjects(restart: boolean = false) {
  //   let objectListData: StorageObjectDepSelectorModelState['objectList'] = [];
  //
  //   if (!restart) {
  //     objectListData = $state.objectList;
  //   }
  //
  //   const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
  //     bucketName: $state.oSelect,
  //     resourceType: $state.visibleOResourceType || undefined,
  //     isLoadingTypeless: 1,
  //     keywords: $state.oInput,
  //     skip: objectListData.length,
  //     // limit: selector.oPageSize,
  //     limit: FUtil.Predefined.pageSize,
  //   };
  //   const { data } = await FServiceAPI.Storage.objectList(params);
  //   // console.log(data, 'datadata322');
  //
  //   $setState({
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
  //   });
  //   // yield put<ChangeAction>({
  //   //   type: 'change',
  //   //   payload: {
  //   //
  //   //   },
  //   // });
  // }

  // function onChangeRConditions(payload: Partial<Pick<FResourceSelectorStates, 'rSelect' | 'rInput'>>) {
  //   // yield put<ChangeAction>({
  //   //   type: 'change',
  //   //   payload: {
  //   //     ...payload,
  //   //   },
  //   // });
  //   $setState({
  //     ...payload,
  //   });
  //
  //   yield put<FetchResourcesAction>({
  //     type: 'fetchResources',
  //     payload: true,
  //   });
  // }

  return (<>
    <div className={styles.filter}>
      <FDropdownMenu
        options={selectOptions}
        onChange={(value) => {
          // dispatch<OnChangeRConditionsAction>({
          //   type: 'storageObjectDepSelector/onChangeRConditions',
          //   payload: {
          //     rSelect: value as ('1' | '2' | '3'),
          //   },
          // });
          $setState({
            rSelect: value as '1',
          });
        }}
      >
        <a>{(selectOptions.find((op) => op.value === $state.rSelect) as any).text}
          <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} /></a>
      </FDropdownMenu>
      {/*<FInput*/}
      {/*  theme='dark'*/}
      {/*  debounce={300}*/}
      {/*  value={storageObjectDepSelector.rInput}*/}
      {/*  onDebounceChange={(value) => {*/}
      {/*    dispatch<OnChangeRConditionsAction>({*/}
      {/*      type: 'storageObjectDepSelector/onChangeRConditions',*/}
      {/*      payload: {*/}
      {/*        rInput: value,*/}
      {/*      },*/}
      {/*    });*/}
      {/*  }}*/}
      {/*/>*/}
      <FComponentsLib.FInput.FSearch
        value={$state.rInput}
        onChange={(e) => {
          $setState({
            rInput: e.target.value,
          });
        }}
      />
    </div>
    {/*{console.log(storageObjectDepSelector.resourceList, 'selector.resourceList@!@#$@!#$@#$!234234')}*/}
    <FResourceList
      showRemoveIDsOrNames={showRemoveIDsOrNames}
      disabledIDsOrNames={disabledIDsOrNames}
      resourceObjects={$state.resourceList.map((r) => ({
        id: r.resourceId,
        title: r.resourceName,
        resourceType: r.resourceType,
        status: r.status,
        time: r.updateDate,
        latestVersion: r.latestVersion,
      }))}
      loading={$state.rTotal === -1}
      stillMore={$state.resourceList.length < $state.rTotal}
      onSelect={(value) => {
        onSelect && onSelect({ id: value.id, name: value.title });
      }}
      onDelete={(value) => {
        onDelete && onDelete({ id: value.id, name: value.title });
      }}
      onLoadMord={() => {
        // dispatch<FetchResourcesAction>({
        //   type: 'storageObjectDepSelector/fetchResources',
        //   payload: false,
        // });
        fetchResources(false);
      }}
    />
  </>);
}

export default connect(({ storageObjectDepSelector }: ConnectState) => ({
  storageObjectDepSelector: storageObjectDepSelector,
}))(FResourceSelector);
