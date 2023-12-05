import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import moment from 'moment';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { history } from 'umi';
import { listStateAndListMore } from '@/components/FListFooter';
import fResourceTypeInputDrawer from '@/components/fResourceTypeInputDrawer';
import fCenterMessage from '@/components/fCenterMessage';

export interface StorageHomePageModelState {
  bucketList: {
    bucketName: string;
    bucketType: 0 | 1 | 2;
    createDate: string;
    totalFileQuantity: number;
  }[] | null;
  activatedBucket: string;
  totalStorage: number;
  usedStorage: number;

  filterInput: string;
  object_List: {
    key: string;
    id: string;
    name: string;
    bucketName: string;
    type: string[];
    size: number;
    updateTime: string;
  }[];
  object_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  object_ListMore: 'loading' | 'andMore' | 'noMore';
  isLoading: boolean;
  pageSize: number;
  total: number;
  checkedObjectIDs: string[];
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'storageHomePage/change';
  payload: Partial<StorageHomePageModelState>;
}

export interface FetchBucketsAction extends AnyAction {
  type: 'storageHomePage/fetchBuckets' | 'fetchBuckets';
  payload?: {
    from: 'header' | 'other';
  },
}

export interface OnSucceed_CreateBucket_Action extends AnyAction {
  type: 'storageHomePage/onSucceed_CreateBucket';
  payload: {
    newBucketName: string;
  };
}

export interface OnChangeActivatedBucketAction extends AnyAction {
  type: 'storageHomePage/onChangeActivatedBucket' | 'onChangeActivatedBucket';
  payload: string;
}

export interface FetchSpaceStatisticAction extends AnyAction {
  type: 'fetchSpaceStatistic' | 'storageHomePage/fetchSpaceStatistic';
}

export interface DeleteBucketByNameAction extends AnyAction {
  type: 'storageHomePage/deleteBucketByName';
  payload: string;
}

export interface CreateObjectAction extends AnyAction {
  type: 'storageHomePage/createObject';
  payload: { sha1: string; objectName: string };
}

export interface OnChange_FilterInput_Action extends AnyAction {
  type: 'storageHomePage/onChange_FilterInput';
  payload: {
    value: string;
  };
}

export interface FetchObjectsAction extends AnyAction {
  type: 'storageHomePage/fetchObjects' | 'fetchObjects';
  payload?: 'restart' | 'insert' | 'append';
}

export interface DeleteObjectAction extends AnyAction {
  type: 'storageHomePage/deleteObject';
  payload: string;
}

export interface UpdateAObjectAction extends AnyAction {
  type: 'storageHomePage/updateAObject';
  payload: Pick<StorageHomePageModelState['object_List'][number], 'id'> & Partial<Omit<StorageHomePageModelState['object_List'][number], 'id'>>;
}

export interface OnBatchDeleteObjectsAction extends AnyAction {
  type: 'storageHomePage/onBatchDeleteObjects';
}

export interface OnBatchUpdateObjectsAction extends AnyAction {
  type: 'storageHomePage/onBatchUpdateObjects';
}

interface StorageHomePageModelType {
  namespace: 'storageHomePage';
  state: StorageHomePageModelState;
  effects: {
    fetchBuckets: (action: FetchBucketsAction, effects: EffectsCommandMap) => void;
    onSucceed_CreateBucket: (action: OnSucceed_CreateBucket_Action, effects: EffectsCommandMap) => void;
    onChangeActivatedBucket: (action: OnChangeActivatedBucketAction, effects: EffectsCommandMap) => void;
    fetchSpaceStatistic: (action: FetchSpaceStatisticAction, effects: EffectsCommandMap) => void;
    deleteBucketByName: (action: DeleteBucketByNameAction, effects: EffectsCommandMap) => void;
    createObject: (action: CreateObjectAction, effects: EffectsCommandMap) => void;
    onChange_FilterInput: (action: OnChange_FilterInput_Action, effects: EffectsCommandMap) => void;
    fetchObjects: (action: FetchObjectsAction, effects: EffectsCommandMap) => void;
    deleteObject: (action: DeleteObjectAction, effects: EffectsCommandMap) => void;
    updateAObject: (action: UpdateAObjectAction, effects: EffectsCommandMap) => void;
    onBatchDeleteObjects: (action: OnBatchDeleteObjectsAction, effects: EffectsCommandMap) => void;
    onBatchUpdateObjects: (action: OnBatchUpdateObjectsAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<StorageHomePageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: StorageHomePageModelType = {
  namespace: 'storageHomePage',
  state: {
    bucketList: null,
    activatedBucket: '',
    totalStorage: -1,
    usedStorage: -1,

    filterInput: '',
    object_List: [],
    object_ListState: 'loading',
    object_ListMore: 'loading',
    isLoading: true,
    pageSize: 100,
    total: -1,
    checkedObjectIDs: [],
  },
  effects: {
    * fetchBuckets({ payload }: FetchBucketsAction, { call, put, select }: EffectsCommandMap) {
      // const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({ storageHomePage }));

      const params: Parameters<typeof FServiceAPI.Storage.bucketList>[0] = {
        // bucketType: 0,
        bucketType: 1,
      };
      const { data } = yield call(FServiceAPI.Storage.bucketList, params);
      const bucketList: NonNullable<StorageHomePageModelState['bucketList']> = data
        .map((i: any) => ({
          bucketName: i.bucketName,
          bucketType: i.bucketType,
          createDate: moment(i.createDate).format('YYYY.MM.DD HH:mm'),
          totalFileQuantity: i.totalFileQuantity,
        }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bucketList: bucketList,
        },
      });

      yield put<FetchSpaceStatisticAction>({
        type: 'fetchSpaceStatistic',
      });
    },
    * onSucceed_CreateBucket({ payload }: OnSucceed_CreateBucket_Action, { call, select, put }: EffectsCommandMap) {

      yield put<FetchBucketsAction>({
        type: 'fetchBuckets',
      });
      history.replace(FUtil.LinkTo.storageSpace({
        bucketName: payload.newBucketName,
        createBucket: false,
      }));
    },
    * onChangeActivatedBucket({ payload }: OnChangeActivatedBucketAction, { put, select, call }: EffectsCommandMap) {
      const { storageHomePage, user }: ConnectState = yield select(({ storageHomePage, user }: ConnectState) => ({
        storageHomePage,
        user,
      }));
      if (payload === storageHomePage.activatedBucket) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Storage.bucketDetails>[0] = {
        bucketName: payload,
      };
      const { data } = yield call(FServiceAPI.Storage.bucketDetails, params);
      // console.log(data, '@!#@$!@#$@#$DDDDDDD');

      // if (!data || data.userId !== user.cookiesUserID) {
      if (!data || data.userId !== FUtil.Tool.getUserIDByCookies()) {
        history.replace(FUtil.LinkTo.exception403());
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          activatedBucket: payload,
        },
      });
      yield put<FetchObjectsAction>({
        type: 'fetchObjects',
      });
    },
    * fetchSpaceStatistic({}: FetchSpaceStatisticAction, { put, call }: EffectsCommandMap) {
      const { data } = yield call(FServiceAPI.Storage.spaceStatistics);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          totalStorage: data.storageLimit,
          usedStorage: data.totalFileSize,
        },
      });
    },
    * deleteBucketByName({ payload }: DeleteBucketByNameAction, { call, put, select }: EffectsCommandMap) {
      const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({
        storageHomePage,
      }));
      const params: Parameters<typeof FServiceAPI.Storage.deleteBucket>[0] = {
        bucketName: payload,
      };
      // console.log(payload, 'DDDDDDDDelete');
      const { data } = yield call(FServiceAPI.Storage.deleteBucket, params);

      const newBucket: StorageHomePageModelState['bucketList'] = (storageHomePage.bucketList || []).filter((b) => {
        return b.bucketName !== payload;
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bucketList: newBucket,
        },
      });

      if (newBucket.some((b) => b.bucketName === storageHomePage.activatedBucket)) {
        return;
      }
      if (newBucket.length === 0) {
        history.replace(FUtil.LinkTo.storageSpace({
          bucketName: '',
        }));
      } else {
        history.replace(FUtil.LinkTo.storageSpace({
          bucketName: newBucket[0].bucketName,
        }));
      }
    },
    * createObject({ payload }: CreateObjectAction, { call, select, put }: EffectsCommandMap) {
      const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({
        storageHomePage,
      }));
      const params: Parameters<typeof FServiceAPI.Storage.createObject>[0] = {
        bucketName: storageHomePage.activatedBucket,
        objectName: payload.objectName,
        sha1: payload.sha1,
      };
      yield call(FServiceAPI.Storage.createObject, params);
    },
    * onChange_FilterInput({ payload }: OnChange_FilterInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          filterInput: payload.value,
        },
      });

      yield put<FetchObjectsAction>({
        type: 'fetchObjects',
        payload: 'restart',
      });

    },
    * fetchObjects({ payload = 'restart' }: FetchObjectsAction, { select, call, put }: EffectsCommandMap) {
      const { storageHomePage, user }: ConnectState = yield select(({ storageHomePage, user }: ConnectState) => ({
        storageHomePage,
        user,
      }));
      let skip: number = 0;
      let limit: number = FUtil.Predefined.pageSize;
      if (payload === 'append') {
        if (storageHomePage.object_List.length === storageHomePage.total) {
          return;
        }
        skip = storageHomePage.object_List.length;
      }
      const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
        bucketName: storageHomePage.activatedBucket,
        limit,
        skip,
        sort: 'updateDate:-1',
        keywords: storageHomePage.filterInput,
      };
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // object_ListState: 'loading',
          object_ListMore: 'loading',
        },
      });
      const { data } = yield call(FServiceAPI.Storage.objectList, params);
      let objectListData: StorageHomePageModelState['object_List'] = [];

      if (payload === 'restart') {
        objectListData = (data?.dataList || []).map(transformTableData);
      } else if (payload === 'append') {
        objectListData = [
          ...storageHomePage.object_List,
          ...(data?.dataList || []).map(transformTableData),
        ];
      } else if (payload === 'insert') {
        objectListData = (data?.dataList || []).map(transformTableData);
      }
      const { state, more } = listStateAndListMore({
        list_Length: objectListData.length,
        total_Length: data.totalItem,
        has_FilterCriteria: storageHomePage.filterInput !== '',
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          object_List: objectListData,
          object_ListState: state,
          object_ListMore: more,
          total: data?.totalItem,
          isLoading: false,
        },
      });
    },
    * deleteObject({ payload }: DeleteObjectAction, { call, select, put }: EffectsCommandMap) {
      const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({
        storageHomePage,
      }));
      const params: Parameters<typeof FServiceAPI.Storage.deleteObjects>[0] = {
        bucketName: storageHomePage.activatedBucket,
        objectIds: payload,
      };
      yield call(FServiceAPI.Storage.deleteObjects, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          object_List: storageHomePage.object_List.filter((ol) => ol.id !== payload),
          total: storageHomePage.total - 1,
        },
      });
      yield put<FetchSpaceStatisticAction>({
        type: 'fetchSpaceStatistic',
      });
      yield put<FetchBucketsAction>({
        type: 'fetchBuckets',
      });
    },
    * updateAObject({ payload }: UpdateAObjectAction, { select, put }: EffectsCommandMap) {
      const { id, ...data } = payload;
      const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({
        storageHomePage,
      }));
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          object_List: storageHomePage.object_List.map<StorageHomePageModelState['object_List'][number]>((ol) => {
            if (ol.id !== id) {
              return ol;
            }
            return {
              ...ol,
              ...data,
            };
          }),
        },
      });
    },
    * onBatchDeleteObjects({}: OnBatchDeleteObjectsAction, { select, call, put }: EffectsCommandMap) {
      // console.log('OnBatchDeleteObjectsAction 9ioewj;flisjd;lkfjls;kdjfl;ksdjlfk;j');
      const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({
        storageHomePage,
      }));
      const params: Parameters<typeof FServiceAPI.Storage.deleteObjects>[0] = {
        bucketName: storageHomePage.activatedBucket,
        objectIds: storageHomePage.checkedObjectIDs.join(','),
      };
      yield call(FServiceAPI.Storage.deleteObjects, params);
      if (storageHomePage.object_List.length - storageHomePage.checkedObjectIDs.length > 0) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            object_List: storageHomePage.object_List.filter((ol) => {
              return !storageHomePage.checkedObjectIDs.includes(ol.id);
            }),
            total: storageHomePage.total - storageHomePage.checkedObjectIDs.length,
          },
        });
      } else {
        yield put<FetchObjectsAction>({
          type: 'fetchObjects',
        });
      }

      yield put<FetchSpaceStatisticAction>({
        type: 'fetchSpaceStatistic',
      });
      yield put<FetchBucketsAction>({
        type: 'fetchBuckets',
      });
      yield call(fCenterMessage, { message: FI18n.i18nNext.t('storage_bulkaction_deleteobject_msg_done') });
    },
    * onBatchUpdateObjects({}: OnBatchUpdateObjectsAction, { select, call, put }: EffectsCommandMap) {
      const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({
        storageHomePage,
      }));

      const value: {
        value: string;
        labels: string[];
        customInput?: string;
      } | null = yield call(fResourceTypeInputDrawer);
      if (!value) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.Storage.batchUpdateObject>[0] = {
        objectIds: storageHomePage.checkedObjectIDs,
        resourceTypeCode: value.value,
        resourceTypeName: value.customInput,
      };
      const { data }: {
        data: {
          [k: string]: {
            data: any;
            status: 1 | 2;
          };
        }
      } = yield call(FServiceAPI.Storage.batchUpdateObject, params);
      // console.log(data, ';DDFSdfksjdlkfjlsdjljl');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          object_List: storageHomePage.object_List.map((rl) => {
            if (data[rl.id] && data[rl.id].status === 1) {
              return {
                ...rl,
                type: data[rl.id].data.resourceType,
              };
            }
            return rl;
          }),
        },
      });
      yield call(fCenterMessage, { message: FI18n.i18nNext.t('storage_bulkaction_settype_msg_done') });
    },
  },
  reducers: {
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({ dispatch }, done) {
      if (FUtil.Tool.getUserIDByCookies() !== -1) {
        dispatch<FetchBucketsAction>({
          type: 'fetchBuckets',
          payload: {
            from: 'other',
          },
        });
      }
    },
  },
};

export default Model;

function transformTableData(i: any) {
  return {
    key: i.objectId,
    dataIndex: i.objectId,
    id: i.objectId,
    name: i.objectName,
    bucketName: i.bucketName,
    type: i.resourceType,
    size: FUtil.Format.humanizeSize(i.systemProperty.fileSize),
    updateTime: FUtil.Format.formatDateTime(i.updateDate, true),
  };
}
