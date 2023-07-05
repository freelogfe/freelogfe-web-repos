// import {DvaReducer} from '@/models/shared';
// import {AnyAction} from 'redux';
// import {EffectsCommandMap, Subscription} from 'dva';
// import {ConnectState} from "@/models/connect";
// import {FUtil, FServiceAPI} from '@freelog/tools-lib';
//
// export interface StorageObjectDepSelectorModelState {
//   resourceList: {
//     resourceId: string;
//     resourceName: string;
//     resourceType: string[];
//     updateDate: string;
//     status: 0 | 1;
//     latestVersion: string;
//   }[];
//   rPageSize: number;
//   rTotal: number;
//   rSelect: '1' | '2' | '3';
//   rInput: string;
//
//   visibleOResourceType: string;
//   objectList: {
//     objectId: string;
//     bucketName: string;
//     objectName: string;
//     resourceType: string[];
//     updateDate: string;
//   }[];
//   oPageSize: number;
//   oTotal: number;
//   oSelect: '_all' | string;
//   oInput: string;
// }
//
// export interface ChangeAction extends AnyAction {
//   type: 'change' | 'storageObjectDepSelector/change';
//   payload: Partial<StorageObjectDepSelectorModelState>;
// }
//
// export interface FetchResourcesAction extends AnyAction {
//   type: 'storageObjectDepSelector/fetchResources' | 'fetchResources';
//   payload?: boolean; // 是否restart
// }
//
// export interface FetchObjectsAction extends AnyAction {
//   type: 'storageObjectDepSelector/fetchObjects' | 'fetchObjects';
//   payload?: boolean; // 是否restart
// }
//
// export interface OnChangeRConditionsAction extends AnyAction {
//   type: 'storageObjectDepSelector/onChangeRConditions';
//   payload: Partial<Pick<StorageObjectDepSelectorModelState, 'rSelect' | 'rInput'>>;
// }
//
// export interface OnChangeOConditionsAction extends AnyAction {
//   type: 'storageObjectDepSelector/onChangeOConditions';
//   payload: Partial<Pick<StorageObjectDepSelectorModelState, 'oSelect' | 'oInput'>>;
// }
//
// export interface StorageObjectDepSelectorModelType {
//   namespace: 'storageObjectDepSelector';
//   state: StorageObjectDepSelectorModelState;
//   effects: {
//     fetchResources: (action: FetchResourcesAction, effects: EffectsCommandMap) => void;
//     fetchObjects: (action: FetchObjectsAction, effects: EffectsCommandMap) => void;
//     onChangeRConditions: (action: OnChangeRConditionsAction, effects: EffectsCommandMap) => void;
//     onChangeOConditions: (action: OnChangeOConditionsAction, effects: EffectsCommandMap) => void;
//   };
//   reducers: {
//     change: DvaReducer<StorageObjectDepSelectorModelState, ChangeAction>;
//   };
//   subscriptions: {
//     setup: Subscription;
//   };
// }
//
// export const storageObjectDepSelectorInitData: StorageObjectDepSelectorModelState = {
//   resourceList: [],
//   rTotal: -1,
//   rPageSize: 20,
//   rSelect: '1',
//   rInput: '',
//   visibleOResourceType: '',
//   objectList: [],
//   oTotal: -1,
//   oPageSize: 20,
//   oSelect: '_all',
//   oInput: '',
// };
//
// const Model: StorageObjectDepSelectorModelType = {
//   namespace: 'storageObjectDepSelector',
//   state: {
//     ...storageObjectDepSelectorInitData,
//   },
//   effects: {
//     * fetchResources({payload = false}: FetchResourcesAction, {call, put, select}: EffectsCommandMap) {
//       const {storageObjectDepSelector}: ConnectState = yield select(({storageObjectDepSelector}: ConnectState) => ({
//         storageObjectDepSelector,
//       }));
//       let resourceList: StorageObjectDepSelectorModelState['resourceList'] = [];
//       if (!payload) {
//         resourceList = storageObjectDepSelector.resourceList;
//       }
//       // let dataSource: any;
//       let totalItem: number = -1;
//       if (storageObjectDepSelector.rSelect === '3') {
//         const params: Parameters<typeof FServiceAPI.Collection.collectionResources>[0] = {
//           skip: resourceList.length,
//           // limit: storageObjectDepSelector.rPageSize,
//           limit: FUtil.Predefined.pageSize,
//           keywords: storageObjectDepSelector.rInput,
//         };
//         const {data} = yield call(FServiceAPI.Collection.collectionResources, params);
//         // console.log(data, '##########5210823423');
//         // dataSource = data;
//         totalItem = data.totalItem;
//         resourceList = [
//           ...resourceList,
//           ...(data.dataList as any[]).map<StorageObjectDepSelectorModelState['resourceList'][number]>((r: any) => ({
//             resourceId: r.resourceId,
//             resourceName: r.resourceName,
//             resourceType: r.resourceType,
//             updateDate: FUtil.Format.formatDateTime(r.resourceUpdateDate, true),
//             status: r.resourceStatus,
//             latestVersion: r.latestVersion,
//           })),
//         ];
//       } else {
//         const params: Parameters<typeof FServiceAPI.Resource.list>[0] = {
//           // startResourceId: resourceList[0]?.resourceId,
//           skip: resourceList.length,
//           // limit: storageObjectDepSelector.rPageSize,
//           limit: FUtil.Predefined.pageSize,
//           keywords: storageObjectDepSelector.rInput,
//           status: storageObjectDepSelector.rSelect === '2' ? undefined : 1,
//           isSelf: storageObjectDepSelector.rSelect === '2' ? 1 : undefined,
//         };
//         const {data} = yield call(FServiceAPI.Resource.list, params);
//         // dataSource = data;
//         // console.log(data, '@@@@@@@@@@@@123412341234');
//         totalItem = data.totalItem;
//         resourceList = [
//           ...resourceList,
//           ...(data.dataList as any[]).map<StorageObjectDepSelectorModelState['resourceList'][number]>((r: any) => ({
//             resourceId: r.resourceId,
//             resourceName: r.resourceName,
//             resourceType: r.resourceType,
//             updateDate: FUtil.Format.formatDateTime(r.updateDate, true),
//             status: r.status,
//             latestVersion: r.latestVersion,
//           })),
//         ];
//       }
//
//       yield put<ChangeAction>({
//         type: 'change',
//         payload: {
//           rTotal: totalItem,
//           resourceList: resourceList,
//         },
//       });
//     },
//     * fetchObjects({payload = false}: FetchObjectsAction, {call, put, select}: EffectsCommandMap) {
//       const {storageObjectDepSelector: selector}: ConnectState = yield select(({storageObjectDepSelector}: ConnectState) => ({
//         storageObjectDepSelector,
//       }));
//
//       let objectListData: StorageObjectDepSelectorModelState['objectList'] = [];
//
//       if (!payload) {
//         objectListData = selector.objectList;
//       }
//
//       const params: Parameters<typeof FServiceAPI.Storage.objectList>[0] = {
//         bucketName: selector.oSelect,
//         resourceType: selector.visibleOResourceType || undefined,
//         isLoadingTypeless: 1,
//         keywords: selector.oInput,
//         skip: objectListData.length,
//         // limit: selector.oPageSize,
//         limit: FUtil.Predefined.pageSize,
//       };
//       const {data} = yield call(FServiceAPI.Storage.objectList, params);
//       // console.log(data, 'datadata322');
//       yield put<ChangeAction>({
//         type: 'change',
//         payload: {
//           oTotal: data.totalItem,
//           objectList: [
//             ...objectListData,
//             ...data.dataList.map((o: any) => ({
//               objectId: o.objectId,
//               bucketName: o.bucketName,
//               objectName: o.objectName,
//               resourceType: o.resourceType,
//               updateDate: FUtil.Format.formatDateTime(o.updateDate, true),
//             })),
//           ],
//         },
//       });
//     },
//     * onChangeRConditions({payload}: OnChangeRConditionsAction, {put}: EffectsCommandMap) {
//       yield put<ChangeAction>({
//         type: 'change',
//         payload: {
//           ...payload,
//         },
//       });
//
//       yield put<FetchResourcesAction>({
//         type: 'fetchResources',
//         payload: true,
//       });
//     },
//     * onChangeOConditions({payload}: OnChangeOConditionsAction, {put}: EffectsCommandMap) {
//       yield put<ChangeAction>({
//         type: 'change',
//         payload: {
//           ...payload,
//         },
//       });
//
//       yield put<FetchObjectsAction>({
//         type: 'fetchObjects',
//         payload: true,
//       });
//     },
//   },
//   reducers: {
//     change(state, {payload}) {
//       return {
//         ...state,
//         ...payload,
//       }
//     },
//   },
//   subscriptions: {
//     setup({}) {
//
//     }
//   }
// };
//
// export default Model;
