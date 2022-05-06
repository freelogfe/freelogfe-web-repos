import { ActivityPageModelState } from './activityPage';
import {GlobalModelState} from './global';

export {
  ActivityPageModelState,
  GlobalModelState,
};

export interface ConnectState {
  activityPage: ActivityPageModelState;
  global: GlobalModelState;
}
