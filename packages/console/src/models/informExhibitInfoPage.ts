import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI ,FI18n} from '@freelog/tools-lib';
import { FCustomOptionsEditorDrawerStates } from '@/components/FCustomOptionsEditorDrawer';
import { IActions, IRules, ruleMatchAndResult, RuleMatchAndResultReturn } from '@/models/informalNodeManagerPage';
import fMessage from '@/components/fMessage';
import { history } from 'umi';
import { OperationAndActionRecords } from '@/type/InformalNodeTypes';
import { fileAttrUnits } from '@/utils/format';

const { decompile } = require('@freelog/nmr_translator');

interface ICandidate {
  name: string;
  versionRange: string;
  type: 'resource' | 'object';
}

export interface InformExhibitInfoPageModelState {

  pageLoading: boolean;

  node_ID: number;
  node_Name: string;
  node_RuleInfo: null | RuleMatchAndResultReturn;

  exhibit_ID: string;
  exhibit_Name: string;
  exhibit_Identity: 'exhibit' | 'resource' | 'object';
  exhibit_ResourceType: string;
  exhibit_OnlineSwitchObj: {
    checked: boolean;
    text: string;
    disabled: boolean;
  } | null;
  exhibit_Info: null | {
    testResourceId: string;
    testResourceName: string;
    associatedPresentableId: string;
    originInfo: {
      id: string;
      name: string;
      resourceType: string;
      type: 'resource' | 'object';
      version: string; // 测试资源引用的实体版本
      versionRange: string; // 测试资源引用的实体版本范围
      versions: string[]; // 测试资源的所有版本
    };
    stateInfo: {
      coverInfo: {
        coverImages: string[];
        ruleId: 'default' | string;
      };
      onlineStatusInfo: {
        ruleId: 'default' | string;
        onlineStatus: 0 | 1;
      };
      propertyInfo: {
        ruleId: 'default' | string;
        testResourceProperty: {
          remark: string;
          key: string;
          value: string | number;
          isRuleSet?: true;
        }[];
      };
      replaceInfo: {
        rootResourceReplacer: null;
        replaceRecords: {
          replaced: {
            id: string;
            name: string;
            type: 'resource' | 'object';
            version: string;
          };
          replacer: {
            id: string;
            name: string;
            type: 'resource' | 'object';
            version: string;
          };
          scopes?: ICandidate[][];
        }[];
        ruleId: 'default' | string;
      };
      tagInfo: {
        tags: string[];
        ruleId: 'default' | string;
      };
      themeInfo: {
        isActivatedTheme: 0 | 1;
        ruleId: 'default' | string;
      };
      titleInfo: {
        title: string;
        ruleId: 'default' | string;
      };
    };
    rules: {
      operations: Array<'add' | 'alter' | 'set_labels' | 'online' | 'set_title' | 'set_cover' | 'add_attr' | 'delete_attr' | 'replace' | 'activate_theme'>;
      ruleId: string;
    }[];
    operationAndActionRecords: OperationAndActionRecords;
    isAuth: boolean;
  };

  // graph_FullScreen: boolean;
  // graph_Viewport_Show: 'relationship' | 'authorization' | 'dependency';
  // graph_Viewport_RelationGraph_Nodes: IGraph_Relationship_Nodes;
  // graph_Viewport_RelationGraph_Edges: IGraph_Relationship_Edges;
  // graph_Viewport_AuthorizationGraph_Nodes: IGraph_Authorization_Nodes;
  // graph_Viewport_AuthorizationGraph_Edges: IGraph_Authorization_Edges;
  // graph_Viewport_DependencyGraph_Nodes: IGraph_Dependency_Nodes;
  // graph_Viewport_DependencyGraph_Edges: IGraph_Dependency_Edges;

  graphShow: boolean;

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
    selectOptions: string[];
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

  side_Resource_Relation: {
    cardTitle: string;
    identity: 'resource' | 'object';
    id: string;
    name: string;
    type: string[];
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

export interface OnChange_Exhibit_OnlineSwitch_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChange_Exhibit_OnlineSwitch';
  payload: {
    checked: boolean;
  };
}

export interface OnChange_Theme_OnlineSwitch_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChange_Theme_OnlineSwitch';
  payload: {
    checked: true;
  };
}

export interface OnChanged_ExhibitAuthorized_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChanged_ExhibitAuthorized';
}

export interface OnClick_Graph_FullScreenBtn_Action extends AnyAction {
  type: 'informExhibitInfoPage/onClick_Graph_FullScreenBtn';
}

export interface OnCancel_Graph_FullScreenDrawer_Action extends AnyAction {
  type: 'informExhibitInfoPage/onCancel_Graph_FullScreenDrawer';
}

export interface OnChange_Graph_Tab_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChange_Graph_Tab';
  payload: {
    value: 'relationship' | 'authorization' | 'dependency';
  };
}

export interface OnChange_Side_Exhibit_Cover_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChange_Side_Exhibit_Cover';
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

export interface OnClick_Side_Exhibit_Title_Action extends AnyAction {
  type: 'informExhibitInfoPage/onClick_Side_Exhibit_Title';
}

export interface OnClickPTitleCancelBtnAction extends AnyAction {
  type: 'informExhibitInfoPage/onClickPTitleCancelBtn';
}

export interface OnChange_Side_Exhibit_Tags_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChange_Side_Exhibit_Tags';
  payload: {
    value: string[];
  };
}

export interface OnChange_Side_Exhibit_Version_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChange_Side_Exhibit_Version';
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

export interface OnHandleAttrModalAction extends AnyAction {
  type: 'informExhibitInfoPage/onHandleAttrModal';
  payload: {
    type: 'add' | 'edit';
    theKey?: string;
  };
}

export interface OnClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn_Action extends AnyAction {
  type: 'informExhibitInfoPage/onClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn';
  payload: {
    theKey: string;
  };
}

export interface OnChange_Side_Exhibit_OnlyEditAttrSelect_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChange_Side_Exhibit_OnlyEditAttrSelect';
  payload: {
    theKey: string;
    theValue: string;
  };
}

export interface OnBlur_Side_Exhibit_OnlyEditAttrSelect_Action extends AnyAction {
  type: 'informExhibitInfoPage/onBlur_Side_Exhibit_OnlyEditAttrSelect';
  payload: {
    theKey: string;
    theValue: string;
    theDescription: string;
  };
}

export interface OnChange_Side_Exhibit_OnlyEditAttrInput_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChange_Side_Exhibit_OnlyEditAttrInput';
  payload: {
    theKey: string;
    theValue: string;
  };
}

export interface OnBlur_Side_Exhibit_OnlyEditAttrInput_Action extends AnyAction {
  type: 'informExhibitInfoPage/onBlur_Side_Exhibit_OnlyEditAttrInput';
  payload: {
    theKey: string;
    theValue: string;
    theDescription: string;
  };
}

export interface OnChange_Side_Exhibit_EditDeleteAttrInput_Action extends AnyAction {
  type: 'informExhibitInfoPage/onChange_Side_Exhibit_EditDeleteAttrInput';
  payload: {
    theKey: string;
    theValue: string;
  };
}

export interface OnBlur_Side_Exhibit_EditDeleteAttrInput_Action extends AnyAction {
  type: 'informExhibitInfoPage/onBlur_Side_Exhibit_EditDeleteAttrInput';
  payload: {
    theKey: string;
    theValue: string;
    theDescription: string;
  };
}

export interface OnClick_Side_Exhibit_EditDeleteAttr_DeleteBtn_Action extends AnyAction {
  type: 'informExhibitInfoPage/onClick_Side_Exhibit_EditDeleteAttr_DeleteBtn';
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

    onChange_Exhibit_OnlineSwitch: (action: OnChange_Exhibit_OnlineSwitch_Action, effects: EffectsCommandMap) => void;
    onChange_Theme_OnlineSwitch: (action: OnChange_Theme_OnlineSwitch_Action, effects: EffectsCommandMap) => void;

    onChanged_ExhibitAuthorized: (action: OnChanged_ExhibitAuthorized_Action, effects: EffectsCommandMap) => void;

    onClick_Graph_FullScreenBtn: (action: OnClick_Graph_FullScreenBtn_Action, effects: EffectsCommandMap) => void;
    onCancel_Graph_FullScreenDrawer: (action: OnCancel_Graph_FullScreenDrawer_Action, effects: EffectsCommandMap) => void;
    onChange_Graph_Tab: (action: OnChange_Graph_Tab_Action, effects: EffectsCommandMap) => void;

    onChange_Side_Exhibit_Cover: (action: OnChange_Side_Exhibit_Cover_Action, effects: EffectsCommandMap) => void;
    onClickPTitleEditBtn: (action: OnClickPTitleEditBtnAction, effects: EffectsCommandMap) => void;
    onChangePTitleInput: (action: OnChangePTitleInputAction, effects: EffectsCommandMap) => void;
    onClick_Side_Exhibit_Title: (action: OnClick_Side_Exhibit_Title_Action, effects: EffectsCommandMap) => void;
    onClickPTitleCancelBtn: (action: OnClickPTitleCancelBtnAction, effects: EffectsCommandMap) => void;
    onChange_Side_Exhibit_Tags: (action: OnChange_Side_Exhibit_Tags_Action, effects: EffectsCommandMap) => void;
    onChange_Side_Exhibit_Version: (action: OnChange_Side_Exhibit_Version_Action, effects: EffectsCommandMap) => void;

    onHandleAttrModal: (action: OnHandleAttrModalAction, effects: EffectsCommandMap) => void;
    onClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn: (action: OnClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn_Action, effects: EffectsCommandMap) => void;
    onChange_Side_Exhibit_OnlyEditAttrSelect: (action: OnChange_Side_Exhibit_OnlyEditAttrSelect_Action, effects: EffectsCommandMap) => void;
    onBlur_Side_Exhibit_OnlyEditAttrSelect: (action: OnBlur_Side_Exhibit_OnlyEditAttrSelect_Action, effects: EffectsCommandMap) => void;
    onChange_Side_Exhibit_OnlyEditAttrInput: (action: OnChange_Side_Exhibit_OnlyEditAttrInput_Action, effects: EffectsCommandMap) => void;
    onBlur_Side_Exhibit_OnlyEditAttrInput: (action: OnBlur_Side_Exhibit_OnlyEditAttrInput_Action, effects: EffectsCommandMap) => void;
    onChange_Side_Exhibit_EditDeleteAttrInput: (action: OnChange_Side_Exhibit_EditDeleteAttrInput_Action, effects: EffectsCommandMap) => void;
    onBlur_Side_Exhibit_EditDeleteAttrInput: (action: OnBlur_Side_Exhibit_EditDeleteAttrInput_Action, effects: EffectsCommandMap) => void;
    onClick_Side_Exhibit_EditDeleteAttr_DeleteBtn: (action: OnClick_Side_Exhibit_EditDeleteAttr_DeleteBtn_Action, effects: EffectsCommandMap) => void;

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

// export interface UpdateRelationAction extends AnyAction {
//   type: 'informExhibitInfoPage/updateRelation';
//   payload: {
//     resourceId: string;
//     policyId: string;
//   };
// }

const initStates: InformExhibitInfoPageModelState = {
  pageLoading: true,

  node_ID: -1,
  node_Name: '',
  node_RuleInfo: null,

  exhibit_ID: '',
  exhibit_Name: '',
  exhibit_Identity: 'exhibit',
  exhibit_ResourceType: '',
  exhibit_OnlineSwitchObj: null,
  exhibit_Info: null,

  // contract_Associated_Selected: '',
  // contract_Associated: [],

  // graph_FullScreen: false,
  // graph_Viewport_Show: 'relationship',
  // graph_Viewport_RelationGraph_Nodes: [],
  // graph_Viewport_RelationGraph_Edges: [],
  // graph_Viewport_AuthorizationGraph_Nodes: [],
  // graph_Viewport_AuthorizationGraph_Edges: [],
  // graph_Viewport_DependencyGraph_Nodes: [],
  // graph_Viewport_DependencyGraph_Edges: [],
  graphShow: true,

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
    * onPageUnmount({}: OnPageUnmountAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...initStates,
        },
      });
    },
    * fetchInformalExhibitInfo({ payload }: FetchInformalExhibitInfoAction, { call, select, put }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const informExhibitID: string = payload?.informExhibitID !== undefined ? payload.informExhibitID : informExhibitInfoPage.exhibit_ID;

      const params: Parameters<typeof FServiceAPI.InformalNode.testResourceDetails>[0] = {
        testResourceId: informExhibitID,
      };
      const { data: testResourceDetail } = yield call(FServiceAPI.InformalNode.testResourceDetails, params);
      // console.log(testResourceDetail, 'data288282822828282822888888888888');
      if (!testResourceDetail || testResourceDetail.userId !== FUtil.Tool.getUserIDByCookies()) {
        history.replace(FUtil.LinkTo.exception403({}));
        return;
      }

      const params4: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: testResourceDetail.nodeId,
      };

      const { data: data4 } = yield call(FServiceAPI.Node.details, params4);
      // console.log(data4, 'data41234234123423412341234');


      let relation: InformExhibitInfoPageModelState['side_Resource_Relation'] = null;

      const actualOriginInfo = testResourceDetail.stateInfo.replaceInfo.rootResourceReplacer || testResourceDetail.originInfo;

      if (actualOriginInfo.type === 'resource') {
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
      // console.log(data, 'data@!!!!!!!!1111');
      const isChecked: boolean = testResourceDetail.resourceType.includes('主题') ? testResourceDetail.stateInfo.themeInfo.isActivatedTheme === 1 : testResourceDetail.stateInfo.onlineStatusInfo.onlineStatus === 1;
      const isDisabled: boolean = testResourceDetail.resourceType.includes('主题') && isChecked;

      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: testResourceDetail.nodeId,
        isRematch: false,
      };

      const node_RuleInfo: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);

      const params1: Parameters<typeof FServiceAPI.InformalNode.batchGetAuths>[0] = {
        nodeId: testResourceDetail.nodeId,
        exhibitIds: testResourceDetail.testResourceId,
        authType: 3,
      };

      const { data: data_batchGetAuths }: { data: [{ isAuth: boolean }] } = yield call(FServiceAPI.InformalNode.batchGetAuths, params1);
      // console.log(data_batchGetAuths, 'data@#$@#$#@ data_batchGetAuths');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageLoading: false,
          node_RuleInfo: node_RuleInfo,
          node_ID: testResourceDetail.nodeId,
          node_Name: data4.nodeName,
          exhibit_Identity: testResourceDetail.associatedPresentableId !== '' ? 'exhibit' : actualOriginInfo.type,
          exhibit_ResourceType: testResourceDetail.resourceType,
          exhibit_Name: testResourceDetail.testResourceName,
          exhibit_OnlineSwitchObj: {
            checked: isChecked,
            text: testResourceDetail.resourceType.includes('主题')
              ? FI18n.i18nNext.t('toggle_activate_theme')
              // : FI18n.i18nNext.t('btn_show_exhibit'),
              : FI18n.i18nNext.t('switch_set_exhibit_avaliable'),
            disabled: isDisabled,
          },
          exhibit_Info: {
            ...testResourceDetail,
            isAuth: data_batchGetAuths[0].isAuth,
          },

          side_Exhibit_Cover: testResourceDetail.stateInfo.coverInfo.coverImages[0] || '',
          side_Exhibit_Title: testResourceDetail.stateInfo.titleInfo.title || '',
          side_Exhibit_Tags: testResourceDetail.stateInfo.tagInfo.tags || [],
          side_Exhibit_AllVersions: [...actualOriginInfo.versions].reverse(),
          side_Exhibit_Version: actualOriginInfo.version,
          side_Exhibit_OnlyReadAttrs: (testResourceDetail.stateInfo.propertyInfo.testResourceProperty as any[])
            .filter((cr: any) => {
              return cr.authority === 1;
            })
            .map<InformExhibitInfoPageModelState['side_Exhibit_OnlyReadAttrs'][number]>((cr: any) => {
              return {
                theKey: cr.key,
                value: fileAttrUnits[cr.key] ? fileAttrUnits[cr.key](cr.value) : cr.value,
              };
            }),
          side_Exhibit_OnlyEditAttrs: (testResourceDetail.stateInfo.propertyInfo.testResourceProperty as any[])
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
                selectOptions: cr.candidateItems,
              };
            }),
          side_Exhibit_EditDeleteAttrs: (testResourceDetail.stateInfo.propertyInfo.testResourceProperty as any[])
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

          side_Resource_Relation: relation,
        },
      });

    },
    * onChange_Exhibit_OnlineSwitch({ payload }: OnChange_Exhibit_OnlineSwitch_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      let rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      rules = mergeRules({
        oldRules: rules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'online',
          content: payload.checked,
        },
      });

      const text: string = decompile(rules);

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },
    * onChange_Theme_OnlineSwitch({ payload }: OnChange_Theme_OnlineSwitch_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {

      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      if (needHandleRules.some((n) => n.operation === 'activate_theme')) {
        needHandleRules = needHandleRules.map((nhr) => {
          if (nhr.operation === 'activate_theme') {
            return {
              ...nhr,
              exhibitName: informExhibitInfoPage.exhibit_Name,
              text: '',
            };
          }
          return nhr;
        });
      } else {
        needHandleRules = [
          ...needHandleRules,
          {
            operation: 'activate_theme',
            exhibitName: informExhibitInfoPage.exhibit_Name,
            text: '',
          },
        ];
      }

      const text: string = decompile(needHandleRules);

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },

    * onChanged_ExhibitAuthorized({}: OnChanged_ExhibitAuthorized_Action, { select, call, put }: EffectsCommandMap) {
      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },

    * onClick_Graph_FullScreenBtn({}: OnClick_Graph_FullScreenBtn_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // graph_FullScreen: true,
        },
      });
    },
    * onCancel_Graph_FullScreenDrawer({}: OnCancel_Graph_FullScreenDrawer_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // graph_FullScreen: false,
        },
      });
    },
    * onChange_Graph_Tab({ payload }: OnChange_Graph_Tab_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // graph_Viewport_Show: payload.value,
        },
      });
    },

    * onChange_Side_Exhibit_Cover({ payload }: OnChange_Side_Exhibit_Cover_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_Exhibit_Cover: payload.value,
        },
      });

      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      const text: string = decompile(mergeRules({
        oldRules: rules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'set_cover',
          content: payload.value,
        },
      }));

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });

    },
    * onClickPTitleEditBtn({}: OnClickPTitleEditBtnAction, { put, select }: EffectsCommandMap) {

      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_Exhibit_InputTitle: informExhibitInfoPage.side_Exhibit_Title,
        },
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
    * onClick_Side_Exhibit_Title({}: OnClick_Side_Exhibit_Title_Action, { put, select, call }: EffectsCommandMap) {

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

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      const text: string = decompile(mergeRules({
        oldRules: rules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'set_title',
          content: pInputTitle,
        },
      }));

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
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
    * onChange_Side_Exhibit_Tags({ payload }: OnChange_Side_Exhibit_Tags_Action, {
      put,
      select,
      call,
    }: EffectsCommandMap) {

      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_Exhibit_Tags: payload.value,
        },
      });

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      const text: string = decompile(mergeRules({
        oldRules: rules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'set_labels',
          content: payload.value,
        },
      }));

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },
    * onChange_Side_Exhibit_Version({ payload }: OnChange_Side_Exhibit_Version_Action, {
      select,
      put,
      call,
    }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      const text: string = decompile(mergeRules({
        oldRules: rules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'replace',
          content: {
            replacer: {
              name: informExhibitInfoPage.side_Resource_Relation?.name || '',
              versionRange: payload.value,
              type: informExhibitInfoPage.side_Resource_Relation?.identity || 'resource',
            },
            replaced: {
              name: informExhibitInfoPage.side_Resource_Relation?.name || '',
              versionRange: '*',
              type: informExhibitInfoPage.side_Resource_Relation?.identity || 'resource',
            },
            scopes: [],
          },
        },
      }));

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data } = yield call(FServiceAPI.InformalNode.createRules, params);

      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
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
    * onClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn({ payload }: OnClick_Side_Exhibit_OnlyEditAttrInputOrSelect_ResetBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      needHandleRules = needHandleRules.map((nhr) => {
        if (nhr.exhibitName === informExhibitInfoPage.exhibit_Name && nhr.operation !== 'activate_theme') {
          return {
            ...nhr,
            actions: nhr.actions.filter((a) => {
              return !((a.operation === 'add_attr' || a.operation === 'delete_attr') && a.content.key === payload.theKey);
            }),
          };
        }
        return nhr;
      });
      // }
      // console.log(needHandleRules, 'needHandleRules11111');
      const text: string = decompile(needHandleRules);
      // console.log(text, 'text1111111');

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(FServiceAPI.InformalNode.createRules, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已重置');

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },
    * onChange_Side_Exhibit_OnlyEditAttrSelect({ payload }: OnChange_Side_Exhibit_OnlyEditAttrSelect_Action, {
      select,
      put,
    }: EffectsCommandMap) {
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
        },
      });
    },
    * onBlur_Side_Exhibit_OnlyEditAttrSelect({ payload }: OnBlur_Side_Exhibit_OnlyEditAttrSelect_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      needHandleRules = needHandleRules.map((nhr) => {
        if (nhr.exhibitName === informExhibitInfoPage.exhibit_Name && nhr.operation !== 'activate_theme') {
          return {
            ...nhr,
            actions: nhr.actions.filter((a) => {
              return !((a.operation === 'add_attr' || a.operation === 'delete_attr') && a.content.key === payload.theKey);
            }),
          };
        }
        return nhr;
      });

      needHandleRules = mergeRules({
        oldRules: needHandleRules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'add_attr',
          content: {
            key: payload.theKey,
            value: payload.theValue,
            description: payload.theDescription,
          },
        },
      });
      // }
      // console.log(needHandleRules, 'needHandleRules11111');
      const text: string = decompile(needHandleRules);
      // console.log(text, 'text1111111');

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(FServiceAPI.InformalNode.createRules, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已更新');

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },

    * onChange_Side_Exhibit_OnlyEditAttrInput({ payload }: OnChange_Side_Exhibit_OnlyEditAttrInput_Action, {
      select,
      put,
    }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const theValue: string = payload.theValue;
      const textError: string = theValue.length > 30 ? '1~30个字符' : '';

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
        },
      });
    },
    * onBlur_Side_Exhibit_OnlyEditAttrInput({ payload }: OnBlur_Side_Exhibit_OnlyEditAttrInput_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      needHandleRules = needHandleRules.map((nhr) => {
        if (nhr.exhibitName === informExhibitInfoPage.exhibit_Name && nhr.operation !== 'activate_theme') {
          return {
            ...nhr,
            actions: nhr.actions.filter((a) => {
              return !((a.operation === 'add_attr' || a.operation === 'delete_attr') && a.content.key === payload.theKey);
            }),
          };
        }
        return nhr;
      });

      needHandleRules = mergeRules({
        oldRules: needHandleRules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'add_attr',
          content: {
            key: payload.theKey,
            value: payload.theValue,
            description: payload.theDescription,
          },
        },
      });
      // }
      // console.log(needHandleRules, 'needHandleRules11111');
      const text: string = decompile(needHandleRules);
      // console.log(text, 'text1111111');

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(FServiceAPI.InformalNode.createRules, params);

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已更新');

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },
    * onChange_Side_Exhibit_EditDeleteAttrInput({ payload }: OnChange_Side_Exhibit_EditDeleteAttrInput_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const theValue: string = payload.theValue;
      const textError: string = theValue.length > 30 ? '1~30个字符' : '';

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          side_Exhibit_EditDeleteAttrs: informExhibitInfoPage.side_Exhibit_EditDeleteAttrs.map<InformExhibitInfoPageModelState['side_Exhibit_EditDeleteAttrs'][number]>((poe) => {
            if (poe.theKey !== payload.theKey) {
              return poe;
            }
            return {
              ...poe,
              theValue: theValue,
              theValueError: textError,
            };
          }),
        },
      });
    },
    * onBlur_Side_Exhibit_EditDeleteAttrInput({ payload }: OnBlur_Side_Exhibit_EditDeleteAttrInput_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {

      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      needHandleRules = needHandleRules.map((nhr) => {
        if (nhr.exhibitName === informExhibitInfoPage.exhibit_Name && nhr.operation !== 'activate_theme') {
          return {
            ...nhr,
            actions: nhr.actions.filter((a) => {
              return !((a.operation === 'add_attr' || a.operation === 'delete_attr') && a.content.key === payload.theKey);
            }),
          };
        }
        return nhr;
      });

      needHandleRules = mergeRules({
        oldRules: needHandleRules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'add_attr',
          content: {
            key: payload.theKey,
            value: payload.theValue,
            description: payload.theDescription,
          },
        },
      });
      // }
      // console.log(needHandleRules, 'needHandleRules11111');
      const text: string = decompile(needHandleRules);
      // console.log(text, 'text1111111');

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(FServiceAPI.InformalNode.createRules, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已更新');

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });

    },
    * onClick_Side_Exhibit_EditDeleteAttr_DeleteBtn({ payload }: OnClick_Side_Exhibit_EditDeleteAttr_DeleteBtn_Action, {
      select,
      call,
      put,
    }: EffectsCommandMap) {
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      needHandleRules = needHandleRules.map((nhr) => {
        if (nhr.exhibitName === informExhibitInfoPage.exhibit_Name && nhr.operation !== 'activate_theme') {
          return {
            ...nhr,
            actions: nhr.actions.filter((a) => {
              return !(a.operation === 'add_attr' && a.content.key === payload.theKey);
            }),
          };
        }
        return nhr;
      });

      needHandleRules = mergeRules({
        oldRules: needHandleRules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'delete_attr',
          content: {
            key: payload.theKey,
          },
        },
      });
      // }
      // console.log(needHandleRules, 'needHandleRules11111');
      const text: string = decompile(needHandleRules);
      // console.log(text, 'text1111111');

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(FServiceAPI.InformalNode.createRules, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已删除');

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },
    // * onClickResetAttr({ payload }: OnClickResetAttrAction, { select, put }: EffectsCommandMap) {
    //   // const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
    //   //   informExhibitInfoPage,
    //   // }));
    //
    //   // const attrs = informExhibitInfoPage.exhibit_RuleResult?.ruleInfo.attrs;
    //
    //   // console.log(attrs, 'rules!!!!!!!');
    //
    //   // const newAttrs = attrs.filter((rl: any) => {
    //   //   return rl.key !== payload.theKey;
    //   // });
    //
    //   // yield put<SyncRulesAction>({
    //   //   type: 'syncRules',
    //   //   payload: {
    //   //     attrs: newAttrs,
    //   //   },
    //   // });
    // },

    * onConfirm_CustomOptionsDrawer({ payload }: OnConfirm_CustomOptionsDrawer_Action, {
      select,
      put,
      call,
    }: EffectsCommandMap) {
      // console.log(payload, 'payload00021323');
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      needHandleRules = needHandleRules.map((nhr) => {
        if (nhr.exhibitName === informExhibitInfoPage.exhibit_Name && nhr.operation !== 'activate_theme') {
          return {
            ...nhr,
            actions: nhr.actions.filter((a) => {
              return !payload.value.some((v) => a.operation === 'delete_attr' && v.key === a.content.key);
            }),
          };
        }
        return nhr;
      });

      console.log(needHandleRules, 'needHandleRules999999');

      for (const ds of payload.value) {
        needHandleRules = mergeRules({
          oldRules: needHandleRules,
          exhibitName: informExhibitInfoPage.exhibit_Name,
          action: {
            operation: 'add_attr',
            content: {
              key: ds.key,
              value: ds.defaultValue,
              description: ds.description,
            },
          },
        });
      }

      console.log(needHandleRules, '输入#########');

      const text: string = decompile(needHandleRules);

      console.log(text, '输出********');

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(FServiceAPI.InformalNode.createRules, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已添加');

      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
          side_CustomOptionsDrawer_Visible: false,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
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
      call,
      put,
    }: EffectsCommandMap) {
      console.log(payload, 'payload@@@@@@@');
      const { informExhibitInfoPage }: ConnectState = yield select(({ informExhibitInfoPage }: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const rules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = (informExhibitInfoPage.node_RuleInfo?.testRules || []).map((rr) => {
        return rr.ruleInfo;
      });

      let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(rules));

      needHandleRules = needHandleRules.map((nhr) => {
        if (nhr.exhibitName === informExhibitInfoPage.exhibit_Name && nhr.operation !== 'activate_theme') {
          return {
            ...nhr,
            actions: nhr.actions.filter((a) => {
              return !((a.operation === 'add_attr' || a.operation === 'delete_attr') && a.content.key === payload.value.key);
            }),
          };
        }
        return nhr;
      });

      needHandleRules = mergeRules({
        oldRules: needHandleRules,
        exhibitName: informExhibitInfoPage.exhibit_Name,
        action: {
          operation: 'add_attr',
          content: {
            key: payload.value.key,
            value: payload.value.value,
            description: payload.value.description,
          },
        },
      });
      // }
      // console.log(needHandleRules, 'needHandleRules11111');
      const text: string = decompile(needHandleRules);
      // console.log(text, 'text1111111');

      const params: Parameters<typeof FServiceAPI.InformalNode.createRules>[0] = {
        nodeId: informExhibitInfoPage.node_ID,
        testRuleText: text,
      };
      const { data, errCode, ret, msg }: {
        data: boolean;
        errCode: number;
        msg: string;
        ret: number;
      } = yield call(FServiceAPI.InformalNode.createRules, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        return fMessage(msg, 'error');
      }
      fMessage('自定义选项已更新');

      //  ##############
      const params2: Parameters<typeof ruleMatchAndResult>[0] = {
        nodeID: informExhibitInfoPage.node_ID,
        isRematch: true,
      };

      const result: RuleMatchAndResultReturn = yield call(ruleMatchAndResult, params2);
      if (result.status === 2) {
        fMessage('规则匹配失败');
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          node_RuleInfo: result,
          side_CustomOptionDrawer_Visible: false,
          side_CustomOptionDrawer_DataSource: null,
        },
      });

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
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

interface MergeRulesParams {
  oldRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']>;
  exhibitName: string;
  action: IActions['set_labels']
    | IActions['replace']
    | IActions['online']
    | IActions['set_title']
    | IActions['set_cover']
    | IActions['add_attr']
    | IActions['delete_attr'];
}

export function mergeRules({
                             oldRules,
                             exhibitName,
                             action,
                           }: MergeRulesParams): Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> {
  let needHandleRules: Array<IRules['add'] | IRules['alter'] | IRules['activate_theme']> = JSON.parse(JSON.stringify(oldRules));

  if (needHandleRules.some((nhr) => nhr.exhibitName === exhibitName && nhr.operation !== 'activate_theme')) {
    needHandleRules = needHandleRules.map((nhr) => {
      if (nhr.exhibitName === exhibitName && nhr.operation !== 'activate_theme') {
        return {
          ...nhr,
          actions: [
            ...nhr.actions,
            // {
            //   operation: 'set_cover',
            //   content: payload.value,
            // },
            action,
          ],
        };
      }

      return nhr;
    });
  } else {
    const alterRule: IRules['alter'] = {
      operation: 'alter',
      exhibitName: exhibitName,
      actions: [
        // {
        //   operation: 'set_cover',
        //   content: payload.value,
        // },
        action,
      ],
      text: '',
    };
    needHandleRules = [
      ...needHandleRules,
      alterRule,
    ];
  }

  needHandleRules.sort((a) => {
    return a.exhibitName === exhibitName ? -1 : 0;
  });


  return needHandleRules;
}

