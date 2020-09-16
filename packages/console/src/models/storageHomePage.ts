import {DvaReducer} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from '@/models/connect';
import {
  bucketList,
  BucketListParamsType,
  createBucket,
  CreateBucketParamsType, deleteBuckets, DeleteBucketsParamsType,
  spaceStatistics, uploadFile
} from '@/services/storages';
import moment from 'moment';
import {RcFile} from 'antd/lib/upload/interface';
import fMessage from '@/components/fMessage';

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
    name: string;
    type: string;
    size: number;
    updateTime: string;
  }[];

  // uploadTaskList: {
  //   uid: string;
  //   sha1?: string;
  //   file: RcFile;
  //   status: 'uploading' | 'success' | 'canceled' | 'failed' | 'sameName';
  //   progress?: number;
  // }[];
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

// export interface UploadFilesAction extends AnyAction {
//   type: 'storageHomePage/uploadFiles';
//   payload: RcFile[];
// }

export interface StorageHomePageModelType {
  namespace: 'storageHomePage';
  state: StorageHomePageModelState;
  effects: {
    fetchBuckets: (action: FetchBucketsAction, effects: EffectsCommandMap) => void;
    createBucket: (action: CreateBucketAction, effects: EffectsCommandMap) => void;
    onChangeActivatedBucket: (action: OnChangeActivatedBucketAction, effects: EffectsCommandMap) => void;
    fetchSpaceStatistic: (action: FetchSpaceStatisticAction, effects: EffectsCommandMap) => void;
    deleteBucketByName: (action: DeleteBucketByNameAction, effects: EffectsCommandMap) => void;
    // uploadFiles: (action: UploadFilesAction, effects: EffectsCommandMap) => void;
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
    objectList: [
      {
        key: '1',
        name: 'John Brown',
        type: 'image',
        size: 2378,
        updateTime: '2019.04.14 12:00',
      },
      {
        key: '2',
        name: 'John Brown2',
        type: 'image',
        size: 2378,
        updateTime: '2019.04.14 12:00',
      },
    ],

    // uploadTaskList: [],
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
    // * uploadFiles({payload}: UploadFilesAction, {select, put}: EffectsCommandMap) {
    //   console.log(payload, 'payload230-');
    //   const totalSize: number = payload.map((f) => f.size).reduce((p, c) => p + c, 0);
    //   console.log(totalSize, 'totalSize2afds');
    //   const {storageHomePage}: ConnectState = yield select(({storageHomePage}: ConnectState) => ({storageHomePage}))
    //   if (storageHomePage.totalStorage - storageHomePage.usedStorage < totalSize) {
    //     return fMessage('超出储存', 'warning');
    //   }
    //   const tasks: StorageHomePageModelState['uploadTaskList'] = [];
    //   for (const file of payload) {
    //     tasks.push({
    //       uid: file.uid,
    //       file: file,
    //       status: 'uploading',
    //       progress: 0,
    //     });
    //   }
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       uploadTaskList: [
    //         ...tasks,
    //         ...storageHomePage.uploadTaskList,
    //       ],
    //     }
    //   });
    //   for (const file of payload) {
    //     upload(file, function* (task) {
    //       console.log(task, '22234vcwe');
    //       let ct = task;
    //       while (true) {
    //         console.log(ct, 'ctct');
    //         ct = yield put<ChangeAction>({
    //           type: 'change',
    //           payload: {
    //             uploadTaskList: storageHomePage.uploadTaskList.map((t) => {
    //               console.log(t.uid !== ct.uid, 't.uid !== ct.uid');
    //               if (t.uid !== ct.uid) {
    //                 return t;
    //               }
    //               return {
    //                 ...ct
    //               };
    //             }),
    //           }
    //         });
    //
    //         if (!ct) {
    //           break;
    //         }
    //       }
    //
    //     });
    //   }
    // },
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

// async function upload(file: RcFile, cd: (task: StorageHomePageModelState['uploadTaskList'][number]) => void) {
//
//   const gen: any = cd({
//     uid: file.uid,
//     file: file,
//     status: 'uploading',
//     progress: 0,
//   });
//   gen.next();
//   const {data} = await uploadFile({file}, {
//     onUploadProgress(progressEvent) {
//       console.log(progressEvent, 'progressEvent23ds');
//       gen.next({
//         uid: file.uid,
//         file: file,
//         status: 'uploading',
//         progress: Math.floor(progressEvent.loaded / progressEvent.total * 100),
//       });
//       // console.log('PPPPPPPP');
//     },
//   });
//   console.log('FFFFFFFFF');
//   gen.next({
//     uid: file.uid,
//     sha1: data.sha1,
//     file: file,
//     status: 'success',
//   });
//   // gen.next(null);
//   // console.log(data, 'datadata');
// }
