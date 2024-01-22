import { DvaReducer, WholeReadonly } from '@/models/shared';
import { AnyAction } from 'redux';
import { EffectsCommandMap, Subscription } from 'dva';
import { FServiceAPI } from '@freelog/tools-lib';
import moment, { Moment } from 'moment';


export interface ActivityDetailsPageModelState {
  pageState: 'loading' | 'loaded' | 'noDate';
  activityID: string;
  pageTitle: string;
  showActivity: '' | 'play-newer' | 'ResourceCompetition' | 'invite-friend' | 'Questionnaire' | 'ExperienceOfficer' | 'SpringFestival';

  startTime: Moment | null;
  endTime: Moment | null;
  announceTime: Moment | null;
  timeValidity: 'NotStart' | 'Validity' | 'Finished';
}

export interface ChangeAction extends AnyAction {
  type: 'change';
  payload: Partial<ActivityDetailsPageModelState>;
}

export interface OnMountPageAction extends AnyAction {
  type: 'activityDetailsPage/onMountPage';
  payload: {
    activityID: string;
  };
}

export interface OnUnmountPageAction extends AnyAction {
  type: 'activityDetailsPage/onUnmountPage';
}

interface ActivityDetailsPageModelType {
  namespace: 'activityDetailsPage';
  state: ActivityDetailsPageModelState;
  effects: {
    onMountPage: (action: OnMountPageAction, effects: EffectsCommandMap) => void;
    onUnmountPage: (action: OnUnmountPageAction, effects: EffectsCommandMap) => void;
  };
  reducers: {
    change: DvaReducer<ActivityDetailsPageModelState, ChangeAction>;
  };
  subscriptions: {
    setup: Subscription;
  };
}

const initStates: ActivityDetailsPageModelState = {
  pageState: 'loading',
  activityID: '',
  pageTitle: '',
  showActivity: '',

  startTime: null,
  endTime: null,
  announceTime: null,
  timeValidity: 'Validity',
};

const Model: ActivityDetailsPageModelType = {
  namespace: 'activityDetailsPage',
  state: initStates,
  effects: {
    * onMountPage({ payload }: OnMountPageAction, { call, put }: EffectsCommandMap) {
      if (!payload.activityID) {
        return;
      }
      const params: Parameters<typeof FServiceAPI.Activity.find4Client>[0] = {
        _id: payload.activityID,
      };
      const { ret, errCode, data }: {
        ret: number;
        errCode: number;
        data: {
          _id: string;
          title: string;
          cover: string;
          status: 1 | 2 | 3 | 4 | 5;
          persist: boolean;
          link: string;
          startTime: string;
          limitTime: string;
        };
      } = yield call(FServiceAPI.Activity.find4Client, params);
      // console.log(data, 'data sdio9fjasdlkfjl;sdjflkjl');
      if (ret !== 0 || errCode !== 0 || !data) {
        yield put<ChangeAction>({
          type: 'change',
          payload: {
            pageState: 'noDate',
          },
        });
        return;
      }

      // 'play-newer' | 'ResourceCompetition' | 'invite-friend' | 'Questionnaire' | 'experiencer'
      if (data.link !== 'play-newer'
        && data.link !== 'ResourceCompetition'
        && data.link !== 'invite-friend'
        && data.link !== 'Questionnaire'
        && data.link !== 'ExperienceOfficer'
        && data.link !== 'SpringFestival') {
        self.location.replace(data.link);
        return;
      }

      const nowTimestamp: number = Date.now();
      yield put<ChangeAction>({
        type: 'change',
        payload: {
          pageState: 'loaded',
          activityID: payload.activityID,
          showActivity: data.link || '',
          pageTitle: data.title || '活动不存在或者已暂停',

          startTime: data.persist ? null : moment(data.startTime),
          endTime: data.persist ? null : moment(data.limitTime),
          announceTime: data.persist ? null : moment(data.limitTime).add(7, 'days'),
          timeValidity: data.persist ?
            'Validity'
            : nowTimestamp < new Date(data.startTime).getTime()
              ? 'NotStart'
              : nowTimestamp > new Date(data.limitTime).getTime()
                ? 'Finished'
                : 'Validity',
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
