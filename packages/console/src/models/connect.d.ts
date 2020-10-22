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
import {MarketResourcePageState} from './marketResourcePage';
import {NodesModelState} from './nodes';
import {NodeManagerModelState} from './nodeManagerPage';

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
  MarketResourcePageState,
  NodesModelState,
  NodeManagerModelState,
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
  marketResourcePage: MarketResourcePageState;
  nodes: NodesModelState;
  nodeManagerPage: NodeManagerModelState;
}
