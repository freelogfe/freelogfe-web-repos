/**
 * meta 配置
 * hidden=true表示在导航上默认不展示
 * requiresAuth=true 表示需要身份验证即需要登录
 * scrollTop=true 切换路由时，页面滚动到顶部，默认是true
 * type: resource/node 对应的侧边栏
 */
import { Vue } from '@freelog/freelog-common-lib'
import Router from 'vue-router'
import Views from '@/views/index'
import store from '../store'
import nodeRoute from './node'
import resourceRoute from './resource'
import mockRoute from './mock'
import releaseRoute from './release'
import {gotoLogin} from "../lib/utils"
import i18n from '../lib/i18n'

Vue.use(Router)

const scrollBehavior = (to, from, savedPosition) => {
    if (savedPosition) {
        return savedPosition
    }
    const position = {}
    if (to.hash) {
        position.selector = to.hash
    }

    if (to.meta.scrollToTop !== false) {
        position.x = 0
        position.y = 0
    }
    return position
}


const router = new Router({
    mode: 'history',
    scrollBehavior,
    routes: [
        {
            path: '/',
            meta: {title: i18n.t('resource.market')},
            component: Views.layout,
            children: [
                resourceRoute,
                nodeRoute,
                releaseRoute,
                mockRoute,
                {
                    path: 'about',
                    hidden: true,
                    meta: {
                        requiresAuth: false,
                        title: `${i18n.t('aboutView.about')}freelog`
                    },
                    component: Views.aboutView
                },
                {
                    path: 'setting',
                    hidden: true,
                    meta: {
                        requiresAuth: true,
                        title: i18n.t('routes.accountSetting')
                    },
                    component: Views.userView
                },
                {
                    path: 'help',
                    hidden: true,
                    meta: {
                        requiresAuth: false,
                        title: i18n.t('helpView.title')
                    },
                    component: Views.helpView
                },
                {
                    path: '/',
                    hidden: true,
                    meta: {
                        requiresAuth: false,
                        title: i18n.t('resource.market'),
                        theme: 'gray'
                    },
                    component: Views.mainView
                }
            ]
        },
        {
            path: '*',
            meta: {
                requiresAuth: false,
                title: 'not found'
            },
            component: Views.layout,
            children: [{
                name: '404',
                path: '',
                meta: {
                    requiresAuth: false,
                    title: '404'
                },
                component: Views.error
            }]
        }
    ]
})

function listenWindowVisibility() {
    let hidden = 'hidden'
    const doc = document

    if (hidden in doc) {
        doc.addEventListener('visibilitychange', onchange)
    } else if ('mozHidden' in doc) {
        hidden = 'mozHidden'
        doc.addEventListener('mozvisibilitychange', onchange)
    } else if ('webkitHidden' in doc) {
        hidden = 'webkitHidden'
        doc.addEventListener('webkitvisibilitychange', onchange)
    } else if ('msHidden' in doc) {
        hidden = 'msHidden'
        doc.addEventListener('msvisibilitychange', onchange)
    } else {
        const events = ['onpageshow', 'onpagehide', 'onfocus', 'onblur']
        events.forEach((name) => {
            window[name] = onchange()
        })
    }

    function onchange(evt) {
        const v = 'visible'
        const h = 'hidden'
        const evtMap = {
            focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
        }
        let type

        evt = evt || window.event
        if (evt.type in evtMap) {
            type = evtMap[evt.type]
        } else {
            type = this[hidden] ? 'hidden' : 'visible'
        }
        console.log('type --', type)

        if (type === 'visible') {
            isChecked = false
        }
    }
}

//避免每次跳转都判断登录态的判断，只有切换tab后回来再重新判断
var isChecked = false
listenWindowVisibility()

router.beforeEach((to, from, next) => {
    if (isChecked) {
        return next()
    }

    store.dispatch('checkUserSession')
    .then(isSameSession => {
        isChecked = true
        if (isSameSession) {
            next()
        } else {
            store.dispatch('getCurrentUserInfo')
            .then(user => {
                if (user) {
                    window.location = to.fullPath
                } else {
                    gotoLogin()
                }
            })
        }
    })
})
export default router
