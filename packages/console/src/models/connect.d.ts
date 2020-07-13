import {MarketPageModelState} from './marketPage';
import {ResourcePageModelState} from './resourcePage';
import {ResourceCreatorPageModelState} from './resourceCreatorPage';
import {ResourceInfoPageModelState} from './resourceInfoPage';
import {ResourceVersionPageModelState} from './ResourceVersionPage';
import {ResourceVersionEditorPageModelState} from './ResourceVersionEditorPage';
import {ResourceAuthPageModelState} from './resourceAuthPage';

export {
  MarketPageModelState,
  ResourcePageModelState,
  ResourceCreatorPageModelState,
  ResourceInfoPageModelState,
  ResourceVersionPageModelState,
  ResourceVersionEditorPageModelState,
  ResourceAuthPageModelState,
};

export interface ConnectState {
  marketPage: MarketPageModelState;
  resourcePage: ResourcePageModelState;
  resourceCreatorPage: ResourceCreatorPageModelState;
  resourceInfoPage: ResourceInfoPageModelState;
  resourceVersionPage: ResourceVersionPageModelState;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
  resourceAuthPage: ResourceAuthPageModelState;
}
