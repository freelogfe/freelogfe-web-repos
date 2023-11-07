import { GlobalSearchingModelState } from './globalSearching';
import { DiscoverPageModelState } from './discoverPage';
import { ResourceListPageModelState } from './resourceListPage';
import { ResourceCollectPageModelState } from './resourceCollectPage';
import { ResourceCreatorPageModelState } from './resourceCreatorPage';
import { ResourceInfoPageModelState } from './resourceInfoPage';
import { ResourceVersionCreatorPageModelState } from './resourceVersionCreatorPage';
import { ResourceVersionEditorPageModelState } from './ResourceVersionEditorPage';
import { ResourceAuthPageModelState } from './resourceAuthPage';
import { UserModelState } from './user';
import { GlobalModelState } from './global';
import { StorageHomePageModelState } from './storageHomePage';
import { StorageObjectEditorModelState } from './storageObjectEditor';
import { ResourceDetailPageModelState } from './resourceDetailPage';
import { NodesModelState } from './nodes';
import { NodeManagerModelState } from './nodeManagerPage';
import { NodeManager_Contract_Page_ModelState } from './nodeManager_Contract_Page';
import { ExhibitInfoPageModelState } from './exhibitInfoPage';
import { InformalNodeManagerPageModelState } from './informalNodeManagerPage';
import { InformExhibitInfoPageModelState } from './informExhibitInfoPage';
import { ResourceEditorPageModelState } from './resourceEditorPage';
import { DashboardPageModelState } from './dashboardPage';
import { NodeCreatorPageModelState } from './nodeCreatorPage';
import { ResourceSiderModelState } from './resourceSider';
import { ResourceCreatorBatchPageState } from './resourceCreatorBatchPage';

export {
  GlobalSearchingModelState,
  DiscoverPageModelState,
  ResourceListPageModelState,
  ResourceCollectPageModelState,
  ResourceCreatorPageModelState,
  ResourceInfoPageModelState,
  ResourceVersionCreatorPageModelState,
  ResourceVersionEditorPageModelState,
  ResourceAuthPageModelState,
  UserModelState,
  GlobalModelState,
  StorageHomePageModelState,
  StorageObjectEditorModelState,
  ResourceDetailPageModelState,
  NodesModelState,
  NodeManagerModelState,
  NodeManager_Contract_Page_ModelState,
  ExhibitInfoPageModelState,
  InformalNodeManagerPageModelState,
  InformExhibitInfoPageModelState,
  ResourceEditorPageModelState,
  DashboardPageModelState,
  NodeCreatorPageModelState,
  ResourceSiderModelState,
  ResourceCreatorBatchPageState
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
  user: UserModelState;
  global: GlobalModelState;
  storageHomePage: StorageHomePageModelState;
  storageObjectEditor: StorageObjectEditorModelState;
  resourceDetailPage: ResourceDetailPageModelState;
  nodes: NodesModelState;
  nodeManagerPage: NodeManagerModelState;
  nodeManager_Contract_Page: NodeManager_Contract_Page_ModelState;
  exhibitInfoPage: ExhibitInfoPageModelState;
  informalNodeManagerPage: InformalNodeManagerPageModelState;
  informExhibitInfoPage: InformExhibitInfoPageModelState;
  dashboardPage: DashboardPageModelState;
  nodeCreatorPage: NodeCreatorPageModelState;
  resourceSider: ResourceSiderModelState;
  resourceCreatorBatchPage: ResourceCreatorBatchPageState;
}
