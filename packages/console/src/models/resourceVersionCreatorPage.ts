import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer, WholeReadonly} from './shared';
import {FSelectObject} from '@/pages/resource/components/FSelectObject';
import {FCustomPropertiesProps} from '@/components/FCustomProperties';
import {
  batchGetCoverageVersions, BatchGetCoverageVersionsParamsType,
  batchInfo,
  BatchInfoParamsType,
  createVersion,
  CreateVersionParamsType, info, InfoParamsType,
  lookDraft,
  LookDraftParamsType, resolveResources, resourceVersionInfo, ResourceVersionInfoParamsType1,
  saveVersionsDraft,
  SaveVersionsDraftParamsType
} from '@/services/resources';
import {ConnectState, MarketPageModelState, StorageObjectEditorModelState} from '@/models/connect';
import {router} from 'umi';
import BraftEditor, {EditorState} from 'braft-editor';
import fMessage from '@/components/fMessage';
import {FetchDataSourceAction} from '@/models/resourceInfo';
import * as semver from 'semver';
import {batchContracts, BatchContractsParamsType, contracts, ContractsParamsType} from "@/services/contracts";
import moment from "moment";
import {fileProperty, FilePropertyParamsType, objectDetails, ObjectDetailsParamsType2} from "@/services/storages";

export type DepResources = WholeReadonly<{
  id: string;
  title: string;
  resourceType: string;
  status: 0 /*该资源已下线，无法获取授权。*/ | 1 | 2 /*循环依赖不支持授权。*/ | 3 /*该依赖是存储空间对象，无法获取授权。*/;
  versionRange: string;
  versions: string[];
  upthrow: boolean;
  upthrowDisabled: boolean;
  enableReuseContracts: {
    checked: boolean;
    id: string;
    policyId: string;
    title: string;
    // status: 'executing' | 'stopped';
    status: 0 | 1 | 2;
    code: string;
    date: string;
    versions: string[];
  }[];
  enabledPolicies: {
    checked: boolean;
    id: string;
    title: string;
    code: string;
    status: 0 | 1;
  }[];
}[]>;

export type Relationships = WholeReadonly<{
  id: string;
  children: Readonly<{
    id: string;
  }>[];
}[]>;

export type ResourceVersionCreatorPageModelState = WholeReadonly<{
  resourceId: string;
  latestVersion: string;

  version: string;
  versionVerify: 0 | 2;
  versionErrorText: string;

  resourceObject: FSelectObject['resourceObject'];
  resourceObjectErrorText: string;

  depRelationship: Relationships;
  dependencies: DepResources;
  depActivatedID: string;
}> & {
  rawProperties: {
    key: string;
    value: string;
  }[];

  baseProperties: {
    key: string;
    value: string;
    description: string;
  }[];
  basePropertiesEditorVisible: boolean;
  basePropertiesEditorData: {
    key: string;
    keyError: string;
    value: string;
    valueError: string;
    description: string;
    descriptionError: string;
  }[];

  propertiesDataVisible: boolean;
  properties: {
    key: string;
    keyError: string;
    description: string;
    descriptionError: string;
    custom: 'input' | 'select';
    defaultValue: string;
    defaultValueError: string;
    customOption: string;
    customOptionError: string;
  }[];

  description: EditorState;
};

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceVersionCreatorPage/change',
  payload: Partial<ResourceVersionCreatorPageModelState>;
}

export interface FetchDraftAction extends AnyAction {
  type: 'resourceVersionCreatorPage/fetchDraft';
}

export interface FetchResourceInfoAction extends AnyAction {
  type: 'resourceVersionCreatorPage/fetchResourceInfo';
}

export interface CreateVersionAction extends AnyAction {
  type: 'resourceVersionCreatorPage/createVersion';
}

export interface SaveDraftAction extends AnyAction {
  type: 'resourceVersionCreatorPage/saveDraft';
}

export interface ChangeVersionInputAction extends AnyAction {
  type: 'resourceVersionCreatorPage/changeVersionInputAction' | 'changeVersionInputAction';
  payload: string;
}

export interface FetchRawPropsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/fetchRawProps';
}

export interface AddDepsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/addDeps' | 'addDeps';
  payload: {
    relationships: Relationships;
    versions?: { id: string; versionRange: string }[];
  };
}

export interface HandleObjectInfoAction extends AnyAction {
  type: 'resourceVersionCreatorPage/handleObjectInfo';
  payload: string; // 对象 id
}

export interface DeleteDependencyByIDAction extends AnyAction {
  type: 'resourceVersionCreatorPage/deleteDependencyByID';
  payload: ResourceVersionCreatorPageModelState['dependencies'][number]['id'];
}

export interface ImportLastVersionDataAction extends AnyAction {
  type: 'importLastVersionData' | 'resourceVersionCreatorPage/importLastVersionData';
  payload: 'baseProps' | 'optionProps' | 'deps';
}

export interface LeaveAndClearDataAction extends AnyAction {
  type: 'leaveAndClearData' | 'resourceVersionCreatorPage/leaveAndClearData';
}

export interface ResourceVersionCreatorModelType {
  namespace: 'resourceVersionCreatorPage';
  state: ResourceVersionCreatorPageModelState;
  effects: {
    fetchDraft: (action: FetchDraftAction, effects: EffectsCommandMap) => void;
    fetchResourceInfo: (action: FetchResourceInfoAction, effects: EffectsCommandMap) => void;
    createVersion: (action: CreateVersionAction, effects: EffectsCommandMap) => void;
    saveDraft: (action: SaveDraftAction, effects: EffectsCommandMap) => void;
    fetchRawProps: (action: FetchRawPropsAction, effects: EffectsCommandMap) => void;
    changeVersionInputAction: (action: ChangeVersionInputAction, effects: EffectsCommandMap) => void;
    // 处理从对象导入的数据
    handleObjectInfo: (action: HandleObjectInfoAction, effects: EffectsCommandMap) => void;
    addDeps: (action: AddDepsAction, effects: EffectsCommandMap) => void;
    deleteDependencyByID: (action: DeleteDependencyByIDAction, effects: EffectsCommandMap) => void;
    importLastVersionData: (action: ImportLastVersionDataAction, effects: EffectsCommandMap) => void;
    leaveAndClearData: (action: LeaveAndClearDataAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceVersionCreatorPageModelState = {
  resourceId: '',
  latestVersion: '',

  version: '',
  versionVerify: 0,
  versionErrorText: '',

  resourceObject: null,
  resourceObjectErrorText: '',

  rawProperties: [],

  baseProperties: [],
  basePropertiesEditorVisible: false,
  basePropertiesEditorData: [],

  propertiesDataVisible: false,
  properties: [],

  depRelationship: [],
  dependencies: [],
  depActivatedID: '',


  description: BraftEditor.createEditorState(''),

  // draftData: null,
};

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: initStates,

  effects: {
    * createVersion({}: CreateVersionAction, {call, select, put}: EffectsCommandMap) {
      const {resourceVersionCreatorPage, resourceInfo}: ConnectState = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => {
        return {
          resourceVersionCreatorPage,
          resourceInfo,
        };
      });
      const baseUpcastResourceIds = resourceVersionCreatorPage.dependencies
        .filter((dep) => dep.upthrow)
        .map((dep) => dep.id);
      const resolveResources = resourceVersionCreatorPage.dependencies
        .filter((dep) => !baseUpcastResourceIds.includes(dep.id))
        .map((dep) => ({
          resourceId: dep.id,
          contracts: [
            ...dep.enabledPolicies
              .filter((p) => (p.checked))
              .map((p) => ({policyId: p.id})),
            ...dep.enableReuseContracts
              .filter((c) => (c.checked))
              .map((c) => ({policyId: c.policyId})),
          ],
        }));

      const directlyDependentIds: string[] = resourceVersionCreatorPage.depRelationship.map((drs) => drs.id);
      const params: CreateVersionParamsType = {
        resourceId: resourceVersionCreatorPage.resourceId,
        version: resourceVersionCreatorPage.version,
        fileSha1: resourceVersionCreatorPage.resourceObject?.id || '',
        filename: resourceVersionCreatorPage.resourceObject?.name || '',
        baseUpcastResources: baseUpcastResourceIds.map((baseUpId) => ({resourceId: baseUpId})),
        dependencies: resourceVersionCreatorPage.dependencies
          .filter((dep) => directlyDependentIds.includes(dep.id))
          .map((dep) => {
            return {
              resourceId: dep.id,
              versionRange: dep.versionRange,
            }
          }),
        resolveResources: resolveResources,
        customPropertyDescriptors: [
          ...resourceVersionCreatorPage.baseProperties.map<NonNullable<CreateVersionParamsType['customPropertyDescriptors']>[number]>((i) => {
            return {
              type: 'readonlyText',
              key: i.key,
              remark: i.description,
              defaultValue: i.value,
            };
          }),
          ...resourceVersionCreatorPage.properties.map<NonNullable<CreateVersionParamsType['customPropertyDescriptors']>[number]>((i) => {
            const isInput: boolean = i.custom === 'input';
            const options: string[] = i.customOption.split(',');
            return {
              type: isInput ? 'editableText' : 'select',
              key: i.key,
              remark: i.description,
              defaultValue: isInput ? i.defaultValue : options[0],
              candidateItems: isInput ? undefined : options,
            };
          }),
        ],
        description: resourceVersionCreatorPage.description.toHTML() === '<p></p>' ? '' : resourceVersionCreatorPage.description.toHTML(),
      };

      const {data} = yield call(createVersion, params);
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: params.resourceId,
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
      router.replace(`/resource/${data.resourceId}/version/${data.version}/success`)
    },
    * fetchDraft({}: FetchDraftAction, {call, put, select}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => {
        return {
          resourceVersionCreatorPage,
        };
      });
      const params: LookDraftParamsType = {
        resourceId: resourceVersionCreatorPage.resourceId,
      };
      const {data} = yield call(lookDraft, params);
      if (!data) {
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...data.draftData,
          description: BraftEditor.createEditorState(data.draftData.description),
        }
      });
    },
    * fetchResourceInfo({}: FetchResourceInfoAction, {select, call, put}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage}: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      const params: InfoParamsType = {
        resourceIdOrName: resourceVersionCreatorPage.resourceId,
        isLoadLatestVersionInfo: 1,
      };
      const {data} = yield call(info, params);
      // console.log(data, '2093jdsl;kfasdf');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          latestVersion: data.latestVersion,
        },
      });
    },
    * saveDraft({}: SaveDraftAction, {call, select, put}: EffectsCommandMap) {
      const {resourceInfo, resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
        resourceInfo, resourceVersionCreatorPage
      }));
      const params: SaveVersionsDraftParamsType = {
        resourceId: resourceInfo.info?.resourceId || '',
        draftData: {
          ...resourceVersionCreatorPage,
          description: resourceVersionCreatorPage.description.toHTML(),
        },
      };
      yield call(saveVersionsDraft, params);
      fMessage('暂存草稿成功');
    },
    * changeVersionInputAction({payload}: ChangeVersionInputAction, {select, put}: EffectsCommandMap) {
      const {resourceInfo}: ConnectState = yield select(({resourceInfo}: ConnectState) => ({
        resourceInfo,
      }));
      let versionErrorText: string = '';
      if (!payload) {
        versionErrorText = '请输入版本号';
      } else if (!semver.valid(payload)) {
        versionErrorText = '版本号不合法';
      } else if (!semver.gt(payload, resourceInfo.info?.latestVersion || '0.0.0')) {
        versionErrorText = resourceInfo.info?.latestVersion ? `必须大于最新版本 ${resourceInfo.info?.latestVersion}` : '必须大于 0.0.0';
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          version: payload,
          versionVerify: 2,
          versionErrorText: versionErrorText,
        }
      });
    },
    * fetchRawProps({}: FetchRawPropsAction, {select, put, call}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage}: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      if (!resourceVersionCreatorPage.resourceObject) {
        return;
      }
      const params: FilePropertyParamsType = {
        sha1: resourceVersionCreatorPage.resourceObject.id,
        resourceType: resourceVersionCreatorPage.resourceObject.type,
      };

      const {data} = yield call(fileProperty, params);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rawProperties: Object.entries(data as any[]).map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((rp) => {
            return {
              key: rp[0],
              value: rp[1],
            };
          }),
        },
      });
    },
    * addDeps({payload: {relationships, versions}}: AddDepsAction, {select, put, call}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage}: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      const existIDs: string[] = resourceVersionCreatorPage.dependencies.map<string>((dd) => dd.id);

      const allIDs: string[] = [
        ...relationships.map((r) => r.id),
        ...relationships.map((r) => r.children).flat().map((c) => c.id),
      ].filter((id) => !existIDs.includes(id));

      if (allIDs.length === 0) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            depRelationship: [
              ...relationships,
              ...resourceVersionCreatorPage.depRelationship,
            ],
          },
        });
      }

      const params: BatchInfoParamsType = {
        resourceIds: allIDs.join(','),
        isLoadPolicyInfo: 1,
        isLoadLatestVersionInfo: 1,
      };

      const {data} = yield call(batchInfo, params);
      // console.log(data, 'DDD!@#$@!#$@');

      const params1: BatchContractsParamsType = {
        subjectIds: allIDs.join(','),
        licenseeId: resourceVersionCreatorPage.resourceId,
        subjectType: 1,
        licenseeIdentityType: 1,
        isLoadPolicyInfo: 1,
      };
      const {data: data1} = yield call(batchContracts, params1);
      // console.log(data1, 'data1 109234ui2o34');

      let coverageVersions: any[] = [];
      if (data1.length > 0) {
        const params2: BatchGetCoverageVersionsParamsType = {
          resourceId: resourceVersionCreatorPage.resourceId,
          contractIds: data1.map((ci: any) => ci.contractId).join(','),
        };
        const {data: data2} = yield call(batchGetCoverageVersions, params2);
        coverageVersions = data2;
      }

      const dependencies: DepResources = (data as any[]).map<DepResources[number]>((dr: any) => {
        const depC: any[] = data1.filter((dc: any) => dc.licensorId === dr.resourceId);

        const allDepCIDs: string[] = depC.map<string>((adcs) => adcs.policyId);
        const theVersion = versions?.find((v) => v.id === dr.resourceId);
        return {
          id: dr.resourceId,
          title: dr.resourceName,
          resourceType: dr.resourceType,
          status: dr.status,
          versionRange: theVersion ? theVersion.versionRange : '^' + dr.latestVersion,
          versions: dr.resourceVersions.map((version: any) => version.version),
          upthrow: false,
          upthrowDisabled: !!resourceVersionCreatorPage.latestVersion,
          enableReuseContracts: depC.map<ResourceVersionCreatorPageModelState['dependencies'][number]['enableReuseContracts'][number]>((c: any) => {
            return {
              checked: false,
              id: c.contractId,
              policyId: c.policyId,
              title: c.contractName,
              status: c.status,
              code: c.policyInfo.policyText,
              date: moment(c.createDate).format('YYYY-MM-DD HH:mm'),
              versions: coverageVersions.find((cv) => c.contractId === cv.contractId)
                .versions.map((ccc: any) => ccc.version),
            };
          }),
          enabledPolicies: dr.policies
            .filter((policy: any) => !allDepCIDs.includes(policy.policyId))
            .map((policy: any) => {
              // console.log(policy, 'PPPPafwe98iokl');
              return {
                checked: false,
                id: policy.policyId,
                title: policy.policyName,
                code: policy.policyText,
                status: policy.status,
              };
            }),
        }
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRelationship: [
            ...relationships,
            ...resourceVersionCreatorPage.depRelationship,
          ],
          dependencies: [
            ...resourceVersionCreatorPage.dependencies,
            ...dependencies,
          ],
          depActivatedID: resourceVersionCreatorPage.depActivatedID ? resourceVersionCreatorPage.depActivatedID : relationships[0].id,
        },
      });
    },
    * handleObjectInfo({payload}: HandleObjectInfoAction, {select, put, call}: EffectsCommandMap) {
      // console.log(payload, '!!!@@@#$@#$#$');

      const params: ObjectDetailsParamsType2 = {
        objectIdOrName: payload,
      };
      const {data} = yield call(objectDetails, params);
      // console.log(data, 'OOOOasdfadsf');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRelationship: [],
          dependencies: [],
        },
      });

      const depObjects: any[] = data.dependencies.filter((dd: any) => dd.type === 'object');
      // console.log(depObjects, '9023jlkdfsj');
      if (depObjects.length > 0) {
        const allDepObjects: ResourceVersionCreatorPageModelState['dependencies'] = depObjects.map((dpo: any) => {
          return {
            id: dpo.name,
            title: dpo.name,
            resourceType: '',
            status: 3,
            versionRange: '',
            versions: [],
            upthrow: false,
            upthrowDisabled: true,
            enableReuseContracts: [],
            enabledPolicies: [],
          };
        });
        const allRelationship: ResourceVersionCreatorPageModelState['depRelationship'] = allDepObjects.map((oo) => {
          return {id: oo.id, children: []};
        });
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: Object.entries(data.systemProperty).map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((s: any) => ({
              key: s[0],
              value: s[1],
            })),
            baseProperties: (data.customPropertyDescriptors as any[])
              .filter((cpd: any) => cpd.type === 'readonlyText')
              .map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((cpd: any) => {
                return {
                  key: cpd.key,
                  value: cpd.defaultValue,
                  description: cpd.remark,
                };
              }),
            properties: (data.customPropertyDescriptors as any[])
              .filter((cpd: any) => cpd.type !== 'readonlyText')
              .map<ResourceVersionCreatorPageModelState['properties'][number]>((cpd: any) => {
                return {
                  key: cpd.key,
                  keyError: '',
                  description: cpd.remark,
                  descriptionError: '',
                  custom: cpd.type === 'editableText' ? 'input' : 'select',
                  defaultValue: cpd.defaultValue,
                  defaultValueError: '',
                  customOption: cpd.candidateItems.join(','),
                  customOptionError: '',
                };
              }),
            dependencies: allDepObjects,
            depRelationship: allRelationship,
          }
        });
      }

      const depResources: { name: string; versionRange: string; }[] = data.dependencies.filter((dd: any) => dd.type === 'resource');
      // const depResources: { name: string; versionRange: string; }[] = data.dependencies.filter((dd: any) => true);

      if (depResources.length === 0) {
        return;
      }

      const params2: BatchInfoParamsType = {
        resourceNames: depResources.map<string>((dr) => dr.name).join(','),
      };
      const {data: data2} = yield call(batchInfo, params2);
      // console.log(data2, '#ASGDFASDF');
      const relations = data2.map((dd: any) => {
        return {
          id: dd.resourceId,
          children: dd.baseUpcastResources.map((bur: any) => {
            return {
              id: bur.resourceId,
            }
          }),
        };
      });

      const versions = depResources.map((dr) => {
        const resource = data2.find((d2: any) => d2.resourceName);
        return {
          id: resource.resourceId,
          versionRange: dr.versionRange,
        };
      });

      yield put<AddDepsAction>({
        type: 'addDeps',
        payload: {
          relationships: relations,
          versions: versions,
        },
      });
    },
    * deleteDependencyByID({payload}: DeleteDependencyByIDAction, {select, put}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage}: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      const depRelationship: ResourceVersionCreatorPageModelState['depRelationship'] = resourceVersionCreatorPage.depRelationship.filter((drs) => drs.id !== payload);
      const allUsedIDs: string[] = [
        ...depRelationship.map<string>((drs) => drs.id),
        ...depRelationship.map((drs) => drs.children).flat().map<string>((drs) => drs.id),
      ];
      const dependencies: ResourceVersionCreatorPageModelState['dependencies'] = resourceVersionCreatorPage.dependencies.filter((dp) => allUsedIDs.includes(dp.id));

      let depActivatedID: string = resourceVersionCreatorPage.depActivatedID;
      if (!allUsedIDs.includes(depActivatedID)) {
        depActivatedID = allUsedIDs[0] || '';
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRelationship,
          dependencies,
          depActivatedID,
        },
      });
    },
    * importLastVersionData({payload}: ImportLastVersionDataAction, {call, select, put}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage}: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      const params: ResourceVersionInfoParamsType1 = {
        resourceId: resourceVersionCreatorPage.resourceId,
        version: resourceVersionCreatorPage.latestVersion,
      };
      const {data} = yield call(resourceVersionInfo, params);
      console.log(data, '2093jdsl;kfasdf');

      if (payload === 'baseProps') {
        const allKeys: string[] = [
          ...resourceVersionCreatorPage.rawProperties.map((rp) => {
            return rp.key;
          }),
          ...resourceVersionCreatorPage.properties.map((pp) => {
            return pp.key;
          }),
        ];
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            basePropertiesEditorVisible: true,
            basePropertiesEditorData: (data.customPropertyDescriptors as any[])
              .filter((cpd: any) => cpd.type === 'readonlyText')
              .map<StorageObjectEditorModelState['basePropertiesEditorData'][number]>((cpd: any) => {
                return {
                  key: cpd.key,
                  keyError: allKeys.includes(cpd.key) ? '键不能重复' : '',
                  value: cpd.defaultValue,
                  valueError: '',
                  description: cpd.remark,
                  descriptionError: '',
                };
              }),
          }
        });
      }

      if (payload === 'optionProps') {
        const allKeys: string[] = [
          ...resourceVersionCreatorPage.rawProperties.map((rp) => {
            return rp.key;
          }),
          ...resourceVersionCreatorPage.baseProperties.map((pp) => {
            return pp.key;
          }),
        ];
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            properties: (data.customPropertyDescriptors as any[])
              .filter((cpd: any) => cpd.type !== 'readonlyText')
              .map<StorageObjectEditorModelState['properties'][number]>((cpd: any) => {
                return {
                  key: cpd.key,
                  keyError: allKeys.includes(cpd.key) ? '键不能重复' : '',
                  description: cpd.remark,
                  descriptionError: '',
                  custom: cpd.type === 'editableText' ? 'input' : 'select',
                  defaultValue: cpd.defaultValue,
                  defaultValueError: '',
                  customOption: cpd.candidateItems.join(','),
                  customOptionError: '',
                };
              }),
          }
        });
      }

      if (payload === 'deps') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            depRelationship: [],
            dependencies: [],
          },
        });

        const depResourceIds: string = (data.dependencies as any[]).map<string>((dr) => dr.resourceId).join(',');

        if (depResourceIds.length === 0) {
          return;
        }

        const params2: BatchInfoParamsType = {
          resourceIds: depResourceIds,
        };
        const {data: data2} = yield call(batchInfo, params2);
        console.log(data2, '#ASGDFASDF');
        const relations = data2.map((dd: any) => {
          return {
            id: dd.resourceId,
            children: dd.baseUpcastResources.map((bur: any) => {
              return {
                id: bur.resourceId,
              }
            }),
          };
        });

        const versions = (data.dependencies as any[]).map((dr) => {
          return {
            id: dr.resourceId,
            versionRange: dr.versionRange,
          };
        });

        yield put<AddDepsAction>({
          type: 'addDeps',
          payload: {
            relationships: relations,
            versions: versions,
          },
        });
      }
    },
    * leaveAndClearData({}: LeaveAndClearDataAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
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
      // dispatch({
      //   type: 'init',
      // });
    },
  },

};

export default Model;

function verify(data: any) {
  const {version, latestVersion, fileSha1} = data;
  let versionErrorText = '';
  let resourceObjectErrorText = '';

  if (!version) {
    versionErrorText = '请输入版本号';
  } else if (!semver.valid(version)) {
    versionErrorText = '版本号不合法';
  } else if (!semver.gt(version, latestVersion || '0.0.0')) {
    versionErrorText = latestVersion ? `必须大于最新版本 ${latestVersion}` : '必须大于 0.0.0';
  }

  if (!fileSha1) {
    resourceObjectErrorText = '请选择对象或上传文件';
  }

  return {versionErrorText, resourceObjectErrorText};
}

// interface HandleDepResourceParams {
//   resourceInfo: any;
//   allBaseUpthrowIds: string[];
//   allNeedHandledIds: string[];
//   allExistsIds: string[];
// }

// async function handleDepResource({allNeedHandledIds, resourceInfo, allBaseUpthrowIds, allExistsIds}: HandleDepResourceParams) {
//   const arr: any[] = [];
//
//   for (const [i, id] of Object.entries(allNeedHandledIds)) {
//     if (allExistsIds.includes(id)) {
//       continue;
//     }
//     let dep = await dddDependency(id, resourceInfo, allBaseUpthrowIds);
//
//     if (dep.status === 1) {
//       const {data} = await cycleDependencyCheck({
//         resourceId: resourceInfo.resourceId,
//         dependencies: [{
//           resourceId: id,
//           versionRange: '',
//         }],
//       });
//       // console.log(data, 'data');
//       if (!data) {
//         dep = {
//           ...dep,
//           status: 2,
//         };
//       }
//     }
//
//     arr.push(dep);
//   }
//
//   return arr;
// }

// async function dddDependency(resourceId: string, resourceInfo: any, allBaseUpthrowIds: string[]) {
//
//   const resourcesParams: InfoParamsType = {
//     resourceIdOrName: resourceId,
//     isLoadPolicyInfo: 1,
//   };
//   const {data: resourceData} = await info(resourcesParams);
//
//   const contractsParams: ContractsParamsType = {
//     identityType: 2,
//     licensorId: resourceId,
//     licenseeId: resourceInfo.resourceId,
//     isLoadPolicyInfo: 1,
//   };
//   const {data: {dataList: contractsData}} = await contracts(contractsParams);
//   // console.log(contractsData, 'contractsData24fsdzvrg');
//   const allContractPolicyIds = contractsData.map((constract: any) => constract.policyId);
//   // console.log(allContractPolicyIds, 'allContractPolicyIds23tg98piore');
//   const resolveResourcesParams: ResolveResourcesParamsType = {
//     resourceId: resourceInfo.resourceId,
//   };
//   const {data: resolveResourcesData} = await resolveResources(resolveResourcesParams);
//   // console.log(resolveResourcesData, 'resolveResourcesDatae4w98wu3h');
//   const dependency: DepResources[number] = {
//     id: resourceData.resourceId,
//     title: resourceData.resourceName,
//     resourceType: resourceData.resourceType,
//     status: resourceData.status,
//     versionRange: resourceData.versionRange,
//     versions: resourceData.resourceVersions.map((version: any) => version.version),
//     upthrow: allBaseUpthrowIds.includes(resourceData.resourceId),
//     upthrowDisabled: !!resourceInfo.latestVersion,
//     enableReuseContracts: contractsData.map((c: any) => ({
//       checked: true,
//       id: c.contractId,
//       policyId: c.policyId,
//       title: c.contractName,
//       status: c.isAuth ? 'executing' : 'stopped',
//       code: c.policyInfo.policyText,
//       date: moment(c.createDate).format('YYYY-MM-DD HH:mm'),
//       versions: resolveResourcesData
//         .find((rr: any) => rr.resourceId === resourceData.resourceId)
//         .versions
//         .filter((rr: any) => {
//           const allContractIds = rr.contracts.map((cs: any) => cs.contractId)
//           return allContractIds.includes(c.contractId);
//         })
//         .map((rr: any) => rr.version),
//     })),
//     enabledPolicies: resourceData.policies
//       .filter((policy: any) => !allContractPolicyIds.includes(policy.policyId))
//       .map((policy: any) => {
//         // console.log(policy, 'PPPPafwe98iokl');
//         return {
//           checked: false,
//           id: policy.policyId,
//           title: policy.policyName,
//           code: policy.policyText,
//           status: policy.status,
//         };
//       }),
//   };
//
//   return dependency;
// }

// interface handleAddADepByIDDateParamsType {
//   payload: string[];
//   resourceInfo: any;
//   dependencies: any;
// }
//
// async function handleAddADepByIDDate({payload, resourceInfo, dependencies}: handleAddADepByIDDateParamsType) {
// // console.log(payload, 'PPPPLLLLLL');
//   const [id, ...ids] = payload;
//   const relationship = {
//     id: id,
//     children: ids.map((i: string) => ({id: i})),
//   };
//   // console.log(relationship, 'relationship');
//   // const {resourceDepRelationship, resourceInfo, dependencies, allExistsIds} = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
//   //   resourceDepRelationship: resourceVersionCreatorPage.depRelationship,
//   //   resourceInfo: resourceInfo.info,
//   //   dependencies: dependencies,
//   //   allExistsIds: dependencies.map((r: any) => r.resourceId),
//   // }));
//   const handleDepResourcePrams: HandleDepResourceParams = {
//     resourceInfo: resourceInfo,
//     allBaseUpthrowIds: resourceInfo.baseUpcastResources?.map((up: any) => up.resourceId),
//     allNeedHandledIds: payload,
//     allExistsIds: dependencies.map((r: any) => r.resourceId),
//   };
//   const allDeps = await handleDepResource(handleDepResourcePrams);
//   // console.log(allDeps, '开始change');
//   return {
//     relationship,
//     allDeps,
//   };
//   // yield put<ChangeAction>({
//   //   type: 'change',
//   //   payload: {
//   //     depRelationship: [
//   //       relationship,
//   //       ...resourceDepRelationship,
//   //     ],
//   //     dependencies: [
//   //       ...dependencies,
//   //       ...allDeps,
//   //     ],
//   //   }
//   // });
// }
