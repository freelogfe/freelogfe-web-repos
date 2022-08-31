import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import moment from 'moment';
import { RcFile } from 'antd/lib/upload/interface';
import fMessage from '@/components/fMessage';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { history } from 'umi';

export interface StorageHomePageModelState {
  newBucketName: string;
  newBucketNameIsDirty: boolean;
  newBucketNameError: boolean;
  newBucketModalVisible: boolean;

  bucketList: {
    bucketName: string;
    bucketType: 0 | 1 | 2;
    createDate: string;
    totalFileQuantity: number;
  }[] | null;
  activatedBucket: string;
  totalStorage: number;
  usedStorage: number;

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

  uploadTaskQueue: {
    uid: string;
    sha1: string;
    file: RcFile
    name: string;
    state: -1 | 0 | 1; // -1:未成功；0:进行中；1:已成功
    exist: boolean;
    sameName: boolean;
  }[];
  uploadPanelVisible: boolean;
  uploadPanelOpen: boolean;
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

export interface OnChangeNewBucketAction extends AnyAction {
  type: 'storageHomePage/onChangeNewBucket';
  payload: string;
}

export interface CreateBucketAction extends AnyAction {
  type: 'storageHomePage/createBucket';
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

export interface FetchObjectsAction extends AnyAction {
  type: 'storageHomePage/fetchObjects' | 'fetchObjects';
  payload?: 'restart' | 'insert' | 'append';
}

export interface DeleteObjectAction extends AnyAction {
  type: 'storageHomePage/deleteObject';
  payload: string;
}

export interface UploadFilesAction extends AnyAction {
  type: 'storageHomePage/uploadFiles';
  payload: RcFile[];
}

export interface UpdateAObjectAction extends AnyAction {
  type: 'storageHomePage/updateAObject';
  payload: Pick<StorageHomePageModelState['object_List'][number], 'id'> & Partial<Omit<StorageHomePageModelState['object_List'][number], 'id'>>;
}

interface StorageHomePageModelType {
  namespace: 'storageHomePage';
  state: StorageHomePageModelState;
  effects: {
    fetchBuckets: (action: FetchBucketsAction, effects: EffectsCommandMap) => void;
    onChangeNewBucket: (action: OnChangeNewBucketAction, effects: EffectsCommandMap) => void;
    createBucket: (action: CreateBucketAction, effects: EffectsCommandMap) => void;
    onChangeActivatedBucket: (action: OnChangeActivatedBucketAction, effects: EffectsCommandMap) => void;
    fetchSpaceStatistic: (action: FetchSpaceStatisticAction, effects: EffectsCommandMap) => void;
    deleteBucketByName: (action: DeleteBucketByNameAction, effects: EffectsCommandMap) => void;
    createObject: (action: CreateObjectAction, effects: EffectsCommandMap) => void;
    fetchObjects: (action: FetchObjectsAction, effects: EffectsCommandMap) => void;
    deleteObject: (action: DeleteObjectAction, effects: EffectsCommandMap) => void;
    uploadFiles: (action: UploadFilesAction, effects: EffectsCommandMap) => void;
    updateAObject: (action: UpdateAObjectAction, effects: EffectsCommandMap) => void;
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
    newBucketName: '',
    newBucketNameIsDirty: false,
    newBucketNameError: false,
    newBucketModalVisible: false,

    bucketList: null,
    activatedBucket: '',
    totalStorage: -1,
    usedStorage: -1,

    object_List: [],
    object_ListState: 'loading',
    object_ListMore: 'loading',
    isLoading: true,
    pageSize: 100,
    total: -1,

    uploadTaskQueue: [],
    uploadPanelVisible: false,
    uploadPanelOpen: false,
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
    * onChangeNewBucket({ payload }: OnChangeNewBucketAction, { put, select, call }: EffectsCommandMap) {
      const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({ storageHomePage }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          newBucketName: payload,
          newBucketNameIsDirty: true,
        },
      });

      if (!FUtil.Regexp.BUCKET_NAME.test(payload) || storageHomePage.bucketList?.map((b) => b.bucketName).includes(payload)) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            newBucketNameError: true,
          },
        });
      } else {
        const params: Parameters<typeof FServiceAPI.Storage.bucketIsExist>[0] = {
          bucketName: payload,
        };
        const { data } = yield call(FServiceAPI.Storage.bucketIsExist, params);
        // console.log(data, '@@@@@Dddddddddddd====');
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            newBucketNameError: data,
          },
        });
      }

    },
    * createBucket({}: CreateBucketAction, { call, select, put }: EffectsCommandMap) {
      const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({ storageHomePage }));

      const params: Parameters<typeof FServiceAPI.Storage.createBucket>[0] = {
        bucketName: storageHomePage.newBucketName,
      };
      yield call(FServiceAPI.Storage.createBucket, params);

      yield put<FetchBucketsAction>({
        type: 'fetchBuckets',
      });
      history.replace(FUtil.LinkTo.storageSpace({
        bucketName: storageHomePage.newBucketName,
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
    * fetchObjects({ payload = 'restart' }: FetchObjectsAction, { select, call, put }: EffectsCommandMap) {
      const { storageHomePage, user }: ConnectState = yield select(({ storageHomePage, user }: ConnectState) => ({
        storageHomePage,
        user,
      }));
      let skip: number = 0;
      let limit: number = FUtil.Predefined.pageSize;
      // let limit: number = 5;

      if (payload === 'append') {
        if (storageHomePage.object_List.length === storageHomePage.total) {
          return;
        }
        skip = storageHomePage.object_List.length;
      } else if (payload === 'insert') {
        const allNames: string[] = [
          ...storageHomePage.uploadTaskQueue.map<string>((utq) => utq.name),
          ...storageHomePage.object_List.map<string>((ol) => ol.name),
        ];
        limit = new Set(allNames).size;
      }
      const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
        bucketName: storageHomePage.activatedBucket,
        limit,
        skip,
        sort: 'updateDate:-1',
      };
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // object_ListState: 'loading',
          object_ListMore: 'loading',
        },
      });
      const { data } = yield call(FServiceAPI.Storage.objectList, params);
      // console.log(data, 'data!@#$!@#$@!#!@#@!#$33333');

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

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          object_List: objectListData,
          object_ListState: 'loaded',
          object_ListMore: (data?.totalItem || 0) > objectListData.length ? 'andMore' : 'noMore',
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
    * uploadFiles({ payload }: UploadFilesAction, { select, put, call }: EffectsCommandMap) {
      const { storageHomePage }: ConnectState = yield select(({ storageHomePage }: ConnectState) => ({
        storageHomePage,
      }));
      // console.log(payload, 'payload@!@#$!@#$@#!4213424');
      if (payload[0].size > 200 * 1024 * 1024) {
        fMessage('单个文件不能大于 200 M', 'warning');
        return;
      }
      const totalSize: number = payload.map((f) => f.size).reduce((p, c) => p + c, 0);
      if (storageHomePage.totalStorage - storageHomePage.usedStorage < totalSize) {
        fMessage('超出储存', 'warning');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          uploadPanelVisible: true,
        },
      });
      const uploadTaskQueue: StorageHomePageModelState['uploadTaskQueue'] = yield call(getInfo, payload);

      const params: Parameters<typeof FServiceAPI.Storage.fileIsExist>[0] = {
        sha1: uploadTaskQueue.map((utq) => utq.sha1).join(','),
      };
      const { data } = yield call(FServiceAPI.Storage.fileIsExist, params);
      const allExistSha1: string[] = data.filter((d: any) => d.isExisting).map((d: any) => d.sha1);

      const params1: Parameters<typeof FServiceAPI.Storage.batchObjectList>[0] = {
        fullObjectNames: payload.map((p) => storageHomePage.activatedBucket + '/' + p.name).join(','),
        projection: 'objectId,objectName',
      };

      const { data: data1 } = yield call(FServiceAPI.Storage.batchObjectList, params1);
      const allExistObjectNames: string[] = data1.map((d: any) => d.objectName);
      // console.log(allObjectNames, 'allObjectNames23sdfadf');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          uploadTaskQueue: [
            ...uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => ({
              ...utq,
              exist: allExistSha1.includes(utq.sha1),
              sameName: allExistObjectNames.includes(utq.name),
            })),
            ...storageHomePage.uploadTaskQueue,
          ],
          uploadPanelOpen: true,
          uploadPanelVisible: true,
        },
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

async function getInfo(payload: RcFile[]): Promise<StorageHomePageModelState['uploadTaskQueue']> {
  return Promise.all(payload.map<Promise<StorageHomePageModelState['uploadTaskQueue'][number]>>(async (fo) => ({
    uid: fo.uid,
    sha1: await FUtil.Tool.getSHA1Hash(fo),
    name: fo.name.replace(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g, '_'),
    file: fo,
    state: 0,
    exist: false,
    sameName: false,
  })));
}

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