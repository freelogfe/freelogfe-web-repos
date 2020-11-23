import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from '@/models/connect';
import {
  bucketList,
  BucketListParamsType,
  createBucket,
  CreateBucketParamsType,
  createObject,
  CreateObjectParamsType,
  deleteBuckets,
  DeleteBucketsParamsType, deleteObjects, DeleteObjectsParamsType, fileIsExist, FileIsExistParamsType,
  objectList,
  ObjectListParamsType,
  spaceStatistics,
} from '@/services/storages';
import moment from 'moment';
import {RcFile} from "antd/lib/upload/interface";
import {formatDateTime, humanizeSize} from "@/utils/format";
import fMessage from "@/components/fMessage";
import {getSHA1Hash} from "@/utils/tools";

export interface StorageHomePageModelState {
  newBucketName: string;
  newBucketNameError: boolean;
  newBucketModalVisible: boolean;

  bucketList: {
    bucketName: string;
    bucketType: 0 | 1 | 2;
    createDate: string;
    totalFileQuantity: number;
  }[];
  activatedBucket: string;
  totalStorage: number;
  usedStorage: number;

  objectList: {
    key: string;
    id: string;
    name: string;
    type: string;
    size: number;
    updateTime: string;
  }[];
  pageCurrent: number;
  pageSize: number;
  total: number;

  uploadTaskQueue: {
    uid: string;
    sha1: string;
    file: RcFile
    name: string;
    state: 0 | 1; // 0:未上传；1:上传成功
    exist: boolean;
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
}

export interface CreateBucketAction extends AnyAction {
  type: 'storageHomePage/createBucket';
}

export interface OnChangeActivatedBucketAction extends AnyAction {
  type: 'storageHomePage/onChangeActivatedBucket' | 'onChangeActivatedBucket';
  payload: string;
}

export interface FetchSpaceStatisticAction extends AnyAction {
  type: 'fetchSpaceStatistic';
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
}

export interface OnChangePaginationAction extends AnyAction {
  type: 'storageHomePage/onChangePaginationAction';
  payload: {
    pageCurrent?: number;
    pageSize?: number;
  }
}

export interface DeleteObjectAction extends AnyAction {
  type: 'storageHomePage/deleteObject';
  payload: string;
}

export interface UploadFilesAction extends AnyAction {
  type: 'storageHomePage/uploadFiles';
  payload: RcFile[];
}

interface StorageHomePageModelType {
  namespace: 'storageHomePage';
  state: StorageHomePageModelState;
  effects: {
    fetchBuckets: (action: FetchBucketsAction, effects: EffectsCommandMap) => void;
    createBucket: (action: CreateBucketAction, effects: EffectsCommandMap) => void;
    onChangeActivatedBucket: (action: OnChangeActivatedBucketAction, effects: EffectsCommandMap) => void;
    fetchSpaceStatistic: (action: FetchSpaceStatisticAction, effects: EffectsCommandMap) => void;
    deleteBucketByName: (action: DeleteBucketByNameAction, effects: EffectsCommandMap) => void;
    createObject: (action: CreateObjectAction, effects: EffectsCommandMap) => void;
    fetchObjects: (action: FetchObjectsAction, effects: EffectsCommandMap) => void;
    onChangePaginationAction: (action: OnChangePaginationAction, effects: EffectsCommandMap) => void;
    deleteObject: (action: DeleteObjectAction, effects: EffectsCommandMap) => void;
    uploadFiles: (action: UploadFilesAction, effects: EffectsCommandMap) => void;
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
    newBucketNameError: false,
    newBucketModalVisible: false,

    bucketList: [],
    activatedBucket: '',
    totalStorage: -1,
    usedStorage: -1,

    // currentBucketInfo: null,
    objectList: [],
    pageCurrent: 1,
    pageSize: 10,
    total: -1,

    uploadTaskQueue: [],
    uploadPanelVisible: false,
    uploadPanelOpen: false,
  },
  effects: {
    * fetchBuckets({}: FetchBucketsAction, {call, put, select}: EffectsCommandMap) {
      const params: BucketListParamsType = {
        bucketType: 0,
      };
      const {data} = yield call(bucketList, params);
      const {storageHomePage}: ConnectState = yield select(({storageHomePage}: ConnectState) => ({storageHomePage}));
      // console.log(data, 'datadata092834oi');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          bucketList: data.map((i: any) => ({
            bucketName: i.bucketName,
            bucketType: i.bucketType,
            createDate: moment(i.createDate).format('YYYY.MM.DD HH:mm'),
            totalFileQuantity: i.totalFileQuantity,
          })),
          // activatedBucket: (storageHomePage.activatedBucket === '' && data?.length > 0) ? data[0].bucketName : '',
        },
      });
      yield put<OnChangeActivatedBucketAction>({
        type: 'onChangeActivatedBucket',
        payload: data?.length > 0
          ? (data.map((b: any) => b.bucketName).includes(storageHomePage.activatedBucket)
            ? storageHomePage.activatedBucket
            : data[0].bucketName)
          : '',
      });
      yield put<FetchSpaceStatisticAction>({
        type: 'fetchSpaceStatistic',
      });
    },
    * createBucket({}: CreateBucketAction, {call, select, put}: EffectsCommandMap) {
      const {storageHomePage}: ConnectState = yield select(({storageHomePage}: ConnectState) => ({storageHomePage}));
      // console.log(storageHomePage, 'storageHomePage');

      if (!/^(?!-)[a-z0-9-]{1,63}(?<!-)$/.test(storageHomePage.newBucketName)) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            newBucketNameError: true,
          },
        });
        return;
      }
      const params: CreateBucketParamsType = {
        bucketName: storageHomePage.newBucketName,
      };
      const {data} = yield call(createBucket, params);
      // console.log(data, 'datadata2p98;ho');
      yield put<FetchBucketsAction>({
        type: 'fetchBuckets',
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          newBucketModalVisible: false,
          // activatedBucket: data.bucketName,
        },
      });
    },
    * onChangeActivatedBucket({payload}: OnChangeActivatedBucketAction, {put}: EffectsCommandMap) {
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
    * fetchSpaceStatistic({}: FetchSpaceStatisticAction, {put, call}: EffectsCommandMap) {
      const {data} = yield call(spaceStatistics);
      // console.log(data, 'aw89ihnwesdlk');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          totalStorage: data.storageLimit,
          usedStorage: data.totalFileSize,
        },
      });
    },
    * deleteBucketByName({payload}: DeleteBucketByNameAction, {call, put}: EffectsCommandMap) {
      const params: DeleteBucketsParamsType = {
        bucketName: payload,
      };
      yield call(deleteBuckets, params);
      yield put<FetchBucketsAction>({
        type: 'fetchBuckets',
      });
    },
    * createObject({payload}: CreateObjectAction, {call, select, put}: EffectsCommandMap) {
      const {storageHomePage}: ConnectState = yield select(({storageHomePage}: ConnectState) => ({
        storageHomePage,
      }));
      const params: CreateObjectParamsType = {
        bucketName: storageHomePage.activatedBucket,
        objectName: payload.objectName,
        sha1: payload.sha1,
      };
      yield call(createObject, params);
      yield put<FetchObjectsAction>({
        type: 'fetchObjects',
      });
      yield put<FetchSpaceStatisticAction>({
        type: 'fetchSpaceStatistic',
      });
      yield put<FetchBucketsAction>({
        type: 'fetchBuckets',
      });
    },
    * fetchObjects({}: FetchObjectsAction, {select, call, put}: EffectsCommandMap) {
      const {storageHomePage}: ConnectState = yield select(({storageHomePage}: ConnectState) => ({storageHomePage}));
      const params: ObjectListParamsType = {
        bucketName: storageHomePage.activatedBucket,
        page: storageHomePage.pageCurrent,
        pageSize: storageHomePage.pageSize,
      };
      const {data} = yield call(objectList, params);
      // console.log(data, 'datadata23w908io');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          objectList: data.dataList.map((i: any) => ({
            key: i.objectId,
            id: i.objectId,
            name: i.objectName,
            type: i.resourceType,
            size: humanizeSize(i.systemProperty.fileSize),
            updateTime: formatDateTime(i.updateDate, true),
          })),
          total: data.totalItem,
        },
      });
    },
    * onChangePaginationAction({payload}: OnChangePaginationAction, {put}: EffectsCommandMap) {
      if (payload.pageSize) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pageSize: payload.pageSize,
            pageCurrent: 1,
          },
        });
      }
      if (payload.pageCurrent) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pageCurrent: payload.pageCurrent,
          },
        });
      }
      yield put<FetchObjectsAction>({
        type: 'fetchObjects',
      });
    },
    * deleteObject({payload}: DeleteObjectAction, {call, select, put}: EffectsCommandMap) {
      const {storageHomePage}: ConnectState = yield select(({storageHomePage}: ConnectState) => ({
        storageHomePage,
      }));
      const params: DeleteObjectsParamsType = {
        bucketName: storageHomePage.activatedBucket,
        objectIds: payload,
      };
      yield call(deleteObjects, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageCurrent: 1,
        },
      });
      yield put<FetchObjectsAction>({
        type: 'fetchObjects',
      });
      yield put<FetchSpaceStatisticAction>({
        type: 'fetchSpaceStatistic',
      });
      yield put<FetchBucketsAction>({
        type: 'fetchBuckets',
      });
    },
    * uploadFiles({payload}: UploadFilesAction, {select, put, call}: EffectsCommandMap) {
      // console.log('!!!!!!!!!');
      const {storageHomePage}: ConnectState = yield select(({storageHomePage}: ConnectState) => ({
        storageHomePage,
      }));
      const totalSize: number = payload.map((f) => f.size).reduce((p, c) => p + c, 0);
      if (storageHomePage.totalStorage - storageHomePage.usedStorage < totalSize) {
        fMessage('超出储存', 'warning');
        return;
      }
      const uploadTaskQueue: StorageHomePageModelState['uploadTaskQueue'] = yield call(getInfo, payload);

      const params: FileIsExistParamsType = {
        sha1: uploadTaskQueue.map((utq) => utq.sha1).join(','),
      };
      // console.log(params, 'params2309jsadlfk');
      const {data} = yield call(fileIsExist, params);
      // console.log(data, '2390jasdf');
      const allExistSha1: string[] = data.filter((d: any) => d.isExisting).map((d: any) => d.sha1);
      // console.log(allExistSha1, 'allExistSha10932jfsd');
      // return;
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          uploadTaskQueue: [
            ...uploadTaskQueue.map<StorageHomePageModelState['uploadTaskQueue'][number]>((utq) => ({
              ...utq,
              exist: allExistSha1.includes(utq.sha1),
            })),
            ...storageHomePage.uploadTaskQueue,
          ],
          uploadPanelOpen: true,
          uploadPanelVisible: true,
        }
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

async function getInfo(payload: RcFile[]): Promise<StorageHomePageModelState['uploadTaskQueue']> {
  return Promise.all(payload.map<Promise<StorageHomePageModelState['uploadTaskQueue'][number]>>(async (fo) => ({
    uid: fo.uid,
    sha1: await getSHA1Hash(fo),
    name: fo.name.replace(/[\\|\/|:|\*|\?|"|<|>|\||\s|@|\$|#]/g, '_'),
    file: fo,
    state: 0,
    exist: false,
  })));
}
