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
    redirect: '/tools/batch-operation',
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
        },
    ]
}
