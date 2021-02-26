import {DvaReducer, WholeReadonly} from '@/models/shared';
import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription} from 'dva';
import {ConnectState} from '@/models/connect';
import {batchContracts, BatchContractsParamsType} from '@/services/contracts';
import {batchInfo, BatchInfoParamsType, info, InfoParamsType} from '@/services/resources';
import {
  createRules,
  CreateRulesParamsType,
  rulesRematch,
  RulesRematchParamsType, testNodeRules,
  testResourceDetails,
  TestResourceDetailsParamsType
} from "@/services/informalNodes";

const {decompile, compile} = require('@freelog/nmr_translator');

interface ICandidate {
  name: string;
  versionRange: string;
  type: 'resource' | 'object';
}

export type InformExhibitInfoPageModelState = WholeReadonly<{
  informExhibitID: string;

  nodeID: number;
  nodeName: string;
  informExhibitName: string;
  isOnline: boolean;
  mappingRule: {
    add?: {
      exhibit: string;
      source: {
        type: 'resource' | 'object';
        name: string;
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
    }
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

  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceCover: string;
}>;

export interface ChangeAction extends AnyAction {
  type: 'change' | 'informExhibitInfoPage/change';
  payload: Partial<InformExhibitInfoPageModelState>;
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo' | 'informExhibitInfoPage/fetchInfo';
}

export interface SyncRulesAction extends AnyAction {
  type: 'informExhibitInfoPage/syncRules';
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
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
    syncRules: (action: SyncRulesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<InformExhibitInfoPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const Model: ExhibitInfoPageModelType = {
  namespace: 'informExhibitInfoPage',
  state: {
    informExhibitID: '',

    nodeID: -1,
    nodeName: '',
    informExhibitName: '',
    isOnline: false,
    mappingRule: null,

    associated: [
      {
        selected: true,
        id: '1',
        name: 'resource/name1',
        type: 'image',
        contracts: [{
          name: '策略1',
          status: 1,
          id: '3451324kl34iojlksfd',
          text: '1234:\n  execute\n  result',
          createTime: '2020-12-31',
          policyId: '908jksdff',
        }],
        policies: [{
          id: '238942u3j4io',
          name: 'name23223',
          text: '234',
        }],
      },
    ],

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

    resourceId: '',
    resourceName: '',
    resourceType: '',
    resourceCover: '',
  },
  effects: {
    * fetchInfo({}: FetchInfoAction, {call, select, put}: EffectsCommandMap) {
      const {informExhibitInfoPage, nodes}: ConnectState = yield select(({informExhibitInfoPage, nodes}: ConnectState) => ({
        informExhibitInfoPage,
        nodes,
      }));

      const params: TestResourceDetailsParamsType = {
        testResourceId: informExhibitInfoPage.informExhibitID,
      };
      const {data} = yield call(testResourceDetails, params);

      const currentNode = nodes.list.find((n) => n.nodeId === data.nodeId);
      // console.log(data, '#######32409jkldfsmdslkdsf');

      const params1: InfoParamsType = {
        resourceIdOrName: data.originInfo.id,
      };

      const {data: data1} = yield call(info, params1);

      let isOnline: boolean;

      if (data.resourceType === 'theme') {
        isOnline = data.stateInfo.themeInfo.isActivatedTheme === 1;
      } else {
        isOnline = (data.stateInfo.onlineStatusInfo.onlineStatus === 1);
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          nodeID: data.nodeId,
          nodeName: currentNode?.nodeName,
          informExhibitName: data.testResourceName,
          isOnline: isOnline,
          pCover: data.stateInfo.coverInfo.coverImages[0] || '',
          pTitle: data.stateInfo.titleInfo.title || '',
          pTags: data.stateInfo.tagInfo.tags || [],
          // allVersions: data.originInfo.versions || [],
          // version: data.originInfo.version || '',
          resourceId: data.originInfo.id,
          resourceName: data1.resourceName,
          resourceType: data1.resourceType,
          resourceCover: data1.coverImages[0] || '',
        },
      });

      const params2: RuleMatchStatusParams = {
        nodeID: data.nodeId,
        isRematch: false,
      };
      const {data: data2} = yield call(ruleMatchStatus, params2);
      // console.log(data1, '##@#$@#$@#');

      const {rules} = compile(data2.ruleText);
      // console.log(rules, 'rulesiuhfwe89i34FFEWFP)(*');

      const currentRule = rules.find((ro: any) => {
        return ro.exhibitName === data.testResourceName;
      });

      // console.log(currentRule, 'currentRule9283hdsfjkhdslkf');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pCustomAttrs: currentRule?.attrs?.map((cr: any) => {
            return {
              remark: cr.description,
              key: cr.key,
              // operation: "add"
              value: cr.value,
              isEditing: false,
            };
          }) || [],
          mappingRule: currentRule || null,
        }
      });
    },
    * syncRules({payload}: SyncRulesAction, {select, call, put}: EffectsCommandMap) {
      const {informExhibitInfoPage}: ConnectState = yield select(({informExhibitInfoPage}: ConnectState) => ({
        informExhibitInfoPage,
      }));

      const params2: RuleMatchStatusParams = {
        nodeID: informExhibitInfoPage.nodeID,
        isRematch: false,
      };

      const {data: data1} = yield call(ruleMatchStatus, params2);

      const {rules} = compile(data1.ruleText);
      // console.log(rules, '@##RFSDFSDFASD90就；sdf89');

      let newRulesObj;

      if (payload.active !== undefined) {
        console.log(payload.active, 'payload.active@SADFioJpoiu908sfup9OI:)_I');

        newRulesObj = rules.filter((r: any) => {
          return r.operation !== 'activate_theme';
        });

        if (payload.active) {
          newRulesObj = [
            ...newRulesObj,
            {
              operation: 'activate_theme',
              themeName: informExhibitInfoPage.informExhibitName,
            },
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
            ...rules,
            {
              operation: 'alter',
              exhibitName: informExhibitInfoPage.informExhibitName,
              ...payload,
            },
          ];
        }
      }

      // console.log(newRulesObj, 'newRulesObj908231jldsaF@#)_*()UJLK');
      const text = decompile(newRulesObj);
      // console.log(text, 'newRulesObj90ij32.dsfsdf');

      const params: CreateRulesParamsType = {
        nodeId: informExhibitInfoPage.nodeID,
        testRuleText: text,
      };
      const {data} = yield call(createRules, params);
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
  // console.log(params, 'params0923jafdsl');
  const resourceIds: string[] = params.map((r) => r.resourceId);
  const contractIds: string[] = params.map((c) => c.contracts.map((cs) => cs.contractId)).flat();
  const contractPolicyIds: string[] = params.map((c) => c.contracts.map((cs) => cs.policyId)).flat();

  const params0: BatchInfoParamsType = {
    resourceIds: resourceIds.join(','),
    isLoadPolicyInfo: 1,
  };

  const params1: BatchContractsParamsType = {
    contractIds: contractIds.join(','),
    isLoadPolicyInfo: 1,
  };

  const [{data: data0}, {data: data1}]: any = await Promise.all([batchInfo(params0), batchContracts(params1)]);
  // console.log(data0, data1, 'data0, data123rfsda');

  const result = params.map((r) => {
    const resource = data0.find((dr: any) => dr.resourceId === r.resourceId);
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
  const params: RulesRematchParamsType = {
    nodeId: nodeID,
  };

  if (isRematch) {
    await rulesRematch({nodeId: nodeID});
  }

  while (true) {
    const response = await testNodeRules({nodeId: nodeID});
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

  function sleep(ms: number = 200) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, ms);
    });
  }
}
