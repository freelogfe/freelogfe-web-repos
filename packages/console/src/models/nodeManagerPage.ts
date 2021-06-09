import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from "@/models/connect";
import fMessage from "@/components/fMessage";
import {FUtil, FServiceAPI} from '@freelog/tools-lib';
import {router} from "umi";

export type NodeManagerModelState = WholeReadonly<{
  nodeId: number;

  nodeName: string;
  nodeUrl: string;
  testNodeUrl: string;
  nodeThemeId: string;
  showTheme: boolean;

  selectedType: string;
  selectedStatus: string;
  exhibitInputFilter: string;
  pageCurrent: number;
  pageSize: number;
  exhibitList: {
    id: string;
    cover: string;
    title: string;
    type: string;
    resourceName: string;
    policies: string[];
    isOnline: boolean;
    resourceId: string;
    version: string;
    isAuth: boolean;
    authErrorText: string;
  }[];
  totalNum: number;
  exhibitDataState: '' | 'noData' | 'noSearchData' | 'loading';

  themeInputFilter: string;
  themeList: {
    id: string;
    cover: string;
    title: string;
    policies: string[];
    version: string;
    isOnline: boolean;
    isAuth: boolean;
    authErrorText: string;
    resourceId: string;
  }[];
  themeDataState: '' | 'noData' | 'noSearchData' | 'loading';
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'nodeManagerPage/change';
  payload: Partial<NodeManagerModelState>;
}

export interface FetchNodeInfoAction extends AnyAction {
  type: 'nodeManagerPage/fetchNodeInfo' | 'fetchNodeInfo';
}

export interface FetchExhibitsAction extends AnyAction {
  type: 'nodeManagerPage/fetchExhibits' | 'fetchExhibits';
  payload?: boolean; // 是否 restart
}

export interface OnChangeExhibitAction extends AnyAction {
  type: 'nodeManagerPage/onChangeExhibit';
  payload: Partial<{
    selectedType: string;
    selectedStatus: string;
    exhibitInputFilter: string;
    pageCurrent: number;
    pageSize: number;
  }>;
}

export interface FetchThemesAction extends AnyAction {
  type: 'nodeManagerPage/fetchThemes' | 'fetchThemes';
}

export interface OnChangeThemeAction extends AnyAction {
  type: 'nodeManagerPage/onChangeTheme';
  payload: {
    themeInputFilter?: string;
  };
}

export interface OnOnlineOrOfflineAction {
  type: 'nodeManagerPage/onOnlineOrOffline';
  payload: {
    id: string;
    onlineStatus: 0 | 1;
  },
}

export interface OnActiveAction {
  type: 'nodeManagerPage/onActive';
  payload: {
    id: string;
  },
}

export interface NodeManagerModelType {
  namespace: 'nodeManagerPage';
  state: NodeManagerModelState;
  effects: {
    fetchNodeInfo: (action: FetchNodeInfoAction, effects: EffectsCommandMap) => void;
    fetchExhibits: (action: FetchExhibitsAction, effects: EffectsCommandMap) => void;
    onChangeExhibit: (action: OnChangeExhibitAction, effects: EffectsCommandMap) => void;
    onOnlineOrOffline: (action: OnOnlineOrOfflineAction, effects: EffectsCommandMap) => void;
    onActive: (action: OnActiveAction, effects: EffectsCommandMap) => void;
    fetchThemes: (action: FetchThemesAction, effects: EffectsCommandMap) => void;
    onChangeTheme: (action: OnChangeThemeAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<NodeManagerModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

export const nodeManagerInitData: NodeManagerModelState = {
  nodeId: -1,

  nodeName: '',
  nodeUrl: '',
  testNodeUrl: '',
  nodeThemeId: '',
  showTheme: false,

  selectedType: '-1',
  selectedStatus: '2',
  exhibitInputFilter: '',
  pageCurrent: 1,
  pageSize: 10,
  exhibitList: [],
  totalNum: -1,
  exhibitDataState: 'loading',

  themeInputFilter: '',
  themeList: [],
  themeDataState: 'loading',
};

const Model: NodeManagerModelType = {
  namespace: 'nodeManagerPage',
  state: nodeManagerInitData,
  effects: {
    * fetchNodeInfo({}: FetchNodeInfoAction, {put, select, call}: EffectsCommandMap) {
      const {user, nodeManagerPage}: ConnectState = yield select(({user, nodeManagerPage}: ConnectState) => ({
        nodeManagerPage,
        user,
      }));

      const params: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: nodeManagerPage.nodeId,
      };

      const {data} = yield call(FServiceAPI.Node.details, params);

      // console.log(data, 'DDDFa90jlkasdjf;lkasdf');
      // console.log(user.cookiesUserID, 'user.cookiesUserID23423434');
      if (!data || data.ownerUserId !== user.cookiesUserID) {
        router.replace(FUtil.LinkTo.exception403({}, '90ujo3ijrlkajdsflkjal;dskf'));
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeName: data?.nodeName,
          nodeUrl: FUtil.Format.completeUrlByDomain(data?.nodeDomain || ''),
          testNodeUrl: FUtil.Format.completeUrlByDomain('t.' + (data?.nodeDomain || '')),
          nodeThemeId: data.nodeThemeId,
        },
      });
    },
    * fetchExhibits({payload = true}: FetchExhibitsAction, {call, select, put}: EffectsCommandMap) {
      const {nodeManagerPage, user}: ConnectState = yield select(({nodeManagerPage, user}: ConnectState) => ({
        nodeManagerPage,
        user,
      }));

      const list = payload ? [] : nodeManagerPage.exhibitList;

      const params: Parameters<typeof FServiceAPI.Exhibit.presentables>[0] = {
        nodeId: nodeManagerPage.nodeId,
        limit: FUtil.Predefined.pageSize,
        skip: list.length,
        // page: nodeManagerPage.pageCurrent,
        // pageSize: nodeManagerPage.pageSize,
        keywords: nodeManagerPage.exhibitInputFilter || undefined,
        onlineStatus: Number(nodeManagerPage.selectedStatus),
        resourceType: nodeManagerPage.selectedType === '-1' ? undefined : nodeManagerPage.selectedType,
        omitResourceType: 'theme',
      };

      const {data} = yield call(FServiceAPI.Exhibit.presentables, params);


      let batchAuthPs: any[] = [];
      if (data.dataList.length > 0) {
        const params1: Parameters<typeof FServiceAPI.Exhibit.batchAuth>[0] = {
          nodeId: nodeManagerPage.nodeId,
          authType: 3,
          presentableIds: (data.dataList as any[]).map<string>((dl: any) => {
            return dl.presentableId;
          }).join(','),
        };
        const {data: data1} = yield call(FServiceAPI.Exhibit.batchAuth, params1);
        batchAuthPs = data1;
      }
      // console.log(batchAuthPs, 'batchAuthPs290uopasdf');
      // !i.policies.find((p: any) => p.status === 1)
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibitList: [
            ...list,
            ...(data.dataList as any[]).map<NodeManagerModelState['exhibitList'][number]>((i: any) => {
              const authInfo = batchAuthPs.find((bap: any) => bap.presentableId === i.presentableId);
              return {
                id: i.presentableId,
                cover: i.coverImages[0],
                title: i.presentableTitle,
                resourceName: i.presentableName,
                version: i.version,
                isOnline: i.onlineStatus === 1,
                type: i.resourceInfo.resourceType,
                policies: (i.policies as any[]).filter((p: any) => p.status === 1).map<string>((p) => p.policyName),
                resourceId: i.resourceInfo.resourceId,
                isAuth: authInfo.isAuth,
                authErrorText: authInfo.error,
              };
            })
          ],
          totalNum: data.totalItem,
          exhibitDataState: data.totalItem !== 0 ? ''
            : (nodeManagerPage.selectedType === '-1' && nodeManagerPage.selectedStatus === '2' && nodeManagerPage.exhibitInputFilter === '')
              ? 'noData' : 'noSearchData',
        },
      });
    },
    * onChangeExhibit({payload}: OnChangeExhibitAction, {put}: EffectsCommandMap) {
      if (payload.pageCurrent) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pageCurrent: payload.pageCurrent,
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            ...payload,
            pageCurrent: 1,
          },
        });
      }
      yield put<FetchExhibitsAction>({
        type: 'fetchExhibits',
      });
    },
    * fetchThemes({}: FetchThemesAction, {call, put, select}: EffectsCommandMap) {
      // console.log(23423423, '0923jfdslk');
      const {nodeManagerPage}: ConnectState = yield select(({nodeManagerPage}: ConnectState) => ({
        nodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.presentables>[0] = {
        nodeId: nodeManagerPage.nodeId,
        limit: FUtil.Predefined.pageSize,
        keywords: nodeManagerPage.themeInputFilter || undefined,
        onlineStatus: 2,
        resourceType: 'theme',
      };

      const {data} = yield call(FServiceAPI.Exhibit.presentables, params);

      let batchAuthTs: any[] = [];
      if (data.dataList.length > 0) {
        const params1: Parameters<typeof FServiceAPI.Exhibit.batchAuth>[0] = {
          nodeId: nodeManagerPage.nodeId,
          authType: 3,
          presentableIds: (data.dataList as any[]).map<string>((dl: any) => {
            return dl.presentableId;
          }).join(','),
        };
        const {data: data1} = yield call(FServiceAPI.Exhibit.batchAuth, params1);
        batchAuthTs = data1;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          themeList: (data.dataList as any[]).map<NodeManagerModelState['themeList'][number]>((i: any) => {
            const authInfo = batchAuthTs.find((bap: any) => bap.presentableId === i.presentableId);
            return {
              id: i.presentableId,
              cover: i.coverImages[0],
              title: i.presentableTitle,
              version: i.version,
              isOnline: i.onlineStatus === 1,
              policies: (i.policies as any[]).filter((p: any) => p.status === 1).map<string>((p) => p.policyName),
              isAuth: authInfo.isAuth,
              authErrorText: authInfo.error,
              resourceId: i.resourceInfo.resourceId,
            };
          }),
          themeDataState: data.totalItem !== 0 ? ''
            : nodeManagerPage.themeInputFilter === '' ? 'noData' : 'noSearchData',
        },
      });
    },
    * onOnlineOrOffline({payload}: OnOnlineOrOfflineAction, {call, put, select}: EffectsCommandMap) {
      // console.log(payload, 'PPPPPP');
      const {nodeManagerPage}: ConnectState = yield select(({nodeManagerPage}: ConnectState) => ({
        nodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
        presentableId: payload.id,
        onlineStatus: payload.onlineStatus,
      };

      const {data} = yield call(FServiceAPI.Exhibit.presentablesOnlineStatus, params);

      if (!data) {
        fMessage('上线失败', 'error');
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibitList: nodeManagerPage.exhibitList
            .map((el) => {
              if (payload.id !== el.id) {
                return el;
              }
              return {
                ...el,
                isOnline: payload.onlineStatus === 1,
              }
            })
            .filter((el) => {
              if (nodeManagerPage.selectedStatus === '2') {
                return true;
              }
              return el.isOnline === (nodeManagerPage.selectedStatus === '1');
            }),
        },
      });
    },
    * onActive({payload}: OnActiveAction, {call, select, put}: EffectsCommandMap) {
      const {nodeManagerPage}: ConnectState = yield select(({nodeManagerPage}: ConnectState) => ({
        nodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
        presentableId: payload.id,
        onlineStatus: 1,
      };
      const {data} = yield call(FServiceAPI.Exhibit.presentablesOnlineStatus, params);
      if (!data) {
        fMessage('激活失败', 'error');
        return;
      }
      yield put<FetchThemesAction>({
        type: 'fetchThemes',
      });
      yield put<FetchNodeInfoAction>({
        type: 'fetchNodeInfo',
      });
    },
    * onChangeTheme({payload}: OnChangeThemeAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          themeInputFilter: payload.themeInputFilter,
        },
      });
      yield put<FetchThemesAction>({
        type: 'fetchThemes',
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
