import {GlobalSearchingModelState} from './globalSearching';
import {DiscoverPageModelState} from './discoverPage';
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
import {ResourceDetailPageModelState} from './resourceDetailPage';
import {NodesModelState} from './nodes';
import {NodeManagerModelState} from './nodeManagerPage';
import {ExhibitInfoPageModelState} from './exhibitInfoPage';
import {ResourceDepSelectorModelState} from './resourceDepSelector';
import {InformalNodeManagerPageModelState} from './informalNodeManagerPage';
import {InformExhibitInfoPageModelState} from './informExhibitInfoPage';
import {ResourceEditorPageModelState} from './resourceEditorPage';

export {
  // RouterHistoriesModelState,
  GlobalSearchingModelState,
  DiscoverPageModelState,
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
  ResourceDetailPageModelState,
  NodesModelState,
  NodeManagerModelState,
  ExhibitInfoPageModelState,
  ResourceDepSelectorModelState,
  InformalNodeManagerPageModelState,
  InformExhibitInfoPageModelState,
  ResourceEditorPageModelState,
};

export interface ConnectState {
  router: {
    location: Location;
  };
  globalSearching: GlobalSearchingModelState,
  discoverPage: DiscoverPageModelState;
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
  resourceDetailPage: ResourceDetailPageModelState;
  nodes: NodesModelState;
  nodeManagerPage: NodeManagerModelState;
  exhibitInfoPage: ExhibitInfoPageModelState;
  resourceDepSelector: ResourceDepSelectorModelState;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
}
