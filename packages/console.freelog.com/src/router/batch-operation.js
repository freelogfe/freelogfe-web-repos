/**
 * 资源管理系统
 */
import Views from '@/views'
import i18n from '../lib/i18n'

export default {
    name: 'tools',
    path: 'tools',
    meta: {
        requiresAuth: true,
        title: ""
    },
    component: Views.container,
    redirect: '/tools/batch-operation/create-resource',
    children: [
        {
            path: 'batch-operation',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: "",
                theme: 'gray',
                hideFooter: true,
            },
            component: Views.batchOperation,
            children: [
                {
                    path: 'create-resource',
                    hidden: true,
                    meta: {
                        requiresAuth: true,
                        title: "",
                        theme: 'gray',
                        hideFooter: true,
                    },
                    component: Views.toolsCreateResource,
                },
                {
                    path: 'resources-list',
                    hidden: true,
                    meta: {
                        requiresAuth: true,
                        title: "",
                        theme: 'gray',
                        hideFooter: true,
                    },
                    component: Views.toolsResourcesList,
                },
                {
                    path: 'releases-list',
                    hidden: true,
                    meta: {
                        requiresAuth: true,
                        title: "",
                        theme: 'gray',
                        hideFooter: true,
                    },
                    component: Views.toolsReleasesList,
                },
                {
                    path: 'presentables-list',
                    hidden: true,
                    meta: {
                        requiresAuth: true,
                        title: "",
                        theme: 'gray',
                        hideFooter: true,
                    },
                    component: Views.toolsPresentablesList,
                }
            ]
        },
    ]
}
