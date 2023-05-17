import { DvaReducer } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';
import { FUtil, FServiceAPI, FI18n } from '@freelog/tools-lib';
import fMessage from '@/components/fMessage';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
// import { fileAttrUnits } from '@/utils/format';

export interface ResourceDetailPageModelState {
  page_State: 'loading' | 'details' | 'signPage';
  user_Logged: boolean;

  resource_ID: string;
  resource_Info: null | {
    cover: string;
    name: string;
    type: string[];
    tags: string[];
    about: string;
  };
  resource_Popularity: number;
  resource_IsCollected: boolean;

  // 所有可签约的节点 ID
  sign_SignedNodeIDs: number[];
  sign_SelectedNodeID: number;
  sign_AllRawResources: {
    resourceId: string;
    resourceName: string;
    resourceType: string[];
    status: 0 | 1 | 2 | 4;
    authProblem: boolean;
    policies: PolicyFullInfo_Type[],
    userId: number;
  }[];
  sign_SignResources: {
    selected: boolean;
    id: string;
    name: string;
    type: string[];
    // status: 0 | 1;
    // authProblem: boolean;
    error: '' | 'offline' | 'freeze' | 'unreleased';
    warning: '' | 'authException' | 'ownerFreeze';
    contracts: {
      checked: boolean;
      id: string;
      name: string;
      text: string;
      createTime: string;
      policyID: string;
      status: 'active' | 'testActive' | 'inactive' | 'terminal';
      exhibits: {
        exhibitID: string;
        exhibitName: string;
      }[];
    }[];
    terminatedContractIDs: string[];
    policies: {
      checked: boolean;
      fullInfo: PolicyFullInfo_Type;
    }[];
  }[];
  sign_SignedResourceExhibitID: string;
  sign_SignExhibitName: string;
  sign_SignExhibitNameErrorTip: string;

  resourceVersion_SelectedVersion: string;
  resourceVersion_AllVersions: string[];
  resourceVersion_Info: {
    releaseTime: string;
    description: string;
    rawProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    baseProperties: {
      key: string;
      name: string;
      value: string;
      description: string;
    }[];
    customOptions: {
      key: string;
      name: string;
      description: string;
      type: 'input' | 'select';
      input: string;
      select: string[];
    }[];
  };

  // graphShow: boolean;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceDetailPage/change';
  payload: Partial<ResourceDetailPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'resourceDetailPage/onMountPage';
  payload: {
    resourceID: string;
  },
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'resourceDetailPage/onUnmountPage';
}

export interface OnChangeVersionAction extends AnyAction {
  type: 'resourceDetailPage/onChangeVersion';
  payload: {
    version: string;
  },
}

export interface OnClickCollectionAction extends AnyAction {
  type: 'resourceDetailPage/onClickCollection';
}

export interface OnChangeNodeSelectorAction extends AnyAction {
  type: 'resourceDetailPage/onChangeNodeSelector';
  payload: -1 | number;
}

export interface OnClick_SignBtn_Action extends AnyAction {
  type: 'resourceDetailPage/onClick_SignBtn';
}

export interface OnClick_ConfirmSignContract_Action extends AnyAction {
  type: 'resourceDetailPage/onClick_ConfirmSignContract';
}

export interface OnChangeAndVerifySignExhibitNameAction extends AnyAction {
  type: 'resourceDetailPage/onChangeAndVerifySignExhibitName';
  payload: string;
}

export interface FetchInfoActionAction extends AnyAction {
  type: 'fetchInfo';
}

export interface FetchCollectionInfoAction extends AnyAction {
  type: 'fetchCollectionInfo';
}

export interface FetchSignedNodesAction extends AnyAction {
  type: 'fetchSignedNodes';
}

export interface FetchVersionInfoAction extends AnyAction {
  type: 'fetchVersionInfo';
}

interface ResourceDetailPageModelType {
  namespace: 'resourceDetailPage';
  state: ResourceDetailPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
    onChangeVersion: (action: OnChangeVersionAction, effects: EffectsCommandMap) => void;
    onClickCollection: (action: OnClickCollectionAction, effects: EffectsCommandMap) => void;
    onChangeNodeSelector: (action: OnChangeNodeSelectorAction, effects: EffectsCommandMap) => void;
    onClick_SignBtn: (action: OnClick_SignBtn_Action, effects: EffectsCommandMap) => void;
    onClick_ConfirmSignContract: (action: OnClick_ConfirmSignContract_Action, effects: EffectsCommandMap) => void;
    onChangeAndVerifySignExhibitName: (action: OnChangeAndVerifySignExhibitNameAction, effects: EffectsCommandMap) => void;
    fetchInfo: (action: FetchInfoActionAction, effects: EffectsCommandMap) => void;
    fetchCollectionInfo: (action: FetchCollectionInfoAction, effects: EffectsCommandMap) => void;
    fetchSignedNodes: (action: FetchSignedNodesAction, effects: EffectsCommandMap) => void;
    fetchVersionInfo: (action: FetchVersionInfoAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceDetailPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ResourceDetailPageModelState = {
  page_State: 'loading',
  user_Logged: FUtil.Tool.getUserIDByCookies() !== -1,

  resource_ID: '',
  resource_Info: {
    cover: '',
    name: '',
    type: [],
    tags: [],
    about: '',
  },
  resource_Popularity: 0,
  resource_IsCollected: false,

  sign_SignedNodeIDs: [],
  sign_SelectedNodeID: -1,
  sign_AllRawResources: [],
  sign_SignResources: [],
  sign_SignedResourceExhibitID: '',
  sign_SignExhibitName: '',
  sign_SignExhibitNameErrorTip: '',

  resourceVersion_SelectedVersion: '',
  resourceVersion_AllVersions: [],
  resourceVersion_Info: {
    releaseTime: '',
    description: '',
    rawProperties: [],
    baseProperties: [],
    customOptions: [],
  },
};

const Model: ResourceDetailPageModelType = {
  namespace: 'resourceDetailPage',
  state: initStates,
  effects: {
    * onMountPage({ payload }: OnMountPageAction, { put }: EffectsCommandMap) {
      yield put({
        type: 'change',
        payload: {
          resource_ID: payload.resourceID,
          user_Logged: FUtil.Tool.getUserIDByCookies() !== -1,
        },
      });
      // console.log('onMountPage', '####3');
      if (FUtil.Tool.getUserIDByCookies() !== -1) {

        yield put<FetchSignedNodesAction>({
          type: 'fetchSignedNodes',
        });
      }
      yield put<FetchCollectionInfoAction>({
        type: 'fetchCollectionInfo',
      });
      yield put<FetchInfoActionAction>({
        type: 'fetchInfo',
      });
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onChangeVersion({ payload }: OnChangeVersionAction, { put }: EffectsCommandMap) {
      console.log(payload, 'onChangeVersion 9832piohksdflkj');
      yield put({
        type: 'change',
        payload: {
          // version: '',
          resourceVersion_SelectedVersion: payload.version,
        },
      });

      yield put<FetchVersionInfoAction>({
        type: 'fetchVersionInfo',
      });
    },

    * onClickCollection({}: OnClickCollectionAction, { select, call, put }: EffectsCommandMap) {
      const { resourceDetailPage }: ConnectState = yield select(({ resourceDetailPage }: ConnectState) => ({
        resourceDetailPage,
      }));

      if (!resourceDetailPage.resource_IsCollected) {
        const params: Parameters<typeof FServiceAPI.Collection.collectResource>[0] = {
          resourceId: resourceDetailPage.resource_ID,
        };
        yield call(FServiceAPI.Collection.collectResource, params);
      } else {
        const params: Parameters<typeof FServiceAPI.Collection.deleteCollectResource>[0] = {
          resourceId: resourceDetailPage.resource_ID,
        };
        yield call(FServiceAPI.Collection.deleteCollectResource, params);
      }

      yield put<FetchCollectionInfoAction>({
        type: 'fetchCollectionInfo',
      });
    },
    * onChangeNodeSelector({ payload }: OnChangeNodeSelectorAction, { put, select, call }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          sign_SelectedNodeID: payload,
        },
      });

      const { resourceDetailPage }: ConnectState = yield select(({ resourceDetailPage }: ConnectState) => ({
        resourceDetailPage,
      }));

      const allRawResourceIDs = resourceDetailPage.sign_AllRawResources.map((r: any) => r.resourceId);

      const params: GetAllContractsParamsType = {
        nodeID: payload,
        resourceIDs: allRawResourceIDs,
      };

      const result: GetAllContractsReturnType = yield call(getAllContracts, params);
      // console.log(result, 'result1234234234234');

      const params1: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
        nodeId: payload,
        resourceId: resourceDetailPage.resource_ID,
      };
      const { data: data1 } = yield call(FServiceAPI.Exhibit.presentableDetails, params1);

      let data2: any[] = [];
      const contractIds = result.flat().map((cr) => cr.contractId).join(',');
      if (contractIds) {
        const params2: Parameters<typeof FServiceAPI.Exhibit.contractAppliedPresentable>[0] = {
          nodeId: payload,
          contractIds: result.flat().map((cr) => cr.contractId).join(','),
        };

        const { data } = yield call(FServiceAPI.Exhibit.contractAppliedPresentable, params2);
        data2 = data;
      }

      const allUserID: number[] = resourceDetailPage.sign_AllRawResources.map<number>((dbr) => {
        return dbr.userId;
      });

      const params3: Parameters<typeof FServiceAPI.User.batchUserList>[0] = {
        userIds: allUserID.join(','),
      };

      const { data: data_batchUserList } = yield call(FServiceAPI.User.batchUserList, params3);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          sign_SignedResourceExhibitID: data1?.presentableId || '',
          sign_SignResources: resourceDetailPage.sign_AllRawResources
            .map<ResourceDetailPageModelState['sign_SignResources'][number]>((value, index) => {
              const contracts: ResourceDetailPageModelState['sign_SignResources'][number]['contracts'] = result[index]
                .filter((c) => {
                  return c.status === 0;
                })
                .map((c) => {
                  const exhibits = data2.find((d2: any) => d2.contractId === c.contractId)
                    ?.presentables.map((pb: any) => {
                      return {
                        exhibitID: pb.presentableId,
                        exhibitName: pb.presentableName,
                      };
                    });
                  return {
                    // checked: false,
                    checked: true,
                    id: c.contractId,
                    name: c.contractName,
                    text: c.policyInfo.policyText,
                    createTime: FUtil.Format.formatDateTime(c.createDate),
                    policyID: c.policyInfo.policyId,
                    status: c.status === 1 ? 'terminal' : (c.authStatus === 1 || c.authStatus === 3) ? 'active' : c.authStatus === 2 ? 'testActive' : 'inactive',
                    exhibits: exhibits || [],
                  };
                });

              // console.log(contracts, 'contractsoisedjeflksdjlfkjsdlfkjl');
              const allContractUsedPolicyIDs: string[] = contracts
                .filter((cp) => cp.status !== 'terminal')
                .map<string>((cp) => cp.policyID);
              const policies: ResourceDetailPageModelState['sign_SignResources'][number]['policies'] = value.policies
                .filter((rsp: any) => rsp.status === 1 && !allContractUsedPolicyIDs.includes(rsp.policyId))
                .map((rsp: any) => ({
                  checked: false,
                  fullInfo: rsp,
                }));

              const ownerUserInfo = data_batchUserList.find((dbu: any) => {
                return dbu.userId === value.userId;
              });

              return {
                selected: index === 0,
                id: value.resourceId,
                name: value.resourceName,
                type: value.resourceType,
                // status: value.status,
                // authProblem: value.authProblem,
                error: value.status === 0
                  ? 'unreleased'
                  : value.status === 2
                    ? 'freeze'
                    : value.status === 4
                      ? 'offline'
                      : '',
                warning: ownerUserInfo.status === 1
                  ? 'ownerFreeze'
                  : value.authProblem
                    ? 'authException'
                    : '',
                contracts: contracts,
                terminatedContractIDs: result[index]
                  .filter((c) => {
                    return c.status === 1;
                  })
                  .map((c) => {
                    return c.contractId;
                  }),
                policies: policies,
              };
            }),
        },
      });
    },

    * onClick_SignBtn({}: OnClick_SignBtn_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceDetailPage }: ConnectState = yield select(({ resourceDetailPage }: ConnectState) => ({
        resourceDetailPage,
      }));

      const needVerifyResource: {
        id: string;
        policyIDs: string[];
      }[] = resourceDetailPage.sign_SignResources.map((sr: any) => {
        return {
          id: sr.id,
          policyIDs: sr.policies.filter((p: any) => {
            return p.checked;
          }).map((p: any) => {
            return p.fullInfo.policyId;
          }),
        };
      });

      const params1: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
        resourceIds: needVerifyResource.map((r) => r.id).join(','),
      };

      const { data: data1 } = yield call(FServiceAPI.Resource.batchInfo, params1);

      // console.log(data1, 'data1903lkjlksdf');

      const realTimeResourceOnlinePolicyIDs: {
        id: string;
        policyIDs: string[];
      }[] = data1.map((d: any) => {
        return {
          id: d.resourceId,
          policyIDs: d.policies.filter((p: any) => {
            return p.status === 1;
          }).map((p: any) => {
            return p.policyId;
          }),
        };
      });

      // console.log(needVerifyResource, realTimeResourceOnlinePolicyIDs, '###3902803498023840234808200');

      for (const r1 of needVerifyResource) {
        const res = realTimeResourceOnlinePolicyIDs.find((rt) => {
          return rt.id === r1.id;
        });

        if ((res?.policyIDs.length || 0) === 0) {
          fMessage(FI18n.i18nNext.t('alarm_resource_not_available'), 'error');
          return;
        }

        // console.log(res, r1, '#######02948093u4o23uj4ojlk');
        for (const p1 of r1.policyIDs) {
          if (!res?.policyIDs.includes(p1)) {
            fMessage(FI18n.i18nNext.t('alarm_plan_not_available'), 'error');
            return;
          }
        }

      }

      const params: Parameters<typeof getAvailableExhibitName>[0] = {
        nodeID: resourceDetailPage.sign_SelectedNodeID,
        exhibitName: resourceDetailPage.resource_Info?.name.split('/')[1] || '',
      };

      const signExhibitName: string = yield call(getAvailableExhibitName, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          sign_SignExhibitName: signExhibitName,
          sign_SignExhibitNameErrorTip: '',
          page_State: 'signPage',
        },
      });
      // window.history.pushState({}, '确认签约');
    },
    * onClick_ConfirmSignContract({}: OnClick_ConfirmSignContract_Action, { call, select, put }: EffectsCommandMap) {
      const { resourceDetailPage }: ConnectState = yield select(({ resourceDetailPage }: ConnectState) => ({
        resourceDetailPage,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.createPresentable>[0] = {
        nodeId: resourceDetailPage.sign_SelectedNodeID,
        resourceId: resourceDetailPage.resource_ID,
        version: resourceDetailPage.resourceVersion_SelectedVersion,
        presentableName: resourceDetailPage.sign_SignExhibitName,
        resolveResources: resourceDetailPage.sign_SignResources.map((sr: any) => ({
          resourceId: sr.id,
          contracts: [
            ...sr.contracts.filter((srp: any) => srp.checked && srp.status !== 'terminal')
              .map((srp: any) => {
                return {
                  policyId: srp.policyID,
                };
              }),
            ...sr.policies.filter((srp: any) => srp.checked)
              .map((srp: any) => {
                return {
                  policyId: srp.fullInfo.policyId,
                };
              }),
          ],
        })),
      };
      const { data, ret, errCode, msg } = yield call(FServiceAPI.Exhibit.createPresentable, params);
      if (ret !== 0 || errCode !== 0) {
        self._czc?.push(['_trackEvent', '确认签约页', '确认签约', '', 0]);
        fMessage(msg, 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '确认签约页', '确认签约', '', 1]);
      history.push(FUtil.LinkTo.exhibitManagement({ exhibitID: data.presentableId }));
    },
    * onChangeAndVerifySignExhibitName({ payload }: OnChangeAndVerifySignExhibitNameAction, {
      put,
      select,
      call,
    }: EffectsCommandMap) {
      if (!FUtil.Regexp.EXHIBIT_NAME.test(payload)) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            sign_SignExhibitName: payload,
            sign_SignExhibitNameErrorTip: FI18n.i18nNext.t('naming_convention_exhibits_name'),
          },
        });
        return;
      }
      const { resourceDetailPage }: ConnectState = yield select(({ resourceDetailPage, nodes }: ConnectState) => ({
        resourceDetailPage,
        nodes,
      }));

      const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
        nodeId: resourceDetailPage.sign_SelectedNodeID,
        presentableName: payload,
      };
      const { data } = yield call(FServiceAPI.Exhibit.presentableDetails, params);
      if (data) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            sign_SignExhibitName: payload,
            sign_SignExhibitNameErrorTip: FI18n.i18nNext.t('exhibits_name_exist'),
          },
        });
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          sign_SignExhibitName: payload,
          sign_SignExhibitNameErrorTip: '',
        },
      });
    },
    * fetchInfo({}: FetchInfoActionAction, { call, put, select }: EffectsCommandMap) {
      const { resourceDetailPage }: ConnectState = yield select(({ resourceDetailPage }: ConnectState) => ({
        resourceDetailPage,
      }));
      // console.log('fetchInfo ####9823u4oi');
      const params: Parameters<typeof handleResourceBatchInfo>[0] = {
        resourceIDs: [resourceDetailPage.resource_ID],
      };

      // 本次要添加的一些列资源信息
      const [data_ResourceDetail]: HandleResourceBatchInfoReturn = yield call(handleResourceBatchInfo, params);
      // console.log(data, ' data2309');

      if ((data_ResourceDetail.status & 2) === 2) {
        history.replace(FUtil.LinkTo.resourceFreeze({ resourceID: resourceDetailPage.resource_ID }));
        return;
      }

      let rawSignResources: ResourceDetailPageModelState['sign_AllRawResources'] = [data_ResourceDetail];

      // console.log(data.baseUpcastResources, 'data.baseUpcastResources908898888888');

      // 获取上抛资源信息
      if (data_ResourceDetail.status === 1 && (data_ResourceDetail.baseUpcastResources || []).length > 0) {
        // console.log(data.baseUpcastResources.map((r: any) => r.resourceId), '0928384u290u49023');

        const params: Parameters<typeof handleResourceBatchInfo>[0] = {
          resourceIDs: data_ResourceDetail.baseUpcastResources.map((r) => r.resourceId),
        };

        // 本次要添加的一些列资源信息
        const data_BatchInfos: HandleResourceBatchInfoReturn = yield call(handleResourceBatchInfo, params);

        rawSignResources = [
          ...rawSignResources,
          ...data_BatchInfos,
        ];
      }

      // console.log(rawSignResources, 'rawSignResources2309ef');
      // console.log(data, 'data893lksdflk');

      const allUserID: number[] = rawSignResources.map<number>((dbr) => {
        return dbr.userId;
      });

      const params3: Parameters<typeof FServiceAPI.User.batchUserList>[0] = {
        userIds: allUserID.join(','),
      };

      const { data: data_batchUserList } = yield call(FServiceAPI.User.batchUserList, params3);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          page_State: 'details',
          resource_Info: {
            cover: data_ResourceDetail.coverImages.length > 0 ? data_ResourceDetail.coverImages[0] : '',
            name: data_ResourceDetail.resourceName,
            type: data_ResourceDetail.resourceType,
            tags: data_ResourceDetail.tags,
            about: data_ResourceDetail.intro,
          },
          resourceVersion_AllVersions: data_ResourceDetail.resourceVersions.map((v: any) => v.version),
          resourceVersion_SelectedVersion: resourceDetailPage.resourceVersion_SelectedVersion || data_ResourceDetail.latestVersion,

          sign_AllRawResources: rawSignResources,

          sign_SignResources: rawSignResources
            .map<ResourceDetailPageModelState['sign_SignResources'][number]>((rs, i: number) => {
              const ownerUserInfo = data_batchUserList.find((dbu: any) => {
                return dbu.userId === rs.userId;
              });
              return {
                selected: i === 0,
                id: rs.resourceId,
                name: rs.resourceName,
                type: rs.resourceType,
                status: rs.status,
                authProblem: rs.authProblem,
                error: rs.status === 0
                  ? 'unreleased'
                  : rs.status === 2
                    ? 'freeze'
                    : rs.status === 4
                      ? 'offline'
                      : '',
                warning: ownerUserInfo.status === 1
                  ? 'ownerFreeze'
                  : rs.authProblem
                    ? 'authException'
                    : '',
                contracts: [],
                terminatedContractIDs: [],
                policies: rs.policies
                  .filter((srp) => srp.status === 1)
                  .map((rsp) => ({
                    checked: false,
                    fullInfo: rsp,
                  })),
              };
            }),
        },
      });
      // console.log(marketResourcePage.version, data.latestVersion, 'marketResourcePage.version || data.latestVersio');

      if (!data_ResourceDetail.latestVersion || !!resourceDetailPage.resourceVersion_SelectedVersion) {
        return;
      }

      yield put<FetchVersionInfoAction>({
        type: 'fetchVersionInfo',
      });

    },
    * fetchCollectionInfo({}: FetchCollectionInfoAction, { call, select, put }: EffectsCommandMap) {
      // console.log('进入获取收藏', 'FGHSDGf09uj4k2t;ldfs');
      const { resourceDetailPage }: ConnectState = yield select(({ resourceDetailPage }: ConnectState) => ({
        resourceDetailPage,
      }));

      let isCollected: boolean = false;
      if (resourceDetailPage.user_Logged) {
        const params1: Parameters<typeof FServiceAPI.Collection.isCollected>[0] = {
          resourceIds: resourceDetailPage.resource_ID,
        };

        const { data: data1 } = yield call(FServiceAPI.Collection.isCollected, params1);

        isCollected = data1[0].isCollected;
      }

      const params2: Parameters<typeof FServiceAPI.Collection.collectedCount>[0] = {
        resourceId: resourceDetailPage.resource_ID,
      };

      const { data: data2 } = yield call(FServiceAPI.Collection.collectedCount, params2);
      // console.log(data2, '收藏数量FGHSDGf09uj4k2t;ldfs');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resource_IsCollected: isCollected,
          resource_Popularity: data2,
        },
      });
    },
    * fetchSignedNodes({}: FetchSignedNodesAction, { select, call, put }: EffectsCommandMap) {
      const { resourceDetailPage }: ConnectState = yield select(({ resourceDetailPage }: ConnectState) => ({
        resourceDetailPage,
      }));
      // 获取当前用户与当前资源签过约的所有节点
      const params3: Parameters<typeof FServiceAPI.Exhibit.presentableList>[0] = {
        userId: FUtil.Tool.getUserIDByCookies(),
        resourceIds: resourceDetailPage.resource_ID,
        // projection: 'nodeId',
      };

      const { data: data3 } = yield call(FServiceAPI.Exhibit.presentableList, params3);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          sign_SignedNodeIDs: data3.map((p: any) => p.nodeId),
        },
      });
    },
    * fetchVersionInfo({}: FetchVersionInfoAction, { call, select, put }: EffectsCommandMap) {

      const { resourceDetailPage }: ConnectState = yield select(({ resourceDetailPage }: ConnectState) => ({
        resourceDetailPage,
      }));

      if (!resourceDetailPage.resourceVersion_SelectedVersion) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo1>[0] = {
        version: resourceDetailPage.resourceVersion_SelectedVersion,
        resourceId: resourceDetailPage.resource_ID,
      };
      // console.log('resourceVersionInfo1239weiojfasdlkfjslk');
      const { data: data_versionInfo }: {
        data: {
          customPropertyDescriptors: {
            key: string;
            name: string;
            defaultValue: string;
            type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
            candidateItems: string[];
            remark: string;
          }[],
          systemProperty: { [key: string]: string; },
          systemPropertyDescriptors: {
            defaultValue: number | string;
            key: string;
            name: string;
            remark: string;
            valueDisplay: string;
            valueUnit: string;
          }[];
          createDate: string;
          description: string;
        }
      } = yield call(FServiceAPI.Resource.resourceVersionInfo1, params);

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceVersion_Info: {
            releaseTime: FUtil.Format.formatDateTime(data_versionInfo.createDate),
            description: data_versionInfo.description,
            // rawProperties: Object.entries(data_versionInfo.systemProperty as object)
            //   .map((s) => ({
            //     key: s[0],
            //     value: fileAttrUnits[s[0]] ? fileAttrUnits[s[0]](s[1]) : s[1],
            //   })),
            rawProperties: data_versionInfo.systemPropertyDescriptors.map((spd) => {
              return {
                key: spd.key,
                name: spd.name,
                value: spd.valueDisplay,
                description: spd.remark,
              };
            }),
            baseProperties: data_versionInfo.customPropertyDescriptors
              .filter((p) => {
                return p.type === 'readonlyText';
              })
              .map((p: any) => {
                // console.log(p, 'PPPPP()*UOI');
                return {
                  key: p.key,
                  name: p.name,
                  value: p.defaultValue,
                  description: p.remark,
                };
              }),
            // properties: [
            //   ...Object.entries(data.systemProperty as object)
            //     .map((s) => ({
            //       key: s[0],
            //       value: fileAttrUnits[s[0]] ? fileAttrUnits[s[0]](s[1]) : s[1],
            //     })),
            //   ...data.customPropertyDescriptors.filter((p: any) => p.type === 'readonlyText')
            //     .map((p: any) => {
            //       // console.log(p, 'PPPPP()*UOI');
            //       return {
            //         key: p.key,
            //         value: p.defaultValue,
            //         description: p.remark,
            //       };
            //     }),
            // ],
            customOptions: data_versionInfo.customPropertyDescriptors
              .filter((i) => {
                return i.type !== 'readonlyText';
              })
              .map((i) => {
                // console.log(p, '@@@@@@#$#@$@#$@#');
                return {
                  key: i.key,
                  name: i.name,
                  description: i.remark,
                  type: i.type === 'editableText' ? 'input' : 'select',
                  input: i.defaultValue,
                  select: i.candidateItems,
                };
              }),
          },
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
  status: number;
  authStatus: number;
}[][];

async function getAllContracts({ nodeID, resourceIDs }: GetAllContractsParamsType): Promise<GetAllContractsReturnType> {
  const allPromises = resourceIDs.map(async (id) => {
    const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
      subjectIds: id,
      subjectType: 1,
      licenseeIdentityType: 2,
      licensorId: id,
      licenseeId: nodeID,
      isLoadPolicyInfo: 1,
    };
    const { data } = await FServiceAPI.Contract.batchContracts(params);
    return data;
  });

  return await Promise.all(allPromises);
}

// interface GetAllContractExhibitsParamsType {
//   resourceIDs: string[];
//   nodeID: number;
// }
//
// async function getAllContractExhibits({ resourceIDs, nodeID }: GetAllContractExhibitsParamsType) {
//   const allPromises = resourceIDs.map(async (rid) => {
//     const params: Parameters<typeof FServiceAPI.Contract.batchContracts>[0] = {
//       licenseeIdentityType: 2,
//       licensorId: rid,
//       licenseeId: nodeID,
//     };
//     const { data } = await FServiceAPI.Contract.batchContracts(params);
//     return data;
//   });
//   return await Promise.all(allPromises);
// }

interface GetAvailableExhibitNameParamType {
  nodeID: number;
  exhibitName: string;
  suffixNum?: number;
}

async function getAvailableExhibitName({
                                         nodeID,
                                         exhibitName,
                                         suffixNum = 0,
                                       }: GetAvailableExhibitNameParamType): Promise<string> {
  const name: string = exhibitName + (suffixNum ? `_${suffixNum}` : '');
  const params: Parameters<typeof FServiceAPI.Exhibit.presentableDetails>[0] = {
    nodeId: nodeID,
    presentableName: name,
  };
  const { data } = await FServiceAPI.Exhibit.presentableDetails(params);
  if (data) {
    return await getAvailableExhibitName({
      nodeID,
      exhibitName,
      suffixNum: suffixNum + 1,
    });
  }

  return name;
}

interface HandleResourceBatchInfoParams {
  resourceIDs: string[];
}

type HandleResourceBatchInfoReturn = {
  resourceId: string;
  resourceName: string;
  resourceType: string[];
  latestVersion: string;
  coverImages: string[];
  status: 0 | 1;
  policies: PolicyFullInfo_Type[];
  resourceVersions: {
    createDate: string;
    version: string;
  }[];
  baseUpcastResources: {
    resourceId: string;
    resourceName: string;
  }[];
  tags: string[];
  intro: string;
  authProblem: boolean;
  freezeReason: string;
  userId: number;
}[];

async function handleResourceBatchInfo({ resourceIDs }: HandleResourceBatchInfoParams): Promise<HandleResourceBatchInfoReturn> {

  if (resourceIDs.length === 0) {
    return [];
  }

  const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
    resourceIds: resourceIDs.join(','),
    isLoadPolicyInfo: 1,
    isTranslate: 1,
    isLoadLatestVersionInfo: 1,
    // projection: 'resourceId,resourceName,resourceType,latestVersion,status,policies,resourceVersions,baseUpcastResources,coverImages,tags,intro',
  };

  // 本次要添加的一些列资源信息
  // const { data: data_batchResourceInfo }: { data: Omit<HandleResourceBatchInfoReturn, 'authProblem'> } = await FServiceAPI.Resource.batchInfo(params);
  const { data: data_batchResourceInfo }: { data: any[] } = await FServiceAPI.Resource.batchInfo(params);
  // console.log(JSON.stringify(data_batchResourceInfo), 'data_batchResourceInfo 238998sdhfkjshdfksdf');

  const needGetAuthProblemResourceIDs: string[] = data_batchResourceInfo.filter((dbri) => {
    return dbri.latestVersion !== '';
  }).map((dbri) => {
    return dbri.resourceId;
  });
  let resourceAuthProblems: {
    isAuth: boolean;
    resourceId: string;
  }[] = [];
  if (needGetAuthProblemResourceIDs.length > 0) {
    const params1: Parameters<typeof FServiceAPI.Resource.batchAuth>[0] = {
      resourceIds: needGetAuthProblemResourceIDs.join(','),
    };
    const { data } = await FServiceAPI.Resource.batchAuth(params1);
    // console.log(data_BatchAuth, 'data_BatchAuth @@@34234wfgsrd');
    // console.log(data, 'datasdfd*******')
    resourceAuthProblems = data;
  }

  const result = data_batchResourceInfo.map((dbri) => {
    const authP = resourceAuthProblems.find((rap) => {
      return rap.resourceId === dbri.resourceId;
    });
    return {
      ...dbri,
      authProblem: authP ? !authP.isAuth : false,
    };
  });

  // console.log(JSON.stringify(result), 'result23423423');
  return result;
}
