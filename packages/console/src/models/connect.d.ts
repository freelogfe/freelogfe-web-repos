import {GlobalSearchingModelState} from './globalSearching';
import {MarketPageModelState} from './marketPage';
import {ResourcePageModelState} from './resourcePage';
import {ResourceCollectPageModelState} from './resourceCollectPage';
import {ResourceCreatorPageModelState} from './resourceCreatorPage';
import {ResourceInfoPageModelState} from './resourceInfoPage';
import {ResourceVersionPageModelState} from './ResourceVersionPage';
import {ResourceVersionEditorPageModelState} from './ResourceVersionEditorPage';
import {ResourceAuthPageModelState} from './resourceAuthPage';

export {
  GlobalSearchingModelState,
  MarketPageModelState,
  ResourcePageModelState,
  ResourceCollectPageModelState,
  ResourceCreatorPageModelState,
  ResourceInfoPageModelState,
  ResourceVersionPageModelState,
  ResourceVersionEditorPageModelState,
  ResourceAuthPageModelState,
};

export interface ConnectState {
  globalSearching: GlobalSearchingModelState,
  marketPage: MarketPageModelState;
  resourcePage: ResourcePageModelState;
  resourceCollectPage: ResourceCollectPageModelState;
  resourceCreatorPage: ResourceCreatorPageModelState;
  resourceInfoPage: ResourceInfoPageModelState;
  resourceVersionPage: ResourceVersionPageModelState;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
  resourceAuthPage: ResourceAuthPageModelState;
}
