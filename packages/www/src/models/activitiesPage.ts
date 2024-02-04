import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI, FUtil } from '@freelog/tools-lib';

export interface ActivitiesPageModelState {
  listState: 'loading' | 'noData' | 'noSearchResult' | 'loaded';
  // listMore: 'loading' | 'andMore' | 'noMore';
  list: {
    activityID: string;
    activityTitle: string;
    activityCover: string;
    status: 'starting' | 'ongoing' | 'end';
    persis: boolean;
    link: string;
    startTime: string;
    limitTime: string;
  }[];
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ActivitiesPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'activitiesPage/onMountPage';
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'activitiesPage/onUnmountPage';
}

interface activitiesPageModelType {
  namespace: 'activitiesPage';
  state: ActivitiesPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ActivitiesPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ActivitiesPageModelState = {
  listState: 'loading',
  // listMore: 'loading' | 'andMore' | 'noMore';
  list: [],
};

const Model: activitiesPageModelType = {
  namespace: 'activitiesPage',
  state: initStates,
  effects: {
    * onMountPage({}: OnMountPageAction, { call, put }: EffectsCommandMap) {
      const params: Parameters<typeof FServiceAPI.Activity.list4Client>[0] = {
        limit: 100,
      };
      const { data }: {
        data: {
          dataList: {
            _id: string;
            title: string;
            cover: string;
            status: 1 | 2 | 3 | 4 | 5;
            persist: boolean;
            link: string;
            startTime: string;
            limitTime: string;
          }[];
        }
      } = yield call(FServiceAPI.Activity.list4Client, params);
      // console.log(data, 'data9023ulk');
      const status: any = {
        1: '',
        2: '',
        3: 'starting',
        4: 'ongoing',
        5: 'end',
      };
      const list: ActivitiesPageModelState['list'] = data.dataList
        // .filter((d) => {
        //   return d.link !== 'SpringFestival';
        // })
        .map<ActivitiesPageModelState['list'][0]>((d) => {
          return {
            activityID: d._id,
            activityTitle: d.title,
            activityCover: d.cover,
            status: status[d.status] || 'end',
            persis: d.persist,
            link: d.link,
            startTime: d.startTime ? FUtil.Format.formatDateTime(d.startTime) : '',
            limitTime: d.limitTime ? FUtil.Format.formatDateTime(d.limitTime) : '',
          };
        });
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          list: list,
          listState: list.length === 0 ? 'noData' : 'loaded',
        },
      });
    },
    * onUnmountPage({}: OnUnmountPageAction, { put }: EffectsCommandMap) {
      yield put<ChangeAction>({
        type: 'change',
        payload: initStates,
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
