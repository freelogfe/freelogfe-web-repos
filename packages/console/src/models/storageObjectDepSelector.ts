import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {list, ListParamsType} from "@/services/resources";
import {objectList, ObjectListParamsType} from "@/services/storages";
import {formatDateTime} from "@/utils/format";
import {ConnectState} from "@/models/connect";
import {resourceList, ResourceListParamsType} from "@/services/collections";

export interface StorageObjectDepSelectorModelState {
  // tabKey: '1' | '2';

  resourceList: {
    resourceId: string;
    resourceName: string;
    resourceType: string;
    updateDate: string;
    status: 0 | 1;
  }[];
  rPageCurrent: number;
  rPageSize: number;
  rTotal: number;
  rSelect: '1' | '2' | '3';
  rInput: string;

  objectList: {
    objectId: string;
    bucketName: string;
    objectName: string;
    resourceType: string;
    updateDate: string;
  }[];
  oPageCurrent: number;
  oPageSize: number;
  oTotal: number;
  oSelect: '_all' | string;
  oInput: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<StorageObjectDepSelectorModelState>;
}

export interface FetchResourcesAction extends AnyAction {
  type: 'storageObjectDepSelector/fetchResources' | 'fetchResources';
}

export interface FetchObjectsAction extends AnyAction {
  type: 'storageObjectDepSelector/fetchObjects' | 'fetchObjects';
}

export interface OnChangeRConditionsAction extends AnyAction {
  type: 'storageObjectDepSelector/onChangeRConditions';
  payload: {
    rPageCurrent?: number;
    rSelect?: '1' | '2' | '3';
    rInput?: string;
  };
}

export interface OnChangeOConditionsAction extends AnyAction {
  type: 'storageObjectDepSelector/onChangeOConditions';
  payload: {
    oPageCurrent?: number;
    oSelect?: '_all' | string;
    oInput?: string;
  };
}

export interface StorageObjectDepSelectorModelType {
  namespace: 'storageObjectDepSelector';
  state: StorageObjectDepSelectorModelState;
  effects: {
    fetchResources: (action: FetchResourcesAction, effects: EffectsCommandMap) => void;
    fetchObjects: (action: FetchObjectsAction, effects: EffectsCommandMap) => void;
    onChangeRConditions: (action: OnChangeRConditionsAction, effects: EffectsCommandMap) => void;
    onChangeOConditions: (action: OnChangeOConditionsAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<StorageObjectDepSelectorModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: StorageObjectDepSelectorModelType = {
  namespace: 'storageObjectDepSelector',
  state: {
    // tabKey: '1',

    resourceList: [],
    rTotal: -1,
    rPageSize: 20,
    rPageCurrent: 1,
    rSelect: '1',
    rInput: '',

    objectList: [],
    oTotal: -1,
    oPageSize: 20,
    oPageCurrent: 1,
    oSelect: '_all',
    oInput: '',
  },
  effects: {
    * fetchResources({}: FetchResourcesAction, {call, put, select}: EffectsCommandMap) {
      const {storageObjectDepSelector: selector}: ConnectState = yield select(({storageObjectDepSelector}: ConnectState) => ({
        storageObjectDepSelector,
      }));
      const params: ListParamsType | ResourceListParamsType = {
        page: selector.rPageCurrent,
        pageSize: selector.rPageSize,
        keywords: selector.rInput,
        isSelf: selector.rSelect === '2' ? 1 : 0,
      };

      if (selector.rSelect === '3') {
        const {data} = yield call(resourceList, params);
        console.log(data, 'data3209dj');
        return;
      }

      const {data} = yield call(list, params);
      // console.log(data, '#EWDS90');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rTotal: data.totalItem,
          resourceList: [
            ...selector.resourceList,
            ...data.dataList.map((r: any) => ({
              resourceId: r.resourceId,
              resourceName: r.resourceName,
              resourceType: r.resourceType,
              updateDate: formatDateTime(r.updateDate, true),
              status: r.status,
            })),
          ],
        },
      });
    },
    * fetchObjects({}: FetchObjectsAction, {call, put, select}: EffectsCommandMap) {
      const {storageObjectDepSelector: selector}: ConnectState = yield select(({storageObjectDepSelector}: ConnectState) => ({
        storageObjectDepSelector,
      }));
      const params: ObjectListParamsType = {
        bucketName: selector.oSelect,
        keywords: selector.oInput,
        page: selector.oPageCurrent,
        pageSize: selector.oPageSize,
      };
      const {data} = yield call(objectList, params);
      // console.log(data, 'datadata322');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          oTotal: data.totalItem,
          objectList: [
            ...selector.objectList,
            ...data.dataList.map((o: any) => ({
              objectId: o.objectId,
              bucketName: o.bucketName,
              objectName: o.objectName,
              resourceType: o.resourceType,
              updateDate: formatDateTime(o.updateDate, true),
            })),
          ],
        },
      });
    },
    * onChangeRConditions({payload}: OnChangeRConditionsAction, {put}: EffectsCommandMap) {
      if (!payload.rPageCurrent) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            ...payload,
            rPageCurrent: 1,
            resourceList: [],
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rPageCurrent: payload.rPageCurrent,
          },
        });
      }

      yield put<FetchResourcesAction>({
        type: 'fetchResources',
      });
    },
    * onChangeOConditions({payload}: OnChangeOConditionsAction, {put}: EffectsCommandMap) {
      if (!payload.oPageCurrent) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            ...payload,
            oPageCurrent: 1,
            objectList: [],
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rPageCurrent: payload.oPageCurrent,
          },
        });
      }

      yield put<FetchObjectsAction>({
        type: 'fetchObjects',
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
