import React from 'react';
import {
  Router as DefaultRouter,
  Route,
  Switch,
  StaticRouter,
} from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/lib/renderRoutes';
import history from '@@/history';
import RendererWrapper0 from 'C:/code/freelogfe/freelogfe-web-repos/packages/console/src/pages/.umi/LocaleWrapper.jsx';
import { routerRedux, dynamic as _dvaDynamic } from 'dva';

const Router = routerRedux.ConnectedRouter;

const routes = [
  {
    exact: true,
    path: '/resource',
    redirect: '/resource/list',
    _title: 'console',
    _title_default: 'console',
  },
  {
    exact: true,
    path: '/',
    redirect: '/dashboard',
    _title: 'console',
    _title_default: 'console',
  },
  {
    exact: true,
    path: '/ui-example',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__ui-example" */ '../ui-example'),
        })
      : require('../ui-example').default,
    _title: 'console',
    _title_default: 'console',
  },
  {
    path: '/',
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "layouts__FLayout" */ '../../layouts/FLayout'),
        })
      : require('../../layouts/FLayout').default,
    routes: [
      {
        exact: true,
        path: '/invitation',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__invitation__index" */ '../invitation/index'),
            })
          : require('../invitation/index').default,
        title: '内测资格申请 - Freelog',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: '内测资格申请 - Freelog',
        _title_default: 'console',
      },
      {
        exact: true,
        path: '/dashboard',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__dashboard__index" */ '../dashboard/index'),
            })
          : require('../dashboard/index').default,
        title: '概览 - Freelog',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: '概览 - Freelog',
        _title_default: 'console',
      },
      {
        exact: true,
        path: '/market',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__discover__index" */ '../discover/index'),
            })
          : require('../discover/index').default,
        title: '市场资源 - Freelog',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: '市场资源 - Freelog',
        _title_default: 'console',
      },
      {
        exact: true,
        path: '/examples',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__discover__index" */ '../discover/index'),
            })
          : require('../discover/index').default,
        title: '示例节点 - Freelog',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: '示例节点 - Freelog',
        _title_default: 'console',
      },
      {
        exact: true,
        path: '/search',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__search__index" */ '../search/index'),
            })
          : require('../search/index').default,
        title: '站内搜索 - Freelog',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: '站内搜索 - Freelog',
        _title_default: 'console',
      },
      {
        exact: true,
        path: '/storage',
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__storage" */ '../storage'),
            })
          : require('../storage').default,
        title: '存储空间 - Freelog',
        Routes: [require('./TitleWrapper.jsx').default],
        _title: '存储空间 - Freelog',
        _title_default: 'console',
      },
      {
        path: '/node',
        routes: [
          {
            exact: true,
            path: '/node/creator',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../node/creator'),
                })
              : require('../node/creator').default,
            title: '节点创建 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '节点创建 - Freelog',
            _title_default: 'console',
          },
          {
            path: '/node/formal/:id',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../node/formal/$id'),
                })
              : require('../node/formal/$id').default,
            title: '节点管理 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '节点管理 - Freelog',
            _title_default: 'console',
          },
          {
            path: '/node/informal/:id',
            exact: true,
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../node/informal/$id'),
                })
              : require('../node/informal/$id').default,
            title: '测试节点管理 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '测试节点管理 - Freelog',
            _title_default: 'console',
          },
          {
            path: '/node/exhibit',
            routes: [
              {
                path: '/node/exhibit/formal/:id',
                exact: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__FLayout" */ '../node/exhibit/formal/$id'),
                    })
                  : require('../node/exhibit/formal/$id').default,
                title: '展品管理 - Freelog',
                Routes: [require('./TitleWrapper.jsx').default],
                _title: '展品管理 - Freelog',
                _title_default: 'console',
              },
              {
                path: '/node/exhibit/informal/:id',
                exact: true,
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__FLayout" */ '../node/exhibit/informal/$id'),
                    })
                  : require('../node/exhibit/informal/$id').default,
                title: '测试展品管理 - Freelog',
                Routes: [require('./TitleWrapper.jsx').default],
                _title: '测试展品管理 - Freelog',
                _title_default: 'console',
              },
              {
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__FLayout" */ '../exception/404'),
                    })
                  : require('../exception/404').default,
                exact: true,
                _title: 'console',
                _title_default: 'console',
              },
              {
                component: () =>
                  React.createElement(
                    require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
                _title: 'console',
                _title_default: 'console',
              },
            ],
            _title: 'console',
            _title_default: 'console',
          },
          {
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../exception/404'),
                })
              : require('../exception/404').default,
            exact: true,
            _title: 'console',
            _title_default: 'console',
          },
          {
            component: () =>
              React.createElement(
                require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
            _title: 'console',
            _title_default: 'console',
          },
        ],
        _title: 'console',
        _title_default: 'console',
      },
      {
        path: '/resource',
        routes: [
          {
            exact: true,
            path: '/resource/list',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../resource/list'),
                })
              : require('../resource/list').default,
            title: '我的资源 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '我的资源 - Freelog',
            _title_default: 'console',
          },
          {
            exact: true,
            path: '/resource/collect',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../resource/list'),
                })
              : require('../resource/list').default,
            title: '我的收藏 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '我的收藏 - Freelog',
            _title_default: 'console',
          },
          {
            exact: true,
            path: '/resource/creator',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../resource/creator'),
                })
              : require('../resource/creator').default,
            title: '创建资源 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '创建资源 - Freelog',
            _title_default: 'console',
          },
          {
            exact: true,
            path: '/resource/details/:id',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../resource/details/$id'),
                })
              : require('../resource/details/$id').default,
            title: '市场资源 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '市场资源 - Freelog',
            _title_default: 'console',
          },
          {
            exact: true,
            path: '/resource/info/:id',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../resource/info/$id'),
                })
              : require('../resource/info/$id').default,
            title: '资源信息 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '资源信息 - Freelog',
            _title_default: 'console',
          },
          {
            exact: true,
            path: '/resource/auth/:id',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../resource/auth/$id'),
                })
              : require('../resource/auth/$id').default,
            title: '授权信息 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '授权信息 - Freelog',
            _title_default: 'console',
          },
          {
            path: '/resource/version',
            routes: [
              {
                exact: true,
                path: '/resource/version/creator/:id',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__FLayout" */ '../resource/version/creator/$id'),
                    })
                  : require('../resource/version/creator/$id').default,
                title: '版本创建 - Freelog',
                Routes: [require('./TitleWrapper.jsx').default],
                _title: '版本创建 - Freelog',
                _title_default: 'console',
              },
              {
                exact: true,
                path: '/resource/version/info/:id/:version',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__FLayout" */ '../resource/version/info/$id/$version'),
                    })
                  : require('../resource/version/info/$id/$version').default,
                title: '版本信息 - Freelog',
                Routes: [require('./TitleWrapper.jsx').default],
                _title: '版本信息 - Freelog',
                _title_default: 'console',
              },
              {
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__FLayout" */ '../exception/404'),
                    })
                  : require('../exception/404').default,
                exact: true,
                _title: 'console',
                _title_default: 'console',
              },
              {
                component: () =>
                  React.createElement(
                    require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
                _title: 'console',
                _title_default: 'console',
              },
            ],
            _title: 'console',
            _title_default: 'console',
          },
          {
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../exception/404'),
                })
              : require('../exception/404').default,
            exact: true,
            _title: 'console',
            _title_default: 'console',
          },
          {
            component: () =>
              React.createElement(
                require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
            _title: 'console',
            _title_default: 'console',
          },
        ],
        _title: 'console',
        _title_default: 'console',
      },
      {
        path: '/result',
        routes: [
          {
            path: '/result/node',
            routes: [
              {
                path: '/result/node/create',
                routes: [
                  {
                    exact: true,
                    path: '/result/node/create/success/:id',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__FLayout" */ '../result/node/create/success/$id'),
                        })
                      : require('../result/node/create/success/$id').default,
                    title: '节点创建成功 - Freelog',
                    Routes: [require('./TitleWrapper.jsx').default],
                    _title: '节点创建成功 - Freelog',
                    _title_default: 'console',
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                    _title: 'console',
                    _title_default: 'console',
                  },
                ],
                _title: 'console',
                _title_default: 'console',
              },
              {
                exact: true,
                path: '/result/node/freeze/:id',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__FLayout" */ '../result/node/freeze/$id'),
                    })
                  : require('../result/node/freeze/$id').default,
                title: '节点冻结 - Freelog',
                Routes: [require('./TitleWrapper.jsx').default],
                _title: '节点冻结 - Freelog',
                _title_default: 'console',
              },
              {
                component: () =>
                  React.createElement(
                    require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
                _title: 'console',
                _title_default: 'console',
              },
            ],
            _title: 'console',
            _title_default: 'console',
          },
          {
            path: '/result/resource',
            routes: [
              {
                path: '/result/resource/create',
                routes: [
                  {
                    exact: true,
                    path: '/result/resource/create/success/:id',
                    component: __IS_BROWSER
                      ? _dvaDynamic({
                          component: () =>
                            import(/* webpackChunkName: "layouts__FLayout" */ '../result/resource/create/success/$id'),
                        })
                      : require('../result/resource/create/success/$id')
                          .default,
                    title: '资源创建成功 - Freelog',
                    Routes: [require('./TitleWrapper.jsx').default],
                    _title: '资源创建成功 - Freelog',
                    _title_default: 'console',
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                    _title: 'console',
                    _title_default: 'console',
                  },
                ],
                _title: 'console',
                _title_default: 'console',
              },
              {
                path: '/result/resource/version',
                routes: [
                  {
                    path: '/result/resource/version/create',
                    routes: [
                      {
                        exact: true,
                        path:
                          '/result/resource/version/create/success/:id/:version',
                        component: __IS_BROWSER
                          ? _dvaDynamic({
                              component: () =>
                                import(/* webpackChunkName: "layouts__FLayout" */ '../result/resource/version/create/success/$id/$version'),
                            })
                          : require('../result/resource/version/create/success/$id/$version')
                              .default,
                        title: '版本创建成功 - Freelog',
                        Routes: [require('./TitleWrapper.jsx').default],
                        _title: '版本创建成功 - Freelog',
                        _title_default: 'console',
                      },
                      {
                        component: () =>
                          React.createElement(
                            require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                              .default,
                            { pagesPath: 'src/pages', hasRoutesInConfig: true },
                          ),
                        _title: 'console',
                        _title_default: 'console',
                      },
                    ],
                    _title: 'console',
                    _title_default: 'console',
                  },
                  {
                    component: () =>
                      React.createElement(
                        require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                          .default,
                        { pagesPath: 'src/pages', hasRoutesInConfig: true },
                      ),
                    _title: 'console',
                    _title_default: 'console',
                  },
                ],
                _title: 'console',
                _title_default: 'console',
              },
              {
                exact: true,
                path: '/result/resource/freeze/:id',
                component: __IS_BROWSER
                  ? _dvaDynamic({
                      component: () =>
                        import(/* webpackChunkName: "layouts__FLayout" */ '../result/resource/freeze/$id'),
                    })
                  : require('../result/resource/freeze/$id').default,
                title: '资源冻结 - Freelog',
                Routes: [require('./TitleWrapper.jsx').default],
                _title: '资源冻结 - Freelog',
                _title_default: 'console',
              },
              {
                component: () =>
                  React.createElement(
                    require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                      .default,
                    { pagesPath: 'src/pages', hasRoutesInConfig: true },
                  ),
                _title: 'console',
                _title_default: 'console',
              },
            ],
            _title: 'console',
            _title_default: 'console',
          },
          {
            component: () =>
              React.createElement(
                require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
            _title: 'console',
            _title_default: 'console',
          },
        ],
        _title: 'console',
        _title_default: 'console',
      },
      {
        path: '/exception',
        routes: [
          {
            exact: true,
            path: '/exception/403',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../exception/403'),
                })
              : require('../exception/403').default,
            title: '暂无权限 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '暂无权限 - Freelog',
            _title_default: 'console',
          },
          {
            exact: true,
            path: '/exception/404',
            component: __IS_BROWSER
              ? _dvaDynamic({
                  component: () =>
                    import(/* webpackChunkName: "layouts__FLayout" */ '../exception/404'),
                })
              : require('../exception/404').default,
            title: '未找到页面 - Freelog',
            Routes: [require('./TitleWrapper.jsx').default],
            _title: '未找到页面 - Freelog',
            _title_default: 'console',
          },
          {
            component: () =>
              React.createElement(
                require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
                  .default,
                { pagesPath: 'src/pages', hasRoutesInConfig: true },
              ),
            _title: 'console',
            _title_default: 'console',
          },
        ],
        _title: 'console',
        _title_default: 'console',
      },
      {
        component: __IS_BROWSER
          ? _dvaDynamic({
              component: () =>
                import(/* webpackChunkName: "p__exception__404" */ '../exception/404'),
            })
          : require('../exception/404').default,
        exact: true,
        _title: 'console',
        _title_default: 'console',
      },
      {
        component: () =>
          React.createElement(
            require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
              .default,
            { pagesPath: 'src/pages', hasRoutesInConfig: true },
          ),
        _title: 'console',
        _title_default: 'console',
      },
    ],
    _title: 'console',
    _title_default: 'console',
  },
  {
    component: __IS_BROWSER
      ? _dvaDynamic({
          component: () =>
            import(/* webpackChunkName: "p__exception__404" */ '../exception/404'),
        })
      : require('../exception/404').default,
    exact: true,
    _title: 'console',
    _title_default: 'console',
  },
  {
    component: () =>
      React.createElement(
        require('C:/code/freelogfe/freelogfe-web-repos/packages/console/node_modules/umi-build-dev/lib/plugins/404/NotFound.js')
          .default,
        { pagesPath: 'src/pages', hasRoutesInConfig: true },
      ),
    _title: 'console',
    _title_default: 'console',
  },
];
window.g_routes = routes;
const plugins = require('umi/_runtimePlugin');
plugins.applyForEach('patchRoutes', { initialValue: routes });

export { routes };

export default class RouterWrapper extends React.Component {
  unListen() {}

  constructor(props) {
    super(props);

    // route change handler
    function routeChangeHandler(location, action) {
      plugins.applyForEach('onRouteChange', {
        initialValue: {
          routes,
          location,
          action,
        },
      });
    }
    this.unListen = history.listen(routeChangeHandler);
    // dva 中 history.listen 会初始执行一次
    // 这里排除掉 dva 的场景，可以避免 onRouteChange 在启用 dva 后的初始加载时被多执行一次
    const isDva =
      history.listen
        .toString()
        .indexOf('callback(history.location, history.action)') > -1;
    if (!isDva) {
      routeChangeHandler(history.location);
    }
  }

  componentWillUnmount() {
    this.unListen();
  }

  render() {
    const props = this.props || {};
    return (
      <RendererWrapper0>
        <Router history={history}>{renderRoutes(routes, props)}</Router>
      </RendererWrapper0>
    );
  }
}
