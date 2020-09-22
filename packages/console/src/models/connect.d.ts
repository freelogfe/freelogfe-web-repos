import {GlobalSearchingModelState} from './globalSearching';
import {MarketPageModelState} from './marketPage';
import {ResourceListPageModelState} from './resourceListPage';
import {ResourceCollectPageModelState} from './resourceCollectPage';
import {ResourceCreatorPageModelState} from './resourceCreatorPage';
import {ResourceInfoPageModelState} from './resourceInfoPage';
import {ResourceVersionCreatorPageModelState} from './resourceVersionCreatorPage';
import {ResourceVersionEditorPageModelState} from './ResourceVersionEditorPage';
import {ResourceAuthPageModelState} from './resourceAuthPage';
import {ResourceInfoModelState} from './resourceInfo';
import {UserModelState} from './user';
import {GlobalModelState} from './global';
import {StorageHomePageModelState} from './storageHomePage';
import {StorageObjectEditorModelState} from './storageObjectEditor';
import {StorageObjectDepSelectorModelState} from './storageObjectDepSelector';

export {
  // RouterHistoriesModelState,
  GlobalSearchingModelState,
  MarketPageModelState,
  ResourceListPageModelState,
  ResourceCollectPageModelState,
  ResourceCreatorPageModelState,
  ResourceInfoPageModelState,
  ResourceVersionCreatorPageModelState,
  ResourceVersionEditorPageModelState,
  ResourceAuthPageModelState,
  ResourceInfoModelState,
  UserModelState,
  GlobalModelState,
  StorageHomePageModelState,
  StorageObjectEditorModelState,
  StorageObjectDepSelectorModelState,
};

export interface ConnectState {
  // routerHistories: RouterHistoriesModelState,
  globalSearching: GlobalSearchingModelState,
  marketPage: MarketPageModelState;
  resourceListPage: ResourceListPageModelState;
  resourceCollectPage: ResourceCollectPageModelState;
  resourceCreatorPage: ResourceCreatorPageModelState;
  resourceInfoPage: ResourceInfoPageModelState;
  resourceVersionCreatorPage: ResourceVersionCreatorPageModelState;
  resourceVersionEditorPage: ResourceVersionEditorPageModelState;
  resourceAuthPage: ResourceAuthPageModelState;
  resourceInfo: ResourceInfoModelState;
  user: UserModelState;
  global: GlobalModelState;
  storageHomePage: StorageHomePageModelState;
  storageObjectEditor: StorageObjectEditorModelState;
  storageObjectDepSelector: StorageObjectDepSelectorModelState;
}
