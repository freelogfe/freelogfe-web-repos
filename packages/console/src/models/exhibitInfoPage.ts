import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import { handleAuthorizationGraphData } from '@/components/FAntvG6/FAntvG6AuthorizationGraph';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { router } from 'umi';
import { handleExhibitRelationGraphData } from '@/components/FAntvG6/FAntvG6RelationshipGraph';

export interface ExhibitInfoPageModelState {
  pageLoading: boolean;

  exhibit_ID: string;
  exhibit_Name: string;
  exhibit_Title: string;
  exhibit_Online: boolean;
  exhibit_IsAuth: boolean;
  exhibit_AuthErrorText: string;
  exhibit_BelongNode_ID: number;
  exhibit_BelongNode_Name: string;
  exhibit_BelongNode_ActiveThemeId: string;

  policy_List: {
    id: string;
    name: string;
    text: string;
    status: 0 | 1;
  }[];
  policy_BuildDrawer_Visible: boolean;

  contract_ExhibitAllContractIDs: {
    exhibitID: string;
    resourceID: string;
    contractIDs: string[];
  }[];
  contract_SelectedAssociatedID: string;
  contract_Associated: {
    // selected: boolean;
    id: string;
    name: string;
    type: string;

    exhibits: {
      id: string;
      name: string;
      status: 0 | 1;
    }[];
    contracts: {
      name: string;
      status: 0 | 1 | 2;
      id: string;
      text: string;
      createTime: string;
      policyId: string;
      exhibitOpen: boolean;
    }[];
    policies: {
      id: string;
      name: string;
      text: string;
    }[];
  }[];

  graph_FullScreen: boolean;
  graph_Viewport_Show: 'relationship' | 'authorization';
  graph_Viewport_RelationGraph_Nodes: Array<{
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
    pending: boolean;
    exception: boolean;
  } | {
    id: string;
    nodeName: string;
    exhibitName: string;
  }>;
  graph_Viewport_RelationGraph_Edges: {
    source: string;
    target: string;
  }[];
  graph_Viewport_AuthorizationGraph_Nodes: Array<{
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  } | {
    id: string;
    nodeId: number;
    nodeName: string;
    exhibitId: string;
    exhibitName: string;
  } | {
    id: string;
    contracts: {
      contractId: string;
      contractName: string;
      isAuth: boolean;
      updateDate: string;
    }[];
  }>;
  graph_Viewport_AuthorizationGraph_Edges: {
    source: string;
    target: string;
  }[];

  side_ExhibitCover: string;
  side_ExhibitTitle: string;
  side_ExhibitInputTitle: string | null;
  side_ExhibitTags: string[];
  side_AllVersions: string[];
  side_Version: string;
  side_SettingUnfold: boolean;
  side_BaseAttrs: {
    key: string;
    value: string;
  }[];
  side_CustomOptions: {
    defaultValue?: string; // 如果该属性存在说明是继承过来的属性，如果不存在则为新添加属性
    option?: string[]; // 如果属性不存在或length为0表示输入框，否则为选择框

    value: string; // 最终向服务端提交的value数据

    key: string;
    newValue: string;  // 输入框显示的值
    newValueError: string; // 输入框校验的实时提醒错误信息
    remark: string;
    isEditing: boolean; // 是否弹窗来编辑此属性
  }[];
  side_CustomOptionsDrawer_Visible: boolean;
  side_CustomOptionsDrawer_DataSource: {
    key: string;
    keyError: string;
    description: string;
    descriptionError: string;
    custom: 'input' | 'select';
    defaultValue: string;
    defaultValueError: string;
    customOption: string;
    customOptionError: string;
  }[];
  side_CustomOptionDrawer_Visible: boolean;
  side_CustomOptionDrawer_DataSource: null;
  side_ResourceID: string;
  side_ResourceName: string;
  side_ResourceType: string;
  side_ResourceCover: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'exhibitInfoPage/change';
  payload: Partial<ExhibitInfoPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'exhibitInfoPage/onMountPage';
  payload: {
    exhibitID: string;
  };
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'exhibitInfoPage/onUnmountPage';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo' | 'exhibitInfoPage/fetchInfo';
}

export interface AddAPolicyAction extends AnyAction {
  type: 'exhibitInfoPage/addAPolicy';
  payload: {
    title: string;
    text: string;
  };
}

export interface UpdateAPolicyAction extends AnyAction {
  type: 'exhibitInfoPage/updateAPolicy';
  payload: {
    id: string;
    status: 0 | 1
  };
}

export interface UpdateBaseInfoAction extends AnyAction {
  type: 'exhibitInfoPage/updateBaseInfo';
  payload: Partial<Pick<ExhibitInfoPageModelState, 'side_ExhibitCover' | 'side_ExhibitTitle' | 'side_ExhibitTags'>>;
}

export interface UpdateStatusAction extends AnyAction {
  type: 'exhibitInfoPage/updateStatus';
  payload: 0 | 1;
}

export interface UpdateRelationAction extends AnyAction {
  type: 'exhibitInfoPage/updateRelation';
  payload: {
    resourceId: string;
    policyId: string;
  };
}

export interface UpdateRewriteAction extends AnyAction {
  type: 'exhibitInfoPage/updateRewrite';
}

export interface ChangeVersionAction extends AnyAction {
  type: 'exhibitInfoPage/changeVersion';
  payload: string;
}

export interface UpdateContractUsedAction {
  type: 'exhibitInfoPage/updateContractUsed';
  payload: {
    exhibitID: string;
    resourceID: string;
    policyID: string;
    isUsed: boolean;
  };
}

export interface OnClick_Side_AddCustomOptionsBtn_Action extends AnyAction {
  type: 'exhibitInfoPage/onClick_Side_AddCustomOptionsBtn';
}

export interface OnChange_AddCustomOptions_Action extends AnyAction {
  type: 'exhibitInfoPage/onChange_AddCustomOptions';
  payload: {
    value: ExhibitInfoPageModelState['side_CustomOptionsDrawer_DataSource'];
  };
}

export interface ExhibitInfoPageModelType {
  namespace: 'exhibitInfoPage';
  state: ExhibitInfoPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    addAPolicy: (action: AddAPolicyAction, effects: EffectsCommandMap) => void;
    updateAPolicy: (action: UpdateAPolicyAction, effects: EffectsCommandMap) => void;
    updateBaseInfo: (action: UpdateBaseInfoAction, effects: EffectsCommandMap) => void;
    updateStatus: (action: UpdateStatusAction, effects: EffectsCommandMap) => void;
    updateRelation: (action: UpdateRelationAction, effects: EffectsCommandMap) => void;
    updateRewrite: (action: UpdateRewriteAction, effects: EffectsCommandMap) => void;
    changeVersion: (action: ChangeVersionAction, effects: EffectsCommandMap) => void;
    updateContractUsed: (action: UpdateContractUsedAction, effects: EffectsCommandMap) => void;
    onClick_Side_AddCustomOptionsBtn: (action: OnClick_Side_AddCustomOptionsBtn_Action, effects: EffectsCommandMap) => void;
    onChange_AddCustomOptions: (action: OnChange_AddCustomOptions_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ExhibitInfoPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ExhibitInfoPageModelState = {
  pageLoading: true,

  exhibit_ID: '',
  exhibit_Name: '',
  exhibit_Title: '',
  exhibit_Online: false,
  exhibit_IsAuth: true,
  exhibit_AuthErrorText: '',
  exhibit_BelongNode_ID: -1,
  exhibit_BelongNode_Name: '',
  exhibit_BelongNode_ActiveThemeId: '',

  policy_List: [],
  policy_BuildDrawer_Visible: false,

  contract_ExhibitAllContractIDs: [],
  contract_SelectedAssociatedID: '',
  contract_Associated: [],

  graph_FullScreen: false,
  graph_Viewport_Show: 'relationship',
  graph_Viewport_RelationGraph_Nodes: [],
  graph_Viewport_RelationGraph_Edges: [],
  graph_Viewport_AuthorizationGraph_Nodes: [],
  graph_Viewport_AuthorizationGraph_Edges: [],

  // side_ExhibitCover: string;
  //   side_ExhibitTitle: string;
  //   side_ExhibitInputTitle: string | null;
  //   side_ExhibitTags: string[];
  //   side_AllVersions: string[];
  //   side_Version: string;
  //   side_SettingUnfold: boolean;
  //   side_BaseAttrs:
  //   side_CustomOptions:
  //   side_CustomOptionsDrawer_Visible: boolean;
  //   side_CustomOptionsDrawer_DataSource:
  //   side_CustomOptionDrawer_Visible: boolean;
  //   side_CustomOptionDrawer_DataSource: null;
  //   side_ResourceId: string;
  //   side_ResourceName: string;
  //   side_ResourceType: string;
  //   side_ResourceCover: string;
  side_ExhibitCover: '',
  side_ExhibitTitle: '',
  side_ExhibitInputTitle: null,
  side_ExhibitTags: [],
  side_AllVersions: [],
  side_Version: '',
  side_SettingUnfold: false,
  side_BaseAttrs: [],
  side_CustomOptions: [],

  side_CustomOptionsDrawer_Visible: false,
  side_CustomOptionsDrawer_DataSource: [],
  side_CustomOptionDrawer_Visible: false,
  side_CustomOptionDrawer_DataSource: null,
  side_ResourceID: '',
  side_ResourceName: '',
  side_ResourceType: '',
  side_ResourceCover: '',

  // pAddCustomModalVisible: false,
  // pAddCustomKey: '',
  // pAddCustomKeyError: '',
  // pAddCustomValue: '',
  // pAddCustomValueError: '',
  // pAddCustomDescription: '',
  // pAddCustomDescriptionError: '',
};

const Model: ExhibitInfoPageModelType = {
  namespace: 'exhibitInfoPage',
  state: initStates,
  effects: {
    * onMountPage({ payload }: OnMountPageAction, { put, call }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_ID: payload.exhibitID,
        },
      });

      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });

    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...initStates,
        },
      });
    },
    * fetchInfo({}: FetchInfoAction, { call, select, put }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        isLoadCustomPropertyDescriptors: 1,
        isLoadPolicyInfo: 1,
      };
      const { data } = yield call(FServiceAPI.Exhibit.presentableDetails, params);

      // console.log(data, 'data@#Rasfdjou890ujewfra');

      // if (!data || data.userId !== user.cookiesUserID) {
      if (!data || data.userId !== FUtil.Tool.getUserIDByCookies()) {
        router.replace(FUtil.LinkTo.exception403({}));
        return;
      }

      const params3: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: data.nodeId,
      };

      const { data: data3 } = yield call(FServiceAPI.Node.details, params3);
      // console.log(data3, 'data90j23rlkfjasdfa');

      const params2: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: data.resourceInfo.resourceId,
      };

      const { data: data2 } = yield call(FServiceAPI.Resource.info, params2);
      // console.log(data2, 'data2309jdsfa');

      // 组织授权信息数据
      const result: HandleRelationResult = yield call(handleRelation, data.resolveResources, data.nodeId);

      // 要禁用的键
      const disabledRewriteKeys = [
        ...data.resourceCustomPropertyDescriptors.map((i: any) => i.key),
      ];

      // console.log(data, 'data2341234');

      // 获取展品授权结果
      const params1: Parameters<typeof FServiceAPI.Exhibit.batchAuth>[0] = {
        nodeId: data.nodeId,
        authType: 3,
        presentableIds: data.presentableId,
      };
      const { data: data1 } = yield call(FServiceAPI.Exhibit.batchAuth, params1);
      // console.log(data1, 'data1123434');

      // 关系树数据
      const params6: Parameters<typeof FServiceAPI.Exhibit.relationTree>[0] = {
        presentableId: data.presentableId,
      };

      const { data: data6 } = yield call(FServiceAPI.Exhibit.relationTree, params6);
      // console.log(data, 'datadatadatadatadatadatadata');
      // console.log(data6, 'DDDDDD!!@#$@!#$!@#$@#$6666');

      const {
        nodes: relationGraphNodes,
        edges: relationGraphEdges,
      } = yield call(handleExhibitRelationGraphData, data6, {
        nodeId: data.nodeId,
        nodeName: data3.nodeName,
        exhibitId: data.presentableId,
        exhibitName: data.presentableName,
      });

      // console.log(relationGraphNodes, relationGraphEdges, '@#$!@#$!@#$!2341234123421342134134');

      // 授权树数据
      const params4: Parameters<typeof FServiceAPI.Exhibit.authTree>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
      };

      const { data: data4 } = yield call(FServiceAPI.Exhibit.authTree, params4);

      // console.log(data4, '@@@@@#4234234324234');
      const {
        nodes: authorizationGraphNodes,
        edges: authorizationGraphEdges,
      } = yield call(handleAuthorizationGraphData, data4, {
        id: data.presentableId,
        nodeId: data.nodeId,
        nodeName: data3.nodeName,
        exhibitId: data.presentableId,
        exhibitName: data.presentableName,
      });

      // 根据资源 id 批量查询所有合同
      const params5: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
        nodeId: data.nodeId,
        resolveResourceIds: result.map((rs) => {
          return rs.resourceId;
        }).join(','),
      };

      const { data: data5 } = yield call(FServiceAPI.Exhibit.presentableList, params5);

      // console.log(data5, 'data5!@#$!@#$@#$!@#$!@#$!@#4123421341234');
      const exhibitAllContractIDs: {
        exhibitID: string;
        resourceID: string;
        contractIDs: string[];
      }[] = data5.map((d5: any) => {
        return d5.resolveResources?.map((resvr: any) => {
          return {
            exhibitID: d5.presentableId,
            resourceID: resvr.resourceId,
            contractIDs: resvr.contracts.map((cccc: any) => {
              return cccc.contractId;
            }),
          };
        });
      }).flat();

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageLoading: false,
          exhibit_BelongNode_ID: data.nodeId,
          exhibit_BelongNode_Name: data3.nodeName,
          exhibit_BelongNode_ActiveThemeId: data3.nodeThemeId,
          exhibit_ID: data.presentableId,
          exhibit_Name: data.presentableName,
          exhibit_Online: data.onlineStatus === 1,
          exhibit_IsAuth: data1[0].isAuth,
          exhibit_AuthErrorText: data1[0].error,
          policy_List: data.policies.map((p: any) => ({
            id: p.policyId,
            name: p.policyName,
            text: p.policyText,
            status: p.status,
          })),

          contract_ExhibitAllContractIDs: exhibitAllContractIDs,
          contract_SelectedAssociatedID: result.some((rr) => {
            return rr.resourceId === exhibitInfoPage.contract_SelectedAssociatedID;
          }) ? exhibitInfoPage.contract_SelectedAssociatedID : result[0].resourceId,
          contract_Associated: result.map((r, index) => {
            const exhibits = data5.filter((d5: any) => {
              return d5.resolveResources.some((rr: any) => {
                return d5.presentableId !== data.presentableId && rr.resourceId === r.resourceId;
              });
            }).map((d5: any) => {
              return {
                id: d5.presentableId,
                name: d5.presentableName,
                // policyId: d5.
                status: d5.onlineStatus,
              };
            });
            return {
              id: r.resourceId,
              name: r.resourceName,
              type: r.resourceType,
              exhibits: exhibits,
              contracts: r.contracts.map((c) => ({
                name: c.contractName,
                status: c.status,
                id: c.contractId,
                text: c.policyText,
                createTime: FUtil.Format.formatDateTime(c.createDate),
                policyId: c.policyId,
                exhibitOpen: false,
              })),
              policies: r.policies
                .filter((p) => {
                  return p.status === 1;
                })
                .map((p) => ({
                  id: p.policyId,
                  name: p.policyName,
                  text: p.policyText,
                })),
            };
          }),
          graph_Viewport_RelationGraph_Nodes: relationGraphNodes,
          graph_Viewport_RelationGraph_Edges: relationGraphEdges,
          graph_Viewport_AuthorizationGraph_Nodes: authorizationGraphNodes,
          graph_Viewport_AuthorizationGraph_Edges: authorizationGraphEdges,

          side_ExhibitCover: data.coverImages[0] || '',
          side_ExhibitTitle: data.presentableTitle,
          side_ExhibitTags: data.tags,

          side_AllVersions: data2.resourceVersions.map((d2: any) => d2.version),
          side_Version: data.version,

          side_BaseAttrs: [
            ...Object.entries(data.resourceSystemProperty).map((s: any) => ({
              key: s[0],
              value: s[0] === 'fileSize' ? FUtil.Format.humanizeSize(s[1]) : s[1],
            })),
            ...data.resourceCustomPropertyDescriptors
              .filter((rd: any) => rd.type === 'readonlyText')
              .map((rd: any) => ({
                key: rd.key,
                value: rd.defaultValue,
              })),
          ],
          side_CustomOptions: [
            ...(data.resourceCustomPropertyDescriptors as any[])
              .filter((rd: any) => rd.type !== 'readonlyText')
              .map<ExhibitInfoPageModelState['side_CustomOptions'][number]>((rd: any) => {
                const prp = data.presentableRewriteProperty.find((pr: any) => pr.key === rd.key);
                const value = prp ? prp.value : rd.defaultValue;
                return {
                  key: rd?.key,
                  option: rd.type === 'select' ? rd.candidateItems : [],
                  defaultValue: rd.defaultValue,
                  value: value,
                  remark: rd.remark,
                  newValue: value,
                  newValueError: '',
                  isEditing: false,
                };
              }),
            ...(data.presentableRewriteProperty as any[])
              .filter((pr: any) => !disabledRewriteKeys.includes(pr.key))
              .map<ExhibitInfoPageModelState['side_CustomOptions'][number]>((pr: any) => ({
                key: pr.key,
                value: pr.value,
                newValue: pr.value,
                newValueError: '',
                remark: pr.remark,
                isEditing: false,
              })),
          ],

          side_ResourceID: data2.resourceId,
          side_ResourceName: data2.resourceName,
          side_ResourceType: data2.resourceType,
          side_ResourceCover: data2.coverImages[0] || '',
        },
      });
    },
    * addAPolicy({ payload }: AddAPolicyAction, { call, select, put }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        addPolicies: [{
          policyName: payload.title,
          policyText: payload.text,
          status: 1,
        }],
      };
      yield call(FServiceAPI.Exhibit.updatePresentable, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateAPolicy({ payload }: UpdateAPolicyAction, { call, select, put }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        updatePolicies: [{
          policyId: payload.id,
          status: payload.status,
        }],
      };
      yield call(FServiceAPI.Exhibit.updatePresentable, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateBaseInfo({ payload }: UpdateBaseInfoAction, { select, call, put }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        presentableTitle: payload.side_ExhibitTitle,
        tags: payload.side_ExhibitTags,
        coverImages: payload.side_ExhibitCover ? [payload.side_ExhibitCover] : undefined,
      };
      yield call(FServiceAPI.Exhibit.updatePresentable, params);
      yield put<ChangeAction>({
        type: 'change',
        payload,
      });
    },
    * updateStatus({ payload }: UpdateStatusAction, { call, select, put }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        onlineStatus: payload,
      };
      const { data } = yield call(FServiceAPI.Exhibit.presentablesOnlineStatus, params);
      if (!data) {
        fMessage(exhibitInfoPage.side_ResourceType === 'theme' ? '激活失败' : '上线失败', 'error');
        return;
      }
      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     isOnline: payload === 1,
      //   },
      // });
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateRelation({ payload }: UpdateRelationAction, { select, call, put }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      const resource = exhibitInfoPage.contract_Associated.find((a) => a.id === payload.resourceId);
      // console.log(resource, '$#@$#$@#');
      const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        resolveResources: yield call(handleFinalResolveResource, {
          exhibitID: exhibitInfoPage.exhibit_ID,
          resourceID: payload.resourceId,
          policyID: payload.policyId,
          isUsed: true,
        }),
      };
      yield call(FServiceAPI.Exhibit.updatePresentable, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateRewrite({}: UpdateRewriteAction, { select, call, put }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      const pCustomAttrs: ExhibitInfoPageModelState['side_CustomOptions'] = exhibitInfoPage.side_CustomOptions
        .map<ExhibitInfoPageModelState['side_CustomOptions'][number]>((pc) => {
          return {
            ...pc,
            value: pc.newValueError ? pc.value : pc.newValue,
          };
        });

      const params: Parameters<typeof FServiceAPI.Exhibit.updateRewriteProperty>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        rewriteProperty: pCustomAttrs
          .filter((pc) => pc.value !== pc.defaultValue)
          .map((pc) => ({
            key: pc.key,
            value: pc.value,
            remark: pc.remark,
          })),
      };
      yield call(FServiceAPI.Exhibit.updateRewriteProperty, params);

      // 同步数据
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: pCustomAttrs,
        },
      });
    },
    * changeVersion({ payload }: ChangeVersionAction, { call, put, select }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      const params: Parameters<typeof FServiceAPI.Exhibit.presentablesVersion>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        version: payload,
      };
      yield call(FServiceAPI.Exhibit.presentablesVersion, params);
      yield put<FetchInfoAction>({
        type: 'fetchInfo',
      });
    },
    * updateContractUsed({ payload }: UpdateContractUsedAction, { select, call, put }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      // console.log(data, 'data123412398yuoihjkl');

      const params2: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: payload.exhibitID,
        resolveResources: yield call(handleFinalResolveResource, payload),
      };
      // console.log(params2, 'params2!@!@#$@!#$!@#$');

      const { data: data2 } = yield call(FServiceAPI.Exhibit.updatePresentable, params2);

      // 根据资源 id 批量查询所有合同
      const params5: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
        nodeId: exhibitInfoPage.exhibit_BelongNode_ID,

        resolveResourceIds: exhibitInfoPage.contract_Associated.map((rs) => {
          return rs.id;
        }).join(','),
      };

      const { data: data5 } = yield call(FServiceAPI.Exhibit.presentableList, params5);

      const exhibitAllContractIDs: {
        exhibitID: string;
        resourceID: string;
        contractIDs: string[];
      }[] = data5.map((d5: any) => {
        return d5.resolveResources?.map((resvr: any) => {
          return {
            exhibitID: d5.presentableId,
            resourceID: resvr.resourceId,
            contractIDs: resvr.contracts.map((cccc: any) => {
              return cccc.contractId;
            }),
          };
        });
      }).flat();

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          contract_ExhibitAllContractIDs: exhibitAllContractIDs,
        },
      });
    },
    * onClick_Side_AddCustomOptionsBtn({}: OnClick_Side_AddCustomOptionsBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptionsDrawer_Visible: true,
        },
      });
    },
    * onChange_AddCustomOptions({ payload }: OnChange_AddCustomOptions_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptionsDrawer_DataSource: payload.value,
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

/**
 * 组织授权信息数据
 */
type HandleRelationParams = {
  contracts: {
    contractId: string;
    policyId: string;
  }[];
  resourceId: string;
  resourceName: string;
}[];

type HandleRelationResult = {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  status: 0 | 1;
  contracts: {
    contractId: string;
    contractName: string;
    createDate: string
    policyText: string
    status: 0 | 1 | 2;
    policyId: string;
  }[];
  policies: {
    policyId: string;
    policyName: string;
    policyText: string;
    status: 0 | 1;
  }[];
}[];

async function handleRelation(params: HandleRelationParams, nodeID: number): Promise<HandleRelationResult> {

  // console.log(nodeID, 'nodeID!@#$@#$@#$@#@#$');
  // console.log(params, 'params0923jafdsl');
  const resourceIds: string[] = params.map((r) => r.resourceId);

  const allContracts = await getAllContracts({
    nodeID,
    resourceIDs: resourceIds,
  });

  // const contractResourcePolicyIds: {
  //   resourceID: string;
  //   policyID: string;
  // }[] = allContracts.map((cs) => {
  //   return {
  //     resourceID: cs.
  //   }
  // });

  const params0: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
    resourceIds: resourceIds.join(','),
    isLoadPolicyInfo: 1,
  };

  const { data: data0 }: any = await FServiceAPI.Resource.batchInfo(params0);
  // console.log(data0, data1, 'data0, data123rfsda');

  const result: HandleRelationResult = params.map((r) => {
    const resource = data0.find((dr: any) => dr.resourceId === r.resourceId);
    return {
      resourceId: resource.resourceId,
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
      status: resource.status,
      contracts: allContracts
        .filter((acts: any) => {
          return acts.licensorId === resource.resourceId;
        })
        .map((contract: any) => {
          // console.log(contract, 'contract0923');
          return {
            contractId: contract.contractId,
            contractName: contract.contractName,
            createDate: contract.createDate,
            policyText: contract.policyInfo.policyText,
            // status: contract.status,
            status: contract.status === 1 ? 2 : ((contract.authStatus & 1) === 1) ? 1 : 0,
            policyId: contract.policyId,
          };
        }),
      policies: resource.policies
        .filter((p: any) => {
          return !allContracts
            .some((act: any) => {
              // console.log(p, act, '!@#$!@#$!@#$!@#$!@#$!@#$!@#$');
              return act.licensorId === resource.resourceId && act.policyId === p.policyId;
            });
        })
        .map((p: any) => {
          return {
            policyId: p.policyId,
            policyName: p.policyName,
            policyText: p.policyText,
            status: p.status,
          };
        }),
    };
  });
  // console.log(result, 'result2309jd');
  return result;
}

interface GetAllContractsParamsType {
  nodeID: number;
  resourceIDs: string[];
}

type GetAllContractsReturnType = {
  contractId: string;
  contractName: string;
  createDate: string;
  updateDate: string;
  policyId: string;
  policyInfo: {
    policyId: string;
    policyText: string;
  };
}[];

async function getAllContracts({ nodeID, resourceIDs }: GetAllContractsParamsType): Promise<GetAllContractsReturnType> {
  // console.log(resourceIDs, 'resourceIDs!!@#$!@#$!@$1230900000000');
  const allPromises = resourceIDs.map(async (id) => {
    const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      licensorId: id,
      licenseeId: nodeID,
      licenseeIdentityType: 2,
      isLoadPolicyInfo: 1,
      subjectIds: id,
      subjectType: 1,
    };
    const { data } = await FServiceAPI.Contract.batchContracts(params);
    // console.log(data, 'data!!!1111100000000))))))');
    return data;
  });

  return (await Promise.all(allPromises)).flat();
}

interface HandleFinalResolveResourceParams {
  exhibitID: string;
  resourceID: string;
  policyID: string;
  isUsed: boolean;
}

async function handleFinalResolveResource({
                                            exhibitID,
                                            resourceID,
                                            policyID,
                                            isUsed,
                                          }: HandleFinalResolveResourceParams) {
  const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
    presentableId: exhibitID,
  };

  const { data } = await FServiceAPI.Exhibit.presentableDetails(params);

  return data.resolveResources?.map((rrs: any) => {
    if (resourceID !== rrs.resourceId) {
      return {
        resourceId: rrs.resourceId,
        contracts: rrs.contracts.map((cccttt: any) => {
          return {
            policyId: cccttt.policyId,
          };
        }),
      };
    }
    return {
      resourceId: rrs.resourceId,
      contracts: isUsed
        ? [
          ...rrs.contracts.map((cccttt: any) => {
            return {
              policyId: cccttt.policyId,
            };
          }),
          { policyId: policyID },
        ]
        : rrs.contracts
          .filter((ccc: any) => {
            return ccc.policyId !== policyID;
          })
          .map((cccttt: any) => {
            return {
              policyId: cccttt.policyId,
            };
          }),
    };
  });
}
