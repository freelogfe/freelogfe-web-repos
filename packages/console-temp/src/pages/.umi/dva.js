import dva from 'dva';
import { Component } from 'react';
import createLoading from 'dva-loading';
import history from '@tmp/history';

let app = null;

export function _onCreate() {
  const plugins = require('umi/_runtimePlugin');
  const runtimeDva = plugins.mergeConfig('dva');
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    ...(window.g_useSSR ? { initialState: window.g_initialData } : {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach(plugin => {
    app.use(plugin);
  });
  
  app.model({ namespace: '__template', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/__template.ts').default) });
app.model({ namespace: 'dashboardPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/dashboardPage.ts').default) });
app.model({ namespace: 'discoverPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/discoverPage.ts').default) });
app.model({ namespace: 'exhibitInfoPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/exhibitInfoPage.ts').default) });
app.model({ namespace: 'global', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/global.ts').default) });
app.model({ namespace: 'globalSearching', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/globalSearching.ts').default) });
app.model({ namespace: 'informalNodeManagerPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/informalNodeManagerPage.ts').default) });
app.model({ namespace: 'informExhibitInfoPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/informExhibitInfoPage.ts').default) });
app.model({ namespace: 'nodeCreatorPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/nodeCreatorPage.ts').default) });
app.model({ namespace: 'nodeManager_Contract_Page', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/nodeManager_Contract_Page.ts').default) });
app.model({ namespace: 'nodeManagerPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/nodeManagerPage.ts').default) });
app.model({ namespace: 'nodes', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/nodes.ts').default) });
app.model({ namespace: 'resourceAuthPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceAuthPage.ts').default) });
app.model({ namespace: 'resourceCollectPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceCollectPage.ts').default) });
app.model({ namespace: 'resourceCreatorPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceCreatorPage.ts').default) });
app.model({ namespace: 'resourceDepSelector', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceDepSelector.ts').default) });
app.model({ namespace: 'resourceDetailPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceDetailPage.ts').default) });
app.model({ namespace: 'resourceEditorPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceEditorPage.ts').default) });
app.model({ namespace: 'resourceInfo', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceInfo.ts').default) });
app.model({ namespace: 'resourceInfoPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceInfoPage.ts').default) });
app.model({ namespace: 'resourceListPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceListPage.ts').default) });
app.model({ namespace: 'resourceVersionCreatorPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceVersionCreatorPage.ts').default) });
app.model({ namespace: 'resourceVersionEditorPage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/resourceVersionEditorPage.ts').default) });
app.model({ namespace: 'storageHomePage', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/storageHomePage.ts').default) });
app.model({ namespace: 'storageObjectDepSelector', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/storageObjectDepSelector.ts').default) });
app.model({ namespace: 'storageObjectEditor', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/storageObjectEditor.ts').default) });
app.model({ namespace: 'user', ...(require('C:/code/freelogfe/freelogfe-web-repos/packages/console/src/models/user.ts').default) });
  return app;
}

export function getApp() {
  return app;
}

export class _DvaContainer extends Component {
  render() {
    const app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
