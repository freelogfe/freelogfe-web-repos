import Views from '@/views'
import i18n from '../lib/i18n'

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
            path: 'test-manager-resource/:testResourceID',
            hidden: true,
            meta: {
                hideSidebar: true,
                requiresAuth: true,
                // title: i18n.t('routes.nodeManager'),
                title: i18n.t('routes.testPresentableInfo'),
                hideFooter: true,
            },
            component: Views.testManagerResource
        },
        {
            path: 'test-manager/:nodeId',
            hidden: true,
            meta: {
                hideSidebar: true,
                requiresAuth: true,
                title: i18n.t('routes.testNodeManager'),
                // title:  '测试节点管理',
                hideFooter: true,
            },
            component: Views.testNodeManager
        },
        {
            path: 'manager/:nodeId',
            hidden: true,
            meta: {
                hideSidebar: true,
                requiresAuth: true,
                title: i18n.t('routes.nodeManager'),
                hideFooter: true,
            },
            component: Views.nodeManager
        },
        {
            path: 'manager-release/:presentableId',
            hidden: true,
            meta: {
                hideSidebar: true,
                requiresAuth: true,
                title: i18n.t('routes.presentableInfo'),
                // title: '展品信息',
                hideFooter: true,
            },
            component: Views.nodeManagerRelease
        },
        {
            path: 'create',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.createNode'),
                hideFooter: true,
            },
            component: Views.nodeCreator
        },
    ]
}
