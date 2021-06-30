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
  // nodeName: string;
  informExhibitName: string;
  // isOnline: boolean;
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
  pCustomAttrs: {
    key: string;
    value: string; // 最终向服务端提交的value数据
    remark: string;
    isEditing: boolean; // 是否弹窗来编辑此属性
  }[];

  pAddCustomModalVisible: boolean;
  pAddCustomKey: string;
  pAddCustomKeyError: string;
  pAddCustomValue: string;
  pAddCustomValueError: string;
  pAddCustomDescription: string;
  pAddCustomDescriptionError: string;

  relation: {
    cardTitle: string;
    identity: 'resource' | 'object';
    id: string;
    name: string;
    type: string;
    cover: string;
    linkToDetails: string;
  } | null;

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
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'informExhibitInfoPage/change';
  payload: Partial<InformExhibitInfoPageModelState>;
}

export interface OnOnlineSwitchChangeAction extends AnyAction {
  type: 'informExhibitInfoPage/onOnlineSwitchChange';
  payload: {
    checked: boolean;
  };
}

export interface FetchInformalExhibitInfoAction extends AnyAction {
  type: 'fetchInformalExhibitInfo' | 'informExhibitInfoPage/fetchInformalExhibitInfo';
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

export interface ExhibitInfoPageModelType {
  namespace: 'informExhibitInfoPage';
  state: InformExhibitInfoPageModelState;
  effects: {
    fetchInformalExhibitInfo: (action: FetchInformalExhibitInfoAction, effects: EffectsCommandMap) => void;
    syncRules: (action: SyncRulesAction, effects: EffectsCommandMap) => void;
    updateRelation: (action: UpdateRelationAction, effects: EffectsCommandMap) => void;
    onOnlineSwitchChange: (action: OnOnlineSwitchChangeAction, effects: EffectsCommandMap) => void;
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
    // nodeName: '',
    informExhibitName: '',
    // isOnline: false,
    onlineSwitchObj: null,
    mappingRule: null,

    associated: [],

    pCover: '',
    pTitle: '',
    pInputTitle: null,
    pTags: [],

    pCustomAttrs: [],

    pAddCustomModalVisible: false,
    pAddCustomKey: '',
    pAddCustomKeyError: '',
    pAddCustomValue: '',
    pAddCustomValueError: '',
    pAddCustomDescription: '',
    pAddCustomDescriptionError: '',

    relation: null,
  },
  effects: {
    * fetchInformalExhibitInfo({}: FetchInformalExhibitInfoAction, {call, select, put}: EffectsCommandMap) {
      const {informExhibitInfoPage, nodes}: ConnectState = yield select(({informExhibitInfoPage, nodes}: ConnectState) => ({
        informExhibitInfoPage,
        nodes,
      }));

      const params: Parameters<typeof FServiceAPI.InformalNode.testResourceDetails>[0] = {
        testResourceId: informExhibitInfoPage.informExhibitID,
      };
      const {data} = yield call(FServiceAPI.InformalNode.testResourceDetails, params);

      // console.log(data, '#######32409jkldfsmdslkdsf||||||||');

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
          // nodeName: currentNode?.nodeName,
          informExhibitName: data.testResourceName,
          // isOnline: ,
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
          associated: result.map((r, index) => {
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
      // console.log(data2, '##@#$@#$@#!!!!!!!!!');

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
          pCustomAttrs: currentRule?.ruleInfo.attrs?.map((cr: any) => {
            return {
              remark: cr.description,
              key: cr.key,
              // operation: "add",
              value: cr.value,
              isEditing: false,
            };
          }) || [],
          mappingRule: {
            ...eRule,
            ...tRule,
          },
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
      const {data} = yield call(FServiceAPI.InformalNode.createRules, params);

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

      // yield put<ChangeAction>({
      //   type: 'change',
      //   payload: {
      //     onlineSwitchObj: {
      //       checked: payload.checked,
      //       text: informExhibitInfoPage.resourceType === 'theme' ? (payload.checked ? '已激活' : '未激活') : (payload.checked ? '已上线' : '未上线'),
      //       disabled: false,
      //     },
      //   },
      // });

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

function sleep(ms: number = 200) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms);
  });
}
