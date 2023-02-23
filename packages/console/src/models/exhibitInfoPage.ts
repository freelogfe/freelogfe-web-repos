import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import fMessage from '@/components/fMessage';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import { history } from 'umi';
import { FCustomOptionsEditorDrawerStates } from '@/components/FCustomOptionsEditorDrawer';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { fileAttrUnits } from '@/utils/format';
import FComponentsLib from '@freelog/components-lib';
import fPromiseModalConfirm from '@/components/fPromiseModalConfirm';

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

  policy_List: PolicyFullInfo_Type[];
  // policy_BuildDrawer_Visible: boolean;

  contract_ExhibitAllContractIDs: {
    exhibitID: string;
    resourceID: string;
    contractIDs: string[];
  }[];
  contract_SelectedAssociatedID: string;
  contract_Associated: {
    id: string;
    name: string;
    type: string[];
    state: 'online' | 'offline';
    error: '' | 'offline' | 'unreleased' | 'freeze';
    warning: '';
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
    terminatedContractIDs: string[];
    policies: PolicyFullInfo_Type[];
  }[];

  // graph_FullScreen: boolean;
  // graph_Viewport_Show: 'relationship' | 'authorization' | 'dependency';
  graphShow: boolean;

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
  side_ResourceType: string[];
  side_ResourceCover: string;

  policyEditorVisible: boolean;
  policyOperaterVisible: boolean;
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
    isUsed: boolean;  // 是否启用此合约
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
  // policy_BuildDrawer_Visible: false,

  contract_ExhibitAllContractIDs: [],
  contract_SelectedAssociatedID: '',
  contract_Associated: [],

  // graph_FullScreen: false,
  // graph_Viewport_Show: 'relationship',
  graphShow: true,

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
  side_ResourceType: [],
  side_ResourceCover: '',

  policyEditorVisible: false,
  policyOperaterVisible: false,

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
        isTranslate: 1,
      };

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_ID: '',
        },
      });
      const { data: data_PresentableDetails } = yield call(FServiceAPI.Exhibit.presentableDetails, params);

      // console.log(data, 'data@#Rasfdjou890ujewfra');

      // if (!data || data.userId !== user.cookiesUserID) {
      if (!data_PresentableDetails || data_PresentableDetails.userId !== FUtil.Tool.getUserIDByCookies()) {
        history.replace(FUtil.LinkTo.exception403({}));
        return;
      }

      const params3: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: data_PresentableDetails.nodeId,
      };

      const { data: data_NodeDetails } = yield call(FServiceAPI.Node.details, params3);
      // console.log(data3, 'data90j23rlkfjasdfa');

      if ((data_NodeDetails.status & 4) === 4) {
        history.replace(FUtil.LinkTo.nodeFreeze({ nodeID: data_PresentableDetails.nodeId }));
        return;
      }

      const params2: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: data_PresentableDetails.resourceInfo.resourceId,
      };

      const { data: data_ResourceInfo } = yield call(FServiceAPI.Resource.info, params2);
      // console.log(data2, 'data2309jdsfa');

      // 组织授权信息数据
      const result_ContractAssociated: HandleRelationResult = yield call(handleRelation, data_PresentableDetails.resolveResources, data_PresentableDetails.nodeId);

      // 要禁用的键
      const disabledRewriteKeys = [
        ...data_PresentableDetails.resourceCustomPropertyDescriptors.map((i: any) => i.key),
      ];

      // console.log(data, 'data2341234');

      // 获取展品授权结果
      const params1: Parameters<typeof FServiceAPI.Exhibit.batchAuth>[0] = {
        nodeId: data_PresentableDetails.nodeId,
        authType: 3,
        presentableIds: data_PresentableDetails.presentableId,
      };
      const { data: data_ExhibitBatchAuthResults } = yield call(FServiceAPI.Exhibit.batchAuth, params1);

      // 根据资源 id 批量查询所有合同
      const params5: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
        nodeId: data_PresentableDetails.nodeId,
        resolveResourceIds: result_ContractAssociated.map((rs) => {
          return rs.resourceId;
        }).join(','),
      };

      const { data: data_AllPresentables } = yield call(FServiceAPI.Exhibit.presentableList, params5);

      // console.log(data5, 'data5!@#$!@#$@#$!@#$!@#$!@#4123421341234');
      const exhibitAllContractIDs: {
        exhibitID: string;
        resourceID: string;
        contractIDs: string[];
      }[] = data_AllPresentables.map((d5: any) => {
        return d5.resolveResources?.map((resvr: any) => {
          return {
            exhibitID: d5.presentableId,
            resourceID: resvr.resourceId,
            contractIDs: resvr.contracts.map((cccc: any) => {
              return cccc.contractId;
            }),
            terminatedContractIDs: [],
          };
        });
      }).flat();
      // console.log(result, 'result111122222333333');

      const policies: PolicyFullInfo_Type[] = [...data_PresentableDetails.policies];
      policies.reverse();

      policies.sort((a, b) => {
        return (a.status === 1 && b.status === 0) ? -1 : 0;
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageLoading: false,
          exhibit_BelongNode_ID: data_PresentableDetails.nodeId,
          exhibit_BelongNode_Name: data_NodeDetails.nodeName,
          exhibit_BelongNode_ActiveThemeId: data_NodeDetails.nodeThemeId,
          exhibit_ID: data_PresentableDetails.presentableId,
          exhibit_Name: data_PresentableDetails.presentableName,
          exhibit_Online: data_PresentableDetails.onlineStatus === 1,
          exhibit_IsAuth: data_ExhibitBatchAuthResults[0].isAuth,
          // exhibit_AuthErrorText: data_ExhibitBatchAuthResults[0].error,
          exhibit_AuthErrorText: data_ExhibitBatchAuthResults[0].defaulterIdentityType === 1
            ? FI18n.i18nNext.t('alert_exhibit_auth_abnormal')
            : data_ExhibitBatchAuthResults[0].defaulterIdentityType === 2
              ? FI18n.i18nNext.t('alert_exhibit_no_auth')
              : '',
          policy_List: policies,

          contract_ExhibitAllContractIDs: exhibitAllContractIDs,
          contract_SelectedAssociatedID: result_ContractAssociated.some((rr) => {
            return rr.resourceId === exhibitInfoPage.contract_SelectedAssociatedID;
          }) ? exhibitInfoPage.contract_SelectedAssociatedID : result_ContractAssociated[0].resourceId,
          contract_Associated: result_ContractAssociated
            .map<ExhibitInfoPageModelState['contract_Associated'][number]>((r, index) => {
              const exhibits = data_AllPresentables.filter((d5: any) => {
                return d5.resolveResources.some((rr: any) => {
                  return d5.presentableId !== data_PresentableDetails.presentableId && rr.resourceId === r.resourceId;
                });
              }).map((d5: any) => {
                return {
                  id: d5.presentableId,
                  name: d5.presentableName,
                  // policyId: d5.
                  status: d5.onlineStatus,
                };
              });
              // console.log(r, 'r90ieeojflksdjflskdjflsdkjflsdkj');
              // console.log(r, 'rrrrr09234j5rlkjsdflkfjsldfjl');
              return {
                id: r.resourceId,
                name: r.resourceName,
                type: r.resourceType,
                exhibits: exhibits,
                state: r.status === 1 ? 'online' : 'offline',
                error: r.status === 0
                  ? 'unreleased'
                  : r.status === 2
                    ? 'freeze'
                    : r.status === 4
                      ? 'offline'
                      : '',
                warning: '',
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
                terminatedContractIDs: r.terminatedContractIDs,
                policies: r.status === 1 ? r.policies
                  .filter((p) => {
                    // console.log(p, 'p90234');
                    return p.status === 1;
                  }) : [],
              };
            }),

          side_ExhibitCover: data_PresentableDetails.coverImages[0] || '',
          side_ExhibitTitle: data_PresentableDetails.presentableTitle,
          side_ExhibitTags: data_PresentableDetails.tags,

          side_AllVersions: data_ResourceInfo.resourceVersions.map((d2: any) => d2.version),
          side_Version: data_PresentableDetails.version,

          side_BaseAttrs: [
            ...Object.entries(data_PresentableDetails.resourceSystemProperty).map((s: any) => ({
              key: s[0],
              value: fileAttrUnits[s[0]] ? fileAttrUnits[s[0]](s[1]) : s[1],
            })),
            ...data_PresentableDetails.resourceCustomPropertyDescriptors
              .filter((rd: any) => rd.type === 'readonlyText')
              .map((rd: any) => ({
                key: rd.key,
                value: rd.defaultValue,
              })),
          ],
          side_InheritOptions: (data_PresentableDetails.resourceCustomPropertyDescriptors as any[])
            .filter((rd: any) => rd.type !== 'readonlyText')
            .map<ExhibitInfoPageModelState['side_InheritOptions'][number]>((rd: any) => {
              const prp = data_PresentableDetails.presentableRewriteProperty.find((pr: any) => pr.key === rd.key);
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
          side_CustomOptions: (data_PresentableDetails.presentableRewriteProperty as any[])
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

          side_ResourceID: data_ResourceInfo.resourceId,
          side_ResourceName: data_ResourceInfo.resourceName,
          side_ResourceType: data_ResourceInfo.resourceType,
          side_ResourceCover: data_ResourceInfo.coverImages[0] || '',
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
      const res: {
        ret: number;
        errCode: number;
        msg: string;
      } = yield call(FServiceAPI.Exhibit.updatePresentable, params);

      if (res.ret !== 0 || res.errCode !== 0) {
        fMessage(res.msg, 'error');
        return;
      }

      FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.onlineSwitch', {
        value: true,
        effectiveImmediately: true,
        onlyNullish: true,
      });

      setTimeout(() => {
        FComponentsLib.fSetHotspotTooltipVisible('exhibitDetailPage.onlineSwitch', {
          value: false,
          effectiveImmediately: false,
          onlyNullish: false,
        });
      });

      if (!exhibitInfoPage.exhibit_Online && !exhibitInfoPage.side_ResourceType.includes('主题')) {
        const online: boolean = yield call(fPromiseModalConfirm, {
          title: '展品待上架',
          description: '将展品上架开放授权，为你带来更多收益',
          okText: '立即上架',
          cancelText: '暂不上架',
        });

        if (online) {
          const params2: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
            presentableId: exhibitInfoPage.exhibit_ID,
            onlineStatus: 1,
          };
          yield call(FServiceAPI.Exhibit.presentablesOnlineStatus, params2);
        }
      }

      // const params2: Parameters<typeof FServiceAPI.Exhibit.presentablesOnlineStatus>[0] = {
      //   presentableId: exhibitInfoPage.exhibit_ID,
      //   onlineStatus: 0,
      // };
      // await FServiceAPI.Exhibit.presentablesOnlineStatus(params2);

      const params1: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        isLoadCustomPropertyDescriptors: 1,
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };

      const { data: data_PresentableDetails } = yield call(FServiceAPI.Exhibit.presentableDetails, params1);

      const policies: PolicyFullInfo_Type[] = [...data_PresentableDetails.policies];
      policies.reverse();

      policies.sort((a, b) => {
        return (a.status === 1 && b.status === 0) ? -1 : 0;
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          policy_List: policies,
          exhibit_Online: data_PresentableDetails.onlineStatus === 1,
        },
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
      // yield put<FetchInfoAction>({
      //   type: 'fetchInfo',
      // });

      const params1: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        isLoadCustomPropertyDescriptors: 1,
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };

      const { data: data_PresentableDetails } = yield call(FServiceAPI.Exhibit.presentableDetails, params1);

      const policies: PolicyFullInfo_Type[] = [...data_PresentableDetails.policies];
      policies.reverse();

      policies.sort((a, b) => {
        return (a.status === 1 && b.status === 0) ? -1 : 0;
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          policy_List: policies,
        },
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
        fMessage(exhibitInfoPage.side_ResourceType.includes('主题') ? '激活失败' : '上线失败', 'error');
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

      // const resource = exhibitInfoPage.contract_Associated.find((a) => a.id === payload.resourceId);
      // console.log(resource, '$#@$#$@#');

      const params1: HandleFinalResolveResourceParams = {
        exhibitID: exhibitInfoPage.exhibit_ID,
        resourceID: payload.resourceId,
        policyID: payload.policyId,
        isUsed: true,
      };

      const resolveResources: HandleFinalResolveResourceReturn = yield call(handleFinalResolveResource, params1);

      const params: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: exhibitInfoPage.exhibit_ID,
        resolveResources: resolveResources,
      };

      // console.log(params, 'params2093uiksdjflsdkjl');
      const { data, ret, errCode, msg } = yield call(FServiceAPI.Exhibit.updatePresentable, params);
      if (ret !== 0 || errCode !== 0) {
        fMessage(msg, 'error');
        return;
      }
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

      const params3: HandleFinalResolveResourceParams = payload;

      const resolveResources: HandleFinalResolveResourceReturn = yield call(handleFinalResolveResource, params3);

      const params2: Parameters<typeof FServiceAPI.Exhibit.updatePresentable>[0] = {
        presentableId: payload.exhibitID,
        resolveResources: resolveResources,
      };
      // console.log(params2, 'params2!@!@#$@!#$!@#$');

      // console.log(params2, 'params2234234234234');

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
      call,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      const side_InheritOptions: ExhibitInfoPageModelState['side_InheritOptions'] = exhibitInfoPage.side_InheritOptions.map((io, i) => {
        if (i !== payload.index) {
          return io;
        }
        return {
          ...io,
          value: io.resetValue,
          valueInput: io.resetValue,
          valueInputError: '',
        };
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_InheritOptions: side_InheritOptions,
        },
      });

      const params: UpdateRewriteParams = {
        exhibit_ID: exhibitInfoPage.exhibit_ID,
        side_InheritOptions: side_InheritOptions,
        side_CustomOptions: exhibitInfoPage.side_CustomOptions,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(updateRewrite, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已重置');
      // yield put<UpdateRewriteAction>({
      //   type: 'updateRewrite',
      // });
    },
    * onChange_Side_InheritOptions_ValueInput({ payload }: OnChange_Side_InheritOptions_ValueInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      const side_InheritOptions: ExhibitInfoPageModelState['side_InheritOptions'] = exhibitInfoPage.side_InheritOptions.map((io, i) => {
        if (i !== payload.index) {
          return io;
        }
        return {
          ...io,
          valueInput: payload.value,
        };
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_InheritOptions: side_InheritOptions,
        },
      });
    },
    * onBlur_Side_InheritOptions_ValueInput({ payload }: OnBlur_Side_InheritOptions_ValueInput_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      // (value.length > 30 || value === '') ? '1~30个字符' : ''
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      let currentHasError: boolean = false;
      const side_InheritOptions: ExhibitInfoPageModelState['side_InheritOptions'] = exhibitInfoPage.side_InheritOptions.map((io, i) => {
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
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_InheritOptions: side_InheritOptions,
        },
      });

      if (currentHasError) {
        return;
        // yield put<UpdateRewriteAction>({
        //   type: 'updateRewrite',
        // });
      }

      const params: UpdateRewriteParams = {
        exhibit_ID: exhibitInfoPage.exhibit_ID,
        side_InheritOptions: side_InheritOptions,
        side_CustomOptions: exhibitInfoPage.side_CustomOptions,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(updateRewrite, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已更新');
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
      call,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      const side_CustomOptions: ExhibitInfoPageModelState['side_CustomOptions'] = exhibitInfoPage.side_CustomOptions.filter((_, i) => {
        return i !== payload.index;
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: side_CustomOptions,
        },
      });

      // yield put<UpdateRewriteAction>({
      //   type: 'updateRewrite',
      // });

      const params: UpdateRewriteParams = {
        exhibit_ID: exhibitInfoPage.exhibit_ID,
        side_InheritOptions: exhibitInfoPage.side_InheritOptions,
        side_CustomOptions: side_CustomOptions,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(updateRewrite, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已删除');
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
      call,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      let currentHasError: boolean = false;
      const side_CustomOptions: ExhibitInfoPageModelState['side_CustomOptions'] = exhibitInfoPage.side_CustomOptions.map((co, i) => {
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
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: side_CustomOptions,
        },
      });
      if (currentHasError) {
        return;
      }

      const params: UpdateRewriteParams = {
        exhibit_ID: exhibitInfoPage.exhibit_ID,
        side_InheritOptions: exhibitInfoPage.side_InheritOptions,
        side_CustomOptions: side_CustomOptions,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(updateRewrite, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已更新');

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
      call,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));

      const side_CustomOptions: ExhibitInfoPageModelState['side_CustomOptions'] = [
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
      ];

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: side_CustomOptions,
          side_CustomOptionsDrawer_Visible: false,
        },
      });

      // yield put<UpdateRewriteAction>({
      //   type: 'updateRewrite',
      // });

      const params: UpdateRewriteParams = {
        exhibit_ID: exhibitInfoPage.exhibit_ID,
        side_InheritOptions: exhibitInfoPage.side_InheritOptions,
        side_CustomOptions: side_CustomOptions,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(updateRewrite, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已添加');
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
      call,
      put,
    }: EffectsCommandMap) {
      const { exhibitInfoPage }: ConnectState = yield select(({ exhibitInfoPage }: ConnectState) => ({
        exhibitInfoPage,
      }));
      const side_CustomOptions: ExhibitInfoPageModelState['side_CustomOptions'] = exhibitInfoPage.side_CustomOptions.map((co) => {
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
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptions: side_CustomOptions,
          side_CustomOptionDrawer_Visible: false,
          side_CustomOptionDrawer_DataSource: null,
        },
      });

      const params: UpdateRewriteParams = {
        exhibit_ID: exhibitInfoPage.exhibit_ID,
        side_InheritOptions: exhibitInfoPage.side_InheritOptions,
        side_CustomOptions: side_CustomOptions,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(updateRewrite, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已更新');
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
  resourceType: string[];
  status: 0 | 1 | 2 | 4;
  contracts: {
    contractId: string;
    contractName: string;
    createDate: string
    policyText: string
    status: 'active' | 'testActive' | 'inactive' | 'terminal';
    policyId: string;
  }[];
  terminatedContractIDs: string[];
  policies: PolicyFullInfo_Type[];
}[];

export async function handleRelation(params: HandleRelationParams, nodeID: number): Promise<HandleRelationResult> {

  const resourceIds: string[] = params.map((r) => r.resourceId);

  const allContracts = await getAllContracts({
    nodeID,
    resourceIDs: resourceIds,
  });

  const params0: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
    resourceIds: resourceIds.join(','),
    isLoadPolicyInfo: 1,
    isTranslate: 1,
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
          status: contract.status === 1 ? 'terminal' : (contract.authStatus === 1 || contract.authStatus === 3) ? 'active' : contract.authStatus === 2 ? 'testActive' : 'inactive',
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
      terminatedContractIDs: allContracts
        .filter((acts: any) => {
          return acts.licensorId === resource.resourceId && acts.status === 1;
        })
        .map((acts: any) => {
          return acts.contractId;
        }),
      policies: resource.policies
        // .filter((p: any) => {
        //   return !allContracts
        //     .some((act: any) => {
        //       // console.log(p, act, '!@#$!@#$!@#$!@#$!@#$!@#$!@#$');
        //       return act.licensorId === resource.resourceId && act.policyId === p.policyId;
        //     });
        // })
        .filter((p: any) => {
          // console.log(p, 'PPPpppPPPPppPPPPpppPPP');
          return p.status === 1 && !allContractsUsedPolicyIDs.includes(p.policyId);
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

export async function getAllContracts({
                                        nodeID,
                                        resourceIDs,
                                      }: GetAllContractsParamsType): Promise<GetAllContractsReturnType> {
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

type HandleFinalResolveResourceReturn = {
  resourceId: string,
  contracts: {
    policyId: string
  }[];
}[];

async function handleFinalResolveResource({
                                            exhibitID,
                                            resourceID,
                                            policyID,
                                            isUsed,
                                          }: HandleFinalResolveResourceParams): Promise<HandleFinalResolveResourceReturn> {

  // console.log(exhibitID, 'exhibitID333333');
  // console.log(resourceID, 'resourceID3232423423423');
  // console.log(policyID, 'policyID234234234');
  // console.log(isUsed, 'isUsed0239j32lkl');

  const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
    presentableId: exhibitID,
  };

  const { data } = await FServiceAPI.Exhibit.presentableDetails(params);
  // console.log(data, 'data2903jsaldfksjd');
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
    const policyIDs: string[] = isUsed ? [
      ...rrs.contracts.map((cccttt: any) => {
        return cccttt.policyId;
      }),
      policyID,
    ] : rrs.contracts
      .filter((ccc: any) => {
        return ccc.policyId !== policyID;
      })
      .map((cccttt: any) => {
        return cccttt.policyId;
      });
    // console.log(policyIDs, 'policyIDs@@@#$234234234234');
    return {
      resourceId: rrs.resourceId,
      contracts: Array.from(new Set(policyIDs))
        .map((pID) => {
          return {
            policyId: pID,
          };
        }),
    };
  });
}

interface UpdateRewriteParams {
  exhibit_ID: string;
  side_InheritOptions: ExhibitInfoPageModelState['side_InheritOptions'];
  side_CustomOptions: ExhibitInfoPageModelState['side_CustomOptions'];
}

async function updateRewrite({
                               exhibit_ID,
                               side_InheritOptions,
                               side_CustomOptions,
                             }: UpdateRewriteParams): Promise<any> {
  const params: Parameters<typeof FServiceAPI.Exhibit.updateRewriteProperty>[0] = {
    presentableId: exhibit_ID,
    rewriteProperty: [
      ...side_InheritOptions
        .map((io) => {
          return {
            key: io.key,
            value: io.value,
            remark: io.description,
          };
        }),
      ...side_CustomOptions
        .map((io) => {
          return {
            key: io.key,
            value: io.value,
            remark: io.description,
          };
        }),
    ],
  };
  return FServiceAPI.Exhibit.updateRewriteProperty(params);
}
