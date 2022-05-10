import {GlobalModelState} from './global';
import { ActivitiesPageModelState } from './activitiesPage';
import { ActivityDetailsPageModelState } from './activityDetailsPage';

export {
  GlobalModelState,
  ActivitiesPageModelState,
  ActivityDetailsPageModelState,
};

export interface ConnectState {
  global: GlobalModelState;
  activitiesPage: ActivitiesPageModelState;
  activityDetailsPage: ActivityDetailsPageModelState;
}
