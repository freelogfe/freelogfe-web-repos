export default [
  {exact: true, path: '/ui-example', component: '../pages/ui-example'},
  {
    path: '/',
    component: '../layouts/FLayout',
    // meta: {structure: 'left-right'},
    routes: [
      {exact: true, path: '.', redirect: '/market'},
      {
        // exact: false,
        path: 'market',
        routes: [
          {exact: true, path: '.', component: '../pages/market/index', title: '市场资源'},
          // {exact: true, path: 'example', component: '../pages/market/examples', title: '示例节点'},
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
            path: 'exhibit',
            routes: [
              {path: 'formal/:id', exact: true, component: '../pages/node/exhibit/formal/$id', title: '展品管理'},
              {path: 'informal/:id', exact: true, component: '../pages/node/exhibit/informal/$id', title: '测试展品管理'},
              {component: '../pages/exception/404'},
            ]
          },
          {
            path: ':id',
            routes: [
              {path: 'formal', exact: true, component: '../pages/node/formal/$id', title: '节点管理'},
              {path: 'informal', exact: true, component: '../pages/node/informal/$id', title: '测试节点管理'},
              {component: '../pages/exception/404'},
            ],
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
          {
            path: ':id',
            routes: [
              {exact: true, path: '.', component: '../pages/resource/$id/index', title: '市场资源'},
              // {exact: true, path: 'sign', component: '../pages/resource/$id/sign', title: '市场资源'},
              {exact: true, path: 'success', component: '../pages/resource/$id/success', title: '资源创建成功',},
              {exact: true, path: 'info', component: '../pages/resource/$id/info', title: '资源信息'},
              {exact: true, path: 'auth', component: '../pages/resource/$id/auth', title: '授权信息'},
              {
                path: 'version',
                routes: [
                  {exact: true, path: 'creator', component: '../pages/resource/$id/version/creator', title: '版本创建'},
                  {
                    path: ':version',
                    routes: [
                      {exact: true, path: '.', component: '../pages/resource/$id/version/$version', title: '版本信息'},
                      {
                        exact: true,
                        path: 'success',
                        component: '../pages/resource/$id/version/$version/success',
                        title: '版本创建成功',
                      },
                      {component: '../pages/exception/404'},
                    ],
                  },
                  {component: '../pages/exception/404'},
                ],
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
                  {exact: true, path: 'success', component: '../pages/result/resource/create/success', title: '资源创建成功'},
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
                        path: 'success',
                        component: '../pages/result/resource/version/create/success',
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
          {exact: true, path: '404', component: '../pages/exception/404', title: '暂无权限'},
        ]
      },
      {component: '../pages/exception/404'},
    ],
  },
  {component: '../pages/exception/404'},

];
