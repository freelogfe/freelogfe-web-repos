export default [
  { exact: true, path: '/ui-example', component: '../pages/ui-example' },
  { exact: true, path: '/nodePausePreview', component: '../pages/nodePausePreview' },
  {
    path: '/',
    component: '../layouts/FLayout',
    routes: [
      { exact: true, path: '.', redirect: '/dashboard' },
      { exact: true, path: 'invitation', component: '../pages/invitation/index', title: '内测资格申请 - Freelog' },
      { exact: true, path: 'dashboard', component: '../pages/dashboard/index', title: '概览 - Freelog' },
      { exact: true, path: 'market', component: '../pages/discover/index', title: '市场资源 - Freelog' },
      { exact: true, path: 'examples', component: '../pages/discover/index', title: '示例节点 - Freelog' },
      { exact: true, path: 'search', component: '../pages/search/index', title: '站内搜索 - Freelog' },
      { exact: true, path: 'storage', component: '../pages/storage', title: '存储空间 - Freelog' },
      {
        path: 'node',
        routes: [
          { exact: true, path: 'creator', component: '../pages/node/creator', title: '节点创建 - Freelog' },
          {
            path: 'formal/:id',
            exact: true,
            component: '../pages/node/formal/$id',
            title: '节点管理 - Freelog',
          },
          {
            path: 'informal/:id',
            exact: true,
            component: '../pages/node/informal/$id',
            title: '测试节点管理 - Freelog',
          },
          {
            path: 'exhibit',
            routes: [
              {
                path: 'formal/:id',
                exact: true,
                component: '../pages/node/exhibit/formal/$id',
                title: '展品管理 - Freelog',
              },
              {
                path: 'informal/:id',
                exact: true,
                component: '../pages/node/exhibit/informal/$id',
                title: '测试展品管理 - Freelog',
              },
              { component: '../pages/exception/404' },
            ],
          },
          { component: '../pages/exception/404' },
        ],
      },
      {
        path: 'resource',
        routes: [
          { exact: true, path: '.', redirect: '/resource/list' },
          { exact: true, path: 'list', component: '../pages/resource/list', title: '我的资源 - Freelog' },
          { exact: true, path: 'collect', component: '../pages/resource/list', title: '我的收藏 - Freelog' },
          { exact: true, path: 'creator', component: '../pages/resource/creator', title: '创建资源 - Freelog' },
          { exact: true, path: 'details/:id', component: '../pages/resource/details/$id', title: '市场资源 - Freelog' },
          { exact: true, path: 'info/:id', component: '../pages/resource/info/$id', title: '资源信息 - Freelog' },
          { exact: true, path: 'policy/:id', component: '../pages/resource/auth/$id', title: '授权策略 - Freelog' },
          { exact: true, path: 'contract/:id', component: '../pages/resource/auth/$id', title: '授权策略 - Freelog' },
          { exact: true, path: 'dependency/:id', component: '../pages/resource/auth/$id', title: '授权策略 - Freelog' },
          { exact: true, path: 'version/:id', component: '../pages/resource/auth/$id', title: '授权策略 - Freelog' },
          {
            path: 'version',
            routes: [
              {
                exact: true,
                path: 'creator/:id',
                component: '../pages/resource/version/creator/$id',
                title: '版本创建 - Freelog',
              },
              {
                exact: true,
                path: 'info/:id/:version',
                component: '../pages/resource/version/info/$id/$version',
                title: '版本信息 - Freelog',
              },
              { component: '../pages/exception/404' },
            ],
          },
          { component: '../pages/exception/404' },
        ],
      },
      {
        path: 'result',
        routes: [
          {
            path: 'node',
            routes: [
              {
                path: 'create',
                routes: [
                  {
                    exact: true,
                    path: 'success/:id',
                    component: '../pages/result/node/create/success/$id',
                    title: '节点创建成功 - Freelog',
                  },
                ],
              },
              {
                exact: true,
                path: 'freeze/:id',
                component: '../pages/result/node/freeze/$id',
                title: '节点冻结 - Freelog',
              },
            ],
          },
          {
            path: 'resource',
            routes: [
              {
                path: 'create',
                routes: [
                  {
                    exact: true,
                    path: 'success/:id',
                    component: '../pages/result/resource/create/success/$id',
                    title: '资源创建成功 - Freelog',
                  },
                ],
              },
              {
                path: 'version',
                routes: [
                  {
                    path: 'create',
                    routes: [
                      {
                        exact: true,
                        path: 'success/:id/:version',
                        component: '../pages/result/resource/version/create/success/$id/$version',
                        title: '版本创建成功 - Freelog',
                      },
                      {
                        exact: true,
                        path: 'release/:id/:version',
                        component: '../pages/result/resource/version/create/release/$id/$version',
                        title: '版本正在创建 - Freelog',
                      },
                    ],
                  },
                ],
              },
              {
                exact: true,
                path: 'freeze/:id',
                component: '../pages/result/resource/freeze/$id',
                title: '资源冻结 - Freelog',
              },
            ],
          },
        ],
      },
      {
        path: 'exception',
        routes: [
          { exact: true, path: '403', component: '../pages/exception/403', title: '暂无权限 - Freelog' },
          { exact: true, path: '404', component: '../pages/exception/404', title: '未找到页面 - Freelog' },
        ],
      },
      { component: '../pages/exception/404' },
    ],
  },
  { component: '../pages/exception/404' },
] as const;
