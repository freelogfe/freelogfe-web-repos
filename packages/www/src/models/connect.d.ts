import { ActivitiesPageModelState } from './activitiesPage';
import {GlobalModelState} from './global';

export {
  ActivitiesPageModelState,
  GlobalModelState,
};

export interface ConnectState {
  activitiesPage: ActivitiesPageModelState;
  global: GlobalModelState;
}
