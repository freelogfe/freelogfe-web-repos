import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState, StorageObjectDepSelectorModelState} from "@/models/connect";
import {FUtil, FServiceAPI} from '@freelog/tools-lib';

export interface ResourceDepSelectorModelState{
  selected: '1' | '2' | '3';
  input: string;

  limit: number;

  totalItem: number;
  resourceList: {
    resourceId: string;
    resourceName: string;
    resourceType: string[];
    updateDate: string;
    status: 0 | 1;
    latestVersion: string;
    baseUpcastResources: any;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceDepSelector/change';
  payload: Partial<ResourceDepSelectorModelState>;
}

export interface FetchResourcesAction extends AnyAction {
  type: 'resourceDepSelector/fetchResources' | 'fetchResources';
  payload?: boolean; // 是否restart
}

export interface ResourceDepSelectorModelType {
  namespace: 'resourceDepSelector';
  state: ResourceDepSelectorModelState;
  effects: {
    fetchResources: (action: FetchResourcesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceDepSelectorModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: ResourceDepSelectorModelType = {
  namespace: 'resourceDepSelector',
  state: {
    selected: '1',
    totalItem: -1,
    input: '',
    limit: 20,
    resourceList: [],
  },
  effects: {
    * fetchResources({payload}: FetchResourcesAction, {select, call, put}: EffectsCommandMap) {
      const {resourceDepSelector}: ConnectState = yield select(({resourceDepSelector}: ConnectState) => ({
        resourceDepSelector,
      }));
      let resourceList: ResourceDepSelectorModelState['resourceList'] = [];
      if (!payload) {
        resourceList = resourceDepSelector.resourceList;
      }
      // let dataSource: any;
      let totalItem: number = -1;
      if (resourceDepSelector.selected === '3') {
        const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
          skip: resourceList.length,
          // limit: resourceDepSelector.limit,
          limit: FUtil.Predefined.pageSize,
          keywords: resourceDepSelector.input,
        };
        const {data} = yield call(FServiceAPI.Collection.collectionResources, params);
        // console.log(data, '##########5210823423');
        // dataSource = data;
        totalItem = data.totalItem;
        resourceList = [
          ...resourceList,
          ...(data.dataList as any[]).map<ResourceDepSelectorModelState['resourceList'][number]>((r: any) => {
            // console.log(r, 'r20893u4oi23');
            return {
              resourceId: r.resourceId,
              resourceName: r.resourceName,
              resourceType: r.resourceType,
              updateDate: FUtil.Format.formatDateTime(r.resourceUpdateDate, true),
              status: r.resourceStatus,
              latestVersion: r.latestVersion,
              baseUpcastResources: r.baseUpcastResources,
            };
          }),
        ];
      } else {
        const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
          startResourceId: resourceList[0]?.resourceId,
          skip: resourceList.length,
          // limit: resourceDepSelector.limit,
          limit: FUtil.Predefined.pageSize,
          keywords: resourceDepSelector.input,
          status: resourceDepSelector.selected === '2' ? undefined : 1,
          isSelf: resourceDepSelector.selected === '2' ? 1 : undefined,
        };
        const {data} = yield call(FServiceAPI.Resource.list, params);
        // dataSource = data;
        // console.log(data, '@@@@@@@@@@@@123412341234');
        totalItem = data.totalItem;
        resourceList = [
          ...resourceList,
          ...(data.dataList as any[]).map<ResourceDepSelectorModelState['resourceList'][number]>((r: any) => ({
            resourceId: r.resourceId,
            resourceName: r.resourceName,
            resourceType: r.resourceType,
            updateDate: FUtil.Format.formatDateTime(r.updateDate, true),
            status: r.status,
            latestVersion: r.latestVersion,
            baseUpcastResources: r.baseUpcastResources,
          })),
        ];
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          totalItem: totalItem,
          resourceList: resourceList,
        },
      });
    },
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  subscriptions: {
    setup({}) {

    }
  }
};

export default Model;
