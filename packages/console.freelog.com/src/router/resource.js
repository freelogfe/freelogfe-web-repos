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
                breadCrumb: [
                    {
                        to: '/release-management/resource/list',
                        text: i18n.t('routes.myResources'),
                    },
                    {
                        text: i18n.t('routes.createResource'),
                    },
                ]
            },
            component: Views.resourceNew,
        },
        {
            path: 'editor/:resourceId',
            hidden: true,

            meta: {
                requiresAuth: true,
                title: i18n.t('routes.resourceInfo'),
                // title: '资源信息',
                type: 'resource',
                theme: 'gray',
                hideFooter: true,
                breadCrumb: [
                    {
                        to: '/release-management/resource/list',
                        text: i18n.t('routes.myResources'),
                    },
                    {
                        text: i18n.t('routes.resourceInfo'),
                    },
                ]
            },
            component: Views.resourceNew,
        },
        {
            path: 'list',
            meta: {
                requiresAuth: true,
                title: i18n.t('routes.myResources'),
                type: 'resource',
                theme: 'white'
            },
            component: Views.resourceList
        },
    ]
}
