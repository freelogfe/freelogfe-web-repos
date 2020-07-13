import {MarketPageModelState} from './marketPage';
import {ResourcePageModelState} from './resourcePage';

export {
  MarketPageModelState,
  ResourcePageModelState,
};

export interface ConnectState {
  marketPage: MarketPageModelState;
  resourcePage: ResourcePageModelState;
}
