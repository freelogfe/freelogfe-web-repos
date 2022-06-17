import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { router } from 'umi';
import FUtil1 from '@/utils';

export interface NodeManagerModelState {
  nodeId: number;

  nodeName: string;
  nodeUrl: string;
  testNodeUrl: string;
  nodeThemeId: string;
  showPage: 'exhibit' | 'theme';
  goToTestNodePage: string;
  nodeInfoState: 'loading' | 'loaded';
  listFirstLoaded: boolean;

  exhibit_ResourceTypeOptions: { text: string, value: string }[];
  exhibit_ResourceStateOptions: { text: string, value: string }[];
  exhibit_SelectedType: string;
  exhibit_SelectedStatus: string;
  exhibit_InputFilter: string;
  exhibit_List: {
    id: string;
    cover: string;
    title: string;
    type: string;
    resourceName: string;
    policies: string[];
    hasPolicy: boolean;
    isOnline: boolean;
    resourceId: string;
    version: string;
    isAuth: boolean;
    authErrorText: string;
  }[];
  exhibit_ListTotal: number;
  exhibit_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  exhibit_ListMore: 'loading' | 'andMore' | 'noMore';

  theme_ActivatingThemeID: string;
  theme_InputFilter: string;
  theme_List: {
    id: string;
    cover: string;
    title: string;
    policies: string[];
    hasPolicy: boolean;
    version: string;
    isOnline: boolean;
    isAuth: boolean;
    authErrorText: string;
    resourceId: string;
  }[];
  // themeDataState: '' | 'noData' | 'noSearchData' | 'loading';
  theme_ListState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  theme_ListMore: 'loading' | 'andMore' | 'noMore';
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<NodeManagerModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'nodeManagerPage/onMount_Page';
  payload: {
    nodeID: number;
  };
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'nodeManagerPage/onUnmount_Page';
}

// export interface OnChange_NodeID_Action extends AnyAction {
//   type: 'nodeManagerPage/onChange_NodeID';
//   payload: {
//     nodeID: number;
//   };
// }
export interface OnChange_ShowPage_Action extends AnyAction {
  type: 'nodeManagerPage/onChange_ShowPage';
  payload: {
    value: 'exhibit' | 'theme';
  };
}

export interface OnMount_ExhibitPage_Action extends AnyAction {
  type: 'nodeManagerPage/onMount_ExhibitPage';
}

export interface OnUnmount_ExhibitPage_Action extends AnyAction {
  type: 'nodeManagerPage/onUnmount_ExhibitPage';
}

export interface OnMount_ThemePage_Action extends AnyAction {
  type: 'nodeManagerPage/onMount_ThemePage';
}

export interface OnUnmount_ThemePage_Action extends AnyAction {
  type: 'nodeManagerPage/onUnmount_ThemePage';
}

export interface OnChange_Exhibit_SelectedType_Action extends AnyAction {
  type: 'nodeManagerPage/onChange_Exhibit_SelectedType';
  payload: {
    value: string;
  };
}

export interface OnChange_Exhibit_SelectedStatus_Action extends AnyAction {
  type: 'nodeManagerPage/onChange_Exhibit_SelectedStatus';
  payload: {
    value: string;
  };
}

export interface OnChange_Exhibit_InputFilter_Action extends AnyAction {
  type: 'nodeManagerPage/onChange_Exhibit_InputFilter';
  payload: {
    value: string;
  };
}

export interface OnLoadMore_ExhibitList_Action extends AnyAction {
  type: 'nodeManagerPage/onLoadMore_ExhibitList';
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

export interface FetchExhibitsAction extends AnyAction {
  type: 'nodeManagerPage/fetchExhibits' | 'fetchExhibits';
  payload: {
    restart: boolean;
  };
}

export interface FetchThemesAction extends AnyAction {
  type: 'nodeManagerPage/fetchThemes' | 'fetchThemes';
}

export interface NodeManagerModelType {
  namespace: 'nodeManagerPage';
  state: NodeManagerModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    // onChange_NodeID: (action: OnChange_NodeID_Action, effects: EffectsCommandMap) => void;
    onChange_ShowPage: (action: OnChange_ShowPage_Action, effects: EffectsCommandMap) => void;
    onMount_ExhibitPage: (action: OnMount_ExhibitPage_Action, effects: EffectsCommandMap) => void;
    onUnmount_ExhibitPage: (action: OnUnmount_ExhibitPage_Action, effects: EffectsCommandMap) => void;
    onMount_ThemePage: (action: OnMount_ThemePage_Action, effects: EffectsCommandMap) => void;
    onUnmount_ThemePage: (action: OnUnmount_ThemePage_Action, effects: EffectsCommandMap) => void;

    onChange_Exhibit_SelectedType: (action: OnChange_Exhibit_SelectedType_Action, effects: EffectsCommandMap) => void;
    onChange_Exhibit_SelectedStatus: (action: OnChange_Exhibit_SelectedStatus_Action, effects: EffectsCommandMap) => void;
    onChange_Exhibit_InputFilter: (action: OnChange_Exhibit_InputFilter_Action, effects: EffectsCommandMap) => void;
    onLoadMore_ExhibitList: (action: OnLoadMore_ExhibitList_Action, effects: EffectsCommandMap) => void;
    onOnlineOrOffline: (action: OnOnlineOrOfflineAction, effects: EffectsCommandMap) => void;
    onActive: (action: OnActiveAction, effects: EffectsCommandMap) => void;
    onChangeTheme: (action: OnChangeThemeAction, effects: EffectsCommandMap) => void;

    fetchExhibits: (action: FetchExhibitsAction, effects: EffectsCommandMap) => void;
    fetchThemes: (action: FetchThemesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<NodeManagerModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const exhibitInitStates: Pick<NodeManagerModelState,
  'exhibit_ResourceTypeOptions' |
  'exhibit_ResourceStateOptions' |
  'exhibit_SelectedType' |
  'exhibit_SelectedStatus' |
  'exhibit_InputFilter' |
  'exhibit_List' |
  'exhibit_ListTotal' |
  'exhibit_ListState' |
  'exhibit_ListMore'> = {
  exhibit_ResourceTypeOptions: [
    { text: '全部', value: '-1' },
    ...FUtil.Predefined.resourceTypes.map((i) => ({ value: i, text: i })),
  ],
  exhibit_ResourceStateOptions: [
    { text: '全部', value: '2' },
    { text: '已上线', value: '1' },
    { text: '已下线', value: '0' },
  ],
  exhibit_SelectedType: '-1',
  exhibit_SelectedStatus: '2',
  exhibit_InputFilter: '',
  exhibit_List: [],
  exhibit_ListTotal: -1,
  exhibit_ListState: 'loading',
  exhibit_ListMore: 'loading',
};

const themeInitStates: Pick<NodeManagerModelState,
  'theme_ActivatingThemeID' |
  'theme_InputFilter' |
  'theme_List' |
  'theme_ListState' |
  'theme_ListMore'> = {
  theme_InputFilter: '',
  theme_ActivatingThemeID: '',
  theme_List: [],
  theme_ListState: 'loading',
  theme_ListMore: 'loading',
};


const initStates: NodeManagerModelState = {
  nodeId: -1,

  nodeName: '',
  nodeUrl: '',
  testNodeUrl: '',
  nodeThemeId: '',
  showPage: 'exhibit',
  goToTestNodePage: '',
  nodeInfoState: 'loading',
  listFirstLoaded: false,

  ...exhibitInitStates,

  ...themeInitStates,
};


const Model: NodeManagerModelType = {
  namespace: 'nodeManagerPage',
  state: initStates,
  effects: {
    * onMount_Page({ payload }: OnMount_Page_Action, { select, call, put }: EffectsCommandMap) {
      const { nodeManagerPage }: ConnectState = yield select(({ nodeManagerPage }: ConnectState) => ({
        nodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: payload.nodeID,
      };

      const { data } = yield call(FServiceAPI.Node.details, params);
      // console.log(data, 'data12341234');
      if (!data || data.ownerUserId !== FUtil.Tool.getUserIDByCookies()) {
        router.replace(FUtil.LinkTo.exception403());
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeId: payload.nodeID,
          nodeName: data?.nodeName,
          nodeUrl: FUtil.Format.completeUrlByDomain(data?.nodeDomain || ''),
          testNodeUrl: FUtil.Format.completeUrlByDomain('t.' + (data?.nodeDomain || '')),
          nodeThemeId: data.nodeThemeId,
          nodeInfoState: 'loaded',
        },
      });

      if (nodeManagerPage.showPage === 'exhibit') {
        yield put<FetchExhibitsAction>({
          type: 'fetchExhibits',
          payload: {
            restart: true,
          },
        });
      }

      if (nodeManagerPage.showPage === 'theme') {
        yield put<FetchThemesAction>({
          type: 'fetchThemes',
        });
      }
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...initStates,
        },
      });
    },
    // * onChange_NodeID({ payload }: OnChange_NodeID_Action, { select, call, put }: EffectsCommandMap) {
    //
    // },
    * onChange_ShowPage({ payload }: OnChange_ShowPage_Action, { put }: EffectsCommandMap) {
      if (payload.value === 'exhibit') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            showPage: payload.value,
            ...themeInitStates,
          },
        });
        yield put<FetchExhibitsAction>({
          type: 'fetchExhibits',
          payload: {
            restart: true,
          },
        });
      }

      if (payload.value === 'theme') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            showPage: payload.value,
            ...exhibitInitStates,
          },
        });
        yield put<FetchThemesAction>({
          type: 'fetchThemes',
          payload: {
            restart: true,
          },
        });
      }

    },
    * onMount_ExhibitPage({}: OnMount_ExhibitPage_Action, { select, put }: EffectsCommandMap) {
      // console.log('OnMount_ExhibitPage_Action###@4234234234234');
      // const { nodeManagerPage }: ConnectState = yield select(({ nodeManagerPage }: ConnectState) => ({
      //   nodeManagerPage,
      // }));
      // console.log(nodeManagerPage.nodeId, 'nodeManagerPage.nodeIdnodeManagerPage.nodeId!@#$');
      // if (nodeManagerPage.nodeId !== -1) {
      //   yield put<FetchExhibitsAction>({
      //     type: 'fetchExhibits',
      //     payload: {
      //       restart: true,
      //     },
      //   });
      // }

    },
    * onUnmount_ExhibitPage({}: OnUnmount_ExhibitPage_Action, { put }: EffectsCommandMap) {
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     ...exhibitInitStates,
      //   },
      // });
    },
    * onMount_ThemePage({}: OnMount_ThemePage_Action, { select, put }: EffectsCommandMap) {
      // const { nodeManagerPage }: ConnectState = yield select(({ nodeManagerPage }: ConnectState) => ({
      //   nodeManagerPage,
      // }));
      //
      // if (nodeManagerPage.nodeId !== -1) {
      //   yield put<FetchThemesAction>({
      //     type: 'fetchThemes',
      //   });
      // }
    },
    * onUnmount_ThemePage({}: OnUnmount_ThemePage_Action, { put }: EffectsCommandMap) {
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     ...themeInitStates,
      //   },
      // });
    },

    // * fetchNodeInfo({}: FetchNodeInfoAction, { put, select, call }: EffectsCommandMap) {
    //
    // },

    // * onChangeExhibit({ payload }: OnChangeExhibitAction, { put }: EffectsCommandMap) {
    //   if (payload.pageCurrent) {
    //     yield put<ChangeAction>({
    //       type: 'change',
    //       payload: {
    //         // pageCurrent: payload.pageCurrent,
    //       },
    //     });
    //   } else {
    //     yield put<ChangeAction>({
    //       type: 'change',
    //       payload: {
    //         // ...payload,
    //         // pageCurrent: 1,
    //       },
    //     });
    //   }
    //   yield put<FetchExhibitsAction>({
    //     type: 'fetchExhibits',
    //     payload: {
    //       restart: true,
    //     },
    //   });
    // },
    * onChange_Exhibit_SelectedType({ payload }: OnChange_Exhibit_SelectedType_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_SelectedType: payload.value,
        },
      });

      yield put<FetchExhibitsAction>({
        type: 'fetchExhibits',
        payload: {
          restart: true,
        },
      });
    },
    * onChange_Exhibit_SelectedStatus({ payload }: OnChange_Exhibit_SelectedStatus_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_SelectedStatus: payload.value,
        },
      });

      yield put<FetchExhibitsAction>({
        type: 'fetchExhibits',
        payload: {
          restart: true,
        },
      });
    },
    * onChange_Exhibit_InputFilter({ payload }: OnChange_Exhibit_InputFilter_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_InputFilter: payload.value,
        },
      });

      yield put<FetchExhibitsAction>({
        type: 'fetchExhibits',
        payload: {
          restart: true,
        },
      });
    },
    * onLoadMore_ExhibitList({}: OnLoadMore_ExhibitList_Action, { put }: EffectsCommandMap) {
      yield put<FetchExhibitsAction>({
        type: 'fetchExhibits',
        payload: {
          restart: false,
        },
      });
    },

    * onOnlineOrOffline({ payload }: OnOnlineOrOfflineAction, { call, put, select }: EffectsCommandMap) {
      // console.log(payload, 'PPPPPP');
      const { nodeManagerPage }: ConnectState = yield select(({ nodeManagerPage }: ConnectState) => ({
        nodeManagerPage,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
        presentableId: payload.id,
        onlineStatus: payload.onlineStatus,
      };

      const { data } = yield call(FServiceAPI.Exhibit.presentablesOnlineStatus, params);

      if (!data) {
        fMessage('上线失败', 'error');
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_List: nodeManagerPage.exhibit_List
            .map((el) => {
              if (payload.id !== el.id) {
                return el;
              }
              return {
                ...el,
                isOnline: payload.onlineStatus === 1,
              };
            })
            .filter((el) => {
              if (nodeManagerPage.exhibit_SelectedStatus === '2') {
                return true;
              }
              return el.isOnline === (nodeManagerPage.exhibit_SelectedStatus === '1');
            }),
        },
      });
    },
    * onActive({ payload }: OnActiveAction, { call, select, put }: EffectsCommandMap) {
      // const { nodeManagerPage }: ConnectState = yield select(({ nodeManagerPage }: ConnectState) => ({
      //   nodeManagerPage,
      // }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          theme_ActivatingThemeID: payload.id,
        },
      });

      const params: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
        presentableId: payload.id,
        onlineStatus: 1,
      };
      const { data } = yield call(FServiceAPI.Exhibit.presentablesOnlineStatus, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          theme_ActivatingThemeID: '',
        },
      });
      if (!data) {
        fMessage('激活失败', 'error');
      } else {
        fMessage('激活成功', 'success');
        yield put<FetchThemesAction>({
          type: 'fetchThemes',
        });
      }

      // yield put<FetchNodeInfoAction>({
      //   type: 'fetchNodeInfo',
      // });
    },
    * onChangeTheme({ payload }: OnChangeThemeAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          theme_InputFilter: payload.themeInputFilter,
        },
      });
      yield put<FetchThemesAction>({
        type: 'fetchThemes',
      });
    },

    * fetchExhibits({ payload }: FetchExhibitsAction, { call, select, put }: EffectsCommandMap) {
      const { nodeManagerPage }: ConnectState = yield select(({ nodeManagerPage }: ConnectState) => ({
        nodeManagerPage,
      }));

      const list: NodeManagerModelState['exhibit_List'] = payload.restart ? [] : nodeManagerPage.exhibit_List;
      if (payload.restart) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            exhibit_ListState: 'loading',
          },
        });
      } else {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            exhibit_ListMore: 'loading',
          },
        });
      }

      const params: Parameters<typeof FServiceAPI.Exhibit.presentables>[0] = {
        nodeId: nodeManagerPage.nodeId,
        limit: FUtil.Predefined.pageSize,
        // limit: 10,
        skip: list.length,
        keywords: nodeManagerPage.exhibit_InputFilter || undefined,
        onlineStatus: Number(nodeManagerPage.exhibit_SelectedStatus),
        resourceType: nodeManagerPage.exhibit_SelectedType === '-1' ? undefined : nodeManagerPage.exhibit_SelectedType,
        omitResourceType: 'theme',
      };

      const { data: data_Exhibits } = yield call(FServiceAPI.Exhibit.presentables, params);
      console.log(data_Exhibits, 'data!@$@$@#$@#4');

      if (data_Exhibits.dataList.length === 0) {
        if (nodeManagerPage.exhibit_SelectedType === '-1' && nodeManagerPage.exhibit_SelectedStatus === '2' && nodeManagerPage.exhibit_InputFilter === '') {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              exhibit_ListState: 'noData',
              exhibit_ListMore: 'noMore',
              exhibit_List: [],
              exhibit_ListTotal: data_Exhibits.totalItem,
              listFirstLoaded: true,
            },
          });
        } else {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              exhibit_ListState: 'noSearchResult',
              exhibit_ListMore: 'noMore',
              exhibit_List: [],
              exhibit_ListTotal: data_Exhibits.totalItem,
              listFirstLoaded: true,
            },
          });
        }
        return;
      }

      let batchAuthPs: any[] = [];
      const params1: Parameters<typeof FServiceAPI.Exhibit.batchAuth>[0] = {
        nodeId: nodeManagerPage.nodeId,
        authType: 3,
        presentableIds: (data_Exhibits.dataList as any[]).map<string>((dl: any) => {
          return dl.presentableId;
        }).join(','),
      };
      const { data: data1 } = yield call(FServiceAPI.Exhibit.batchAuth, params1);
      batchAuthPs = data1;

      const exhibit_List: NodeManagerModelState['exhibit_List'] = [
        ...list,
        ...(data_Exhibits.dataList as any[]).map<NodeManagerModelState['exhibit_List'][number]>((i: any) => {
          const authInfo = batchAuthPs.find((bap: any) => bap.presentableId === i.presentableId);
          return {
            id: i.presentableId,
            cover: i.coverImages[0],
            title: i.presentableTitle,
            resourceName: i.presentableName,
            version: i.version,
            isOnline: i.onlineStatus === 1,
            type: i.resourceInfo.resourceType,
            policies: (i.policies as any[])
              .filter((p: any) => p.status === 1)
              .map<string>((p) => p.policyName),
            hasPolicy: i.policies.length > 0,
            resourceId: i.resourceInfo.resourceId,
            isAuth: authInfo.isAuth,
            authErrorText: authInfo.defaulterIdentityType === 1
              ? FUtil1.I18n.message('alert_exhibit_auth_abnormal')
              : authInfo.defaulterIdentityType === 2
                ? FUtil1.I18n.message('alert_exhibit_no_auth')
                : '',
          };
        }),
      ];

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_List: exhibit_List,
          exhibit_ListTotal: data_Exhibits.totalItem,
          exhibit_ListState: 'loaded',
          exhibit_ListMore: data_Exhibits.totalItem > exhibit_List.length ? 'andMore' : 'noMore',
          listFirstLoaded: true,
        },
      });
    },
    * fetchThemes({}: FetchThemesAction, { call, put, select }: EffectsCommandMap) {
      // console.log(23423423, '0923jfdslk');
      const { nodeManagerPage }: ConnectState = yield select(({ nodeManagerPage }: ConnectState) => ({
        nodeManagerPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          theme_ListState: 'loading',
        },
      });

      const params: Parameters<typeof FServiceAPI.Exhibit.presentables>[0] = {
        nodeId: nodeManagerPage.nodeId,
        limit: FUtil.Predefined.pageSize,
        keywords: nodeManagerPage.theme_InputFilter || undefined,
        onlineStatus: 2,
        resourceType: 'theme',
      };

      const { data } = yield call(FServiceAPI.Exhibit.presentables, params);

      if (data.dataList.length === 0) {
        if (nodeManagerPage.theme_InputFilter === '') {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              theme_ListState: 'noData',
              theme_ListMore: 'noMore',
              theme_List: [],
            },
          });
        } else {
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              theme_ListState: 'noSearchResult',
              theme_ListMore: 'noMore',
              theme_List: [],
            },
          });
        }
        return;
      }

      let batchAuthTs: any[] = [];
      const params1: Parameters<typeof FServiceAPI.Exhibit.batchAuth>[0] = {
        nodeId: nodeManagerPage.nodeId,
        authType: 3,
        presentableIds: (data.dataList as any[]).map<string>((dl: any) => {
          return dl.presentableId;
        }).join(','),
      };
      const { data: data1 } = yield call(FServiceAPI.Exhibit.batchAuth, params1);
      batchAuthTs = data1;

      const theme_List: NodeManagerModelState['theme_List'] = (data.dataList as any[]).map<NodeManagerModelState['theme_List'][number]>((i: any) => {
        const authInfo = batchAuthTs.find((bap: any) => bap.presentableId === i.presentableId);
        return {
          id: i.presentableId,
          cover: i.coverImages[0],
          title: i.presentableTitle,
          version: i.version,
          isOnline: i.onlineStatus === 1,
          policies: (i.policies as any[])
            .filter((p: any) => p.status === 1)
            .map<string>((p) => p.policyName),
          hasPolicy: i.policies.length > 0,
          isAuth: authInfo.isAuth,
          authErrorText: authInfo.defaulterIdentityType === 1
            ? FUtil1.I18n.message('alert_exhibit_auth_abnormal')
            : authInfo.defaulterIdentityType === 2
              ? FUtil1.I18n.message('alert_exhibit_no_auth')
              : '',
          resourceId: i.resourceInfo.resourceId,
        };
      }).sort((a, b) => {
        if (a.isOnline && !b.isOnline) {
          return -1;
        }
        return 0;
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          theme_ListState: 'loaded',
          theme_ListMore: data.totalItem > theme_List.length ? 'andMore' : 'noMore',
          theme_List: theme_List,
          listFirstLoaded: true,
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
    setup({}) {

    },
  },
};

export default Model;
