import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState, ExhibitInfoPageModelState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import FUtil1 from '@/utils';
import { FCustomOptionsEditorDrawerStates } from '@/components/FCustomOptionsEditorDrawer';
import { handleExhibitRelationGraphData } from '@/components/FAntvG6/FAntvG6RelationshipGraph';
import { handleAuthorizationGraphData } from '@/components/FAntvG6/FAntvG6AuthorizationGraph';

const { decompile, compile } = require('@freelog/nmr_translator');

interface ICandidate {
  name: string;
  versionRange: string;
  type: 'resource' | 'object';
}

export interface InformExhibitInfoPageModelState {

  pageLoading: boolean;

  node_ID: number;
  node_Name: string;
  node_RuleText: string;
  node_RuleResult: any;
  node_MappingRule: {
    add?: {
      exhibit: string;
      source: {
        type: 'resource' | 'object';
        name: string;
        version?: string;
      };
    };
    alter?: string;
    active?: string;
    version?: string;
    cover?: string;
    title?: string;
    online?: boolean;
    offline?: boolean;
    labels?: string[];
    replaces?: {
      replaced: ICandidate;
      replacer: ICandidate;
      scopes?: ICandidate[][];
    }[];
    attrs?: {
      type: 'add' | 'delete',
      theKey: string;
      value?: string;
      description?: string;
    }[];
  } | null;

  exhibit_ID: string;
  exhibit_Name: string;
  exhibit_Identity: 'exhibit' | 'resource' | 'object';
  exhibit_ResourceType: string;
  exhibit_RuleResult: any;
  exhibit_RuleID: string;
  exhibit_OnlineSwitchObj: {
    checked: boolean;
    text: string;
    disabled: boolean;
  } | null;

  contract_Associated: {
    selected: boolean;
    id: string;
    name: string;
    type: string;
    contracts: {
      name: string;
      status: 0 | 1 | 2;
      id: string;
      text: string;
      createTime: string;
      policyId: string;
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

  side_Exhibit_Cover: string;
  side_Exhibit_Title: string;
  side_Exhibit_InputTitle: string | null;
  side_Exhibit_Tags: string[];
  side_Exhibit_AllVersions: string[];
  side_Exhibit_Version: string;
  side_Exhibit_OnlyReadAttrs: {
    theKey: string;
    value: string;
  }[];
  side_Exhibit_OnlyEditAttrs: {
    theKey: string;
    theValue: string;
    theValueError: string;
    remark: string;
  }[];
  side_Exhibit_EditDeleteAttrs: {
    theKey: string;
    theValue: string;
    theValueError: string;
    remark: string;
  }[];
  side_CustomOptionsDrawer_Visible: boolean;
  side_CustomOptionDrawer_Visible: boolean;
  side_CustomOptionDrawer_DataSource: {
    key: string;
    value: string;
    description: string;
  } | null;

  // pCustomModalVisible: boolean;
  // pCustomModalTitle: string;
  // pCustomModalConfirmButtonDisabled: boolean;
  // pCustomMode: 'add' | 'edit';
  // pCustomKey: string;
  // pCustomKeyDisabled: boolean;
  // pCustomKeyError: string;
  // pCustomValue: string;
  // pCustomValueError: string;
  // pCustomDescription: string;
  // pCustomDescriptionError: string;

  side_Resource_Relation: {
    cardTitle: string;
    identity: 'resource' | 'object';
    id: string;
    name: string;
    type: string;
    cover: string;
    linkToDetails: string;
  } | null;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'informExhibitInfoPage/change';
  payload: Partial<InformExhibitInfoPageModelState>;
}

export interface OnPageMountAction extends AnyAction {
  type: 'informExhibitInfoPage/onPageMount';
  payload: {
    informExhibitID: string;
  };
}

export interface OnPageUnmountAction extends AnyAction {
  type: 'informExhibitInfoPage/onPageUnmount';
}

export interface OnOnlineSwitchChangeAction extends AnyAction {
  type: 'informExhibitInfoPage/onOnlineSwitchChange';
  payload: {
    checked: boolean;
  };
}

export interface OnChangePCoverAction extends AnyAction {
  type: 'informExhibitInfoPage/onChangePCover';
  payload: {
    value: string;
  };
}

export interface OnClickPTitleEditBtnAction extends AnyAction {
  type: 'informExhibitInfoPage/onClickPTitleEditBtn';
}

export interface OnChangePTitleInputAction extends AnyAction {
  type: 'informExhibitInfoPage/onChangePTitleInput';
  payload: {
    value: string;
  };
}

export interface OnClickPTitleConfirmBtnAction extends AnyAction {
  type: 'informExhibitInfoPage/onClickPTitleConfirmBtn';
}

export interface OnClickPTitleCancelBtnAction extends AnyAction {
  type: 'informExhibitInfoPage/onClickPTitleCancelBtn';
}

export interface OnChangePLabelsAction extends AnyAction {
  type: 'informExhibitInfoPage/onChangePLabels';
  payload: {
    value: string[];
  };
}

export interface OnChangePVersionAction extends AnyAction {
  type: 'informExhibitInfoPage/onChangePVersion';
  payload: {
    value: string;
  };
}

export interface FetchInformalExhibitInfoAction extends AnyAction {
  type: 'fetchInformalExhibitInfo' | 'informExhibitInfoPage/fetchInformalExhibitInfo';
  payload?: {
    informExhibitID?: string;
  };
}

export interface SyncRulesAction extends AnyAction {
  type: 'syncRules';
  payload: {
    cover?: string;
    labels?: string[];
    title?: string;
    attrs?: {
      operation: 'add' | 'delete';
      key: string;
      value?: string;
      description?: string;
    }[];
    online?: boolean;
    active?: boolean;
    replaces?: {
      replaced: ICandidate;
      replacer: ICandidate;
      scopes?: ICandidate[][];
    }[];
  };
}

export interface OnHandleAttrModalAction extends AnyAction {
  type: 'informExhibitInfoPage/onHandleAttrModal';
  payload: {
    type: 'add' | 'edit';
    theKey?: string;
  };
}

// export interface OnCancelHandleAttrModalAction extends AnyAction {
//   type: 'informExhibitInfoPage/onCancelHandleAttrModal';
// }

// export interface OnAttrModalChangeAction extends AnyAction {
//   type: 'informExhibitInfoPage/onAttrModalChange';
//   payload: {
//     theKey?: string;
//     value?: string;
//     remark?: string;
//   };
// }

export interface OnChangeAttrsAction extends AnyAction {
  type: 'informExhibitInfoPage/onChangeAttrs';
  payload: {
    theKey: string;
    theValue: string;
  };
}

export interface OnAttrBlurAction extends AnyAction {
  type: 'informExhibitInfoPage/onAttrBlur';
  payload: {
    theKey: string;
  };
}

// export interface OnClickAttrModalConfirmBtnAction extends AnyAction {
//   type: 'informExhibitInfoPage/onClickAttrModalConfirmBtn';
// }

export interface OnClickDeleteAttrAction extends AnyAction {
  type: 'informExhibitInfoPage/onClickDeleteAttr';
  payload: {
    theKey: string;
  };
}

export interface OnClickResetAttrAction extends AnyAction {
  type: 'informExhibitInfoPage/onClickResetAttr';
  payload: {
    theKey: string;
  };
}

export interface OnConfirm_CustomOptionsDrawer_Action extends AnyAction {
  type: 'informExhibitInfoPage/onConfirm_CustomOptionsDrawer';
  payload: {
    value: FCustomOptionsEditorDrawerStates['dataSource'];
  };
}

export interface OnCancel_CustomOptionsDrawer_Action extends AnyAction {
  type: 'informExhibitInfoPage/onCancel_CustomOptionsDrawer';
}

export interface OnConfirm_CustomOptionDrawer_Action extends AnyAction {
  type: 'informExhibitInfoPage/onConfirm_CustomOptionDrawer';
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
  type: 'informExhibitInfoPage/onCancel_CustomOptionDrawer';
}

export interface ExhibitInfoPageModelType {
  namespace: 'informExhibitInfoPage';
  state: InformExhibitInfoPageModelState;
  effects: {
    onPageMount: (action: OnPageMountAction, effects: EffectsCommandMap) => void;
    onPageUnmount: (action: OnPageUnmountAction, effects: EffectsCommandMap) => void;

    fetchInformalExhibitInfo: (action: FetchInformalExhibitInfoAction, effects: EffectsCommandMap) => void;

    syncRules: (action: SyncRulesAction, effects: EffectsCommandMap) => void;

    updateRelation: (action: UpdateRelationAction, effects: EffectsCommandMap) => void;

    onOnlineSwitchChange: (action: OnOnlineSwitchChangeAction, effects: EffectsCommandMap) => void;

    onChangePCover: (action: OnChangePCoverAction, effects: EffectsCommandMap) => void;
    onClickPTitleEditBtn: (action: OnClickPTitleEditBtnAction, effects: EffectsCommandMap) => void;
    onChangePTitleInput: (action: OnChangePTitleInputAction, effects: EffectsCommandMap) => void;
    onClickPTitleConfirmBtn: (action: OnClickPTitleConfirmBtnAction, effects: EffectsCommandMap) => void;
    onClickPTitleCancelBtn: (action: OnClickPTitleCancelBtnAction, effects: EffectsCommandMap) => void;
    onChangePLabels: (action: OnChangePLabelsAction, effects: EffectsCommandMap) => void;
    onChangePVersion: (action: OnChangePVersionAction, effects: EffectsCommandMap) => void;

    onHandleAttrModal: (action: OnHandleAttrModalAction, effects: EffectsCommandMap) => void;
    // onCancelHandleAttrModal: (action: OnCancelHandleAttrModalAction, effects: EffectsCommandMap) => void;
    // onAttrModalChange: (action: OnAttrModalChangeAction, effects: EffectsCommandMap) => void;
    onChangeAttrs: (action: OnChangeAttrsAction, effects: EffectsCommandMap) => void;
    onAttrBlur: (action: OnAttrBlurAction, effects: EffectsCommandMap) => void;
    // onClickAttrModalConfirmBtn: (action: OnClickAttrModalConfirmBtnAction, effects: EffectsCommandMap) => void;
    onClickDeleteAttr: (action: OnClickDeleteAttrAction, effects: EffectsCommandMap) => void;
    onClickResetAttr: (action: OnClickResetAttrAction, effects: EffectsCommandMap) => void;

    onConfirm_CustomOptionsDrawer: (action: OnConfirm_CustomOptionsDrawer_Action, effects: EffectsCommandMap) => void;
    onCancel_CustomOptionsDrawer: (action: OnCancel_CustomOptionsDrawer_Action, effects: EffectsCommandMap) => void;
    onConfirm_CustomOptionDrawer: (action: OnConfirm_CustomOptionDrawer_Action, effects: EffectsCommandMap) => void;
    onCancel_CustomOptionDrawer: (action: OnCancel_CustomOptionDrawer_Action, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<InformExhibitInfoPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

export interface UpdateRelationAction extends AnyAction {
  type: 'informExhibitInfoPage/updateRelation';
  payload: {
    resourceId: string;
    policyId: string;
  };
}

const initStates: InformExhibitInfoPageModelState = {
  pageLoading: true,

  node_ID: -1,
  node_Name: '',
  node_RuleText: '',
  node_RuleResult: null,
  node_MappingRule: null,

  exhibit_ID: '',
  exhibit_Name: '',
  exhibit_Identity: 'exhibit',
  exhibit_ResourceType: '',
  exhibit_RuleResult: null,
  exhibit_RuleID: '',
  exhibit_OnlineSwitchObj: null,

  contract_Associated: [],

  graph_FullScreen: false,
  graph_Viewport_Show: 'relationship',
  graph_Viewport_RelationGraph_Nodes: [],
  graph_Viewport_RelationGraph_Edges: [],
  graph_Viewport_AuthorizationGraph_Nodes: [],
  graph_Viewport_AuthorizationGraph_Edges: [],

  side_Exhibit_Cover: '',
  side_Exhibit_Title: '',
  side_Exhibit_InputTitle: null,
  side_Exhibit_Tags: [],
  side_Exhibit_AllVersions: [],
  side_Exhibit_Version: '',
  side_Exhibit_OnlyReadAttrs: [],
  side_Exhibit_OnlyEditAttrs: [],
  side_Exhibit_EditDeleteAttrs: [],
  side_CustomOptionsDrawer_Visible: false,
  side_CustomOptionDrawer_Visible: false,
  side_CustomOptionDrawer_DataSource: null,

  // pCustomModalVisible: false,
  // pCustomModalTitle: '',
  // pCustomModalConfirmButtonDisabled: false,
  // pCustomMode: 'add',
  // pCustomKey: '',
  // pCustomKeyDisabled: false,
  // pCustomKeyError: '',
  // pCustomValue: '',
  // pCustomValueError: '',
  // pCustomDescription: '',
  // pCustomDescriptionError: '',

  side_Resource_Relation: null,
};

const Model: ExhibitInfoPageModelType = {
  namespace: 'informExhibitInfoPage',
  state: initStates,

  effects: {
    * onPageMount({ payload }: OnPageMountAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          exhibit_ID: payload.informExhibitID,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
        payload: {
          informExhibitID: payload.informExhibitID,
        },
      });
    },
    * onPageUnmount({}: OnPageUnmountAction, {}: EffectsCommandMap) {

    },
    * fetchInformalExhibitInfo({ payload }: FetchInformalExhibitInfoAction, { call, select, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const informExhibitID: string = payload?.informExhibitID !== undefined ? payload.informExhibitID : informExhibitInfoPage.exhibit_ID;

      const params: Parameters<typeof FServiceAPI.InformalNode.testResourceDetails>[0] = {
        testResourceId: informExhibitID,
      };
      const { data } = yield call(FServiceAPI.InformalNode.testResourceDetails, params);

      // console.log(data, '#######32409jkldfsmdslkdsf||||||||');

      const params4: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: data.nodeId,
      };

      const { data: data4 } = yield call(FServiceAPI.Node.details, params4);
      // console.log(data4, 'data41234234123423412341234');

      let result: HandleRelationResult = [];
      let relation: InformExhibitInfoPageModelState['side_Resource_Relation'] = null;

      const actualOriginInfo = data.stateInfo.replaceInfo.rootResourceReplacer || data.originInfo;

      if (actualOriginInfo.type === 'resource') {
        result = yield call(handleRelation, data.resolveResources);

        const params2: Parameters<typeof FServiceAPI.Resource.info>[0] = {
          resourceIdOrName: actualOriginInfo.id,
        };

        const { data: data2 } = yield call(FServiceAPI.Resource.info, params2);
        // console.log(data2, 'data2!@#$@#$@#$3432444444');

        relation = {
          cardTitle: '关联资源',
          identity: 'resource',
          id: data2.resourceId,
          name: data2.resourceName,
          type: data2.resourceType,
          cover: data2.coverImages[0],
          linkToDetails: FUtil.LinkTo.resourceDetails({
            resourceID: data2.resourceId,
          }),
        };
      } else {
        const params3: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
          objectIdOrName: actualOriginInfo.id,
        };

        const { data: data3 } = yield call(FServiceAPI.Storage.objectDetails, params3);
        // console.log(data3, '!@#$!@#$234213423142134234');
        relation = {
          cardTitle: '关联对象',
          identity: 'object',
          id: data3.objectId,
          name: data3.bucketName + '/' + data3.objectName,
          type: data3.resourceType,
          cover: '',
          linkToDetails: FUtil.LinkTo.objectDetails({
            bucketName: data3.bucketName,
            objectID: data3.objectId,
          }),
        };

      }

      const selectedID = informExhibitInfoPage.contract_Associated.find((a) => a.selected)?.id;

      // console.log(data, 'data@!!!!!!!!1111');
      const isChecked: boolean = data.resourceType === 'theme' ? data.stateInfo.themeInfo.isActivatedTheme === 1 : data.stateInfo.onlineStatusInfo.onlineStatus === 1;
      const isDisabled: boolean = data.resourceType === 'theme' && isChecked;

      // // 关系树数据
      // const params6: Parameters<typeof FServiceAPI.Exhibit.relationTree>[0] = {
      //   presentableId: data.presentableId,
      // };
      //
      // const { data: data6 } = yield call(FServiceAPI.Exhibit.relationTree, params6);
      // // console.log(data, 'datadatadatadatadatadatadata');
      // // console.log(data6, 'DDDDDD!!@#$@!#$!@#$@#$6666');
      //
      // const {
      //   nodes: relationGraphNodes,
      //   edges: relationGraphEdges,
      // } = yield call(handleExhibitRelationGraphData, data6, {
      //   nodeId: data.nodeId,
      //   nodeName: data3.nodeName,
      //   exhibitId: data.presentableId,
      //   exhibitName: data.presentableName,
      // });
      //
      // // console.log(relationGraphNodes, relationGraphEdges, '@#$!@#$!@#$!2341234123421342134134');
      //
      // // 授权树数据
      // const params4: Parameters<typeof FServiceAPI.Exhibit.authTree>[0] = {
      //   presentableId: exhibitInfoPage.exhibit_ID,
      // };
      //
      // const { data: data4 } = yield call(FServiceAPI.Exhibit.authTree, params4);
      //
      // // console.log(data4, '@@@@@#4234234324234');
      // const {
      //   nodes: authorizationGraphNodes,
      //   edges: authorizationGraphEdges,
      // } = yield call(handleAuthorizationGraphData, data4, {
      //   id: data.presentableId,
      //   nodeId: data.nodeId,
      //   nodeName: data3.nodeName,
      //   exhibitId: data.presentableId,
      //   exhibitName: data.presentableName,
      // });

      // console.log(data, 'data@#$!@#$@#$@#$234234');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageLoading: false,
          node_ID: data.nodeId,
          node_Name: data4.nodeName,
          exhibit_Identity: data.associatedPresentableId !== '' ? 'exhibit' : actualOriginInfo.type,
          exhibit_ResourceType: data.resourceType,
          exhibit_Name: data.testResourceName,
          exhibit_RuleID: data.rules.length > 0 ? data.rules[0].ruleId : '',
          exhibit_OnlineSwitchObj: {
            checked: isChecked,
            text: data.resourceType === 'theme'
              ? FUtil1.I18n.message('toggle_activate_theme')
              : FUtil1.I18n.message('btn_show_exhibit'),
            disabled: isDisabled,
          },

          side_Exhibit_Cover: data.stateInfo.coverInfo.coverImages[0] || '',
          side_Exhibit_Title: data.stateInfo.titleInfo.title || '',
          side_Exhibit_Tags: data.stateInfo.tagInfo.tags || [],
          side_Exhibit_AllVersions: [...actualOriginInfo.versions].reverse(),
          side_Exhibit_Version: actualOriginInfo.version,
          side_Exhibit_OnlyReadAttrs: (data.stateInfo.propertyInfo.testResourceProperty as any[])
            .filter((cr: any) => {
              return cr.authority === 1;
            })
            .map<InformExhibitInfoPageModelState['side_Exhibit_OnlyReadAttrs'][number]>((cr: any) => {
              return {
                theKey: cr.key,
                value: cr.key === 'fileSize' ? FUtil.Format.humanizeSize(cr.value) : cr.value,
              };
            }),
          side_Exhibit_OnlyEditAttrs: (data.stateInfo.propertyInfo.testResourceProperty as any[])
            .filter((cr: any) => {
              return cr.authority === 2;
            })
            .map<InformExhibitInfoPageModelState['side_Exhibit_OnlyEditAttrs'][number]>((cr: any) => {
              // console.log(cr, 'cr!!@#$!@#$!@#$!@#$!@#$');
              return {
                theKey: cr.key,
                theValue: cr.value,
                theValueError: '',
                remark: cr.remark,
              };
            }),
          side_Exhibit_EditDeleteAttrs: (data.stateInfo.propertyInfo.testResourceProperty as any[])
            .filter((cr: any) => {
              return cr.authority === 6;
            })
            .map<InformExhibitInfoPageModelState['side_Exhibit_EditDeleteAttrs'][number]>((cr: any) => {
              return {
                theKey: cr.key,
                theValue: cr.value,
                theValueError: '',
                remark: cr.remark,
              };
            }),
          contract_Associated: result.map<InformExhibitInfoPageModelState['contract_Associated'][number]>((r, index) => {
            return {
              selected: selectedID ? selectedID === r.resourceId : index === 0,
              id: r.resourceId,
              name: r.resourceName,
              type: r.resourceType,
              contracts: r.contracts.map((c) => ({
                name: c.contractName,
                // status: c.status,
                status: c.status,
                id: c.contractId,
                text: c.policyText,
                createTime: FUtil.Format.formatDateTime(c.createDate),
                policyId: c.policyId,
              })),
              policies: r.policies.map((p) => ({
                id: p.policyId,
                name: p.policyName,
                text: p.policyText,
              })),
            };
          }),
          side_Resource_Relation: relation,
        },
      });

      const params2: RuleMatchStatusParams = {
        nodeID: data.nodeId,
        isRematch: false,
      };

      const { data: data2 } = yield call(ruleMatchStatus, params2);
      // console.log(data2, '##@#$@#$@#!!!!!!!!!1234');

      const currentRule = data2.testRules.find((ro: any) => {
        return ro.id === data.rules[0]?.ruleId;
      });

      const eRule = currentRule?.ruleInfo ? {
        add: currentRule.ruleInfo.operation === 'add' ? {
          exhibit: currentRule.ruleInfo.exhibitName,
          source: {
            name: currentRule.ruleInfo.candidate.name,
            type: currentRule.ruleInfo.candidate.type,
            versionRange: (currentRule.ruleInfo.candidate.versionRange && currentRule.ruleInfo.candidate.versionRange !== 'latest')
              ? currentRule.ruleInfo.candidate.versionRange
              : undefined,
          },
        } : undefined,
        alter: currentRule.ruleInfo.operation === 'alter' ? currentRule.ruleInfo.exhibitName : undefined,
        cover: currentRule.ruleInfo.cover,
        title: currentRule.ruleInfo.title,
        online: currentRule.ruleInfo.online === true,
        offline: currentRule.ruleInfo.online === false,
        labels: currentRule.ruleInfo.labels,
        replaces: currentRule.ruleInfo.replaces,
        attrs: currentRule.ruleInfo.attrs?.map((a: any) => {
          return {
            type: a.operation,
            theKey: a.key,
            value: a.value,
            description: a.description,
          };
        }),
      } : {};

      const tRule = {
        active: data.stateInfo.themeInfo.ruleId !== 'default' ? data.testResourceName : undefined,
      };

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_MappingRule: {
            ...eRule,
            ...tRule,
          },
          node_RuleText: data2.ruleText,
          node_RuleResult: data2.testRules,
          exhibit_RuleResult: data.rules.length > 0 ? data2.testRules.find((tr: any) => {
            return tr.id === data.rules[0].ruleId;
          }) : null,
        },
      });
    },
    * syncRules({ payload }: SyncRulesAction, { select, call, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const params2: RuleMatchStatusParams = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: false,
      };

      const { data: data1 } = yield call(ruleMatchStatus, params2);

      // const {rules} = compile(data1.ruleText);
      const rules = informExhibitInfoPage.node_RuleResult.map((rr: any) => {
        return rr.ruleInfo;
      });

      let newRulesObj;

      if (payload.active !== undefined) {
        newRulesObj = rules.filter((r: any) => {
          return r.operation !== 'activate_theme';
        });

        if (payload.active) {
          newRulesObj = [
            {
              operation: 'activate_theme',
              themeName: informExhibitInfoPage.exhibit_Name,
            },
            ...newRulesObj,
          ];
        }
        // console.log(rules1, 'rules1!Q@#RFcdios89joe');
      } else {
        const currentRule = rules.find((ro: any) => {
          return ro.exhibitName === informExhibitInfoPage.exhibit_Name;
        });

        if (currentRule) {
          newRulesObj = rules.map((ro: any) => {
            if (ro.exhibitName !== informExhibitInfoPage.exhibit_Name) {
              return ro;
            }
            return {
              ...ro,
              ...payload,
            };
          });
        } else {
          newRulesObj = [
            {
              operation: 'alter',
              exhibitName: informExhibitInfoPage.exhibit_Name,
              ...payload,
            },
            ...rules,
          ];
        }
      }

      // console.log(newRulesObj, 'newRulesObj908231jldsaF@#)_*()UJLK');
      const text = decompile(newRulesObj);
      // console.log(text, 'newRulesObj90ij32.dsfsdf');

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      // console.log(params, 'paramsparams!!@#$!@#$');
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);
      // console.log(data, 'data!!@#$@#$');

      yield call(sleep, 300);

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },
    * updateRelation({ payload }: UpdateRelationAction, { select, call, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));
      const resource = informExhibitInfoPage.contract_Associated.find((a) => a.id === payload.resourceId);
      // console.log(resource, '$#@$#$@#+++++++++++');
      // if (resource?.contracts && resource?.contracts.length > 0) {
      const params: Parameters<typeof FServiceAPI.InformalNode.updateTestResourceContracts>[0] = {
        // presentableId: informExhibitInfoPage?.presentableId || '',
        testResourceId: informExhibitInfoPage.exhibit_ID,
        resolveResources: [
          {
            resourceId: resource?.id || '',
            contracts: [
              ...(resource?.contracts || []).map((c) => ({ policyId: c.policyId })),
              { policyId: payload.policyId },
            ],
          },
        ],
      };
      yield call(FServiceAPI.InformalNode.updateTestResourceContracts, params);
      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },
    * onOnlineSwitchChange({ payload }: OnOnlineSwitchChangeAction, { put, select }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      if (informExhibitInfoPage.exhibit_ResourceType === 'theme') {
        yield put<SyncRulesAction>({
          type: 'syncRules',
          payload: {
            active: payload.checked,
          },
        });
      } else {
        yield put<SyncRulesAction>({
          type: 'syncRules',
          payload: {
            online: payload.checked,
          },
        });
      }
    },

    * onChangePCover({ payload }: OnChangePCoverAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: { side_Exhibit_Cover: payload.value },
      });
      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          cover: payload.value,
        },
      });
    },
    * onClickPTitleEditBtn({}: OnClickPTitleEditBtnAction, { put, select }: EffectsCommandMap) {

      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: { side_Exhibit_Title: informExhibitInfoPage.side_Exhibit_Title },
      });
    },

    * onChangePTitleInput({ payload }: OnChangePTitleInputAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_Exhibit_InputTitle: payload.value,
        },
      });
    },
    * onClickPTitleConfirmBtn({}: OnClickPTitleConfirmBtnAction, { put, select }: EffectsCommandMap) {

      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const pInputTitle: string = informExhibitInfoPage.side_Exhibit_InputTitle || '';

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_Exhibit_Title: pInputTitle,
          side_Exhibit_InputTitle: null,
        },
      });

      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          title: pInputTitle,
        },
      });
    },
    * onClickPTitleCancelBtn({}: OnClickPTitleCancelBtnAction, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_Exhibit_InputTitle: null,
        },
      });

    },
    * onChangePLabels({ payload }: OnChangePLabelsAction, { put }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_Exhibit_Tags: payload.value,
        },
      });
      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          labels: payload.value,
        },
      });
    },
    * onChangePVersion({ payload }: OnChangePVersionAction, { select, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      // console.log(payload, 'payloadpayloadpayloadpayload2214111111');

      const replace: {
        replaced: ICandidate;
        replacer: ICandidate;
        scopes?: ICandidate[][];
      }[] = [
        ...(informExhibitInfoPage.exhibit_RuleResult?.ruleInfo?.replaces || []).filter((r: any) => {
          console.log(r, 'r!@#$!@#$!@!11RRRRRRRRR');
          const replacer = r.replacer;
          const replaced = r.replaced;
          return !(replaced.name === informExhibitInfoPage.side_Resource_Relation?.name
            && replaced.versionRange === '*'
            && replaced.type === informExhibitInfoPage.side_Resource_Relation?.identity
            && replacer.name === informExhibitInfoPage.side_Resource_Relation?.name
            && replacer.type === informExhibitInfoPage.side_Resource_Relation?.identity
            && !r.scopes);
        }),
        {
          replacer: {
            name: informExhibitInfoPage.side_Resource_Relation?.name,
            versionRange: payload.value,
            type: informExhibitInfoPage.side_Resource_Relation?.identity,
          },
          replaced: {
            name: informExhibitInfoPage.side_Resource_Relation?.name,
            versionRange: '*',
            type: informExhibitInfoPage.side_Resource_Relation?.identity,
          },
        },
      ];
      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          replaces: replace,
        },
      });
    },

    * onHandleAttrModal({ payload }: OnHandleAttrModalAction, { select, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      if (payload.type === 'add') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            side_CustomOptionsDrawer_Visible: true,
            // pCustomModalVisible: true,
            // pCustomModalTitle: '添加自定义选项',
            // pCustomModalConfirmButtonDisabled: true,
            // pCustomMode: 'add',
            // pCustomKey: '',
            // pCustomKeyDisabled: false,
            // pCustomKeyError: '',
            // pCustomValue: '',
            // pCustomValueError: '',
            // pCustomDescription: '',
            // pCustomDescriptionError: '',
          },
        });
      } else {
        const attrT = informExhibitInfoPage.side_Exhibit_EditDeleteAttrs.find((ea) => {
          return ea.theKey === payload.theKey;
        });
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            side_CustomOptionDrawer_Visible: true,
            side_CustomOptionDrawer_DataSource: {
              key: attrT?.theKey || '',
              value: attrT?.theValue || '',
              description: attrT?.remark || '',
            },
            // pCustomModalVisible: true,
            // pCustomModalTitle: '编辑自定义选项',
            // pCustomModalConfirmButtonDisabled: true,
            // pCustomMode: 'edit',
            // pCustomKey: attrT?.theKey || '',
            // pCustomKeyDisabled: true,
            // pCustomKeyError: '',
            // pCustomValue: attrT?.theValue || '',
            // pCustomValueError: '',
            // pCustomDescription: attrT?.remark || '',
            // pCustomDescriptionError: '',
          },
        });
      }
    },
    // * onCancelHandleAttrModal({}: OnCancelHandleAttrModalAction, { put }: EffectsCommandMap) {
    //   yield put<ChangeAction>({
    //     type: 'change',
    //     payload: {
    //       pCustomModalVisible: false,
    //       pCustomModalTitle: '',
    //       pCustomModalConfirmButtonDisabled: false,
    //       pCustomMode: 'add',
    //       pCustomKey: '',
    //       pCustomKeyDisabled: false,
    //       pCustomKeyError: '',
    //       pCustomValue: '',
    //       pCustomValueError: '',
    //       pCustomDescription: '',
    //       pCustomDescriptionError: '',
    //     },
    //   });
    // },
    // * onAttrModalChange({ payload }: OnAttrModalChangeAction, { select, put, call }: EffectsCommandMap) {
    //   const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
    //     informExhibitInfoPage,
    //   }));
    //
    //   if (payload.theKey !== undefined) {
    //     const valueText: string = payload.theKey;
    //     const customKeys: string[] = [
    //       ...informExhibitInfoPage.side_Exhibit_OnlyReadAttrs
    //         .map<string>((pc) => pc.theKey),
    //       ...informExhibitInfoPage.side_Exhibit_OnlyEditAttrs
    //         .map<string>((poe) => poe.theKey),
    //       ...informExhibitInfoPage.side_Exhibit_EditDeleteAttrs
    //         .map<string>((ped) => ped.theKey),
    //     ];
    //     let pAddCustomKeyError: string = '';
    //     if (!/^[a-zA-Z0-9_]{1,20}$/.test(valueText)) {
    //       pAddCustomKeyError = `需要符合正则^[a-zA-Z0-9_]{1,20}$`;
    //     } else if ([...customKeys].includes(valueText)) {
    //       pAddCustomKeyError = 'key不能与基础属性和其他自定义属性相同';
    //     }
    //     yield put<ChangeAction>({
    //       type: 'change',
    //       payload: {
    //         pCustomKey: valueText,
    //         pCustomKeyError: pAddCustomKeyError,
    //         pCustomModalConfirmButtonDisabled: !valueText || !!pAddCustomKeyError
    //           || !informExhibitInfoPage.pCustomValue || !!informExhibitInfoPage.pCustomValueError
    //           || !!informExhibitInfoPage.pCustomDescriptionError,
    //       },
    //     });
    //   }
    //
    //   if (payload.value !== undefined) {
    //     const valueText: string = payload.value;
    //     const textError: string = (valueText.length > 30 || payload.value === '') ? '1~30个字符' : '';
    //     yield put<ChangeAction>({
    //       type: 'change',
    //       payload: {
    //         pCustomValue: valueText,
    //         pCustomValueError: textError,
    //         pCustomModalConfirmButtonDisabled: !informExhibitInfoPage.pCustomKey || !!informExhibitInfoPage.pCustomKeyError
    //           || !valueText || !!textError
    //           || !!informExhibitInfoPage.pCustomDescriptionError,
    //       },
    //     });
    //   }
    //
    //   if (payload.remark !== undefined) {
    //     const valueText: string = payload.remark;
    //     const textError: string = (valueText.length > 50) ? '0~50个字符' : '';
    //     yield put<ChangeAction>({
    //       type: 'change',
    //       payload: {
    //         pCustomDescription: valueText,
    //         pCustomDescriptionError: textError,
    //         pCustomModalConfirmButtonDisabled: !informExhibitInfoPage.pCustomKey || !!informExhibitInfoPage.pCustomKeyError
    //           || !informExhibitInfoPage.pCustomValue || !!informExhibitInfoPage.pCustomValueError
    //           || !!textError,
    //       },
    //     });
    //   }
    // },
    * onChangeAttrs({ payload }: OnChangeAttrsAction, { select, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      // console.log(payload, 'payload1234');

      const theValue: string = payload.theValue;
      const textError: string = (theValue.length > 30 || theValue === '') ? '1~30个字符' : '';

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_Exhibit_OnlyEditAttrs: informExhibitInfoPage.side_Exhibit_OnlyEditAttrs.map<InformExhibitInfoPageModelState['side_Exhibit_OnlyEditAttrs'][number]>((poe) => {
            if (poe.theKey !== payload.theKey) {
              return poe;
            }
            return {
              ...poe,
              theValue: theValue,
              theValueError: textError,
            };
          }),
          side_Exhibit_EditDeleteAttrs: informExhibitInfoPage.side_Exhibit_EditDeleteAttrs.map<InformExhibitInfoPageModelState['side_Exhibit_EditDeleteAttrs'][0]>((ped) => {
            if (ped.theKey !== payload.theKey) {
              return ped;
            }
            return {
              ...ped,
              theValue: theValue,
              theValueError: textError,
            };
          }),
        },
      });
    },
    * onAttrBlur({ payload }: OnAttrBlurAction, { select, call, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const attr = informExhibitInfoPage.side_Exhibit_OnlyEditAttrs.find((poe) => {
        return poe.theKey === payload.theKey;
      }) || informExhibitInfoPage.side_Exhibit_EditDeleteAttrs.find((ped) => {
        return ped.theKey === payload.theKey;
      });

      // console.log(attr, 'attrattrattr!!!');

      if (attr?.theValueError) {
        return;
      }

      let theRule: any = [];

      const currentRule = informExhibitInfoPage.exhibit_RuleResult?.ruleInfo || null;

      if (currentRule) {
        const attrKeys: string[] = currentRule.attrs?.map((ar: any) => {
          return ar.key;
        }) || [];

        theRule = attrKeys.includes(payload.theKey)
          ? currentRule.attrs.map((ar1: any) => {
            if (ar1.key !== payload.theKey) {
              return ar1;
            }
            return {
              ...ar1,
              value: attr?.theValue,
              description: attr?.remark,
            };
          })
          : [
            ...currentRule.attrs,
            {
              operation: 'add',
              key: attr?.theKey,
              value: attr?.theValue,
              description: attr?.remark,
            },
          ];
      } else {
        theRule = [
          {
            operation: 'add',
            key: attr?.theKey,
            value: attr?.theValue,
            description: attr?.remark,
          },
        ];
      }

      // console.log(theRule, 'TTTTTTtttttt');

      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          attrs: theRule,
        },
      });

    },
    // * onClickAttrModalConfirmBtn({}: OnClickAttrModalConfirmBtnAction, { select, put }: EffectsCommandMap) {
    //   const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
    //     informExhibitInfoPage,
    //   }));
    //
    //   const attrs = informExhibitInfoPage.currentRuleResult?.ruleInfo.attrs;
    //
    //   // console.log(attrs, 'rules!!!!!!!');
    //
    //   let newAttrs = attrs.filter((rl: any) => {
    //     return rl.key !== informExhibitInfoPage.pCustomKey;
    //   });
    //
    //   newAttrs = [
    //     {
    //       operation: 'add',
    //       key: informExhibitInfoPage.pCustomKey,
    //       value: informExhibitInfoPage.pCustomValue,
    //       description: informExhibitInfoPage.pCustomDescription,
    //     },
    //     ...newAttrs,
    //   ];
    //
    //   yield put<SyncRulesAction>({
    //     type: 'syncRules',
    //     payload: {
    //       attrs: newAttrs,
    //     },
    //   });
    //
    //   // yield put<ChangeAction>({
    //   //   type: 'change',
    //   //   payload: {
    //   //     pCustomModalVisible: false,
    //   //     pCustomModalTitle: '',
    //   //     pCustomModalConfirmButtonDisabled: false,
    //   //     pCustomMode: 'add',
    //   //     pCustomKey: '',
    //   //     pCustomKeyDisabled: false,
    //   //     pCustomKeyError: '',
    //   //     pCustomValue: '',
    //   //     pCustomValueError: '',
    //   //     pCustomDescription: '',
    //   //     pCustomDescriptionError: '',
    //   //   },
    //   // });
    //
    // },
    * onClickDeleteAttr({ payload }: OnClickDeleteAttrAction, { select, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const attrs = informExhibitInfoPage.exhibit_RuleResult?.ruleInfo.attrs;

      // console.log(attrs, 'rules!!!!!!!');

      let newAttrs = attrs.filter((rl: any) => {
        return rl.key !== payload.theKey;
      });

      newAttrs = [
        ...newAttrs,
        {
          operation: 'delete',
          key: payload.theKey,
        },
      ];

      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          attrs: newAttrs,
        },
      });
    },
    * onClickResetAttr({ payload }: OnClickResetAttrAction, { select, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const attrs = informExhibitInfoPage.exhibit_RuleResult?.ruleInfo.attrs;

      // console.log(attrs, 'rules!!!!!!!');

      const newAttrs = attrs.filter((rl: any) => {
        return rl.key !== payload.theKey;
      });

      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          attrs: newAttrs,
        },
      });
    },

    * onConfirm_CustomOptionsDrawer({ payload }: OnConfirm_CustomOptionsDrawer_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const attrs = informExhibitInfoPage.exhibit_RuleResult?.ruleInfo?.attrs || [];

      // console.log(attrs, 'rules!!!!!!!');

      // let newAttrs = attrs.filter((rl: any) => {
      //   return rl.key !== informExhibitInfoPage.pCustomKey;
      // });
      // newAttrs = [
      //   {
      //     operation: 'add',
      //     key: informExhibitInfoPage.pCustomKey,
      //     value: informExhibitInfoPage.pCustomValue,
      //     description: informExhibitInfoPage.pCustomDescription,
      //   },
      //   ...newAttrs,
      // ];

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptionsDrawer_Visible: false,
        },
      });

      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          attrs: [
            ...payload.value.map((v) => {
              return {
                operation: 'add',
                key: v.key,
                value: v.defaultValue,
                description: v.description,
              };
            }),
            ...attrs,
          ],
        },
      });

      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     side_CustomOptions: [
      //       ...exhibitInfoPage.side_CustomOptions,
      //       ...payload.value.map<ExhibitInfoPageModelState['side_CustomOptions'][number]>((v) => {
      //         return {
      //           key: v.key,
      //           value: v.defaultValue,
      //           description: v.description,
      //           option: [],
      //           valueInput: v.defaultValue,
      //           valueInputError: '',
      //         };
      //       }),
      //     ],
      //     side_CustomOptionsDrawer_Visible: false,
      //   },
      // });
      //
      // yield put<UpdateRewriteAction>({
      //   type: 'updateRewrite',
      // });
    },
    * onCancel_CustomOptionsDrawer({}: OnCancel_CustomOptionsDrawer_Action, { put }: EffectsCommandMap) {
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
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const attrs = informExhibitInfoPage.exhibit_RuleResult?.ruleInfo.attrs;

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_CustomOptionDrawer_Visible: false,
          side_CustomOptionDrawer_DataSource: null,
        },
      });

      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          attrs: attrs.map((a: any) => {
            if (a.key !== payload.value.key) {
              return a;
            }
            return {
              ...a,
              value: payload.value.value,
              description: payload.value.description,
            };
          }),
        },
      });

      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     side_CustomOptions: exhibitInfoPage.side_CustomOptions.map((co) => {
      //       if (co.key !== payload.value.key) {
      //         return co;
      //       }
      //       return {
      //         key: co.key,
      //         value: payload.value.value,
      //         description: payload.value.description,
      //         valueInput: payload.value.value,
      //         valueInputError: '',
      //       };
      //     }),
      //     side_CustomOptionDrawer_Visible: false,
      //     side_CustomOptionDrawer_DataSource: null,
      //   },
      // });
      //
      // yield put<UpdateRewriteAction>({
      //   type: 'updateRewrite',
      // });
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

async function handleRelation(params: HandleRelationParams): Promise<HandleRelationResult> {
  // console.log(params, 'params0923jafdsl9023ujioafdsl');
  const resourceIds: string[] = params.map((r) => r.resourceId);
  if (resourceIds.length === 0) {
    return [];
  }
  const contractIds: string[] = params.map((c) => c.contracts.map((cs) => cs.contractId)).flat();

  const params0: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
    resourceIds: resourceIds.join(','),
    isLoadPolicyInfo: 1,
  };

  const params1: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
    contractIds: contractIds.join(','),
    isLoadPolicyInfo: 1,
  };

  const { data: data0 }: any = await FServiceAPI.Resource.batchInfo(params0);
  // console.log(data0, 'data0, data123rfsdadata0');
  const { data: data1 }: any = params1.contractIds ? (await FServiceAPI.Contract.batchContracts(params1)) : { data: [] };
  // console.log(data1, '@#$Fsdjfj;flsdkafjlij;iojdata1');

  const result: HandleRelationResult = params.map<HandleRelationResult[number]>((r) => {
    const contractPolicyIds: string[] = r.contracts.map((cs) => cs.policyId);

    const resource = data0.find((dr: any) => dr.resourceId === r.resourceId);
    // console.log(resource, '2093jrlwkfladskfdslklresource');
    return {
      resourceId: resource.resourceId,
      resourceName: resource.resourceName,
      resourceType: resource.resourceType,
      status: resource.status,
      contracts: r.contracts.map((c) => {
        const contract = data1.find((dc: any) => dc.contractId === c.contractId);
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
        .filter((p: any) => !contractPolicyIds.includes(p.policyId))
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

interface RuleMatchStatusParams {
  nodeID: number;
  isRematch?: boolean;
}

async function ruleMatchStatus({ nodeID, isRematch = false }: RuleMatchStatusParams): Promise<any> {
  const params: Parameters<typeof FServiceAPI.InformalNode.rulesRematch>[0] = {
    nodeId: nodeID,
  };

  if (isRematch) {
    await FServiceAPI.InformalNode.rulesRematch(params);
  }

  while (true) {
    const response = await FServiceAPI.InformalNode.testNodeRules({ nodeId: nodeID });
    // console.log(response, 'response1234');
    if (response.data.status === 1) {
      await sleep();
    } else {
      if (response.data.status === 2) {
        throw new Error('匹配失败');
      }
      return response;
    }
  }
}

function sleep(ms: number = 200): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
