import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import { handleAuthorizationGraphData } from '@/components/FAntvG6/FAntvG6AuthorizationGraph';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { router } from 'umi';
import { handleExhibitRelationGraphData } from '@/components/FAntvG6/FAntvG6RelationshipGraph';
import { FCustomOptionsEditorDrawerStates } from '@/components/FCustomOptionsEditorDrawer';

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
      status: 'active' | 'testActive' | 'inactive' | 'terminal';
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
  side_InheritOptions: {
    key: string;
    value: string;
    description: string;
    type: 'input' | 'select';
    options: string[];
    resetValue: string;
    valueInput: string;
    valueInputError: string;
  }[];
  side_CustomOptions: {
    key: string;
    value: string;
    description: string;
    valueInput: string;
    valueInputError: string;
  }[];
  side_CustomOptionsDrawer_Visible: boolean;
  side_CustomOptionDrawer_Visible: boolean;
  side_CustomOptionDrawer_DataSource: {
    key: string;
    value: string;
    description: string;
  } | null;
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
  type: 'exhibitInfoPage/updateRewrite' | 'updateRewrite';
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


export interface OnClick_Side_InheritOptions_ResetBtn_Action extends AnyAction {
  type: 'exhibitInfoPage/onClick_Side_InheritOptions_ResetBtn';
  payload: {
    index: number;
  };
}

export interface OnChange_Side_InheritOptions_ValueInput_Action extends AnyAction {
  type: 'exhibitInfoPage/onChange_Side_InheritOptions_ValueInput';
  payload: {
    index: number;
    value: string;
  };
}

export interface OnBlur_Side_InheritOptions_ValueInput_Action extends AnyAction {
  type: 'exhibitInfoPage/onBlur_Side_InheritOptions_ValueInput';
  payload: {
    index: number;
  };
}

export interface OnClick_Side_CustomOptions_EditBtn_Action extends AnyAction {
  type: 'exhibitInfoPage/onClick_Side_CustomOptions_EditBtn';
  payload: {
    index: number;
  };
}

export interface OnClick_Side_CustomOptions_DeleteBtn_Action extends AnyAction {
  type: 'exhibitInfoPage/onClick_Side_CustomOptions_DeleteBtn';
  payload: {
    index: number;
  };
}

export interface OnChange_Side_CustomOptions_ValueInput_Action extends AnyAction {
  type: 'exhibitInfoPage/onChange_Side_CustomOptions_ValueInput';
  payload: {
    index: number;
    value: string;
  };
}

export interface OnBlur_Side_CustomOptions_ValueInput_Action extends AnyAction {
  type: 'exhibitInfoPage/onBlur_Side_CustomOptions_ValueInput';
  payload: {
    index: number;
  };
}

export interface OnClick_Side_AddCustomOptionsBtn_Action extends AnyAction {
  type: 'exhibitInfoPage/onClick_Side_AddCustomOptionsBtn';
}

export interface OnConfirm_AddCustomOptionsDrawer_Action extends AnyAction {
  type: 'exhibitInfoPage/onConfirm_AddCustomOptionsDrawer';
  payload: {
    value: FCustomOptionsEditorDrawerStates['dataSource'];
  };
}

export interface OnCancel_AddCustomOptionsDrawer_Action extends AnyAction {
  type: 'exhibitInfoPage/onCancel_AddCustomOptionsDrawer';
}

export interface OnConfirm_CustomOptionDrawer_Action extends AnyAction {
  type: 'exhibitInfoPage/onConfirm_CustomOptionDrawer';
  payload: {
    value: {
      key: string;
      value: string;
      description: string;
      valueType: 'input' | 'select';
    };
  };
}

export interface OnCancel_CustomOptionDrawer_Action extends AnyAction {
  type: 'exhibitInfoPage/onCancel_CustomOptionDrawer';
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

    onClick_Side_InheritOptions_ResetBtn: (action: OnClick_Side_InheritOptions_ResetBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Side_InheritOptions_ValueInput: (action: OnChange_Side_InheritOptions_ValueInput_Action, effects: EffectsCommandMap) => void;
    onBlur_Side_InheritOptions_ValueInput: (action: OnBlur_Side_InheritOptions_ValueInput_Action, effects: EffectsCommandMap) => void;
    onClick_Side_CustomOptions_EditBtn: (action: OnClick_Side_CustomOptions_EditBtn_Action, effects: EffectsCommandMap) => void;
    onClick_Side_CustomOptions_DeleteBtn: (action: OnClick_Side_CustomOptions_DeleteBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Side_CustomOptions_ValueInput: (action: OnChange_Side_CustomOptions_ValueInput_Action, effects: EffectsCommandMap) => void;
    onBlur_Side_CustomOptions_ValueInput: (action: OnBlur_Side_CustomOptions_ValueInput_Action, effects: EffectsCommandMap) => void;
    onClick_Side_AddCustomOptionsBtn: (action: OnClick_Side_AddCustomOptionsBtn_Action, effects: EffectsCommandMap) => void;
    onConfirm_AddCustomOptionsDrawer: (action: OnConfirm_AddCustomOptionsDrawer_Action, effects: EffectsCommandMap) => void;
    onCancel_AddCustomOptionsDrawer: (action: OnCancel_AddCustomOptionsDrawer_Action, effects: EffectsCommandMap) => void;
    onConfirm_CustomOptionDrawer: (action: OnConfirm_CustomOptionDrawer_Action, effects: EffectsCommandMap) => void;
    onCancel_CustomOptionDrawer: (action: OnCancel_CustomOptionDrawer_Action, effects: EffectsCommandMap) => void;
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

  //   side_ExhibitCover: string;
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
  side_InheritOptions: [],
  side_CustomOptions: [],

  side_CustomOptionsDrawer_Visible: false,
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
          contract_Associated: result
            .map((r, index) => {
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
              // console.log(r, 'rrrrr09234j5rlkjsdflkfjsldfjl');
              return {
                id: r.resourceId,
                name: r.resourceName,
                type: r.resourceType,
                exhibits: exhibits,
                contracts: r.contracts
                  .filter((p) => {
                    return p.status !== 'terminal';
                  })
                  .map((c) => ({
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
                    // console.log(p, 'p90234');
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
          side_InheritOptions: (data.resourceCustomPropertyDescriptors as any[])
            .filter((rd: any) => rd.type !== 'readonlyText')
            .map<ExhibitInfoPageModelState['side_InheritOptions'][number]>((rd: any) => {
              const prp = data.presentableRewriteProperty.find((pr: any) => pr.key === rd.key);
              const value = prp ? prp.value : rd.defaultValue;
              // console.log(prp, 'rd1234234#####');
              // console.log(rd, 'rd1234234******');
              return {
                key: rd?.key || '',
                value: value,
                type: rd.type === 'select' ? 'select' : 'input',
                options: rd.type === 'select' ? rd.candidateItems : [],
                resetValue: rd.defaultValue || '',
                description: rd.remark || '',
                valueInput: value,
                valueInputError: '',
              };
            }),
          side_CustomOptions: (data.presentableRewriteProperty as any[])
            .filter((pr: any) => !disabledRewriteKeys.includes(pr.key))
            .map<ExhibitInfoPageModelState['side_CustomOptions'][number]>((pr: any) => {
              return {
                key: pr.key,
                value: pr.value,
                description: pr.remark,
                valueInput: pr.value,
                valueInputError: '',
              };
            }),

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

      const params: Parameters<typeof FServiceAPI.Exhibit.updateRewriteProperty>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        rewriteProperty: [
          ...exhibitInfoPage.side_InheritOptions
            // .filter((io) => {
            //   return io.valueInputError === '' && (io.type === 'input' ? (io.value !== io.resetValue) : (io.value !== io.options[0]));
            // })
            .map((io) => {
              return {
                key: io.key,
                value: io.value,
                remark: io.description,
              };
            }),
          ...exhibitInfoPage.side_CustomOptions
            .map((io) => {
              return {
                key: io.key,
                value: io.value,
                remark: io.description,
              };
            }),
        ],
      };
      yield call(FServiceAPI.Exhibit.updateRewriteProperty, params);
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

    * onClick_Side_InheritOptions_ResetBtn({ payload }: OnClick_Side_InheritOptions_ResetBtn_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_InheritOptions: exhibitInfoPage.side_InheritOptions.map((io, i) => {
            if (i !== payload.index) {
              return io;
            }
            return {
              ...io,
              value: io.resetValue,
              valueInput: io.resetValue,
              valueInputError: '',
            };
          }),
        },
      });

      yield put<UpdateRewriteAction>({
        type: 'updateRewrite',
      });
    },
    * onChange_Side_InheritOptions_ValueInput({ payload }: OnChange_Side_InheritOptions_ValueInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_InheritOptions: exhibitInfoPage.side_InheritOptions.map((io, i) => {
            if (i !== payload.index) {
              return io;
            }
            return {
              ...io,
              valueInput: payload.value,
            };
          }),
        },
      });
    },
    * onBlur_Side_InheritOptions_ValueInput({ payload }: OnBlur_Side_InheritOptions_ValueInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      // (value.length > 30 || value === '') ? '1~30个字符' : ''
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      let currentHasError: boolean = false;

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_InheritOptions: exhibitInfoPage.side_InheritOptions.map((io, i) => {
            if (i !== payload.index) {
              return io;
            }
            const valueInputError: string = io.valueInput.length > 140 ? '不超过140个字符' : '';
            currentHasError = valueInputError !== '';
            return {
              ...io,
              value: valueInputError === '' ? io.valueInput : io.value,
              valueInputError: valueInputError,
            };
          }),
        },
      });

      if (!currentHasError) {
        yield put<UpdateRewriteAction>({
          type: 'updateRewrite',
        });
      }

    },
    * onClick_Side_CustomOptions_EditBtn({ payload }: OnClick_Side_CustomOptions_EditBtn_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      const currentData = exhibitInfoPage.side_CustomOptions[payload.index];

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptionDrawer_Visible: true,
          side_CustomOptionDrawer_DataSource: {
            key: currentData.key,
            value: currentData.valueInput,
            description: currentData.description,
          },
        },
      });
    },
    * onClick_Side_CustomOptions_DeleteBtn({ payload }: OnClick_Side_CustomOptions_DeleteBtn_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: exhibitInfoPage.side_CustomOptions.filter((_, i) => {
            return i !== payload.index;
          }),
        },
      });

      yield put<UpdateRewriteAction>({
        type: 'updateRewrite',
      });
    },
    * onChange_Side_CustomOptions_ValueInput({ payload }: OnChange_Side_CustomOptions_ValueInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: exhibitInfoPage.side_CustomOptions.map((co, i) => {
            if (i !== payload.index) {
              return co;
            }
            return {
              ...co,
              valueInput: payload.value,
            };
          }),
        },
      });
    },
    * onBlur_Side_CustomOptions_ValueInput({ payload }: OnBlur_Side_CustomOptions_ValueInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      let currentHasError: boolean = false;
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: exhibitInfoPage.side_CustomOptions.map((co, i) => {
            if (i !== payload.index) {
              return co;
            }
            const valueInputError: string = co.valueInput.length > 140 ? '不超过140个字符' : '';
            currentHasError = valueInputError !== '';
            return {
              ...co,
              value: valueInputError === '' ? co.valueInput : co.value,
              valueInputError: valueInputError,
            };
          }),
        },
      });
      if (!currentHasError) {
        yield put<UpdateRewriteAction>({
          type: 'updateRewrite',
        });
      }
    },
    * onClick_Side_AddCustomOptionsBtn({}: OnClick_Side_AddCustomOptionsBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptionsDrawer_Visible: true,
        },
      });
    },
    * onConfirm_AddCustomOptionsDrawer({ payload }: OnConfirm_AddCustomOptionsDrawer_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: [
            ...exhibitInfoPage.side_CustomOptions,
            ...payload.value.map<ExhibitInfoPageModelState['side_CustomOptions'][number]>((v) => {
              return {
                key: v.key,
                value: v.defaultValue,
                description: v.description,
                option: [],
                valueInput: v.defaultValue,
                valueInputError: '',
              };
            }),
          ],
          side_CustomOptionsDrawer_Visible: false,
        },
      });

      yield put<UpdateRewriteAction>({
        type: 'updateRewrite',
      });
    },
    * onCancel_AddCustomOptionsDrawer({}: OnCancel_AddCustomOptionsDrawer_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptionsDrawer_Visible: false,
        },
      });
    },
    * onConfirm_CustomOptionDrawer({ payload }: OnConfirm_CustomOptionDrawer_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: exhibitInfoPage.side_CustomOptions.map((co) => {
            if (co.key !== payload.value.key) {
              return co;
            }
            return {
              key: co.key,
              value: payload.value.value,
              description: payload.value.description,
              valueInput: payload.value.value,
              valueInputError: '',
            };
          }),
          side_CustomOptionDrawer_Visible: false,
          side_CustomOptionDrawer_DataSource: null,
        },
      });

      yield put<UpdateRewriteAction>({
        type: 'updateRewrite',
      });
    },
    * onCancel_CustomOptionDrawer({}: OnCancel_CustomOptionDrawer_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptionDrawer_Visible: false,
          side_CustomOptionDrawer_DataSource: null,
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
export type HandleRelationParams = {
  contracts: {
    contractId: string;
    policyId: string;
  }[];
  resourceId: string;
  resourceName: string;
}[];

export type HandleRelationResult = {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  status: 0 | 1;
  contracts: {
    contractId: string;
    contractName: string;
    createDate: string
    policyText: string
    status: 'active' | 'testActive' | 'inactive' | 'terminal';
    policyId: string;
  }[];
  policies: {
    policyId: string;
    policyName: string;
    policyText: string;
    status: 0 | 1;
  }[];
}[];

export async function handleRelation(params: HandleRelationParams, nodeID: number): Promise<HandleRelationResult> {

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
    // console.log(resource, 'resource4329203ujlkzfsd');
    const contracts: HandleRelationResult[number]['contracts'] = allContracts
      .filter((acts: any) => {
        return acts.licensorId === resource.resourceId && acts.status === 0;
      })
      .map((contract: any) => {
        // console.log(contract, 'contract0923');
        return {
          contractId: contract.contractId,
          contractName: contract.contractName,
          createDate: contract.createDate,
          policyText: contract.policyInfo.policyText,
          status: contract.status === 1 ? 'terminal' : contract.authStatus === 1 ? 'active' : contract.authStatus === 2 ? 'testActive' : 'inactive',
          policyId: contract.policyId,
        };
      });
    const allContractsUsedPolicyIDs: string[] = contracts.map<string>((c) => {
      return c.policyId;
    });
    // console.log(allContractsUsedPolicyIDs, 'allContractsUsedPolicyIDsallContractsUsedPolicyIDs0932o');
    return {
      resourceId: resource.resourceId,
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
      status: resource.status,
      contracts: contracts,
      policies: resource.policies
        // .filter((p: any) => {
        //   return !allContracts
        //     .some((act: any) => {
        //       // console.log(p, act, '!@#$!@#$!@#$!@#$!@#$!@#$!@#$');
        //       return act.licensorId === resource.resourceId && act.policyId === p.policyId;
        //     });
        // })
        .filter((p:any) => {
          // console.log(p, 'PPPpppPPPPppPPPPpppPPP');
          return p.status === 1 && !allContractsUsedPolicyIDs.includes(p.policyId);
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
  console.log(data, 'data2903jsaldfksjd');
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
