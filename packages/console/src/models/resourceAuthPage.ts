import {AnyAction} from 'redux';
import {Effect, EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {FetchDataSourceAction} from "@/models/resourceInfo";
import moment from "moment";
import {ConnectState} from "@/models/connect";
import {FApiServer} from "@/services";
import {FUtil} from '@freelog/tools-lib';

export interface ResourceAuthPageModelState {
  resourceID: string;

  policies: {
    policyId: string;
    policyName: string;
    status: 0 | 1;
    policyText: string;
  }[];
  policyPreviewVisible: boolean;
  policyPreviewText: string;
  // newPolicyTitle: string;
  // newPolicyText: string;
  policyEditorVisible: boolean;
  // policyTemplateVisible: boolean;

  baseUastResources: {
    resourceId: string;
    resourceName: string;
  }[];
  contractsAuthorized: {
    id: string;
    activated: boolean;
    title: string;
    resourceType: string;
    version: string;
    contracts: {
      checked: boolean;
      title: string;
      status: 0 | 1 | 2;
      code: string;
      id: string;
      date: string;
      policyId: string;
      versions: { version: string; checked: boolean; disabled: boolean }[];
    }[];
    policies: {
      id: string;
      title: string;
      code: string;
      allEnabledVersions: string[];
    }[];
  }[];

  contractsAuthorize: {
    key: string,
    contractName: string,
    contractID: string,
    authorizedParty: string,
    licenseeIdentityType: 1 | 2 | 3;
    createDate: string,
    status: 0 | 1 | 3;
  }[];

  detailContractID: string;
}

export interface UpdatePoliciesAction {
  type: 'resourceAuthPage/updatePolicies';
  payload: {
    updatePolicies?: {
      policyId: string;
      status: 0 | 1; // 0:下线策略 1:上线策略
    }[];
    addPolicies?: {
      policyName: string;
      policyText: string;
    }[];
  };
}

export interface FetchResourceInfoAction extends AnyAction {
  type: 'resourceAuthPage/fetchResourceInfo' | 'fetchResourceInfo',
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceAuthPage/change',
  payload: Partial<ResourceAuthPageModelState>;
}

export interface FetchAuthorizedAction extends AnyAction {
  type: 'resourceAuthPage/fetchAuthorized' | 'fetchAuthorized',
  payload: {
    activatedResourceId?: string;
  };
}

export interface FetchAuthorizeAction extends AnyAction {
  type: 'resourceAuthPage/fetchAuthorize',
  // payload: string;
}

export interface UpdateAuthorizedAction extends AnyAction {
  type: 'resourceAuthPage/updateAuthorized',
  payload: {
    version: string;
    policyId: string;
    operation: 0 | 1;
  }[];
}

interface ResourceAuthPageModelType {
  namespace: 'resourceAuthPage';
  state: ResourceAuthPageModelState;
  effects: {
    // fetchPolicies: (action: FetchPoliciesAction, effects: EffectsCommandMap) => void;
    updatePolicies: (action: UpdatePoliciesAction, effects: EffectsCommandMap) => void;
    fetchResourceInfo: (action: FetchResourceInfoAction, effects: EffectsCommandMap) => void;
    fetchAuthorized: (action: FetchAuthorizedAction, effects: EffectsCommandMap) => void;
    fetchAuthorize: (action: FetchAuthorizeAction, effects: EffectsCommandMap) => void;
    updateAuthorized: (action: UpdateAuthorizedAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceAuthPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceAuthPageModelType = {

  namespace: 'resourceAuthPage',

  state: {
    resourceID: '',

    policies: [],
    policyPreviewVisible: false,
    policyPreviewText: '',
    // newPolicyTitle: '',
    // newPolicyText: '',
    policyEditorVisible: false,
    // policyTemplateVisible: false,

    baseUastResources: [],
    contractsAuthorized: [],
    contractsAuthorize: [],

    detailContractID: '',
  },
  effects: {
    * fetchResourceInfo({}: FetchResourceInfoAction, {select, call, put}: EffectsCommandMap) {
      const {resourceAuthPage}: ConnectState = yield select(({resourceAuthPage}: ConnectState) => ({
        resourceAuthPage,
      }));

      const params: Parameters<typeof FApiServer.Resource.info>[0] = {
        resourceIdOrName: resourceAuthPage.resourceID,
        isLoadPolicyInfo: 1,
      };

      const {data} = yield call(FApiServer.Resource.info, params);
      // console.log(data, '@#$RFDSASDFSDFASDF');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          policies: data.policies,
          baseUastResources: data.baseUpcastResources,
        }
      })
    },
    * updatePolicies({payload}: UpdatePoliciesAction, {call, put, select}: EffectsCommandMap) {
      const {resourceAuthPage}: ConnectState = yield select(({resourceInfo, resourceAuthPage}: ConnectState) => ({
        resourceAuthPage,
      }));
      const params: Parameters<typeof FApiServer.Resource.update>[0] = {
        resourceId: resourceAuthPage.resourceID,
        ...payload,
      };
      yield call(FApiServer.Resource.update, params);
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: resourceAuthPage.resourceID,
      });
      yield put<FetchResourceInfoAction>({
        type: 'fetchResourceInfo',
      });
    },
    * fetchAuthorized({payload: {activatedResourceId}}: FetchAuthorizedAction, {call, put, select}: EffectsCommandMap) {
      const {resourceAuthPage}: ConnectState = yield select(({resourceAuthPage}: ConnectState) => ({
        resourceAuthPage,
      }));

      const params: Parameters<typeof FApiServer.Resource.resolveResources>[0] = {
        resourceId: resourceAuthPage.resourceID,
      };
      const {data} = yield call(FApiServer.Resource.resolveResources, params);

      // console.log(data, 'datadata232323');
      if (data.length === 0) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            contractsAuthorized: [],
          },
        });
      }

      const params2: Parameters<typeof FApiServer.Resource.batchInfo>[0] = {
        resourceIds: data.map((i: any) => i.resourceId).join(','),
        isLoadPolicyInfo: 1,
      };
      // console.log(resourceParams, 'resourceParams908hik');
      const {data: data2} = yield call(FApiServer.Resource.batchInfo, params2);
      // console.log(resourcesInfoData, 'resourcesInfoDataresourcesInfoData');

      const params1: Parameters<typeof FApiServer.Contract.batchContracts>[0] = {
        subjectIds: data.map((i: any) => i.resourceId).join(','),
        licenseeId: resourceAuthPage.resourceID,
        subjectType: 1,
        licenseeIdentityType: 1,
        isLoadPolicyInfo: 1,
      };
      const {data: data1} = yield call(FApiServer.Contract.batchContracts, params1);
      // console.log(data1, 'data112#$!@#$!@#$!@#$12341234');

      // const contractsParams: Parameters<typeof FApiServer.Contract.contracts>[0] = {
      //   identityType: 2,
      //   licenseeId: resourceAuthPage.resourceID,
      //   isLoadPolicyInfo: 1,
      // };
      //
      // const {data: {dataList: contractsData}} = yield call(FApiServer.Contract.contracts, contractsParams);

      const contractsAuthorized = data.map((i: any/* 关系资源id */, j: number) => {
        // 当前资源信息
        const currentResource = data2.find((resource: any) => resource.resourceId === i.resourceId);
        // console.log(currentResource, 'currentResource');
        const allEnabledVersions: string[] = i.versions.map((version: any) => version.version);
        const allContracts = data1
          .filter((c: any) => c.licensorId === i.resourceId);
        // console.info(allContracts, 'allContracts');

        const allUsedPoliciesId = allContracts.map((c: any) => c.policyId);
        // console.info(allUsedPoliciesId, 'allUsedPoliciesId');
        const allEnabledPolicies = data2.find((resource: any) => resource.resourceId === i.resourceId)?.policies?.filter((p: any) => {
          // console.log(p, '!@#$!@#$@#$@#!$');
          return !allUsedPoliciesId.includes(p.policyId) && p.status === 1;
        });
        // console.log(allEnabledPolicies, 'allEnabledPolicies');
        return {
          id: currentResource.resourceId,
          activated: activatedResourceId ? activatedResourceId === currentResource.resourceId : (j === 0),
          title: currentResource.resourceName,
          resourceType: currentResource.resourceType,
          version: '',
          contracts: allContracts
            .map((c: any) => {
              // console.log(c, '当前合约');
              // console.log(i, '关系');
              return {
                checked: true,
                id: c.contractId,
                policyId: c.policyId,
                title: c.contractName,
                // status: c.status === 0 ? 'stopping' : 'executing',
                status: c.status === 1 ? 2 : ((c.authStatus & 1) === 1) ? 1 : 0,
                code: c.policyInfo.policyText,
                date: moment(c.createDate).format('YYYY-MM-DD HH:mm'),
                // versions: [{$version: '10.5.2', checked: true}, {$version: '10.5.3', checked: false}]
                versions: allEnabledVersions.map((v: string) => {
                  // console.log(i, currentResource, c, v, 'aw39osidc');
                  const versionContracts = i.versions?.find((version: any) => version.version === v)?.contracts;
                  const versionChecked: boolean = !!versionContracts?.find((contract: any) => contract.contractId === c.contractId);
                  return {
                    version: v,
                    checked: versionChecked,
                    disabled: (versionContracts.length === 1) && versionChecked,
                  };
                }),
              };
            }),
          policies: allEnabledPolicies.map((policy: any) => ({
            id: policy.policyId,
            title: policy.policyName,
            code: policy.policyText,
            allEnabledVersions: allEnabledVersions,
          })),
        }
      });
      // console.log(contractsAuthorized, 'contractsAuthorized');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          contractsAuthorized,
        },
      });
    },
    * fetchAuthorize({payload}: FetchAuthorizeAction, {call, put, select}: EffectsCommandMap) {
      const {resourceAuthPage}: ConnectState = yield select(({resourceAuthPage}: ConnectState) => ({
        resourceAuthPage,
      }));

      const params: Parameters<typeof FApiServer.Contract.contracts>[0] = {
        identityType: 1,
        licensorId: resourceAuthPage.resourceID,
        limit: FUtil.Predefined.pageSize,
      };
      // console.log('@#RWEQFRSDF');
      const {data} = yield call(FApiServer.Contract.contracts, params);
      // console.log(data, '12342139(((((()))()())(134');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          contractsAuthorize: data.dataList.map((i: any) => ({
            key: i.contractId,
            contractName: i.contractName,
            contractID: i.contractId,
            authorizedParty: i.licenseeName,
            licenseeIdentityType: i.licenseeIdentityType,
            createDate: moment(i.createDate).format('YYYY-MM-DD HH:mm'),
            // status: i.isAuth ? 'executing' : 'stopped',
            status: i.status === 1 ? 2 : ((i.authStatus & 1) === 1) ? 1 : 0,
          })),
        }
      });
    },
    * updateAuthorized({payload}: UpdateAuthorizedAction, {select, call, put}: EffectsCommandMap) {
      // const {resourceId, activatedResourceId} = yield select(({resourceInfo, resourceAuthPage}: ConnectState) => ({
      //   resourceId: resourceInfo.info?.resourceId,
      //   activatedResourceId: (resourceAuthPage.contractsAuthorized.find((auth) => auth.activated) as any).id,
      // }));
      const {resourceAuthPage}: ConnectState = yield select(({resourceAuthPage}: ConnectState) => ({
        resourceAuthPage,
      }));
      const params: Parameters<typeof FApiServer.Resource.batchSetContracts>[0] = {
        resourceId: resourceAuthPage.resourceID,
        subjects: [{
          subjectId: (resourceAuthPage.contractsAuthorized.find((auth) => auth.activated) as any).id,
          versions: payload,
        }],
      };
      const {data} = yield call(FApiServer.Resource.batchSetContracts, params);
      yield put<FetchAuthorizedAction>({
        type: 'fetchAuthorized',
        payload: {
          // baseResourceId: resourceInfo.info?.resourceId || '',
          activatedResourceId: (resourceAuthPage.contractsAuthorized.find((auth) => auth.activated) as any).id,
        },
      });
    },
  },
  reducers: {
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      };
    },
  },
  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {
    },
  },
};

export default Model;
