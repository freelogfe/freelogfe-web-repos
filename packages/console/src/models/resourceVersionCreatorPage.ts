import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import { ConnectState } from '@/models/connect';
import { history } from 'umi';
import BraftEditor, { EditorState } from 'braft-editor';
import fMessage from '@/components/fMessage';
import * as semver from 'semver';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { getFilesSha1Info } from '@/utils/service';
import { IResourceCreateVersionDraftType } from '@/type/resourceTypes';
import { getProcessor } from '@/components/FResourceAuthorizationProcessor';
import { IBaseUpcastResource } from '@/components/FResourceAuthorizationProcessor/types';
import moment from 'moment';
import { OnChange_Draft_Action } from '@/models/resourceSider';

export interface ResourceVersionCreatorPageModelState {
  pageState: 'loading' | 'loaded';
  resourceInfo: {
    resourceID: string;
    resourceName: string;
    latestVersion: string;
    resourceTypeCode: string;
    resourceType: string[];
    baseUpcastResources: {
      resourceID: string;
      resourceName: string;
    }[];
  } | null;

  draftSaveTime: string;

  dataIsDirty: boolean;

  versionInput: string;

  selectedFileInfo: {
    name: string;
    sha1: string;
    from: string;
  } | null;
  selectedFile_UsedResources: {
    resourceID: string;
    resourceName: string;
    resourceType: string;
    resourceVersion: string;
    url: string;
  }[];

  rawProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
  rawPropertiesState: 'parsing' | 'success' | 'fail';
  additionalProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];

  customProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];

  // customOptionsDataVisible: boolean;
  customConfigurations: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];

  descriptionEditorState: EditorState;

  preVersion_additionalProperties: {
    key: string;
    // name: string;
    value: string;
    // description: string;
  }[];
  preVersion_customProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];

  preVersion_customConfigurations: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];

  preVersionDirectDependencies: {
    id: string;
    name: string;
    type: 'resource' | 'object';

    versionRange?: string;
  }[];

  // promptLeavePath: string;
  releaseTipVisible: boolean;

  isOpenCartoon: boolean;
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

export interface OnChange_AdditionalProperties_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_AdditionalProperties';
  payload: {
    value: ResourceVersionCreatorPageModelState['additionalProperties'];
  };
}

export interface OnChange_CustomProperties_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_CustomProperties';
  payload: {
    value: ResourceVersionCreatorPageModelState['customProperties'];
  };
}

export interface OnChange_CustomConfigurations_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_CustomConfigurations';
  payload: {
    value: ResourceVersionCreatorPageModelState['customConfigurations'];
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

export interface OnChange_IsOpenCartoon_Action extends AnyAction {
  type: 'resourceVersionCreatorPage/onChange_IsOpenCartoon';
  payload: {
    value: boolean;
  };
}

export interface _FetchDraft_Action extends AnyAction {
  type: '_FetchDraft';
  payload: {
    delay: boolean;
  };
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
    delay?: boolean;
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
    onChange_AdditionalProperties: (action: OnChange_AdditionalProperties_Action, effects: EffectsCommandMap) => void;
    onChange_CustomProperties: (action: OnChange_CustomProperties_Action, effects: EffectsCommandMap) => void;
    onChange_CustomConfigurations: (action: OnChange_CustomConfigurations_Action, effects: EffectsCommandMap) => void;
    onClick_ImportLastVersionDependents_Btn: (action: OnClick_ImportLastVersionDependents_Btn_Action, effects: EffectsCommandMap) => void;
    onChange_DescriptionEditorState: (action: OnChange_DescriptionEditorState_Action, effects: EffectsCommandMap) => void;
    onChange_IsOpenCartoon: (action: OnChange_IsOpenCartoon_Action, effects: EffectsCommandMap) => void;

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
  pageState: 'loading',
  resourceInfo: null,

  draftSaveTime: '',
  dataIsDirty: false,

  versionInput: '',

  selectedFileInfo: null,
  selectedFile_UsedResources: [],

  rawProperties: [],
  rawPropertiesState: 'success',
  additionalProperties: [],
  customProperties: [],

  // customOptionsDataVisible: false,
  customConfigurations: [],

  descriptionEditorState: BraftEditor.createEditorState(''),

  preVersion_additionalProperties: [],
  preVersion_customProperties: [],
  preVersion_customConfigurations: [],
  preVersionDirectDependencies: [],

  releaseTipVisible: false,

  isOpenCartoon: false,
};

const Model: ResourceVersionCreatorModelType = {

  namespace: 'resourceVersionCreatorPage',

  state: initStates,

  effects: {
    * onMountPage({ payload }: OnMountPageAction, { put, call }: EffectsCommandMap) {

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageState: 'loading',
        },
      });
      const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: payload.resourceID,
        isLoadLatestVersionInfo: 1,
      };
      const { data: data_resourceInfo }: {
        data: {
          resourceId: string;
          resourceName: string;
          resourceType: string[];
          resourceTypeCode: string;
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
            resourceTypeCode: data_resourceInfo.resourceTypeCode,
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
      let preVersion_additionalProperties: ResourceVersionCreatorPageModelState['preVersion_additionalProperties'] = [];
      let preVersion_customProperties: ResourceVersionCreatorPageModelState['preVersion_customProperties'] = [];
      let preVersion_customConfigurations: ResourceVersionCreatorPageModelState['preVersion_customConfigurations'] = [];
      let preVersionDirectDependencies: ResourceVersionCreatorPageModelState['preVersionDirectDependencies'] = [];
      if (data_resourceInfo.latestVersion) {
        const params2: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo1>[0] = {
          resourceId: data_resourceInfo.resourceId,
          version: data_resourceInfo.latestVersion,
        };
        const { data: data_resourceVersionInfo }: {
          data: {
            customPropertyDescriptors: {
              key: string;
              name: string;
              defaultValue: string;
              type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
              candidateItems: string[];
              remark: string;
            }[];
            dependencies: {
              resourceId: string;
              resourceName: string;
              versionRange: string;
            }[];
            description: string;
            systemPropertyDescriptors: {
              key: string;
              valueDisplay: string;
              insertMode: 1 | 2;
            }[];
          }
        } = yield call(FServiceAPI.Resource.resourceVersionInfo1, params2);
        // console.log(data_resourceVersionInfo, 'data_resourceVersionInfo90-32iokpsdlfsdfsdlfkjl');
        descriptionEditorState = BraftEditor.createEditorState(data_resourceVersionInfo.description);
        preVersion_additionalProperties = data_resourceVersionInfo.systemPropertyDescriptors
          .filter((spd) => {
            return spd.insertMode === 2;
          })
          .map((spd) => {
            return {
              key: spd.key,
              value: spd.valueDisplay,
            };
          });
        preVersion_customProperties = data_resourceVersionInfo.customPropertyDescriptors
          .filter((cpd: any) => cpd.type === 'readonlyText')
          .map<ResourceVersionCreatorPageModelState['preVersion_customProperties'][number]>((cpd) => {
            // console.log(cpd, 'cpdoidsjflksdjflkjkl');
            return {
              key: cpd.key,
              name: cpd.name,
              value: cpd.defaultValue,
              description: cpd.remark,
            };
          });

        preVersion_customConfigurations = data_resourceVersionInfo.customPropertyDescriptors
          .filter((cpd: any) => cpd.type !== 'readonlyText')
          .map<ResourceVersionCreatorPageModelState['preVersion_customConfigurations'][number]>((cpd) => {
            return {
              key: cpd.key,
              name: cpd.name,
              description: cpd.remark,
              type: cpd.type === 'editableText' ? 'input' : 'select',
              input: cpd.defaultValue,
              select: cpd.candidateItems,
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
          preVersion_additionalProperties,
          preVersion_customProperties,
          preVersion_customConfigurations,
          preVersionDirectDependencies,
          descriptionEditorState,
        },
      });

      yield put<_FetchDraft_Action>({
        type: '_FetchDraft',
        payload: {
          delay: false,
        },
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

      const baseUpcastResources: {
        resourceID: string;
        resourceName: string;
      }[] = yield call(p.getBaseUpcastResources);

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
        // @ts-ignore
        inputAttrs: resourceVersionCreatorPage.additionalProperties
          .filter((ap) => {
            return ap.value !== '';
          })
          .map((ap) => {
            return {
              key: ap.key,
              value: ap.value,
            };
          }),
        customPropertyDescriptors: [
          ...resourceVersionCreatorPage.customProperties
            .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>
            ((i) => {
              return {
                type: 'readonlyText',
                key: i.key,
                name: i.name,
                remark: i.description,
                defaultValue: i.value,
              };
            }),
          ...resourceVersionCreatorPage.customConfigurations
            .map<NonNullable<Parameters<typeof FServiceAPI.Resource.createVersion>[0]['customPropertyDescriptors']>[number]>((i) => {
              const isInput: boolean = i.type === 'input';
              const options: string[] = i.select;
              return {
                type: isInput ? 'editableText' : 'select',
                key: i.key,
                name: i.name,
                remark: i.description,
                defaultValue: isInput ? i.input : options[0],
                // defaultValue: isInput ? i.input : '',
                candidateItems: isInput ? undefined : options,
              };
            }),
        ],
        description: resourceVersionCreatorPage.descriptionEditorState.toHTML() === '<p></p>'
          ? ''
          : resourceVersionCreatorPage.descriptionEditorState.toHTML(),
      };

      const { ret, errCode, data, msg } = yield call(FServiceAPI.Resource.createVersion, params);

      if (ret !== 0 || errCode !== 0 || !data) {
        self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 0]);
        // fMessage('创建失败', 'error');
        fMessage(msg, 'error');
        return;
      }
      self._czc?.push(['_trackEvent', '版本发行页', '发行', '', 1]);

      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
        caller: '97293874823yu4oi234io23hjkfdsasdf',
      });

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });

      // yield put<OnChange_DraftData_Action>({
      //   type: 'resourceInfo/onChange_DraftData',
      //   payload: {
      //     draftData: null,
      //   },
      // });

      history.replace(FUtil.LinkTo.resourceVersionCreateRelease({
        resourceID: data.resourceId,
        version: data.version,
      }));
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
          customPropertyDescriptors: {
            key: string;
            name: string;
            defaultValue: string;
            type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
            candidateItems: string[];
            remark: string;
          }[],
        }
      } = yield call(FServiceAPI.Storage.objectDetails, params);

      // console.log(data_objectDetails, 'data_objectDetailssfiojdlkfjdslkfjdslkflskdjflk');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          customProperties: data_objectDetails.customPropertyDescriptors
            .filter((cpd) => cpd.type === 'readonlyText')
            .map<ResourceVersionCreatorPageModelState['customProperties'][number]>((cpd: any) => {
              return {
                key: cpd.key,
                name: cpd.key,
                value: cpd.defaultValue,
                description: cpd.remark,
              };
            }),
          customConfigurations: data_objectDetails.customPropertyDescriptors
            .filter((cpd: any) => cpd.type !== 'readonlyText')
            .map<ResourceVersionCreatorPageModelState['customConfigurations'][number]>((cpd) => {
              return {
                key: cpd.key,
                name: cpd.name,
                // keyError: '',
                description: cpd.remark,
                // descriptionError: '',
                type: cpd.type === 'editableText' ? 'input' : 'select',
                input: cpd.defaultValue,
                // defaultValueError: '',
                select: cpd.candidateItems,
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
          additionalProperties: [],
          customProperties: [],
          customConfigurations: [],
          dataIsDirty: true,
          selectedFile_UsedResources: [],
        },
      });
    },
    * onClose_MarkdownEditor({}: OnClose_MarkdownEditor_Action, { select, call, put }: EffectsCommandMap) {

      // const { resourceVersionCreatorPage }: ConnectState = yield select(({ resourceVersionCreatorPage }: ConnectState) => ({
      //   resourceVersionCreatorPage,
      // }));

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          dataIsDirty: false,
        },
      });

      yield put<_FetchDraft_Action>({
        type: '_FetchDraft',
        payload: {
          delay: true,
        },
      });
    },
    * onChange_AdditionalProperties({ payload }: OnChange_AdditionalProperties_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          additionalProperties: payload.value,
          dataIsDirty: true,
        },
      });
    },
    * onChange_CustomProperties({ payload }: OnChange_CustomProperties_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          customProperties: payload.value,
          dataIsDirty: true,
        },
      });
    },
    * onChange_CustomConfigurations({ payload }: OnChange_CustomConfigurations_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          customConfigurations: payload.value,
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
    * onChange_IsOpenCartoon({ payload }: OnChange_IsOpenCartoon_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          isOpenCartoon: payload.value,
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
          draftData: IResourceCreateVersionDraftType;
        };
      } = yield call(FServiceAPI.Resource.lookDraft, params);
      // console.log(data_draft, 'data_draftiosdjlfkjsdlkfjklsdjflk');

      if (!!data_draft) {

        const { draftData } = data_draft;

        if (!!draftData.selectedFileInfo) {
          const params3: Parameters<typeof FServiceAPI.Resource.getResourceBySha1>[0] = {
            fileSha1: draftData.selectedFileInfo.sha1,
          };

          const { data: data_ResourcesBySha1 }: { data: any[] } = yield call(FServiceAPI.Resource.getResourceBySha1, params3);
          yield put<ChangeAction>({
            type: 'change',
            payload: {
              selectedFile_UsedResources: data_ResourcesBySha1
                .filter((d) => {
                  return d.userId !== FUtil.Tool.getUserIDByCookies();
                })
                .map((d) => {
                  return d.resourceVersions.map((v: any) => {
                    return {
                      resourceId: d.resourceId,
                      resourceName: d.resourceName,
                      resourceType: d.resourceType,
                      resourceVersion: v.version,
                      url: FUtil.LinkTo.resourceDetails({
                        resourceID: d.resourceId,
                        version: v.version,
                      }),
                    };
                  });
                }).flat(),
            },
          });
        }

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            versionInput: draftData.versionInput,
            selectedFileInfo: draftData.selectedFileInfo,
            additionalProperties: draftData.additionalProperties?.map((p) => {
              return {
                key: p.key,
                name: '',
                value: p.value,
                description: '',
              };
            }) || [],
            customProperties: draftData.customProperties || [],
            customConfigurations: draftData.customConfigurations || [],
            descriptionEditorState: BraftEditor.createEditorState(draftData.descriptionEditorInput),
          },
        });

        // console.log(draftData, 'draftDataoisdjflksdjflksdjflkj');
        const p: {
          addTargets(value: any): void;
          clear(): void;
          setBaseUpcastResources(value: IBaseUpcastResource[]): void;
        } = yield call(getProcessor, 'resourceVersionCreator');
        yield call(p.clear);
        yield call(p.addTargets, draftData.directDependencies);
        yield call(FUtil.Tool.promiseSleep);
        yield call(p.setBaseUpcastResources, draftData?.baseUpcastResources || []);
        if (draftData.selectedFileInfo) {
          yield put<_FetchRawPropsAction>({
            type: '_FetchRawProps',
            payload: {
              ifMarkdownFetchDependencies: false,
              delay: payload.delay,
            },
          });
        }
      }
      // console.log('DDDDEEEEEEE *(&(*&(*&');
      yield call(FUtil.Tool.promiseSleep, 1000);
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageState: 'loaded',
        },
      });
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

      const draftData: IResourceCreateVersionDraftType = {
        versionInput: resourceVersionCreatorPage.versionInput,
        selectedFileInfo: resourceVersionCreatorPage.selectedFileInfo,
        additionalProperties: resourceVersionCreatorPage.additionalProperties.map((p) => {
          return {
            key: p.key,
            value: p.value,
          };
        }),
        customProperties: resourceVersionCreatorPage.customProperties,
        customConfigurations: resourceVersionCreatorPage.customConfigurations,
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
          draftSaveTime: moment(Date()).format('YYYY-MM-DD hh:mm:ss'),
          dataIsDirty: false,
        },
      });

      yield put<OnChange_Draft_Action>({
        type: 'resourceSider/onChange_Draft',
        payload: {
          value: draftData,
        },
      });

      // yield put<OnChange_DraftData_Action>({
      //   type: 'resourceInfo/onChange_DraftData',
      //   payload: {
      //     draftData: draftData,
      //   },
      // });
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

      const params0: Parameters<typeof getFilesSha1Info>[0] = {
        sha1: [resourceVersionCreatorPage.selectedFileInfo.sha1],
        resourceTypeCode: resourceVersionCreatorPage.resourceInfo?.resourceTypeCode || '',
      };
      const {
        result,
        error,
      }: Awaited<ReturnType<typeof getFilesSha1Info>> = yield call(getFilesSha1Info, params0);

      // console.log(result, 'resulte53452sdf', error, 'error asdfsdfsdfsdf');

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

      if (payload.delay) {
        yield call(FUtil.Tool.promiseSleep, 1000);
      }

      if (result[0].state === 'success') {

        const params: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
          resourceId: resourceVersionCreatorPage.resourceInfo?.resourceID || '',
        };
        const { data: data_draft }: {
          data: null | {
            draftData: IResourceCreateVersionDraftType;
          };
        } = yield call(FServiceAPI.Resource.lookDraft, params);

        yield put<ChangeAction>({
          type: 'change',
          payload: {
            rawProperties: result[0].info
              .filter((i) => {
                return i.insertMode === 1;
              })
              .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
                return {
                  key: i.key,
                  name: i.name,
                  value: i.valueDisplay,
                  description: i.remark,
                };
              }),
            rawPropertiesState: 'success',
            additionalProperties: result[0].info
              .filter((i) => {
                return i.insertMode === 2;
              })
              .map<ResourceVersionCreatorPageModelState['rawProperties'][number]>((i) => {
                const item = data_draft?.draftData.additionalProperties?.find((ap) => {
                  return ap.key === i.key;
                }) || {};
                return {
                  key: i.key,
                  name: i.name,
                  value: i.valueDisplay,
                  description: i.remark,
                  ...item,
                };
              }),
          },
        });
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
