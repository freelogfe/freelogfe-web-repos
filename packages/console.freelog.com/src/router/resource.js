/**
 * 资源管理系统
 */
import Views from '@/views'
import i18n from '../lib/i18n'


export default {
    name: 'resource',
    path: 'resource',
    meta: {
        requiresAuth: true,
        title: i18n.t('routes.resourceSystem')
    },
    component: Views.container,
    redirect: '/resource/list',
    children: [
        {
            path: 'editor',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.createResource'),
                type: 'resource',
                theme: 'gray',
                hideFooter: true,
            },
            component: Views.resourceNew,
        },
        {
            path: 'editor/:resourceId',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: '资源管理',
                type: 'resource',
                theme: 'gray',
                hideFooter: true,
            },
            component: Views.resourceNew,
        },
        {
            path: 'policy_tpl/list',
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.resourcePolicyTplList'),
                type: 'resource'
            },
            component: Views.policyTplList
        },
        {
            path: 'create',
            redirect: 'editor',
            // hidden: true,
            // meta: {
            //     requiresAuth: true,
            //     title: i18n.t('routes.createResource'),
            //     type: 'resource',
            //     theme: 'gray',
            //     hideFooter: true,
            // },
            // component: Views.resourceCreator,
        },
        {
            path: 're-edit',
            meta: {
                requiresAuth: true,
                // title: i18n.t('routes.resourcePolicyTplList'),
                title: i18n.t('routes.resourcePolicyTplList'),
                type: 'resource',
                hideFooter: true,
                theme: 'gray'
            },
            component: Views.resourceReEditor,
        },
        {
            path: 'edit/:resourceId',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.updateResource'),
                type: 'resource',
                theme: 'gray',
                hideSidebar: true
            },
            component: Views.resourceEditor,
        },
        {
            path: 'list',
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.myResources'),
                type: 'resource'
            },
            component: Views.resourceList
        },
        {
            path: 'detail',
            hidden: true,
            redirect: '/resource/list',
        },
        {
            path: 'detail/:resourceId',
            redirect: 'editor/:resourceId',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.resourceDetail'),
                type: 'resource',
                theme: 'gray',
                hideFooter: true
            },
            component: Views.resourceDetail
        },
        {
            path: 'policy_tpl',
            hidden: true,
            meta: {
                requiresAuth: true,
                type: 'resource'
            },
            component: Views.container,
            redirect: '/resource/policy_tpl/list',
            children: [
                {
                    path: 'create',
                    hidden: true,
                    meta: {
                        requiresAuth: true,
                        title: i18n.t('routes.createResourcePolicyTpl'),
                        type: 'resource'
                    },
                    component: Views.policyTplCreator
                },
                {
                    path: 'detail',
                    hidden: true,
                    meta: {
                        requiresAuth: true,
                        title: i18n.t('routes.resourcePolicyTplDetail'),
                        type: 'resource'
                    },
                    component: Views.policyTplDetail
                }
            ]
        }
    ]
}
