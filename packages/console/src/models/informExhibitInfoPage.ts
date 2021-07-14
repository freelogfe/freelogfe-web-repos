import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from '@/models/connect';
import {FUtil, FServiceAPI} from '@freelog/tools-lib';
import FUtil1 from '@/utils'

const {decompile, compile} = require('@freelog/nmr_translator');

interface ICandidate {
  name: string;
  versionRange: string;
  type: 'resource' | 'object';
}

export interface InformExhibitInfoPageModelState {
  resourceType: string;
  informExhibitID: string;
  nodeID: number;
  allRuleText: string;
  allRuleResult: any;
  currentRuleResult: any;
  theRuleID: string;

  nodeName: string;
  informExhibitName: string;
  mappingRule: {
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
      scopes: ICandidate[][];
    }[];
    attrs?: {
      type: 'add' | 'delete',
      theKey: string;
      value?: string;
      description?: string;
    }[];
  } | null;
  onlineSwitchObj: {
    checked: boolean;
    text: string;
    disabled: boolean;
  } | null;

  associated: {
    selected: boolean;
    id: string;
    name: string;
    type: string;
    contracts: {
      name: string;
      status: 0 | 1;
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

  pCover: string;
  pTitle: string;
  pInputTitle: string | null;
  pTags: string[];
  pAllVersions: string[];
  pVersion: string;
  pOnlyReadAttrs: {
    theKey: string;
    value: string;
  }[];
  pOnlyEditAttrs: {
    theKey: string;
    theValue: string;
    theValueError: string;
    remark: string;
  }[];
  pEditDeleteAttrs: {
    theKey: string;
    theValue: string;
    theValueError: string;
    remark: string;
  }[];

  pCustomModalVisible: boolean;
  pCustomModalTitle: string;
  pCustomModalConfirmButtonDisabled: boolean;
  pCustomMode: 'add' | 'edit';
  pCustomKey: string;
  pCustomKeyDisabled: boolean;
  pCustomKeyError: string;
  pCustomValue: string;
  pCustomValueError: string;
  pCustomDescription: string;
  pCustomDescriptionError: string;

  relation: {
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

export interface OnClickPTitleConfirmBtnAction {
  type: 'informExhibitInfoPage/onClickPTitleConfirmBtn';
}

export interface OnClickPTitleCancelBtnAction {
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
    value: boolean;
  };
}

export interface FetchInformalExhibitInfoAction extends AnyAction {
  type: 'fetchInformalExhibitInfo' | 'informExhibitInfoPage/fetchInformalExhibitInfo';
  payload?: {
    informExhibitID?: string;
  };
}

export interface SyncRulesAction extends AnyAction {
  type: 'informExhibitInfoPage/syncRules' | 'syncRules';
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
  };
}

export interface OnHandleAttrModalAction extends AnyAction {
  type: 'informExhibitInfoPage/onHandleAttrModal';
  payload: {
    type: 'add' | 'edit';
    theKey?: string;
  };
}

export interface OnCancelHandleAttrModalAction extends AnyAction {
  type: 'informExhibitInfoPage/onCancelHandleAttrModal';
}

export interface OnAttrModalChangeAction extends AnyAction {
  type: 'informExhibitInfoPage/onAttrModalChange';
  payload: {
    theKey?: string;
    value?: string;
    remark?: string;
  };
}

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

export interface OnClickAttrModalConfirmBtnAction extends AnyAction {
  type: 'informExhibitInfoPage/onClickAttrModalConfirmBtn';
}

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
    onCancelHandleAttrModal: (action: OnCancelHandleAttrModalAction, effects: EffectsCommandMap) => void;
    onAttrModalChange: (action: OnAttrModalChangeAction, effects: EffectsCommandMap) => void;
    onChangeAttrs: (action: OnChangeAttrsAction, effects: EffectsCommandMap) => void;
    onAttrBlur: (action: OnAttrBlurAction, effects: EffectsCommandMap) => void;
    onClickAttrModalConfirmBtn: (action: OnClickAttrModalConfirmBtnAction, effects: EffectsCommandMap) => void;
    onClickDeleteAttr: (action: OnClickDeleteAttrAction, effects: EffectsCommandMap) => void;
    onClickResetAttr: (action: OnClickResetAttrAction, effects: EffectsCommandMap) => void;
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

const Model: ExhibitInfoPageModelType = {
  namespace: 'informExhibitInfoPage',
  state: {
    nodeID: -1,
    informExhibitID: '',
    resourceType: '',
    allRuleText: '',
    allRuleResult: null,
    currentRuleResult: null,
    theRuleID: '',

    nodeName: '',
    informExhibitName: '',
    onlineSwitchObj: null,
    mappingRule: null,

    associated: [],

    pCover: '',
    pTitle: '',
    pInputTitle: null,
    pTags: [],
    pAllVersions: [],
    pVersion: '',
    pOnlyReadAttrs: [],
    pOnlyEditAttrs: [],
    pEditDeleteAttrs: [],

    pCustomModalVisible: false,
    pCustomModalTitle: '',
    pCustomModalConfirmButtonDisabled: false,
    pCustomMode: 'add',
    pCustomKey: '',
    pCustomKeyDisabled: false,
    pCustomKeyError: '',
    pCustomValue: '',
    pCustomValueError: '',
    pCustomDescription: '',
    pCustomDescriptionError: '',

    relation: null,
  },


  effects: {
    * onPageMount({payload}: OnPageMountAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          informExhibitID: payload.informExhibitID,
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
    * fetchInformalExhibitInfo({payload}: FetchInformalExhibitInfoAction, {call, select, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const informExhibitID: string = payload?.informExhibitID !== undefined ? payload.informExhibitID : informExhibitInfoPage.informExhibitID;

      const params: Parameters<typeof FServiceAPI.InformalNode.testResourceDetails>[0] = {
        testResourceId: informExhibitID,
      };
      const {data} = yield call(FServiceAPI.InformalNode.testResourceDetails, params);

      // console.log(data, '#######32409jkldfsmdslkdsf||||||||');

      const params4: Parameters<typeof FServiceAPI.Node.details>[0] = {
        nodeId: data.nodeId,
      };

      const {data: data4} = yield call(FServiceAPI.Node.details, params4);
      // console.log(data4, 'data41234234123423412341234');

      let result: HandleRelationResult = [];
      let relation: InformExhibitInfoPageModelState['relation'] = null;

      if (data.originInfo.type === 'resource') {
        result = yield call(handleRelation, data.resolveResources);

        const params2: Parameters<typeof FServiceAPI.Resource.info>[0] = {
          resourceIdOrName: data.originInfo.id,
        };

        const {data: data2} = yield call(FServiceAPI.Resource.info, params2);
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
          objectIdOrName: data.originInfo.id,
        };

        const {data: data3} = yield call(FServiceAPI.Storage.objectDetails, params3);
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

      const selectedID = informExhibitInfoPage.associated.find((a) => a.selected)?.id;

      // console.log(data, 'data@!!!!!!!!1111');
      const isChecked: boolean = data.resourceType === 'theme' ? data.stateInfo.themeInfo.isActivatedTheme === 1 : data.stateInfo.onlineStatusInfo.onlineStatus === 1;
      const isDisabled: boolean = data.resourceType === 'theme' && isChecked;

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeID: data.nodeId,
          resourceType: data.resourceType,
          nodeName: data4.nodeName,
          informExhibitName: data.testResourceName,
          theRuleID: data.rules.length > 0 ? data.rules[0].ruleId : '',
          onlineSwitchObj: {
            checked: isChecked,
            text: data.resourceType === 'theme'
              ? FUtil1.I18n.message('toggle_activate_theme')
              : FUtil1.I18n.message('btn_show_exhibit'),
            disabled: isDisabled,
          },
          pCover: data.stateInfo.coverInfo.coverImages[0] || '',
          pTitle: data.stateInfo.titleInfo.title || '',
          pTags: data.stateInfo.tagInfo.tags || [],
          pAllVersions: [...data.originInfo.versions].reverse(),
          pVersion: data.originInfo.version,
          pOnlyReadAttrs: (data.stateInfo.propertyInfo.testResourceProperty as any[])
            .filter((cr: any) => {
              return cr.authority === 1;
            })
            .map<InformExhibitInfoPageModelState['pOnlyReadAttrs'][number]>((cr: any) => {
              return {
                theKey: cr.key,
                value: cr.key === 'fileSize' ? FUtil.Format.humanizeSize(cr.value) : cr.value,
              };
            }),
          pOnlyEditAttrs: (data.stateInfo.propertyInfo.testResourceProperty as any[])
            .filter((cr: any) => {
              return cr.authority === 2;
            })
            .map<InformExhibitInfoPageModelState['pOnlyEditAttrs'][number]>((cr: any) => {
              // console.log(cr, 'cr!!@#$!@#$!@#$!@#$!@#$');
              return {
                theKey: cr.key,
                theValue: cr.value,
                theValueError: '',
                remark: cr.remark,
              };
            }),
          pEditDeleteAttrs: (data.stateInfo.propertyInfo.testResourceProperty as any[])
            .filter((cr: any) => {
              return cr.authority === 6;
            })
            .map<InformExhibitInfoPageModelState['pEditDeleteAttrs'][number]>((cr: any) => {
              return {
                theKey: cr.key,
                theValue: cr.value,
                theValueError: '',
                remark: cr.remark,
              };
            }),
          associated: result.map<InformExhibitInfoPageModelState['associated'][number]>((r, index) => {
            return {
              selected: selectedID ? selectedID === r.resourceId : index === 0,
              id: r.resourceId,
              name: r.resourceName,
              type: r.resourceType,
              contracts: r.contracts.map((c) => ({
                name: c.contractName,
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
          relation: relation,
        },
      });

      const params2: RuleMatchStatusParams = {
        nodeID: data.nodeId,
        isRematch: false,
      };

      const {data: data2} = yield call(ruleMatchStatus, params2);
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
          mappingRule: {
            ...eRule,
            ...tRule,
          },
          allRuleText: data2.ruleText,
          allRuleResult: data2.testRules,
          currentRuleResult: data.rules.length > 0 ? data2.testRules.find((tr: any) => {
            return tr.id === data.rules[0].ruleId;
          }) : null,
        },
      });
    },
    * syncRules({payload}: SyncRulesAction, {select, call, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      // console.log(payload, 'payload123421341!!!!!!');

      const params2: RuleMatchStatusParams = {
        nodeID: informExhibitInfoPage.nodeID,
        isRematch: false,
      };

      const {data: data1} = yield call(ruleMatchStatus, params2);

      const {rules} = compile(data1.ruleText);

      let newRulesObj;

      if (payload.active !== undefined) {
        newRulesObj = rules.filter((r: any) => {
          return r.operation !== 'activate_theme';
        });

        if (payload.active) {
          newRulesObj = [
            {
              operation: 'activate_theme',
              themeName: informExhibitInfoPage.informExhibitName,
            },
            ...newRulesObj,
          ];
        }
        // console.log(rules1, 'rules1!Q@#RFcdios89joe');
      } else {
        const currentRule = rules.find((ro: any) => {
          return ro.exhibitName === informExhibitInfoPage.informExhibitName;
        });

        if (currentRule) {
          newRulesObj = rules.map((ro: any) => {
            if (ro.exhibitName !== informExhibitInfoPage.informExhibitName) {
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
              exhibitName: informExhibitInfoPage.informExhibitName,
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
        nodeId: informExhibitInfoPage.nodeID,
        testRuleText: text,
      };
      // console.log(params, 'paramsparams!!@#$!@#$');
      const {data} = yield call(FServiceAPI.InformalNode.createRules, params);
      // console.log(data, 'data!!@#$@#$');

      yield call(sleep, 300);

      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },
    * updateRelation({payload}: UpdateRelationAction, {select, call, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));
      const resource = informExhibitInfoPage.associated.find((a) => a.id === payload.resourceId);
      // console.log(resource, '$#@$#$@#+++++++++++');
      // if (resource?.contracts && resource?.contracts.length > 0) {
      const params: Parameters<typeof FServiceAPI.InformalNode.updateTestResourceContracts>[0] = {
        // presentableId: informExhibitInfoPage?.presentableId || '',
        testResourceId: informExhibitInfoPage.informExhibitID,
        resolveResources: [
          {
            resourceId: resource?.id || '',
            contracts: [
              ...(resource?.contracts || []).map((c) => ({policyId: c.policyId})),
              {policyId: payload.policyId},
            ],
          },
        ],
      };
      yield call(FServiceAPI.InformalNode.updateTestResourceContracts, params);
      yield put<FetchInformalExhibitInfoAction>({
        type: 'fetchInformalExhibitInfo',
      });
    },
    * onOnlineSwitchChange({payload}: OnOnlineSwitchChangeAction, {put, select}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      if (informExhibitInfoPage.resourceType === 'theme') {
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
    * onChangePCover({payload}: OnChangePCoverAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {pCover: payload.value}
      });
      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          cover: payload.value,
        },
      });
    },
    * onClickPTitleEditBtn({}: OnClickPTitleEditBtnAction, {}: EffectsCommandMap) {

    },
    * onChangePTitleInput({}: OnChangePTitleInputAction, {}: EffectsCommandMap) {

    },
    * onClickPTitleConfirmBtn({}: OnClickPTitleConfirmBtnAction, {}: EffectsCommandMap) {

    },
    * onClickPTitleCancelBtn({}: OnClickPTitleCancelBtnAction, {}: EffectsCommandMap) {

    },
    * onChangePLabels({payload}: OnChangePLabelsAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pTags: payload.value,
        }
      });
      yield put<SyncRulesAction>({
        type: 'informExhibitInfoPage/syncRules',
        payload: {
          labels: payload.value,
        },
      });
    },
    * onChangePVersion({}: OnChangePVersionAction, {}: EffectsCommandMap) {

    },

    * onHandleAttrModal({payload}: OnHandleAttrModalAction, {select, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      if (payload.type === 'add') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pCustomModalVisible: true,
            pCustomModalTitle: '添加自定义选项',
            pCustomModalConfirmButtonDisabled: true,
            pCustomMode: 'add',
            pCustomKey: '',
            pCustomKeyDisabled: false,
            pCustomKeyError: '',
            pCustomValue: '',
            pCustomValueError: '',
            pCustomDescription: '',
            pCustomDescriptionError: '',
          },
        });
      } else {
        const attrT = informExhibitInfoPage.pEditDeleteAttrs.find((ea) => {
          return ea.theKey === payload.theKey;
        });
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pCustomModalVisible: true,
            pCustomModalTitle: '编辑自定义选项',
            pCustomModalConfirmButtonDisabled: true,
            pCustomMode: 'edit',
            pCustomKey: attrT?.theKey || '',
            pCustomKeyDisabled: true,
            pCustomKeyError: '',
            pCustomValue: attrT?.theValue || '',
            pCustomValueError: '',
            pCustomDescription: attrT?.remark || '',
            pCustomDescriptionError: '',
          },
        });
      }
    },
    * onCancelHandleAttrModal({}: OnCancelHandleAttrModalAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pCustomModalVisible: false,
          pCustomModalTitle: '',
          pCustomModalConfirmButtonDisabled: false,
          pCustomMode: 'add',
          pCustomKey: '',
          pCustomKeyDisabled: false,
          pCustomKeyError: '',
          pCustomValue: '',
          pCustomValueError: '',
          pCustomDescription: '',
          pCustomDescriptionError: '',
        },
      });
    },
    * onAttrModalChange({payload}: OnAttrModalChangeAction, {select, put, call}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      if (payload.theKey !== undefined) {
        const valueText: string = payload.theKey;
        const customKeys: string[] = [
          ...informExhibitInfoPage.pOnlyReadAttrs
            .map<string>((pc) => pc.theKey),
          ...informExhibitInfoPage.pOnlyEditAttrs
            .map<string>((poe) => poe.theKey),
          ...informExhibitInfoPage.pEditDeleteAttrs
            .map<string>((ped) => ped.theKey),
        ];
        let pAddCustomKeyError: string = '';
        if (!/^[a-zA-Z0-9_]{1,20}$/.test(valueText)) {
          pAddCustomKeyError = `需要符合正则^[a-zA-Z0-9_]{1,20}$`;
        } else if ([...customKeys].includes(valueText)) {
          pAddCustomKeyError = 'key不能与基础属性和其他自定义属性相同';
        }
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pCustomKey: valueText,
            pCustomKeyError: pAddCustomKeyError,
            pCustomModalConfirmButtonDisabled: !valueText || !!pAddCustomKeyError
              || !informExhibitInfoPage.pCustomValue || !!informExhibitInfoPage.pCustomValueError
              || !!informExhibitInfoPage.pCustomDescriptionError
          },
        });
      }

      if (payload.value !== undefined) {
        const valueText: string = payload.value;
        const textError: string = (valueText.length > 30 || payload.value === '') ? '1~30个字符' : '';
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pCustomValue: valueText,
            pCustomValueError: textError,
            pCustomModalConfirmButtonDisabled: !informExhibitInfoPage.pCustomKey || !!informExhibitInfoPage.pCustomKeyError
              || !valueText || !!textError
              || !!informExhibitInfoPage.pCustomDescriptionError
          },
        });
      }

      if (payload.remark !== undefined) {
        const valueText: string = payload.remark;
        const textError: string = (valueText.length > 50) ? '0~50个字符' : '';
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pCustomDescription: valueText,
            pCustomDescriptionError: textError,
            pCustomModalConfirmButtonDisabled: !informExhibitInfoPage.pCustomKey || !!informExhibitInfoPage.pCustomKeyError
              || !informExhibitInfoPage.pCustomValue || !!informExhibitInfoPage.pCustomValueError
              || !!textError,
          },
        });
      }
    },
    * onChangeAttrs({payload}: OnChangeAttrsAction, {select, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      console.log(payload, 'payload1234');

      const theValue: string = payload.theValue;
      const textError: string = (theValue.length > 30 || theValue === '') ? '1~30个字符' : '';

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pOnlyEditAttrs: informExhibitInfoPage.pOnlyEditAttrs.map<InformExhibitInfoPageModelState['pOnlyEditAttrs'][number]>((poe) => {
            if (poe.theKey !== payload.theKey) {
              return poe;
            }
            return {
              ...poe,
              theValue: theValue,
              theValueError: textError,
            }
          }),
          pEditDeleteAttrs: informExhibitInfoPage.pEditDeleteAttrs.map<InformExhibitInfoPageModelState['pEditDeleteAttrs'][0]>((ped) => {
            if (ped.theKey !== payload.theKey) {
              return ped;
            }
            return {
              ...ped,
              theValue: theValue,
              theValueError: textError,
            };
          })
        },
      });
    },
    * onAttrBlur({payload}: OnAttrBlurAction, {select, call, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const attr = informExhibitInfoPage.pOnlyEditAttrs.find((poe) => {
        return poe.theKey === payload.theKey;
      }) || informExhibitInfoPage.pEditDeleteAttrs.find((ped) => {
        return ped.theKey === payload.theKey;
      });

      console.log(attr, 'attrattrattr!!!');

      if (attr?.theValueError) {
        return;
      }

      let theRule: any = [];

      const currentRule = informExhibitInfoPage.currentRuleResult?.ruleInfo || null;

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
    * onClickAttrModalConfirmBtn({}: OnClickAttrModalConfirmBtnAction, {select, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const attrs = informExhibitInfoPage.currentRuleResult?.ruleInfo.attrs;

      // console.log(attrs, 'rules!!!!!!!');

      let newAttrs = attrs.filter((rl: any) => {
        return rl.key !== informExhibitInfoPage.pCustomKey;
      });

      newAttrs = [
        {
          operation: 'add',
          key: informExhibitInfoPage.pCustomKey,
          value: informExhibitInfoPage.pCustomValue,
          description: informExhibitInfoPage.pCustomDescription,
        },
        ...newAttrs,
      ];

      yield put<SyncRulesAction>({
        type: 'syncRules',
        payload: {
          attrs: newAttrs,
        },
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pCustomModalVisible: false,
          pCustomModalTitle: '',
          pCustomModalConfirmButtonDisabled: false,
          pCustomMode: 'add',
          pCustomKey: '',
          pCustomKeyDisabled: false,
          pCustomKeyError: '',
          pCustomValue: '',
          pCustomValueError: '',
          pCustomDescription: '',
          pCustomDescriptionError: '',
        },
      });

    },
    * onClickDeleteAttr({payload}: OnClickDeleteAttrAction, {select, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const attrs = informExhibitInfoPage.currentRuleResult?.ruleInfo.attrs;

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
    * onClickResetAttr({payload}: OnClickResetAttrAction, {select, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const attrs = informExhibitInfoPage.currentRuleResult?.ruleInfo.attrs;

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
    status: 0 | 1;
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

  const {data: data0}: any = await FServiceAPI.Resource.batchInfo(params0);
  // console.log(data0, 'data0, data123rfsdadata0');
  const {data: data1}: any = params1.contractIds ? (await FServiceAPI.Contract.batchContracts(params1)) : {data: []};
  // console.log(data1, '@#$Fsdjfj;flsdkafjlij;iojdata1');

  const result = params.map((r) => {
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
          status: contract.status,
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

async function ruleMatchStatus({nodeID, isRematch = false}: RuleMatchStatusParams): Promise<any> {
  const params: Parameters<typeof FServiceAPI.InformalNode.rulesRematch>[0] = {
    nodeId: nodeID,
  };

  if (isRematch) {
    await FServiceAPI.InformalNode.rulesRematch(params);
  }

  while (true) {
    const response = await FServiceAPI.InformalNode.testNodeRules({nodeId: nodeID});
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
      resolve()
    }, ms);
  });
}
