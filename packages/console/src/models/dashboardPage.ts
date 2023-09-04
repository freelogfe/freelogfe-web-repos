import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import moment, { Moment } from 'moment';
// import { NodesModelState } from '@/models/nodes';

export interface DashboardPageModelState {
  resourceStatistic: {
    totalProfit: string;
    lastWeekProfit: string;
    lastWeekContract: string;
  };

  latestResources: {
    resourceID: string;
    resourceName: string;
    cover: string;
    type: string[];
    policies: string[];
    dataTime: string;
    detailUrl: string;
    editUrl: string;
    updateUrl: string;
  }[];

  nodeStatistic: {
    totalProfit: string;
    lastWeekProfit: string;
    lastWeekContract: string;
  };

  allNode: {
    nodeID: string;
    nodeDomain: string;
    nodeName: string;
    displayUrl: string;
    managingUrl: string;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<DashboardPageModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'dashboardPage/onMount_Page';
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'dashboardPage/OnUnmount_Page';
}

export interface FetchInfoAction extends AnyAction {
  type: 'fetchInfo';
}

interface DashboardPageModelType {
  namespace: 'dashboardPage';
  state: DashboardPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<DashboardPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: DashboardPageModelState = {
  resourceStatistic: {
    totalProfit: '0',
    lastWeekProfit: '0',
    lastWeekContract: '0',
  },

  latestResources: [],

  nodeStatistic: {
    totalProfit: '0',
    lastWeekProfit: '0',
    lastWeekContract: '0',
  },

  allNode: [],
};

const Model: DashboardPageModelType = {
  namespace: 'dashboardPage',
  state: initStates,
  effects: {
    * onMount_Page({ }: OnMount_Page_Action, { call, put }: EffectsCommandMap) {
      const params1: Parameters<typeof FServiceAPI.Statistic.transactionsCommon>[0] = {
        ownerId: FUtil.Tool.getUserIDByCookies(),
        ownerType: 1,
        objectType: 2,
      };
      const { data: data_Resource_Total_Amount } = yield call(FServiceAPI.Statistic.transactionsCommon, params1);
      // console.log(data_RT, 'DDDsoiwsdflsadk');

      const params2: Parameters<typeof FServiceAPI.Statistic.transactionsCommon>[0] = {
        ownerId: FUtil.Tool.getUserIDByCookies(),
        ownerType: 1,
        objectType: 3,
      };
      const { data: data_Node_Total_Amount } = yield call(FServiceAPI.Statistic.transactionsCommon, params2);
      // console.log(data_NT, 'DDDsoiwsdflsadk222222');

      const startTime: string = moment().subtract(1, 'weeks').format(FUtil.Predefined.momentDateFormat);
      const endTime: string = moment().format(FUtil.Predefined.momentDateFormat);
      const params3: Parameters<typeof FServiceAPI.Statistic.transactionsCommon>[0] = {
        ownerId: FUtil.Tool.getUserIDByCookies(),
        ownerType: 1,
        objectType: 2,
        beginDate: startTime,
        endDate: endTime,
      };
      const { data: data_Resource_LastWeek_Amount } = yield call(FServiceAPI.Statistic.transactionsCommon, params3);
      // console.log(data_RL, 'DDDsoiwsdflsadk');

      const params4: Parameters<typeof FServiceAPI.Statistic.transactionsCommon>[0] = {
        ownerId: FUtil.Tool.getUserIDByCookies(),
        ownerType: 1,
        objectType: 3,
        beginDate: startTime,
        endDate: endTime,
      };
      const { data: data_Node_LastWeek_Amount } = yield call(FServiceAPI.Statistic.transactionsCommon, params4);
      // console.log(data_NL, 'DDDsoiwsdflsadk222222');

      const params5: Parameters<typeof FServiceAPI.Resource.list>[0] = {
        skip: 0,
        limit: 3,
        // status: Number(resourceListPage.resourceStatus) as 0 | 1 | 2,
        isSelf: 1,
        sort: 'createDate:-1',
      };
      const { data: data_ResourceList } = yield call(FServiceAPI.Resource.list, params5);
      console.log(data_ResourceList, 'data_ResourceList 0392iojklsdf');

      const params6: Parameters<typeof FServiceAPI.Node.nodes>[0] = {
        limit: FUtil.Predefined.pageSize,
      };
      const { data: data_AllNodes } = yield call(FServiceAPI.Node.nodes, params6);
      console.log(data_AllNodes, 'data_AllNodes09ioj;lksdf');

      const params7: Parameters<typeof FServiceAPI.Contract.contractsSignCount>[0] = {
        objectIds: FUtil.Tool.getUserIDByCookies(),
        objectType: 2,
        subjectType: 1,
        startDate: startTime,
        endDate: endTime,
      };

      const { data: data_Resource_LastWeek_SingCount } = yield call(FServiceAPI.Contract.contractsSignCount, params7);

      // console.log(data_Resource_LastWeek_SingCount, 'data_Resource_LastWeek_SingCountoislkdfjlk');

      const params8: Parameters<typeof FServiceAPI.Contract.contractsSignCount>[0] = {
        objectIds: FUtil.Tool.getUserIDByCookies(),
        objectType: 2,
        subjectType: 2,
        startDate: startTime,
        endDate: endTime,
      };

      const { data: data_Node_LastWeek_SingCount } = yield call(FServiceAPI.Contract.contractsSignCount, params8);

      // console.log(data_Node_LastWeek_SingCount, 'data_Node_LastWeek_SingCountingCountoislkdfjlk');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceStatistic: {
            totalProfit: data_Resource_Total_Amount,
            lastWeekProfit: data_Resource_LastWeek_Amount,
            lastWeekContract: data_Resource_LastWeek_SingCount[0].count,
          },
          latestResources: (data_ResourceList.dataList as any[]).map<DashboardPageModelState['latestResources'][number]>((r) => {
            return {
              resourceID: r.resourceId,
              resourceName: r.resourceName,
              cover: r.coverImages[0] || '',
              type: r.resourceType,
              policies: r.policies
                .filter((p: any) => {
                  return p.status === 1;
                })
                .map((p: any) => {
                  return p.policyName;
                }),
              dataTime: FUtil.Format.formatDateTime(r.createDate, true),
              detailUrl: FUtil.LinkTo.resourceDetails({ resourceID: r.resourceId }),
              editUrl: FUtil.LinkTo.resourceInfo({ resourceID: r.resourceId }),
              updateUrl: FUtil.LinkTo.resourceVersionCreator({ resourceID: r.resourceId }),
            };
          }),

          nodeStatistic: {
            totalProfit: data_Node_Total_Amount,
            lastWeekProfit: data_Node_LastWeek_Amount,
            lastWeekContract: data_Node_LastWeek_SingCount[0].count,
          },

          allNode: (data_AllNodes.dataList as any[]).map<DashboardPageModelState['allNode'][number]>((dl: any, i: number) => {
            return {
              nodeID: dl.nodeId,
              nodeDomain: dl.nodeDomain,
              nodeName: dl.nodeName,
              displayUrl: FUtil.Format.completeUrlByDomain(dl.nodeDomain),
              managingUrl: FUtil.LinkTo.nodeManagement({ nodeID: dl.nodeId }),
            };
          }),
        },
      });
    },
    * onUnmount_Page({ }: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchInfo({ }: FetchInfoAction, { }: EffectsCommandMap) {

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
    setup({ }) {

    },
  },
};

export default Model;
