export default [
  {exact: true, path: '/ui-example', component: '../pages/ui-example'},
  {
    path: '/',
    component: '../layouts/FLayout',
    routes: [
      {exact: true, path: '.', redirect: '/market'},
      {
        path: 'market',
        routes: [
          {exact: true, path: '.', component: '../pages/market/index', title: '市场资源'},
          {exact: true, path: 'example', component: '../pages/market/index', title: '示例节点'},
          {component: '../pages/exception/404'},
        ],
      },
      {exact: true, path: 'storage', component: '../pages/storage', title: '存储空间'},
      {
        path: 'node',
        routes: [
          {exact: true, path: 'creator', component: '../pages/node/creator', title: '节点创建'},
          {
            path: 'formal/:id',
            exact: true,
            component: '../pages/node/formal/$id',
            title: '节点管理',
          },
          {
            path: 'informal/:id',
            exact: true,
            component: '../pages/node/informal/$id',
            title: '测试节点管理',
          },
          {
            path: 'exhibit',
            routes: [
              {path: 'formal/:id', exact: true, component: '../pages/node/exhibit/formal/$id', title: '展品管理'},
              {path: 'informal/:id', exact: true, component: '../pages/node/exhibit/informal/$id', title: '测试展品管理'},
              {component: '../pages/exception/404'},
            ]
          },
          {component: '../pages/exception/404'},
        ]
      },
      {
        path: 'resource',
        routes: [
          {exact: true, path: '.', redirect: '/resource/list'},
          {exact: true, path: 'list', component: '../pages/resource/list', title: '我的资源'},
          {exact: true, path: 'collect', component: '../pages/resource/list', title: '我的收藏'},
          {exact: true, path: 'creator', component: '../pages/resource/creator', title: '创建资源'},
          {exact: true, path: 'details/:id', component: '../pages/resource/details/$id', title: '市场资源'},
          {exact: true, path: 'info/:id', component: '../pages/resource/info/$id', title: '资源信息'},
          {exact: true, path: 'auth/:id', component: '../pages/resource/auth/$id', title: '授权信息'},
          {
            path: 'version',
            routes: [
              {
                exact: true,
                path: 'creator/:id',
                component: '../pages/resource/version/creator/$id',
                title: '版本创建',
              },
              {
                exact: true,
                path: 'info/:id/:version',
                component: '../pages/resource/version/info/$id/$version',
                title: '版本信息',
              },
              {component: '../pages/exception/404'},
            ],
          },
          {component: '../pages/exception/404'},
        ]
      },
      {
        path: 'result',
        routes: [
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
                    title: '资源创建成功'
                  },
                ]
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
                        title: '版本创建成功'
                      },
                    ]
                  },
                ]
              },
            ],
          }
        ]
      },
      {
        path: 'exception',
        routes: [
          {exact: true, path: '403', component: '../pages/exception/403', title: '暂无权限'},
          {exact: true, path: '404', component: '../pages/exception/404', title: '未找到页面'},
        ],
      },
      {component: '../pages/exception/404'},
    ],
  },
  {component: '../pages/exception/404'},

];
