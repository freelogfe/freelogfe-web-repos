/**
 * 资源管理系统
 */
import Views from '@/views';
import i18nHomePage from '@/views/i18n-management/index.vue'
import i18n from '../lib/i18n'

export default {
    name: 'i18n-management',
    path: 'i18n-management',
    meta: {
        requiresAuth: true,
        title: ""
    },
    component: Views.container,
    children: [
        {
            path: '/',
            hidden: true,
            meta: {
                requiresAuth: true,
                title: "",
                theme: 'gray',
                hideFooter: true,
            },
            component: i18nHomePage,
            children: [
                
            ]
        },
    ]
}
