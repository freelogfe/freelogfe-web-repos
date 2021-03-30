import {AnyAction} from 'redux';
import {EffectsCommandMap, Subscription, SubscriptionAPI} from 'dva';
import {DvaReducer} from './shared';
import {
  resourceVersionInfo,
  ResourceVersionInfoParamsType1,
  updateResourceVersionInfo,
  UpdateResourceVersionInfoParamsType
} from "@/services/resources";
import moment from 'moment';
import {ConnectState} from "@/models/connect";
import {FApiServer} from "@/services";
import {handleDependencyGraphData} from "@/components/FAntvG6/FAntvG6DependencyGraph";
import {handleAuthorizationGraphData} from "@/components/FAntvG6/FAntvG6AuthorizationGraph";
import {handleRelationGraphData} from "@/components/FAntvG6/FAntvG6RelationshipGraph";

export interface ResourceVersionEditorPageModelState {
  resourceID: string;
  version: string;
  signingDate: string;
  description: string;

  viewportGraphShow: 'relationship' | 'authorization' | 'dependency';
  dependencyGraphNodes: {
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  }[];
  dependencyGraphEdges: {
    source: string;
    target: string;
  }[];
  authorizationGraphNodes: Array<{
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  } | {
    id: string;
    contracts: {
      contractId: string;
      contractName: string;
      isAuth: boolean;
      updateDate: string;
    }[];
  }>;
  authorizationGraphEdges: {
    source: string;
    target: string;
  }[];
  relationGraphNodes: {
    id: string;
    resourceId: string;
    resourceName: string;
    resourceType: string;
    version: string;
  }[];
  relationGraphEdges: {
    source: string;
    target: string;
  }[];

  rawProperties: {
    key: string;
    value: string;
  }[];

  baseProperties: {
    key: string;
    value: string;
    description: string;
  }[];

  basePEditorVisible: boolean;
  basePKeyInput: string;
  basePValueInput: string;
  basePValueInputError: string;
  basePDescriptionInput: string;
  basePDescriptionInputError: string;

  customOptions: {
    key: string;
    description: string;
    custom: 'input' | 'select';
    defaultValue: string;
    customOption: string;
  }[];
  customOptionEditorVisible: boolean;
  customOptionKey: string;
  customOptionDescription: string;
  customOptionDescriptionError: string;
  customOptionCustom: 'select' | 'input';
  customOptionDefaultValue: string;
  customOptionDefaultValueError: string;
  customOptionCustomOption: string;
  customOptionCustomOptionError: string;

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
  payload: Partial<UpdateResourceVersionInfoParamsType>;
}

// export interface ChangeDataSourceAction extends AnyAction {
//   type: 'resourceVersionEditorPage/changeDataSource' | 'changeDataSource';
//   payload: Partial<ResourceVersionEditorPageModelState>;
// }

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
    description: '',

    viewportGraphShow: 'relationship',
    dependencyGraphNodes: [],
    dependencyGraphEdges: [],
    authorizationGraphNodes: [],
    authorizationGraphEdges: [],
    relationGraphNodes: [],
    relationGraphEdges: [],

    rawProperties: [],
    baseProperties: [],

    basePEditorVisible: false,
    basePKeyInput: '',
    basePValueInput: '',
    basePValueInputError: '',
    basePDescriptionInput: '',
    basePDescriptionInputError: '',

    customOptions: [],
    customOptionEditorVisible: false,
    customOptionKey: '',
    customOptionDescription: '',
    customOptionDescriptionError: '',
    customOptionCustom: 'input',
    customOptionDefaultValue: '',
    customOptionDefaultValueError: '',
    customOptionCustomOption: '',
    customOptionCustomOptionError: '',
  },

  effects: {
    * fetchDataSource(action: FetchDataSourceAction, {call, put, select}: EffectsCommandMap) {
      // const params: ResourceVersionInfoParamsType1 = action.payload;
      const {resourceVersionEditorPage}: ConnectState = yield select(({resourceVersionEditorPage}: ConnectState) => ({
        resourceVersionEditorPage,
      }));
      const params: ResourceVersionInfoParamsType1 = {
        resourceId: resourceVersionEditorPage.resourceID,
        version: resourceVersionEditorPage.version,
      };
      const {data} = yield call(resourceVersionInfo, params);

      // 依赖树
      const params2: Parameters<typeof FApiServer.Resource.dependencyTree>[0] = {
        resourceId: resourceVersionEditorPage.resourceID,
        version: resourceVersionEditorPage.version,
        // version: '0.0.1',
        isContainRootNode: true,
      };

      const {data: data2} = yield call(FApiServer.Resource.dependencyTree, params2);
      const {nodes: dependencyGraphNodes, edges: dependencyGraphEdges} = handleDependencyGraphData(data2[0]);

      // 授权树
      const params3: Parameters<typeof FApiServer.Resource.authTree>[0] = {
        resourceId: resourceVersionEditorPage.resourceID,
        version: resourceVersionEditorPage.version,
      };

      const {data: data3} = yield call(FApiServer.Resource.authTree, params3);

      const {nodes: authorizationGraphNodes, edges: authorizationGraphEdges} = yield call(handleAuthorizationGraphData, data3, data);

      // 关系树
      const params4: Parameters<typeof FApiServer.Resource.relationTreeAuth>[0] = {
        resourceId: resourceVersionEditorPage.resourceID,
        version: resourceVersionEditorPage.version,
      };

      const {data: data4} = yield call(FApiServer.Resource.relationTreeAuth, params3);
      // console.log(data4, 'data4@!#awef98adjs;klfjalskdfjlkjalsdkfja');
      const {nodes: relationGraphNodes, edges: relationGraphEdges} = handleRelationGraphData(data4[0]);
      // console.log(relationGraphNodes, relationGraphEdges, 'relationGraphEdges@Q@#$!@#$!@$@#$@!#$');

      const base = data.customPropertyDescriptors.filter((i: any) => i.type === 'readonlyText');
      const opt = data.customPropertyDescriptors.filter((i: any) => i.type === 'editableText' || i.type === 'select');

      yield put<ChangeAction>({
        type: 'change',
        payload: {
          signingDate: moment(data.createDate).format('YYYY-MM-DD'),
          description: data.description,
          rawProperties: Object.entries(data.systemProperty).map((sp) => {
            return {
              key: sp[0],
              value: sp[1] as string,
            };
          }),
          baseProperties: base.map((b: any) => {
            return {
              key: b.key,
              value: b.defaultValue,
              description: b.remark
            };
          }),
          customOptions: opt.map((i: any) => ({
            key: i.key,
            value: i.defaultValue,

            description: i.remark,
            descriptionInput: i.remark,
            descriptionIsEditing: false,
            descriptionError: '',

            custom: i.type === 'select' ? 'select' : 'input',
            defaultValue: i.defaultValue,
            customOption: i.candidateItems.join(','),
          })),
          dependencyGraphNodes: dependencyGraphNodes,
          dependencyGraphEdges: dependencyGraphEdges,
          authorizationGraphNodes: authorizationGraphNodes,
          authorizationGraphEdges: authorizationGraphEdges,
          relationGraphNodes: relationGraphNodes,
          relationGraphEdges: relationGraphEdges,
        },
      });
    },
    * updateDataSource(action: UpdateDataSourceAction, {call, put, select}: EffectsCommandMap) {
      const baseInfo = yield select(({resourceVersionEditorPage}: ConnectState) => ({
        version: resourceVersionEditorPage.version,
        resourceId: resourceVersionEditorPage.resourceID,
      }));
      const params: UpdateResourceVersionInfoParamsType = {
        ...baseInfo,
        ...action.payload,
      };
      yield call(updateResourceVersionInfo, params);
      yield put<FetchDataSourceAction>({
        type: 'fetchDataSource',
        payload: baseInfo,
      });
    },
    * syncAllProperties({}: SyncAllPropertiesAction, {select, call}: EffectsCommandMap) {
      const {resourceVersionEditorPage}: ConnectState = yield select(({resourceVersionEditorPage}: ConnectState) => ({
        resourceVersionEditorPage,
      }));

      const customPropertyDescriptors: UpdateResourceVersionInfoParamsType['customPropertyDescriptors'] = [
        ...resourceVersionEditorPage.baseProperties.map((bp) => {
          return {
            key: bp.key,
            defaultValue: bp.value,
            type: 'readonlyText' as 'readonlyText',
            remark: bp.description,
          };
        }),
        ...resourceVersionEditorPage.customOptions.map((pp) => {
          const isInput: boolean = pp.custom === 'input';
          const options: string[] = pp.customOption.split(',');
          return {
            type: isInput ? 'editableText' : 'select' as 'editableText' | 'select',
            key: pp.key,
            remark: pp.description,
            defaultValue: isInput ? pp.defaultValue : options[0],
            candidateItems: isInput ? undefined : options,
          };
        }),
      ];
      const params: UpdateResourceVersionInfoParamsType = {
        version: resourceVersionEditorPage.version,
        resourceId: resourceVersionEditorPage.resourceID,
        customPropertyDescriptors: customPropertyDescriptors,
      };
      yield call(updateResourceVersionInfo, params);
    },
  },

  reducers: {
    // changeDataSource(state: ResourceVersionEditorPageModelState, action: ChangeDataSourceAction): ResourceVersionEditorPageModelState {
    //   return {...state, ...action.payload};
    // },
    change(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  },

  subscriptions: {
    setup({dispatch, history}: SubscriptionAPI) {

      // history.listen((listener) => {
      //   const regexp = pathToRegexp('/resource/:id/version/:version');
      //   const result = regexp.exec(listener.pathname);
      //   if (result) {
      //     if (result[2] === 'creator') {
      //       return;
      //     }
      //     dispatch<FetchDataSourceAction>({
      //       type: 'fetchDataSource',
      //       payload: {
      //         resourceId: result[1],
      //         version: result[2],
      //       }
      //     });
      //   }
      // });

    },
  },

};

export default Model;
