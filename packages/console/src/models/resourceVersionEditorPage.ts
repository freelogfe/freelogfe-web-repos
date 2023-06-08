import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription, SubscriptionAPI } from 'dva';
import { DvaReducer } from './shared';
import moment from 'moment';
import { ConnectState } from '@/models/connect';
import { FUtil, FServiceAPI } from '@freelog/tools-lib';
import { history } from 'umi';
import { fileAttrUnits } from '@/utils/format';
import fMessage from '@/components/fMessage';

export interface ResourceVersionEditorPageModelState {
  resourceID: string;
  version: string;
  signingDate: string;

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

  // basePEditorVisible: boolean;
  // basePKeyInput: string;
  // basePValueInput: string;
  // basePValueInputError: string;
  // basePDescriptionInput: string;
  // basePDescriptionInputError: string;

  customConfigurations: {
    key: string;
    name: string;
    description: string;
    type: 'input' | 'select';
    input: string;
    select: string[];
  }[];
  // customOptionEditorVisible: boolean;
  // customOptionKey: string;
  // customOptionDescription: string;
  // customOptionDescriptionError: string;
  // customOptionCustom: 'select' | 'input';
  // customOptionDefaultValue: string;
  // customOptionDefaultValueError: string;
  // customOptionCustomOption: string;
  // customOptionCustomOptionError: string;

}

export interface ChangeAction extends AnyAction {
  type: 'change' | 'resourceVersionEditorPage/change';
  payload: Partial<ResourceVersionEditorPageModelState>;
}

export interface FetchDataSourceAction extends AnyAction {
  type: 'resourceVersionEditorPage/fetchDataSource' | 'fetchDataSource';
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
    fetchDataSource: (action: FetchDataSourceAction, effects: EffectsCommandMap) => void;
    updateDataSource: (action: UpdateDataSourceAction, effects: EffectsCommandMap) => void;
    syncAllProperties: (action: SyncAllPropertiesAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    // changeDataSource: DvaReducer<ResourceVersionEditorPageModelState, ChangeDataSourceAction>;
    change: DvaReducer<ResourceVersionEditorPageModelState, ChangeAction>;
  };
  subscriptions: { setup: Subscription };
}

const Model: ResourceVersionEditorModelType = {

  namespace: 'resourceVersionEditorPage',

  state: {
    resourceID: '',
    version: '',
    signingDate: '',

    descriptionFullScreen: false,
    description: '',

    graphShow: true,

    rawProperties: [],
    additionalProperties: [],
    customProperties: [],

    // basePEditorVisible: false,
    // basePKeyInput: '',
    // basePValueInput: '',
    // basePValueInputError: '',
    // basePDescriptionInput: '',
    // basePDescriptionInputError: '',

    customConfigurations: [],
    // customOptionEditorVisible: false,
    // customOptionKey: '',
    // customOptionDescription: '',
    // customOptionDescriptionError: '',
    // customOptionCustom: 'input',
    // customOptionDefaultValue: '',
    // customOptionDefaultValueError: '',
    // customOptionCustomOption: '',
    // customOptionCustomOptionError: '',
  },

  effects: {
    * fetchDataSource(action: FetchDataSourceAction, { call, put, select }: EffectsCommandMap) {
      // const params: ResourceVersionInfoParamsType1 = action.payload;
      const { resourceVersionEditorPage }: ConnectState = yield select(({ resourceVersionEditorPage }: ConnectState) => ({
        resourceVersionEditorPage,
      }));
      const params: Parameters<typeof FServiceAPI.Resource.resourceVersionInfo1>[0] = {
        resourceId: resourceVersionEditorPage.resourceID,
        version: resourceVersionEditorPage.version,
      };
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
          createDate: string;
          description: string;
          // systemProperty: {
          //   [k: string]: string;
          // }
          systemPropertyDescriptors: {
            defaultValue: number | string;
            key: string;
            name: string;
            remark: string;
            valueDisplay: string;
            valueUnit: string;
            insertMode: 1 | 2;
          }[];
        }
      } = yield call(FServiceAPI.Resource.resourceVersionInfo1, params);
      // console.log(data_versionInfo, 'data902q3jrlkasdfasdf');
      if (!data_versionInfo) {
        history.replace(FUtil.LinkTo.exception403({}));
        return;
      }

      const base = data_versionInfo.customPropertyDescriptors.filter((i) => i.type === 'readonlyText');
      const opt = data_versionInfo.customPropertyDescriptors.filter((i) => i.type === 'editableText' || i.type === 'select');
      // console.log('@#$@#$@#$@#$$#@$@#$1111111111');
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          signingDate: moment(data_versionInfo.createDate).format('YYYY-MM-DD'),
          description: data_versionInfo.description,
          // rawProperties: Object.entries(data_versionInfo.systemProperty).map((sp) => {
          //   // console.log(sp, 'SSSSSSppppPPPPP90j');
          //   return {
          //     key: sp[0],
          //     value: fileAttrUnits[sp[0]] ? fileAttrUnits[sp[0]](sp[1]) : sp[1] as string,
          //   };
          // }),
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
        },
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
