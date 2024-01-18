import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import moment from 'moment';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { history } from 'umi';
import fMessage from '@/components/fMessage';
import { PolicyFullInfo_Type } from '@/type/contractTypes';
import { IResourceCreateVersionDraftType } from '@/type/resourceTypes';

// import { TempModelState } from '@/models/__template';

export interface ResourceVersionEditorPageModelState {
  pageState: 'loading' | 'loaded';
  resourceID: string;
  version: string;
  versions: string[];
  // signingDate: string;

  resourceInfo: {
    resourceID: string;
    resourceName: string;
    resourceType: string[];
  } | null;
  draft: null | IResourceCreateVersionDraftType;
  resourceVersionInfo: {
    version: string;
    sha1: string;
    createData: string;
  } | null;

  descriptionFullScreen: boolean;
  description: string;

  graphShow: boolean;

  rawProperties: {
    key: string;
    name: string;
    value: string;
    description: string;
  }[];
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

  customConfigurations: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];

  directDependencies: {
    id: string;
    name: string;
    type: 'resource' | 'object';
    versionRange?: string;
  }[];
  baseUpcastResources: {
    resourceID: string;
    resourceName: string;
  }[];
  reload: number;
}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceVersionEditorPage/change';
  payload: Partial<ResourceVersionEditorPageModelState>;
}

export interface OnMount_Page_Action extends AnyAction {
  type: 'resourceVersionEditorPage/onMount_Page';
  payload: {
    resourceID: string;
    version: string;
  };
}

export interface OnUnmount_Page_Action extends AnyAction {
  type: 'resourceVersionEditorPage/onUnmount_Page';
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceVersionEditorPage/fetchDataSource' | 'fetchDataSource';
}

export interface OnChange_Version_Action extends AnyAction {
  type: 'resourceVersionEditorPage/onChange_Version';
  payload: {
    version: string;
  };
}

export interface UpdateDataSourceAction extends AnyAction {
  type: 'resourceVersionEditorPage/updateDataSource';
  payload: Partial<Parameters<typeof FServiceAPI.Resource.updateResourceVersionInfo>[0]>;
}

export interface SyncAllPropertiesAction extends AnyAction {
  type: 'syncAllProperties' | 'resourceVersionEditorPage/syncAllProperties';
}

export interface ResourceVersionEditorModelType {
  namespace: 'resourceVersionEditorPage';
  state: ResourceVersionEditorPageModelState;
  effects: {
    onMount_Page: (action: OnMount_Page_Action, effects: EffectsCommandMap) => void;
    onUnmount_Page: (action: OnUnmount_Page_Action, effects: EffectsCommandMap) => void;
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    onChange_Version: (action: OnChange_Version_Action, effects: EffectsCommandMap) => void;
    updateDataSource: (action: UpdateDataSourceAction, effects: EffectsCommandMap) => void;
    syncAllProperties: (action: SyncAllPropertiesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    // changeDataSource: DvaReducer<ResourceVersionEditorPageModelState, ChangeDataSourceAction>;
    change: DvaReducer<ResourceVersionEditorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const initStates: ResourceVersionEditorPageModelState = {
  pageState: 'loading',
  resourceID: '',
  version: '',
  versions: [],
  // signingDate: '',
  resourceInfo: null,
  draft: null,
  resourceVersionInfo: null,

  descriptionFullScreen: false,
  description: '',

  graphShow: true,

  rawProperties: [],
  additionalProperties: [],
  customProperties: [],

  customConfigurations: [],

  directDependencies: [],
  baseUpcastResources: [],
  reload: 0,
};

const Model: ResourceVersionEditorModelType = {

  namespace: 'resourceVersionEditorPage',

  state: initStates,

  effects: {
    * onMount_Page({ payload }: OnMount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          resourceID: payload.resourceID,
          version: payload.version,
        },
      });
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
      });
    },
    * onUnmount_Page({}: OnUnmount_Page_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
      });
    },
    * fetchDataSource({}: FetchDataSourceAction, { call, put, select }: EffectsCommandMap) {
      // const params: ResourceVersionInfoParamsType1 = action.payload;
      const { resourceVersionEditorPage }: ConnectState = yield select(({ resourceVersionEditorPage }: ConnectState) => ({
        resourceVersionEditorPage,
      }));

      const params1: Parameters<typeof FServiceAPI.Resource.info>[0] = {
        resourceIdOrName: resourceVersionEditorPage.resourceID,
        isLoadPolicyInfo: 1,
        isTranslate: 1,
      };
      // console.log(params1, 'params 手动阀手动阀撒旦;flkjlk lksdajf;lkjl');
      const { data: data_resourceInfo }: {
        data: {
          userId: number;
          status: number;
          resourceId: string;
          resourceName: string;
          resourceVersions: {
            version: string;
          }[];
          latestVersion: string;
          coverImages: string[];
          resourceType: string[];
          policies: PolicyFullInfo_Type[];
          baseUpcastResources: {
            resourceId: string;
            resourceName: string;
          }[];
        };
      } = yield call(FServiceAPI.Resource.info, params1);
      let resourceSelectedVersion: string = resourceVersionEditorPage.version;
      if (data_resourceInfo.latestVersion === '') {
        resourceSelectedVersion = '';
      } else {
        if (resourceSelectedVersion === '') {
          resourceSelectedVersion = data_resourceInfo.latestVersion;
        }
      }
      // console.log(resourceSelectedVersion, 'resourceVersionEditorPage.version sdfjsdlkfjlkjl');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // pageState: 'loaded',
          version: resourceSelectedVersion,
        },
      });
      if (resourceSelectedVersion === '') {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pageState: 'loaded',
            // version: resourceSelectedVersion,
          },
        });
        return;
      }

      const params3: Parameters<typeof FServiceAPI.Resource.lookDraft>[0] = {
        resourceId: resourceVersionEditorPage.resourceID,
      };
      // console.log(params, 'params9iosdjflksjdflkjlk');
      const { data: data_draft } = yield call(FServiceAPI.Resource.lookDraft, params3);
      // console.log(data_draft, 'data_draftewsdi9fojsdlikfjlsdjflksjdlkfjlskdjl');
      const params: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo1>[0] = {
        resourceId: resourceVersionEditorPage.resourceID,
        // version: resourceVersionEditorPage.version,
        version: resourceSelectedVersion,
      };
      // console.log(params, 'params siduofjlksdjflkjsdlkfjlksdjflkjdslkfjlksjdlkfjlksj');
      const { data: data_versionInfo }: {
        data: {
          resourceId: string;
          resourceName: string;
          resourceType: string[];
          resourceTypeCode: string;
          version: string;
          fileSha1: string;
          customPropertyDescriptors: {
            key: string;
            name: string;
            defaultValue: string;
            type: 'editableText' | 'readonlyText' | 'radio' | 'checkbox' | 'select';
            candidateItems: string[];
            remark: string;
          }[],
          createDate: string;
          description: string;
          systemPropertyDescriptors: {
            defaultValue: number | string;
            key: string;
            name: string;
            remark: string;
            valueDisplay: string;
            valueUnit: string;
            insertMode: 1 | 2;
          }[];
          dependencies: {
            resourceId: string;
            resourceName: string;
            versionRange: string;
          }[];
        }
      } = yield call(FServiceAPI.Resource.resourceVersionInfo1, params);
      // console.log(data_versionInfo, 'data_versionInfo data902q3jrlkasdfasdf');
      if (!data_versionInfo) {
        history.replace(FUtil.LinkTo.exception403({}));
        return;
      }

      const base = data_versionInfo.customPropertyDescriptors.filter((i) => i.type === 'readonlyText');
      const opt = data_versionInfo.customPropertyDescriptors.filter((i) => i.type === 'editableText' || i.type === 'select');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          // pageState: 'loaded',
          versions: data_resourceInfo.resourceVersions.map((v) => {
            return v.version;
          }).reverse(),
          resourceInfo: {
            resourceID: data_versionInfo.resourceId,
            resourceName: data_versionInfo.resourceName,
            resourceType: data_versionInfo.resourceType,
          },
          draft: data_draft ? data_draft.draftData : null,
          resourceVersionInfo: {
            version: data_versionInfo.version,
            sha1: data_versionInfo.fileSha1,
            createData: moment(data_versionInfo.createDate).format('YYYY-MM-DD'),
          },
          // signingDate: moment(data_versionInfo.createDate).format('YYYY-MM-DD'),
          description: data_versionInfo.description,

          rawProperties: data_versionInfo.systemPropertyDescriptors
            .filter((spd) => {
              return spd.insertMode === 1;
            })
            .map<ResourceVersionEditorPageModelState['rawProperties'][number]>((spd) => {
              return {
                key: spd.key,
                name: spd.name,
                value: spd.valueDisplay,
                description: spd.remark,
              };
            }),
          additionalProperties: data_versionInfo.systemPropertyDescriptors
            .filter((spd) => {
              return spd.insertMode === 2;
            })
            .map<ResourceVersionEditorPageModelState['rawProperties'][number]>((spd) => {
              return {
                key: spd.key,
                name: spd.name,
                value: spd.valueDisplay,
                description: spd.remark,
              };
            }),
          customProperties: base
            .map((b) => {
              return {
                key: b.key,
                name: b.name,
                value: b.defaultValue,
                description: b.remark,
              };
            }),
          customConfigurations: opt.map((i) => ({
            key: i.key,
            name: i.name,
            description: i.remark,
            type: i.type === 'editableText' ? 'input' : 'select',
            input: i.defaultValue,
            select: i.candidateItems,
          })),

          directDependencies: data_versionInfo.dependencies.map((r) => {
            return {
              id: r.resourceId,
              name: r.resourceName,
              type: 'resource',
              versionRange: r.versionRange,
            };
          }),
          baseUpcastResources: data_resourceInfo.baseUpcastResources.map((b) => {
            return {
              resourceID: b.resourceId,
              resourceName: b.resourceName,
            };
          }),
          reload: resourceVersionEditorPage.reload + 1,
        },
      });

      // console.log('******************************************************************');
      yield call(FUtil.Tool.promiseSleep, 1000);
      // console.log('##############################################################');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageState: 'loaded',
        },
      });
    },
    * onChange_Version({ payload }: OnChange_Version_Action, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          version: payload.version,
        },
      });
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
      });
    },
    * updateDataSource(action: UpdateDataSourceAction, { call, put, select }: EffectsCommandMap) {
      const baseInfo: { version: string; resourceId: string; } = yield select(({ resourceVersionEditorPage }: ConnectState) => ({
        version: resourceVersionEditorPage.version,
        resourceId: resourceVersionEditorPage.resourceID,
      }));
      const params: Parameters<typeof FServiceAPI.Resource.updateResourceVersionInfo>[0] = {
        ...baseInfo,
        ...action.payload,
        inputAttrs: action.payload.inputAttrs || [],
      };
      yield call(FServiceAPI.Resource.updateResourceVersionInfo, params);
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: baseInfo,
      });
    },
    * syncAllProperties({}: SyncAllPropertiesAction, { select, call }: EffectsCommandMap) {
      const { resourceVersionEditorPage }: ConnectState = yield select(({ resourceVersionEditorPage }: ConnectState) => ({
        resourceVersionEditorPage,
      }));

      const customPropertyDescriptors: Parameters<typeof FServiceAPI.Resource.updateResourceVersionInfo>[0]['customPropertyDescriptors'] = [
        ...resourceVersionEditorPage.customProperties.map((bp) => {
          return {
            key: bp.key,
            name: bp.name,
            defaultValue: bp.value,
            type: 'readonlyText' as 'readonlyText',
            remark: bp.description,
          };
        }),
        ...resourceVersionEditorPage.customConfigurations.map((pp) => {
          const isInput: boolean = pp.type === 'input';
          const options: string[] = pp.select;
          return {
            type: isInput ? 'editableText' : 'select' as 'editableText' | 'select',
            key: pp.key,
            name: pp.name,
            remark: pp.description,
            defaultValue: isInput ? pp.input : options[0],
            candidateItems: isInput ? undefined : options,
          };
        }),

      ];

      const params: Parameters<typeof FServiceAPI.Resource.updateResourceVersionInfo>[0] = {
        version: resourceVersionEditorPage.version,
        resourceId: resourceVersionEditorPage.resourceID,
        customPropertyDescriptors: customPropertyDescriptors,
        // @ts-ignore
        inputAttrs: resourceVersionEditorPage.additionalProperties.map((ap) => {
          return {
            key: ap.key,
            value: ap.value,
          };
        }),
      };
      const { ret, errCode, data, msg } = yield call(FServiceAPI.Resource.updateResourceVersionInfo, params);
      if (ret !== 0 || errCode !== 0) {
        fMessage(msg, 'error');
      }
    },
  },

  reducers: {
    // changeDataSource(state: ResourceVersionEditorPageModelState, action: ChangeDataSourceAction): ResourceVersionEditorPageModelState {
    //   return {...state, ...action.payload};
    // },
    change(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },

  subscriptions: {
    setup({ dispatch, history }: SubscriptionAPI) {

      // history.listen((listener) => {
      //   const regexp = pathToRegexp('/resource/:id/$version/:$version');
      //   const result = regexp.exec(listener.pathname);
      //   if (result) {
      //     if (result[2] === 'creator') {
      //       return;
      //     }
      //     dispatch<FetchDataSourceAction>({
      //       type: 'fetchDataSource',
      //       payload: {
      //         resourceId: result[1],
      //         $version: result[2],
      //       }
      //     });
      //   }
      // });

    },
  },

};

export default Model;
