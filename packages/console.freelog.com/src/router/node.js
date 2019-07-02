import Views from '@/views'
import i18n from '../lib/i18n'

// 节点操作相关的页面
export const nodeItemRoute = {
  path: ':nodeId',
  component: Views.container,
  hidden: true,
  meta: {
    requiresAuth: true,
    title: `:nodeId${i18n.t('routes.nodes')}` // :key 可动态通过route.params上的k-v进行替换
  },
  children: [
    {
      path: 'presentable',
      meta: {
        requiresAuth: true,
        title: 'presentable',
        type: 'node'
      },
      hidden: true,
      component: Views.container,
      redirect: '/node/:nodeId/presentable',
      children: [
        {
          path: ':presentableId',
          meta: {
            requiresAuth: true,
            title: i18n.t('routes.presentableDetail'),
            type: 'node',
            // hideSidebar: true
          },
          component: Views.presentableDetail,
        }
      ]
    }
  ]
}

export default {
  path: 'node',
  meta: {
    requiresAuth: true,
    title: i18n.t('routes.nodesSystem')
  },
  component: Views.container,
  redirect: '/',
  children: [
    {
      path: 'create',
      hidden: true,
      meta: {
        requiresAuth: true,
        title: i18n.t('routes.createNode')
      },
      component: Views.nodeCreator
    },
    {
      path: 'list',
      meta: {
        requiresAuth: true,
        type: 'node',
        title: i18n.t('routes.nodeList')
      },
      component: Views.nodeList
    },
    {
      path: 'policy_tpl/list',
      meta: {
        requiresAuth: true,
        title: i18n.t('routes.policyList'),
        type: 'node'
      },
      component: Views.policyTplList
    },
    {
      path: 'policy_tpl',
      hidden: true,
      meta: {
        requiresAuth: true,
        type: 'node'
      },
      component: Views.container,
      redirect: '/node/policy_tpl/list',
      children: [
        {
          path: 'create',
          hidden: true,
          meta: {
            requiresAuth: true,
            title: i18n.t('routes.createPolicyTpl'),
            type: 'node'
          },
          component: Views.policyTplCreator
        },
        {
          path: 'detail',
          hidden: true,
          meta: {
            requiresAuth: true,
            title: i18n.t('routes.policyTplDetail'),
            type: 'node'
          },
          component: Views.policyTplDetail
        }
      ]
    },
    {
      path: ':nodeId',
      hidden: true,
      meta: {
        requiresAuth: true,
        title: i18n.t('routes.nodeDetail')
      },
      component: Views.nodeDetail,
      redirect(to) {
        return `${to.path}/presentables`
      },
      children: [{
        path: 'presentables',
        meta: {
          requiresAuth: true,
          title: i18n.t('routes.nodeDetail')
        },
        component: Views.presentableList,
      }, {
        path: 'preview',
        meta: {
          requiresAuth: true,
          title: i18n.t('routes.nodeDetail')
        },
        component: Views.nodePreview,
      }]
    },
    nodeItemRoute,
  ]
}
