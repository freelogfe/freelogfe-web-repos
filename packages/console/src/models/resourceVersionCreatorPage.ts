import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer, WholeReadonly} from './shared';
import {FSelectObject} from '@/pages/resource/components/FSelectObject';
import {ConnectState, MarketPageModelState, StorageObjectEditorModelState} from '@/models/connect';
import {router} from 'umi';
import BraftEditor, {EditorState} from 'braft-editor';
import fMessage from '@/components/fMessage';
import {FetchDataSourceAction} from '@/models/resourceInfo';
import * as semver from 'semver';
import moment from "moment";
import FUtil from "@/utils";
import {FApiServer} from "@/services";

export type DepResources = WholeReadonly<{
  id: string;
  title: string;
  resourceType: string;
  status: 0 /*该资源已下线，无法获取授权。*/ | 1 | 2 /*循环依赖不支持授权。*/ | 3 /*该依赖是存储空间对象，无法获取授权。*/ | 4 /*上抛资源，无法获取授权*/;
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
  resourceType: string;
  baseUpcastResources: {
    resourceId: string;
    resourceName: string;
  }[];

  version: string;
  versionVerify: 0 | 2;
  versionErrorText: string;

  resourceObject: FSelectObject['resourceObject'];
  resourceObjectError: {
    sha1: string;
    text: string;
  };

  depRelationship: Relationships;
  dependencies: DepResources;
  depActivatedID: string;

  dataIsDirty: boolean;
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

  customOptionsDataVisible: boolean;
  customOptionsData: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];
  customOptionsEditorVisible: boolean;
  customOptionsEditorDataSource: {
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

  preVersionBaseProperties: {
    key: string;
    value: string;
    description: string;
  }[];

  preVersionOptionProperties: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];

  preVersionDeps: {
    relationships: Relationships;
    versions: { id: string; versionRange: string }[];
  };

  promptLeavePath: string;
};

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceVersionCreatorPage/change',
  payload: Partial<ResourceVersionCreatorPageModelState>;
}

export interface InitModelStatesAction extends AnyAction {
  type: 'resourceVersionCreatorPage/initModelStates';
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

export interface VerifyVersionInputAction extends AnyAction {
  type: 'resourceVersionCreatorPage/verifyVersionInput' | 'verifyVersionInput';
  // payload: string;
}

export interface FetchRawPropsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/fetchRawProps';
}

export interface AddDepsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/addDeps' | 'addDeps';
  payload: {
    relationships: Relationships;
    versions?: { id: string; versionRange: string; }[];
  };
}

export interface AddDepsByMainIDsAction extends AnyAction {
  type: 'resourceVersionCreatorPage/dddDepsByMainIDs'
  payload: string[]; // 主资源 ids
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

export interface GoToResourceDetailsBySha1 extends AnyAction {
  type: 'resourceVersionCreatorPage/goToResourceDetailsBySha1';
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
    verifyVersionInput: (action: VerifyVersionInputAction, effects: EffectsCommandMap) => void;
    // 处理从对象导入的数据
    handleObjectInfo: (action: HandleObjectInfoAction, effects: EffectsCommandMap) => void;
    addDeps: (action: AddDepsAction, effects: EffectsCommandMap) => void;
    dddDepsByMainIDs: (action: AddDepsByMainIDsAction, effects: EffectsCommandMap) => void;
    deleteDependencyByID: (action: DeleteDependencyByIDAction, effects: EffectsCommandMap) => void;
    importLastVersionData: (action: ImportLastVersionDataAction, effects: EffectsCommandMap) => void;
    goToResourceDetailsBySha1: (action: GoToResourceDetailsBySha1, effects: EffectsCommandMap) => void;
    leaveAndClearData: (action: LeaveAndClearDataAction, effects: EffectsCommandMap) => void;
    initModelState: (action: InitModelStatesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<MarketPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceVersionCreatorPageModelState = {
  resourceId: '',
  latestVersion: '',
  resourceType: '',
  baseUpcastResources: [],

  version: '',
  versionVerify: 0,
  versionErrorText: '',

  resourceObject: null,
  resourceObjectError: {
    sha1: '',
    text: '',
  },

  rawProperties: [],

  baseProperties: [],
  basePropertiesEditorVisible: false,
  basePropertiesEditorData: [],

  customOptionsDataVisible: false,
  customOptionsData: [],
  customOptionsEditorVisible: false,
  customOptionsEditorDataSource: [],

  depRelationship: [],
  dependencies: [],
  depActivatedID: '',

  description: BraftEditor.createEditorState(''),

  preVersionBaseProperties: [],
  preVersionOptionProperties: [],
  preVersionDeps: {
    relationships: [],
    versions: [],
  },

  dataIsDirty: false,

  promptLeavePath: '',
};

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: initStates,

  effects: {
    * createVersion({}: CreateVersionAction, {call, select, put}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => {
        return {
          resourceVersionCreatorPage,
        };
      });
      const baseUpcastResourceIds = resourceVersionCreatorPage.dependencies
        .filter((dep) => dep.upthrow)
        .map((dep) => dep.id);
      const resolveResources = resourceVersionCreatorPage.dependencies
        .filter((dep) => !baseUpcastResourceIds.includes(dep.id) && dep.status === 1)
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
      const params: Parameters<typeof FApiServer.Resource.createVersion>[0] = {
        resourceId: resourceVersionCreatorPage.resourceId,
        version: resourceVersionCreatorPage.version,
        fileSha1: resourceVersionCreatorPage.resourceObject?.sha1 || '',
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
          ...resourceVersionCreatorPage.baseProperties.map<NonNullable<Parameters<typeof FApiServer.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
            return {
              type: 'readonlyText',
              key: i.key,
              remark: i.description,
              defaultValue: i.value,
            };
          }),
          ...resourceVersionCreatorPage.customOptionsData.map<NonNullable<Parameters<typeof FApiServer.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
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

      const {data} = yield call(FApiServer.Resource.createVersion, params);
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
      const params: Parameters<typeof FApiServer.Resource.lookDraft>[0] = {
        resourceId: resourceVersionCreatorPage.resourceId,
      };
      const {data} = yield call(FApiServer.Resource.lookDraft, params);
      if (!data) {
        return;
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          ...data.draftData,
          description: BraftEditor.createEditorState(data.draftData.description),
          dataIsDirty: false,
        },
      });
    },
    * fetchResourceInfo({}: FetchResourceInfoAction, {select, call, put}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage}: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      const params: Parameters<typeof FApiServer.Resource.info>[0] = {
        resourceIdOrName: resourceVersionCreatorPage.resourceId,
        isLoadLatestVersionInfo: 1,
      };
      const {data} = yield call(FApiServer.Resource.info, params);
      // console.log(data, '2093jdsl;kfasdf');

      let description: EditorState = BraftEditor.createEditorState('');
      let preVersionBaseProperties: ResourceVersionCreatorPageModelState['preVersionBaseProperties'] = [];
      let preVersionOptionProperties: ResourceVersionCreatorPageModelState['preVersionOptionProperties'] = [];
      let preVersionDeps = {
        relationships: [],
        versions: [],
      };
      if (data.latestVersion) {
        const params2: Parameters<typeof FApiServer.Resource.resourceVersionInfo>[0] = {
          resourceId: resourceVersionCreatorPage.resourceId,
          version: data.latestVersion,
        };
        const {data: data2} = yield call(FApiServer.Resource.resourceVersionInfo, params2);
        // console.log(data2, 'data2092384u0');
        description = BraftEditor.createEditorState(data2.description);
        preVersionBaseProperties = (data2.customPropertyDescriptors as any[])
          .filter((cpd: any) => cpd.type === 'readonlyText')
          .map<ResourceVersionCreatorPageModelState['preVersionBaseProperties'][number]>((cpd: any) => {
            return {
              key: cpd.key,
              value: cpd.defaultValue,
              description: cpd.remark,
            };
          });

        preVersionOptionProperties = (data2.customPropertyDescriptors as any[])
          .filter((cpd: any) => cpd.type !== 'readonlyText')
          .map<ResourceVersionCreatorPageModelState['preVersionOptionProperties'][number]>((cpd: any) => {
            return {
              key: cpd.key,
              description: cpd.remark,
              custom: cpd.type === 'editableText' ? 'input' : 'select',
              defaultValue: cpd.defaultValue,
              customOption: cpd.candidateItems.join(','),
            };
          });

        const depResourceIds: string = (data2.dependencies as any[]).map<string>((dr) => dr.resourceId).join(',');

        if (depResourceIds.length > 0) {
          const params3: Parameters<typeof FApiServer.Resource.batchInfo>[0] = {
            resourceIds: depResourceIds,
          };
          const {data: data3} = yield call(FApiServer.Resource.batchInfo, params3);
          // console.log(data2, '#ASGDFASDF');
          const relations: Relationships = data3.map((dd: any) => {
            return {
              id: dd.resourceId,
              children: dd.baseUpcastResources.map((bur: any) => {
                return {
                  id: bur.resourceId,
                }
              }),
            };
          });

          const versions = (data2.dependencies as any[]).map((dr: any) => {
            return {
              id: dr.resourceId,
              versionRange: dr.versionRange,
            };
          });

          preVersionDeps = {
            relationships: relations as any,
            versions: versions as any,
          };
        }
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceType: data.resourceType,
          baseUpcastResources: data.baseUpcastResources,
          latestVersion: data.latestVersion,
          version: resourceVersionCreatorPage.version ? resourceVersionCreatorPage.version : (semver.inc(data.latestVersion, 'patch') || '0.1.0'),
          preVersionBaseProperties,
          preVersionOptionProperties,
          preVersionDeps,
          description,
        },
      });
    },
    * saveDraft({}: SaveDraftAction, {call, select, put}: EffectsCommandMap) {
      const {resourceInfo, resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage, resourceInfo}: ConnectState) => ({
        resourceInfo, resourceVersionCreatorPage
      }));

      const params: Parameters<typeof FApiServer.Resource.saveVersionsDraft>[0] = {
        resourceId: resourceInfo.info?.resourceId || '',
        draftData: {
          ...resourceVersionCreatorPage,
          description: resourceVersionCreatorPage.description.toHTML(),
          dataIsDirty: false,
        },
      };
      yield call(FApiServer.Resource.saveVersionsDraft, params);
      fMessage('暂存草稿成功');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });

    },
    * verifyVersionInput({}: VerifyVersionInputAction, {select, put}: EffectsCommandMap) {
      const {resourceInfo, resourceVersionCreatorPage}: ConnectState = yield select(({resourceInfo, resourceVersionCreatorPage}: ConnectState) => ({
        resourceInfo,
        resourceVersionCreatorPage,
      }));
      let versionErrorText: string = '';
      if (!resourceVersionCreatorPage.version) {
        versionErrorText = '请输入版本号';
      } else if (!semver.valid(resourceVersionCreatorPage.version)) {
        versionErrorText = '版本号不合法';
      } else if (!semver.gt(resourceVersionCreatorPage.version, resourceInfo.info?.latestVersion || '0.0.0')) {
        versionErrorText = resourceInfo.info?.latestVersion ? `必须大于最新版本 ${resourceInfo.info?.latestVersion}` : '必须大于 0.0.0';
      }
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // version: resourceVersionCreatorPage.version,
          versionVerify: 2,
          versionErrorText: versionErrorText,
        }
      });
    },
    * fetchRawProps({}: FetchRawPropsAction, {select, put, call}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage}: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      if (!resourceVersionCreatorPage.resourceObject || resourceVersionCreatorPage.resourceObject.sha1 === '') {
        return;
      }
      const params: Parameters<typeof FApiServer.Storage.fileProperty>[0] = {
        sha1: resourceVersionCreatorPage.resourceObject.sha1,
        resourceType: resourceVersionCreatorPage.resourceObject.type,
      };

      const {data} = yield call(FApiServer.Storage.fileProperty, params);

      if (!data) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: [],
            resourceObject: null,
            resourceObjectError: {
              sha1: resourceVersionCreatorPage.resourceObject.sha1,
              text: FUtil.I18n.message('error_wrongfileformat'),
            },
          },
        });
      }

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
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: true,
        },
      });

      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage}: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      const existIDs: string[] = resourceVersionCreatorPage.dependencies.map<string>((dd) => dd.id);

      // 本次要添加全部资源 ID
      const allIDs: string[] = [
        ...relationships.map((r) => r.id),
        ...relationships.map((r) => r.children).flat().map((c) => c.id),
      ].filter((id) => !existIDs.includes(id));

      if (allIDs.length === 0) {
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            depRelationship: [
              ...resourceVersionCreatorPage.depRelationship,
              ...relationships,
            ],
          },
        });
      }

      const params: Parameters<typeof FApiServer.Resource.batchInfo>[0] = {
        resourceIds: allIDs.join(','),
        isLoadPolicyInfo: 1,
        isLoadLatestVersionInfo: 1,
      };

      // 本次要添加的一些列资源信息
      const {data} = yield call(FApiServer.Resource.batchInfo, params);
      // console.log(data, 'DDD!@#$@!#$@');

      const params1: Parameters<typeof FApiServer.Contract.batchContracts>[0] = {
        subjectIds: allIDs.join(','),
        licenseeId: resourceVersionCreatorPage.resourceId,
        subjectType: 1,
        licenseeIdentityType: 1,
        isLoadPolicyInfo: 1,
      };
      const {data: data1} = yield call(FApiServer.Contract.batchContracts, params1);
      // console.log(data1, 'data1 109234ui2o34');

      // 如果有合约，就获取合约应用的版本
      let coverageVersions: any[] = [];
      if (data1.length > 0) {
        const params2: Parameters<typeof FApiServer.Resource.batchGetCoverageVersions>[0] = {
          resourceId: resourceVersionCreatorPage.resourceId,
          contractIds: data1.map((ci: any) => ci.contractId).join(','),
        };
        const {data: data2} = yield call(FApiServer.Resource.batchGetCoverageVersions, params2);
        coverageVersions = data2;
      }

      // const param3: GetAllContractsParamsType = {
      //   resourceID: resourceVersionCreatorPage.resourceId,
      //   resourceIDs: (data as any[]).map<string>((r) => r.resourceId),
      // };
      // // console.log(param3, 'param3@@@@@22lk3j1qlk234jlk23');
      // const result: GetAllContractsReturnType = yield call(getAllContracts, param3);
      // console.log(result, 'result!@#$!@#$!@#$!@#$213412342134123');

      // 组织添加的依赖数据
      const dependencies: DepResources = (data as any[]).map<DepResources[number]>((dr: any) => {
        const depC: any[] = data1.filter((dc: any) => dc.licensorId === dr.resourceId);


        const allDepCIDs: string[] = depC.map<string>((adcs) => adcs.policyId);
        const theVersion = versions?.find((v) => v.id === dr.resourceId);

        const isUpthrow: boolean = !!resourceVersionCreatorPage.baseUpcastResources.find((b) => dr.resourceId === b.resourceId);

        return {
          id: dr.resourceId,
          title: dr.resourceName,
          resourceType: dr.resourceType,
          status: isUpthrow ? 4 : dr.status,
          versionRange: theVersion ? theVersion.versionRange : '^' + dr.latestVersion,
          versions: dr.resourceVersions.map((version: any) => version.version),
          upthrow: false,
          upthrowDisabled: !!resourceVersionCreatorPage.latestVersion,
          enableReuseContracts: depC.map<ResourceVersionCreatorPageModelState['dependencies'][number]['enableReuseContracts'][number]>((c: any) => {
            return {
              checked: true,
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

      // 处理循环依赖的资源
      const params2: BatchCycleDependencyCheckParams = {
        resourceId: resourceVersionCreatorPage.resourceId,
        dependencies: dependencies.map<{ resourceId: string; versionRange: string; }>((d) => {
          return {
            resourceId: d.id,
            versionRange: d.versionRange,
          };
        }),
      };
      const cycleDependencyResourceID: string[] = yield call(batchCycleDependencyCheck, params2);
      // console.log(cycleDependencyResourceID, 'data229380uidfs');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          depRelationship: [
            ...resourceVersionCreatorPage.depRelationship,
            ...relationships,
          ],
          dependencies: [
            ...resourceVersionCreatorPage.dependencies,
            ...dependencies.map<DepResources[number]>((d) => {
              if (!cycleDependencyResourceID.includes(d.id)) {
                return d;
              }
              return {
                ...d,
                status: 2,
              };
            }),
          ],
          depActivatedID: resourceVersionCreatorPage.depActivatedID ? resourceVersionCreatorPage.depActivatedID : relationships[0].id,
        },
      });
    },
    * dddDepsByMainIDs({payload}: AddDepsByMainIDsAction, {call, put}: EffectsCommandMap) {
      const params: Parameters<typeof FApiServer.Resource.batchInfo>[0] = {
        resourceIds: payload.join(','),
      };
      const {data} = yield call(FApiServer.Resource.batchInfo, params);
      // console.log(data, 'data198023h');
      yield put<AddDepsAction>({
        type: 'addDeps',
        payload: {
          relationships: data.map((d: any) => {
            return {
              id: d.resourceId,
              children: d.baseUpcastResources.map((c: any) => {
                return {
                  id: c.resourceId,
                };
              }),
            }
          }),
        },
      });
    },
    * handleObjectInfo({payload}: HandleObjectInfoAction, {select, put, call}: EffectsCommandMap) {
      // console.log(payload, '!!!@@@#$@#$#$');

      const params: Parameters<typeof FApiServer.Storage.objectDetails>[0] = {
        objectIdOrName: payload,
      };
      const {data} = yield call(FApiServer.Storage.objectDetails, params);
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
          // console.log(dpo, 'dpo!@#$@#$!$@#$!@#$');
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
            customOptionsData: (data.customPropertyDescriptors as any[])
              .filter((cpd: any) => cpd.type !== 'readonlyText')
              .map<ResourceVersionCreatorPageModelState['customOptionsData'][number]>((cpd: any) => {
                return {
                  key: cpd.key,
                  // keyError: '',
                  description: cpd.remark,
                  // descriptionError: '',
                  custom: cpd.type === 'editableText' ? 'input' : 'select',
                  defaultValue: cpd.defaultValue,
                  // defaultValueError: '',
                  customOption: cpd.candidateItems.join(','),
                  // customOptionError: '',
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

      const params2: Parameters<typeof FApiServer.Resource.batchInfo>[0] = {
        resourceNames: depResources.map<string>((dr) => dr.name).join(','),
      };
      const {data: data2} = yield call(FApiServer.Resource.batchInfo, params2);
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

      // preVersionBaseProperties,
      //   preVersionOptionProperties,
      if (payload === 'baseProps') {
        const allKeys: string[] = [
          ...resourceVersionCreatorPage.rawProperties.map((rp) => {
            return rp.key;
          }),
          ...resourceVersionCreatorPage.customOptionsData.map((pp) => {
            return pp.key;
          }),
        ];
        return yield put<ChangeAction>({
          type: 'change',
          payload: {
            basePropertiesEditorVisible: true,
            basePropertiesEditorData: resourceVersionCreatorPage.preVersionBaseProperties
              .map<ResourceVersionCreatorPageModelState['basePropertiesEditorData'][number]>((cpd) => {
                return {
                  key: cpd.key,
                  keyError: allKeys.includes(cpd.key) ? '键不能重复' : '',
                  value: cpd.value,
                  valueError: '',
                  description: cpd.description,
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
            customOptionsEditorDataSource: resourceVersionCreatorPage.preVersionOptionProperties
              .map<ResourceVersionCreatorPageModelState['customOptionsEditorDataSource'][number]>((cpd) => {
                return {
                  key: cpd.key,
                  keyError: allKeys.includes(cpd.key) ? '键不能重复' : '',
                  description: cpd.description,
                  descriptionError: '',
                  custom: cpd.custom,
                  defaultValue: cpd.defaultValue,
                  defaultValueError: '',
                  customOption: cpd.customOption,
                  customOptionError: '',
                };
              }),
            customOptionsEditorVisible: true,
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

        yield put<AddDepsAction>({
          type: 'addDeps',
          payload: {
            relationships: resourceVersionCreatorPage.preVersionDeps.relationships,
            versions: resourceVersionCreatorPage.preVersionDeps.versions,
          },
        });
      }
    },
    * goToResourceDetailsBySha1({}: GoToResourceDetailsBySha1, {put, call, select}: EffectsCommandMap) {
      const {resourceVersionCreatorPage}: ConnectState = yield select(({resourceVersionCreatorPage}: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      const params: Parameters<typeof FApiServer.Resource.getResourceBySha1>[0] = {
        fileSha1: resourceVersionCreatorPage.resourceObjectError.sha1,
      };
      const {data} = yield call(FApiServer.Resource.getResourceBySha1, params);
      // console.log(data, '2134sdfa90j');
      // router.push(`/resource/${data[0].resourceId}`);
      window.open(`/resource/${data[0].resourceId}`);
    },
    * leaveAndClearData({}: LeaveAndClearDataAction, {put}: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * initModelState({}: InitModelStatesAction, {put}: EffectsCommandMap) {
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

// 批量检查是否循环依赖，返回循环依赖的 ID
interface BatchCycleDependencyCheckParams {
  resourceId: string;
  dependencies: {
    resourceId: string;
    versionRange: string;
  }[];
}

async function batchCycleDependencyCheck({resourceId, dependencies}: BatchCycleDependencyCheckParams): Promise<string[]> {
  const promises: Promise<any>[] = [];
  for (const dependency of dependencies) {
    const params: Parameters<typeof FApiServer.Resource.cycleDependencyCheck>[0] = {
      resourceId: resourceId,
      dependencies: [{
        resourceId: dependency.resourceId,
        versionRange: dependency.versionRange,
      }],
    };
    promises.push(FApiServer.Resource.cycleDependencyCheck(params))
  }
  const results = await Promise.all(promises);

  const resourceIDs: string[] = [];
  // console.log(results, 'results12390j');
  for (const [index, result] of Object.entries(results)) {
    // console.log(index, value);
    const {data} = result;
    if (!data) {
      resourceIDs.push(dependencies[Number(index)].resourceId)
    }
  }
  return resourceIDs;
}

interface GetAllContractsParamsType {
  resourceID: string;
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

async function getAllContracts({resourceID, resourceIDs}: GetAllContractsParamsType): Promise<GetAllContractsReturnType> {
  // console.log(resourceIDs, 'resourceIDs!!@#$!@#$!@$1230900000000');
  const allPromises = resourceIDs.map(async (id) => {
    const params: Parameters<typeof FApiServer.Contract.batchContracts>[0] = {
      subjectIds: id,
      subjectType: 1,
      licenseeIdentityType: 1,
      licensorId: id,
      licenseeId: resourceID,
      isLoadPolicyInfo: 1,
    };
    const {data} = await FApiServer.Contract.batchContracts(params);
    // console.log(data, 'data!!!1111100000000))))))');
    return data;
  });

  return (await Promise.all(allPromises)).flat();
}
