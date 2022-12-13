import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';
import BraftEditor, { EditorState } from 'braft-editor';
import fMessage from '@/components/fMessage';
import { FetchDataSourceAction, FetchDraftDataAction, OnChange_DraftData_Action } from '@/models/resourceInfo';
import * as semver from 'semver';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { fileAttrUnits } from '@/utils/format';
import { getFilesSha1Info } from '@/utils/service';
import { IResourceCreateVersionDraft } from '@/type/resourceTypes';
import { getProcessor } from '@/components/FResourceAuthorizationProcessor';
import { getDependenciesBySha1 } from '@/components/fResourceMarkdownEditor';
import { IBaseUpcastResource } from '@/components/FResourceAuthorizationProcessor/types';

export interface ResourceVersionCreatorPageModelState {
  resourceInfo: {
    resourceID: string;
    resourceName: string;
    latestVersion: string;
    resourceType: string[];
    baseUpcastResources: {
      resourceID: string;
      resourceName: string;
    }[];
  } | null;

  dataIsDirty: boolean;

  versionInput: string;

  selectedFileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;

  rawProperties: {
    key: string;
    value: string;
  }[];
  rawPropertiesState: 'parsing' | 'success' | 'fail';

  baseProperties: {
    key: string;
    value: string;
    description: string;
  }[];

  customOptionsDataVisible: boolean;
  customOptionsData: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];

  descriptionEditorState: EditorState;

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

  preVersionDirectDependencies: {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versionRange?: string;
  }[];

  // promptLeavePath: string;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceVersionCreatorPage/change',
  payload: Partial<ResourceVersionCreatorPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onMountPage';
  payload: {
    resourceID: string;
  };
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'resourceVersionCreatorPage/onUnmountPage';
}

export interface OnClick_CreateVersionBtn_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClick_CreateVersionBtn';
}

export interface OnTrigger_SaveDraft_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onTrigger_SaveDraft';
  payload: {
    showSuccessTip: boolean;
  };
}

export interface OnChange_DataIsDirty_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_DataIsDirty';
  payload: {
    value: boolean;
  };
}

export interface OnChange_VersionInput_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_VersionInput';
  payload: {
    value: string;
  };
}

export interface OnSucceed_UploadFile_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onSucceed_UploadFile';
  payload: {
    name: string;
    sha1: string;
  };
}

export interface OnSucceed_ImportObject_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onSucceed_ImportObject';
  payload: {
    name: string;
    sha1: string;
    objID: string;
  };
}

export interface OnDelete_ObjectFile_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onDelete_ObjectFile';
}

export interface OnClose_MarkdownEditor_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClose_MarkdownEditor';
}

export interface OnChange_BaseProperties_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_BaseProperties';
  payload: {
    value: ResourceVersionCreatorPageModelState['baseProperties'];
  };
}

export interface OnChange_CustomOptions_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_CustomOptions';
  payload: {
    value: ResourceVersionCreatorPageModelState['customOptionsData'];
  };
}

export interface OnClick_ImportLastVersionDependents_Btn_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onClick_ImportLastVersionDependents_Btn';
}

export interface OnChange_DescriptionEditorState_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_DescriptionEditorState';
  payload: {
    state: EditorState;
  };
}

export interface _FetchDraft_Action extends AnyAction {
  type: '_FetchDraft';
}

export interface _SaveDraft_Action extends AnyAction {
  type: '_SaveDraft';
  payload: {
    showSuccessTip: boolean;
  };
}

export interface _FetchRawPropsAction extends AnyAction {
  type: '_FetchRawProps';
  payload: {
    ifMarkdownFetchDependencies: boolean;
  };
}

export interface ResourceVersionCreatorModelType {
  namespace: 'resourceVersionCreatorPage';
  state: ResourceVersionCreatorPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;

    onTrigger_SaveDraft: (action: OnTrigger_SaveDraft_Action, effects: EffectsCommandMap) => void;
    onClick_CreateVersionBtn: (action: OnClick_CreateVersionBtn_Action, effects: EffectsCommandMap) => void;
    onChange_DataIsDirty: (action: OnChange_DataIsDirty_Action, effects: EffectsCommandMap) => void;
    onChange_VersionInput: (action: OnChange_VersionInput_Action, effects: EffectsCommandMap) => void;
    onSucceed_UploadFile: (action: OnSucceed_UploadFile_Action, effects: EffectsCommandMap) => void;
    onSucceed_ImportObject: (action: OnSucceed_ImportObject_Action, effects: EffectsCommandMap) => void;
    onDelete_ObjectFile: (action: OnDelete_ObjectFile_Action, effects: EffectsCommandMap) => void;
    onClose_MarkdownEditor: (action: OnClose_MarkdownEditor_Action, effects: EffectsCommandMap) => void;
    onChange_BaseProperties: (action: OnChange_BaseProperties_Action, effects: EffectsCommandMap) => void;
    onChange_CustomOptions: (action: OnChange_CustomOptions_Action, effects: EffectsCommandMap) => void;
    onClick_ImportLastVersionDependents_Btn: (action: OnClick_ImportLastVersionDependents_Btn_Action, effects: EffectsCommandMap) => void;
    onChange_DescriptionEditorState: (action: OnChange_DescriptionEditorState_Action, effects: EffectsCommandMap) => void;

    _FetchDraft: (action: _FetchDraft_Action, effects: EffectsCommandMap) => void;
    _SaveDraft: (action: _SaveDraft_Action, effects: EffectsCommandMap) => void;
    _FetchRawProps: (action: _FetchRawPropsAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ResourceVersionCreatorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceVersionCreatorPageModelState = {
  resourceInfo: null,

  dataIsDirty: false,

  versionInput: '',

  selectedFileInfo: null,

  rawProperties: [],
  rawPropertiesState: 'success',

  baseProperties: [],

  customOptionsDataVisible: false,
  customOptionsData: [],

  descriptionEditorState: BraftEditor.createEditorState(''),

  preVersionBaseProperties: [],
  preVersionOptionProperties: [],
  preVersionDirectDependencies: [],
};

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: initStates,

  effects: {
    * onMountPage({ payload }: OnMountPageAction, { put, call }: EffectsCommandMap) {

      const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: payload.resourceID,
        isLoadLatestVersionInfo: 1,
      };
      const { data: data_resourceInfo }: {
        data: {
          resourceId: string;
          resourceName: string;
          resourceType: string[];
          latestVersion: string;
          baseUpcastResources: {
            resourceId: string;
            resourceName: string;
          }[];
        };
      } = yield call(FServiceAPI.Resource.info, params1);
      // console.log(data, '2093jdsl;kfasdf');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceInfo: {
            resourceID: data_resourceInfo.resourceId,
            resourceName: data_resourceInfo.resourceName,
            latestVersion: data_resourceInfo.latestVersion,
            resourceType: data_resourceInfo.resourceType,
            baseUpcastResources: data_resourceInfo.baseUpcastResources.map((bur) => {
              return {
                resourceID: bur.resourceId,
                resourceName: bur.resourceName,
              };
            }),
          },
        },
      });

      let descriptionEditorState: EditorState = BraftEditor.createEditorState('');
      let preVersionBaseProperties: ResourceVersionCreatorPageModelState['preVersionBaseProperties'] = [];
      let preVersionOptionProperties: ResourceVersionCreatorPageModelState['preVersionOptionProperties'] = [];
      let preVersionDirectDependencies: ResourceVersionCreatorPageModelState['preVersionDirectDependencies'] = [];
      if (data_resourceInfo.latestVersion) {
        const params2: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo1>[0] = {
          resourceId: data_resourceInfo.resourceId,
          version: data_resourceInfo.latestVersion,
        };
        const { data: data_resourceVersionInfo }: {
          data: {
            customPropertyDescriptors: any[];
            dependencies: {
              resourceId: string;
              resourceName: string;
              versionRange: string;
            }[];
            description: string;
          }
        } = yield call(FServiceAPI.Resource.resourceVersionInfo1, params2);
        // console.log(data_resourceVersionInfo, 'data_resourceVersionInfo90-32iokpsdlfsdfsdlfkjl');
        descriptionEditorState = BraftEditor.createEditorState(data_resourceVersionInfo.description);
        preVersionBaseProperties = (data_resourceVersionInfo.customPropertyDescriptors as any[])
          .filter((cpd: any) => cpd.type === 'readonlyText')
          .map<ResourceVersionCreatorPageModelState['preVersionBaseProperties'][number]>((cpd: any) => {
            return {
              key: cpd.key,
              value: cpd.defaultValue,
              description: cpd.remark,
            };
          });

        preVersionOptionProperties = (data_resourceVersionInfo.customPropertyDescriptors as any[])
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
        preVersionDirectDependencies = data_resourceVersionInfo.dependencies.map((d) => {
          return {
            id: d.resourceId,
            name: d.resourceName,
            type: 'resource',
            versionRange: d.versionRange,
          };
        });
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          versionInput: (semver.inc(data_resourceInfo.latestVersion, 'patch') || '0.1.0'),
          preVersionBaseProperties,
          preVersionOptionProperties,
          preVersionDirectDependencies,
          descriptionEditorState,
        },
      });

      yield put<_FetchDraft_Action>({
        type: '_FetchDraft',
      });

    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      window.onbeforeunload = null;
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * onTrigger_SaveDraft({ payload }: OnTrigger_SaveDraft_Action, { put }: EffectsCommandMap) {
      yield put<_SaveDraft_Action>({
        type: '_SaveDraft',
        payload: {
          showSuccessTip: payload.showSuccessTip,
        },
      });
    },
    * onClick_CreateVersionBtn({ payload }: OnClick_CreateVersionBtn_Action, { put, call, select }: EffectsCommandMap) {

      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      if (!resourceVersionCreatorPage.resourceInfo || !resourceVersionCreatorPage.selectedFileInfo) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });
      const p: {
        getAllTargets(): void;
        getAllResourcesWithContracts(): void;
        isCompleteAuthorization(): void;
        getBaseUpcastResources(): { resourceID: string; resourceName: string; }[];
      } = yield call(getProcessor, 'resourceVersionCreator');

      const isCompleteAuthorization: boolean = yield call(p.isCompleteAuthorization);

      if (!isCompleteAuthorization) {
        fMessage('依赖中存在未获取授权的资源', 'error');
        return;
      }


      const dependentAllResourcesWithContracts: {
        resourceID: string;
        resourceName: string;
        contracts: {
          policyID: string;
          contractID: string;
        }[];
      }[] = yield call(p.getAllResourcesWithContracts);
      const dependentAllTargets: {
        id: string;
        name: string;
        type: 'resource' | 'object';
        versionRange?: string;
      }[] = yield call(p.getAllTargets);
      // console.log(payload, 'payload98isfjsdolifjksdlfjlkj');

      const baseUpcastResources: {
        resourceID: string;
        resourceName: string;
      }[] = yield call(p.getBaseUpcastResources);
      // const baseUpcastResources: { resourceId: string }[] = dependentAllResourcesWithContracts
      //   .filter((r) => {
      //     return r.contracts.length === 0;
      //   })
      //   .map((r) => {
      //     return { resourceId: r.resourceID };
      //   });
      const dependencies: {
        resourceId: string;
        versionRange: string;
      }[] = dependentAllTargets
        .map((r) => {
          return {
            resourceId: r.id,
            versionRange: r.versionRange || '',
          };
        });
      const resolveResources: {
        resourceId: string;
        contracts: {
          policyId: string;
        }[];
      }[] = dependentAllResourcesWithContracts
        .filter((r) => {
          return r.contracts.length > 0;
        })
        .map((r) => {
          return {
            resourceId: r.resourceID,
            contracts: r.contracts.map((c) => {
              return {
                policyId: c.policyID,
              };
            }),
          };
        });
      const params: Parameters<typeof FServiceAPI.Resource.createVersion>[0] = {
          resourceId: resourceVersionCreatorPage.resourceInfo.resourceID,
          version: resourceVersionCreatorPage.versionInput,
          fileSha1: resourceVersionCreatorPage.selectedFileInfo.sha1,
          filename: resourceVersionCreatorPage.selectedFileInfo.name,
          baseUpcastResources: baseUpcastResources.map((r) => {
            return { resourceId: r.resourceID };
          }),
          dependencies: dependencies,
          resolveResources: resolveResources,
          customPropertyDescriptors: [
            ...resourceVersionCreatorPage.baseProperties.map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>
            ((i) => {
              return {
                type: 'readonlyText',
                key: i.key,
                remark: i.description,
                defaultValue: i.value,
              };
            }),
            ...
              resourceVersionCreatorPage.customOptionsData.map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
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
          description: resourceVersionCreatorPage.descriptionEditorState.toHTML() === '<p></p>'
            ? ''
            : resourceVersionCreatorPage.descriptionEditorState.toHTML(),
        }
      ;

      const { ret, errCode, data } = yield call(FServiceAPI.Resource.createVersion, params);
      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 0]);
        fMessage('创建失败', 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 1]);
      yield put<FetchDataSourceAction>({
        type: 'resourceInfo/fetchDataSource',
        payload: params.resourceId,
      });
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
        caller: '97293874823yu4oi234io23hjkfdsasdf',
      });
      // router.replace(`/resource/${data.resourceId}/$version/${data.$version}/success`)
      history.replace(FUtil.LinkTo.resourceVersionCreateSuccess({
        resourceID: data.resourceId,
        version: data.version,
      }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });

      yield put<OnChange_DraftData_Action>({
        type: 'resourceInfo/onChange_DraftData',
        payload: {
          draftData: null,
        },
      });
    },
    * onChange_DataIsDirty({ payload }: OnChange_DataIsDirty_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: payload.value,
        },
      });
    },
    * onChange_VersionInput({ payload }: OnChange_VersionInput_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          versionInput: payload.value,
          dataIsDirty: true,
        },
      });
    },

    * onSucceed_UploadFile({ payload }: OnSucceed_UploadFile_Action, { put, call }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedFileInfo: {
            sha1: payload.sha1,
            name: payload.name,
            from: '本地上传',
          },
          dataIsDirty: true,
        },
      });

      yield put<_FetchRawPropsAction>({
        type: '_FetchRawProps',
        payload: {
          ifMarkdownFetchDependencies: true,
        },
      });
    },
    * onSucceed_ImportObject({ payload }: OnSucceed_ImportObject_Action, { call, put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedFileInfo: {
            sha1: payload.sha1,
            name: payload.name,
            from: '存储空间',
          },
          dataIsDirty: true,
        },
      });

      const params: Parameters<typeof FServiceAPI.Storage.objectDetails>[0] = {
        objectIdOrName: payload.objID,
      };
      const { data: data_objectDetails }: {
        data: {
          dependencies: {
            name: string;
            type: 'resource' | 'object';
            versionRange?: string;
          }[];
          customPropertyDescriptors: any[],
        }
      } = yield call(FServiceAPI.Storage.objectDetails, params);

      // console.log(data_objectDetails, 'data_objectDetailssfiojdlkfjdslkfjdslkflskdjflk');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          baseProperties: data_objectDetails.customPropertyDescriptors
            .filter((cpd: any) => cpd.type === 'readonlyText')
            .map<ResourceVersionCreatorPageModelState['baseProperties'][number]>((cpd: any) => {
              return {
                key: cpd.key,
                value: cpd.defaultValue,
                description: cpd.remark,
              };
            }),
          customOptionsData: data_objectDetails.customPropertyDescriptors
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
        },
      });

      // console.log(data_objectDetails, 'datasdoipejflskdfjlsdjflskj');
      const resourceNames: string[] = data_objectDetails.dependencies
        .filter((d) => {
          return d.type === 'resource';
        })
        .map((d) => {
          return d.name;
        });

      const objNames: string[] = data_objectDetails.dependencies
        .filter((d) => {
          return d.type === 'object';
        })
        .map((d) => {
          return d.name;
        });

      let addR: {
        id: string;
        name: string;
        type: 'resource';
        versionRange: string;
      }[] = [];
      let addO: {
        id: string;
        name: string;
        type: 'object';
      }[] = [];
      if (resourceNames.length > 0) {
        const { data: data_resources }: {
          data: {
            resourceId: string;
            resourceName: string;
            latestVersion: string;
          }[];
        } = yield call(FServiceAPI.Resource.batchInfo, {
          resourceNames: resourceNames.join(),
        });
        // console.log(data_resources, 'resourceiojlkdsjflsdjflk');
        addR = data_resources.map((r) => {
          return {
            id: r.resourceId,
            name: r.resourceName,
            type: 'resource',
            versionRange: '^' + r.latestVersion,
          };
        });
      }

      if (objNames.length > 0) {
        const { data: data_objs }: {
          data: {
            bucketId: string;
            bucketName: string;
            objectId: string;
            objectName: string;
          }[];
        } = yield call(FServiceAPI.Storage.batchObjectList, {
          fullObjectNames: objNames.map((o) => {
            return encodeURIComponent(o);
          }).join(','),
        });

        // console.log(data_objs, 'objsoisjdlfksjfljsdlkfjsdlfjl');
        addO = data_objs.map((o) => {
          return {
            id: o.objectId,
            name: `${o.bucketName}/${o.objectName}`,
            type: 'object',
          };
        });
      }

      const processor: { addTargets(targets: any[]): void } = yield call(getProcessor, 'resourceVersionCreator');
      yield call(processor.addTargets, [
        ...addR,
        ...addO,
      ]);

      yield put<_FetchRawPropsAction>({
        type: '_FetchRawProps',
        payload: {
          ifMarkdownFetchDependencies: true,
        },
      });
    },
    * onDelete_ObjectFile({}: OnDelete_ObjectFile_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          selectedFileInfo: null,
          rawProperties: [],
          baseProperties: [],
          customOptionsData: [],
          dataIsDirty: true,
        },
      });
    },
    * onClose_MarkdownEditor({}: OnClose_MarkdownEditor_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });
      yield put<_FetchDraft_Action>({
        type: '_FetchDraft',
      });
    },
    * onChange_BaseProperties({ payload }: OnChange_BaseProperties_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          baseProperties: payload.value,
          dataIsDirty: true,
        },
      });
    },
    * onChange_CustomOptions({ payload }: OnChange_CustomOptions_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          customOptionsData: payload.value,
          dataIsDirty: true,
        },
      });
    },
    * onClick_ImportLastVersionDependents_Btn({ payload }: OnClick_ImportLastVersionDependents_Btn_Action, {
      call,
      select,
      put,
    }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));
      const p: {
        addTargets(value: any): void;
        clear(): void;
      } = yield call(getProcessor, 'resourceVersionCreator');
      yield call(p.clear);
      yield call(p.addTargets, resourceVersionCreatorPage.preVersionDirectDependencies);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: true,
        },
      });
    },
    * onChange_DescriptionEditorState({ payload }: OnChange_DescriptionEditorState_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          descriptionEditorState: payload.state,
          dataIsDirty: true,
        },
      });
    },

    * _FetchDraft({ payload }: _FetchDraft_Action, { call, put, select }: EffectsCommandMap) {

      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      if (!resourceVersionCreatorPage.resourceInfo) {
        return;
      }

      const params: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: resourceVersionCreatorPage.resourceInfo.resourceID,
      };
      const { data: data_draft }: {
        data: null | {
          draftData: IResourceCreateVersionDraft;
        };
      } = yield call(FServiceAPI.Resource.lookDraft, params);

      if (data_draft) {
        const { draftData } = data_draft;

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            versionInput: draftData.versionInput,
            selectedFileInfo: draftData.selectedFileInfo,
            baseProperties: draftData.baseProperties,
            customOptionsData: draftData.customOptionsData,
            descriptionEditorState: BraftEditor.createEditorState(draftData.descriptionEditorInput),
          },
        });
        const p: {
          addTargets(value: any): void;
          clear(): void;
          setBaseUpcastResources(value: IBaseUpcastResource[]): void;
        } = yield call(getProcessor, 'resourceVersionCreator');
        yield call(p.clear);
        yield call(p.addTargets, draftData.directDependencies);
        yield call(FUtil.Tool.promiseSleep);
        // console.log(draftData.baseUpcastResources, 'draftData.baseUpcastResourcesoiskdejflkdjl');
        yield call(p.setBaseUpcastResources, draftData.baseUpcastResources);
        if (draftData.selectedFileInfo) {
          yield put<_FetchRawPropsAction>({
            type: '_FetchRawProps',
            payload: {
              ifMarkdownFetchDependencies: false,
            },
          });
        }
      }
    },
    * _SaveDraft({ payload }: _SaveDraft_Action, { select, call, put }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      if (!resourceVersionCreatorPage.resourceInfo) {
        return;
      }

      const p: { getAllTargets(): void; getBaseUpcastResources(): { resourceID: string; resourceName: string; }[] } = yield call(getProcessor, 'resourceVersionCreator');
      const directDependencies: any[] = yield call(p.getAllTargets);
      const baseUpcastResources: {
        resourceID: string;
        resourceName: string;
      }[] = yield call(p.getBaseUpcastResources);

      // console.log(baseUpcastResources, 'baseUpcastResourcesoisjdlkfjlsdkjflsdjfljsl');

      const draftData: IResourceCreateVersionDraft = {
        versionInput: resourceVersionCreatorPage.versionInput,
        selectedFileInfo: resourceVersionCreatorPage.selectedFileInfo,
        baseProperties: resourceVersionCreatorPage.baseProperties,
        customOptionsData: resourceVersionCreatorPage.customOptionsData,
        directDependencies: directDependencies,
        descriptionEditorInput: resourceVersionCreatorPage.descriptionEditorState.toHTML(),
        baseUpcastResources: baseUpcastResources,
      };

      const params: Parameters<typeof FServiceAPI.Resource.saveVersionsDraft>[0] = {
        resourceId: resourceVersionCreatorPage.resourceInfo.resourceID,
        draftData: draftData,
      };
      yield call(FServiceAPI.Resource.saveVersionsDraft, params);
      if (payload.showSuccessTip) {
        fMessage('暂存草稿成功');
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });

      yield put<OnChange_DraftData_Action>({
        type: 'resourceInfo/onChange_DraftData',
        payload: {
          draftData: draftData,
        },
      });
    },
    * _FetchRawProps({ payload }: _FetchRawPropsAction, { select, put, call }: EffectsCommandMap) {
      const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
        resourceVersionCreatorPage,
      }));

      if (!resourceVersionCreatorPage.selectedFileInfo) {
        return;
      }

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          rawPropertiesState: 'parsing',
        },
      });

      const params: Parameters<typeof getFilesSha1Info>[0] = {
        sha1: [resourceVersionCreatorPage.selectedFileInfo.sha1],
      };
      const {
        result,
        error,
      }: { result: any[]; error: string; } = yield call(getFilesSha1Info, params);
      if (error !== '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: [],
          },
        });
        return fMessage(error, 'error');
      }

      if (result[0].state === 'fail') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: [],
          },
        });
        return fMessage('文件解析失败', 'error');
      }

      if (result[0].state === 'success') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: Object.entries(result[0].info.metaInfo).map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((rp: any) => {
              return {
                key: rp[0],
                value: fileAttrUnits[rp[0]] ? fileAttrUnits[rp[0]](rp[1]) : rp[1],
              };
            }),
            rawPropertiesState: 'success',
          },
        });

        // console.log(result[0].info.metaInfo, 'result[0].info.metaInfoiojslkfdjflkjsdlk');

        // if (payload.ifMarkdownFetchDependencies && result[0].info.metaInfo['mime'] === 'text/markdown') {
        //   const deps: string[] = yield call(getDependenciesBySha1, resourceVersionCreatorPage.selectedFileInfo.sha1);
        //   // console.log(deps, 'depsiowejlfksjdlfkjsdlkfjlk');
        //   if (deps.length > 0) {
        //     const params: Parameters<typeof FServiceAPI.Resource.batchInfo>[0] = {
        //       resourceNames: deps.join(','),
        //     };
        //     const { data: data_batchInfo }: {
        //       data: {
        //         resourceId: string;
        //         resourceName: string;
        //       }[];
        //     } = yield call(FServiceAPI.Resource.batchInfo, params);
        //     // console.log(data_batchInfo, 'data_batchInfoiosfjsldkjfldsjlskfjlksdj');
        //
        //     const processor: { addTargets(targets: any[]): void } = yield call(getProcessor, 'resourceVersionCreator');
        //     const needAddTargets: {
        //       id: string;
        //       name: string;
        //       type: 'resource';
        //     }[] = data_batchInfo.map((bi) => {
        //       return {
        //         id: bi.resourceId,
        //         name: bi.resourceName,
        //         type: 'resource',
        //       };
        //     });
        //     yield call(processor.addTargets, needAddTargets);
        //   }
        //
        // }
      }

    },

  },

  reducers: {
    change(state, { payload, caller }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {

    },
  },

};

export default Model;
