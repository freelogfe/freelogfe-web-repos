import * as React from 'react';

import styles from './index.less';
import FResourceList from '@/components/FResourceList';
// import { ConnectState, StorageObjectDepSelectorModelState } from '@/models/connect';
import FDropdownMenu from '@/components/FDropdownMenu';
import FComponentsLib from '@freelog/components-lib';
import * as AHooks from 'ahooks';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';

interface FResourceSelectorProps {
  disabledIDsOrNames?: string[];
  showRemoveIDsOrNames?: string[];

  onSelect?({ id, name }: { id: string; name: string; }): void;

  onDelete?({ id, name }: { id: string; name: string; }): void;
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
  rSelect: 'market' | 'my' | 'collection';
  rInput: string;
}

const initState: FResourceSelectorStates = {
  resourceList: [],
  rTotal: -1,
  rPageSize: 20,
  rSelect: 'market',
  rInput: '',
};

const selectOptions: { text: string, value: FResourceSelectorStates['rSelect'] }[] = [
  { text: '资源市场', value: 'market' },
  { text: '我的资源', value: 'my' },
  { text: '我的收藏', value: 'collection' },
];

function FResourceSelector($prop: FResourceSelectorProps) {

  const [$state, $setState] = AHooks.useSetState<FResourceSelectorStates>(initState);

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
    if ($state.rSelect === 'collection') {
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
        ...(data.dataList as any[]).map<FResourceSelectorStates['resourceList'][number]>((r: any) => ({
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
        status: $state.rSelect === 'my' ? undefined : 1,
        isSelf: $state.rSelect === 'my' ? 1 : undefined,
      };
      const { data } = await FServiceAPI.Resource.list(params);
      // dataSource = data;
      // console.log(data, '@@@@@@@@@@@@123412341234');
      totalItem = data.totalItem;
      resourceList = [
        ...resourceList,
        ...(data.dataList as any[]).map<FResourceSelectorStates['resourceList'][number]>((r: any) => ({
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

  return (<>
    <div className={styles.filter}>
      <FDropdownMenu
        options={selectOptions}
        onChange={(value) => {
          $setState({
            rSelect: value as 'market',
          });
        }}
      >
        <a>{(selectOptions.find((op) => op.value === $state.rSelect) as any).text}
          <FComponentsLib.FIcons.FDown style={{ marginLeft: 8, fontSize: 12 }} /></a>
      </FDropdownMenu>
      <FComponentsLib.FInput.FSearch
        value={$state.rInput}
        onChange={(value) => {
          $setState({
            rInput: value,
          });
        }}
      />
    </div>
    <FResourceList
      showRemoveIDsOrNames={$prop.showRemoveIDsOrNames}
      disabledIDsOrNames={$prop.disabledIDsOrNames}
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
        $prop.onSelect && $prop.onSelect({ id: value.id, name: value.title });
      }}
      onDelete={(value) => {
        $prop.onDelete && $prop.onDelete({ id: value.id, name: value.title });
      }}
      onLoadMord={() => {
        fetchResources(false);
      }}
    />
  </>);
}

export default FResourceSelector;
